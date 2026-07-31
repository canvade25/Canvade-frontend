// import React, { useState, useEffect, useMemo } from "react";
// import { MoreVertical, Star } from "lucide-react";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL;
// const menuOptions = ["Reply", "Chat", "Report"];

// function getToken() {
//   return localStorage.getItem("token") || localStorage.getItem("Token");
// }

// /**
//  * Given an array of reviews (each with a numeric `rating` 1-5), compute:
//  * - average rating (1 decimal place)
//  * - total count
//  * - a 5..1 star breakdown with count + percentage, for the chart
//  */
// function computeRatingStats(reviews) {
//   const total = reviews.length;
//   const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

//   reviews.forEach((r) => {
//     const stars = Math.round(Number(r.rating));
//     if (counts[stars] !== undefined) counts[stars] += 1;
//   });

//   const sumRatings = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
//   const average = total > 0 ? (sumRatings / total).toFixed(1) : "0.0";

//   const breakdown = [5, 4, 3, 2, 1].map((stars) => {
//     const count = counts[stars];
//     const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
//     return { stars, count, percentage };
//   });

//   return { average, total, breakdown };
// }

// function initials(name) {
//   if (!name) return "?";
//   return name.trim().charAt(0).toUpperCase();
// }

// const AVATAR_STYLES = [
//   "bg-blue-100 text-blue-600 border-blue-100",
//   "bg-purple-100 text-purple-600 border-purple-100",
//   "bg-amber-100 text-amber-600 border-amber-100",
//   "bg-indigo-100 text-indigo-600 border-indigo-100",
//   "bg-rose-100 text-rose-600 border-rose-100",
//   "bg-emerald-100 text-emerald-600 border-emerald-100",
// ];

// function avatarStyleFor(id) {
//   // Deterministic pick based on id so the same reviewer always gets the same color.
//   let hash = 0;
//   for (let i = 0; i < String(id).length; i++) {
//     hash = (hash + String(id).charCodeAt(i)) % AVATAR_STYLES.length;
//   }
//   return AVATAR_STYLES[hash];
// }

// function Stars({ rating }) {
//   return (
//     <div className="flex items-center gap-0.5">
//       {[...Array(5)].map((_, index) => (
//         <Star
//           key={index}
//           className={`h-3.5 w-3.5 ${
//             index < rating
//               ? "fill-amber-400 text-amber-400"
//               : "fill-slate-200 text-slate-200"
//           }`}
//         />
//       ))}
//     </div>
//   );
// }

// function StatCard({ label, value, helper }) {
//   return (
//     <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-3xs">
//       <p className="ds-card-label">{label}</p>
//       <div className="mt-2 flex items-end gap-2">
//         <p className="ds-stat-value">{value}</p>
//         {helper && (
//           <span className="text-[12px] font-bold text-slate-500">{helper}</span>
//         )}
//       </div>
//     </div>
//   );
// }

