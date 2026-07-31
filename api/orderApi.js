import api from "./axios";

export const getPaymentHistory = async () => {
  try {
    const response = await api.get("/api/orders/get-payment-history");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
