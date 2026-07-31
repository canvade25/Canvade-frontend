import api from './axios';


export const addInCart = async (courseId, token) => {
  try {
    const response = await api.post("/api/cart/add", { courseId }, 
        {headers : {
          Authorization: `Bearer ${token}`,
        },}
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addToCompare = async (courseId, token) => {
  try {
    const response = await api.post(
      "/api/compare/add",
      { courseId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCompareItems = async (token) => {
  try {
    const response = await api.get("/api/compare/getItems", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeFromCompare = async (courseId, token) => {
  try {
    const response = await api.delete("/api/compare/remove", {
      data: { courseId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCourseReviews = async (courseId) => {
  try {
    const response = await api.get(`/api/course-reviews/get/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBatchesByInstitute = async (token) => {
  try {
    const response = await api.get(`/api/batches/get-my-batches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Assuming the batches are in response.data.institute.batches
    return response.data.batches;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
