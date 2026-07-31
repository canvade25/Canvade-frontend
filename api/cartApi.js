import api from "./axios";

export const getCartItems = async (token) => {
  try {
    const response = await api.get("/api/cart/getItems", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data?.cart ?? response?.data ?? [];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeFromCart = async (courseId, token) => {
  try {
    const response = await api.delete("/api/cart/remove", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { courseId },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};