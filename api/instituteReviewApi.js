import axios from "./axios";

export const getInstituteReviews = async () => {
  const response = await axios.get("/institute-reviews/get");
  return response.data;
};

export const addInstituteReview = async (instituteId, rating, review) => {
  const response = await axios.post(`/institute-reviews/${instituteId}`, {
    rating,
    review,
  });
  return response.data;
};

export const getInstituteReviewsById = async (instituteId) => {
    const response = await axios.get(`/institute-reviews/get/${instituteId}`);
    return response.data;
};
