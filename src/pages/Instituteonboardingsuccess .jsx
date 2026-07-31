import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { RightPanel } from "../components/Auth/AuthLayout";

const LOGO_SRC = "/canvade.png";

const secondaryBtnCls =
  "inline-flex items-center justify-center rounded-md border border-[#1D9B7E] px-4 py-1.5 text-[12px] font-semibold text-[#1D9B7E] transition hover:bg-[#1D9B7E]/5";

export default function InstituteOnboardingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state?.fromInstituteOnboarding) {
    const hasAuthToken = localStorage.getItem("token") || localStorage.getItem("Token");
    return (
      <Navigate
        to={hasAuthToken ? "/admin/dashboard" : "/get-started/login/educator"}
        replace
      />
    );
  }

  const goToDashboard = () => {
    const hasAuthToken = localStorage.getItem("token") || localStorage.getItem("Token");
    navigate(hasAuthToken ? "/admin/dashboard" : "/get-started/login/educator");
  };

  const goToProfile = () => {
    // TODO: Route to the institute profile/verification page once available.
    navigate("/admin/profile");
  };

  const goToListCourse = () => {
    // TODO: Route to the "add course" flow once available.
    navigate("/admin/courses/new");
  };

  const goToGrowthPlans = () => {
    // TODO: Route to the growth plans/pricing page once available.
    navigate("/admin/growth-plans");
  };

  return (
    <div className="flex min-h-screen w-screen bg-white font-sans">
      <main className="flex w-full flex-col items-center justify-center overflow-y-auto px-5 py-8 md:w-[50%] md:min-w-[420px] md:px-8 lg:px-12">
        <div className="w-full max-w-[460px]">
          <div className="mb-4 flex flex-col items-center text-center">
            <img src={LOGO_SRC} alt="Canvade" className="h-14 w-auto object-contain" />
            <p className="-mt-1 text-[11px] font-semibold text-[#5B5772]">
              Choose the Right Place to Learn
            </p>
          </div>

          <div className="mb-5 flex justify-center gap-2">
            {[0, 1].map((item) => (
              <span
                key={item}
                className={`h-2 w-2 rounded-full ${
                  item === 1 ? "bg-[#1D9B7E]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1D9B7E]">
              <CheckCircle2 size={15} className="text-white" strokeWidth={2.5} />
            </span>
            <h1 className="text-[16px] font-bold text-slate-900">
              Your institute profile is saved
            </h1>
          </div>
          <p className="mb-6 text-[12.5px] leading-relaxed text-gray-500">
            Choose what you want to do next. You can update these details
            anytime.
          </p>

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col rounded-xl border border-gray-200 p-4">
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F7F2]">
                <ShieldCheck size={17} className="text-[#1D9B7E]" />
              </span>
              <h3 className="mb-1 text-[13px] font-bold text-slate-800">
                Complete Profile &amp; Verification
              </h3>
              <p className="mb-3 flex-1 text-[11.5px] leading-relaxed text-gray-500">
                Add logo, GST/PAN verification, photos, and trust details.
              </p>
              <button
                type="button"
                onClick={goToProfile}
                className={secondaryBtnCls}
              >
                Go to Profile
              </button>
            </div>

            <div className="flex flex-col rounded-xl border border-gray-200 p-4">
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#E9F7F2]">
                <GraduationCap size={17} className="text-[#1D9B7E]" />
              </span>
              <h3 className="mb-1 text-[13px] font-bold text-slate-800">
                List Your First Course
              </h3>
              <p className="mb-3 flex-1 text-[11.5px] leading-relaxed text-gray-500">
                Add pricing, batches, schedule, and course details.
              </p>
              <button
                type="button"
                onClick={goToListCourse}
                className={secondaryBtnCls}
              >
                List Course
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E9F7F2]">
                <TrendingUp size={17} className="text-[#1D9B7E]" />
              </span>
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">
                  Explore Growth Plans
                </h3>
                <p className="text-[11.5px] leading-relaxed text-gray-500">
                  Check plans for more visibility, verified status, student
                  leads, and growth tools.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={goToGrowthPlans}
              className={`${secondaryBtnCls} shrink-0 whitespace-nowrap`}
            >
              View Plans
            </button>
          </div>

          <button
            type="button"
            onClick={goToDashboard}
            className="w-full rounded-md bg-[#1D9B7E] py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#17886f] active:scale-[0.98]"
          >
            Save and Go to Site
          </button>
        </div>
      </main>

      <aside className="hidden flex-1 md:flex">
        <RightPanel />
      </aside>
    </div>
  );
}