// src/components/chat/ChatSidebar.jsx
import React, { useState, useEffect } from "react";
import { UserPlus, Users, X } from "lucide-react";
import { SIDEBAR_SECTIONS } from "../../utils/constants";
import { searchStudentByStudentId } from "../../../api/userApi";

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
  const [memberSearchInput, setMemberSearchInput] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSearchResults, setMemberSearchResults] = useState([]);
  const [memberSearchLoading, setMemberSearchLoading] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [groupFeedback, setGroupFeedback] = useState(null);

  const isInstitute = INSTITUTE_ROLES.includes(String(userRole).toLowerCase());

  useEffect(() => {
    const query = memberSearchInput.trim();
    if (!query) {
      setMemberSearchResults([]);
      setMemberSearchLoading(false);
      return undefined;
    }

    let cancelled = false;
    setMemberSearchLoading(true);
    const timer = setTimeout(() => {
      searchStudentByStudentId(query)
        .then((res) => {
          if (!cancelled) {
            const results = (res?.data || []).filter(
              (student) => !selectedMembers.includes(student.uid),
            );
            setMemberSearchResults(results);
          }
        })
        .catch(() => {
          if (!cancelled) setMemberSearchResults([]);
        })
        .finally(() => {
          if (!cancelled) setMemberSearchLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [memberSearchInput, selectedMembers]);

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
      await onCreateGroup(name, groupDescription.trim(), selectedMembers);
      setGroupFeedback({ type: "success", text: "Group created." });
      setGroupName("");
      setGroupDescription("");
      setMemberSearchInput("");
      setSelectedMembers([]);
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to create group.";
      setGroupFeedback({ type: "error", text: message });
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleSelectMember = (memberUid) => {
    setSelectedMembers((prev) => {
      if (prev.includes(memberUid)) return prev;
      return [...prev, memberUid];
    });
    setMemberSearchInput("");
    setMemberSearchResults([]);
  };

  const handleRemoveMember = (memberUid) => {
    setSelectedMembers((prev) => prev.filter((uid) => uid !== memberUid));
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

                  <div style={{ marginBottom: 8 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#374151",
                        marginBottom: 6,
                      }}
                    >
                      Members (optional)
                    </div>
                    <input
                      type="text"
                      value={memberSearchInput}
                      onChange={(event) => setMemberSearchInput(event.target.value)}
                      placeholder="Search student by Student UID"
                      style={{
                        width: "100%",
                        border: "1px solid #E5E7EB",
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: 12,
                        outline: "none",
                        boxSizing: "border-box",
                        marginBottom: 6,
                      }}
                    />

                    {selectedMembers.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 8,
                        }}
                      >
                        {selectedMembers.map((uid) => (
                          <div
                            key={uid}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              borderRadius: 999,
                              background: "#EFF6FF",
                              color: "#1D4ED8",
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "4px 8px",
                            }}
                          >
                            {uid}
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(uid)}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "#1D4ED8",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                              }}
                              aria-label={`Remove ${uid}`}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {memberSearchLoading && (
                      <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6 }}>
                        Searching students...
                      </div>
                    )}

                    {!memberSearchLoading && memberSearchResults.length > 0 && (
                      <div
                        style={{
                          border: "1px solid #E5E7EB",
                          borderRadius: 8,
                          background: "#F9FAFB",
                          maxHeight: 120,
                          overflowY: "auto",
                          padding: 6,
                        }}
                      >
                        {memberSearchResults.map((student) => (
                          <button
                            key={student.uid}
                            type="button"
                            onClick={() => handleSelectMember(student.uid)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              border: "none",
                              background: "transparent",
                              padding: "6px 8px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#1F2937",
                              cursor: "pointer",
                            }}
                          >
                            {student.displayName || student.studentId} · {student.studentId}
                          </button>
                        ))}
                      </div>
                    )}

                    {!memberSearchLoading && memberSearchInput && memberSearchResults.length === 0 && (
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>
                        No student found.
                      </div>
                    )}
                  </div>

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