// src/components/chat/ChatHeader.jsx
import React from "react";
import { BackIcon, MoreVerticalIcon } from "./icons";
import HeaderMenu from "./HeaderMenu";
import { getProfileOptions } from "../../utils/constants";

const ChatHeader = ({
  chat,
  isDesktop,
  activeTab,
  menuOpen,
  onBack,
  onToggleMenu,
  onOptionSelect,
}) => {
  const profileOptions = getProfileOptions(activeTab);

  return (
    <div className="chat-header">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {!isDesktop && (
          <button className="icon-btn" onClick={onBack}>
            <BackIcon />
          </button>
        )}
        <div
          className="chat-avatar"
          style={{
            width: 40,
            height: 40,
            fontSize: 15,
            background: chat.color,
            color: chat.textColor,
          }}
        >
          {chat.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>
            {chat.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#10B981",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#10B981",
                display: "inline-block",
              }}
            />
            Online
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <button
          className="icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
        >
          <MoreVerticalIcon />
        </button>
        {menuOpen && (
          <HeaderMenu options={profileOptions} onOptionSelect={onOptionSelect} />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;