// function RatingOverview({ title, data }) {
//   return (
//     <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-3xs">
//       <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
//       <div className="mt-5 space-y-4">
//         {data.map((item) => (
//           <div
//             key={item.stars}
//             className="flex items-center gap-4 text-[12px] font-bold text-slate-600"
//           >
//             <span className="w-12 shrink-0">{item.stars} Star</span>
//             <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
//               <div
//                 className="h-full rounded-full bg-emerald-500"
//                 style={{ width: `${item.percentage}%` }}
//               />
//             </div>
//             <span className="w-16 shrink-0 text-right text-slate-900">
//               {item.count}
//               <span className="ml-1 font-semibold text-slate-500">
//                 ({item.percentage}%)
//               </span>
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function EmptyState({ message }) {
//   return (
//     <div className="py-10 text-center text-[13px] font-semibold text-slate-400">
//       {message}
//     </div>
//   );
// }

// function ReviewsList({ title, type, reviews, loading, error, openMenu, setOpenMenu }) {
//   return (
//     <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
//       <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
//         <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
//         <button
//           type="button"
//           className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-emerald-700 transition hover:bg-emerald-50"
//         >
//           View All
//         </button>
//       </div>

//       {loading && <EmptyState message="Loading reviews..." />}

//       {!loading && error && (
//         <EmptyState message={`Couldn't load reviews: ${error}`} />
//       )}

//       {!loading && !error && reviews.length === 0 && (
//         <EmptyState message="No reviews yet." />
//       )}

//       {!loading && !error && reviews.length > 0 && (
//         <div className="divide-y divide-slate-100">
//           {reviews.map((item) => {
//             const menuKey = `${type}-${item.reviewId}`;

//             return (
//               <div
//                 key={item.reviewId}
//                 className="grid gap-4 py-4 md:grid-cols-[220px_1fr_34px] md:items-start"
//               >
//                 <div className="flex items-start gap-3">
//                   <div
//                     className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold ${avatarStyleFor(
//                       item.reviewId
//                     )}`}
//                   >
//                     {initials(item.studentName)}
//                   </div>
//                   <div className="min-w-0">
//                     <p className="truncate text-[13px] font-bold text-slate-800">
//                       {item.studentName}
//                     </p>
//                     {type === "course" && item.courseTitle && (
//                       <p className="mt-1 truncate text-[11px] font-semibold text-slate-500">
//                         {item.courseTitle}
//                       </p>
//                     )}
//                     <div className="mt-1.5">
//                       <Stars rating={item.rating} />
//                     </div>
//                   </div>
//                 </div>

//                 <p className="text-[12.5px] font-medium leading-5 text-slate-700">
//                   {item.review}
//                 </p>

//                 <div className="relative justify-self-end">
//                   <button
//                     type="button"
//                     className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 transition hover:bg-slate-50"
//                     onClick={() =>
//                       setOpenMenu(openMenu === menuKey ? null : menuKey)
//                     }
//                     aria-label="Review options"
//                   >
//                     <MoreVertical className="h-4 w-4" />
//                   </button>

//                   {openMenu === menuKey && (
//                     <div className="absolute right-0 top-9 z-20 w-32 rounded-xl border border-slate-100 bg-white p-1.5 text-[12px] font-semibold text-slate-700 shadow-xl">
//                       {menuOptions.map((option) => (
//                         <button
//                           key={option}
//                           type="button"
//                           className={`block w-full rounded-lg px-3 py-2 text-left transition hover:bg-slate-50 ${
//                             option === "Report" ? "text-rose-600" : ""
//                           }`}
//                           onClick={() => setOpenMenu(null)}
//                         >
//                           {option}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ReviewsRatingsDashboard() {
//   const [openMenu, setOpenMenu] = useState(null);

//   const [instituteReviews, setInstituteReviews] = useState([]);
//   const [instituteLoading, setInstituteLoading] = useState(true);
//   const [instituteError, setInstituteError] = useState(null);

//   const [courseReviews, setCourseReviews] = useState([]);
//   const [courseLoading, setCourseLoading] = useState(true);
//   const [courseError, setCourseError] = useState(null);

//   useEffect(() => {
//     const authHeaders = { Authorization: `Bearer ${getToken()}` };

//     const fetchInstituteReviews = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/api/institute-reviews/get`,
//           { headers: authHeaders }
//         );
//         setInstituteReviews(response.data.reviews || []);
//       } catch (err) {
//         setInstituteError(err.message);
//       } finally {
//         setInstituteLoading(false);
//       }
//     };

//     const fetchCourseReviews = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/api/course-reviews/get`,
//           { headers: authHeaders }
//         );
//         setCourseReviews(response.data.reviews || []);
//       } catch (err) {
//         setCourseError(err.message);
//       } finally {
//         setCourseLoading(false);
//       }
//     };

//     fetchInstituteReviews();
//     fetchCourseReviews();
//   }, []);

//   const instituteStats = useMemo(
//     () => computeRatingStats(instituteReviews),
//     [instituteReviews]
//   );
//   const courseStats = useMemo(
//     () => computeRatingStats(courseReviews),
//     [courseReviews]
//   );

//   return (
//     <div className="flex min-h-screen w-full flex-col gap-6 bg-[#f8fafc] text-left text-slate-900">
//       <div>
//         <h1 className="ds-page-title">Reviews & Ratings</h1>
//         <p className="ds-page-subtitle">
//           Review student feedback for your institution and courses.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//         <StatCard
//           label="Institution Rating"
//           value={instituteLoading ? "—" : instituteStats.average}
//           helper="/ 5"
//         />
//         <StatCard
//           label="Total Institution Reviews"
//           value={instituteLoading ? "—" : instituteStats.total}
//         />
//         <StatCard
//           label="Total Course Reviews"
//           value={courseLoading ? "—" : courseStats.total}
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
//         <RatingOverview
//           title="Institution Overview"
//           data={instituteStats.breakdown}
//         />
//         <RatingOverview title="Courses Overview" data={courseStats.breakdown} />
//       </div>

//       <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
//         <ReviewsList
//           title="Institution Reviews"
//           type="institution"
//           reviews={instituteReviews}
//           loading={instituteLoading}
//           error={instituteError}
//           openMenu={openMenu}
//           setOpenMenu={setOpenMenu}
//         />
//         <ReviewsList
//           title="Course Reviews"
//           type="course"
//           reviews={courseReviews}
//           loading={courseLoading}
//           error={courseError}
//           openMenu={openMenu}
//           setOpenMenu={setOpenMenu}
//         />
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect, useMemo } from "react";
import { MoreVertical, Star } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const menuOptions = ["Reply", "Chat", "Report"];

