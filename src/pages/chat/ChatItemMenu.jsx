// src/components/chat/ChatItemMenu.jsx
import React from "react";

/** Dropdown menu shown on a chat list item's kebab button. */
const ChatItemMenu = ({ options, onOptionSelect }) => {
  return (
    <div
      style={{
        position: "absolute",
        right: 12,
        top: 42,
        zIndex: 20,
        width: 150,
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
        padding: 6,
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {options.map((option) => (
        <button
          key={option}
          className="chat-menu-option"
          style={{
            display: "block",
            width: "100%",
            border: 0,
            background: "transparent",
            textAlign: "left",
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            color: option.includes("Delete") ? "#DC2626" : "#374151",
            cursor: "pointer",
          }}
          onClick={() => onOptionSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ChatItemMenu;