// src/services/chatService.js
//
// Conversation + message API calls, plus the Firestore realtime message
// listener. Firestore/axios access is kept in here — components only ever
// call these functions, never the SDKs directly.

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import api from "../../api/axios";
import { db } from "../firebase";
import { formatMessageTimestamp, formatRelativeTime, getNow } from "../utils/formatTime";

/** Flatten all chats/groups across every sidebar section and tab. */
export const getAllChats = (chatData) =>
  Object.values(chatData).flatMap((section) => Object.values(section).flat());

/** Find a single chat/group by id across all sections. */
export const getChatById = (chatData, id) =>
  getAllChats(chatData).find((c) => c.id === id) || null;

/** Get the list for a given section/tab, optionally filtered by search query. */
export const getListForSection = (chatData, section, tab, searchQuery = "") => {
  const list = chatData?.[section]?.[tab] || [];
  if (!searchQuery) return list;
  const q = searchQuery.toLowerCase();
  return list.filter(
    (c) => c.name.toLowerCase().includes(q) || c.msg.toLowerCase().includes(q),
  );
};

/** Build a new outgoing message object (mock/local chats only). */
export const createMessage = (text) => ({
  id: Date.now(),
  text: text.trim(),
  type: "sent",
  time: getNow(),
});

/**
 * Returns a new chatData object with `message` appended to the chat/group
 * identified by `chatId`, and its preview `msg`/`time` updated. Only used
 * as a local fallback for mock chats (Groups/Global) that aren't backed by
 * a real conversation yet — real conversations are updated via the
 * Firestore listener, never by pushing into state directly.
 */
export const appendMessageToChat = (chatData, chatId, message) => {
  const updated = JSON.parse(JSON.stringify(chatData));
  for (const section of Object.keys(updated)) {
    for (const tab of Object.keys(updated[section])) {
      const idx = updated[section][tab].findIndex((c) => c.id === chatId);
      if (idx !== -1) {
        updated[section][tab][idx].messages.push(message);
        updated[section][tab][idx].msg = message.text;
        updated[section][tab][idx].time = "Just now";
      }
    }
  }
  return updated;
};

/**
 * Exchanges the current backend session for a Firebase custom token, so the
 * client can sign into Firebase Auth and satisfy Firestore security rules
 * for realtime listeners (regular login only sets the backend's own JWT,
 * it never establishes a Firebase Auth session on its own).
 */
export const getFirebaseCustomToken = async () => {
  try {
    const response = await api.get("/api/auth/firebase-token");
    return response.data;
  } catch (error) {
    console.error("getFirebaseCustomToken error:", error);
    throw error;
  }
};

/** Current user's conversations. */
export const getConversations = async () => {
  try {
    const response = await api.get("/api/chat/conversations");
    return response.data;
  } catch (error) {
    console.error("getConversations error:", error);
    throw error;
  }
};

/**
 * A single conversation plus its most recent messages (REST — used for the initial load).
 * Response shape:
 * {
 *   data: {
 *     conversation: { ..., unreadCount: <number> },  // only current user's count
 *     messages: [...],
 *     pagination: { returned, hasMore, nextCursor }
 *   }
 * }
 * Pass `before` (a messageId) to fetch older messages for pagination.
 */
export const getConversationById = async (conversationId, { before = null, limit = 50 } = {}) => {
  try {
    const params = new URLSearchParams();
    if (before) params.set("before", before);
    if (limit !== 50) params.set("limit", String(limit));
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get(`/api/chat/conversation/${conversationId}${query}`);
    return response.data;
  } catch (error) {
    console.error("getConversationById error:", error);
    throw error;
  }
};

/** Send a message into a conversation. The backend writes to Firestore; the
 * onSnapshot listener (see subscribeToConversationMessages) reflects it —
 * callers should not push the sent message into state themselves.
 * Pass `file` (a File object) to send an image/document attachment — the
 * backend uploads it and infers `type` ("image"/"document") automatically. */
export const sendMessage = async ({
  conversationId,
  text = "",
  type = "text",
  replyTo = null,
  file = null,
}) => {
  try {
    if (file) {
      const formData = new FormData();
      formData.append("conversationId", conversationId);
      formData.append("text", text || "");
      if (replyTo) formData.append("replyTo", replyTo);
      formData.append("file", file);
      const response = await api.post("/api/chat/message/send", formData);
      return response.data;
    }

    const response = await api.post("/api/chat/message/send", {
      conversationId,
      text,
      type,
      replyTo,
      attachment: null,
    });
    return response.data;
  } catch (error) {
    console.error("sendMessage error:", error);
    throw error;
  }
};

