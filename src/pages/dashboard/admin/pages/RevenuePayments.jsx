// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { CalendarDays, ChevronDown, Download, Wallet } from "lucide-react";

// function HeaderAction({ children, variant = "blue" }) {
//   const color =
//     variant === "green"
//       ? "text-emerald-700 hover:text-emerald-800"
//       : "text-blue-600 hover:text-blue-700";

//   return (
//     <button
//       type="button"
//       className={`inline-flex items-center gap-1 text-[12px] font-bold transition ${color}`}
//     >
//       {children}
//     </button>
//   );
// }

// // Formats a raw number (in rupees) as "Rs. 8,997" using Indian digit grouping.
// const formatINR = (amount) =>
//   `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

// // Formats a number compactly for chart axis labels, e.g. 150000 -> "1.5L", 5000 -> "5K".
// const formatCompactINR = (amount) => {
//   if (amount >= 100000) return `${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
//   if (amount >= 1000) return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
//   return `${Math.round(amount)}`;
// };

// // Formats an ISO date ("2026-07-02") as a short label ("2 Jul").
// const formatShortDate = (isoDate) => {
//   const d = new Date(isoDate);
//   if (isNaN(d.getTime())) return isoDate;
//   return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
// };

// export default function RevenuePayments() {
//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/api/revenue/dashboard`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setDashboard(response.data?.data || null);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, []);

//   const stats = dashboard?.stats;
//   const revenueOverview = dashboard?.revenueOverview || [];
//   const topCourses = dashboard?.topCourses || [];
//   const transactions = dashboard?.transactions || [];

//   const statsData = stats
//     ? [
//         {
//           label: "Total Revenue (Until Now)",
//           value: formatINR(stats.totalRevenue),
//           sub: "All time",
//         },
//         {
//           label: "This Month Revenue",
//           value: formatINR(stats.thisMonthRevenue),
//           sub: "This month",
//         },
//         {
//           label: "This Month Payout",
//           value: formatINR(stats.thisMonthPayout),
//           sub: "Settled",
//         },
//         {
//           label: "This Month Pending",
//           value: formatINR(stats.pendingPayments),
//           sub: "Pending settlement",
//         },
//       ]
//     : [];

//   // Builds the area/line chart paths from revenueOverview, scaled into the 1100x220 viewBox.
//   const chart = useMemo(() => {
//     if (!revenueOverview.length) return null;

//     const maxRevenue = Math.max(...revenueOverview.map((d) => d.revenue), 1);
//     const n = revenueOverview.length;
//     const chartWidth = 1060;
//     const topMargin = 16;
//     const baselineY = 220;
//     const usableHeight = 190 - topMargin;

//     const points = revenueOverview.map((d, i) => {
//       const x = n === 1 ? chartWidth / 2 : (i / (n - 1)) * chartWidth;
//       const y = topMargin + (1 - d.revenue / maxRevenue) * usableHeight;
//       return { x, y };
//     });

//     const linePath = points
//       .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
//       .join(" ");

//     const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baselineY} L ${points[0].x.toFixed(1)} ${baselineY} Z`;

//     const yAxisLabels = [1, 0.75, 0.5, 0.25, 0].map(
//       (f) => `Rs. ${formatCompactINR(maxRevenue * f)}`
//     );

//     // Pick up to 7 evenly-spaced date labels so the axis doesn't get crowded on large ranges.
//     const labelCount = Math.min(7, n);
//     const xAxisLabels = Array.from({ length: labelCount }, (_, i) => {
//       const idx = labelCount === 1 ? 0 : Math.round((i / (labelCount - 1)) * (n - 1));
//       return formatShortDate(revenueOverview[idx].date);
//     });

//     return { areaPath, linePath, yAxisLabels, xAxisLabels };
//   }, [revenueOverview]);

//   return (
//     <div className="w-full space-y-6 bg-[#f8fafc] text-left">
//       <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="ds-page-title">
//             Revenue & Payments
//           </h1>
//           <p className="ds-page-subtitle">
//             Track revenue, payouts, pending payments and transactions.
//           </p>
//         </div>

//         <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
//           <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-xs transition hover:bg-slate-50">
//             <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
//             <span>May</span>
//             <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
//           </button>
//           <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-xs transition hover:bg-slate-50">
//             <span>2025</span>
//             <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
//           </button>
//         </div>
//       </div>

//       {loading && (
//         <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-sm font-semibold text-slate-500 shadow-xs">
//           Loading dashboard...
//         </div>
//       )}

//       {!loading && error && (
//         <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-sm font-semibold text-red-500 shadow-xs">
//           Error: {error.message}
//         </div>
//       )}

//       {!loading && !error && dashboard && (
//         <>
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//             {statsData.map((item) => (
//               <div
//                 key={item.label}
//                 className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-500 tracking-tight">
//                       {item.label}
//                     </p>
//                     <p className="mt-2 text-[22px] font-bold leading-none tracking-tight text-[#333333]">
//                       {item.value}
//                     </p>
//                     <p className="mt-1 text-xs font-medium text-slate-500">
//                       {item.sub}
//                     </p>
//                   </div>
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                     <Wallet className="h-4 w-4" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
//             <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
//               <h3 className="text-xl font-bold tracking-tight text-gray-700">Revenue Overview</h3>
//               <div className="flex rounded-lg border border-slate-100 bg-slate-100/80 p-1 text-[10px] font-bold text-slate-700">
//                 <button className="rounded-md bg-white px-3 py-1 text-emerald-700 shadow-2xs">
//                   This Month
//                 </button>
//                 <button className="rounded-md px-3 py-1 transition hover:text-slate-900">
//                   Last 3 Months
//                 </button>
//                 <button className="rounded-md px-3 py-1 transition hover:text-slate-900">
//                   This Year
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6">
//               {chart ? (
//                 <>
//                   <div className="h-[250px] w-full">
//                     <div className="flex h-full w-full gap-2">
//                       <div className="flex shrink-0 flex-col justify-between py-0.5 text-right text-[10px] font-semibold text-slate-400">
//                         {chart.yAxisLabels.map((label, i) => (
//                           <span key={`${label}-${i}`}>{label}</span>
//                         ))}
//                       </div>

//                       <div className="relative flex-1 overflow-hidden rounded-xl">
//                         <div
//                           className="absolute inset-0 rounded-xl"
//                           style={{
//                             backgroundImage:
//                               "linear-gradient(to right, #e8edf2 1px, transparent 1px), linear-gradient(to bottom, #e8edf2 1px, transparent 1px)",
//                             backgroundSize: "8.33% 25%",
//                           }}
//                         />
//                         <svg
//                           className="relative z-10 h-full w-full"
//                           preserveAspectRatio="none"
//                           viewBox="0 0 1100 220"
//                         >
//                           <defs>
//                             <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="0%" stopColor="#1fa485" stopOpacity="0.62" />
//                               <stop offset="45%" stopColor="#2ec4b6" stopOpacity="0.28" />
//                               <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
//                             </linearGradient>
//                           </defs>

