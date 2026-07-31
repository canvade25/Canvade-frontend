import api from "./axios";

export const sendContactMessage = async (message) => {
  const response = await api.post("/api/support/contact", { message });
  return response.data;
};
