// src/components/chat/ChatListItem.jsx
import React from "react";
import { MoreVerticalIcon } from "./icons";
import ChatItemMenu from "./ChatItemMenu";

const ChatListItem = ({
  chat,
  isActive,
  isMenuOpen,
  options,
  onSelect,
  onToggleMenu,
  onOptionSelect,
}) => {
  const hasStatus = Boolean(chat.active);
  const unread = chat.unreadCount > 0;
  const activeCount = parseInt(chat.active, 10);
  const isZeroActive = !Number.isNaN(activeCount) && activeCount === 0;

  return (
    <div
      className={`chat-item ${isActive ? "active" : ""}`}
      style={{ position: "relative" }}
      onClick={() => onSelect(chat.id)}
    >
      <div
        className="chat-avatar"
        style={{
          background: chat.color,
          color: chat.textColor,
        }}
      >
        {chat.name.charAt(0)}
        {hasStatus && (
          <div
            className={`avatar-dot ${chat.active !== "Offline" ? "online" : "offline"}`}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#111827",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 155,
            }}
          >
            {chat.name}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: unread ? 700 : 400,
              color: unread ? "#10B981" : "#9CA3AF",
              flexShrink: 0,
            }}
          >
            {chat.time}
          </span>
          <button
            className="icon-btn chat-item-menu-btn"
            style={{ width: 26, height: 26, flexShrink: 0 }}
            onClick={(event) => {
              event.stopPropagation();
              onToggleMenu(chat.id);
            }}
            aria-label="Chat item options"
          >
            <MoreVerticalIcon />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: unread ? 600 : 400,
              color: unread ? "#374151" : "#6B7280",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              flex: 1,
              minWidth: 0,
            }}
          >
            {chat.msg}
          </div>
          {unread && (
            <span className="unread-badge">{chat.unreadCount > 99 ? "99+" : chat.unreadCount}</span>
          )}
        </div>
        {hasStatus && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              color: isZeroActive ? "#EF4444" : "#10B981",
              marginTop: 4,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: isZeroActive ? "#EF4444" : "#10B981",
                display: "inline-block",
              }}
            />
            {chat.active}
          </span>
        )}
      </div>
      {isMenuOpen && (
        <ChatItemMenu
          options={options}
          onOptionSelect={(option) => onOptionSelect(chat.id, option)}
        />
      )}
    </div>
  );
};

export default ChatListItem;
