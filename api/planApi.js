import api from "./axios";

export const getMyPlan = async () => {
  const response = await api.get("/api/plans/me");
  return response.data;
};

export const createPlanOrder = async (billingCycle = "monthly") => {
  const response = await api.post("/api/plans/create-order", { billingCycle });
  return response.data;
};

export const verifyPlanPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const response = await api.post("/api/plans/verify-payment", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data;
};
