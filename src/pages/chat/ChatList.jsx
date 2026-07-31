// src/components/chat/ChatList.jsx
import React from "react";
import { SIDEBAR_SECTIONS, getChatItemOptions } from "../../utils/constants";
import ChatTabs from "./ChatTabs";
import ChatSearch from "./ChatSearch";
import ChatListItem from "./ChatListItem";

const ChatList = ({
  isMobile,
  isTablet,
  listWidth,
  activeSidebar,
  onSidebarChange,
  activeTab,
  onTabChange,
  groupCount,
  indvCount,
  searchQuery,
  onSearchChange,
  currentList,
  selectedId,
  onSelectChat,
  chatItemMenuId,
  onToggleChatItemMenu,
  onSelectChatItemOption,
  emptyMessage,
}) => {
  const chatItemOptions = getChatItemOptions(activeSidebar, activeTab);
  const searchPlaceholder =
    activeSidebar === "Global" && activeTab === "Individuals"
      ? "Search by student ID..."
      : "Search";

  return (
    <div className="list-panel" style={{ width: listWidth }}>
      {isMobile && (
        <div className="mobile-nav">
          {SIDEBAR_SECTIONS.map((item) => (
            <button
              key={item}
              className={`mobile-nav-btn ${activeSidebar === item ? "active" : "inactive"}`}
              onClick={() => onSidebarChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {isTablet && (
        <div className="tablet-nav">
          {SIDEBAR_SECTIONS.map((item) => (
            <button
              key={item}
              className={`tablet-nav-btn ${activeSidebar === item ? "active" : "inactive"}`}
              onClick={() => onSidebarChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <ChatTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        groupCount={groupCount}
        indvCount={indvCount}
      />

      <ChatSearch value={searchQuery} onChange={onSearchChange} placeholder={searchPlaceholder} />

      <div className="chat-list">
        {currentList.length > 0 ? (
          currentList.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={selectedId === chat.id}
              isMenuOpen={chatItemMenuId === chat.id}
              options={chatItemOptions}
              onSelect={onSelectChat}
              onToggleMenu={onToggleChatItemMenu}
              onOptionSelect={onSelectChatItemOption}
            />
          ))
        ) : (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#9CA3AF",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            {emptyMessage || `No ${activeTab} in ${activeSidebar}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;