import React, { useState } from "react";
const courses = [
  {
    id: 1,
    title: "Data Science Professional Course",
    provider: "Imarticus Learning",
    rating: 4.6,
    reviews: 1245,
    mode_label: "Online",
    thumbnail: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=120&h=80&fit=crop",
    duration: "6 Months",
    mode: "Online (Live + Recorded)",
    level: "Beginner to Advanced",
    courseFee: "₹ 1,50,000",
    discount: "- ₹ 20,000",
    finalPrice: "₹ 1,30,000",
    emi: "₹ 4,333/month",
    nextBatch: "25 May 2025",
    certificate: "Industry Recognized Certificate",
    placementSupport: true,
    highlights: ["12+ Industry Projects", "Live Mentorship", "Placement Assistance"],
    syllabusLink: "#",
    studentRating: 4.6,
    studentReviews: 1245,
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    provider: "DesignLab",
    rating: 4.7,
    reviews: 980,
    mode_label: "Online",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=120&h=80&fit=crop",
    duration: "4 Months",
    mode: "Online (Live + Recorded)",
    level: "Beginner to Intermediate",
    courseFee: "₹ 95,000",
    discount: "- ₹ 10,000",
    finalPrice: "₹ 85,000",
    emi: "₹ 3,167/month",
    nextBatch: "10 June 2025",
    certificate: "Industry Recognized Certificate",
    placementSupport: true,
    highlights: ["8+ Real World Projects", "Portfolio Development", "Career Guidance"],
    syllabusLink: "#",
    studentRating: 4.7,
    studentReviews: 980,
  },
];

const StarRating = ({ rating, size = "sm" }) => {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <svg key={star} className={`${starSize}`} viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${star}-${rating}`}>
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={filled ? "#F59E0B" : half ? `url(#half-${star}-${rating})` : "#D1D5DB"}
            />
          </svg>
        );
      })}
    </div>
  );
};

const rows = [
  { key: "duration", label: "Duration", icon: "clock" },
  { key: "mode", label: "Mode", icon: "monitor" },
  { key: "level", label: "Level", icon: "bar-chart" },
  { key: "courseFee", label: "Course Fee", icon: "rupee" },
  { key: "discount", label: "Discount", icon: "rupee" },
  { key: "finalPrice", label: "Final Price", icon: "rupee", bold: true },
  { key: "emi", label: "EMI Options", icon: "card" },
  { key: "nextBatch", label: "Next Batch", icon: "calendar" },
  { key: "certificate", label: "Certificate", icon: "shield" },
  { key: "placementSupport", label: "Placement Support", icon: "briefcase" },
  { key: "highlights", label: "Course Highlights", icon: "star" },
  { key: "syllabusLink", label: "Syllabus", icon: "book" },
  { key: "studentRating", label: "Student Rating", icon: "star-outline" },
];

const Icon = ({ name }) => {
  const cls = "w-4 h-4 text-gray-500 flex-shrink-0";
  const icons = {
    clock: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    monitor: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    "bar-chart": (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    rupee: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M6 3h12M6 8h12M15 21 9 8" /><path d="M6 8c0 4 3 6 6 6s6-2 6-6" />
      </svg>
    ),
    card: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
      </svg>
    ),
    calendar: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    shield: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    briefcase: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
    star: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    book: (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
    "star-outline": (
      <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const CellValue = ({ rowKey, course, bold }) => {
  const val = course[rowKey];

  if (rowKey === "discount") {
    return <span className="text-red-500 font-medium text-sm">{val}</span>;
  }
  if (rowKey === "finalPrice") {
    return <span className="font-bold text-gray-900 text-base">{val}</span>;
  }
  if (rowKey === "placementSupport") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-gray-700">
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        Yes
      </span>
    );
  }
  if (rowKey === "certificate") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-gray-700">
        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        {val}
      </span>
    );
  }
  if (rowKey === "highlights") {
    return (
      <ul className="space-y-1">
        {val.map((h, i) => (
          <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
            <span className="text-gray-400 mt-0.5">•</span> {h}
          </li>
        ))}
      </ul>
    );
  }
  if (rowKey === "syllabusLink") {
    return (
      <a href={val} className="text-sm text-[#1a7a5e] font-semibold hover:underline">
        View Syllabus
      </a>
    );
  }
  if (rowKey === "studentRating") {
    return (
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-900 text-base">{val}</span>
        <StarRating rating={val} />
        <span className="text-gray-400 text-xs">({course.studentReviews})</span>
      </div>
    );
  }
  return (
    <span className={`text-sm text-gray-700 ${bold ? "font-bold" : ""}`}>{val}</span>
  );
};

export default function CompareCourses() {
  const [selected, setSelected] = useState([0, 1]);

  const visibleCourses = selected.map((i) => courses[i]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
  
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <span className="text-[#1a7a5e] font-bold text-xl tracking-tight">EduCompare</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-[#d4a017] rounded-full" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a7a5e]">Compare Courses</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[700px] sm:min-w-0">
              <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] border-b border-gray-100">
                <div className="px-4 py-5 flex items-end">
                  <span className="font-semibold text-gray-700 text-sm">Course Details</span>
                </div>

                {visibleCourses.map((course, idx) => (
                  <div
                    key={course.id}
                    className="px-3 sm:px-5 py-4 border-l border-gray-100 flex flex-col gap-2"
                  >
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const other = selected.find((_, i) => i !== idx);
                          setSelected([other, other]);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
                          {course.title}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">{course.provider}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <StarRating rating={course.rating} />
                          <span className="text-xs text-gray-500">
                            {course.rating} ({course.reviews.toLocaleString()} Reviews)
                          </span>
                        </div>
                        <span className="inline-block mt-2 border border-green-600 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {course.mode_label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {rows.map((row, rowIdx) => (
                <div
                  key={row.key}
                  className={`grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] border-b border-gray-100 last:border-0 ${
                    rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                  }`}
                >
                  <div className="px-4 py-4 flex items-start gap-2.5">
                    <Icon name={row.icon} />
                    <span className="text-sm font-medium text-gray-700 leading-snug">{row.label}</span>
                  </div>

                  {visibleCourses.map((course) => (
                    <div
                      key={`${course.id}-${row.key}`}
                      className="px-3 sm:px-5 py-4 border-l border-gray-100 flex items-start"
                    >
                      <CellValue rowKey={row.key} course={course} bold={row.bold} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600">
          {[
            { icon: "shield", text: "All institutes are verified" },
            { icon: "card", text: "100% Secure Payment" },
            { icon: "clock", text: "24/7 Support" },
          ].map((item) => (
            <span key={item.text} className="flex items-center gap-2">
              <Icon name={item.icon} />
              <span>{item.text}</span>
            </span>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © 2025 EduCompare. All rights reserved.
      </footer>
    </div>
  );
}