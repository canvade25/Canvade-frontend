// src/components/chat/MessageBubble.jsx
import React from "react";
import { FileText, Download } from "lucide-react";
import { MoreVerticalIcon } from "./icons";
import MessageMenu from "./MessageMenu";
import { MESSAGE_OPTIONS } from "../../utils/constants";

const MessageBubble = ({
  message,
  isMenuOpen,
  onToggleMenu,
  onOptionSelect,
  replyPreviewText,
  selectMode,
  isSelected,
  onToggleSelect,
}) => {
  const align = message.type === "sent" ? "right" : "left";
  const isDeleted = !!message.deleted;

  // Deleted or received messages can't be edited; deleted messages can't be
  // deleted again either. Filtering matches the actual option labels in
  // MESSAGE_OPTIONS ("Delete Chat"), not a nonexistent "Delete Message" label.
  const options = MESSAGE_OPTIONS.filter((option) => {
    if (isDeleted) return option !== "Edit" && option !== "Delete Chat";
    if (message.type !== "sent") return option !== "Edit";
    return true;
  });

  return (
    <div
      className={`msg-row ${message.type}`}
      onClick={selectMode ? onToggleSelect : undefined}
      style={selectMode ? { cursor: "pointer" } : undefined}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          flexDirection: message.type === "sent" ? "row-reverse" : "row",
          position: "relative",
        }}
      >
        {selectMode && (
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: `2px solid ${isSelected ? "#10B981" : "#D1D5DB"}`,
              background: isSelected ? "#10B981" : "transparent",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {isSelected ? "✓" : ""}
          </span>
        )}

        <div className={`message-content ${message.type}`}>
          {replyPreviewText && !isDeleted && (
            <div
              style={{
                fontSize: 11,
                color: "#6B7280",
                background: "rgba(0,0,0,0.05)",
                borderLeft: "3px solid #10B981",
                borderRadius: 6,
                padding: "4px 8px",
                marginBottom: 3,
                maxWidth: 220,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {replyPreviewText}
            </div>
          )}

          <div
            className={`bubble ${message.type}`}
            style={{
              whiteSpace: "pre-wrap",
              fontStyle: isDeleted ? "italic" : "normal",
              opacity: isDeleted ? 0.6 : 1,
            }}
          >
            {!isDeleted && message.attachment && message.attachmentType === "image" && (
              <a
                href={message.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", marginBottom: message.text ? 6 : 0 }}
              >
                <img
                  src={message.attachment.url}
                  alt={message.attachment.name || "Image attachment"}
                  style={{
                    maxWidth: 220,
                    maxHeight: 220,
                    borderRadius: 10,
                    display: "block",
                    objectFit: "cover",
                  }}
                />
              </a>
            )}

            {!isDeleted && message.attachment && message.attachmentType === "document" && (
              <a
                href={message.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: "rgba(0,0,0,0.05)",
                  marginBottom: message.text ? 6 : 0,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <FileText size={18} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {message.attachment.name || "Document"}
                </span>
                <Download size={14} style={{ flexShrink: 0, marginLeft: "auto" }} />
              </a>
            )}

            {isDeleted ? "This message was deleted" : message.text}
          </div>
        </div>

        {!selectMode && (
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              className="icon-btn message-kebab"
              style={{ width: 18, height: 18, opacity: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu();
              }}
              aria-label="Message options"
            >
              <MoreVerticalIcon />
            </button>
            {isMenuOpen && (
              <MessageMenu options={options} align={align} onOptionSelect={onOptionSelect} />
            )}
          </div>
        )}
      </div>
      <div className="msg-time">Today {message.time}</div>
    </div>
  );
};

export default MessageBubble;
