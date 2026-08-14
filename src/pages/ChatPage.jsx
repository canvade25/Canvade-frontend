// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

import useBreakpoint from "../components/Home/hooks/useBreakpoint";
import { INITIAL_DATA } from "../utils/constants";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebase";
import {
  getChatById,
  getListForSection,
  createMessage,
  appendMessageToChat,
  getConversations,
  getFirebaseCustomToken,
  sendMessage,
  editMessage,
  deleteMessage,
  deleteConversation,
  clearConversation,
  blockUser,
  unblockUser,
  markConversationAsSeen,
  mapConversationToChatItem,
} from "../services/chatService";
import {
  sendChatRequest,
  getReceivedChatRequests,
  getSentChatRequests,
  acceptChatRequest,
  rejectChatRequest,
  cancelChatRequest,
  mapReceivedRequestToChatItem,
  mapSentRequestToChatItem,
} from "../services/requestService";
import {
  getGroups,
  getGroupById,
  getGlobalGroups,
  createGroup,
  addMembersToGroup,
  sendGroupMessage,
  editGroupMessage,
  deleteGroupMessage,
  markGroupMessagesAsSeen,
  sendGroupJoinRequest,
  getReceivedGroupRequests,
  getSentGroupRequests,
  acceptGroupRequest,
  rejectGroupRequest,
  cancelGroupRequest,
  mapGroupToChatItem,
  mapReceivedGroupRequestToChatItem,
  mapSentGroupRequestToChatItem,
} from "../services/groupService";
import { searchStudentByStudentId } from "../../api/userApi";
import { showError, showSuccess } from "../utils/toast";

import ChatSidebar from "./chat/ChatSidebar";
import ChatList from "./chat/ChatList";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";
import EmptyState from "./chat/EmptyState";
import ConfirmDialog from "./chat/ConfirmDialog";

