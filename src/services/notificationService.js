// src/services/notificationService.js
//
// Scaffolding for presence/notification features: typing indicators,
// read receipts, online status, last seen, mute notifications.
// Not wired into the UI yet.

/** Mark that a user is currently typing in a conversation. */
export const setTypingStatus = async (_conversationId, _userId, _isTyping) => {
  // TODO: Firestore integration (e.g. realtime "typing" doc/field)
  throw new Error("setTypingStatus is not implemented yet.");
};

/** Mark messages as read up to a given message id for a user. */
export const markMessagesAsRead = async (_conversationId, _userId, _lastMessageId) => {
  // TODO: Firestore integration
  throw new Error("markMessagesAsRead is not implemented yet.");
};

/** Update a user's online/offline presence. */
export const setOnlineStatus = async (_userId, _isOnline) => {
  // TODO: Firestore integration (e.g. Realtime Database presence)
  throw new Error("setOnlineStatus is not implemented yet.");
};

/** Get a user's last seen timestamp. */
export const getLastSeen = async (_userId) => {
  // TODO: Firestore integration
  throw new Error("getLastSeen is not implemented yet.");
};

/** Mute/unmute notifications for a conversation. */
export const setMuteNotifications = async (_conversationId, _userId, _muted) => {
  // TODO: Firestore integration
  throw new Error("setMuteNotifications is not implemented yet.");
};