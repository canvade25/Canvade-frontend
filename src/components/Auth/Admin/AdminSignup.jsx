import { useState } from "react";
import { FiEye, FiEyeOff, FiRefreshCw } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import EmailOtpVerifier from "../EmailOtpVerifier";

const LOGO_SRC = "/canvade.png";
const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
const getRandomIndex = (max) => {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] % max;
  }
  return Math.floor(Math.random() * max);
};
const genCaptcha = (previous = "") => {
  let next = "";
  do {
    next = Array.from(
      { length: 5 },
      () => CAPTCHA_CHARS[getRandomIndex(CAPTCHA_CHARS.length)],
    ).join("");
  } while (next === previous);
  return next;
};
const handleGoogleSignup = () => {
  console.log("Google signup clicked");
};

export default function Signup({ switchToLogin, onSignupSuccess, switchToSelect }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaCode, setCaptchaCode] = useState(() => genCaptcha());
  const [isCaptchaRefreshing, setIsCaptchaRefreshing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  const refreshCaptcha = () => {
    if (isCaptchaRefreshing) return;
    setIsCaptchaRefreshing(true);
    globalThis.setTimeout(() => {
      setCaptchaCode((current) => genCaptcha(current));
      setCaptcha("");
      setIsCaptchaRefreshing(false);
    }, 180);
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !confirm || !captcha) {
      alert("Please fill in all required fields including Captcha.");
      return;
    }

    if (!emailVerified) {
      alert("Please verify your email address first.");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    if (captcha.trim().toLowerCase() !== captchaCode.trim().toLowerCase()) {
      alert("Invalid captcha.");
      refreshCaptcha();
      return;
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      alert("Please accept the Terms & Conditions and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";
      const response = await fetch(`${baseUrl}/api/institute/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber: phone,
          password,
          confirmPassword: confirm,
          emailVerified: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("Token", data.token);
      }

      const roleValue = data.user?.role || data.role || "admin";
      if (roleValue) {
        localStorage.setItem("Role", roleValue);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      console.log("Signup success:", data);

      if (onSignupSuccess) {
        onSignupSuccess(data);
      } else {
        navigate("/institute/onboarding");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#24977a] placeholder:text-gray-300";

  const labelCls = "mb-2 block text-sm font-normal text-gray-700";

  return (
    <div className="mx-auto my-10 w-full max-w-[400px] sm:max-w-[600px] bg-white px-4 py-8">
      <div className="relative mb-6 flex flex-col items-center text-center">
        <button onClick={switchToSelect} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
          <ChevronLeft size={24} />
        </button>
        <img
          src={LOGO_SRC}
          alt="Canvade"
          className="h-14 w-auto object-contain"
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className={labelCls}>Registered Institution Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Institution Name"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Email ID</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailVerified(false);
            }}
            placeholder="Email Address"
            className={inputCls}
          />
          <div className="mt-1.5">
            <EmailOtpVerifier
              email={email}
              verified={emailVerified}
              onVerified={() => setEmailVerified(true)}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Phone No:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className={inputCls}
          />
        </div>

        <div className="space-y-2">
          <label className={labelCls}>Create Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`${inputCls} pr-10`}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              type="button"
            >
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm Password"
              className={`${inputCls} pr-10 ${
                confirm && confirm !== password ? "border-red-400" : ""
              }`}
            />
            <button
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              type="button"
            >
              {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-24 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-50 px-2">
            <span className="select-none text-md tracking-tighter text-gray-500 line-through font-sans italic font-normal">
              {captchaCode}
            </span>
            <button
              type="button"
              onClick={refreshCaptcha}
              disabled={isCaptchaRefreshing}
              aria-label="Refresh captcha"
              className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiRefreshCw size={12} className={isCaptchaRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
          <input
            type="text"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            placeholder="Captcha"
            className="h-9 w-full rounded border border-gray-300 px-3 text-sm outline-none focus:border-[#24977a]"
          />
        </div>

        <div className="space-y-2 pt-1">
          <label className="flex cursor-pointer items-center gap-3 text-[13px] font-normal text-gray-600">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#24977a] accent-[#24977a] focus:ring-[#24977a]"
            />
            <span>
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#24977a]"
              >
                Terms & Conditions
              </a>
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-[13px] font-normal text-gray-600">
            <input
              type="checkbox"
              checked={acceptedPrivacy}
              onChange={(event) => setAcceptedPrivacy(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#24977a] accent-[#24977a] focus:ring-[#24977a]"
            />
            <span>
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#24977a]"
              >
                Privacy & Policy
              </a>
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSignup}
          disabled={loading || !acceptedTerms || !acceptedPrivacy || !emailVerified}
          className="mt-2 w-full rounded-md bg-[#24977a] py-2 text-[14px] font-normal text-white transition hover:bg-[#1d7a63] active:scale-[0.98] disabled:opacity-70"
        >
          Sign up to Your Account
        </button>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-[10px] font-normal text-gray-500 uppercase">
            OR
          </span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
        className="mx-auto flex h-[42px] w-[200px] items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-200 py-2 text-[13px] font-normal text-gray-600 transition hover:bg-gray-50"
        >
          Sign in with Google
          <FcGoogle size={16} />
        </button>

        <div className="pt-2">
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
            <span className="text-[13px] sm:text-[14px] font-normal text-[#3a4e82] whitespace-nowrap">
              Already have an account?
            </span>
            <button
              onClick={switchToLogin}
              className="rounded-full bg-[#24977a] px-4 py-1.5 text-[12px] sm:text-[14px] font-normal text-white transition hover:bg-[#1d7a63] active:scale-95 whitespace-nowrap"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
