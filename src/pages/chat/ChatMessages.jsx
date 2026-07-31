// src/components/chat/ChatMessages.jsx
import React, { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import RequestActions from "./RequestActions";
import MessageBubble from "./MessageBubble";
import {
  deleteMessage,
  filterClearedMessages,
  getConversationById,
  mapMessageToBubble,
  subscribeToConversationMessages,
} from "../../services/chatService";
import {
  deleteGroupMessage,
  mapGroupMessageToBubble,
  subscribeToGroupMessages,
} from "../../services/groupService";
import { auth } from "../../firebase";
import { showError } from "../../utils/toast";

const REQUEST_ACTIONS_BY_DIRECTION = {
  received: ["Accept", "Reject"],
  sent: ["Cancel"],
};

const ChatMessages = ({
  activeSidebar,
  chat,
  messages,
  currentUid,
  messageMenuKey,
  onToggleMessageMenu,
  onSelectMessageOption,
  messagesEndRef,
  onRequestAction,
  requestActionLoading,
  onEnterSelectMode,
  dateLabel = "",
  clearedAt = null,
}) => {
  const chatId = chat?.id;
  const conversationId = chat?.conversationId;
  // Excludes group-request chat items (isGroup + requestId): those are a
  // pending join request, not a joined group — show the static request
  // message instead of subscribing to a group's live feed.
  const groupId = chat?.isGroup && !chat?.requestId ? chat?.groupId : null;
  const requestActions = chat?.direction && REQUEST_ACTIONS_BY_DIRECTION[chat.direction];

  const [liveMessages, setLiveMessages] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // Selection is per-conversation/group — drop it when switching chats.
  useEffect(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, [conversationId, groupId]);

  // Firestore realtime listener for real conversations and groups. Mock/request
  // threads (no conversationId/groupId) just render the static `messages` prop.
  useEffect(() => {
    if (!conversationId && !groupId) {
      setLiveMessages([]);
      return undefined;
    }

    let cancelled = false;
    let unsubscribeMessages = null;

    // Conversations have a REST endpoint for the initial message list;
    // groups don't — their onSnapshot's first callback already contains
    // every existing message, so no separate initial fetch is needed there.
    if (conversationId) {
      getConversationById(conversationId)
        .then((res) => {
          if (cancelled) return;
          const initial = (res?.data?.messages || []).map((m) =>
            mapMessageToBubble(m, currentUid),
          );
          setLiveMessages(initial);
        })
        .catch((error) => {
          console.error("Load conversation messages error:", error);
        });
    }

    // Wait for Firebase Auth to actually confirm a session before attaching
    // the listener — attaching too early (before the custom-token sign-in
    // in ChatPage resolves) gets permission-denied and never retries on its
    // own once auth becomes ready.
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeMessages) {
        unsubscribeMessages();
        unsubscribeMessages = null;
      }
      if (!user || cancelled) return;

      const handleMessages = (rawMessages) => {
        if (cancelled) return;
        const mapper = groupId ? mapGroupMessageToBubble : mapMessageToBubble;
        setLiveMessages(rawMessages.map((m) => mapper(m, currentUid)));
      };
      const handleError = (error) => {
        console.error("Realtime messages listener error:", error);
        showError(`Live chat updates unavailable: ${error.code || error.message}`);
      };

      unsubscribeMessages = conversationId
        ? subscribeToConversationMessages(conversationId, handleMessages, handleError)
        : subscribeToGroupMessages(groupId, handleMessages, handleError);
    });

    return () => {
      cancelled = true;
      unsubscribeAuth();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [conversationId, groupId, currentUid]);

  const displayedMessages = conversationId || groupId
    ? filterClearedMessages(liveMessages, clearedAt)
    : messages;

  // "Select" is handled entirely here (this component already owns the
  // message list) — only the other options bubble up to ChatPage.
  const handleMessageOptionSelect = (messageKey, msg, option) => {
    if (option === "Select") {
      setSelectMode(true);
      setSelectedIds(new Set([msg.id]));
      onEnterSelectMode?.();
      return;
    }
    onSelectMessageOption(messageKey, msg, option);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCancelSelect = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    const deletable = displayedMessages.filter(
      (m) => selectedIds.has(m.id) && m.type === "sent" && !m.deleted,
    );
    const skipped = selectedIds.size - deletable.length;

    if (!deletable.length) {
      handleCancelSelect();
      return;
    }
    if (!window.confirm(`Delete ${deletable.length} message(s)?`)) return;

    try {
      await Promise.all(
        deletable.map((m) =>
          conversationId
            ? deleteMessage(m.id, conversationId)
            : deleteGroupMessage(m.id, groupId),
        ),
      );
      if (skipped > 0) {
        showError(`Skipped ${skipped} message(s) you don't own.`);
      }
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to delete messages.",
      );
    } finally {
      handleCancelSelect();
    }
  };

  return (
    <div className="chat-messages">
      {activeSidebar === "Requests" && (
        <RequestActions
          actions={requestActions}
          loading={Boolean(chat?.requestId) && requestActionLoading === chat.requestId}
          onAction={(action) => onRequestAction?.(action, chat)}
        />
      )}

      {selectMode && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 4px",
            marginBottom: 8,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>
            {selectedIds.size} selected
          </span>
          <div style={{ display: "flex", gap: 14 }}>
            <button
              type="button"
              onClick={handleDeleteSelected}
              style={{
                border: "none",
                background: "transparent",
                color: "#DC2626",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleCancelSelect}
              style={{
                border: "none",
                background: "transparent",
                color: "#6B7280",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="date-divider">
        <div className="date-divider-line" />
        <div className="date-chip">
          <CalendarDays size={14} />
          {dateLabel}
        </div>
        <div className="date-divider-line" />
      </div>

      {displayedMessages.map((msg, i) => {
        const messageKey = `${chatId}-${msg.id || i}`;
        const replyPreviewText = msg.replyTo
          ? displayedMessages.find((m) => m.id === msg.replyTo)?.text || "Original message"
          : null;
        return (
          <MessageBubble
            key={msg.id || i}
            message={msg}
            isMenuOpen={messageMenuKey === messageKey}
            onToggleMenu={() => onToggleMessageMenu(messageKey)}
            onOptionSelect={(option) => handleMessageOptionSelect(messageKey, msg, option)}
            replyPreviewText={replyPreviewText}
            selectMode={selectMode}
            isSelected={selectedIds.has(msg.id)}
            onToggleSelect={() => handleToggleSelect(msg.id)}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
