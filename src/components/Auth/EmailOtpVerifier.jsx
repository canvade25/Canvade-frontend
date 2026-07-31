import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const OTP_TTL_MS = 10 * 60 * 1000;

const generateOtpCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

/**
 * Confirms an email address is real/reachable before signup proceeds: sends
 * a 6-digit code straight from the browser via EmailJS, the user types it
 * back in. A dummy/typo'd address just never receives the code, so it can
 * never be verified. Mirrors the same pattern used for profile email
 * verification (see dashboard/student/pages/Profile.jsx).
 */
export default function EmailOtpVerifier({ email, name, verified, onVerified }) {
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const generatedOtpRef = useRef(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");

  const handleSend = async () => {
    if (!emailValid) {
      toast.error("Enter a valid email address first.");
      return;
    }
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error("Email verification isn't configured yet (missing EmailJS keys)");
      return;
    }

    setSending(true);
    try {
      const otpCode = generateOtpCode();
      generatedOtpRef.current = { otpCode, expiresAt: Date.now() + OTP_TTL_MS };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { to_email: email, to_name: name || "there", otp_code: otpCode },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );

      setOtpSent(true);
      toast.success("Verification code sent to your email.");
    } catch (error) {
      console.error("EmailJS send failed:", error);
      toast.error("Couldn't send verification email. Try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setVerifying(true);
    try {
      const record = generatedOtpRef.current;
      if (!record) {
        toast.error("Send a code first.");
        return;
      }
      if (Date.now() > record.expiresAt) {
        toast.error("Code expired. Send a new one.");
        return;
      }
      if (code !== record.otpCode) {
        toast.error("Incorrect code.");
        return;
      }

      generatedOtpRef.current = null;
      toast.success("Email verified.");
      onVerified?.();
    } finally {
      setVerifying(false);
    }
  };

  if (verified) {
    return (
      <p className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
        <CheckCircle2 size={14} /> Email verified
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {!otpSent ? (
        <button
          type="button"
          onClick={handleSend}
          disabled={!emailValid || sending}
          className="text-[12px] font-semibold text-[#24977a] hover:text-[#1d7a63] disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send verification code"}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit code"
            className="w-32 rounded-md border border-gray-300 px-2 py-1.5 text-[13px] outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying || code.length !== 6}
            className="rounded-md bg-[#24977a] px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="text-[11px] font-medium text-gray-500 hover:text-[#24977a]"
          >
            Resend
          </button>
        </div>
      )}
    </div>
  );
}
