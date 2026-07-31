// src/components/chat/AttachmentMenu.jsx
import React from "react";
import { FileText, Image as ImageIcon } from "lucide-react";

const ATTACHMENT_OPTIONS = [
  { label: "Images", helper: "Max 10MB", icon: <ImageIcon size={16} /> },
  { label: "Document", helper: "Max 10MB", icon: <FileText size={16} /> },
];

const AttachmentMenu = ({ onSelect }) => {
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        bottom: 42,
        zIndex: 30,
        width: 190,
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        boxShadow: "0 16px 36px rgba(15, 23, 42, 0.14)",
        padding: 8,
      }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {ATTACHMENT_OPTIONS.map((option) => (
        <button
          key={option.label}
          className="chat-menu-option"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            border: 0,
            background: "transparent",
            textAlign: "left",
            padding: "9px 10px",
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 700,
            color: "#374151",
            cursor: "pointer",
          }}
          onClick={() => onSelect(option.label)}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "#ECFDF5",
              color: "#059669",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {option.icon}
          </span>
          <span style={{ display: "grid", gap: 1 }}>
            <span>{option.label}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF" }}>
              {option.helper}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default AttachmentMenu;