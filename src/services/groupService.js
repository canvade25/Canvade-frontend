// src/services/groupService.js
//
// Group chat API calls, plus the Firestore realtime group-message listener.
// Firestore/axios access is kept in here — components only ever call these
// functions, never the SDKs directly (mirrors chatService.js for 1:1 chat).

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import api from "../../api/axios";
import { db } from "../firebase";
import { formatMessageTimestamp, formatRelativeTime } from "../utils/formatTime";

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

/** Groups the current user (institute owner or student member) belongs to. */
export const getGroups = async () => {
  try {
    const response = await api.get("/api/chat/group/list");
    return response.data;
  } catch (error) {
    console.error("getGroups error:", error);
    throw error;
  }
};

/** A single group's info (requires the current user to be a member). */
export const getGroupById = async (groupId) => {
  try {
    const response = await api.get(`/api/chat/group/${groupId}`);
    return response.data;
  } catch (error) {
    console.error("getGroupById error:", error);
    throw error;
  }
};

/** Public, active groups the current user hasn't joined yet — powers the
 * "Global" tab so students can discover groups to request to join. */
export const getGlobalGroups = async () => {
  try {
    const response = await api.get("/api/chat/group/global");
    return response.data;
  } catch (error) {
    console.error("getGlobalGroups error:", error);
    throw error;
  }
};

/** Shapes a group (from getGroups/getGroupById) into the chat-item shape
 * ChatList/ChatListItem/ChatHeader already render for 1:1 conversations. */
export const mapGroupToChatItem = (group) => {
  const { color, textColor } = getAvatarColors(group.groupId || group.groupName);
  const memberCount = group.memberCount || 0;

  return {
    id: group.groupId,
    groupId: group.groupId,
    isGroup: true,
    name: group.groupName || "Unnamed Group",
    photo: group.photo || "",
    msg: group.lastMessage || "No messages yet",
    time: formatRelativeTime(group.lastMessageTime),
    active: memberCount ? `${memberCount} member${memberCount === 1 ? "" : "s"}` : "",
    color,
    textColor,
    courseId: group.courseId || null,
    memberCount,
    messages: [],
  };
};

/** Send a message into a group. The backend writes to Firestore; the
 * onSnapshot listener (see subscribeToGroupMessages) reflects it — callers
 * should not push the sent message into state themselves. */
export const sendGroupMessage = async ({
  groupId,
  text,
  type = "text",
  replyTo = null,
  attachment = null,
}) => {
  try {
    const response = await api.post("/api/chat/group/message/send", {
      groupId,
      text,
      type,
      replyTo,
      attachment,
    });
    return response.data;
  } catch (error) {
    console.error("sendGroupMessage error:", error);
    throw error;
  }
};

/** Edit a group message the current user sent. */
export const editGroupMessage = async (messageId, { groupId, text }) => {
  try {
    const response = await api.patch(`/api/chat/group/message/edit/${messageId}`, {
      groupId,
      text,
    });
    return response.data;
  } catch (error) {
    console.error("editGroupMessage error:", error);
    throw error;
  }
};

/** Soft-delete a group message the current user sent. */
export const deleteGroupMessage = async (messageId, groupId) => {
  try {
    const response = await api.delete(`/api/chat/group/message/delete/${messageId}`, {
      data: { groupId },
    });
    return response.data;
  } catch (error) {
    console.error("deleteGroupMessage error:", error);
    throw error;
  }
};

/** Mark every message in a group as seen by the current user. */
export const markGroupMessagesAsSeen = async (groupId) => {
  try {
    const response = await api.patch(`/api/chat/group/message/seen/${groupId}`);
    return response.data;
  } catch (error) {
    console.error("markGroupMessagesAsSeen error:", error);
    throw error;
  }
};

/**
 * Subscribes to a group's `messages` subcollection in realtime. Calls
 * `onChange(rawMessages)` on every add/edit/delete — no polling. Returns
 * the Firestore unsubscribe function; callers must invoke it on cleanup
 * (group change / component unmount). There is no REST endpoint for the
 * initial message list — the first onSnapshot callback already contains
 * every existing document, so no separate initial fetch is needed.
 */
