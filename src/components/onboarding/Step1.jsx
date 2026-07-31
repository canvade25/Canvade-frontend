import { ArrowRight, Building2, GraduationCap } from "lucide-react";

const LOGO_SRC = "/canvade.png";

export default function Step1({ onStudentSignup, onInstitutionSignup, onLoginClick }) {
  return (
    <div className="w-full max-w-[430px] animate-in fade-in duration-500">
      <div className="mb-16 flex flex-col items-center">
        <img src={LOGO_SRC} alt="Canvade" className="h-14 w-auto object-contain" />
      </div>

      <div className="space-y-10">
        <div className="rounded-xl border border-[#24977a] bg-emerald-50/20 p-5 shadow-[0_10px_24px_rgba(15,118,110,0.06)]">
          <div className="flex items-center gap-7">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#24977a]">
              <GraduationCap size={64} strokeWidth={1.6} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[26px] font-bold leading-tight text-[#0f6b5a]">
                Student
              </h2>
              <p className="mt-2 text-[14px] font-medium leading-6 text-[#5B5772]">
                Find courses, compare institutes, and join the right class for you.
              </p>
              <button
                type="button"
                onClick={onStudentSignup}
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
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#007965]">
              <Building2 size={62} strokeWidth={1.6} />
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
                onClick={onInstitutionSignup}
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
          onClick={onLoginClick}
          className="rounded-full bg-[#24977a] px-6 py-1.5 text-xs font-bold text-white transition hover:bg-[#1d7a63]"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
