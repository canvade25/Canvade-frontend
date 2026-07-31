// import { useState } from "react";
// import { ArrowRight, Building2, GraduationCap } from "lucide-react";
// import Login from "./Login";
// import Signup from "./Signup";
// import AdminSignup from "./Admin/AdminSignup";
// const RIGHT_BG_SRC = "/bg.png";
// const ARCH_IMG_SRC = "/institute.jpg";
// const LOGO_SRC = "/canvade.png";

// export function RightPanel() {
//   return (
//     <div className="relative h-full w-full overflow-hidden flex items-center justify-start">
//       <img
//         src={RIGHT_BG_SRC}
//         alt="background"
//         className="absolute inset-0 h-full w-full object-cover blur-[2px] scale-105"
//       />

//       <div className="relative z-10 ml-10 lg:ml-20 w-[78%] h-[82%] max-w-[560px]">
//         <div
//           className="relative w-[78%] h-[88%] overflow-hidden shadow-xl"
//           style={{
//             borderRadius: "500px 500px 20px 20px",
//           }}
//         >
//           <img
//             src={ARCH_IMG_SRC}
//             alt="Institute"
//             className="h-full w-full object-cover"
//           />
//         </div>

//         <div
//           className="absolute bg-white p-6 rounded-2xl shadow-sm"
//           style={{
//             top: "18%",
//             left: "58%",
//             width: "52%",
//             maxWidth: "300px",
//             minHeight: "210px",
//           }}
//         >
//           <h3 className="text-[17px] font-bold text-[#5B5772] leading-tight mb-4">
//             Indian Institute of Hospitality and Culinary
//           </h3>

//           <p className="text-[12px] text-[#5B5772] leading-relaxed font-medium">
//             Delhi Entrepreneur, Established the institute in Siliguri with the
//             vision to skill local youth through industry-focused hospitality and
//             culinary training, with strong support for overseas placement
//             opportunities.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function SignupSelection({ onStudent, onInstitution, onLogin }) {
//   return (
//     <div className="w-full max-w-[430px] animate-in fade-in duration-500">
//       <div className="mb-16 flex flex-col items-center">
//         <img src={LOGO_SRC} alt="Canvade" className="h-14 w-auto object-contain" />
//       </div>