// how many reviews to show before "View All" is used
const PREVIEW_ROWS = 3;

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("Token");
}

/**
 * Given an array of reviews (each with a numeric `rating` 1-5), compute:
 * - average rating (1 decimal place)
 * - total count
 * - a 5..1 star breakdown with count + percentage, for the chart
 */
function computeRatingStats(reviews) {
  const total = reviews.length;
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((r) => {
    const stars = Math.round(Number(r.rating));
    if (counts[stars] !== undefined) counts[stars] += 1;
  });

  const sumRatings = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
  const average = total > 0 ? (sumRatings / total).toFixed(1) : "0.0";

  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = counts[stars];
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { stars, count, percentage };
  });

  return { average, total, breakdown };
}

function initials(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

const AVATAR_STYLES = [
  "bg-blue-100 text-blue-600 border-blue-100",
  "bg-purple-100 text-purple-600 border-purple-100",
  "bg-amber-100 text-amber-600 border-amber-100",
  "bg-indigo-100 text-indigo-600 border-indigo-100",
  "bg-rose-100 text-rose-600 border-rose-100",
  "bg-emerald-100 text-emerald-600 border-emerald-100",
];

function avatarStyleFor(id) {
  // Deterministic pick based on id so the same reviewer always gets the same color.
  let hash = 0;
  for (let i = 0; i < String(id).length; i++) {
    hash = (hash + String(id).charCodeAt(i)) % AVATAR_STYLES.length;
  }
  return AVATAR_STYLES[hash];
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-3xs">
      <p className="ds-card-label">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <p className="ds-stat-value">{value}</p>
        {helper && (
          <span className="text-[12px] font-bold text-slate-500">{helper}</span>
        )}
      </div>
    </div>
  );
}

