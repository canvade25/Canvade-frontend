import api from "./axios";

export const sendResetOtp = async (email) => {
  const response = await api.post("/api/auth/forgot-password/send-otp", { email });
  return response.data;
};

export const verifyResetOtp = async (email, otp) => {
  const response = await api.post("/api/auth/forgot-password/verify-otp", { email, otp });
  return response.data;
};

export const resetPasswordWithOtp = async (email, resetToken, newPassword) => {
  const response = await api.post("/api/auth/forgot-password/reset", {
    email,
    resetToken,
    newPassword,
  });
  return response.data;
};
