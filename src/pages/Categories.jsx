import React from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  School,
  UserCheck,
  Compass,
  Users2,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EXPLORE_CATEGORIES } from "../components/Home/constants/exploreCategories";

const LEARNING_TYPES = [
  {
    icon: Building2,
    title: "Institutes",
    desc: "Discover professional institutes and centers.",
    color: "blue",
  },
  {
    icon: School,
    title: "Academy",
    desc: "Explore coaching academies and training centers.",
    color: "emerald",
  },
  {
    icon: UserCheck,
    title: "Schools",
    desc: "Learn from independent teachers and experts.",
    color: "orange",
  },
  {
    icon: GraduationCap,
    title: "Colleges",
    desc: "Find top colleges across streams and locations.",
    color: "purple",
  },
];

const VALUES = [
  {
    icon: Compass,
    title: "Wide Range of Options",
    desc: "Choose from thousands of institutes and educators.",
    bg: "bg-emerald-50",
    text: "text-emerald-500",
    border: "border-emerald-100",
  },
  {
    icon: ShieldAlert,
    title: "Trusted & Verified",
    desc: "All listings are verified for quality and authenticity.",
    bg: "bg-blue-50",
    text: "text-blue-500",
    border: "border-blue-100",
  },
  {
    icon: Lightbulb,
    title: "Learn Your Way",
    desc: "Find the perfect learning path that fits your goals.",
    bg: "bg-orange-50",
    text: "text-orange-500",
    border: "border-orange-100",
  },
  {
    icon: Users2,
    title: "Grow Your Future",
    desc: "Start learning today and build a better tomorrow.",
    bg: "bg-purple-50",
    text: "text-purple-500",
    border: "border-purple-100",
  },
];

const COLOR_MAPS = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    circle: "border-emerald-200 hover:bg-emerald-50",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    circle: "border-blue-200 hover:bg-blue-50",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-600",
    circle: "border-purple-200 hover:bg-purple-50",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-600",
    circle: "border-orange-200 hover:bg-orange-50",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-600",
    circle: "border-rose-200 hover:bg-rose-50",
  },
};

// Maps the "Find Your Nearest" card titles to the backend's instituteType values.
const NEAREST_TYPE_MAP = {
  Institutes: "Institute",
  Academy: "Academy",
  Schools: "School",
  Colleges: "College",
};

export default function CategorySearch() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryLabel) => {
    const searchParams = new URLSearchParams({ category: categoryLabel });
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleNearestClick = (typeTitle) => {
    const instituteType = NEAREST_TYPE_MAP[typeTitle] || typeTitle;

    const goToResults = (coords) => {
      const searchParams = new URLSearchParams({
        nearest: "true",
        type: instituteType,
      });
      if (coords) {
        searchParams.set("lat", coords.latitude);
        searchParams.set("lng", coords.longitude);
      }
      navigate(`/search?${searchParams.toString()}`);
    };

    if (!navigator.geolocation) {
      goToResults(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        goToResults({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => goToResults(null),
      { timeout: 8000 },
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.10),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_35%),linear-gradient(to_bottom,#ffffff,#f8fafc)] text-slate-800 antialiased pt-16 font-sans">
      <Navbar />

      <section className="text-center max-w-[900px] mx-auto px-4 pt-12 pb-10 space-y-3.5">
        <p className="text-[#00dfa2] text-xs sm:text-sm font-medium">
          Learn. Grow. Succeed.
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#111c24] tracking-tight leading-tight">
          Find the right learning
          <br />
          <span className="text-[#00dfa2] relative inline-block">for you</span>
        </h1>
        <p className="text-gray-700 text-xs sm:text-sm md:text-base font-normal max-w-[650px] mx-auto leading-relaxed">
          Discover the best academies, institutes, colleges, online educators
          and universities all in one place.
        </p>
      </section>

      <div className="w-full max-w-[1700px] mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 space-y-16 pb-16">
        <section className="space-y-6 text-center">
          <h2 className="text-base sm:text-xl font-medium text-slate-900 tracking-tight">
            Find Your Nearest
          </h2>

          <div className="flex flex-wrap justify-center gap-5 w-full">
            {LEARNING_TYPES.map((type) => {
              const Icon = type.icon;
              const mapped = COLOR_MAPS[type.color];
              return (
                <button
                  type="button"
                  key={type.title}
                  onClick={() => handleNearestClick(type.title)}
                  className="border rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-center justify-between text-center group cursor-pointer w-full sm:w-[45%] md:w-[30%] lg:w-[18%] max-w-[240px] min-h-[255px] bg-white border-gray-100 text-slate-900 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-gray-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.99]"
                >
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <div
                      className={`w-16 h-16 rounded-full ${mapped.bg} ${mapped.text} flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1`}
                    >
                      <Icon size={32} className="stroke-[2.5] transition-transform duration-300 ease-out group-hover:rotate-[-3deg]" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-medium text-base tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-[#007965]">
                        {type.title}
                      </h3>
                      <p className="text-[11px] leading-relaxed max-w-[170px] mx-auto font-medium text-gray-500">
                        {type.desc}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mt-5 shrink-0 ${mapped.circle} ${mapped.text} transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-white`}
                  >
                    <ArrowRight size={18} className="stroke-[3] transition-transform duration-300 ease-out group-hover:translate-x-1" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-6 text-center">
          <div className="space-y-2 text-center">
            <h2 className="text-lg sm:text-2xl font-medium text-slate-900 tracking-tight">
              Find 30 In-Demand Categories
            </h2>
            <p className="text-[14px] text-gray-500 font-medium">
              Find the right learning path for your goals
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3.5">
            {EXPLORE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  type="button"
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat.label)}
                  className="bg-white border border-gray-100/70 rounded-xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col items-center text-center justify-center space-y-2.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.03)] transition-all cursor-pointer border-b-2 hover:border-b-[#007965] min-h-[115px] group"
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.bg} ${cat.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                  >
                    <Icon size={28} className="stroke-[2]" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight tracking-tight line-clamp-2 px-0.5">
                    {cat.label}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="w-full pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-10">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="flex items-start gap-4 p-2">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border ${val.bg} ${val.text} ${val.border}`}
                  >
                    <Icon size={24} className="stroke-[2.4]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                      {val.title}
                    </h4>
                    <p className="text-[12px] text-gray-500 font-medium leading-relaxed max-w-[220px]">
                      {val.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
