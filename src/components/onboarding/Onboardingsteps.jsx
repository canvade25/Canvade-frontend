import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailOtpVerifier from "../Auth/EmailOtpVerifier";
import {
  genderOptions,
  maritalOptions,
  qualificationOptions,
  employmentStatuses,
  experienceOptions,
  industryOptions,
  careerGoalOptions,
  languageOptions,
  hobbyOptions,
  skillOptions,
  sportOptions,
} from "../../constants/profileOptions";
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

// ─── shared style tokens ───────────────────────────────────────────────────
const inp =
  "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-[#24977a] focus:ring-1 focus:ring-emerald-50";

const sel = `${inp} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat`;

const lbl = "mb-2 block text-sm font-normal text-gray-700";

const InfoBanner = () => (
  <div className="mb-6 rounded-xl bg-[#F7F7F8] px-4 py-3 text-[11px] leading-relaxed text-gray-500 shadow-sm">
    <p>
      We use AI only to personalize your experience. You can add necessary
      details now for better recommendations, or skip and update them later.
    </p>
    <button className="mt-1.5 rounded-xl bg-white px-2.5 py-0.5 text-[10px] font-semibold text-gray-600">
      Fill the Details Below
    </button>
  </div>
);

// ─── Sub-step 0: Account Details ─────────────────────────────────────────

