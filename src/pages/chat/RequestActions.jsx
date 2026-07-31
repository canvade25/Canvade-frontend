// src/components/chat/RequestActions.jsx
import React from "react";
import { REQUEST_ACTIONS } from "../../utils/constants";

/**
 * Action row shown at the top of a conversation when viewing the
 * "Requests" section — Accept/Reject for a request received by this user,
 * Cancel for a request this user sent. Defaults to the original
 * Accept/Reject/Block set when no `actions` override is given.
 */
const RequestActions = ({ actions = REQUEST_ACTIONS, onAction, loading = false }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginBottom: 16,
        flexWrap: "wrap",
      }}
    >
      {actions.map((action) => {
        const isPrimary = action === "Accept";
        const isDanger = action === "Reject" || action === "Block";
        return (
          <button
            key={action}
            disabled={loading}
            style={{
              border: isPrimary ? "1px solid #059669" : "1px solid #E5E7EB",
              background: isPrimary ? "#059669" : "#fff",
              color: isPrimary ? "#fff" : isDanger ? "#DC2626" : "#374151",
              borderRadius: 999,
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
            onClick={onAction ? () => onAction(action) : undefined}
          >
            {loading ? "..." : action}
          </button>
        );
      })}
    </div>
  );
};

export default RequestActions;