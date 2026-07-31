import { Navigate } from "react-router-dom";

// The password-reset flow now lives entirely in ForgotPassword.jsx (email ->
// OTP -> new password), so old links to this route just redirect there.
export default function ResetPassword() {
  return <Navigate to="/forgot-password" replace />;
}
