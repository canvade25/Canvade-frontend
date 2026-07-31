// src/components/chat/ChatSidebar.jsx
import React, { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { SIDEBAR_SECTIONS } from "../../utils/constants";

const INSTITUTE_ROLES = ["institute", "admin", "educator"];

/**
 * Desktop-only vertical sidebar for switching between Global / Joined / Requests.
 * Rendered by ChatPage only when isDesktop is true.
 */
const ChatSidebar = ({
  activeSidebar,
  onSidebarChange,
  addStudentOpen,
  onToggleAddStudent,
  onSendChatRequest,
  sectionCounts = {},
  joinedHasUnread = false,
  userRole = "",
  createGroupOpen = false,
  onToggleCreateGroup,
  onCreateGroup,
}) => {
  const [uidInput, setUidInput] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "error" | "success", text }

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupFeedback, setGroupFeedback] = useState(null);

  const isInstitute = INSTITUTE_ROLES.includes(String(userRole).toLowerCase());

  const handleToggleAddStudent = (event) => {
    event.stopPropagation();
    setFeedback(null);
    onToggleAddStudent();
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const uid = uidInput.trim();
    if (!uid || sending) return;

    setSending(true);
    setFeedback(null);
    try {
      const res = await onSendChatRequest(uid);
      setFeedback({ type: "success", text: res?.message || "Chat request sent." });
      setUidInput("");
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to send request.";
      setFeedback({ type: "error", text: message });
    } finally {
      setSending(false);
    }
  };

  const handleToggleCreateGroup = (event) => {
    event.stopPropagation();
    setGroupFeedback(null);
    onToggleCreateGroup();
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    const name = groupName.trim();
    if (!name || creatingGroup) return;

    setCreatingGroup(true);
    setGroupFeedback(null);
    try {
      await onCreateGroup(name, groupDescription.trim());
      setGroupFeedback({ type: "success", text: "Group created." });
      setGroupName("");
      setGroupDescription("");
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to create group.";
      setGroupFeedback({ type: "error", text: message });
    } finally {
      setCreatingGroup(false);
    }
  };

  return (
    <div className="sidebar">
      {SIDEBAR_SECTIONS.map((item) => {
        const count = sectionCounts[item] || 0;
        const showCount = item !== "Global" && count > 0;
        const showDot = item === "Joined" ? joinedHasUnread : count > 0;

        return (
          <button
            key={item}
            className={`sidebar-btn ${activeSidebar === item ? "active" : "inactive"}`}
            onClick={() => onSidebarChange(item)}
          >
            <span className="sidebar-btn-label">
              {item}
              {showCount && <span className="sidebar-btn-count"> ({count})</span>}
            </span>
            {showDot && <span className="sidebar-dot" />}
          </button>
        );
      })}

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {isInstitute && (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={handleToggleCreateGroup}
              aria-label="Create a new group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "#1D4ED8",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Users size={16} />
              Create Group
            </button>

            {createGroupOpen && (
              <div
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: "calc(100% + 8px)",
                  zIndex: 50,
                  width: 260,
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1F2937",
                    marginBottom: 8,
                  }}
                >
                  Create a group
                </div>
                <form onSubmit={handleCreateGroup}>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(event) => setGroupName(event.target.value)}
                    placeholder="Group name"
                    autoFocus
                    style={{
                      width: "100%",
                      border: "1px solid #E5E7EB",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 12,
                      marginBottom: 8,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <textarea
                    value={groupDescription}
                    onChange={(event) => setGroupDescription(event.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    style={{
                      width: "100%",
                      border: "1px solid #E5E7EB",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 12,
                      marginBottom: 8,
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "vertical",
                    }}
                  />
                  {groupFeedback && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        marginBottom: 8,
                        color: groupFeedback.type === "error" ? "#DC2626" : "#059669",
                      }}
                    >
                      {groupFeedback.text}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={!groupName.trim() || creatingGroup}
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      background:
                        !groupName.trim() || creatingGroup ? "#93C5FD" : "#1D4ED8",
                      cursor: !groupName.trim() || creatingGroup ? "not-allowed" : "pointer",
                    }}
                  >
                    {creatingGroup ? "Creating..." : "Create Group"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={handleToggleAddStudent}
            aria-label="Add student by UID"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              background: "#059669",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <UserPlus size={16} />
            talk to student
          </button>

          {addStudentOpen && (
            <div
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
              style={{
                position: "absolute",
                left: -10,
                bottom: "calc(100% + 8px)",
                zIndex: 50,
                width: 240,
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                // boxShadow: "0 16px 36px rgba(15, 23, 42, 0.14)",
                padding: 12,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1F2937",
                  marginBottom: 8,
                }}
              >
                Start a chat
              </div>
              <form onSubmit={handleSend}>
                <input
                  type="text"
                  value={uidInput}
                  onChange={(event) => setUidInput(event.target.value)}
                  placeholder="Enter student UID"
                  autoFocus
                  style={{
                    width: "100%",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    padding: "8px 10px",
                    fontSize: 12,
                    marginBottom: 8,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {feedback && (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      marginBottom: 8,
                      color: feedback.type === "error" ? "#DC2626" : "#059669",
                    }}
                  >
                    {feedback.text}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!uidInput.trim() || sending}
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    background: !uidInput.trim() || sending ? "#A7F3D0" : "#059669",
                    cursor: !uidInput.trim() || sending ? "not-allowed" : "pointer",
                  }}
                >
                  {sending ? "Sending..." : "Send Request"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;