import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-10">
        <div className="flex flex-col items-center text-center max-w-[560px] w-full">
          <div className="relative mb-2 flex justify-center items-center">
            <img
              src="404.png"
              alt="Lost Track Illustration"
              className="w-[280px] h-auto sm:w-[350px] md:w-[420px] object-contain"
            />

            <div className="absolute -z-10 w-[200px] h-[200px] bg-gray-50 rounded-full blur-3xl opacity-60" />
          </div>

          <div className="flex items-center justify-center leading-none mb-2">
            <span className="text-[110px] sm:text-[100px] font-black text-emerald-600 leading-none">
              4
            </span>
            <span className="text-[110px] sm:text-[100px] font-black text-amber-400  leading-none">
              0
            </span>
            <span className="text-[110px] sm:text-[100px] font-black text-emerald-600 leading-none">
              4
            </span>
          </div>

          <h1 className="text-[26px] sm:text-[22px] font-extrabold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-[20px] sm:text-[17px] font-bold text-emerald-600 mb-2">
            Looks like you're off track!
          </p>
          <div className="w-12 h-[3px] rounded-full bg-amber-400 mx-auto mb-5" />

          <p className="text-[14px] text-gray-500 leading-relaxed max-w-[340px] sm:max-w-[450px] mb-7">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track to discover the best
          </p>

          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center gap-3 bg-emerald-600 text-white rounded-full px-8 py-3.5 text-[15px] font-bold shadow-lg shadow-emerald-200 hover:-translate-y-0.5 hover:shadow-emerald-300 active:scale-95 transition-all duration-200"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/25">
              <svg
                width="10"
                height="10"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
