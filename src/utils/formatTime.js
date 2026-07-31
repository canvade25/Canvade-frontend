// src/utils/formatTime.js

/**
 * Returns the current time formatted as "H:MM" (e.g. "9:05").
 * Used when a new message is sent locally, before a server timestamp
 * (e.g. Firestore serverTimestamp()) would normally take over.
 */
export const getNow = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/**
 * Formats a message timestamp as "H:MM" (e.g. "9:05"), from a Firestore
 * Timestamp, its JSON form (`{ _seconds }` / `{ seconds }`), a number of
 * seconds, or an already-formatted string.
 */
export const formatMessageTimestamp = (timestamp) => {
  if (!timestamp) return "";
  if (typeof timestamp === "string") return timestamp;

  const seconds =
    typeof timestamp === "number"
      ? timestamp
      : timestamp._seconds ?? timestamp.seconds ?? null;

  if (seconds == null) return "";

  const d = new Date(seconds * 1000);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/**
 * Relative-time formatting for chat list previews (e.g. "1m", "25m", "1h",
 * "1d") from a Firestore Timestamp (or its JSON form `{ _seconds }` /
 * `{ seconds }` once it has passed through the backend's JSON response).
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  if (typeof timestamp === "string") return timestamp;

  const seconds =
    typeof timestamp === "number"
      ? timestamp
      : timestamp._seconds ?? timestamp.seconds ?? null;

  if (seconds == null) return "";

  const diffMin = Math.max(0, Math.floor((Date.now() - seconds * 1000) / 60000));

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
};