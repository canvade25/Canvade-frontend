import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, MapPinned } from "lucide-react";
import { RightPanel } from "../components/Auth/AuthLayout";
import { showError } from "../utils/toast";

const LOGO_SRC = "/canvade.png";

const institutionTypes = [
  "Institute",
  "Academy",
  "College",
  "School",
  "University",
  "Independent Educator",
  "Training Center",
];

// ─── shared style tokens (compact style matching the screenshot) ──────────
const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-[13px] font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-50";

const selectCls = `${inputCls} appearance-none pr-9`;

const labelCls = "mt-3 mb-1 block text-[12px] font-medium text-gray-600";

const Field = ({ label, required, children, className = "" }) => (
  <label className={className}>
    <span className={labelCls}>
      {label}
      {required && <span className="text-red-500">*</span>}
    </span>
    {children}
  </label>
);

export default function InstituteOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [aadhaarNumber, setAadhaarNumber] = useState("");

  // Institution logo
  const [instituteLogo, setInstituteLogo] = useState(null);
  const [instituteLogoPreview, setInstituteLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInstituteLogo(file);
      setInstituteLogoPreview(URL.createObjectURL(file));
    }
  };
  // component ke andar, existing states ke sath
  const [gstError, setGstError] = useState("");
  const [panError, setPanError] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");

  const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const AADHAAR_REGEX = /^[2-9]{1}[0-9]{11}$/;

  const validateGst = (value) => {
    if (!value) return "";
    return GST_REGEX.test(value) ? "" : "Enter a valid 15-character GST number";
  };

  const validatePan = (value) => {
    if (!value) return "";
    return PAN_REGEX.test(value) ? "" : "Enter a valid 10-character PAN number";
  };

  const validateAadhaar = (value) => {
    if (!value) return "";
    return AADHAAR_REGEX.test(value)
      ? ""
      : "Enter a valid 12-digit Aadhaar number";
  };

  // Form fields
  const [institutionType, setInstitutionType] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [mapLink, setMapLink] = useState("");

  const [panGstConfirmed, setPanGstConfirmed] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!location.state?.fromEducatorSignup) {
    const hasAuthToken =
      localStorage.getItem("token") || localStorage.getItem("Token");
    return (
      <Navigate
        to={hasAuthToken ? "/admin/dashboard" : "/get-started/login/educator"}
        replace
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const gstErr = validateGst(gstNumber);
    const panErr = validatePan(panNumber);
    const aadhaarErr = validateAadhaar(aadhaarNumber);

    setGstError(gstErr);
    setPanError(panErr);
    setAadhaarError(aadhaarErr);

    if (gstErr || panErr || aadhaarErr) {
      return; // form submit mat hone do agar koi error hai
    }

    setSubmitting(true);
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";
      const token = localStorage.getItem("token") || localStorage.getItem("Token");

      const formData = new FormData();
      formData.append("gstNumber", gstNumber);
      formData.append("panCard", panNumber);
      formData.append("aadhaarNumber", aadhaarNumber);
      if (instituteLogo) {
        formData.append("logo", instituteLogo);
      }

      const response = await fetch(`${baseUrl}/api/institute/onboarding`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showError(result.message || "Unable to save onboarding details");
        return;
      }

      navigate("/institute/onboarding/success", {
        state: { fromInstituteOnboarding: true },
      });
    } catch (error) {
      showError(error?.message || "Unable to save onboarding details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-white font-sans">
      <main className="flex w-full flex-col items-center overflow-y-auto px-5 py-8 md:w-[50%] md:min-w-[420px] md:px-8 lg:px-12">
        <div className="w-full max-w-[460px]">
          <div className="mb-4 flex flex-col items-center text-center">
            <img
              src={LOGO_SRC}
              alt="Canvade"
              className="h-14 w-auto object-contain"
            />
            <p className="-mt-1 text-[11px] font-semibold text-[#5B5772]">
              Choose the Right Place to Learn
            </p>
          </div>

          <div className="mb-4 flex justify-center gap-2">
            {[0, 1, 2].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStep(item)}
                className={`h-2 w-2 rounded-full transition ${
                  step === item ? "bg-[#1D9B7E]" : "bg-gray-200"
                }`}
                aria-label={`Step ${item + 1}`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Institution Logo Upload */}
            <div className="flex flex-col items-center space-y-1.5 mb-1">
              <label htmlFor="instituteLogo" className="cursor-pointer">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  {instituteLogoPreview ? (
                    <img
                      src={instituteLogoPreview}
                      alt="Institution Logo Preview"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-500"
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
              <input
                id="instituteLogo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label
                htmlFor="instituteLogo"
                className="cursor-pointer rounded-full bg-gray-100 px-4 py-1.5 text-[11px] font-medium text-gray-600 transition hover:bg-gray-200"
              >
                Upload Institution Logo
              </label>
            </div>

            <Field label="Institution Unique ID" required>
              <input
                className={`${inputCls} bg-gray-100`}
                defaultValue="682529NCPA"
                disabled
              />
            </Field>

            <Field label="Institution Type" className="mt-2">
              <div className="relative">
                <select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select Institution Type</option>
                  {institutionTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>

            <div>
              <span className={labelCls}>
                Primary Address<span className="text-red-500">*</span>
              </span>
              <button
                type="button"
                className="mb-2.5 flex w-full items-center gap-2 rounded-md border border-gray-100 bg-gray-100 px-3 py-2.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-200"
              >
                <MapPinned className="h-4 w-4 text-gray-500" />
                Select your Address Location
              </button>
              {/* TODO: Connect address location button to Google Maps picker. */}
              <div className="space-y-2.5">
                <input
                  className={inputCls}
                  placeholder="Address Line 1"
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                />
                <input
                  className={inputCls}
                  placeholder="Address Line 2"
                  value={addrLine2}
                  onChange={(e) => setAddrLine2(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    className={inputCls}
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    className={inputCls}
                    placeholder="State"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    className={inputCls}
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  <input
                    className={inputCls}
                    placeholder="Zip/ Postal Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
                <input
                  className={inputCls}
                  placeholder="Google Map Link"
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 pt-2 pb-1 text-[11px] leading-snug text-gray-500">
              <input
                type="checkbox"
                checked={panGstConfirmed}
                onChange={(e) => setPanGstConfirmed(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-[#1D9B7E] accent-[#1D9B7E] focus:ring-[#1D9B7E]"
              />
              <span>
                I confirm again that the PAN/GST details belong to me or my
                authorized business, and I consent to Canvade verifying them for
                business verification.{" "}
                <span className="font-semibold text-gray-600">
                  Read{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline transition hover:text-[#1D9B7E]"
                  >
                    Terms &amp; Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline transition hover:text-[#1D9B7E]"
                  >
                    Privacy &amp; Policy.
                  </a>
                </span>
              </span>
            </label>

            <Field label="GST Number" className="mt-2">
              <input
                className={inputCls}
                placeholder="Eg: 22AABCU9603R1ZM"
                value={gstNumber}
                maxLength={15}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setGstNumber(value);
                  setGstError(validateGst(value));
                }}
                onBlur={() => setGstError(validateGst(gstNumber))}
              />
              {gstError && (
                <p className="mt-1 text-[11px] font-medium text-red-500">
                  {gstError}
                </p>
              )}
            </Field>

            <Field label="PAN Number" className="mt-3">
              <input
                className={inputCls}
                placeholder="Eg: ABCDE1234F"
                value={panNumber}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setPanNumber(value);
                  setPanError(validatePan(value));
                }}
                onBlur={() => setPanError(validatePan(panNumber))}
              />
              {panError && (
                <p className="mt-1 text-[11px] font-medium text-red-500">
                  {panError}
                </p>
              )}
            </Field>

            <Field label="Aadhaar Number" className="mt-3">
              <input
                className={inputCls}
                placeholder="Eg: 234567890123"
                value={aadhaarNumber}
                maxLength={12}
                onChange={(e) => {
                  const digitsOnly = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 12);
                  setAadhaarNumber(digitsOnly);
                  setAadhaarError(validateAadhaar(digitsOnly));
                }}
                onBlur={() => setAadhaarError(validateAadhaar(aadhaarNumber))}
              />
              {aadhaarError && (
                <p className="mt-1 text-[11px] font-medium text-red-500">
                  {aadhaarError}
                </p>
              )}
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-md bg-[#1D9B7E] py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#17886f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save and Fill Next"}
            </button>
          </form>
        </div>
      </main>

      <aside className="hidden flex-1 md:flex">
        <RightPanel />
      </aside>
    </div>
  );
}

// import { useState } from "react";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { ChevronDown, MapPinned } from "lucide-react";
// import { RightPanel } from "../components/Auth/AuthLayout";

// const LOGO_SRC = "/canvade.png";

// const institutionTypes = [
//   "Institute",
//   "Academy",
//   "College",
//   "School",
//   "University",
//   "Independent Educator",
//   "Training Center",
// ];

// // ─── shared style tokens (compact style matching the screenshot) ──────────
// const inputCls =
//   "w-full rounded-md border border-gray-300 px-3 py-2 text-[13px] font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-50";

// const selectCls = `${inputCls} appearance-none pr-9`;

// const labelCls = "mb-1 block text-[12px] font-medium text-gray-600";

// const Field = ({ label, required, children, className = "" }) => (
//   <label className={className}>
//     <span className={labelCls}>
//       {label}
//       {required && <span className="text-red-500">*</span>}
//     </span>
//     {children}
//   </label>
// );

// export default function InstituteOnboarding() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [step, setStep] = useState(0);

//   // Institution logo
//   const [instituteLogo, setInstituteLogo] = useState(null);
//   const [instituteLogoPreview, setInstituteLogoPreview] = useState(null);

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setInstituteLogo(file);
//       setInstituteLogoPreview(URL.createObjectURL(file));
//     }
//   };

//   // Form fields
//   const [institutionType, setInstitutionType] = useState("");
//   const [addrLine1, setAddrLine1] = useState("");
//   const [addrLine2, setAddrLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [stateVal, setStateVal] = useState("");
//   const [country, setCountry] = useState("");
//   const [zip, setZip] = useState("");
//   const [mapLink, setMapLink] = useState("");

//   const [panGstConfirmed, setPanGstConfirmed] = useState(false);
//   const [gstNumber, setGstNumber] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpInput, setOtpInput] = useState("");
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [panNumber, setPanNumber] = useState("");

//   if (!location.state?.fromEducatorSignup) {
//     const hasAuthToken = localStorage.getItem("token") || localStorage.getItem("Token");
//     return (
//       <Navigate
//         to={hasAuthToken ? "/admin/dashboard" : "/get-started/login/educator"}
//         replace
//       />
//     );
//   }

//   const handleSendOtp = () => {
//     if (!gstNumber.trim()) return;
//     // TODO: Trigger backend OTP send for GST verification.
//     setOtpSent(true);
//   };

//   const handleVerifyOtp = () => {
//     if (!otpInput.trim()) return;
//     // TODO: Verify OTP against backend before marking GST as verified.
//     setOtpVerified(true);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // TODO: Persist institute onboarding details (incl. instituteLogo) to backend before redirect.
//     const hasAuthToken = localStorage.getItem("token") || localStorage.getItem("Token");
//     navigate(hasAuthToken ? "/admin/dashboard" : "/get-started/login/educator");
//   };

//   return (
//     <div className="flex min-h-screen w-screen bg-white font-sans">
//       <main className="flex w-full flex-col items-center overflow-y-auto px-5 py-8 md:w-[50%] md:min-w-[420px] md:px-8 lg:px-12">
//         <div className="w-full max-w-[460px]">
//           <div className="mb-6 flex flex-col items-center text-center">
//             <img src={LOGO_SRC} alt="Canvade" className="h-10 w-auto object-contain" />
//             <p className="-mt-1 text-[11px] font-semibold text-[#5B5772]">
//               Choose the Right Place to Learn
//             </p>
//           </div>

//           <div className="mb-6 flex justify-center gap-2">
//             {[0, 1, 2].map((item) => (
//               <button
//                 key={item}
//                 type="button"
//                 onClick={() => setStep(item)}
//                 className={`h-2 w-2 rounded-full transition ${
//                   step === item ? "bg-[#1D9B7E]" : "bg-gray-200"
//                 }`}
//                 aria-label={`Step ${item + 1}`}
//               />
//             ))}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Institution Logo Upload */}
//             <div className="flex flex-col items-center space-y-2">
//               <label htmlFor="instituteLogo" className="cursor-pointer">
//                 <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-200">
//                   {instituteLogoPreview ? (
//                     <img
//                       src={instituteLogoPreview}
//                       alt="Institution Logo Preview"
//                       className="h-full w-full rounded-full object-cover"
//                     />
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-8 w-8 text-gray-500"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                 </div>
//               </label>
//               <input
//                 id="instituteLogo"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleLogoChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="instituteLogo"
//                 className="cursor-pointer rounded-full bg-gray-100 px-4 py-1.5 text-[11px] font-medium text-gray-600 transition hover:bg-gray-200"
//               >
//                 Upload Institution Logo
//               </label>
//             </div>

//             <Field label="Institution Unique ID" required>
//               <input className={`${inputCls} bg-gray-100`} defaultValue="682529NCPA" disabled />
//             </Field>

//             <Field label="Institution Type">
//               <div className="relative">
//                 <select
//                   value={institutionType}
//                   onChange={(e) => setInstitutionType(e.target.value)}
//                   className={selectCls}
//                 >
//                   <option value="">Select Institution Type</option>
//                   {institutionTypes.map((type) => (
//                     <option key={type}>{type}</option>
//                   ))}
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               </div>
//             </Field>

//             <div>
//               <span className={labelCls}>
//                 Primary Address<span className="text-red-500">*</span>
//               </span>
//               <button
//                 type="button"
//                 className="mb-3 flex w-full items-center gap-2 rounded-md border border-gray-100 bg-gray-100 px-3 py-2.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-200"
//               >
//                 <MapPinned className="h-4 w-4 text-gray-500" />
//                 Select your Address Location
//               </button>
//               {/* TODO: Connect address location button to Google Maps picker. */}
//               <div className="space-y-2.5">
//                 <input
//                   className={inputCls}
//                   placeholder="Address Line 1"
//                   value={addrLine1}
//                   onChange={(e) => setAddrLine1(e.target.value)}
//                 />
//                 <input
//                   className={inputCls}
//                   placeholder="Address Line 2"
//                   value={addrLine2}
//                   onChange={(e) => setAddrLine2(e.target.value)}
//                 />
//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     className={inputCls}
//                     placeholder="City"
//                     value={city}
//                     onChange={(e) => setCity(e.target.value)}
//                   />
//                   <input
//                     className={inputCls}
//                     placeholder="State"
//                     value={stateVal}
//                     onChange={(e) => setStateVal(e.target.value)}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     className={inputCls}
//                     placeholder="Country"
//                     value={country}
//                     onChange={(e) => setCountry(e.target.value)}
//                   />
//                   <input
//                     className={inputCls}
//                     placeholder="Zip/ Postal Code"
//                     value={zip}
//                     onChange={(e) => setZip(e.target.value)}
//                   />
//                 </div>
//                 <input
//                   className={inputCls}
//                   placeholder="Google Map Link"
//                   value={mapLink}
//                   onChange={(e) => setMapLink(e.target.value)}
//                 />
//               </div>
//             </div>

//             <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-[11px] leading-snug text-gray-500">
//               <input
//                 type="checkbox"
//                 checked={panGstConfirmed}
//                 onChange={(e) => setPanGstConfirmed(e.target.checked)}
//                 className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-[#1D9B7E] accent-[#1D9B7E] focus:ring-[#1D9B7E]"
//               />
//               <span>
//                 I confirm again that the PAN/GST details belong to me or my
//                 authorized business, and I consent to Canvade verifying them
//                 for business verification.{" "}
//                 <span className="font-semibold text-gray-600">
//                   Read{" "}
//                   <a href="/terms" className="underline transition hover:text-[#1D9B7E]">
//                     Terms &amp; Conditions
//                   </a>{" "}
//                   and{" "}
//                   <a
//                     href="/privacy-policy"
//                     className="underline transition hover:text-[#1D9B7E]"
//                   >
//                     Privacy &amp; Policy.
//                   </a>
//                 </span>
//               </span>
//             </label>

//             <Field label="GST Number">
//               <div className="flex items-center gap-2">
//                 <input
//                   className={inputCls}
//                   placeholder="Eg: 22AABCU9603R1ZM"
//                   value={gstNumber}
//                   onChange={(e) => setGstNumber(e.target.value)}
//                 />
//                 <button
//                   type="button"
//                   onClick={handleSendOtp}
//                   disabled={!gstNumber.trim()}
//                   className="shrink-0 whitespace-nowrap rounded-md bg-gray-200 px-3 py-2 text-[12px] font-medium text-gray-500 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   Send OTP
//                 </button>
//               </div>
//             </Field>

//             {otpSent && (
//               <Field label="OTP Verification">
//                 <div className="flex items-center gap-2">
//                   <input
//                     className={inputCls}
//                     placeholder="Enter OTP"
//                     value={otpInput}
//                     onChange={(e) => setOtpInput(e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     onClick={handleVerifyOtp}
//                     className="shrink-0 whitespace-nowrap rounded-md bg-[#1D9B7E] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#17886f]"
//                   >
//                     {otpVerified ? "Verified" : "Verify"}
//                   </button>
//                 </div>
//               </Field>
//             )}

//             <Field label="PAN Number">
//               <input
//                 className={inputCls}
//                 placeholder="Eg: ABCDE1234F"
//                 value={panNumber}
//                 onChange={(e) => setPanNumber(e.target.value)}
//               />
//             </Field>

//             <button
//               type="submit"
//               className="mt-2 w-full rounded-md bg-[#1D9B7E] py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#17886f] active:scale-[0.98]"
//             >
//               Save and Fill Next
//             </button>
//           </form>
//         </div>
//       </main>

//       <aside className="hidden flex-1 md:flex">
//         <RightPanel />
//       </aside>
//     </div>
//   );
// }

// import { useState } from "react";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { ChevronDown, MapPinned } from "lucide-react";
// import { RightPanel } from "../components/Auth/AuthLayout";

// const LOGO_SRC = "/canvade.png";

// const institutionTypes = [
//   "Institute",
//   "Academy",
//   "College",
//   "School",
//   "University",
//   "Independent Educator",
//   "Training Center",
// ];

// const inputClass =
//   "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#1D9B7E] focus:ring-4 focus:ring-[#1D9B7E]/10";

// const labelClass = "mb-2 block text-[14px] font-semibold text-slate-700";

// const Field = ({ label, required, children, className = "" }) => (
//   <label className={className}>
//     <span className={labelClass}>
//       {label}
//       {required && <span className="text-red-500">*</span>}
//     </span>
//     {children}
//   </label>
// );

// export default function InstituteOnboarding() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [step, setStep] = useState(0);

//   if (!location.state?.fromEducatorSignup) {
//     const hasAuthToken = localStorage.getItem("token") || localStorage.getItem("Token");
//     return (
//       <Navigate
//         to={hasAuthToken ? "/admin/dashboard" : "/get-started/login/educator"}
//         replace
//       />
//     );
//   }

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // TODO: Persist institute onboarding details to backend before redirect.
//     const hasAuthToken = localStorage.getItem("token") || localStorage.getItem("Token");
//     navigate(hasAuthToken ? "/admin/dashboard" : "/get-started/login/educator");
//   };

//   return (
//     <div className="flex min-h-screen w-screen bg-white font-sans">
//       <main className="flex w-full flex-col items-center overflow-y-auto px-5 py-8 md:w-[50%] md:min-w-[420px] md:px-8 lg:px-12">
//         <div className="w-full max-w-[620px]">
//           <div className="mb-10 flex flex-col items-center text-center">
//             <img src={LOGO_SRC} alt="Canvade" className="h-16 w-auto object-contain" />
//             <p className="-mt-1 text-sm font-bold text-[#5B5772]">
//               Choose the Right Place to Learn
//             </p>
//           </div>

//           <div className="mb-10 rounded-2xl bg-slate-50 p-6 text-[#5B5772]">
//             <p className="text-[15px] font-semibold leading-7">
//               We use AI only to personalize your experience. Add the necessary
//               institute details now for better recommendations, or update them later.
//             </p>
//             <span className="mt-5 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm">
//               Fill the Details Below
//             </span>
//           </div>

//           <div className="mb-10 flex justify-center gap-4">
//             {[0, 1, 2].map((item) => (
//               <button
//                 key={item}
//                 type="button"
//                 onClick={() => setStep(item)}
//                 className={`h-2.5 w-2.5 rounded-full transition ${
//                   step === item ? "bg-[#1D9B7E]" : "bg-white ring-1 ring-slate-300"
//                 }`}
//                 aria-label={`Step ${item + 1}`}
//               />
//             ))}
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <Field label="Unique ID" required>
//               <input className={inputClass} defaultValue="684529NCPA" />
//             </Field>

//             <Field label="Institution Type">
//               <div className="relative">
//                 <select className={`${inputClass} appearance-none pr-10`} defaultValue="">
//                   <option value="" disabled>
//                     Select
//                   </option>
//                   {institutionTypes.map((type) => (
//                     <option key={type}>{type}</option>
//                   ))}
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               </div>
//             </Field>

//             <div>
//               <span className={labelClass}>
//                 Address<span className="text-red-500">*</span>
//               </span>
//               <button
//                 type="button"
//                 className="mb-4 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#E8F6F2] hover:text-[#1D9B7E]"
//               >
//                 <MapPinned className="h-5 w-5" />
//                 Select your Address Location
//               </button>
//               {/* TODO: Connect address location button to Google Maps picker. */}
//               <div className="grid grid-cols-1 gap-4">
//                 <input className={inputClass} placeholder="Address Line 1" />
//                 <input className={inputClass} placeholder="Address Line 2" />
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                   <input className={inputClass} placeholder="City" />
//                   <input className={inputClass} placeholder="State" />
//                 </div>
//                 <input className={`${inputClass} sm:max-w-[300px]`} placeholder="Zip/ Postal Code" />
//               </div>
//             </div>

//             <Field label="PAN Number">
//               <input className={inputClass} placeholder="Text" />
//             </Field>

//             <Field label="GST Number">
//               <input className={inputClass} placeholder="Text" />
//             </Field>

//             <button
//               type="submit"
//               className="mt-10 w-full rounded-xl bg-[#1D9B7E] px-6 py-4 text-base font-bold text-white transition hover:bg-[#17886f] active:scale-[0.99]"
//             >
//               Save and Go to Site
//             </button>
//           </form>
//         </div>
//       </main>

//       <aside className="hidden flex-1 md:flex">
//         <RightPanel />
//       </aside>
//     </div>
//   );
// }
