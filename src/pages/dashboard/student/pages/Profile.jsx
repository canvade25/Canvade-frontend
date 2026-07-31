import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Bell,
  Briefcase,
  Camera,
  CheckCircle2,
  ChevronDown,
  Loader2,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getProfile, updateProfile } from "../../../../../api/userApi.js";
import { auth } from "../../../../firebase.js";
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
} from "../../../../constants/profileOptions.js";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const generateOtpCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

// Accepts "98765 43210", "+91 98765 43210", etc. Defaults to India (+91)
// when no country code is present, since that's this app's primary market.
const toE164 = (value) => {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  return `+91${digits}`;
};

const preferenceRows = [
  "Course Updates",
  "WhatsApp notifications",
  // "Admission Alerts",
  // "Scholarship Alerts",
  "Career Recommendations",
  "Marketing Emails",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium  outline-none transition focus:border-[#1D9B7E] focus:ring-4 focus:ring-[#1D9B7E]/10 placeholder:text-slate-300";

const labelClass = "mb-2 block text-[13px] font-bold text-slate-700";

const Section = ({ icon: Icon, title, description, children }) => (
  <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F6F2] text-[#1D9B7E]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>
    </div>
    {children}
  </section>
);

const Field = ({ label, children, className = "", trailing }) => (
  <label className={className}>
    <div className="mb-2 flex items-center justify-between gap-2">
      <span className="block text-[13px] font-bold text-slate-700">{label}</span>
      {trailing}
    </div>
    {children}
  </label>
);

const VerifyBadge = ({ verified }) =>
  verified ? (
    <span className="inline-flex items-center gap-1 text-xs font-black text-[#1D9B7E]">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Verified
    </span>
  ) : (
    // Commented out "Unverified" badge for now
    null
    /*
    <span className="inline-flex items-center gap-1 text-xs font-black text-amber-500">
      <BadgeCheck className="h-3.5 w-3.5" />
      Unverified
    </span>
    */
  );

const TextInput = (props) => (
  <input className={`${inputClass} text-slate-700`} {...props} />
);

const SelectInput = ({
  children,
  className = "",
  value,
  defaultValue = "",
  onChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const handleChange = (event) => {
    if (value === undefined) setInternalValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div className="relative">
      <select
        className={`${inputClass} appearance-none pr-10 ${
          currentValue ? "text-slate-700" : "text-slate-300"
        } ${className}`}
        value={currentValue}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
};

const ChipSelector = ({
  label,
  options,
  selected,
  onChange,
  max,
  otherValue = "",
  onOtherValueChange,
}) => {
  const allDisplayOptions = useMemo(() => {
    const combined = new Set([...options, ...selected]);
    const allItems = Array.from(combined);
    if (allItems.includes("Other")) {
      // Move "Other" to the end of the array if it exists
      return [...allItems.filter((item) => item !== "Other"), "Other"];
    }
    return allItems;
  }, [options, selected]);

  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
      if (option === "Other" && onOtherValueChange) onOtherValueChange("");
      return;
    }

    if (selected.length >= max) return;
    onChange([...selected, option]);
  };

  const handleAddOther = () => {
    if (otherValue.trim() && selected.length <= max) {
      // Create a new array without "Other", add the new value.
      const newSelected = selected.filter((item) => item !== "Other");
      onChange([...newSelected, otherValue.trim()]);
      onOtherValueChange(""); // Clear the input
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={labelClass}>{label}</span>
        <span className="text-xs font-bold text-slate-400">
          {selected.length}/{max}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allDisplayOptions.map((option) => {
          const isSelected = selected.includes(option);
          const isDisabled = !isSelected && selected.length >= max;

          // Don't render a button for a custom item that has been deselected.
          if (!isSelected && !options.includes(option)) {
            return null;
          }

          return (
            <button
              key={option}
              type="button"
              disabled={isDisabled}
              onClick={() => toggle(option)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                isSelected
                  ? "border-[#1D9B7E] bg-[#1D9B7E] text-white"
                  : isDisabled
                    ? "border-slate-100 bg-slate-50 text-slate-300"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#1D9B7E] hover:text-[#1D9B7E]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected.includes("Other") && onOtherValueChange && (
        <div className="mt-3 flex max-w-md gap-2">
          <input
            className={inputClass}
            value={otherValue}
            onChange={(event) => onOtherValueChange(event.target.value)}
            placeholder={`Add other ${label
              .replace(/\(.*?\)/g, "")
              .trim()
              .toLowerCase()}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddOther();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddOther}
            className="shrink-0 rounded-xl bg-[#1D9B7E] px-4 text-sm font-bold text-white transition hover:bg-[#17886f]"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

const LanguageSelector = ({ selected, onChange, max = 4 }) => {
  const availableOptions = languageOptions.filter(
    (option) => !selected.includes(option),
  );

  const addLanguage = (event) => {
    const value = event.target.value;
    if (!value || selected.length >= max) return;
    onChange([...selected, value]);
    event.target.value = "";
  };

  const removeLanguage = (language) => {
    onChange(selected.filter((item) => item !== language));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={labelClass}>Languages Known</span>
        <span className="text-xs font-bold text-slate-400">
          {selected.length}/{max}
        </span>
      </div>
      <SelectInput
        value=""
        onChange={addLanguage}
        disabled={selected.length >= max}
      >
        <option value="" disabled>
          {selected.length >= max
            ? "Maximum 4 languages selected"
            : "Select language"}
        </option>
        {availableOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectInput>
      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((language) => (
            <span
              key={language}
              className="inline-flex items-center gap-2 rounded-full border border-[#1D9B7E]/25 bg-[#E8F6F2] px-3 py-1.5 text-xs font-bold text-[#1D9B7E]"
            >
              {language}
              <button
                type="button"
                onClick={() => removeLanguage(language)}
                className="text-sm leading-none text-[#1D9B7E] transition hover:text-red-500"
                aria-label={`Remove ${language}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition ${
      checked ? "bg-[#1D9B7E]" : "bg-slate-200"
    }`}
    aria-pressed={checked}
  >
    <span
      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

const emptyFormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  addressLine1: "",
  addressLine2: "",
  country: "",
  state: "",
  city: "",
  zipCode: "",
  qualification: "",
  employmentStatus: "",
  yearsOfExperience: "",
  designation: "",
  industry: "",
  careerChangeDomain: "",
  careerAspire: "",
};

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(emptyFormData);
  const [hasEmployment, setHasEmployment] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [sports, setSports] = useState([]);
  const [otherHobby, setOtherHobby] = useState("");
  const [otherSkill, setOtherSkill] = useState("");
  const [otherSport, setOtherSport] = useState("");
  const [preferences, setPreferences] = useState(
    Object.fromEntries(preferenceRows.map((row) => [row, true])),
  );

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Email verification (EmailJS)
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [emailOtpBusy, setEmailOtpBusy] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState("");
  const generatedEmailOtpRef = useRef(null); // { code, expiresAt }

  // Mobile verification (Firebase Phone Auth)
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpInput, setPhoneOtpInput] = useState("");
  const [phoneOtpBusy, setPhoneOtpBusy] = useState(false);
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const confirmationResultRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getProfile();
        if (response?.success) {
          const data = response.data || {};

          setFormData({
            fullName: data.displayName || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            dob: data.personalInfo?.dob || "",
            gender: data.personalInfo?.gender || "",
            maritalStatus: data.personalInfo?.maritalStatus || "",
            addressLine1: data.address?.addressLine1 || "",
            addressLine2: data.address?.addressLine2 || "",
            country: data.address?.country || "",
            state: data.address?.state || "",
            city: data.address?.city || "",
            zipCode: data.address?.zipCode || "",
            qualification: data.career?.qualification || "",
            employmentStatus: data.career?.employmentStatus || "",
            yearsOfExperience: data.career?.yearsOfExperience || "",
            designation: data.career?.designation || "",
            industry: data.career?.industry || "",
            careerChangeDomain: data.career?.careerChangeDomain || "",
            careerAspire: data.interests?.careerAspire || "",
          });
          setLanguages(data.personalInfo?.languages || []);
          setHobbies(data.interests?.hobbies || []);
          setSkills(data.interests?.interestedSkill || []);
          setSports(data.interests?.fitnessInterests || []);
          setHasEmployment(Boolean(data.career?.employmentStatus));
          setEmailVerified(Boolean(data.verification?.emailVerified));
          setPhoneVerified(Boolean(data.verification?.phoneVerified));
          if (data.profileImage) setPhotoPreview(data.profileImage);
        } else {
          toast.error(response?.message || "Unable to load profile");
        }
      } catch (error) {
        console.error("Get profile failed:", error);
        toast.error("Unable to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = (key) => (event) =>
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePhoto(file);
      // To avoid memory leaks, revoke the previous object URL if it exists.
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dob: formData.dob,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zipCode: formData.zipCode,
        qualification: formData.qualification,
        employmentStatus: hasEmployment ? formData.employmentStatus : "",
        yearsOfExperience: hasEmployment ? formData.yearsOfExperience : "",
        designation: hasEmployment ? formData.designation : "",
        industry: hasEmployment ? formData.industry : "",
        careerChangeDomain: hasEmployment ? formData.careerChangeDomain : "",
        careerAspire: hasEmployment ? formData.careerAspire : "",
        languages,
        hobbies,
        interestedSkill: skills,
        fitnessInterests: sports,
        ...(profilePhoto ? { profileImage: profilePhoto } : {}),
      });
      toast.success("Profile saved");
    } catch (error) {
      console.error("Save profile failed:", error);
      toast.error(error?.response?.data?.message || "Unable to save profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const persistVerification = async (fields) => {
    try {
      await updateProfile(fields);
    } catch (error) {
      console.error("Failed to persist verification status:", error);
      toast.error("Verified, but couldn't save that — it may not persist on reload.");
    }
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      toast.error("Add an email address first");
      return;
    }
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error("Email verification isn't configured yet (missing EmailJS keys)");
      return;
    }

    setEmailOtpBusy(true);
    setEmailOtpError("");
    try {
      const code = generateOtpCode();
      generatedEmailOtpRef.current = { code, expiresAt: Date.now() + 10 * 60 * 1000 };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { to_email: formData.email, to_name: formData.fullName || "there", otp_code: code },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );

      setEmailOtpSent(true);
      toast.success("Verification code sent to your email");
    } catch (error) {
      console.error("EmailJS send failed:", error);
      toast.error("Couldn't send verification email. Try again.");
    } finally {
      setEmailOtpBusy(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const record = generatedEmailOtpRef.current;
    if (!record) {
      setEmailOtpError("Send a code first");
      return;
    }
    if (Date.now() > record.expiresAt) {
      setEmailOtpError("Code expired. Send a new one.");
      return;
    }
    if (emailOtpInput.trim() !== record.code) {
      setEmailOtpError("Incorrect code");
      return;
    }

    generatedEmailOtpRef.current = null;
    setEmailVerified(true);
    setEmailOtpSent(false);
    setEmailOtpInput("");
    setEmailOtpError("");
    toast.success("Email verified");
    await persistVerification({ emailVerified: true });
  };

  const ensureRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
    return recaptchaVerifierRef.current;
  };

  const handleSendPhoneOtp = async () => {
    if (!formData.phoneNumber) {
      toast.error("Add a mobile number first");
      return;
    }

    setPhoneOtpBusy(true);
    setPhoneOtpError("");
    try {
      const verifier = ensureRecaptcha();
      confirmationResultRef.current = await signInWithPhoneNumber(
        auth,
        toE164(formData.phoneNumber),
        verifier,
      );
      setPhoneOtpSent(true);
      toast.success("OTP sent to your mobile number");
    } catch (error) {
      console.error("Firebase phone OTP send failed:", error);
      toast.error(error?.message || "Couldn't send OTP. Try again.");
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    } finally {
      setPhoneOtpBusy(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!confirmationResultRef.current) {
      setPhoneOtpError("Send a code first");
      return;
    }

    setPhoneOtpBusy(true);
    setPhoneOtpError("");
    try {
      await confirmationResultRef.current.confirm(phoneOtpInput.trim());
      confirmationResultRef.current = null;
      setPhoneVerified(true);
      setPhoneOtpSent(false);
      setPhoneOtpInput("");
      toast.success("Mobile number verified");
      await persistVerification({ phoneVerified: true });
    } catch (error) {
      console.error("Firebase phone OTP verify failed:", error);
      setPhoneOtpError("Incorrect or expired code");
    } finally {
      setPhoneOtpBusy(false);
    }
  };

  const completion = useMemo(() => {
    const score =
      38 +
      languages.length * 4 +
      hobbies.length * 4 +
      skills.length * 4 +
      sports.length * 3 +
      (hasEmployment ? 10 : 0);
    return Math.min(score, 94);
  }, [
    hasEmployment,
    hobbies.length,
    languages.length,
    skills.length,
    sports.length,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1D9B7E]" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1D9B7E]">
              Student Profile
            </p>
            <h1 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
              Profile & Verification
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Keep your learning profile current so Canvade can personalize
              course discovery, enquiries, and recommendations.
            </p>
          </div> */}

          <div className="w-full rounded-2xl bg-slate-50 p-4 lg:w-[full]">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                Profile Completion
              </span>
              <span className="text-sm font-black text-[#1D9B7E]">
                {completion}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[#1D9B7E]"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Section
        icon={User}
        title="Personal Information"
        description="Basic identity details used for communication and enrollment."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#1D9B7E] shadow-sm">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile Preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Camera className="h-7 w-7" />
              )}
            </div>
            <input
              type="file"
              id="profilePhotoInput"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <label
              htmlFor="profilePhotoInput"
              className="mt-4 cursor-pointer rounded-full border border-[#1D9B7E] px-4 py-2 text-xs font-bold text-[#1D9B7E] transition hover:bg-[#1D9B7E] hover:text-white"
            >
              {photoPreview ? "Change Photo" : "Upload Photo"}
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Full Name">
              <TextInput
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={updateField("fullName")}
              />
            </Field>
            <Field
              label="Email Address"
              trailing={<VerifyBadge verified={emailVerified} />}
            >
              <TextInput
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                readOnly
              />
              {!emailVerified && (
                <div className="mt-2">
                  {emailOtpSent ? (
                    <div className="space-y-2">
                      <input
                        className={inputClass}
                        placeholder="Enter 6-digit code"
                        value={emailOtpInput}
                        maxLength={6}
                        onChange={(event) => {
                          setEmailOtpInput(event.target.value);
                          setEmailOtpError("");
                        }}
                      />
                      {emailOtpError && (
                        <p className="text-xs font-semibold text-red-500">{emailOtpError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleVerifyEmailOtp}
                          disabled={emailOtpBusy}
                          className="rounded-lg bg-[#1D9B7E] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#17886f] disabled:opacity-60"
                        >
                          Confirm Code
                        </button>
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={emailOtpBusy}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-[#1D9B7E] hover:text-[#1D9B7E] disabled:opacity-60"
                        >
                          Resend
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={emailOtpBusy}
                      className="text-xs font-black text-[#1D9B7E] transition hover:underline disabled:opacity-60"
                    >
                      {emailOtpBusy ? "Sending..." : "Verify Email"}
                    </button>
                  )}
                </div>
              )}
            </Field>
            <Field
              label="Mobile Number"
              trailing={<VerifyBadge verified={phoneVerified} />}
            >
              <TextInput
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phoneNumber}
                onChange={updateField("phoneNumber")}
              />
              {/* Commented out "Verify Mobile" verification block for now
              {!phoneVerified && (
                <div className="mt-2">
                  {phoneOtpSent ? (
                    <div className="space-y-2">
                      <input
                        className={inputClass}
                        placeholder="Enter OTP"
                        value={phoneOtpInput}
                        maxLength={6}
                        onChange={(event) => {
                          setPhoneOtpInput(event.target.value);
                          setPhoneOtpError("");
                        }}
                      />
                      {phoneOtpError && (
                        <p className="text-xs font-semibold text-red-500">{phoneOtpError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleVerifyPhoneOtp}
                          disabled={phoneOtpBusy}
                          className="rounded-lg bg-[#1D9B7E] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#17886f] disabled:opacity-60"
                        >
                          Confirm Code
                        </button>
                        <button
                          type="button"
                          onClick={handleSendPhoneOtp}
                          disabled={phoneOtpBusy}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-[#1D9B7E] hover:text-[#1D9B7E] disabled:opacity-60"
                        >
                          Resend
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={phoneOtpBusy}
                      className="text-xs font-black text-[#1D9B7E] transition hover:underline disabled:opacity-60"
                    >
                      {phoneOtpBusy ? "Sending..." : "Verify Mobile"}
                    </button>
                  )}
                </div>
              )}
              */}
            </Field>
            <Field label="Date of Birth">
              <TextInput
                type="date"
                value={formData.dob}
                onChange={updateField("dob")}
              />
            </Field>
            <Field label="Gender">
              <SelectInput value={formData.gender} onChange={updateField("gender")}>
                <option value="" disabled>Select gender</option>
                {genderOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Marital Status">
              <SelectInput value={formData.maritalStatus} onChange={updateField("maritalStatus")}>
                <option value="" disabled>Select status</option>
                {maritalOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </SelectInput>
            </Field>
          </div>
        </div>

        <div className="mt-5">
          <LanguageSelector selected={languages} onChange={setLanguages} />
        </div>

        {/* Invisible reCAPTCHA anchor required by Firebase Phone Auth. */}
        <div id="recaptcha-container" />
      </Section>

      <Section
        icon={MapPin}
        title="Address Location"
        description="Address fields help refine local discovery."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Address Line 1">
            <TextInput
              placeholder="House / street / area"
              value={formData.addressLine1}
              onChange={updateField("addressLine1")}
            />
          </Field>
          <Field label="Address Line 2">
            <TextInput
              placeholder="Landmark / apartment / floor"
              value={formData.addressLine2}
              onChange={updateField("addressLine2")}
            />
          </Field>
          <Field label="Country">
            <TextInput
              placeholder="India"
              value={formData.country}
              onChange={updateField("country")}
            />
          </Field>
          <Field label="State">
            <TextInput
              placeholder="Delhi"
              value={formData.state}
              onChange={updateField("state")}
            />
          </Field>
          <Field label="City">
            <TextInput
              placeholder="New Delhi"
              value={formData.city}
              onChange={updateField("city")}
            />
          </Field>
          <Field label="Postal Code">
            <TextInput
              inputMode="numeric"
              placeholder="110001"
              value={formData.zipCode}
              onChange={updateField("zipCode")}
            />
          </Field>
          <Field label="Highest Qualification" className="md:col-span-2">
            <SelectInput value={formData.qualification} onChange={updateField("qualification")}>
              <option value="" disabled>Select qualification</option>
              {qualificationOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </SelectInput>
          </Field>
        </div>
      </Section>

      <Section
        icon={Briefcase}
        title="Employment"
        description="Turn this on only if you want to add work and industry context."
      >
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="font-bold text-slate-800">Add employment details</p>
            <p className="text-sm text-slate-500">
              Yes shows fields, No keeps this section hidden.
            </p>
          </div>
          <Toggle checked={hasEmployment} onChange={setHasEmployment} />
        </div>

        {hasEmployment && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Employment Status">
              <SelectInput value={formData.employmentStatus} onChange={updateField("employmentStatus")}>
                <option  value="" disabled>Select employment status</option>
                {employmentStatuses.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Years of Experience">
              <SelectInput value={formData.yearsOfExperience} onChange={updateField("yearsOfExperience")}>
                <option  value="" disabled>Select experience</option>
                {experienceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Designation">
              <TextInput
                placeholder="eg. Product Designer"
                value={formData.designation}
                onChange={updateField("designation")}
              />
            </Field>
            <Field label="Current Industry">
              <SelectInput value={formData.industry} onChange={updateField("industry")}>
                <option value="" disabled>Select current industry</option>
                {industryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Desired Industry">
              <SelectInput value={formData.careerChangeDomain} onChange={updateField("careerChangeDomain")}>
                <option value="" disabled>Select desired industry</option>
                {industryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Career Goal">
              <SelectInput value={formData.careerAspire} onChange={updateField("careerAspire")}>
                <option value="" disabled>Select career goal</option>
                {careerGoalOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </SelectInput>
            </Field>
          </div>
        )}
      </Section>

      <Section
        icon={Sparkles}
        title="Interests & Skills"
        description="Selections are capped to keep recommendations focused and useful."
      >
        <div className="space-y-6">
          <ChipSelector
            label="Hobbies (3 only)"
            options={hobbyOptions}
            selected={hobbies}
            onChange={setHobbies}
            max={3}
            otherValue={otherHobby}
            onOtherValueChange={setOtherHobby}
          />
          <ChipSelector
            label="Interested Skills (3 only)"
            options={skillOptions}
            selected={skills}
            onChange={setSkills}
            max={3}
            otherValue={otherSkill}
            onOtherValueChange={setOtherSkill}
          />
          <ChipSelector
            label="Fitness & Sports Interest (3 only)"
            options={sportOptions}
            selected={sports}
            onChange={setSports}
            max={3}
            otherValue={otherSport}
            onOtherValueChange={setOtherSport}
          />
        </div>
      </Section>

      <Section
        icon={Bell}
        title="Notification Preferences"
        description="Control which automatic alerts Canvade sends to you."
      >
        {/* TODO: Persist notification preferences to the student profile API. */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {preferenceRows.map((row) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <span className="text-sm font-bold text-slate-700">{row}</span>
              <Toggle
                checked={preferences[row]}
                onChange={(next) =>
                  setPreferences((prev) => ({ ...prev, [row]: next }))
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
          className="rounded-2xl bg-[#1D9B7E] px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#17886f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSavingProfile ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </section>
  );
};

export default Profile;