export const subscribeToGroupMessages = (groupId, onChange, onError) => {
  const messagesQuery = query(
    collection(db, "groups", groupId, "messages"),
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

/** Shapes a raw Firestore group-message doc into the shape MessageBubble expects. */
export const mapGroupMessageToBubble = (message, currentUid) => ({
  id: message.messageId,
  text: message.deleted ? "This message was deleted" : message.text || "",
  type: message.senderId === currentUid ? "sent" : "received",
  time: formatMessageTimestamp(message.createdAt),
  edited: Boolean(message.edited),
  deleted: Boolean(message.deleted),
  replyTo: message.replyTo || null,
  senderId: message.senderId || null,
});

/** Institute creates a new group, optionally attached to a course. */
export const createGroup = async ({
  groupName,
  description = "",
  courseId = null,
  privacy = "private",
  photo = "",
}) => {
  try {
    const response = await api.post("/api/chat/group/create", {
      groupName,
      description,
      courseId,
      privacy,
      photo,
    });
    return response.data;
  } catch (error) {
    console.error("createGroup error:", error);
    throw error;
  }
};

/** Student sends a request to join a group. */
export const sendGroupJoinRequest = async (groupId) => {
  try {
    const response = await api.post("/api/chat/group/request/send", { groupId });
    return response.data;
  } catch (error) {
    console.error("sendGroupJoinRequest error:", error);
    throw error;
  }
};

/** Group-join requests received by the current user's institute (pending, awaiting Accept/Reject). */
export const getReceivedGroupRequests = async () => {
  try {
    const response = await api.get("/api/chat/group/request/received");
    return response.data;
  } catch (error) {
    console.error("getReceivedGroupRequests error:", error);
    throw error;
  }
};

/** Group-join requests the current student has sent out (pending, cancellable). */
export const getSentGroupRequests = async () => {
  try {
    const response = await api.get("/api/chat/group/request/sent");
    return response.data;
  } catch (error) {
    console.error("getSentGroupRequests error:", error);
    throw error;
  }
};

/** Institute accepts a pending join request — backend adds the student as a member. */
export const acceptGroupRequest = async (requestId) => {
  try {
    const response = await api.patch(`/api/chat/group/request/accept/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("acceptGroupRequest error:", error);
    throw error;
  }
};

/** Institute rejects a pending join request. */
export const rejectGroupRequest = async (requestId) => {
  try {
    const response = await api.patch(`/api/chat/group/request/reject/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("rejectGroupRequest error:", error);
    throw error;
  }
};

/** Student cancels a join request they sent. */
export const cancelGroupRequest = async (requestId) => {
  try {
    const response = await api.delete(`/api/chat/group/request/cancel/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("cancelGroupRequest error:", error);
    throw error;
  }
};

/**
 * Shapes a "received" group join request (from getReceivedGroupRequests)
 * into the chat-item shape ChatList/ChatListItem/ChatMessages already
 * expect — mirrors requestService.mapReceivedRequestToChatItem for 1:1
 * chat requests.
 */
export const mapReceivedGroupRequestToChatItem = (request) => {
  const studentName = request.student?.name || request.student?.studentId || "Unknown Student";
  const groupName = request.group?.groupName || "Unknown Group";
  const time = formatRelativeTime(request.createdAt);
  const { color, textColor } = getAvatarColors(request.group?.groupId || groupName);

  return {
    id: request.requestId,
    requestId: request.requestId,
    groupId: request.group?.groupId || null,
    isGroup: true,
    direction: "received",
    name: groupName,
    msg: `${studentName} wants to join this group`,
    time,
    active: "Pending",
    color,
    textColor,
    courseId: null,
    messages: [
      {
        id: 1,
        text: `${studentName} requested to join "${groupName}".`,
        type: "received",
        time,
      },
    ],
  };
};

/**
 * Shapes a "sent" group join request (from getSentGroupRequests) into the
 * same chat-item shape used by mapReceivedGroupRequestToChatItem.
 */
export const mapSentGroupRequestToChatItem = (request) => {
  const groupName = request.group?.groupName || "Unknown Group";
  const time = formatRelativeTime(request.createdAt);
  const { color, textColor } = getAvatarColors(request.groupId || groupName);

  return {
    id: request.requestId,
    requestId: request.requestId,
    groupId: request.groupId || request.group?.groupId || null,
    isGroup: true,
    direction: "sent",
    name: groupName,
    msg: "Join request sent — waiting for approval",
    time,
    active: "Sent",
    color,
    textColor,
    courseId: null,
    messages: [
      {
        id: 1,
        text: `You requested to join "${groupName}".`,
        type: "sent",
        time,
      },
    ],
  };
};

/** Institute invites a student into a group. */
export const inviteStudentToGroup = async (_groupId, _studentId) => {
  // TODO: Firestore integration
  throw new Error("inviteStudentToGroup is not implemented yet.");
};

/** Student accepts a group invitation. */
export const acceptGroupInvitation = async (_studentId, _invitationId) => {
  // TODO: Firestore integration
  throw new Error("acceptGroupInvitation is not implemented yet.");
};

/** Student rejects a group invitation. */
export const rejectGroupInvitation = async (_studentId, _invitationId) => {
  // TODO: Firestore integration
  throw new Error("rejectGroupInvitation is not implemented yet.");
};

/** Student leaves a group they've joined. */
export const leaveGroup = async (_studentId, _groupId) => {
  // TODO: Firestore integration
  throw new Error("leaveGroup is not implemented yet.");
};