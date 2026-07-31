// src/components/chat/ChatSearch.jsx
import React from "react";
import { SearchIcon } from "./icons";

const ChatSearch = ({ value, onChange, placeholder = "Search" }) => {
  return (
    <div className="search-wrap">
      <div className="search-inner">
        <span style={{ color: "#9CA3AF", display: "flex" }}>
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChatSearch;