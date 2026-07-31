import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    style: {
      borderRadius: "12px",
      background: "#10b981",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    style: {
      borderRadius: "12px",
      background: "#ef4444",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

export const showWarning = (message) => {
  toast(message, {
    icon: "⚠️",
    duration: 4000,
    style: {
      borderRadius: "12px",
      background: "#f59e0b",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    icon: "ℹ️",
    duration: 3000,
    style: {
      borderRadius: "12px",
      background: "#3b82f6",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};