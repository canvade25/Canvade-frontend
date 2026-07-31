import React from "react";
import { ShieldCheck, LayoutGrid, Route, ScanSearch } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Learn from Trusted Institutions",
    description:
      "Discover courses from verified institutes, universities, coaching centers, Schools and expert educators. Compare quality, ratings, fees, and course details to make informed learning decisions.",
  },
  {
    icon: LayoutGrid,
    title: "Explore Thousands of Courses",
    description:
      "Browse a wide range of courses across technology, business, government exams, design, languages, healthcare, finance, and many more - all in one platform.",
  },
  {
    icon: Route,
    title: "Learn Your Way",
    description:
      "Choose from online, offline, hybrid, live, or self-paced courses that fit your schedule, learning style, location, and career goals.",
  },
  {
    icon: ScanSearch,
    title: "Compare Before You Enroll",
    description:
      "Compare institutes, course fees, durations, reviews, certifications, learning modes, and other essential details to confidently choose the right course.",
  },
];

export default function WhyChooseCanvade() {
  return (
    <section className="w-full bg-white py-10 sm:py-14 md:py-16 px-4 sm:px-6">
      <div className="w-full max-w-[1400px] mx-auto bg-slate-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Heading */}
        <h2 className="flex flex-wrap items-center justify-center gap-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-8 sm:mb-10 md:mb-12">
          <span>Why Students Choose</span>
          <img
            src="/canvade1.png"
            alt="Canvade"
            className="h-8 sm:h-10 md:h-12 w-auto"
          />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6 sm:gap-8 md:gap-10 items-start">
          {/* Left: related image placeholder */}
          <div className="w-full h-full min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[380px] rounded-xl sm:rounded-2xl overflow-hidden">
            <img
              src="/final image.avif"
              alt="Students learning at an institute"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center mb-3 sm:mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-slate-900" strokeWidth={1.75} />
                </div>
                <h3 className="text-base sm:text-lg md:text-lg font-semibold text-slate-900 mb-1.5 sm:mb-2">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}