//                           <path d={chart.areaPath} fill="url(#revenueAreaGrad)" />
//                           <path
//                             d={chart.linePath}
//                             fill="none"
//                             stroke="#1fa485"
//                             strokeDasharray="3 3"
//                             strokeLinecap="round"
//                             strokeWidth="2.4"
//                           />
//                         </svg>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-3 flex w-full justify-between pl-11 text-[11px] font-bold text-slate-400">
//                     {chart.xAxisLabels.map((label, i) => (
//                       <span
//                         key={`${label}-${i}`}
//                         className="w-full text-center first:text-left last:text-right"
//                       >
//                         {label}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="mt-6 flex items-center gap-2 pl-11 text-xs font-bold text-slate-600">
//                     <span className="h-2.5 w-2.5 rounded-sm bg-[#1fa485]" />
//                     Revenue (Rs.)
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex h-[200px] items-center justify-center text-xs font-semibold text-slate-400">
//                   No revenue data for this period.
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-5">
//             <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
//               <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
//                 <h3 className="ds-section-title">
//                   Top Courses by Revenue
//                 </h3>
//                 <div className="flex items-center gap-3">
//                   <HeaderAction>View All</HeaderAction>
//                   <HeaderAction variant="green">
//                     {/* Export Report <Download size={14} /> */}
//                   </HeaderAction>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-[900px] w-full table-fixed text-xs">
//                   <colgroup>
//                     <col className="w-1/4" />
//                     <col className="w-1/4" />
//                     <col className="w-1/4" />
//                     <col className="w-1/4" />
//                   </colgroup>
//                   <thead>
//                     <tr className="border-b border-slate-100 text-left font-bold text-slate-700">
//                       <th className="py-3">Courses</th>
//                       <th className="py-3 text-center">Enrollments</th>
//                       <th className="py-3 text-center">Revenue</th>
//                       <th className="py-3 text-right">Course Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {topCourses.length === 0 && (
//                       <tr>
//                         <td colSpan={4} className="py-6 text-center text-slate-400 font-semibold">
//                           No course revenue yet.
//                         </td>
//                       </tr>
//                     )}
//                     {topCourses.map((item) => (
//                       <tr key={item.courseId}>
//                         <td className="py-3 font-bold text-slate-800">
//                           {item.courseName}
//                         </td>
//                         <td className="py-3 text-center font-semibold text-slate-700">
//                           {item.enrollments}
//                         </td>
//                         <td className="py-3 text-center ds-table-strong">
//                           {formatINR(item.revenue)}
//                         </td>
//                         <td className="py-3 text-right">
//                           <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 capitalize">
//                             {item.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </section>

//             <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
//               <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
//                 <h3 className="ds-section-title">
//                   Recent Transactions
//                 </h3>
//                 <div className="flex items-center gap-3">
//                   <HeaderAction>View All</HeaderAction>
//                   <HeaderAction variant="green">
//                     {/* Export Report <Download size={14} /> */}
//                   </HeaderAction>
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-[900px] w-full table-fixed text-xs">
//                   <colgroup>
//                     <col className="w-1/4" />
//                     <col className="w-1/4" />
//                     <col className="w-1/4" />
//                     <col className="w-1/4" />
//                   </colgroup>
//                   <thead>
//                     <tr className="border-b border-slate-100 text-left font-bold text-slate-700">
//                       <th className="py-3">Date</th>
//                       <th className="py-3 text-center">Student</th>
//                       <th className="py-3 text-center">Course</th>
//                       <th className="py-3 text-right">Amount</th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {transactions.length === 0 && (
//                       <tr>
//                         <td colSpan={4} className="py-6 text-center text-slate-400 font-semibold">
//                           No transactions yet.
//                         </td>
//                       </tr>
//                     )}
//                     {transactions.map((item) => (
//                       <tr key={item.paymentId}>
//                         <td className="py-3 font-semibold text-slate-600">
//                           {item.date}
//                         </td>
//                         <td className="py-3 text-center font-bold text-slate-800">
//                           {item.student?.name?.trim()}
//                         </td>

//                         <td className="py-3 text-center font-medium text-slate-700">
//                           {item.course?.title}
//                         </td>
//                         <td className="py-3 text-right ds-table-strong">
//                           {formatINR(item.amount)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { CalendarDays, ChevronDown, Wallet } from "lucide-react";

// function HeaderAction({ children, variant = "blue" }) {
//   const color =
//     variant === "green"
//       ? "text-emerald-700 hover:text-emerald-800"
//       : "text-blue-600 hover:text-blue-700";
//   return (
//     <button
//       type="button"
//       className={`inline-flex items-center gap-1 text-[12px] font-bold transition ${color}`}
//     >
//       {children}
//     </button>
//   );
// }

// const formatINR = (amount) =>
//   `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

// const formatCompactINR = (amount) => {
//   if (amount >= 100000)
//     return `${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
//   if (amount >= 1000)
//     return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
//   return `${Math.round(amount)}`;
// };

// const formatShortDate = (isoDate) => {
//   const d = new Date(isoDate);
//   if (isNaN(d.getTime())) return isoDate;
//   return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
// };

// const MONTHS = [
//   { label: "January", value: 1 },
//   { label: "February", value: 2 },
//   { label: "March", value: 3 },
//   { label: "April", value: 4 },
//   { label: "May", value: 5 },
//   { label: "June", value: 6 },
//   { label: "July", value: 7 },
//   { label: "August", value: 8 },
//   { label: "September", value: 9 },
//   { label: "October", value: 10 },
//   { label: "November", value: 11 },
//   { label: "December", value: 12 },
// ];

// const CURRENT_YEAR = new Date().getFullYear();
// const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

// const CHART_PERIODS = ["This Month", "Last 3 Months", "This Year"];

// export default function RevenuePayments() {
//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [courseTitles, setCourseTitles] = useState({});

//   // FIX 1 — working filter state
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
//   const [chartPeriod, setChartPeriod] = useState("This Month");

//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   // FIX 1 — pass month/year to API
//   useEffect(() => {
//     const fetchDashboard = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/api/revenue/dashboard`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             params: {
//               month: selectedMonth,
//               year: selectedYear,
//               period: chartPeriod,
//             },
//           },
//         );
//         setDashboard(response.data?.data || null);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboard();
//   }, [selectedMonth, selectedYear, chartPeriod]);

//   useEffect(() => {
//     const fetchCourseTitles = async () => {
//       try {
//         const res = await axios.get(`${BASE_API_URL}/api/courses/`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         const map = {};
//         (res.data?.data || []).forEach((c) => {
//           const id = c.courseId || c._id || c.id;
//           const title =
//             c.basicDetails?.courseTitle || c.title || c.basicDetails?.title;
//           if (id && title) map[id] = title;
//         });
//         setCourseTitles(map);
//       } catch (err) {
//         console.error("Failed to fetch course titles", err);
//       }
//     };
//     fetchCourseTitles();
//   }, []);

//   const stats = dashboard?.stats;
//   const revenueOverview = dashboard?.revenueOverview || [];
//   const topCourses = dashboard?.topCourses || [];
//   const transactions = dashboard?.transactions || [];

//   const statsData = stats
//     ? [
//         {
//           label: "Total Revenue (Until Now)",
//           value: formatINR(stats.totalRevenue),
//           sub: "All time",
//         },
//         {
//           label: "This Month Revenue",
//           value: formatINR(stats.thisMonthRevenue),
//           sub: "This month",
//         },
//         {
//           label: "This Month Payout",
//           value: formatINR(stats.thisMonthPayout),
//           sub: "Settled",
//         },
//         {
//           label: "This Month Pending",
//           value: formatINR(stats.pendingPayments),
//           sub: "Pending settlement",
//         },
//       ]
//     : [];