const ChatPage = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const location = useLocation();
  const pendingConversationId = useRef(location.state?.conversationId || null);

  const [activeSidebar, setActiveSidebar] = useState("Joined");
  const [activeTab, setActiveTab] = useState("Groups");
  const [selectedId, setSelectedId] = useState(1);
  const [messageInput, setMessageInput] = useState("");
  const [chatData, setChatData] = useState(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const [chatItemMenuId, setChatItemMenuId] = useState(null);
  const [messageMenuKey, setMessageMenuKey] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    danger: false,
    onConfirm: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [emojiMenuOpen, setEmojiMenuOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [studentSearchResults, setStudentSearchResults] = useState([]);
  const [studentSearchLoading, setStudentSearchLoading] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const [requestActionLoading, setRequestActionLoading] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState(null);
  const [globalGroups, setGlobalGroups] = useState([]);
  const [globalGroupsLoading, setGlobalGroupsLoading] = useState(false);
  const [globalGroupsError, setGlobalGroupsError] = useState(null);
  const [receivedGroupRequests, setReceivedGroupRequests] = useState([]);
  const [sentGroupRequests, setSentGroupRequests] = useState([]);
  const [groupRequestsLoading, setGroupRequestsLoading] = useState(false);
  const [groupRequestsError, setGroupRequestsError] = useState(null);
  const [groupRequestActionLoading, setGroupRequestActionLoading] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null); // { id, conversationId } | { id, groupId } | null
  const [replyingTo, setReplyingTo] = useState(null); // { id, text } | null
  // Stores per-conversation clearedAt timestamps so messages before the
  // clear point are filtered out. Shape: { [conversationId]: timestampMs }
  const [conversationClearedAt, setConversationClearedAt] = useState({});
  const messagesEndRef = useRef(null);

  const currentUid = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null")?.uid || null;
    } catch {
      return null;
    }
  }, []);

  const userRole = useMemo(
    () => (localStorage.getItem("Role") || localStorage.getItem("role") || "").toLowerCase(),
    [],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, chatData]);

  // Regular login only sets the backend's own JWT — it never establishes a
  // Firebase Auth session, so Firestore's realtime listener has no
  // request.auth to satisfy security rules with. Exchange it once here.
  useEffect(() => {
    if (!currentUid || auth.currentUser?.uid === currentUid) return;

    getFirebaseCustomToken()
      .then((res) => {
        if (!res?.firebaseToken) {
          throw new Error("Backend did not return a firebaseToken.");
        }
        return signInWithCustomToken(auth, res.firebaseToken);
      })
      .then(() => {
        console.log("Firebase Auth sign-in succeeded for uid:", currentUid);
      })
      .catch((error) => {
        console.error("Firebase custom-token sign-in failed:", error);
        showError(`Live chat sign-in failed: ${error.code || error.message}`);
      });
  }, [currentUid]);

  useEffect(() => {
    const handleClickOutside = () => {
      setChatItemMenuId(null);
      setMessageMenuKey(null);
      setHeaderMenuOpen(false);
      setAttachmentMenuOpen(false);
      setEmojiMenuOpen(false);
      setAddStudentOpen(false);
      setCreateGroupOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const loadChatRequests = useCallback(async () => {
    setRequestsLoading(true);
    setRequestsError(null);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        getReceivedChatRequests(),
        getSentChatRequests(),
      ]);
      setReceivedRequests(receivedRes?.data || []);
      setSentRequests(sentRes?.data || []);
    } catch (error) {
      setRequestsError(
        error?.response?.data?.message || error?.message || "Failed to load chat requests.",
      );
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSidebar === "Requests") {
      loadChatRequests();
    }
  }, [activeSidebar, loadChatRequests]);

  const loadGroupRequests = useCallback(async () => {
    setGroupRequestsLoading(true);
    setGroupRequestsError(null);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        getReceivedGroupRequests(),
        getSentGroupRequests(),
      ]);
      setReceivedGroupRequests(receivedRes?.data || []);
      setSentGroupRequests(sentRes?.data || []);
    } catch (error) {
      setGroupRequestsError(
        error?.response?.data?.message || error?.message || "Failed to load group requests.",
      );
    } finally {
      setGroupRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSidebar === "Requests") {
      loadGroupRequests();
    }
  }, [activeSidebar, loadGroupRequests]);

  const loadConversations = useCallback(async () => {
    setConversationsLoading(true);
    setConversationsError(null);
    try {
      const res = await getConversations();
      setConversations(res?.data || []);
    } catch (error) {
      setConversationsError(
        error?.response?.data?.message || error?.message || "Failed to load conversations.",
      );
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // "Enquire Now" navigates here with a conversationId in router state, once
  // the backend has already created/found the conversation — auto-select it
  // as soon as it shows up in the freshly-loaded conversations list.
  useEffect(() => {
    const targetId = pendingConversationId.current;
    if (!targetId) return;
    const exists = conversations.some((c) => c.conversationId === targetId);
    if (!exists) return;

    setActiveSidebar("Joined");
    setActiveTab("Individuals");
    setSelectedId(targetId);
    if (!isDesktop) setMobileView("chat");
    pendingConversationId.current = null;
  }, [conversations, isDesktop]);

  const loadGroups = useCallback(async () => {
    setGroupsLoading(true);
    setGroupsError(null);
    try {
      const res = await getGroups();
      setGroups(res?.data || []);
    } catch (error) {
      setGroupsError(
        error?.response?.data?.message || error?.message || "Failed to load groups.",
      );
    } finally {
      setGroupsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const loadGlobalGroups = useCallback(async () => {
    setGlobalGroupsLoading(true);
    setGlobalGroupsError(null);
    try {
      const res = await getGlobalGroups();
      setGlobalGroups(res?.data || []);
    } catch (error) {
      setGlobalGroupsError(
        error?.response?.data?.message || error?.message || "Failed to load groups.",
      );
    } finally {
      setGlobalGroupsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeSidebar === "Global") {
      loadGlobalGroups();
    }
  }, [activeSidebar, loadGlobalGroups]);

  const requestChatItems = useMemo(
    () => [
      ...receivedRequests.map(mapReceivedRequestToChatItem),
      ...sentRequests.map(mapSentRequestToChatItem),
    ],
    [receivedRequests, sentRequests],
  );

  const requestGroupChatItems = useMemo(
    () => [
      ...receivedGroupRequests.map(mapReceivedGroupRequestToChatItem),
      ...sentGroupRequests.map(mapSentGroupRequestToChatItem),
    ],
    [receivedGroupRequests, sentGroupRequests],
  );

  const conversationChatItems = useMemo(
    () =>
      conversations
        .filter((c) => c.type === "individual")
        .map(mapConversationToChatItem),
    [conversations],
  );

  const groupChatItems = useMemo(() => groups.map(mapGroupToChatItem), [groups]);

  const globalGroupChatItems = useMemo(
    () => globalGroups.map(mapGroupToChatItem),
    [globalGroups],
  );

  const effectiveChatData = useMemo(
    () => ({
      ...chatData,
      Global: { ...chatData.Global, Groups: globalGroupChatItems },
      Joined: { ...chatData.Joined, Groups: groupChatItems, Individuals: conversationChatItems },
      Requests: { Groups: requestGroupChatItems, Individuals: requestChatItems },
    }),
    [
      chatData,
      globalGroupChatItems,
      groupChatItems,
      conversationChatItems,
      requestChatItems,
      requestGroupChatItems,
    ],
  );

  const selectedChat = getChatById(effectiveChatData, selectedId);

  // Mark the open conversation as seen once, whenever the selection changes.
  useEffect(() => {
    const conversationId = selectedChat?.conversationId;
    if (!conversationId) return;

    markConversationAsSeen(conversationId)
      .then(() => {
        setConversations((prev) =>
          prev.map((c) =>
            c.conversationId === conversationId ? { ...c, unreadCount: 0 } : c,
          ),
        );
      })
      .catch((error) => {
        console.error("markConversationAsSeen error:", error);
      });
  }, [selectedChat?.conversationId]);

  // Refresh full group info from the backend once a group is opened — the
  // list view (GET /group/list) is a lighter snapshot that can be stale.
  // Excludes group-request chat items (isGroup + requestId): the user isn't
  // a member yet, so getGroupById would just 403.
  useEffect(() => {
    const groupId =
      selectedChat?.isGroup && !selectedChat?.requestId ? selectedChat.groupId : null;
    if (!groupId) return undefined;

    let cancelled = false;
    getGroupById(groupId)
      .then((res) => {
        if (cancelled || !res?.data) return;
        setGroups((prev) =>
          prev.map((g) => (g.groupId === groupId ? { ...g, ...res.data } : g)),
        );
      })
      .catch((error) => {
        console.error("getGroupById error:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedChat?.isGroup, selectedChat?.groupId, selectedChat?.requestId]);

  // Mark the open group as seen once, whenever the selection changes.
  // Same exclusion as above — a pending join request isn't a joined group.
  useEffect(() => {
    const groupId =
      selectedChat?.isGroup && !selectedChat?.requestId ? selectedChat.groupId : null;
    if (!groupId) return;

    markGroupMessagesAsSeen(groupId).catch((error) => {
      console.error("markGroupMessagesAsSeen error:", error);
    });
  }, [selectedChat?.isGroup, selectedChat?.groupId, selectedChat?.requestId]);

  // "Global" + "Individuals" has no pre-loaded list of every student on the
  // platform (unlike Joined/Groups) — instead, typing a student ID here
  // triggers a live server-side search so a student can find and message
  // someone they don't already have a conversation with.
  const isGlobalStudentSearch = activeSidebar === "Global" && activeTab === "Individuals";

  useEffect(() => {
    if (!isGlobalStudentSearch) {
      setStudentSearchResults([]);
      return undefined;
    }

    const query = searchQuery.trim();
    if (!query) {
      setStudentSearchResults([]);
      setStudentSearchLoading(false);
      return undefined;
    }

    let cancelled = false;
    setStudentSearchLoading(true);
    const timer = setTimeout(() => {
      searchStudentByStudentId(query)
        .then((res) => {
          if (!cancelled) setStudentSearchResults(res?.data || []);
        })
        .catch((error) => {
          console.error("searchStudentByStudentId error:", error);
          if (!cancelled) setStudentSearchResults([]);
        })
        .finally(() => {
          if (!cancelled) setStudentSearchLoading(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isGlobalStudentSearch, searchQuery]);

  const studentSearchChatItems = useMemo(
    () =>
      studentSearchResults.map((student) => ({
        id: `search:${student.uid}`,
        name: student.displayName || student.studentId,
        msg: student.studentId,
        time: "",
        active: "",
        color: "#DBEAFE",
        textColor: "#1E40AF",
        courseId: null,
        unreadCount: 0,
        messages: [],
      })),
    [studentSearchResults],
  );

  const currentList = isGlobalStudentSearch
    ? studentSearchChatItems
    : getListForSection(effectiveChatData, activeSidebar, activeTab, searchQuery);
  const groupCount = effectiveChatData[activeSidebar]?.Groups?.length || 0;
  const indvCount = effectiveChatData[activeSidebar]?.Individuals?.length || 0;

  const sidebarSectionCounts = useMemo(
    () => ({
      Global:
        (effectiveChatData.Global?.Groups?.length || 0) +
        (effectiveChatData.Global?.Individuals?.length || 0),
      Joined:
        (effectiveChatData.Joined?.Groups?.length || 0) +
        (effectiveChatData.Joined?.Individuals?.length || 0),
      Requests:
        (effectiveChatData.Requests?.Groups?.length || 0) +
        (effectiveChatData.Requests?.Individuals?.length || 0),
    }),
    [effectiveChatData],
  );

  const joinedHasUnread = useMemo(
    () => conversationChatItems.some((c) => c.unreadCount > 0),
    [conversationChatItems],
  );
  const listEmptyMessage =
    activeSidebar === "Requests"
      ? requestsLoading || groupRequestsLoading
        ? "Loading requests..."
        : requestsError || groupRequestsError || undefined
      : activeSidebar === "Joined" && activeTab === "Individuals"
        ? conversationsLoading
          ? "Loading conversations..."
          : conversationsError || undefined
        : activeSidebar === "Joined" && activeTab === "Groups"
          ? groupsLoading
            ? "Loading groups..."
            : groupsError || undefined
          : activeSidebar === "Global" && activeTab === "Groups"
            ? globalGroupsLoading
              ? "Loading groups..."
              : globalGroupsError || undefined
            : isGlobalStudentSearch
              ? studentSearchLoading
                ? "Searching..."
                : searchQuery.trim()
                  ? "No students found with that ID."
                  : "Search by student ID to find someone to chat with."
              : undefined;

  const showSidebar = isDesktop;
  const showList = isDesktop || isTablet || mobileView === "list";
  const showChat = isDesktop || isTablet || mobileView === "chat";
  const listWidth = isDesktop ? 310 : isTablet ? 260 : "100%";

  const handleSidebarChange = (item) => {
    setActiveSidebar(item);
    setSelectedId(null);
    setMobileView("list");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedId(null);
  };

  const handleSelectChat = (id) => {
    setSelectedId(id);
    setEditingMessage(null);
    setReplyingTo(null);
    setMessageInput("");
    if (!isDesktop) setMobileView("chat");
  };

  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text || !selectedId) return;

    if (editingMessage) {
      setMessageInput("");
      try {
        if (editingMessage.groupId) {
          await editGroupMessage(editingMessage.id, {
            groupId: editingMessage.groupId,
            text,
          });
        } else {
          await editMessage(editingMessage.id, {
            conversationId: editingMessage.conversationId,
            text,
          });
        }
        // Firestore listener in ChatMessages picks up the edited text.
      } catch (error) {
        showError(
          error?.response?.data?.message || error?.message || "Failed to edit message.",
        );
        setMessageInput(text);
        return;
      }
      setEditingMessage(null);
      return;
    }

    // Real conversations go through the backend; the Firestore listener in
    // ChatMessages picks up the new message automatically. Mock chats
    // (Global, not wired to a backend conversation yet) still use the
    // local fallback so that part of the demo keeps working.
    if (selectedChat?.conversationId) {
      const replyToId = replyingTo?.id || null;
      setMessageInput("");
      setReplyingTo(null);
      try {
        await sendMessage({
          conversationId: selectedChat.conversationId,
          text,
          replyTo: replyToId,
        });
        setConversations((prev) =>
          prev.map((c) =>
            c.conversationId === selectedChat.conversationId
              ? { ...c, lastMessage: text, lastMessageTime: { seconds: Date.now() / 1000 } }
              : c,
          ),
        );
      } catch (error) {
        showError(
          error?.response?.data?.message || error?.message || "Failed to send message.",
        );
        setMessageInput(text);
      }
      return;
    }

    // Real groups go through the backend the same way — the Firestore
    // listener in ChatMessages picks up the new message automatically.
    // Excludes group-request chat items: not a member yet, nothing to send to.
    if (selectedChat?.isGroup && selectedChat?.groupId && !selectedChat?.requestId) {
      const replyToId = replyingTo?.id || null;
      setMessageInput("");
      setReplyingTo(null);
      try {
        await sendGroupMessage({
          groupId: selectedChat.groupId,
          text,
          replyTo: replyToId,
        });
        setGroups((prev) =>
          prev.map((g) =>
            g.groupId === selectedChat.groupId
              ? { ...g, lastMessage: text, lastMessageTime: { seconds: Date.now() / 1000 } }
              : g,
          ),
        );
      } catch (error) {
        showError(
          error?.response?.data?.message || error?.message || "Failed to send message.",
        );
        setMessageInput(text);
      }
      return;
    }

    const newMsg = createMessage(text);
    setChatData((prev) => appendMessageToChat(prev, selectedId, newMsg));
    setMessageInput("");
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessageInput("");
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleEnterSelectMode = () => {
    setEditingMessage(null);
    setReplyingTo(null);
    setMessageInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

    const handleEmojiSelect = (emojiObject) => {
    setMessageInput((value) => value + emojiObject.emoji);
    setEmojiMenuOpen(false); // Picker ko select karne par band kar dega
  };

  const handleToggleChatItemMenu = (chatId) => {
    setChatItemMenuId((current) => (current === chatId ? null : chatId));
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const res = await sendGroupJoinRequest(groupId);
      showSuccess(res?.message || "Join request sent.");
      loadGroupRequests(); // Step 7: refresh sent requests after a successful join request
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to send join request.",
      );
    }
  };

  const handleSendChatRequestToSearchResult = async (searchId) => {
    const uid = searchId.slice("search:".length);
    try {
      const res = await handleSendChatRequest(uid);
      showSuccess(res?.message || "Chat request sent.");
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to send chat request.",
      );
    }
  };

  const handleSelectChatItemOption = (chatId, option) => {
    setChatItemMenuId(null);
    if (option === "Join Group") {
      handleJoinGroup(chatId);
    } else if (option === "Send Chat Request") {
      handleSendChatRequestToSearchResult(chatId);
    }
  };

  const handleToggleMessageMenu = (messageKey) => {
    setMessageMenuKey((current) => (current === messageKey ? null : messageKey));
  };

  const handleSelectMessageOption = (_messageKey, msg, option) => {
    setMessageMenuKey(null);

    if (option === "Copy") {
      navigator.clipboard?.writeText(msg.text);
      return;
    }

    if (option === "Edit") {
      if (msg.type !== "sent") return;
      if (selectedChat?.conversationId) {
        setReplyingTo(null);
        setEditingMessage({ id: msg.id, conversationId: selectedChat.conversationId });
        setMessageInput(msg.text);
      } else if (selectedChat?.isGroup && selectedChat?.groupId) {
        setReplyingTo(null);
        setEditingMessage({ id: msg.id, groupId: selectedChat.groupId });
        setMessageInput(msg.text);
      }
      return;
    }

    if (option === "Reply") {
      setEditingMessage(null);
      setReplyingTo({ id: msg.id, text: msg.text });
      return;
    }

    if (option === "Delete Message") {
      if (msg.type !== "sent") return;
      if (!window.confirm("Delete this message?")) return;
      if (selectedChat?.conversationId) {
        deleteMessage(msg.id, selectedChat.conversationId).catch((error) => {
          showError(
            error?.response?.data?.message || error?.message || "Failed to delete message.",
          );
        });
      } else if (selectedChat?.isGroup && selectedChat?.groupId) {
        deleteGroupMessage(msg.id, selectedChat.groupId).catch((error) => {
          showError(
            error?.response?.data?.message || error?.message || "Failed to delete message.",
          );
        });
      }
      // Firestore listener in ChatMessages picks up the deletion.
    }
  };

  const closeConfirmDialog = () => {
    if (confirmLoading) return;
    setConfirmDialog((prev) => ({ ...prev, open: false }));
  };

  const openConfirmDialog = ({ title, message, confirmLabel = "Confirm", danger = false, onConfirm }) => {
    setConfirmDialog({ open: true, title, message, confirmLabel, danger, onConfirm });
  };

  const handleConfirmDialogConfirm = async () => {
    const action = confirmDialog.onConfirm;
    if (!action) return;
    setConfirmLoading(true);
    try {
      await action();
    } finally {
      setConfirmLoading(false);
      setConfirmDialog((prev) => ({ ...prev, open: false }));
    }
  };

  const [addMembersToGroupOpen, setAddMembersToGroupOpen] = useState(false);
  const [addMembersGroupSearch, setAddMembersGroupSearch] = useState("");
  const [addMembersGroupResults, setAddMembersGroupResults] = useState([]);
  const [addMembersGroupSearchLoading, setAddMembersGroupSearchLoading] = useState(false);
  const [selectedAddMembers, setSelectedAddMembers] = useState([]);
  const [addMembersGroupFeedback, setAddMembersGroupFeedback] = useState(null);
  const [addingMembersToGroup, setAddingMembersToGroup] = useState(false);

  useEffect(() => {
    const query = addMembersGroupSearch.trim();
    if (!query) {
      setAddMembersGroupResults([]);
      setAddMembersGroupSearchLoading(false);
      return undefined;
    }

    let cancelled = false;
    setAddMembersGroupSearchLoading(true);
    const timer = setTimeout(() => {
      searchStudentByStudentId(query)
        .then((res) => {
          if (!cancelled) {
            const results = (res?.data || []).filter(
              (student) => !selectedAddMembers.includes(student.uid),
            );
            setAddMembersGroupResults(results);
          }
        })
        .catch(() => {
          if (!cancelled) setAddMembersGroupResults([]);
        })
        .finally(() => {
          if (!cancelled) setAddMembersGroupSearchLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [addMembersGroupSearch, selectedAddMembers]);

  const handleSelectHeaderOption = (option) => {
    setHeaderMenuOpen(false);

    if (option === "Add Members") {
      setAddMembersToGroupOpen(true);
      setAddMembersGroupFeedback(null);
      return;
    }

    const conversationId = selectedChat?.conversationId;

    if (option === "Delete Conversation") {
      if (!conversationId) { showError("Open a real conversation first."); return; }
      openConfirmDialog({
        title: "Delete Conversation",
        message: "Delete this conversation? This can't be undone.",
        confirmLabel: "Delete",
        danger: true,
        onConfirm: async () => {
          try {
            await deleteConversation(conversationId);
            setConversations((prev) => prev.filter((c) => c.conversationId !== conversationId));
            setSelectedId(null);
            showSuccess("Conversation deleted.");
          } catch (error) {
            showError(error?.response?.data?.message || error?.message || "Failed to delete conversation.");
          }
        },
      });
      return;
    }

    if (option === "Clear Chat") {
      if (!conversationId) { showError("Open a real conversation first."); return; }
      openConfirmDialog({
        title: "Clear Chat",
        message: "Clear all messages in this chat? This can't be undone.",
        confirmLabel: "Clear",
        danger: true,
        onConfirm: async () => {
          try {
            await clearConversation(conversationId);
            // Store the clear timestamp so ChatMessages can filter old messages.
            // Backend stores clearedAt server-side; we mirror it locally as
            // the current time so the filter applies immediately without
            // needing a fresh fetch.
            setConversationClearedAt((prev) => ({
              ...prev,
              [conversationId]: Date.now(),
            }));
            setConversations((prev) =>
              prev.map((c) =>
                c.conversationId === conversationId ? { ...c, lastMessage: "No messages yet" } : c,
              ),
            );
            showSuccess("Chat cleared.");
          } catch (error) {
            showError(error?.response?.data?.message || error?.message || "Failed to clear chat.");
          }
        },
      });
      return;
    }

    if (option === "Block") {
      const targetUid = selectedChat?.participantUid;
      if (!targetUid) { showError("Can't identify the other participant."); return; }
      openConfirmDialog({
        title: "Block User",
        message: `Block ${selectedChat.name}? They won't be able to message you.`,
        confirmLabel: "Block",
        danger: true,
        onConfirm: async () => {
          try {
            await blockUser(targetUid);
            showSuccess("User blocked.");
          } catch (error) {
            showError(error?.response?.data?.message || error?.message || "Failed to block user.");
          }
        },
      });
      return;
    }

    if (option === "Unblock") {
      const targetUid = selectedChat?.participantUid;
      if (!targetUid) { showError("Can't identify the other participant."); return; }
      openConfirmDialog({
        title: "Unblock User",
        message: `Unblock ${selectedChat.name}? They will be able to message you again.`,
        confirmLabel: "Unblock",
        danger: false,
        onConfirm: async () => {
          try {
            await unblockUser(targetUid);
            showSuccess("User unblocked.");
          } catch (error) {
            showError(error?.response?.data?.message || error?.message || "Failed to unblock user.");
          }
        },
      });
    }
  };

  const handleFileSelected = async (file) => {
    if (!file || !selectedChat?.conversationId) return;
    try {
      await sendMessage({ conversationId: selectedChat.conversationId, file });
      setConversations((prev) =>
        prev.map((c) =>
          c.conversationId === selectedChat.conversationId
            ? { ...c, lastMessage: file.name, lastMessageTime: { seconds: Date.now() / 1000 } }
            : c,
        ),
      );
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to send attachment.",
      );
    }
  };

  const handleAttachmentSelect = (_label) => {
    setAttachmentMenuOpen(false);
  };

  const handleToggleAddStudent = () => {
    setAddStudentOpen((v) => !v);
  };

  const handleSendChatRequest = (uid) => sendChatRequest(uid);

  const handleToggleCreateGroup = () => {
    setCreateGroupOpen((v) => !v);
  };

  const handleSelectAddMember = (memberUid) => {
    setSelectedAddMembers((prev) => {
      if (prev.includes(memberUid)) return prev;
      return [...prev, memberUid];
    });
    setAddMembersGroupSearch("");
    setAddMembersGroupResults([]);
  };

  const handleRemoveAddMember = (memberUid) => {
    setSelectedAddMembers((prev) => prev.filter((uid) => uid !== memberUid));
  };

  const handleAddMembersToGroup = async () => {
    if (!selectedAddMembers.length || !selectedChat?.groupId) return;

    setAddingMembersToGroup(true);
    setAddMembersGroupFeedback(null);
    try {
      await addMembersToGroup(selectedChat.groupId, selectedAddMembers);
      setAddMembersGroupFeedback({ type: "success", text: "Members added successfully." });
      setSelectedAddMembers([]);
      setAddMembersGroupSearch("");
      await loadGroups();
      setTimeout(() => setAddMembersToGroupOpen(false), 1500);
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "Failed to add members.";
      setAddMembersGroupFeedback({ type: "error", text: message });
    } finally {
      setAddingMembersToGroup(false);
    }
  };

  const handleCreateGroup = async (groupName, description, memberUids = []) => {
    const res = await createGroup({ groupName, description, memberUids });
    await loadGroups();
    setActiveSidebar("Joined");
    setActiveTab("Groups");
    setCreateGroupOpen(false);
    return res;
  };

  const handleAcceptRequest = async (requestId) => {
    setRequestActionLoading(requestId);
    try {
      await acceptChatRequest(requestId);
      setReceivedRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      setSelectedId((current) => (current === requestId ? null : current));
      loadConversations(); // accepting creates a conversation — pull it into "Joined"
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to accept request.",
      );
    } finally {
      setRequestActionLoading(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setRequestActionLoading(requestId);
    try {
      await rejectChatRequest(requestId);
      setReceivedRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      setSelectedId((current) => (current === requestId ? null : current));
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to reject request.",
      );
    } finally {
      setRequestActionLoading(null);
    }
  };

  const handleCancelRequest = async (requestId) => {
    setRequestActionLoading(requestId);
    try {
      await cancelChatRequest(requestId);
      setSentRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      setSelectedId((current) => (current === requestId ? null : current));
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to cancel request.",
      );
    } finally {
      setRequestActionLoading(null);
    }
  };

  const handleAcceptGroupRequest = async (requestId) => {
    setGroupRequestActionLoading(requestId);
    try {
      await acceptGroupRequest(requestId);
      setReceivedGroupRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      setSelectedId((current) => (current === requestId ? null : current));
      loadGroups(); // Step 8: accepting adds a member — refresh groups
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to accept request.",
      );
    } finally {
      setGroupRequestActionLoading(null);
    }
  };

  const handleRejectGroupRequest = async (requestId) => {
    setGroupRequestActionLoading(requestId);
    try {
      await rejectGroupRequest(requestId);
      setReceivedGroupRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      setSelectedId((current) => (current === requestId ? null : current));
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to reject request.",
      );
    } finally {
      setGroupRequestActionLoading(null);
    }
  };

  const handleCancelGroupRequest = async (requestId) => {
    setGroupRequestActionLoading(requestId);
    try {
      await cancelGroupRequest(requestId);
      setSentGroupRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      setSelectedId((current) => (current === requestId ? null : current));
    } catch (error) {
      showError(
        error?.response?.data?.message || error?.message || "Failed to cancel request.",
      );
    } finally {
      setGroupRequestActionLoading(null);
    }
  };

  const handleRequestAction = (action, chat) => {
    if (!chat?.requestId) return;
    if (chat.isGroup) {
      if (action === "Accept") return handleAcceptGroupRequest(chat.requestId);
      if (action === "Reject") return handleRejectGroupRequest(chat.requestId);
      if (action === "Cancel") return handleCancelGroupRequest(chat.requestId);
      return;
    }
    if (action === "Accept") return handleAcceptRequest(chat.requestId);
    if (action === "Reject") return handleRejectRequest(chat.requestId);
    if (action === "Cancel") return handleCancelRequest(chat.requestId);
  };

  return (
    <>
      <Navbar />
      <div className="chat-root">
        <div className="chat-outer-wrap">
          <div className="chat-inner">
            {showSidebar && (
              <ChatSidebar
                activeSidebar={activeSidebar}
                onSidebarChange={handleSidebarChange}
                addStudentOpen={addStudentOpen}
                onToggleAddStudent={handleToggleAddStudent}
                onSendChatRequest={handleSendChatRequest}
                sectionCounts={sidebarSectionCounts}
                joinedHasUnread={joinedHasUnread}
                userRole={userRole}
                createGroupOpen={createGroupOpen}
                onToggleCreateGroup={handleToggleCreateGroup}
                onCreateGroup={handleCreateGroup}
              />
            )}

            {showList && (
              <ChatList
                isMobile={isMobile}
                isTablet={isTablet}
                listWidth={listWidth}
                activeSidebar={activeSidebar}
                onSidebarChange={handleSidebarChange}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                groupCount={groupCount}
                indvCount={indvCount}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentList={currentList}
                selectedId={selectedId}
                onSelectChat={handleSelectChat}
                chatItemMenuId={chatItemMenuId}
                onToggleChatItemMenu={handleToggleChatItemMenu}
                onSelectChatItemOption={handleSelectChatItemOption}
                emptyMessage={listEmptyMessage}
              />
            )}

            {showChat && (
              <div className="chat-area">
                {selectedChat ? (
                  <>
                    {addMembersToGroupOpen && selectedChat?.isGroup && (
                      <div
                        style={{
                          position: "fixed",
                          inset: 0,
                          background: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1000,
                        }}
                        onClick={() => setAddMembersToGroupOpen(false)}
                      >
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 16,
                            padding: 20,
                            width: "90%",
                            maxWidth: 400,
                            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#1F2937",
                              marginBottom: 16,
                            }}
                          >
                            Add Members to {selectedChat.name}
                          </div>

                          <input
                            type="text"
                            value={addMembersGroupSearch}
                            onChange={(e) => setAddMembersGroupSearch(e.target.value)}
                            placeholder="Search student by Student UID"
                            autoFocus
                            style={{
                              width: "100%",
                              border: "1px solid #E5E7EB",
                              borderRadius: 8,
                              padding: "8px 10px",
                              fontSize: 12,
                              outline: "none",
                              boxSizing: "border-box",
                              marginBottom: 12,
                            }}
                          />

                          {selectedAddMembers.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 6,
                                marginBottom: 12,
                              }}
                            >
                              {selectedAddMembers.map((uid) => (
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
                                    onClick={() => handleRemoveAddMember(uid)}
                                    style={{
                                      border: "none",
                                      background: "transparent",
                                      color: "#1D4ED8",
                                      cursor: "pointer",
                                      fontSize: 14,
                                      padding: 0,
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {addMembersGroupSearchLoading && (
                            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                              Searching students...
                            </div>
                          )}

                          {!addMembersGroupSearchLoading && addMembersGroupResults.length > 0 && (
                            <div
                              style={{
                                border: "1px solid #E5E7EB",
                                borderRadius: 8,
                                background: "#F9FAFB",
                                maxHeight: 150,
                                overflowY: "auto",
                                padding: 8,
                                marginBottom: 12,
                              }}
                            >
                              {addMembersGroupResults.map((student) => (
                                <button
                                  key={student.uid}
                                  type="button"
                                  onClick={() => handleSelectAddMember(student.uid)}
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

                          {!addMembersGroupSearchLoading &&
                            addMembersGroupSearch &&
                            addMembersGroupResults.length === 0 && (
                              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 12 }}>
                                No student found.
                              </div>
                            )}

                          {addMembersGroupFeedback && (
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                marginBottom: 12,
                                color:
                                  addMembersGroupFeedback.type === "error" ? "#DC2626" : "#059669",
                              }}
                            >
                              {addMembersGroupFeedback.text}
                            </div>
                          )}

                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              type="button"
                              onClick={() => setAddMembersToGroupOpen(false)}
                              style={{
                                flex: 1,
                                border: "1px solid #E5E7EB",
                                borderRadius: 8,
                                padding: "8px 10px",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#6B7280",
                                background: "#fff",
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddMembersToGroup}
                              disabled={!selectedAddMembers.length || addingMembersToGroup}
                              style={{
                                flex: 1,
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 10px",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#fff",
                                background:
                                  !selectedAddMembers.length || addingMembersToGroup
                                    ? "#93C5FD"
                                    : "#1D4ED8",
                                cursor:
                                  !selectedAddMembers.length || addingMembersToGroup
                                    ? "not-allowed"
                                    : "pointer",
                              }}
                            >
                              {addingMembersToGroup ? "Adding..." : "Add Members"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <ChatHeader
                      chat={selectedChat}
                      isDesktop={isDesktop}
                      activeTab={activeTab}
                      menuOpen={headerMenuOpen}
                      onBack={() => setMobileView("list")}
                      onToggleMenu={() => setHeaderMenuOpen((v) => !v)}
                      onOptionSelect={handleSelectHeaderOption}
                    />

                    <ChatMessages
                      activeSidebar={activeSidebar}
                      chat={selectedChat}
                      messages={selectedChat.messages}
                      currentUid={currentUid}
                      messageMenuKey={messageMenuKey}
                      onToggleMessageMenu={handleToggleMessageMenu}
                      onSelectMessageOption={handleSelectMessageOption}
                      messagesEndRef={messagesEndRef}
                      onRequestAction={handleRequestAction}
                      requestActionLoading={
                        selectedChat?.isGroup ? groupRequestActionLoading : requestActionLoading
                      }
                      onEnterSelectMode={handleEnterSelectMode}
                      clearedAt={
                        selectedChat?.conversationId
                          ? conversationClearedAt[selectedChat.conversationId] || null
                          : null
                      }
                    />

                    {editingMessage ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 16px",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#059669",
                          background: "#ECFDF5",
                          borderTop: "1px solid #E5E7EB",
                        }}
                      >
                        Editing message
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#6B7280",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : replyingTo ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "6px 16px",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#1F2937",
                          background: "#F3F4F6",
                          borderTop: "1px solid #E5E7EB",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Replying to: {replyingTo.text}
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelReply}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#6B7280",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : null}

                    <ChatInput
                      value={messageInput}
                      onChange={setMessageInput}
                      onKeyDown={handleKeyDown}
                      onSend={handleSendMessage}
                      emojiMenuOpen={emojiMenuOpen}
                      onToggleEmojiMenu={() => setEmojiMenuOpen((v) => !v)}
                      onEmojiSelect={handleEmojiSelect}
                      attachmentMenuOpen={attachmentMenuOpen}
                      onToggleAttachmentMenu={() => setAttachmentMenuOpen((v) => !v)}
                      onAttachmentSelect={handleAttachmentSelect}
                      onFileSelected={handleFileSelected}
                    />
                  </>
                ) : (
                  <EmptyState />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        danger={confirmDialog.danger}
        loading={confirmLoading}
        onConfirm={handleConfirmDialogConfirm}
        onCancel={closeConfirmDialog}
      />
    </>
  );
};

export default ChatPage;