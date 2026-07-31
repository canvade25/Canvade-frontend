// src/services/requestService.js
//
// Chat request API calls (student-to-student). All requests go through the
// shared axios instance, which attaches the auth token automatically —
// components should never call axios/api directly, only these functions.

import api from "../../api/axios";
import { formatRelativeTime } from "../utils/formatTime";

/** Student sends a chat request to another student. */
export const sendChatRequest = async (receiverUid) => {
  try {
    const response = await api.post("/api/chat/request/send", { receiverUid });
    return response.data;
  } catch (error) {
    console.error("sendChatRequest error:", error);
    throw error;
  }
};

/** Requests received by the current user (pending, awaiting Accept/Reject). */
export const getReceivedChatRequests = async () => {
  try {
    const response = await api.get("/api/chat/request/received");
    return response.data;
  } catch (error) {
    console.error("getReceivedChatRequests error:", error);
    throw error;
  }
};

/** Requests the current user has sent out (pending, cancellable). */
export const getSentChatRequests = async () => {
  try {
    const response = await api.get("/api/chat/request/sent");
    return response.data;
  } catch (error) {
    console.error("getSentChatRequests error:", error);
    throw error;
  }
};

/** Recipient accepts a chat request — backend creates the conversation. */
export const acceptChatRequest = async (requestId) => {
  try {
    const response = await api.patch(`/api/chat/request/accept/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("acceptChatRequest error:", error);
    throw error;
  }
};

/** Recipient rejects a chat request. */
export const rejectChatRequest = async (requestId) => {
  try {
    const response = await api.patch(`/api/chat/request/reject/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("rejectChatRequest error:", error);
    throw error;
  }
};

/** Sender cancels a chat request they sent. */
export const cancelChatRequest = async (requestId) => {
  try {
    const response = await api.delete(`/api/chat/request/cancel/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("cancelChatRequest error:", error);
    throw error;
  }
};

/**
 * Shapes a "received" chatRequest (from GET /chat/request/received) into
 * the chat-item shape ChatList/ChatListItem/ChatMessages already expect,
 * so those components don't need to know about the requests data model.
 */
export const mapReceivedRequestToChatItem = (request) => {
  const name = request.sender?.name || request.sender?.studentId || "Unknown Student";
  const time = formatRelativeTime(request.createdAt);
  return {
    id: request.requestId,
    requestId: request.requestId,
    direction: "received",
    name,
    msg: "Wants to connect with you",
    time,
    active: "Pending",
    color: "#FEE2E2",
    textColor: "#991B1B",
    courseId: null,
    messages: [
      {
        id: 1,
        text: `${name} sent you a chat request.`,
        type: "received",
        time,
      },
    ],
  };
};

/**
 * Shapes a "sent" chatRequest (from GET /chat/request/sent) into the same
 * chat-item shape used by mapReceivedRequestToChatItem.
 */
export const mapSentRequestToChatItem = (request) => {
  const name = request.receiver?.name || request.receiver?.studentId || "Unknown Student";
  const time = formatRelativeTime(request.createdAt);
  return {
    id: request.requestId,
    requestId: request.requestId,
    direction: "sent",
    name,
    msg: "Request sent — waiting for response",
    time,
    active: "Sent",
    color: "#FEF3C7",
    textColor: "#92400E",
    courseId: null,
    messages: [
      {
        id: 1,
        text: `You sent a chat request to ${name}.`,
        type: "sent",
        time,
      },
    ],
  };
};

/**
 * Not backed by an API yet — no student search endpoint exists on the
 * backend. Reserved for when "find a student to chat with" is added.
 */
export const searchStudentById = async (_studentId) => {
  throw new Error("searchStudentById is not implemented yet.");
};
