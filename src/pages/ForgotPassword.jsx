import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendResetOtp, verifyResetOtp, resetPasswordWithOtp } from "../../api/authApi";
import { showError, showSuccess } from "../utils/toast";

const LOGO_SRC = "/canvade.png";

// 3-step reset flow: email -> OTP -> new password + confirm password.
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" | "otp" | "password"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      showError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await sendResetOtp(trimmedEmail);
      if (!res.success) {
        showError(res.message || "Unable to send verification code.");
        return;
      }
      showSuccess("Verification code sent. Please check your inbox.");
      setStep("otp");
    } catch (error) {
      showError(error?.response?.data?.message || error?.message || "Unable to send code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      showError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyResetOtp(email.trim().toLowerCase(), otp);
      if (!res.success) {
        showError(res.message || "Incorrect code.");
        return;
      }
      setResetToken(res.data.resetToken);
      showSuccess("Code verified.");
      setStep("password");
    } catch (error) {
      showError(error?.response?.data?.message || error?.message || "Unable to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordWithOtp(email.trim().toLowerCase(), resetToken, password);
      if (!res.success) {
        showError(res.message || "Unable to reset password.");
        return;
      }
      showSuccess("Password reset successfully. Please log in.");
      navigate("/get-started/login/student");
    } catch (error) {
      showError(error?.response?.data?.message || error?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-[13px] font-normal outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-50";
  const labelCls = "mb-1 block text-[12px] font-medium uppercase tracking-tight text-gray-600";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4">
      <div className="w-full max-w-[400px] py-10">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={LOGO_SRC} alt="Canvade" className="h-14 w-auto object-contain" />
          <h1 className="mt-4 text-lg font-bold text-slate-900">Forgot your password?</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {step === "email" && "Enter your email and we'll send you a verification code."}
            {step === "otp" && `Enter the 6-digit code we sent to ${email}.`}
            {step === "password" && "Choose your new password."}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div>
              <label className={labelCls}>Email ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-[#24977a] py-2 text-[14px] font-normal text-white transition hover:bg-[#1d7a63] active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className={labelCls}>Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="mt-2 w-full rounded-md bg-[#24977a] py-2 text-[14px] font-normal text-white transition hover:bg-[#1d7a63] active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full text-center text-[12px] font-medium text-gray-500 hover:text-[#24977a]"
            >
              Resend code
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-3">
            <div>
              <label className={labelCls}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-[#24977a] py-2 text-[14px] font-normal text-white transition hover:bg-[#1d7a63] active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 w-full text-center text-[13px] font-medium text-[#24977a] hover:text-[#1d7a63]"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
