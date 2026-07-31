// src/components/chat/EmojiPicker.jsx
import React from "react";
import { EMOJI_OPTIONS } from "../../utils/constants";

const EmojiPicker = ({ onSelect }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 42,
        zIndex: 30,
        width: 220,
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 4,
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        boxShadow: "0 16px 36px rgba(15, 23, 42, 0.14)",
        padding: 8,
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          style={{
            height: 32,
            border: 0,
            borderRadius: 8,
            background: "transparent",
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
          }}
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;