function RatingOverview({ title, data }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-3xs">
      <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
      <div className="mt-5 space-y-4">
        {data.map((item) => (
          <div
            key={item.stars}
            className="flex items-center gap-4 text-[12px] font-bold text-slate-600"
          >
            <span className="w-12 shrink-0">{item.stars} Star</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="w-16 shrink-0 text-right text-slate-900">
              {item.count}
              <span className="ml-1 font-semibold text-slate-500">
                ({item.percentage}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center text-[13px] font-semibold text-slate-400">
      {message}
    </div>
  );
}

function ReviewsList({ title, type, reviews, loading, error, openMenu, setOpenMenu }) {
  // FIX — local "View All" toggle for this list
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? reviews : reviews.slice(0, PREVIEW_ROWS);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
        {reviews.length > PREVIEW_ROWS && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {loading && <EmptyState message="Loading reviews..." />}

      {!loading && error && (
        <EmptyState message={`Couldn't load reviews: ${error}`} />
      )}

      {!loading && !error && reviews.length === 0 && (
        <EmptyState message="No reviews yet." />
      )}

      {!loading && !error && reviews.length > 0 && (
        // Scroll wrapper: caps list height and scrolls internally when
        // expanded, instead of pushing the rest of the page down.
        <div
          className={`divide-y divide-slate-100 ${
            showAll ? "max-h-[420px] overflow-y-auto pr-1" : ""
          }`}
        >
          {visibleReviews.map((item) => {
            const menuKey = `${type}-${item.reviewId}`;

            return (
              <div
                key={item.reviewId}
                className="grid gap-4 py-4 md:grid-cols-[220px_1fr_34px] md:items-start"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold ${avatarStyleFor(
                      item.reviewId
                    )}`}
                  >
                    {initials(item.studentName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-slate-800">
                      {item.studentName}
                    </p>
                    {type === "course" && item.courseTitle && (
                      <p className="mt-1 truncate text-[11px] font-semibold text-slate-500">
                        {item.courseTitle}
                      </p>
                    )}
                    <div className="mt-1.5">
                      <Stars rating={item.rating} />
                    </div>
                  </div>
                </div>

                <p className="text-[12.5px] font-medium leading-5 text-slate-700">
                  {item.review}
                </p>

                <div className="relative justify-self-end">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 transition hover:bg-slate-50"
                    onClick={() =>
                      setOpenMenu(openMenu === menuKey ? null : menuKey)
                    }
                    aria-label="Review options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {openMenu === menuKey && (
                    <div className="absolute right-0 top-9 z-20 w-32 rounded-xl border border-slate-100 bg-white p-1.5 text-[12px] font-semibold text-slate-700 shadow-xl">
                      {menuOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`block w-full rounded-lg px-3 py-2 text-left transition hover:bg-slate-50 ${
                            option === "Report" ? "text-rose-600" : ""
                          }`}
                          onClick={() => setOpenMenu(null)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ReviewsRatingsDashboard() {
  const [openMenu, setOpenMenu] = useState(null);

  const [instituteReviews, setInstituteReviews] = useState([]);
  const [instituteLoading, setInstituteLoading] = useState(true);
  const [instituteError, setInstituteError] = useState(null);

  const [courseReviews, setCourseReviews] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState(null);

  useEffect(() => {
    const authHeaders = { Authorization: `Bearer ${getToken()}` };

    const fetchInstituteReviews = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/institute-reviews/get`,
          { headers: authHeaders }
        );
        setInstituteReviews(response.data.reviews || []);
      } catch (err) {
        setInstituteError(err.message);
      } finally {
        setInstituteLoading(false);
      }
    };

    const fetchCourseReviews = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/course-reviews/get`,
          { headers: authHeaders }
        );
        setCourseReviews(response.data.reviews || []);
      } catch (err) {
        setCourseError(err.message);
      } finally {
        setCourseLoading(false);
      }
    };

    fetchInstituteReviews();
    fetchCourseReviews();
  }, []);

  const instituteStats = useMemo(
    () => computeRatingStats(instituteReviews),
    [instituteReviews]
  );
  const courseStats = useMemo(
    () => computeRatingStats(courseReviews),
    [courseReviews]
  );

  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-[#f8fafc] text-left text-slate-900">
      <div>
        <h1 className="ds-page-title">Reviews & Ratings</h1>
        <p className="ds-page-subtitle">
          Review student feedback for your institution and courses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="Institution Rating"
          value={instituteLoading ? "—" : instituteStats.average}
          helper="/ 5"
        />
        <StatCard
          label="Total Institution Reviews"
          value={instituteLoading ? "—" : instituteStats.total}
        />
        <StatCard
          label="Total Course Reviews"
          value={courseLoading ? "—" : courseStats.total}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RatingOverview
          title="Institution Overview"
          data={instituteStats.breakdown}
        />
        <RatingOverview title="Courses Overview" data={courseStats.breakdown} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ReviewsList
          title="Institution Reviews"
          type="institution"
          reviews={instituteReviews}
          loading={instituteLoading}
          error={instituteError}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />
        <ReviewsList
          title="Course Reviews"
          type="course"
          reviews={courseReviews}
          loading={courseLoading}
          error={courseError}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />
      </div>
    </div>
  );
}