/** Deletes a conversation for the current user only (the other member still sees it). */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await api.delete(`/api/chat/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("deleteConversation error:", error);
    throw error;
  }
};

/**
 * Clears the chat for the current user. The backend stores a `clearedAt`
 * timestamp instead of deleting messages — the messages still exist in
 * Firestore but the client filters them out. Use `filterClearedMessages`
 * to apply the filter before rendering.
 */
export const clearConversation = async (conversationId) => {
  try {
    const response = await api.post(`/api/chat/conversation/${conversationId}/clear`);
    return response.data;
  } catch (error) {
    console.error("clearConversation error:", error);
    throw error;
  }
};

/**
 * Filters out messages that existed before the user cleared the chat.
 * `clearedAt` is a Firestore Timestamp or a plain seconds/millis value
 * returned by the server. Returns all messages if no clearedAt is set.
 */
export const filterClearedMessages = (messages, clearedAt) => {
  if (!clearedAt) return messages;

  // Normalize to milliseconds — handles Firestore Timestamp objects,
  // { seconds, nanoseconds } shapes, and plain numeric values.
  let clearedMs;
  if (typeof clearedAt?.toMillis === "function") {
    clearedMs = clearedAt.toMillis();
  } else if (clearedAt?.seconds !== undefined) {
    clearedMs = clearedAt.seconds * 1000;
  } else {
    clearedMs = Number(clearedAt);
  }

  return messages.filter((msg) => {
    const createdAt = msg.createdAt;
    if (!createdAt) return true; // keep messages without a timestamp (shouldn't happen)

    let msgMs;
    if (typeof createdAt?.toMillis === "function") {
      msgMs = createdAt.toMillis();
    } else if (createdAt?.seconds !== undefined) {
      msgMs = createdAt.seconds * 1000;
    } else {
      msgMs = Number(createdAt);
    }

    return msgMs > clearedMs;
  });
};

/** Blocks a user — they will no longer be able to message the current user. */
export const blockUser = async (uid) => {
  try {
    const response = await api.post(`/api/chat/block/${uid}`);
    return response.data;
  } catch (error) {
    console.error("blockUser error:", error);
    throw error;
  }
};

/** Unblocks a previously blocked user. */
export const unblockUser = async (uid) => {
  try {
    const response = await api.delete(`/api/chat/block/${uid}`);
    return response.data;
  } catch (error) {
    console.error("unblockUser error:", error);
    throw error;
  }
};

/** Get list of blocked users. */
export const getBlockedUsers = async () => {
  try {
    const response = await api.get("/api/chat/block");
    return response.data;
  } catch (error) {
    console.error("getBlockedUsers error:", error);
    throw error;
  }
};

/** Edit an existing message the current user sent. */
export const editMessage = async (messageId, { conversationId, text }) => {
  try {
    const response = await api.patch(`/api/chat/message/edit/${messageId}`, {
      conversationId,
      text,
    });
    return response.data;
  } catch (error) {
    console.error("editMessage error:", error);
    throw error;
  }
};

/** Soft-delete a message the current user sent (marks it deleted, clears its text). */
export const deleteMessage = async (messageId, conversationId) => {
  try {
    const response = await api.delete(`/api/chat/message/delete/${messageId}`, {
      data: { conversationId },
    });
    return response.data;
  } catch (error) {
    console.error("deleteMessage error:", error);
    throw error;
  }
};

/** Mark every message in a conversation as seen by the current user. */
export const markConversationAsSeen = async (conversationId) => {
  try {
    const response = await api.patch(`/api/chat/message/seen/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("markConversationAsSeen error:", error);
    throw error;
  }
};

/**
 * Subscribes to a conversation's `messages` subcollection in realtime.
 * Calls `onChange(rawMessages)` on every add/edit/delete — no polling.
 * Returns the Firestore unsubscribe function; callers must invoke it on
 * cleanup (conversation change / component unmount).
 */
export const subscribeToConversationMessages = (conversationId, onChange, onError) => {
  const messagesQuery = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc"),
  );
  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      onChange(snapshot.docs.map((doc) => ({ messageId: doc.id, ...doc.data() })));
    },
    onError,
  );
};

/** Shapes a raw Firestore/REST message doc into the shape MessageBubble expects. */
export const mapMessageToBubble = (message, currentUid) => ({
  id: message.messageId,
  text: message.deleted ? "This message was deleted" : message.text || "",
  type: message.senderId === currentUid ? "sent" : "received",
  time: formatMessageTimestamp(message.createdAt),
  edited: Boolean(message.edited),
  deleted: Boolean(message.deleted),
  replyTo: message.replyTo || null,
  attachment: message.deleted ? null : message.attachment || null,
  attachmentType: message.type === "image" || message.type === "document" ? message.type : null,
});

const AVATAR_PALETTE = [
  { color: "#D1FAE5", textColor: "#065F46" },
  { color: "#DBEAFE", textColor: "#1E40AF" },
  { color: "#FCE7F3", textColor: "#9D174D" },
  { color: "#F3E8FF", textColor: "#7E22CE" },
  { color: "#CFFAFE", textColor: "#155E75" },
  { color: "#E5E7EB", textColor: "#374151" },
];

const getAvatarColors = (seed = "") => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
};

/** Shapes a conversation (from getConversations) into the chat-item shape
 * ChatList/ChatListItem/ChatHeader already render. */
export const mapConversationToChatItem = (conversation) => {
  const participant = conversation.participant || {};
  const baseName =
    participant.name || participant.studentId || participant.instituteName || "Unknown User";
  const roleLabel =
    participant.role === "institute" ? "Institute" : participant.role === "student" ? "Student" : null;
  const name = roleLabel ? `${baseName} (${roleLabel})` : baseName;
  const { color, textColor } = getAvatarColors(participant.uid || conversation.conversationId);

  return {
    id: conversation.conversationId,
    conversationId: conversation.conversationId,
    participantUid: participant.uid || null,
    name,
    msg: conversation.lastMessage || "No messages yet",
    time: formatRelativeTime(conversation.lastMessageTime),
    active: "",
    color,
    textColor,
    courseId: null,
    unreadCount: conversation.unreadCount || 0,
    messages: [],
  };
};

/**
 * Reserved for future use: sends a direct query from a student to an
 * institute regarding a specific course.
 */
export const sendCourseQuery = async (_studentId, _instituteId, _courseId, _text) => {
  // TODO: not part of the supported chat API set yet.
  throw new Error("sendCourseQuery is not implemented yet.");
};
