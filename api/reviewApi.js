import api from "./axios";

export const getInstituteReviews = async (instituteId) => {
  try {
    const response = await api.get(
      `/api/institute-reviews/get/${instituteId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching institute reviews:", error);
    throw error;
  }
};
