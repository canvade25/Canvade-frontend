// src/components/chat/MessageMenu.jsx
import React from "react";

/** Dropdown menu shown on a message bubble's kebab button. */
const MessageMenu = ({ options, align, onOptionSelect }) => {
  return (
    <div
      style={{
        position: "absolute",
        [align]: 0,
        top: "calc(100% + 6px)",
        zIndex: 40,
        width: 160,
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        boxShadow: "0 16px 36px rgba(15, 23, 42, 0.14)",
        padding: 8,
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
            padding: "9px 10px",
            borderRadius: 9,
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

export default MessageMenu;