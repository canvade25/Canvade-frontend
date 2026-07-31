// src/components/chat/EmptyState.jsx
import React from "react";

const EmptyState = () => {
  return (
    <div className="empty-state">
      <div style={{ fontSize: 48, opacity: 0.2 }}>💬</div>
      <div>Select a chat to view messages</div>
    </div>
  );
};

export default EmptyState;