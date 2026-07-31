// src/components/chat/ChatTabs.jsx
import React from "react";
import { CHAT_TABS } from "../../utils/constants";

const ChatTabs = ({ activeTab, onTabChange, groupCount, indvCount }) => {
  return (
    <div className="tabs-row">
      {CHAT_TABS.map((tab) => {
        const count = tab === "Groups" ? groupCount : indvCount;
        return (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : "inactive"}`}
            onClick={() => onTabChange(tab)}
          >
            <span>
              {tab}
              <span className="tab-btn-count"> ({count})</span>
            </span>
            {count > 0 && <span className="tab-dot" />}
            {activeTab === tab && <div className="tab-underline" />}
          </button>
        );
      })}
    </div>
  );
};

export default ChatTabs;