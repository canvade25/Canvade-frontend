// src/components/chat/HeaderMenu.jsx
import React from "react";

const DANGER_OPTIONS = ["Delete Conversation", "Leave Group", "Block", "Unblock"];

/** Dropdown menu shown on the chat header's kebab button (profile options). */
const HeaderMenu = ({ options, onOptionSelect }) => {
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 38,
        zIndex: 30,
        width: 210,
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
            color: DANGER_OPTIONS.includes(option) ? "#DC2626" : "#374151",
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

export default HeaderMenu;