import api from "./axios";

export const sendEnquiry = async ({ courseId, instituteId, message } = {}) => {
  const response = await api.post("/api/enquiries/create", {
    courseId,
    instituteId,
    message,
  });
  return response.data;
};
