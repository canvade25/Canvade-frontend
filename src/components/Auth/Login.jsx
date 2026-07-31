import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { ChevronLeft } from "lucide-react";

const LOGO_SRC = "/canvade.png";
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";
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

// Shared login for both students and institutes — the backend returns the
// account's role in the response, so a single form/component is enough;
// there's no need for separate per-role login pages.
export default function Login({ onLoginSuccess, onSignUpClick, successPath, onBackClick }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(() => genCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [isCaptchaRefreshing, setIsCaptchaRefreshing] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const refreshCaptcha = () => {
    if (isCaptchaRefreshing) return;
    setIsCaptchaRefreshing(true);
    globalThis.setTimeout(() => {
      setCaptchaCode((current) => genCaptcha(current));
      setCaptchaInput("");
      setIsCaptchaRefreshing(false);
    }, 180);
  };

  // Shared handling for whatever shape /api/auth/* or /api/users/* returns.
  const applyLoginResponse = (data) => {
    const roleValue = data.user?.role || data.role || "student";

    if (roleValue === "student") {
      localStorage.removeItem("token");
      localStorage.removeItem("Token");
      localStorage.removeItem("Role");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("Token", data.token);
    }

    if (roleValue) {
      localStorage.setItem("Role", roleValue);
    }

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    onLoginSuccess?.();

    if (successPath) {
      navigate(successPath);
    } else if (String(roleValue).toLowerCase() === "student") {
      navigate("/dashboard/enrollments");
    } else {
      navigate("/admin/dashboard");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!loginId || !password) {
        alert("Please enter email and password");
        return;
      }

      if (
        captchaInput.trim().toLowerCase() !==
        captchaCode.trim().toLowerCase()
      ) {
        alert("Invalid captcha");
        refreshCaptcha();
        return;
      }

      const loginPayload = JSON.stringify({
        email: loginId,
        password,
      });

      let response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: loginPayload,
      });

      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: loginPayload,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      applyLoginResponse(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google sign-in failed");
      }

      applyLoginResponse(data);
    } catch (error) {
      // Popup closed by user is not a real error — don't alert for that
      if (error?.code === "auth/popup-closed-by-user") return;

      console.error(error);
      alert(error.message || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] sm:max-w-[600px] px-4 animate-in fade-in duration-500">
      <div className="relative mb-9 flex flex-col items-center">
        <button onClick={onBackClick || onSignUpClick} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
          <ChevronLeft size={24} />
        </button>
        <img
          src={LOGO_SRC}
          alt="Canvade"
          className="h-14 w-auto object-contain"
        />
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-normal text-gray-700">
            Login ID
          </label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="Enter Your Email ID/Phone No:"
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#24977a] placeholder:text-gray-300"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-normal text-gray-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs font-medium text-[#24977a] transition hover:text-[#1d7a63]"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#24977a] placeholder:text-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {showPass ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex shrink-0 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
            <span className="select-none font-sans text-xl font-bold italic tracking-widest text-black line-through decoration-black">
              {captchaCode}
            </span>
            <button
              type="button"
              onClick={refreshCaptcha}
              disabled={isCaptchaRefreshing}
              aria-label="Refresh captcha"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-emerald-50 hover:text-[#24977a] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={isCaptchaRefreshing ? "animate-spin" : ""}
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Enter Captcha"
            className="flex-1 rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#24977a] placeholder:text-gray-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#24977a] py-3 text-base font-semibold text-white disabled:opacity-70"
        >
          Login to Your Account
        </button>
      </form>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400 uppercase">Or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="mx-auto flex h-[42px] w-[200px] items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-200 py-2 text-[13px] font-normal text-gray-600 transition hover:bg-gray-50 disabled:opacity-70"
      >
        {googleLoading ? "Signing in..." : "Sign in with Google"}
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="h-4 w-4"
        />
      </button>

      <div className="mt-10 flex flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#3a4e82]">
            Don't have an account?
          </span>
          <button
            type="button"
            onClick={onSignUpClick}
            className="rounded-full bg-[#24977a] px-6 py-1.5 text-xs font-bold text-white transition hover:bg-[#1d7a63]"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