//       <div className="space-y-10">
//         <div className="rounded-xl border border-[#24977a] bg-emerald-50/20 p-5 shadow-[0_10px_24px_rgba(15,118,110,0.06)]">
//           <div className="flex items-center gap-7">
//             <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#24977a]">
//               <GraduationCap size={64} strokeWidth={1.6} />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h2 className="text-[26px] font-bold leading-tight text-[#0f6b5a]">
//                 Student
//               </h2>
//               <p className="mt-2 text-[14px] font-medium leading-6 text-[#5B5772]">
//                 Find courses, compare institutes, and join the right class for you.
//               </p>
//               <button
//                 type="button"
//                 onClick={onStudent}
//                 className="mt-4 flex h-11 w-full items-center justify-center gap-3 rounded-md bg-[#007965] text-sm font-bold text-white transition hover:bg-[#006252]"
//               >
//                 Continue as Student
//                 <ArrowRight size={18} />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//           <div className="flex items-center gap-7">
//             <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#007965]">
//               <Building2 size={62} strokeWidth={1.6} />
//             </div>
//             <div className="min-w-0 flex-1">
//               <h2 className="text-[22px] font-bold leading-tight text-gray-950">
//                 Institute or Teacher
//               </h2>
//               <p className="mt-2 text-[14px] font-medium leading-6 text-[#5B5772]">
//                 List your courses, manage enquiries, and reach more students.
//               </p>
//               <button
//                 type="button"
//                 onClick={onInstitution}
//                 className="mt-4 flex h-11 w-full items-center justify-center gap-3 rounded-md border border-[#007965] bg-white text-sm font-bold text-[#007965] transition hover:bg-emerald-50"
//               >
//                 Continue as Institution
//                 <ArrowRight size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-12 flex items-center justify-center gap-3">
//         <span className="text-sm font-medium text-[#3a4e82]">
//           Already have an account?
//         </span>
//         <button
//           type="button"
//           onClick={onLogin}
//           className="rounded-full bg-[#24977a] px-6 py-1.5 text-xs font-bold text-white transition hover:bg-[#1d7a63]"
//         >
//           Log in
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function AuthLayout() {
//   const [mode, setMode] = useState("login");
//   const [signupRole, setSignupRole] = useState("student");

//   return (
//     <div className="flex min-h-screen w-screen font-sans">
//       <div
//         className="
//           flex w-full min-h-screen flex-col items-center justify-center
//           overflow-y-auto bg-white
//           px-5 py-8
//           sm:px-8
//           md:w-[50%] md:min-w-[380px] md:px-6
//           lg:w-[45%] lg:px-8
//           xl:w-[50%]
//         "
//       >
//         {mode === "login" && (
//           <Login onSignUpClick={() => setMode("select")} switchToSignup={() => setMode("select")} />
//         )}
//         {mode === "select" && (
//           <SignupSelection
//             onStudent={() => {
//               setSignupRole("student");
//               setMode("signup");
//             }}
//             onInstitution={() => {
//               setSignupRole("institution");
//               setMode("signup");
//             }}
//             onLogin={() => setMode("login")}
//           />
//         )}
//         {mode === "signup" && (
//           signupRole === "institution" ? (
//             <AdminSignup switchToLogin={() => setMode("login")} switchToSelect={() => setMode("select")} />
//           ) : (
//             <Signup switchToLogin={() => setMode("login")} switchToSelect={() => setMode("select")} />
//           )
//         )}
//       </div>

//       <div className="hidden flex-1 md:flex">
//         <RightPanel />
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Login from "./Login";
import Signup from "./Signup";
import AdminSignup from "./Admin/AdminSignup";
const RIGHT_BG_SRC = "/bg.png";
const ARCH_IMG_SRC = "/institute.jpg";
const LOGO_SRC = "/canvade.png";

function StudentIcon({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Robe / body */}
      <path d="M28 92c0-18 8-30 22-30s22 12 22 30z" fill={GREEN} />
      {/* Book held in front */}
      <rect x="38" y="66" width="24" height="18" rx="2.5" fill="#fff" />
      <rect x="41.5" y="71" width="17" height="2.2" rx="1.1" fill={CREAM} />
      <rect x="41.5" y="76" width="17" height="2.2" rx="1.1" fill={CREAM} />
      {/* Neck */}
      <rect x="45" y="46" width="10" height="10" rx="3" fill={SKIN} />
      {/* Face */}
      <circle cx="50" cy="36" r="14" fill={SKIN} />
      {/* Mortarboard cap */}
      <path d="M50 14 L74 24 L50 34 L26 24 Z" fill={GREEN_DARK} />
      <rect x="47" y="24" width="6" height="10" fill={GREEN_DARK} />
      <circle cx="50" cy="34.5" r="2.2" fill={GREEN_DARK} />
      <path
        d="M50 34.5c0 4-1 8-1 8"
        stroke={GREEN_DARK}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InstituteIcon({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Building */}
      <rect x="46" y="34" width="40" height="46" rx="2" fill={GREEN} />
      {/* Pediment roof */}
      <path d="M44 34 L66 20 L88 34 Z" fill={GREEN_DARK} />
      {/* Flagpole */}
      <rect x="65" y="6" width="2" height="16" fill={GREEN_DARK} />
      <path d="M67 6 L79 10 L67 14 Z" fill={GREEN_DARK} />
      {/* Columns / windows */}
      <rect x="51" y="42" width="5" height="30" rx="1" fill="#fff" />
      <rect x="60" y="42" width="5" height="30" rx="1" fill="#fff" />
      <rect x="69" y="42" width="5" height="30" rx="1" fill="#fff" />
      <rect x="78" y="42" width="5" height="30" rx="1" fill="#fff" />
      {/* Base steps */}
      <rect x="43" y="80" width="46" height="5" rx="1.5" fill={GREEN_DARK} />
      {/* Figure standing in front */}
      <circle cx="24" cy="42" r="9" fill={SKIN} />
      <path d="M10 86c0-14 6-24 14-24s14 10 14 24z" fill={GREEN_DARK} />
    </svg>
  );
}

export function RightPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden flex items-center justify-start">
      <img
        src={RIGHT_BG_SRC}
        alt="background"
        className="absolute inset-0 h-full w-full object-cover blur-[2px] scale-105"
      />

      <div className="relative z-10 ml-10 lg:ml-20 w-[78%] h-[82%] max-w-[560px]">
        <div
          className="relative w-[78%] h-[88%] overflow-hidden shadow-xl"
          style={{
            borderRadius: "500px 500px 20px 20px",
          }}
        >
          <img
            src={ARCH_IMG_SRC}
            alt="Institute"
            className="h-full w-full object-cover"
          />
        </div>

        <div
          className="absolute bg-white p-6 rounded-2xl shadow-sm"
          style={{
            top: "18%",
            left: "58%",
            width: "52%",
            maxWidth: "300px",
            minHeight: "210px",
          }}
        >
          <h3 className="text-[17px] font-bold text-[#5B5772] leading-tight mb-4">
            Indian Institute of Hospitality and Culinary
          </h3>

          <p className="text-[12px] text-[#5B5772] leading-relaxed font-medium">
            Delhi Entrepreneur, Established the institute in Siliguri with the
            vision to skill local youth through industry-focused hospitality and
            culinary training, with strong support for overseas placement
            opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}

