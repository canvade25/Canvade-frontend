import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EXPLORE_CATEGORIES } from "../constants/exploreCategories";

const VISIBLE_COUNT = 12;
const ROTATE_INTERVAL_MS = 30000;
const FADE_DURATION_MS = 500;

const pickRandomSubset = (pool, count) =>
  [...pool].sort(() => Math.random() - 0.5).slice(0, count);

export default function CourseCategoriesComponents({ categories = EXPLORE_CATEGORIES, onSelect }) {
  const navigate = useNavigate();
  const [visibleCategories, setVisibleCategories] = useState(() =>
    pickRandomSubset(categories, VISIBLE_COUNT),
  );
  const [isVisible, setIsVisible] = useState(false);

  // Smooth fade-in on mount / page refresh instead of popping in.
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Periodically crossfade to a fresh random set of 12 from the pool.
  useEffect(() => {
    const rotateTimer = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setVisibleCategories(pickRandomSubset(categories, VISIBLE_COUNT));
        setIsVisible(true);
      }, FADE_DURATION_MS);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(rotateTimer);
  }, [categories]);

  const handleSelect = (label) => {
    if (onSelect) {
      onSelect(label);
      return;
    }
    navigate(`/search?category=${encodeURIComponent(label)}`);
  };

  return (
    <section className="w-full max-w-[1700px] mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
    <div className="w-full rounded-[30px] md:rounded-[40px] overflow-hidden bg-[#F5F6FA] px-6 py-14 md:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-medium leading-snug text-[#1A1A2E] sm:text-3xl md:text-[2.15rem]">
          Explore Top <span className="font-extrabold text-[#0F9D58]">Courses Categories</span>
          <br className="hidden sm:block" /> That Change Yourself
        </h2>

        <div
          className={`mt-10 grid grid-cols-2 gap-4 transition-opacity ease-in-out sm:grid-cols-3 md:grid-cols-4 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
        >
          {visibleCategories.map(({ icon: Icon, label, bg, iconColor }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleSelect(label)}
              className="group flex min-h-[115px] flex-col items-center justify-center space-y-2.5 rounded-xl border border-gray-100/70 border-b-2 bg-white p-3.5 text-center shadow-[0_2px_12px_rgba(0,0,0,0.01)] transition-all hover:border-b-[#007965] hover:shadow-[0_6px_20px_rgba(0,0,0,0.03)]"
            >
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${bg} ${iconColor} transition-transform group-hover:scale-105`}
              >
                <Icon size={28} className="stroke-[2]" />
              </span>
              <p className="line-clamp-2 px-0.5 text-[11px] font-bold leading-tight tracking-tight text-slate-800 sm:text-xs">
                {label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
}