//   // FIX 2 — improved chart with better path calculation
//   const chart = useMemo(() => {
//     if (!revenueOverview.length) return null;

//     const revenues = revenueOverview.map((d) => d.revenue);
//     const maxRevenue = Math.max(...revenues, 1);
//     const minRevenue = Math.min(...revenues, 0);
//     const range = maxRevenue - minRevenue || 1;
//     const n = revenueOverview.length;
//     const chartWidth = 1060;
//     const topPad = 20;
//     const bottomPad = 10;
//     const usableH = 220 - topPad - bottomPad;

//     const points = revenueOverview.map((d, i) => ({
//       x: n === 1 ? chartWidth / 2 : (i / (n - 1)) * chartWidth,
//       y: topPad + (1 - (d.revenue - minRevenue) / range) * usableH,
//     }));

//     // Smooth catmull-rom curve
//     let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
//     for (let i = 0; i < points.length - 1; i++) {
//       const p0 = points[i - 1] || points[i];
//       const p1 = points[i];
//       const p2 = points[i + 1];
//       const p3 = points[i + 2] || p2;
//       const cp1x = p1.x + (p2.x - p0.x) / 6;
//       const cp1y = p1.y + (p2.y - p0.y) / 6;
//       const cp2x = p2.x - (p3.x - p1.x) / 6;
//       const cp2y = p2.y - (p3.y - p1.y) / 6;
//       d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
//     }
//     const last = points[points.length - 1];
//     const linePath = d;
//     const areaPath = `${d} L ${last.x.toFixed(1)} 230 L 0 230 Z`;

//     const yAxisLabels = [1, 0.75, 0.5, 0.25, 0].map(
//       (f) => `Rs. ${formatCompactINR(minRevenue + range * f)}`,
//     );

//     const labelCount = Math.min(7, n);
//     const xAxisLabels = Array.from({ length: labelCount }, (_, i) => {
//       const idx =
//         labelCount === 1 ? 0 : Math.round((i / (labelCount - 1)) * (n - 1));
//       return formatShortDate(revenueOverview[idx].date);
//     });

//     // Dot points for each data point
//     const dots = points;

//     return { areaPath, linePath, yAxisLabels, xAxisLabels, dots, points };
//   }, [revenueOverview]);

//   // FIX 3 — course name fallback
//   const getCourseName = (item) =>
//     courseTitles[item.courseId] ||
//     courseTitles[item.course?.id] ||
//     courseTitles[item.course?.courseId] ||
//     item.courseName?.trim() ||
//     item.course?.title?.trim() ||
//     `Course (${item.courseId?.slice(-6) || "N/A"})`;

//   return (
//     <div className="w-full space-y-6 bg-[#f8fafc] text-left">
//       {/* Header */}
//       <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">
//             Revenue & Payments
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Track revenue, payouts, pending payments and transactions.
//           </p>
//         </div>

//         {/* FIX 1 — working dropdowns */}
//         <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
//           <div className="relative">
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(Number(e.target.value))}
//               className="appearance-none flex items-center gap-2 rounded-lg border border-slate-200 bg-white pl-9 pr-8 py-2.5 text-xs font-bold text-slate-600 shadow-xs transition hover:bg-slate-50 outline-none cursor-pointer"
//             >
//               {MONTHS.map((m) => (
//                 <option key={m.value} value={m.value}>
//                   {m.label}
//                 </option>
//               ))}
//             </select>
//             <CalendarDays className="h-4 w-4 shrink-0 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
//             <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
//           </div>

//           <div className="relative">
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(Number(e.target.value))}
//               className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2.5 text-xs font-bold text-slate-600 shadow-xs transition hover:bg-slate-50 outline-none cursor-pointer"
//             >
//               {YEARS.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       {loading && (
//         <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-sm font-semibold text-slate-500 shadow-xs">
//           Loading dashboard...
//         </div>
//       )}

//       {!loading && error && (
//         <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-sm font-semibold text-red-500 shadow-xs">
//           Error: {error.message}
//         </div>
//       )}

//       {!loading && !error && dashboard && (
//         <>
//           {/* Stats */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//             {statsData.map((item) => (
//               <div
//                 key={item.label}
//                 className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-500 tracking-tight">
//                       {item.label}
//                     </p>
//                     <p className="mt-2 text-[22px] font-bold leading-none tracking-tight text-[#333333]">
//                       {item.value}
//                     </p>
//                     <p className="mt-1 text-xs font-medium text-slate-500">
//                       {item.sub}
//                     </p>
//                   </div>
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                     <Wallet className="h-4 w-4" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Chart — FIX 2 improved UI */}
//           <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
//             <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
//               <div>
//                 <h3 className="text-xl font-bold tracking-tight text-gray-700">
//                   Revenue Overview
//                 </h3>
//                 <p className="text-xs text-slate-400 mt-0.5 font-medium">
//                   {MONTHS.find((m) => m.value === selectedMonth)?.label}{" "}
//                   {selectedYear}
//                 </p>
//               </div>
//               {/* FIX 1 — working chart period toggle */}
//               <div className="flex rounded-lg border border-slate-100 bg-slate-100/80 p-1 text-[10px] font-bold text-slate-700">
//                 {CHART_PERIODS.map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => setChartPeriod(p)}
//                     className={`rounded-md px-3 py-1 transition ${
//                       chartPeriod === p
//                         ? "bg-white text-emerald-700 shadow-2xs"
//                         : "hover:text-slate-900"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6">
//               {chart ? (
//                 <>
//                   <div className="h-[260px] w-full">
//                     <div className="flex h-full w-full gap-3">
//                       {/* Y axis */}
//                       <div className="flex shrink-0 flex-col justify-between py-1 text-right text-[10px] font-semibold text-slate-400 w-12">
//                         {chart.yAxisLabels.map((label, i) => (
//                           <span key={i}>{label}</span>
//                         ))}
//                       </div>

//                       {/* Chart area */}
//                       <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
//                         {/* Grid */}
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             backgroundImage:
//                               "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
//                             backgroundSize: "12.5% 25%",
//                           }}
//                         />

//                         <svg
//                           className="relative z-10 h-full w-full"
//                           preserveAspectRatio="none"
//                           viewBox="0 0 1100 240"
//                         >
//                           <defs>
//                             <linearGradient
//                               id="revenueAreaGrad"
//                               x1="0"
//                               y1="0"
//                               x2="0"
//                               y2="1"
//                             >
//                               <stop
//                                 offset="0%"
//                                 stopColor="#1fa485"
//                                 stopOpacity="0.55"
//                               />
//                               <stop
//                                 offset="50%"
//                                 stopColor="#2ec4b6"
//                                 stopOpacity="0.20"
//                               />
//                               <stop
//                                 offset="100%"
//                                 stopColor="#ffffff"
//                                 stopOpacity="0"
//                               />
//                             </linearGradient>
//                             <filter id="shadow">
//                               <feDropShadow
//                                 dx="0"
//                                 dy="2"
//                                 stdDeviation="3"
//                                 floodColor="#1fa485"
//                                 floodOpacity="0.3"
//                               />
//                             </filter>
//                           </defs>

//                           {/* Horizontal gridlines */}
//                           {[0, 55, 110, 165, 220].map((y) => (
//                             <line
//                               key={y}
//                               x1="0"
//                               y1={y}
//                               x2="1100"
//                               y2={y}
//                               stroke="#e2e8f0"
//                               strokeWidth="1"
//                             />
//                           ))}

//                           <path
//                             d={chart.areaPath}
//                             fill="url(#revenueAreaGrad)"
//                           />
//                           <path
//                             d={chart.linePath}
//                             fill="none"
//                             stroke="#1fa485"
//                             strokeWidth="2.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             filter="url(#shadow)"
//                           />

//                           {/* Dots on data points */}
//                           {chart.dots.map((pt, i) => (
//                             <g key={i}>
//                               <circle
//                                 cx={pt.x}
//                                 cy={pt.y}
//                                 r="5"
//                                 fill="#fff"
//                                 stroke="#1fa485"
//                                 strokeWidth="2"
//                               />
//                               <circle
//                                 cx={pt.x}
//                                 cy={pt.y}
//                                 r="2.5"
//                                 fill="#1fa485"
//                               />
//                             </g>
//                           ))}
//                         </svg>
//                       </div>
//                     </div>
//                   </div>

//                   {/* X axis */}
//                   <div className="mt-2 flex w-full justify-between pl-16 text-[10px] font-bold text-slate-400">
//                     {chart.xAxisLabels.map((label, i) => (
//                       <span
//                         key={i}
//                         className="w-full text-center first:text-left last:text-right"
//                       >
//                         {label}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="mt-4 flex items-center gap-2 pl-16 text-xs font-bold text-slate-600">
//                     <span className="h-2.5 w-2.5 rounded-sm bg-[#1fa485]" />
//                     Revenue (Rs.)
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex h-[200px] items-center justify-center text-xs font-semibold text-slate-400">
//                   No revenue data for this period.
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Tables */}
//           <div className="space-y-5">
//             <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
//               <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
//                 <h3 className="text-base font-bold text-slate-800">
//                   Top Courses by Revenue
//                 </h3>
//                 <HeaderAction>View All</HeaderAction>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-[700px] w-full table-fixed text-xs">
//                   <thead>
//                     <tr className="border-b border-slate-100 text-left font-bold text-slate-500 text-[11px] uppercase tracking-wide">
//                       <th className="py-3 w-2/5">Course</th>
//                       <th className="py-3 text-center w-1/5">Enrollments</th>
//                       <th className="py-3 text-center w-1/5">Revenue</th>
//                       <th className="py-3 text-right w-1/5">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {topCourses.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="py-6 text-center text-slate-400 font-semibold"
//                         >
//                           No course revenue yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       topCourses.map((item) => (
//                         <tr
//                           key={item.courseId}
//                           className="hover:bg-slate-50/50 transition-colors"
//                         >
//                           {/* FIX 3 — course name fallback */}
//                           <td className="py-3.5 font-semibold text-slate-800">
//                             {getCourseName(item)}
//                           </td>
//                           <td className="py-3.5 text-center font-semibold text-slate-700">
//                             {item.enrollments}
//                           </td>
//                           <td className="py-3.5 text-center font-bold text-slate-800">
//                             {formatINR(item.revenue)}
//                           </td>
//                           <td className="py-3.5 text-right">
//                             <span
//                               className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
//                                 item.status === "active"
//                                   ? "bg-emerald-50 text-emerald-700"
//                                   : "bg-slate-100 text-slate-500"
//                               }`}
//                             >
//                               {item.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>

//             <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
//               <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
//                 <h3 className="text-base font-bold text-slate-800">
//                   Recent Transactions
//                 </h3>
//                 <HeaderAction>View All</HeaderAction>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-[700px] w-full table-fixed text-xs">
//                   <thead>
//                     <tr className="border-b border-slate-100 text-left font-bold text-slate-500 text-[11px] uppercase tracking-wide">
//                       <th className="py-3 w-1/4">Date</th>
//                       <th className="py-3 text-center w-1/4">Student</th>
//                       <th className="py-3 text-center w-1/4">Course</th>
//                       <th className="py-3 text-right w-1/4">Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {transactions.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="py-6 text-center text-slate-400 font-semibold"
//                         >
//                           No transactions yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       transactions.map((item) => (
//                         <tr
//                           key={item.paymentId}
//                           className="hover:bg-slate-50/50 transition-colors"
//                         >
//                           <td className="py-3.5 font-semibold text-slate-500">
//                             {item.date}
//                           </td>
//                           <td className="py-3.5 text-center font-bold text-slate-800">
//                             {item.student?.name?.trim()}
//                           </td>
//                           {/* FIX 3 — course name in transactions */}
//                           <td className="py-3.5 text-center font-medium text-slate-600">
//                             {courseTitles[item.course?.id] ||
//                               courseTitles[item.course?.courseId] ||
//                               courseTitles[item.courseId] ||
//                               (item.course?.title !== "Untitled Course"
//                                 ? item.course?.title
//                                 : null) ||
//                               `Course (${(item.course?.id || item.courseId)?.slice(-6) || "N/A"})`}
//                           </td>
//                           <td className="py-3.5 text-right font-bold text-slate-800">
//                             {formatINR(item.amount)}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }






// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { CalendarDays, ChevronDown, Wallet } from "lucide-react";

// function HeaderAction({ children, variant = "blue", onClick }) {
//   const color =
//     variant === "green"
//       ? "text-emerald-700 hover:text-emerald-800"
//       : "text-blue-600 hover:text-blue-700";
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`inline-flex items-center gap-1 text-[12px] font-bold transition ${color}`}
//     >
//       {children}
//     </button>
//   );
// }

// const formatINR = (amount) =>
//   `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

// const formatCompactINR = (amount) => {
//   if (amount >= 100000)
//     return `${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
//   if (amount >= 1000)
//     return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
//   return `${Math.round(amount)}`;
// };

// const formatShortDate = (isoDate) => {
//   const d = new Date(isoDate);
//   if (isNaN(d.getTime())) return isoDate;
//   return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
// };

// const MONTHS = [
//   { label: "January", value: 1 },
//   { label: "February", value: 2 },
//   { label: "March", value: 3 },
//   { label: "April", value: 4 },
//   { label: "May", value: 5 },
//   { label: "June", value: 6 },
//   { label: "July", value: 7 },
//   { label: "August", value: 8 },
//   { label: "September", value: 9 },
//   { label: "October", value: 10 },
//   { label: "November", value: 11 },
//   { label: "December", value: 12 },
// ];

// const CURRENT_YEAR = new Date().getFullYear();
// const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

// const CHART_PERIODS = ["This Month", "Last 3 Months", "This Year"];

// // how many rows to show by default before "View All" is used
// const PREVIEW_ROWS = 5;

// export default function RevenuePayments() {
//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [courseTitles, setCourseTitles] = useState({});

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
//   const [chartPeriod, setChartPeriod] = useState("This Month");

//   // FIX 4 — View All toggle state for each table
//   const [showAllCourses, setShowAllCourses] = useState(false);
//   const [showAllTransactions, setShowAllTransactions] = useState(false);

//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/api/revenue/dashboard`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//             params: {
//               month: selectedMonth,
//               year: selectedYear,
//               period: chartPeriod,
//             },
//           },
//         );
//         setDashboard(response.data?.data || null);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboard();
//   }, [selectedMonth, selectedYear, chartPeriod]);

//   useEffect(() => {
//     const fetchCourseTitles = async () => {
//       try {
//         const res = await axios.get(`${BASE_API_URL}/api/courses/`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         const map = {};
//         (res.data?.data || []).forEach((c) => {
//           const id = c.courseId || c._id || c.id;
//           const title =
//             c.basicDetails?.courseTitle || c.title || c.basicDetails?.title;
//           if (id && title) map[id] = title;
//         });
//         setCourseTitles(map);
//       } catch (err) {
//         console.error("Failed to fetch course titles", err);
//       }
//     };
//     fetchCourseTitles();
//   }, []);

//   const stats = dashboard?.stats;
//   const revenueOverview = dashboard?.revenueOverview || [];
//   const topCourses = dashboard?.topCourses || [];
//   const transactions = dashboard?.transactions || [];

//   // FIX 4 — rows actually rendered per table, based on toggle
//   const visibleCourses = showAllCourses
//     ? topCourses
//     : topCourses.slice(0, PREVIEW_ROWS);
//   const visibleTransactions = showAllTransactions
//     ? transactions
//     : transactions.slice(0, PREVIEW_ROWS);

//   const statsData = stats
//     ? [
//         {
//           label: "Total Revenue (Until Now)",
//           value: formatINR(stats.totalRevenue),
//           sub: "All time",
//         },
//         {
//           label: "This Month Revenue",
//           value: formatINR(stats.thisMonthRevenue),
//           sub: "This month",
//         },
//         {
//           label: "This Month Payout",
//           value: formatINR(stats.thisMonthPayout),
//           sub: "Settled",
//         },
//         {
//           label: "This Month Pending",
//           value: formatINR(stats.pendingPayments),
//           sub: "Pending settlement",
//         },
//       ]
//     : [];

//   const chart = useMemo(() => {
//     if (!revenueOverview.length) return null;

//     const revenues = revenueOverview.map((d) => d.revenue);
//     const maxRevenue = Math.max(...revenues, 1);
//     const minRevenue = Math.min(...revenues, 0);
//     const range = maxRevenue - minRevenue || 1;
//     const n = revenueOverview.length;
//     const chartWidth = 1060;
//     const topPad = 20;
//     const bottomPad = 10;
//     const usableH = 220 - topPad - bottomPad;

//     const points = revenueOverview.map((d, i) => ({
//       x: n === 1 ? chartWidth / 2 : (i / (n - 1)) * chartWidth,
//       y: topPad + (1 - (d.revenue - minRevenue) / range) * usableH,
//     }));

//     let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
//     for (let i = 0; i < points.length - 1; i++) {
//       const p0 = points[i - 1] || points[i];
//       const p1 = points[i];
//       const p2 = points[i + 1];
//       const p3 = points[i + 2] || p2;
//       const cp1x = p1.x + (p2.x - p0.x) / 6;
//       const cp1y = p1.y + (p2.y - p0.y) / 6;
//       const cp2x = p2.x - (p3.x - p1.x) / 6;
//       const cp2y = p2.y - (p3.y - p1.y) / 6;
//       d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
//     }
//     const last = points[points.length - 1];
//     const linePath = d;
//     const areaPath = `${d} L ${last.x.toFixed(1)} 230 L 0 230 Z`;

//     const yAxisLabels = [1, 0.75, 0.5, 0.25, 0].map(
//       (f) => `Rs. ${formatCompactINR(minRevenue + range * f)}`,
//     );

//     const labelCount = Math.min(7, n);
//     const xAxisLabels = Array.from({ length: labelCount }, (_, i) => {
//       const idx =
//         labelCount === 1 ? 0 : Math.round((i / (labelCount - 1)) * (n - 1));
//       return formatShortDate(revenueOverview[idx].date);
//     });

//     const dots = points;

//     return { areaPath, linePath, yAxisLabels, xAxisLabels, dots, points };
//   }, [revenueOverview]);

//   const getCourseName = (item) =>
//     courseTitles[item.courseId] ||
//     courseTitles[item.course?.id] ||
//     courseTitles[item.course?.courseId] ||
//     item.courseName?.trim() ||
//     item.course?.title?.trim() ||
//     `Course (${item.courseId?.slice(-6) || "N/A"})`;

//   return (
//     <div className="w-full space-y-6 bg-[#f8fafc] text-left">
//       {/* Header */}
//       <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">
//             Revenue & Payments
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Track revenue, payouts, pending payments and transactions.
//           </p>
//         </div>

//         <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
//           <div className="relative">
//             <select
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(Number(e.target.value))}
//               className="appearance-none flex items-center gap-2 rounded-lg border border-slate-200 bg-white pl-9 pr-8 py-2.5 text-xs font-bold text-slate-600 shadow-xs transition hover:bg-slate-50 outline-none cursor-pointer"
//             >
//               {MONTHS.map((m) => (
//                 <option key={m.value} value={m.value}>
//                   {m.label}
//                 </option>
//               ))}
//             </select>
//             <CalendarDays className="h-4 w-4 shrink-0 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
//             <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
//           </div>

//           <div className="relative">
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(Number(e.target.value))}
//               className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2.5 text-xs font-bold text-slate-600 shadow-xs transition hover:bg-slate-50 outline-none cursor-pointer"
//             >
//               {YEARS.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       {loading && (
//         <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-sm font-semibold text-slate-500 shadow-xs">
//           Loading dashboard...
//         </div>
//       )}

//       {!loading && error && (
//         <div className="rounded-xl border border-slate-100 bg-white p-6 text-center text-sm font-semibold text-red-500 shadow-xs">
//           Error: {error.message}
//         </div>
//       )}

//       {!loading && !error && dashboard && (
//         <>
//           {/* Stats */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//             {statsData.map((item) => (
//               <div
//                 key={item.label}
//                 className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-500 tracking-tight">
//                       {item.label}
//                     </p>
//                     <p className="mt-2 text-[22px] font-bold leading-none tracking-tight text-[#333333]">
//                       {item.value}
//                     </p>
//                     <p className="mt-1 text-xs font-medium text-slate-500">
//                       {item.sub}
//                     </p>
//                   </div>
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                     <Wallet className="h-4 w-4" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Chart */}
//           <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
//             <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
//               <div>
//                 <h3 className="text-xl font-bold tracking-tight text-gray-700">
//                   Revenue Overview
//                 </h3>
//                 <p className="text-xs text-slate-400 mt-0.5 font-medium">
//                   {MONTHS.find((m) => m.value === selectedMonth)?.label}{" "}
//                   {selectedYear}
//                 </p>
//               </div>
//               <div className="flex rounded-lg border border-slate-100 bg-slate-100/80 p-1 text-[10px] font-bold text-slate-700">
//                 {CHART_PERIODS.map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => setChartPeriod(p)}
//                     className={`rounded-md px-3 py-1 transition ${
//                       chartPeriod === p
//                         ? "bg-white text-emerald-700 shadow-2xs"
//                         : "hover:text-slate-900"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mt-6">
//               {chart ? (
//                 <>
//                   <div className="h-[260px] w-full">
//                     <div className="flex h-full w-full gap-3">
//                       <div className="flex shrink-0 flex-col justify-between py-1 text-right text-[10px] font-semibold text-slate-400 w-12">
//                         {chart.yAxisLabels.map((label, i) => (
//                           <span key={i}>{label}</span>
//                         ))}
//                       </div>

//                       <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             backgroundImage:
//                               "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
//                             backgroundSize: "12.5% 25%",
//                           }}
//                         />

//                         <svg
//                           className="relative z-10 h-full w-full"
//                           preserveAspectRatio="none"
//                           viewBox="0 0 1100 240"
//                         >
//                           <defs>
//                             <linearGradient
//                               id="revenueAreaGrad"
//                               x1="0"
//                               y1="0"
//                               x2="0"
//                               y2="1"
//                             >
//                               <stop
//                                 offset="0%"
//                                 stopColor="#1fa485"
//                                 stopOpacity="0.55"
//                               />
//                               <stop
//                                 offset="50%"
//                                 stopColor="#2ec4b6"
//                                 stopOpacity="0.20"
//                               />
//                               <stop
//                                 offset="100%"
//                                 stopColor="#ffffff"
//                                 stopOpacity="0"
//                               />
//                             </linearGradient>
//                             <filter id="shadow">
//                               <feDropShadow
//                                 dx="0"
//                                 dy="2"
//                                 stdDeviation="3"
//                                 floodColor="#1fa485"
//                                 floodOpacity="0.3"
//                               />
//                             </filter>
//                           </defs>

//                           {[0, 55, 110, 165, 220].map((y) => (
//                             <line
//                               key={y}
//                               x1="0"
//                               y1={y}
//                               x2="1100"
//                               y2={y}
//                               stroke="#e2e8f0"
//                               strokeWidth="1"
//                             />
//                           ))}

//                           <path
//                             d={chart.areaPath}
//                             fill="url(#revenueAreaGrad)"
//                           />
//                           <path
//                             d={chart.linePath}
//                             fill="none"
//                             stroke="#1fa485"
//                             strokeWidth="2.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             filter="url(#shadow)"
//                           />

//                           {chart.dots.map((pt, i) => (
//                             <g key={i}>
//                               <circle
//                                 cx={pt.x}
//                                 cy={pt.y}
//                                 r="5"
//                                 fill="#fff"
//                                 stroke="#1fa485"
//                                 strokeWidth="2"
//                               />
//                               <circle
//                                 cx={pt.x}
//                                 cy={pt.y}
//                                 r="2.5"
//                                 fill="#1fa485"
//                               />
//                             </g>
//                           ))}
//                         </svg>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-2 flex w-full justify-between pl-16 text-[10px] font-bold text-slate-400">
//                     {chart.xAxisLabels.map((label, i) => (
//                       <span
//                         key={i}
//                         className="w-full text-center first:text-left last:text-right"
//                       >
//                         {label}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="mt-4 flex items-center gap-2 pl-16 text-xs font-bold text-slate-600">
//                     <span className="h-2.5 w-2.5 rounded-sm bg-[#1fa485]" />
//                     Revenue (Rs.)
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex h-[200px] items-center justify-center text-xs font-semibold text-slate-400">
//                   No revenue data for this period.
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Tables */}
//           <div className="space-y-5">
//             {/* Top Courses — FIX 4: working View All + internal scroll */}
//             <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
//               <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
//                 <h3 className="text-base font-bold text-slate-800">
//                   Top Courses by Revenue
//                 </h3>
//                 {topCourses.length > PREVIEW_ROWS && (
//                   <HeaderAction
//                     onClick={() => setShowAllCourses((prev) => !prev)}
//                   >
//                     {showAllCourses ? "Show Less" : "View All"}
//                   </HeaderAction>
//                 )}
//               </div>

//               {/* Scroll wrapper: caps table height and scrolls internally
//                   instead of pushing the rest of the page down */}
//               <div
//                 className={`overflow-x-auto ${
//                   showAllCourses ? "max-h-[360px] overflow-y-auto" : ""
//                 }`}
//               >
//                 <table className="min-w-[700px] w-full table-fixed text-xs">
//                   <thead className="sticky top-0 z-10 bg-white">
//                     <tr className="border-b border-slate-100 text-left font-bold text-slate-500 text-[11px] uppercase tracking-wide">
//                       <th className="py-3 w-2/5">Course</th>
//                       <th className="py-3 text-center w-1/5">Enrollments</th>
//                       <th className="py-3 text-center w-1/5">Revenue</th>
//                       <th className="py-3 text-right w-1/5">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {topCourses.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="py-6 text-center text-slate-400 font-semibold"
//                         >
//                           No course revenue yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       visibleCourses.map((item) => (
//                         <tr
//                           key={item.courseId}
//                           className="hover:bg-slate-50/50 transition-colors"
//                         >
//                           <td className="py-3.5 font-semibold text-slate-800">
//                             {getCourseName(item)}
//                           </td>
//                           <td className="py-3.5 text-center font-semibold text-slate-700">
//                             {item.enrollments}
//                           </td>
//                           <td className="py-3.5 text-center font-bold text-slate-800">
//                             {formatINR(item.revenue)}
//                           </td>
//                           <td className="py-3.5 text-right">
//                             <span
//                               className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
//                                 item.status === "active"
//                                   ? "bg-emerald-50 text-emerald-700"
//                                   : "bg-slate-100 text-slate-500"
//                               }`}
//                             >
//                               {item.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>

//             {/* Recent Transactions — FIX 4: working View All + internal scroll */}
//             <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
//               <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
//                 <h3 className="text-base font-bold text-slate-800">
//                   Recent Transactions
//                 </h3>
//                 {transactions.length > PREVIEW_ROWS && (
//                   <HeaderAction
//                     onClick={() => setShowAllTransactions((prev) => !prev)}
//                   >
//                     {showAllTransactions ? "Show Less" : "View All"}
//                   </HeaderAction>
//                 )}
//               </div>

//               <div
//                 className={`overflow-x-auto ${
//                   showAllTransactions ? "max-h-[360px] overflow-y-auto" : ""
//                 }`}
//               >
//                 <table className="min-w-[700px] w-full table-fixed text-xs">
//                   <thead className="sticky top-0 z-10 bg-white">
//                     <tr className="border-b border-slate-100 text-left font-bold text-slate-500 text-[11px] uppercase tracking-wide">
//                       <th className="py-3 w-1/4">Date</th>
//                       <th className="py-3 text-center w-1/4">Student</th>
//                       <th className="py-3 text-center w-1/4">Course</th>
//                       <th className="py-3 text-right w-1/4">Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {transactions.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="py-6 text-center text-slate-400 font-semibold"
//                         >
//                           No transactions yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       visibleTransactions.map((item) => (
//                         <tr
//                           key={item.paymentId}
//                           className="hover:bg-slate-50/50 transition-colors"
//                         >
//                           <td className="py-3.5 font-semibold text-slate-500">
//                             {item.date}
//                           </td>
//                           <td className="py-3.5 text-center font-bold text-slate-800">
//                             {item.student?.name?.trim()}
//                           </td>
//                           <td className="py-3.5 text-center font-medium text-slate-600">
//                             {courseTitles[item.course?.id] ||
//                               courseTitles[item.course?.courseId] ||
//                               courseTitles[item.courseId] ||
//                               (item.course?.title !== "Untitled Course"
//                                 ? item.course?.title
//                                 : null) ||
//                               `Course (${(item.course?.id || item.courseId)?.slice(-6) || "N/A"})`}
//                           </td>
//                           <td className="py-3.5 text-right font-bold text-slate-800">
//                             {formatINR(item.amount)}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }






import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { CalendarDays, ChevronDown, Wallet, X } from "lucide-react";

function HeaderAction({ children, variant = "blue", onClick }) {
  const color =
    variant === "green"
      ? "text-emerald-700 hover:text-emerald-800"
      : "text-blue-600 hover:text-blue-700";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[12px] font-bold transition ${color}`}
    >
      {children}
    </button>
  );
}

const formatINR = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

const formatCompactINR = (amount) => {
  if (amount >= 100000)
    return `${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)}L`;
  if (amount >= 1000)
    return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  return `${Math.round(amount)}`;
};

const formatShortDate = (isoDate) => {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

const CHART_PERIODS = ["This Month", "Last 3 Months", "This Year"];

// how many rows to show by default before "View All" is used
const PREVIEW_ROWS = 5;

/* ----------------------------- Shimmer primitives ----------------------------- */

const Shimmer = ({ className = "" }) => (
  <div className={`rounded-full bg-slate-200 animate-pulse ${className}`} />
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2.5 w-full">
            <Shimmer className="h-2.5 w-28" />
            <Shimmer className="h-6 w-24" />
            <Shimmer className="h-2.5 w-16" />
          </div>
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
      <div className="space-y-2">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="h-2.5 w-24" />
      </div>
      <Shimmer className="h-7 w-56 rounded-lg" />
    </div>

    <div className="mt-6 h-[260px] w-full">
      <div className="flex h-full w-full gap-3">
        <div className="flex shrink-0 flex-col justify-between py-1 w-12 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Shimmer key={i} className="h-2.5 w-10 ml-auto" />
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
          <svg
            className="absolute inset-0 h-full w-full animate-pulse"
            preserveAspectRatio="none"
            viewBox="0 0 1100 240"
          >
            <path
              d="M 0 170 C 150 120, 250 200, 400 140 C 550 90, 650 180, 800 130 C 900 100, 1000 160, 1100 110 L 1100 230 L 0 230 Z"
              fill="#e2e8f0"
            />
          </svg>
        </div>
      </div>
    </div>
    <div className="mt-4 flex justify-between pl-16">
      {Array.from({ length: 6 }).map((_, i) => (
        <Shimmer key={i} className="h-2.5 w-8" />
      ))}
    </div>
  </div>
);

const TableSkeletonSection = ({ title, cols = 4, rows = 5 }) => (
  <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
      <Shimmer className="h-4 w-40" />
    </div>
    <div className="space-y-4">
      <div className="flex gap-4 pb-2">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} className="h-2.5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 py-1">
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </section>
);

const DashboardSkeleton = () => (
  <>
    <StatsSkeleton />
    <ChartSkeleton />
    <div className="space-y-5">
      <TableSkeletonSection title="Top Courses by Revenue" cols={4} rows={5} />
      <TableSkeletonSection title="Recent Transactions" cols={4} rows={5} />
    </div>
  </>
);

const DashboardError = ({ message }) => (
  <div className="rounded-xl border border-slate-100 bg-white p-10 shadow-xs">
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
        <X className="w-5 h-5" />
      </div>
      <p className="text-sm font-bold text-slate-700">
        Couldn't load your dashboard
      </p>
      <p className="text-xs font-medium text-slate-500 max-w-xs">
        {message || "Something went wrong. Please try refreshing the page."}
      </p>
    </div>
  </div>
);

export default function RevenuePayments() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseTitles, setCourseTitles] = useState({});

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [chartPeriod, setChartPeriod] = useState("This Month");

  // FIX 4 — View All toggle state for each table
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BASE_API_URL}/api/revenue/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              month: selectedMonth,
              year: selectedYear,
              period: chartPeriod,
            },
          },
        );
        setDashboard(response.data?.data || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [selectedMonth, selectedYear, chartPeriod]);

  useEffect(() => {
    const fetchCourseTitles = async () => {
      try {
        const res = await axios.get(`${BASE_API_URL}/api/courses/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const map = {};
        (res.data?.data || []).forEach((c) => {
          const id = c.courseId || c._id || c.id;
          const title =
            c.basicDetails?.courseTitle || c.title || c.basicDetails?.title;
          if (id && title) map[id] = title;
        });
        setCourseTitles(map);
      } catch (err) {
        console.error("Failed to fetch course titles", err);
      }
    };
    fetchCourseTitles();
  }, []);

  const stats = dashboard?.stats;
  const revenueOverview = dashboard?.revenueOverview || [];
  const topCourses = dashboard?.topCourses || [];
  const transactions = dashboard?.transactions || [];

  // FIX 4 — rows actually rendered per table, based on toggle
  const visibleCourses = showAllCourses
    ? topCourses
    : topCourses.slice(0, PREVIEW_ROWS);
  const visibleTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, PREVIEW_ROWS);

  const statsData = stats
    ? [
        {
          label: "Total Revenue (Until Now)",
          value: formatINR(stats.totalRevenue),
          sub: "All time",
        },
        {
          label: "This Month Revenue",
          value: formatINR(stats.thisMonthRevenue),
          sub: "This month",
        },
        {
          label: "This Month Payout",
          value: formatINR(stats.thisMonthPayout),
          sub: "Settled",
        },
        {
          label: "This Month Pending",
          value: formatINR(stats.pendingPayments),
          sub: "Pending settlement",
        },
      ]
    : [];

  const chart = useMemo(() => {
    if (!revenueOverview.length) return null;

    const revenues = revenueOverview.map((d) => d.revenue);
    const maxRevenue = Math.max(...revenues, 1);
    const minRevenue = Math.min(...revenues, 0);
    const range = maxRevenue - minRevenue || 1;
    const n = revenueOverview.length;
    const chartWidth = 1060;
    const topPad = 20;
    const bottomPad = 10;
    const usableH = 220 - topPad - bottomPad;

    const points = revenueOverview.map((d, i) => ({
      x: n === 1 ? chartWidth / 2 : (i / (n - 1)) * chartWidth,
      y: topPad + (1 - (d.revenue - minRevenue) / range) * usableH,
    }));

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    const last = points[points.length - 1];
    const linePath = d;
    const areaPath = `${d} L ${last.x.toFixed(1)} 230 L 0 230 Z`;

    const yAxisLabels = [1, 0.75, 0.5, 0.25, 0].map(
      (f) => `Rs. ${formatCompactINR(minRevenue + range * f)}`,
    );

    const labelCount = Math.min(7, n);
    const xAxisLabels = Array.from({ length: labelCount }, (_, i) => {
      const idx =
        labelCount === 1 ? 0 : Math.round((i / (labelCount - 1)) * (n - 1));
      return formatShortDate(revenueOverview[idx].date);
    });

    const dots = points;

    return { areaPath, linePath, yAxisLabels, xAxisLabels, dots, points };
  }, [revenueOverview]);

  const getCourseName = (item) =>
    courseTitles[item.courseId] ||
    courseTitles[item.course?.id] ||
    courseTitles[item.course?.courseId] ||
    item.courseName?.trim() ||
    item.course?.title?.trim() ||
    `Course (${item.courseId?.slice(-6) || "N/A"})`;

  return (
    <div className="w-full space-y-6 bg-[#f8fafc] text-left">
      {/* Header */}
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Revenue & Payments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track revenue, payouts, pending payments and transactions.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="appearance-none flex items-center gap-2 rounded-lg border border-slate-200 bg-white pl-9 pr-8 py-2.5 text-xs font-bold text-slate-600 shadow-xs transition hover:bg-slate-50 outline-none cursor-pointer"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2.5 text-xs font-bold text-slate-600 shadow-xs transition hover:bg-slate-50 outline-none cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading && <DashboardSkeleton />}

      {!loading && error && <DashboardError message={error.message} />}

      {!loading && !error && dashboard && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statsData.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 tracking-tight">
                      {item.label}
                    </p>
                    <p className="mt-2 text-[22px] font-bold leading-none tracking-tight text-[#333333]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {item.sub}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Wallet className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-gray-700">
                  Revenue Overview
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {MONTHS.find((m) => m.value === selectedMonth)?.label}{" "}
                  {selectedYear}
                </p>
              </div>
              <div className="flex rounded-lg border border-slate-100 bg-slate-100/80 p-1 text-[10px] font-bold text-slate-700">
                {CHART_PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`rounded-md px-3 py-1 transition ${
                      chartPeriod === p
                        ? "bg-white text-emerald-700 shadow-2xs"
                        : "hover:text-slate-900"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              {chart ? (
                <>
                  <div className="h-[260px] w-full">
                    <div className="flex h-full w-full gap-3">
                      <div className="flex shrink-0 flex-col justify-between py-1 text-right text-[10px] font-semibold text-slate-400 w-12">
                        {chart.yAxisLabels.map((label, i) => (
                          <span key={i}>{label}</span>
                        ))}
                      </div>

                      <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
                            backgroundSize: "12.5% 25%",
                          }}
                        />

                        <svg
                          className="relative z-10 h-full w-full"
                          preserveAspectRatio="none"
                          viewBox="0 0 1100 240"
                        >
                          <defs>
                            <linearGradient
                              id="revenueAreaGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#1fa485"
                                stopOpacity="0.55"
                              />
                              <stop
                                offset="50%"
                                stopColor="#2ec4b6"
                                stopOpacity="0.20"
                              />
                              <stop
                                offset="100%"
                                stopColor="#ffffff"
                                stopOpacity="0"
                              />
                            </linearGradient>
                            <filter id="shadow">
                              <feDropShadow
                                dx="0"
                                dy="2"
                                stdDeviation="3"
                                floodColor="#1fa485"
                                floodOpacity="0.3"
                              />
                            </filter>
                          </defs>

                          {[0, 55, 110, 165, 220].map((y) => (
                            <line
                              key={y}
                              x1="0"
                              y1={y}
                              x2="1100"
                              y2={y}
                              stroke="#e2e8f0"
                              strokeWidth="1"
                            />
                          ))}

                          <path
                            d={chart.areaPath}
                            fill="url(#revenueAreaGrad)"
                          />
                          <path
                            d={chart.linePath}
                            fill="none"
                            stroke="#1fa485"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#shadow)"
                          />

                          {chart.dots.map((pt, i) => (
                            <g key={i}>
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="5"
                                fill="#fff"
                                stroke="#1fa485"
                                strokeWidth="2"
                              />
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="2.5"
                                fill="#1fa485"
                              />
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex w-full justify-between pl-16 text-[10px] font-bold text-slate-400">
                    {chart.xAxisLabels.map((label, i) => (
                      <span
                        key={i}
                        className="w-full text-center first:text-left last:text-right"
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 pl-16 text-xs font-bold text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#1fa485]" />
                    Revenue (Rs.)
                  </div>
                </>
              ) : (
                <div className="flex h-[200px] items-center justify-center text-xs font-semibold text-slate-400">
                  No revenue data for this period.
                </div>
              )}
            </div>
          </div>

          {/* Tables */}
          <div className="space-y-5">
            {/* Top Courses — FIX 4: working View All + internal scroll */}
            <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
              <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
                <h3 className="text-base font-bold text-slate-800">
                  Top Courses by Revenue
                </h3>
                {topCourses.length > PREVIEW_ROWS && (
                  <HeaderAction
                    onClick={() => setShowAllCourses((prev) => !prev)}
                  >
                    {showAllCourses ? "Show Less" : "View All"}
                  </HeaderAction>
                )}
              </div>

              {/* Scroll wrapper: caps table height and scrolls internally
                  instead of pushing the rest of the page down */}
              <div
                className={`overflow-x-auto ${
                  showAllCourses ? "max-h-[360px] overflow-y-auto" : ""
                }`}
              >
                <table className="min-w-[700px] w-full table-fixed text-xs">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="border-b border-slate-100 text-left font-bold text-slate-500 text-[11px] uppercase tracking-wide">
                      <th className="py-3 w-2/5">Course</th>
                      <th className="py-3 text-center w-1/5">Enrollments</th>
                      <th className="py-3 text-center w-1/5">Revenue</th>
                      <th className="py-3 text-right w-1/5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topCourses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-slate-400 font-semibold"
                        >
                          No course revenue yet.
                        </td>
                      </tr>
                    ) : (
                      visibleCourses.map((item) => (
                        <tr
                          key={item.courseId}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-3.5 font-semibold text-slate-800">
                            {getCourseName(item)}
                          </td>
                          <td className="py-3.5 text-center font-semibold text-slate-700">
                            {item.enrollments}
                          </td>
                          <td className="py-3.5 text-center font-bold text-slate-800">
                            {formatINR(item.revenue)}
                          </td>
                          <td className="py-3.5 text-right">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                                item.status === "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Transactions — FIX 4: working View All + internal scroll */}
            <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs">
              <div className="mb-4 flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
                <h3 className="text-base font-bold text-slate-800">
                  Recent Transactions
                </h3>
                {transactions.length > PREVIEW_ROWS && (
                  <HeaderAction
                    onClick={() => setShowAllTransactions((prev) => !prev)}
                  >
                    {showAllTransactions ? "Show Less" : "View All"}
                  </HeaderAction>
                )}
              </div>

              <div
                className={`overflow-x-auto ${
                  showAllTransactions ? "max-h-[360px] overflow-y-auto" : ""
                }`}
              >
                <table className="min-w-[700px] w-full table-fixed text-xs">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="border-b border-slate-100 text-left font-bold text-slate-500 text-[11px] uppercase tracking-wide">
                      <th className="py-3 w-1/4">Date</th>
                      <th className="py-3 text-center w-1/4">Student</th>
                      <th className="py-3 text-center w-1/4">Course</th>
                      <th className="py-3 text-right w-1/4">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-slate-400 font-semibold"
                        >
                          No transactions yet.
                        </td>
                      </tr>
                    ) : (
                      visibleTransactions.map((item) => (
                        <tr
                          key={item.paymentId}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="py-3.5 font-semibold text-slate-500">
                            {item.date}
                          </td>
                          <td className="py-3.5 text-center font-bold text-slate-800">
                            {item.student?.name?.trim()}
                          </td>
                          <td className="py-3.5 text-center font-medium text-slate-600">
                            {courseTitles[item.course?.id] ||
                              courseTitles[item.course?.courseId] ||
                              courseTitles[item.courseId] ||
                              (item.course?.title !== "Untitled Course"
                                ? item.course?.title
                                : null) ||
                              `Course (${(item.course?.id || item.courseId)?.slice(-6) || "N/A"})`}
                          </td>
                          <td className="py-3.5 text-right font-bold text-slate-800">
                            {formatINR(item.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}