function SignupSelection({ onStudent, onInstitution, onLogin }) {
  return (
    <div className="w-full max-w-[430px] animate-in fade-in duration-500">
      <div className="mb-16 flex flex-col items-center">
        <img
          src={LOGO_SRC}
          alt="Canvade"
          className="h-14 w-auto object-contain"
        />
      </div>

      <div className="space-y-10">
        <div className="rounded-xl border border-[#24977a] bg-emerald-50/20 p-5 shadow-[0_10px_24px_rgba(15,118,110,0.06)]">
          <div className="flex items-center gap-7">
            // After
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 overflow-hidden">
              <StudentIcon size={72} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[26px] font-bold leading-tight text-[#0f6b5a]">
                Student
              </h2>
              <p className="mt-2 text-[14px] font-medium leading-6 text-[#5B5772]">
                Find courses, compare institutes, and join the right class for
                you.
              </p>
              <button
                type="button"
                onClick={onStudent}
                className="mt-4 flex h-11 w-full items-center justify-center gap-3 rounded-md bg-[#007965] text-sm font-bold text-white transition hover:bg-[#006252]"
              >
                Continue as Student
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-7">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <InstituteIcon size={50} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[22px] font-bold leading-tight text-gray-950">
                Institute or Teacher
              </h2>
              <p className="mt-2 text-[14px] font-medium leading-6 text-[#5B5772]">
                List your courses, manage enquiries, and reach more students.
              </p>
              <button
                type="button"
                onClick={onInstitution}
                className="mt-4 flex h-11 w-full items-center justify-center gap-3 rounded-md border border-[#007965] bg-white text-sm font-bold text-[#007965] transition hover:bg-emerald-50"
              >
                Continue as Institution
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-[#3a4e82]">
          Already have an account?
        </span>
        <button
          type="button"
          onClick={onLogin}
          className="rounded-full bg-[#24977a] px-6 py-1.5 text-xs font-bold text-white transition hover:bg-[#1d7a63]"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

export default function AuthLayout() {
  const [mode, setMode] = useState("login");
  const [signupRole, setSignupRole] = useState("student");

  return (
    <div className="flex min-h-screen w-screen font-sans">
      <div
        className="
          flex w-full min-h-screen flex-col items-center justify-center
          overflow-y-auto bg-white
          px-5 py-8
          sm:px-8
          md:w-[50%] md:min-w-[380px] md:px-6
          lg:w-[45%] lg:px-8
          xl:w-[50%]
        "
      >
        {mode === "login" && (
          <Login
            onSignUpClick={() => setMode("select")}
            switchToSignup={() => setMode("select")}
          />
        )}
        {mode === "select" && (
          <SignupSelection
            onStudent={() => {
              setSignupRole("student");
              setMode("signup");
            }}
            onInstitution={() => {
              setSignupRole("institution");
              setMode("signup");
            }}
            onLogin={() => setMode("login")}
          />
        )}
        {mode === "signup" &&
          (signupRole === "institution" ? (
            <AdminSignup
              switchToLogin={() => setMode("login")}
              switchToSelect={() => setMode("select")}
            />
          ) : (
            <Signup
              switchToLogin={() => setMode("login")}
              switchToSelect={() => setMode("select")}
            />
          ))}
      </div>

      <div className="hidden flex-1 md:flex">
        <RightPanel />
      </div>
    </div>
  );
}