function AccountDetails({
  data,
  onChange,
  captchaCode,
  onRefreshCaptcha,
  isCaptchaRefreshing,
  showPass,
  setShowPass,
  showConfirm,
  setShowConfirm,
  acceptedTerms,
  setAcceptedTerms,
  acceptedPrivacy,
  setAcceptedPrivacy,
  emailVerified,
  onEmailVerified,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className={lbl}>Full Name</label>
        <input
          name="fullName"
          placeholder="Enter Your Full Name"
          value={data.fullName}
          onChange={onChange}
          className={inp}
        />
      </div>

      <div>
        <label className={lbl}>Email ID</label>
        <input
          name="email"
          type="email"
          placeholder="Enter Your Email ID"
          value={data.email}
          onChange={onChange}
          className={inp}
        />
        <div className="mt-1.5">
          <EmailOtpVerifier
            email={data.email}
            name={data.fullName}
            verified={emailVerified}
            onVerified={onEmailVerified}
          />
        </div>
      </div>

      <div>
        <label className={lbl}>Phone No</label>
        <input
          name="phone"
          type="tel"
          placeholder="Enter Your Permanent Phone No"
          value={data.phone}
          onChange={onChange}
          className={inp}
        />
      </div>

      <div>
        <label className={lbl}>Create Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="Enter Your Password"
            value={data.password}
            onChange={onChange}
            className={`${inp} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirm ? (
              <i className="ti ti-eye-off" aria-hidden="true" />
            ) : (
              <i className="ti ti-eye" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className={lbl}>Confirm Password</label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            value={data.confirmPassword}
            onChange={onChange}
            className={`${inp} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPass((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? (
              <i className="ti ti-eye-off" aria-hidden="true" />
            ) : (
              <i className="ti ti-eye" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className={lbl}>Captcha</label>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 min-w-[90px] items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-3  text-base font-semibold tracking-widest text-gray-700">
            {captchaCode}
          </div>
          <button
            type="button"
            onClick={onRefreshCaptcha}
            disabled={isCaptchaRefreshing}
            className="inline-flex min-w-[92px] items-center justify-center  rounded-md border border-gray-300 bg-white  py-2 text-sm font-medium text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span
              className={`h-3 w-3.5 rounded-full border-2 border-current border-t-transparent ${
                isCaptchaRefreshing ? "animate-spin opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
            <span>{isCaptchaRefreshing ? "Refreshing" : "Refresh"}</span>
          </button>
        </div>
        <input
          name="captchaInput"
          placeholder="Enter Captcha"
          value={data.captchaInput}
          onChange={onChange}
          className={inp}
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
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[#24977a]"
          >
            Terms & Conditions
          </a>
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-[13px] font-normal text-gray-600">
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(event) => setAcceptedPrivacy(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#24977a] accent-[#24977a] focus:ring-[#24977a]"
          />
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[#24977a]"
          >
            Privacy & Policy
          </a>
        </label>
      </div>
    </div>
  );
}

// ─── Sub-step A: Personal Details ─────────────────────────────────────────
function PersonalDetails({
  data,
  onChange,
  profileImagePreview,
  onImageChange,
}) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-3.5 md:gap-y-4">
      {/* Profile Image Upload */}
      <div className="col-span-2 flex flex-col items-center space-y-2 mb-1">
        <label htmlFor="profileImage" className="cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </label>
        <label
          htmlFor="profileImage"
          className="cursor-pointer text-sm text-gray-600"
        >
          Upload Profile Image
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
      </div>

      <div className="col-span-2">
        <label className={lbl}>Unique ID*</label>
        <input
          name="uniqueId"
          placeholder="ANKI453298"
          value={data.uniqueId}
          onChange={onChange}
          className={`${inp} bg-gray-200 cursor-not-allowed`}
          disabled
        />
      </div>

      <div>
        <label className={lbl}>Date of Birth*</label>
        <input
          name="dob"
          type="date"
          value={data.dob}
          onChange={onChange}
          className={inp}
        />
      </div>

      <div>
        <label className={lbl}>Gender*</label>
        <select
          name="gender"
          value={data.gender}
          onChange={onChange}
          className={sel}
        >
          <option value="">Select</option>
          {genderOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl}>Language(s)*</label>
        <select
          name="languages"
          value={data.languages}
          onChange={onChange}
          className={sel}
        >
          <option value="">Select Language</option>
          {languageOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl}>Marital Status*</label>
        <select
          name="maritalStatus"
          value={data.maritalStatus}
          onChange={onChange}
          className={sel}
        >
          <option value="">Select Status</option>
          {maritalOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="col-span-2">
        <label className={lbl}>Address*</label>

        <button
          type="button"
          className="mb-3 flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-200 px-4 py-3 text-gray-600 transition hover:bg-gray-50"
        >
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 20l-5.447-2.724A2 2 0 013 15.487V6a2 2 0 011.106-1.789l6-3a2 2 0 011.788 0l6 3A2 2 0 0119 6v9.487a2 2 0 01-1.106 1.789L13 20l-4-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 20V9l4-2v11"
            />
            <circle cx="15" cy="10" r="2" fill="currentColor" />
          </svg>
          <span className="text-[13px] font-medium">
            Select your Address Location
          </span>
        </button>

        <div className="space-y-2.5">
          <input
            name="addr_line1"
            placeholder="Address Line 1"
            value={data.addr_line1}
            onChange={onChange}
            className={inp}
          />
          <input
            name="addr_line2"
            placeholder="Address Line 2"
            value={data.addr_line2}
            onChange={onChange}
            className={inp}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="addr_city"
              placeholder="City"
              value={data.addr_city}
              onChange={onChange}
              className={inp}
            />
            <input
              name="addr_state"
              placeholder="State"
              value={data.addr_state}
              onChange={onChange}
              className={inp}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="addr_zip"
              placeholder="Zip Code"
              value={data.addr_zip}
              onChange={onChange}
              className={inp}
            />
            <select
              name="qualification"
              value={data.qualification}
              onChange={onChange}
              className={sel}
            >
              <option value="">Qualification</option>
              {qualificationOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-step B: Interests ─────────────────────────────────────────────────
const sel3 =
  "w-full rounded-md border border-gray-200 bg-white px-2.5 py-2.5 pr-8 text-sm text-gray-700 placeholder-gray-300 outline-none transition focus:border-[#24977a] focus:ring-1 focus:ring-emerald-100 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat";
const lbl3 = "mb-2 block text-sm font-normal text-gray-700";

function Interests({ data, onChange }) {
  return (
    <div className="flex flex-col gap-y-3 md:gap-y-5">
      <div>
        <label className={lbl3}>Your Hobbies</label>
        <select
          name="hobbies"
          value={data.hobbies}
          onChange={onChange}
          className={sel3}
        >
          <option value="">Select</option>
          {hobbyOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl3}>Interested Skill</label>
        <select
          name="skill"
          value={data.skill}
          onChange={onChange}
          className={sel3}
        >
          <option value="">Select</option>
          {skillOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl3}>Fitness Interests</label>
        <select
          name="fitnessInterests"
          value={data.fitnessInterests}
          onChange={onChange}
          className={sel3}
        >
          <option value="">Select</option>
          {sportOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl3}>Career Aspire</label>
        <select
          name="careerAspire"
          value={data.careerAspire}
          onChange={onChange}
          className={sel3}
        >
          <option value="">Select</option>
          {careerGoalOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl3}>Goal for Learning</label>
        <select
          name="goalForLearning"
          value={data.goalForLearning}
          onChange={onChange}
          className={sel3}
        >
          <option value="">Select</option>
          <option>Get a Job</option>
          <option>Upskill</option>
          <option>Start a Business</option>
          <option>Personal Growth</option>
          <option>Switch Career</option>
        </select>
      </div>

      <div>
        <label className={lbl3}>Learning Mode</label>
        <select
          name="learningMode"
          value={data.learningMode}
          onChange={onChange}
          className={sel3}
        >
          <option value="">Select</option>
          <option>Online</option>
          <option>Offline</option>
          <option>Hybrid</option>
        </select>
      </div>
    </div>
  );
}

// ─── Sub-step C: Career Details ────────────────────────────────────────────
const inp4 =
  "w-full rounded-md border border-gray-200 bg-white px-2.5 py-2.5 pr-8 text-sm text-gray-700 outline-none focus:border-[#24977a] focus:ring-1 focus:ring-emerald-100 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat";
const lbl4 = "mb-2 block text-sm font-normal text-gray-700";

function CareerDetails({ data, onChange }) {
  return (
    <div className="flex flex-col gap-y-2.5">
      <div>
        <label className={lbl4}>Employment Status</label>
        <select
          name="employment"
          value={data.employment}
          onChange={onChange}
          className={inp4}
        >
          <option value="">Select</option>
          {employmentStatuses.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl4}>Years of Experience</label>
        <select
          name="experience"
          value={data.experience}
          onChange={onChange}
          className={inp4}
        >
          <option value="">Select</option>
          {experienceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl4}>Designation</label>
        <select
          name="designation"
          value={data.designation}
          onChange={onChange}
          className={inp4}
        >
          <option value="">Select</option>
          <option>Intern</option>
          <option>Junior</option>
          <option>Senior</option>
          <option>Manager</option>
          <option>Director</option>
        </select>
      </div>

      <div>
        <label className={lbl4}>Industry you are working in</label>
        <select
          name="industry"
          value={data.industry}
          onChange={onChange}
          className={inp4}
        >
          <option value="">Select</option>
          {industryOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={lbl4}>Expected Next Role</label>
        <select
          name="expectedRole"
          value={data.expectedRole}
          onChange={onChange}
          className={inp4}
        >
          <option value="">Select</option>
          <option>Team Lead</option>
          <option>Manager</option>
          <option>Senior Specialist</option>
          <option>Director</option>
          <option>Entrepreneur</option>
        </select>
      </div>

      <div>
        <label className={lbl4}>Expected Salary</label>
        <select
          name="expectedSalary"
          value={data.expectedSalary}
          onChange={onChange}
          className={inp4}
        >
          <option value="">Select</option>
          <option>Below 3 LPA</option>
          <option>3–5 LPA</option>
          <option>5–10 LPA</option>
          <option>10–20 LPA</option>
          <option>20+ LPA</option>
        </select>
      </div>

      <div>
        <label className={lbl4}>
          Willingness to reskill or switch field / domain
        </label>
        <select
          name="willingToReskill"
          value={data.willingToReskill}
          onChange={onChange}
          className={inp4}
        >
          <option value="">Yes/No</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label className={lbl4}>
          In which field / domain you want to change your career
        </label>
        <select
          name="switchDomain"
          value={data.switchDomain}
          onChange={onChange}
          className={inp4}
        >
          <option value="">Select</option>
          {industryOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Main merged component ─────────────────────────────────────────────────
export default function OnboardingSteps({ back: backToAuth, parentFormData }) {
  const navigate = useNavigate();

  const [subStep, setSubStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(() => genCaptcha());
  const [isCaptchaRefreshing, setIsCaptchaRefreshing] = useState(false);

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const [formData, setFormData] = useState({
    // Account
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    captchaInput: "",
    // Personal
    uniqueId: "",
    dob: "",
    gender: "",
    languages: "",
    maritalStatus: "",
    addr_line1: "",
    addr_line2: "",
    addr_city: "",
    addr_state: "",
    addr_zip: "",
    qualification: "",
    // Interests
    hobbies: "",
    skill: "",
    fitnessInterests: "",
    careerAspire: "",
    goalForLearning: "",
    learningMode: "",
    // Career
    employment: "",
    experience: "",
    designation: "",
    industry: "",
    expectedRole: "",
    expectedSalary: "",
    willingToReskill: "",
    switchDomain: "",
  });

  const generateUniqueId = (fullName) => {
    const letters = fullName.replace(/[^A-Za-z]/g, "").toUpperCase();
    const prefix = letters.slice(0, 4).padEnd(4, "X");
    const suffix = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    return `${prefix}${suffix}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmailVerified(false);
    }
    setFormData((prev) => {
      const nextState = { ...prev, [name]: value };
      if (name === "fullName") {
        nextState.uniqueId = value ? generateUniqueId(value) : "";
      }
      return nextState;
    });
  };

  const refreshCaptcha = () => {
    if (isCaptchaRefreshing) return;
    setIsCaptchaRefreshing(true);
    globalThis.setTimeout(() => {
      setCaptchaCode((current) => genCaptcha(current));
      setFormData((current) => ({ ...current, captchaInput: "" }));
      setIsCaptchaRefreshing(false);
    }, 180);
  };

  const stepFields = {
    0: [
      "fullName",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "captchaInput",
    ],
    1: [
      "uniqueId",
      "dob",
      "gender",
      "languages",
      "maritalStatus",
      "addr_line1",
      "addr_line2",
      "addr_city",
      "addr_state",
      "addr_zip",
      "qualification",
    ],
    2: [
      "hobbies",
      "skill",
      "fitnessInterests",
      "careerAspire",
      "goalForLearning",
      "learningMode",
    ],
    3: [
      "employment",
      "experience",
      "designation",
      "industry",
      "expectedRole",
      "expectedSalary",
      "willingToReskill",
      "switchDomain",
    ],
  };

  const fieldLabels = {
    fullName: "Full Name",
    email: "Email ID",
    phone: "Phone No",
    password: "Password",
    confirmPassword: "Confirm Password",
    captchaInput: "Captcha",
    uniqueId: "Unique ID",
    dob: "Date of Birth",
    gender: "Gender",
    languages: "Language(s)",
    maritalStatus: "Marital Status",
    addr_line1: "Address Line 1",
    addr_line2: "Address Line 2",
    addr_city: "City",
    addr_state: "State",
    addr_zip: "Zip Code",
    qualification: "Qualification",
    hobbies: "Hobbies",
    skill: "Interested Skill",
    fitnessInterests: "Fitness Interests",
    careerAspire: "Career Aspire",
    goalForLearning: "Goal for Learning",
    learningMode: "Learning Mode",
    employment: "Employment Status",
    experience: "Years of Experience",
    designation: "Designation",
    industry: "Industry",
    expectedRole: "Expected Next Role",
    expectedSalary: "Expected Salary",
    willingToReskill: "Willingness to Reskill",
    switchDomain: "Career Change Domain",
  };

  const validateStep = (step) => {
    const optionalFieldsByStep = {
      1: ["addr_line2"],
      2: stepFields[2],
      3: stepFields[3],
    };
    const optionalFields = optionalFieldsByStep[step] || [];
    const missing = stepFields[step].filter((field) => {
      if (optionalFields.includes(field)) return false;
      const value = formData[field];
      return value === "" || value === null || value === undefined;
    });

    if (missing.length > 0) {
      return `Please fill: ${missing.map((field) => fieldLabels[field] || field).join(", ")}`;
    }

    if (step === 0) {
      if (formData.password !== formData.confirmPassword) {
        return "Passwords do not match.";
      }
      if (formData.captchaInput.trim().toLowerCase() !== captchaCode.toLowerCase()) {
        refreshCaptcha();
        return "Invalid captcha code.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return "Please enter a valid email address.";
      }
      if (!emailVerified) {
        return "Please verify your email address first.";
      }
      if (formData.phone.trim().length < 7) {
        return "Please enter a valid phone number.";
      }
      if (!acceptedTerms || !acceptedPrivacy) {
        return "Please accept the Terms & Conditions and Privacy Policy.";
      }
    }

    return "";
  };

  const handleNext = () => {
    const errorMessage = validateStep(subStep);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError("");
    setSubStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

      const payload = {
        email: formData.email, //parentFormData?.email || "",
        password: formData.password, //parentFormData?.password || "",
        emailVerified: true,
        displayName: parentFormData?.displayName || "",
        phoneNumber: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        languages: formData.languages ? [formData.languages] : [],
        maritalStatus: formData.maritalStatus,

        addressLine1: formData.addr_line1,
        addressLine2: formData.addr_line2,
        city: formData.addr_city,
        state: formData.addr_state,
        zipCode: formData.addr_zip,

        hobbies: formData.hobbies ? [formData.hobbies] : [],
        interestedSkill: formData.skill,
        fitnessInterests: formData.fitnessInterests,
        careerAspire: formData.careerAspire,
        goalForLearning: formData.goalForLearning,
        learningMode: formData.learningMode,

        qualification: formData.qualification,

        employmentStatus: formData.employment,
        yearsOfExperience: formData.experience,
        designation: formData.designation,
        industry: formData.industry,
        expectedNextRole: formData.expectedRole,
        expectedSalary: formData.expectedSalary,
        willingnessToReskill: formData.willingToReskill === "yes",
        careerChangeDomain: formData.switchDomain,
      };

      let response;

      if (profileImage) {
        // Image selected -> send as multipart FormData so the file reaches the backend
        const multipart = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            multipart.append(key, JSON.stringify(value));
          } else {
            multipart.append(key, value ?? "");
          }
        });
        multipart.append("profileImage", profileImage);

        response = await fetch(`${API_URL}/api/users/register`, {
          method: "POST",
          body: multipart,
        });
      } else {
        // No image -> keep original JSON flow unchanged
        response = await fetch(`${API_URL}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("Token", data.token);
      }

      const roleValue = data.user?.role || data.role || "student";
      if (roleValue) {
        localStorage.setItem("Role", roleValue);
      }

      const storedUser = data.user ? data.user : { ...data };
      if (!data.user) {
        delete storedUser.token;
        delete storedUser.Role;
        delete storedUser.role;
      }
      localStorage.setItem("user", JSON.stringify(storedUser));

      navigate("/home");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] sm:max-w-[600px] px-4 animate-in fade-in slide-in-from-right-4 duration-500 mx-auto">
      {/* Logo */}
      <div className="mb-5 flex flex-col items-center">
        <img
          src={LOGO_SRC}
          alt="Canvade"
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* Sub-step content */}
      {subStep === 0 && (
        <AccountDetails
          data={formData}
          onChange={handleChange}
          captchaCode={captchaCode}
          onRefreshCaptcha={refreshCaptcha}
          isCaptchaRefreshing={isCaptchaRefreshing}
          showPass={showPass}
          setShowPass={setShowPass}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          acceptedTerms={acceptedTerms}
          setAcceptedTerms={setAcceptedTerms}
          acceptedPrivacy={acceptedPrivacy}
          setAcceptedPrivacy={setAcceptedPrivacy}
          emailVerified={emailVerified}
          onEmailVerified={() => setEmailVerified(true)}
        />
      )}
      {subStep === 1 && (
        <PersonalDetails
          data={formData}
          onChange={handleChange}
          profileImagePreview={profileImagePreview}
          onImageChange={handleImageChange}
        />
      )}
      {subStep === 2 && <Interests data={formData} onChange={handleChange} />}
      {subStep === 3 && (
        <CareerDetails data={formData} onChange={handleChange} />
      )}

      {/* Error message */}
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-600 border border-red-100">
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div className={`flex gap-3 ${subStep === 3 ? "mt-4" : "mt-7"}`}>
        <button
          type="button"
          onClick={() => {
            if (subStep === 0) {
              if (backToAuth) backToAuth();
            } else {
              setSubStep((s) => s - 1);
            }
          }}
          disabled={loading}
          className="flex-1 rounded-xl bg-gray-200 py-2.5 text-[12px] font-medium text-gray-800 transition hover:bg-gray-300 disabled:opacity-50"
        >
          {subStep === 0 ? "Back to Login" : "Back"}
        </button>

        {subStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-[12px] font-semibold text-white shadow-md hover:bg-emerald-600 transition active:scale-95"
          >
            Save and Fill Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
          disabled={loading}
          className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-[13px] font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
            Save and Go to Site
          </button>
        )}
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// const LOGO_SRC = "/canvade.png";

// // ─── shared style tokens ───────────────────────────────────────────────────
// const inp =
//   "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-50";

// const sel = `${inp} appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat`;

// const lbl = "mb-2 block text-sm font-normal text-gray-700";

// const InfoBanner = () => (
//   <div className="mb-6 rounded-xl bg-[#F7F7F8] px-4 py-3 text-[11px] leading-relaxed text-gray-500 shadow-sm">
//     <p>
//       We use AI only to personalize your experience. You can add necessary
//       details now for better recommendations, or skip and update them later.
//     </p>
//     <button className="mt-1.5 rounded-xl bg-white px-2.5 py-0.5 text-[10px] font-semibold text-gray-600">
//       Fill the Details Below
//     </button>
//   </div>
// );

// // ─── Sub-step 0: Account Details ─────────────────────────────────────────

// function AccountDetails({
//   data,
//   onChange,
//   captchaCode,
//   onRefreshCaptcha,
//   showPass,
//   setShowPass,
//   showConfirm,
//   setShowConfirm,
//   acceptedTerms,
//   setAcceptedTerms,
//   acceptedPrivacy,
//   setAcceptedPrivacy,
// }) {
//   return (
//     <div className="space-y-4">
//       <div>
//         <label className={lbl}>Full Name</label>
//         <input
//           name="fullName"
//           placeholder="Enter Your Full Name"
//           value={data.fullName}
//           onChange={onChange}
//           className={inp}
//         />
//       </div>

//       <div>
//         <label className={lbl}>Email ID</label>
//         <input
//           name="email"
//           type="email"
//           placeholder="Enter Your Email ID"
//           value={data.email}
//           onChange={onChange}
//           className={inp}
//         />
//       </div>

//       <div>
//         <label className={lbl}>Phone No</label>
//         <input
//           name="phone"
//           type="tel"
//           placeholder="Enter Your Permanent Phone No"
//           value={data.phone}
//           onChange={onChange}
//           className={inp}
//         />
//       </div>

//       <div>
//         <label className={lbl}>Create Password</label>
//         <div className="relative">
//           <input
//             name="password"
//             type={showPass ? "text" : "password"}
//             placeholder="Enter Your Password"
//             value={data.password}
//             onChange={onChange}
//             className={`${inp} pr-10`}
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirm((prev) => !prev)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
//           >
//             {showConfirm ? (
//               <i className="ti ti-eye-off" aria-hidden="true" />
//             ) : (
//               <i className="ti ti-eye" aria-hidden="true" />
//             )}
//           </button>
//         </div>
//       </div>

//       <div>
//         <label className={lbl}>Confirm Password</label>
//         <div className="relative">
//           <input
//             name="confirmPassword"
//             type={showConfirm ? "text" : "password"}
//             placeholder="Confirm your password"
//             value={data.confirmPassword}
//             onChange={onChange}
//             className={`${inp} pr-10`}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPass((prev) => !prev)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             aria-label={showPass ? "Hide password" : "Show password"}
//           >
//             {showPass ? (
//               <i className="ti ti-eye-off" aria-hidden="true" />
//             ) : (
//               <i className="ti ti-eye" aria-hidden="true" />
//             )}
//           </button>
//         </div>
//       </div>

//       <div>
//         <label className={lbl}>Captcha</label>
//         <div className="flex items-center gap-3">
//           <div className="flex h-12 min-w-[90px] items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-3 text-base font-semibold tracking-widest text-gray-700">
//             {captchaCode}
//           </div>
//           <button
//             type="button"
//             onClick={onRefreshCaptcha}
//             className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
//           >
//             Refresh
//           </button>
//         </div>
//         <input
//           name="captchaInput"
//           placeholder="Enter Captcha"
//           value={data.captchaInput}
//           onChange={onChange}
//           className={inp}
//         />
//       </div>

//       <div className="space-y-2 pt-1">
//         <label className="flex cursor-pointer items-center gap-3 text-[13px] font-normal text-gray-600">
//           <input
//             type="checkbox"
//             checked={acceptedTerms}
//             onChange={(event) => setAcceptedTerms(event.target.checked)}
//             className="h-4 w-4 rounded border-gray-300 text-[#24977a] accent-[#24977a] focus:ring-[#24977a]"
//           />
//           <a href="/terms" className="transition hover:text-[#24977a]">
//             Terms & Conditions
//           </a>
//         </label>
//         <label className="flex cursor-pointer items-center gap-3 text-[13px] font-normal text-gray-600">
//           <input
//             type="checkbox"
//             checked={acceptedPrivacy}
//             onChange={(event) => setAcceptedPrivacy(event.target.checked)}
//             className="h-4 w-4 rounded border-gray-300 text-[#24977a] accent-[#24977a] focus:ring-[#24977a]"
//           />
//           <a href="/privacy-policy" className="transition hover:text-[#24977a]">
//             Privacy & Policy
//           </a>
//         </label>
//       </div>
//     </div>
//   );
// }

// // ─── Sub-step A: Personal Details ─────────────────────────────────────────
// function PersonalDetails({ data, onChange }) {
//   return (
//     <div className="grid grid-cols-2 gap-x-5 gap-y-3.5 md:gap-y-4">
//       <div className="col-span-2">
//         <label className={lbl}>Unique ID*</label>
//         <input
//           name="uniqueId"
//           placeholder="ANKI453298"
//           value={data.uniqueId}
//           onChange={onChange}
//           className={`${inp} bg-gray-200 cursor-not-allowed`}
//           disabled
//         />
//       </div>

//       <div>
//         <label className={lbl}>Date of Birth*</label>
//         <input
//           name="dob"
//           type="date"
//           value={data.dob}
//           onChange={onChange}
//           className={inp}
//         />
//       </div>

//       <div>
//         <label className={lbl}>Gender*</label>
//         <select
//           name="gender"
//           value={data.gender}
//           onChange={onChange}
//           className={sel}
//         >
//           <option value="">Select</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl}>Language(s)*</label>
//         <select
//           name="languages"
//           value={data.languages}
//           onChange={onChange}
//           className={sel}
//         >
//           <option value="">Select Language</option>
//           <option>Hindi</option>
//           <option>English</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl}>Marital Status*</label>
//         <select
//           name="maritalStatus"
//           value={data.maritalStatus}
//           onChange={onChange}
//           className={sel}
//         >
//           <option value="">Select Status</option>
//           <option>Single</option>
//           <option>Married</option>
//         </select>
//       </div>

//       <div className="col-span-2">
//         <label className={lbl}>Address*</label>

//         <button
//           type="button"
//           className="mb-3 flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-200 px-4 py-3 text-gray-600 transition hover:bg-gray-50"
//         >
//           <svg
//             className="h-5 w-5 text-gray-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="1.5"
//               d="M9 20l-5.447-2.724A2 2 0 013 15.487V6a2 2 0 011.106-1.789l6-3a2 2 0 011.788 0l6 3A2 2 0 0119 6v9.487a2 2 0 01-1.106 1.789L13 20l-4-2z"
//             />
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="1.5"
//               d="M9 20V9l4-2v11"
//             />
//             <circle cx="15" cy="10" r="2" fill="currentColor" />
//           </svg>
//           <span className="text-[13px] font-medium">
//             Select your Address Location
//           </span>
//         </button>

//         <div className="space-y-2.5">
//           <input
//             name="addr_line1"
//             placeholder="Address Line 1"
//             value={data.addr_line1}
//             onChange={onChange}
//             className={inp}
//           />
//           <input
//             name="addr_line2"
//             placeholder="Address Line 2"
//             value={data.addr_line2}
//             onChange={onChange}
//             className={inp}
//           />
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               name="addr_city"
//               placeholder="City"
//               value={data.addr_city}
//               onChange={onChange}
//               className={inp}
//             />
//             <input
//               name="addr_state"
//               placeholder="State"
//               value={data.addr_state}
//               onChange={onChange}
//               className={inp}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               name="addr_zip"
//               placeholder="Zip Code"
//               value={data.addr_zip}
//               onChange={onChange}
//               className={inp}
//             />
//             <select
//               name="qualification"
//               value={data.qualification}
//               onChange={onChange}
//               className={sel}
//             >
//               <option value="">Qualification</option>
//               <option>Graduate</option>
//               <option>Post Graduate</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Sub-step B: Interests ─────────────────────────────────────────────────
// const sel3 =
//   "w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 pr-8 text-[12px] text-gray-700 placeholder-gray-300 outline-none transition focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat";
// const lbl3 =
//   "mb-1.5 block text-[11px] font-semibold text-gray-600 capitalize tracking-tight";

// function Interests({ data, onChange }) {
//   return (
//     <div className="flex flex-col gap-y-3 md:gap-y-5">
//       <div>
//         <label className={lbl3}>Your Hobbies</label>
//         <select
//           name="hobbies"
//           value={data.hobbies}
//           onChange={onChange}
//           className={sel3}
//         >
//           <option value="">Select</option>
//           <option>Sports</option>
//           <option>Music</option>
//           <option>Reading</option>
//           <option>Travelling</option>
//           <option>Photography</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl3}>Interested Skill</label>
//         <select
//           name="skill"
//           value={data.skill}
//           onChange={onChange}
//           className={sel3}
//         >
//           <option value="">Select</option>
//           <option>Cooking</option>
//           <option>Management</option>
//           <option>Design</option>
//           <option>Coding</option>
//           <option>Marketing</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl3}>Fitness Interests</label>
//         <select
//           name="fitnessInterests"
//           value={data.fitnessInterests}
//           onChange={onChange}
//           className={sel3}
//         >
//           <option value="">Select</option>
//           <option>Yoga</option>
//           <option>Gym</option>
//           <option>Running</option>
//           <option>Swimming</option>
//           <option>Cycling</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl3}>Career Aspire</label>
//         <select
//           name="careerAspire"
//           value={data.careerAspire}
//           onChange={onChange}
//           className={sel3}
//         >
//           <option value="">Select</option>
//           <option>Entrepreneur</option>
//           <option>Chef</option>
//           <option>Manager</option>
//           <option>Educator</option>
//           <option>Consultant</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl3}>Goal for Learning</label>
//         <select
//           name="goalForLearning"
//           value={data.goalForLearning}
//           onChange={onChange}
//           className={sel3}
//         >
//           <option value="">Select</option>
//           <option>Get a Job</option>
//           <option>Upskill</option>
//           <option>Start a Business</option>
//           <option>Personal Growth</option>
//           <option>Switch Career</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl3}>Learning Mode</label>
//         <select
//           name="learningMode"
//           value={data.learningMode}
//           onChange={onChange}
//           className={sel3}
//         >
//           <option value="">Select</option>
//           <option>Online</option>
//           <option>Offline</option>
//           <option>Hybrid</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// // ─── Sub-step C: Career Details ────────────────────────────────────────────
// const inp4 =
//   "w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 pr-8 text-[12px] text-gray-700 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_10px_center] bg-no-repeat";
// const lbl4 = "mb-0.5 block text-[11px] font-medium text-gray-600";

// function CareerDetails({ data, onChange }) {
//   return (
//     <div className="flex flex-col gap-y-2.5">
//       <div>
//         <label className={lbl4}>Employment Status</label>
//         <select
//           name="employment"
//           value={data.employment}
//           onChange={onChange}
//           className={inp4}
//         >
//           <option value="">Select</option>
//           <option>Student</option>
//           <option>Employed</option>
//           <option>Self Employed</option>
//           <option>Freelancer</option>
//           <option>Unemployed</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl4}>Years of Experience</label>
//         <select
//           name="experience"
//           value={data.experience}
//           onChange={onChange}
//           className={inp4}
//         >
//           <option value="">Select</option>
//           <option value="0">0-1 years</option>
//           <option value="1">1-3 years</option>
//           <option value="3">3-5 years</option>
//           <option value="5">5-10 years</option>
//           <option value="10">10+ years</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl4}>Designation</label>
//         <select
//           name="designation"
//           value={data.designation}
//           onChange={onChange}
//           className={inp4}
//         >
//           <option value="">Select</option>
//           <option>Intern</option>
//           <option>Junior</option>
//           <option>Senior</option>
//           <option>Manager</option>
//           <option>Director</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl4}>Industry you are working in</label>
//         <select
//           name="industry"
//           value={data.industry}
//           onChange={onChange}
//           className={inp4}
//         >
//           <option value="">Select</option>
//           <option>Hospitality</option>
//           <option>Technology</option>
//           <option>Finance</option>
//           <option>Healthcare</option>
//           <option>Education</option>
//           <option>Retail</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl4}>Expected Next Role</label>
//         <select
//           name="expectedRole"
//           value={data.expectedRole}
//           onChange={onChange}
//           className={inp4}
//         >
//           <option value="">Select</option>
//           <option>Team Lead</option>
//           <option>Manager</option>
//           <option>Senior Specialist</option>
//           <option>Director</option>
//           <option>Entrepreneur</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl4}>Expected Salary</label>
//         <select
//           name="expectedSalary"
//           value={data.expectedSalary}
//           onChange={onChange}
//           className={inp4}
//         >
//           <option value="">Select</option>
//           <option>Below 3 LPA</option>
//           <option>3–5 LPA</option>
//           <option>5–10 LPA</option>
//           <option>10–20 LPA</option>
//           <option>20+ LPA</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl4}>
//           Willingness to reskill or switch field / domain
//         </label>
//         <select
//           name="willingToReskill"
//           value={data.willingToReskill}
//           onChange={onChange}
//           className={inp4}
//         >
//           <option value="">Yes/No</option>
//           <option value="yes">Yes</option>
//           <option value="no">No</option>
//         </select>
//       </div>

//       <div>
//         <label className={lbl4}>
//           In which field / domain you want to change your career
//         </label>
//         <select
//           name="switchDomain"
//           value={data.switchDomain}
//           onChange={onChange}
//           className={inp4}
//         >
//           <option value="">Select</option>
//           <option>Hospitality</option>
//           <option>Technology</option>
//           <option>Finance</option>
//           <option>Healthcare</option>
//           <option>Education</option>
//           <option>Culinary Arts</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// // ─── Main merged component ─────────────────────────────────────────────────
// export default function OnboardingSteps({ back: backToAuth, parentFormData }) {
//   const navigate = useNavigate();

//   const [subStep, setSubStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [acceptedTerms, setAcceptedTerms] = useState(false);
//   const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
//   const [captchaCode, setCaptchaCode] = useState("00000");

//   const [formData, setFormData] = useState({
//     // Account
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     captchaInput: "",
//     // Personal
//     uniqueId: "",
//     dob: "",
//     gender: "",
//     languages: "",
//     maritalStatus: "",
//     addr_line1: "",
//     addr_line2: "",
//     addr_city: "",
//     addr_state: "",
//     addr_zip: "",
//     qualification: "",
//     // Interests
//     hobbies: "",
//     skill: "",
//     fitnessInterests: "",
//     careerAspire: "",
//     goalForLearning: "",
//     learningMode: "",
//     // Career
//     employment: "",
//     experience: "",
//     designation: "",
//     industry: "",
//     expectedRole: "",
//     expectedSalary: "",
//     willingToReskill: "",
//     switchDomain: "",
//   });

//   const generateUniqueId = (fullName) => {
//     const letters = fullName.replace(/[^A-Za-z]/g, "").toUpperCase();
//     const prefix = letters.slice(0, 4).padEnd(4, "X");
//     const suffix = Array.from({ length: 6 }, () =>
//       Math.floor(Math.random() * 10),
//     ).join("");
//     return `${prefix}${suffix}`;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const nextState = { ...prev, [name]: value };
//       if (name === "fullName") {
//         nextState.uniqueId = value ? generateUniqueId(value) : "";
//       }
//       return nextState;
//     });
//   };

//   const refreshCaptcha = () => {
//     const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
//     setCaptchaCode(
//       Array.from(
//         { length: 5 },
//         () => chars[Math.floor(Math.random() * chars.length)],
//       ).join(""),
//     );
//   };

//   useEffect(() => {
//     refreshCaptcha();
//   }, []);

//   const stepFields = {
//     0: [
//       "fullName",
//       "email",
//       "phone",
//       "password",
//       "confirmPassword",
//       "captchaInput",
//     ],
//     1: [
//       "uniqueId",
//       "dob",
//       "gender",
//       "languages",
//       "maritalStatus",
//       "addr_line1",
//       "addr_line2",
//       "addr_city",
//       "addr_state",
//       "addr_zip",
//       "qualification",
//     ],
//     2: [
//       "hobbies",
//       "skill",
//       "fitnessInterests",
//       "careerAspire",
//       "goalForLearning",
//       "learningMode",
//     ],
//     3: [
//       "employment",
//       "experience",
//       "designation",
//       "industry",
//       "expectedRole",
//       "expectedSalary",
//       "willingToReskill",
//       "switchDomain",
//     ],
//   };

//   const fieldLabels = {
//     fullName: "Full Name",
//     email: "Email ID",
//     phone: "Phone No",
//     password: "Password",
//     confirmPassword: "Confirm Password",
//     captchaInput: "Captcha",
//     uniqueId: "Unique ID",
//     dob: "Date of Birth",
//     gender: "Gender",
//     languages: "Language(s)",
//     maritalStatus: "Marital Status",
//     addr_line1: "Address Line 1",
//     addr_line2: "Address Line 2",
//     addr_city: "City",
//     addr_state: "State",
//     addr_zip: "Zip Code",
//     qualification: "Qualification",
//     hobbies: "Hobbies",
//     skill: "Interested Skill",
//     fitnessInterests: "Fitness Interests",
//     careerAspire: "Career Aspire",
//     goalForLearning: "Goal for Learning",
//     learningMode: "Learning Mode",
//     employment: "Employment Status",
//     experience: "Years of Experience",
//     designation: "Designation",
//     industry: "Industry",
//     expectedRole: "Expected Next Role",
//     expectedSalary: "Expected Salary",
//     willingToReskill: "Willingness to Reskill",
//     switchDomain: "Career Change Domain",
//   };

//   const validateStep = (step) => {
//     const optionalFieldsByStep = {
//       1: ["addr_line2"],
//       2: stepFields[2],
//       3: stepFields[3],
//     };
//     const optionalFields = optionalFieldsByStep[step] || [];
//     const missing = stepFields[step].filter((field) => {
//       if (optionalFields.includes(field)) return false;
//       const value = formData[field];
//       return value === "" || value === null || value === undefined;
//     });

//     if (missing.length > 0) {
//       return `Please fill: ${missing.map((field) => fieldLabels[field] || field).join(", ")}`;
//     }

//     if (step === 0) {
//       if (formData.password !== formData.confirmPassword) {
//         return "Passwords do not match.";
//       }
//       if (formData.captchaInput.trim() !== captchaCode) {
//         return "Invalid captcha code.";
//       }
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//         return "Please enter a valid email address.";
//       }
//       if (formData.phone.trim().length < 7) {
//         return "Please enter a valid phone number.";
//       }
//       if (!acceptedTerms || !acceptedPrivacy) {
//         return "Please accept the Terms & Conditions and Privacy Policy.";
//       }
//     }

//     return "";
//   };

//   const handleNext = () => {
//     const errorMessage = validateStep(subStep);
//     if (errorMessage) {
//       setError(errorMessage);
//       return;
//     }

//     setError("");
//     setSubStep((s) => s + 1);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const API_URL = import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

//       const payload = {
//         email: formData.email, //parentFormData?.email || "",
//         password: formData.password, //parentFormData?.password || "",
//         displayName: parentFormData?.displayName || "",
//         phoneNumber: formData.phone,
//         dob: formData.dob,
//         gender: formData.gender,
//         languages: formData.languages ? [formData.languages] : [],
//         maritalStatus: formData.maritalStatus,

//         addressLine1: formData.addr_line1,
//         addressLine2: formData.addr_line2,
//         city: formData.addr_city,
//         state: formData.addr_state,
//         zipCode: formData.addr_zip,

//         hobbies: formData.hobbies ? [formData.hobbies] : [],
//         interestedSkill: formData.skill,
//         fitnessInterests: formData.fitnessInterests,
//         careerAspire: formData.careerAspire,
//         goalForLearning: formData.goalForLearning,
//         learningMode: formData.learningMode,

//         qualification: formData.qualification,

//         employmentStatus: formData.employment,
//         yearsOfExperience: formData.experience,
//         designation: formData.designation,
//         industry: formData.industry,
//         expectedNextRole: formData.expectedRole,
//         expectedSalary: formData.expectedSalary,
//         willingnessToReskill: formData.willingToReskill === "yes",
//         careerChangeDomain: formData.switchDomain,
//       };

//       const response = await fetch(`${API_URL}/api/users/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       if (data.token) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("Token", data.token);
//       }

//       const roleValue = data.user?.role || data.role || "student";
//       if (roleValue) {
//         localStorage.setItem("Role", roleValue);
//       }

//       const storedUser = data.user ? data.user : { ...data };
//       if (!data.user) {
//         delete storedUser.token;
//         delete storedUser.Role;
//         delete storedUser.role;
//       }
//       localStorage.setItem("user", JSON.stringify(storedUser));

//       navigate("/home");
//     } catch (err) {
//       setError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logoHeights = ["h-9", "h-10", "h-10"];

//   return (
//     <div className="w-full max-w-[360px] sm:max-w-[600px] px-4 animate-in fade-in slide-in-from-right-4 duration-500 mx-auto">
//       {/* Logo */}
//       <div className="mb-5 flex flex-col items-center">
//         <img
//           src={LOGO_SRC}
//           alt="Canvade"
//           className={`${logoHeights[subStep]} w-auto object-contain`}
//         />
//       </div>

//       {/* Sub-step content */}
//       {subStep === 0 && (
//         <AccountDetails
//           data={formData}
//           onChange={handleChange}
//           captchaCode={captchaCode}
//           onRefreshCaptcha={refreshCaptcha}
//           showPass={showPass}
//           setShowPass={setShowPass}
//           showConfirm={showConfirm}
//           setShowConfirm={setShowConfirm}
//           acceptedTerms={acceptedTerms}
//           setAcceptedTerms={setAcceptedTerms}
//           acceptedPrivacy={acceptedPrivacy}
//           setAcceptedPrivacy={setAcceptedPrivacy}
//         />
//       )}
//       {subStep === 1 && (
//         <PersonalDetails data={formData} onChange={handleChange} />
//       )}
//       {subStep === 2 && <Interests data={formData} onChange={handleChange} />}
//       {subStep === 3 && (
//         <CareerDetails data={formData} onChange={handleChange} />
//       )}

//       {/* Error message */}
//       {error && (
//         <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-600 border border-red-100">
//           {error}
//         </p>
//       )}

//       {/* Action buttons */}
//       <div className={`flex gap-3 ${subStep === 3 ? "mt-4" : "mt-7"}`}>
//         <button
//           type="button"
//           onClick={() => {
//             if (subStep === 0) {
//               if (backToAuth) backToAuth();
//             } else {
//               setSubStep((s) => s - 1);
//             }
//           }}
//           disabled={loading}
//           className="flex-1 rounded-xl bg-gray-200 py-2.5 text-[12px] font-medium text-gray-800 transition hover:bg-gray-300 disabled:opacity-50"
//         >
//           {subStep === 0 ? "Back to Login" : "Back"}
//         </button>

//         {subStep < 3 ? (
//           <button
//             type="button"
//             onClick={handleNext}
//             className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-[12px] font-semibold text-white shadow-md hover:bg-emerald-600 transition active:scale-95"
//           >
//             Save and Fill Next
//           </button>
//         ) : (
//           <button
//             type="button"
//             onClick={handleSubmit}
//           disabled={loading}
//           className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-[13px] font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
//         >
//             Save and Go to Site
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
