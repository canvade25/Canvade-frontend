import { Outlet } from "react-router-dom";
import { RightPanel } from "../Auth/AuthLayout";

export default function OnboardingLayout({ initialFlow }) {
  return (
    <div className="flex min-h-screen w-screen font-sans">

      <div className="flex w-full min-h-screen flex-col items-center justify-center overflow-y-auto bg-white px-6 py-4 md:w-[50%] md:min-w-[380px]">
        <Outlet />
      </div>

      <div className="hidden flex-1 md:flex">
        <RightPanel />
      </div>

    </div>
  );
}