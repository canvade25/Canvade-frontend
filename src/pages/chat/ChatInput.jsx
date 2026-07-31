// src/components/chat/ChatInput.jsx
import React, { useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { SmileIcon, PlusIcon, SendIcon } from "./icons";
import AttachmentMenu from "./AttachmentMenu";

const ChatInput = ({
  value,
  onChange,
  onKeyDown,
  onSend,
  emojiMenuOpen,
  onToggleEmojiMenu,
  onEmojiSelect,
  attachmentMenuOpen,
  onToggleAttachmentMenu,
  onAttachmentSelect,
  onFileSelected,
}) => {
  const fileInputRef = useRef(null);
  const [acceptType, setAcceptType] = useState("*/*");

  const handleAttachmentOptionSelect = (label) => {
    setAcceptType(
      label === "Images"
        ? "image/*"
        : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv",
    );
    onAttachmentSelect?.(label);
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onFileSelected?.(file);
  };

  return (
    <div className="chat-input-wrap">
      <div className="chat-input-inner">
        <div style={{ position: "relative" }}>
          <button
            className="icon-btn"
            onClick={(event) => {
              event.stopPropagation();
              onToggleEmojiMenu();
            }}
            aria-label="Emoji options"
          >
            <SmileIcon />
          </button>
          {emojiMenuOpen && (
            <div style={{ position: "absolute", bottom: "100%", left: 0, zIndex: 10, marginBottom: '8px' }}>
              <Picker onEmojiClick={onEmojiSelect} />
            </div>
          )}
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Send your message..."
        />

        <div style={{ position: "relative" }}>
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAttachmentMenu();
            }}
            aria-label="Attachment options"
          >
            <PlusIcon />
          </button>
          {attachmentMenuOpen && <AttachmentMenu onSelect={handleAttachmentOptionSelect} />}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept={acceptType}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        <button className="send-btn" onClick={onSend}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;