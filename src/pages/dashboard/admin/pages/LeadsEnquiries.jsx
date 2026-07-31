// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   MessageSquare,
//   HelpCircle,
//   Eye,
//   Search,
//   ShoppingCart,
//   Users,
//   SlidersHorizontal,
//   ChevronDown,
// } from "lucide-react";

// const leadCategories = [
//   {
//     id: "cat-1",
//     title: "My Leads",
//     desc: "Students who viewed, added or enquired about your courses.",
//     countBadge: "12 New",
//     themeColor: "bg-blue-100 border-blue-100 text-blue-600",
//     headerBg: "bg-blue-50 border-blue-100",
//     badgeStyle: "bg-blue-100 text-blue-600 border border-blue-100",
//     headers: ["Student", "Activity", "Course", "Time", "Actions"],
//     rows: [
//       {
//         id: "r1-1",
//         name: "Rohit Sharma",
//         location: "Delhi, India",
//         avatar:
//           "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
//         activityText: "Viewed Profile",
//         activityIcon: <Eye className="w-5 h-5 text-emerald-600" />,
//         course: "Data Science Professional Course",
//         time: "10 min ago",
//       },
//       {
//         id: "r1-2",
//         name: "Ananya Verma",
//         location: "Noida, India",
//         avatar: "A",
//         activityText: "Viewed Course",
//         activityIcon: <Search className="w-5 h-5 text-blue-500" />,
//         course: "Digital Marketing Masterclass",
//         time: "25 min ago",
//       },
//       {
//         id: "r1-3",
//         name: "Karan Mehta",
//         location: "Gurgaon, India",
//         avatar: "K",
//         activityText: "Added Course",
//         activityIcon: <ShoppingCart className="w-5 h-5 text-blue-500" />,
//         course: "UI/UX Design Fundamentals",
//         time: "1 hr ago",
//       },
//       {
//         id: "r1-4",
//         name: "Pooja Singh",
//         location: "Faridabad, India",
//         avatar: "P",
//         activityText: "Viewed Profile",
//         activityIcon: <Eye className="w-5 h-5 text-blue-500" />,
//         course: "Full Stack Web Development",
//         time: "2 hours ago",
//       },
//       {
//         id: "r1-5",
//         name: "Megha Kapoor",
//         location: "Noida, India",
//         avatar: "M",
//         activityText: "Enquired",
//         activityIcon: <HelpCircle className="w-5 h-5 text-emerald-600" />,
//         course: "Python Programming for Beginners",
//         time: "45 min ago",
//       },
//     ],
//   },
//   {
//     id: "cat-2",
//     title: "My Students",
//     desc: "Students who enrolled, completed or are continuing their courses.",
//     countBadge: "23 Students",
//     themeColor: "bg-purple-100 border-purple-100 text-purple-600",
//     headerBg: "bg-purple-50 border-purple-100",
//     badgeStyle: "bg-purple-100 text-purple-600 border border-purple-100",
//     headers: ["Student", "Status", "Course", "Progress", "Actions"],
//     rows: [
//       {
//         id: "r2-1",
//         name: "Sneha Iyer",
//         location: "Mumbai, India",
//         avatar: "S",
//         activityText: "Ongoing",
//         isStatus: true,
//         statusColor: "bg-emerald-500",
//         course: "Data Science Professional Course",
//         progress: 65,
//       },
//       {
//         id: "r2-2",
//         name: "Arjun Patel",
//         location: "Ahmedabad, India",
//         avatar: "A",
//         activityText: "Ongoing",
//         isStatus: true,
//         statusColor: "bg-emerald-500",
//         course: "Full Stack Web Development",
//         progress: 40,
//       },
//       {
//         id: "r2-3",
//         name: "Neha Joshi",
//         location: "Pune, India",
//         avatar: "N",
//         activityText: "Completed",
//         isStatus: true,
//         statusColor: "bg-blue-500",
//         course: "Digital Marketing Masterclass",
//         progress: 100,
//       },
//     ],
//   },
// ];

// const summaryStats = [
//   { label: "Total Leads", value: 2 },
//   { label: "This Month Leads", value: 2 },
//   { label: "Total Enrollments", value: 1 },
//   { label: "Ongoing Students", value: 1 },
// ];

// const MyStudentsTable = () => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/api/enrollments/get-students`,
//           {
//             headers: {
//               Authorization:
//                 `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         console.log("Fetched students:", response.data);
//         console.log("api", `${BASE_API_URL}/api/enrollments/get-students`);
//         setStudents(Array.isArray(response.data.data) ? response.data.data : []);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
//       <div
//         className={`flex items-center justify-between p-4 border-b bg-purple-50 border-purple-100`}
//       >
//         <div className="flex items-center gap-3.5">
//           <div
//             className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-purple-100 border-purple-100 text-purple-600`}
//           >
//             <Users className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
//               My Students
//             </h3>
//             <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
//               Students who enrolled, completed or are continuing their courses.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <span
//             className={`px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-600 border border-purple-100`}
//           >
//             {students.length} Students
//           </span>
//         </div>
//       </div>
//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[960px]">
//           <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
//             <div className="col-span-3">Student</div>
//             <div className="col-span-2 text-center sm:text-left pl-4">
//               Status
//             </div>
//             <div className="col-span-3">Course</div>
//             <div className="col-span-2 text-center">Enrollment Date</div>
//             <div className="col-span-2 text-center pr-2">Actions</div>
//           </div>
//           <div className="divide-y divide-slate-100/60">
//             {students.map((student) => (
//               <div
//                 key={student._id}
//                 className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
//                     <div className="w-10 h-10 rounded-full overflow-hidden">
//                       {student.student?.profileImage ? (
//                         <img
//                           src={student.student.profileImage}
//                           alt={student.student?.name || "Student"}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/default-avatar.png"; // optional fallback image
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
//                           {student.student?.name?.charAt(0)?.toUpperCase() || "?"}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
//                       {student.student.name}
//                     </h4>
//                     <p className="text-[11px] font-semi text-slate-600 mt-0.5">
//                       {student.student.email}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-span-2 flex items-center gap-2 pl-4">
//                   <div className="flex items-center gap-2">
//                     <span className={`w-2 h-2 rounded-full bg-emerald-500`} />
//                     <span className="text-xs font-bold text-slate-700">
//                       Enrolled
//                     </span>
//                   </div>
//                 </div>

//                 <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
//                   {student.course.title}
//                 </div>

//                 <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
//                   <span className="text-[11px] font-bold text-slate-500">
//                     {student.registrationDate}
//                   </span>
//                 </div>
//                 <div className="col-span-2 flex flex-row items-center justify-center gap-3">
//                   <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
//                     <MessageSquare
//                       className="w-4 h-4 text-[#00875a]"
//                       strokeWidth={2.5}
//                     />
//                   </button>
//                   <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
//                     <Users className="w-4 h-4" strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// const activityIconMap = {
//   cart_added: <ShoppingCart className="w-5 h-5 text-blue-500" />,
//   profile_viewed: <Eye className="w-5 h-5 text-blue-500" />,
//   course_viewed: <Search className="w-5 h-5 text-blue-500" />,
//   enquiry: <HelpCircle className="w-5 h-5 text-emerald-600" />,
// };

// const MyLeadsTable = () => {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/api/activities/my`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setLeads(Array.isArray(response.data.data) ? response.data.data : []);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchLeads();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
//       <div className="flex items-center justify-between p-4 border-b bg-blue-50 border-blue-100">
//         <div className="flex items-center gap-3.5">
//           <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-blue-100 border-blue-100 text-blue-600">
//             <Eye className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
//               My Leads
//             </h3>
//             <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
//               Students who viewed, added or enquired about your courses.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-600 border border-blue-100">
//             {leads.length} New
//           </span>
//         </div>
//       </div>

//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[960px]">
//           <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
//             <div className="col-span-3">Student</div>
//             <div className="col-span-2 text-center sm:text-left pl-4">Activity</div>
//             <div className="col-span-3">Course</div>
//             <div className="col-span-2 text-center">Time</div>
//             <div className="col-span-2 text-center pr-2">Actions</div>
//           </div>

//           <div className="divide-y divide-slate-100/60">
//             {leads.length === 0 && (
//               <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
//                 No recent leads yet.
//               </div>
//             )}

//             {leads.map((lead) => (
//               <div
//                 key={lead.activityId}
//                 className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
//                     {lead.student?.profileImage ? (
//                       <img
//                         src={lead.student.profileImage}
//                         alt={lead.student?.name || "Student"}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "/default-avatar.png";
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
//                         {lead.student?.name?.charAt(0)?.toUpperCase() || "?"}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
//                       {lead.student?.name}
//                     </h4>
//                     <p className="text-[11px] font-semi text-slate-600 mt-0.5">
//                       {lead.student?.city}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="col-span-2 flex items-center gap-2 pl-4">
//                   {activityIconMap[lead.activityType] || (
//                     <Eye className="w-5 h-5 text-blue-500" />
//                   )}
//                   <span className="text-xs font-bold text-slate-600">
//                     {lead.activity}
//                   </span>
//                 </div>

//                 <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
//                   {lead.entity?.name}
//                 </div>

//                 <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
//                   <span className="text-[11px] font-bold text-slate-500">
//                     {lead.time}
//                   </span>
//                 </div>

//                 <div className="col-span-2 flex flex-row items-center justify-center gap-3">
//                   <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
//                     <MessageSquare className="w-4 h-4 text-[#00875a]" strokeWidth={2.5} />
//                   </button>
//                   <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
//                     <Users className="w-4 h-4" strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// const LeadsEnquiries = () => {
//   return (
//     <div className="w-full min-h-screen bg-[#f8fafc] px-3 pb-4 sm:px-6 select-none text-left space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full gap-3">
//         <div>
//           <h1 className="ds-page-title">
//             Leads & Enquiries
//           </h1>
//           <p className="ds-page-subtitle">
//             Manage and engage with your potential students.
//           </p>
//         </div>

//         <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
//           <SlidersHorizontal
//             className="w-3.5 h-3.5 text-slate-500"
//             strokeWidth={2}
//           />
//           Filter
//           <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {summaryStats.map((stat) => (
//           <div
//             key={stat.label}
//             className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
//           >
//             <p className="ds-card-label">
//               {stat.label}
//             </p>
//             <p className="ds-stat-value">
//               {stat.value}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-5">
//         <MyLeadsTable />
//         <MyStudentsTable />
//       </div>
//     </div>
//   );
// };

// export default LeadsEnquiries;










// import React, { useState, useEffect, useMemo, useRef } from "react";
// import axios from "axios";
// import {
//   MessageSquare,
//   HelpCircle,
//   Eye,
//   Search,
//   ShoppingCart,
//   Users,
//   SlidersHorizontal,
//   ChevronDown,
//   X,
// } from "lucide-react";

// const summaryStats = [
//   { label: "Total Leads", value: 2 },
//   { label: "This Month Leads", value: 2 },
//   { label: "Total Enrollments", value: 1 },
//   { label: "Ongoing Students", value: 1 },
// ];

// const activityIconMap = {
//   cart_added: <ShoppingCart className="w-5 h-5 text-blue-500" />,
//   profile_viewed: <Eye className="w-5 h-5 text-blue-500" />,
//   course_viewed: <Search className="w-5 h-5 text-blue-500" />,
//   enquiry: <HelpCircle className="w-5 h-5 text-emerald-600" />,
// };

// const activityTypeOptions = [
//   { value: "all", label: "All Activities" },
//   { value: "cart_added", label: "Added Course" },
//   { value: "profile_viewed", label: "Viewed Profile" },
//   { value: "course_viewed", label: "Viewed Course" },
//   { value: "enquiry", label: "Enquired" },
// ];

// const studentStatusOptions = [
//   { value: "all", label: "All Status" },
//   { value: "ongoing", label: "Ongoing" },
//   { value: "completed", label: "Completed" },
// ];

// /* ----------------------------- Filter Bar ----------------------------- */

// const FilterBar = ({ filters, setFilters, onClear }) => {
//   const [open, setOpen] = useState(false);
//   const panelRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const activeCount =
//     (filters.search ? 1 : 0) +
//     (filters.activityType !== "all" ? 1 : 0) +
//     (filters.studentStatus !== "all" ? 1 : 0);

//   return (
//     <div className="relative" ref={panelRef}>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm relative"
//       >
//         <SlidersHorizontal
//           className="w-3.5 h-3.5 text-slate-500"
//           strokeWidth={2}
//         />
//         Filter
//         {activeCount > 0 && (
//           <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-extrabold">
//             {activeCount}
//           </span>
//         )}
//         <ChevronDown
//           className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform ${
//             open ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-4 space-y-4">
//           <div className="flex items-center justify-between">
//             <h4 className="text-xs font-extrabold text-slate-800">Filters</h4>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-slate-400 hover:text-slate-600"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Search
//             </label>
//             <input
//               type="text"
//               value={filters.search}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, search: e.target.value }))
//               }
//               placeholder="Student name or course..."
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
//             />
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Lead Activity
//             </label>
//             <select
//               value={filters.activityType}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, activityType: e.target.value }))
//               }
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
//             >
//               {activityTypeOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Student Status
//             </label>
//             <select
//               value={filters.studentStatus}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, studentStatus: e.target.value }))
//               }
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
//             >
//               {studentStatusOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center justify-between pt-1">
//             <button
//               onClick={() => {
//                 onClear();
//               }}
//               className="text-[11px] font-bold text-slate-500 hover:text-slate-700"
//             >
//               Clear all
//             </button>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-[11px] font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-1.5"
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ----------------------------- Students Table ----------------------------- */

// const MyStudentsTable = ({ filters }) => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/api/enrollments/get-students`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setStudents(Array.isArray(response.data.data) ? response.data.data : []);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const filteredStudents = useMemo(() => {
//     return students.filter((student) => {
//       const name = student.student?.name?.toLowerCase() || "";
//       const email = student.student?.email?.toLowerCase() || "";
//       const course = student.course?.title?.toLowerCase() || "";
//       const search = filters.search.trim().toLowerCase();

//       const matchesSearch =
//         !search ||
//         name.includes(search) ||
//         email.includes(search) ||
//         course.includes(search);

//       const status = (student.status || "ongoing").toLowerCase();
//       const matchesStatus =
//         filters.studentStatus === "all" || status === filters.studentStatus;

//       return matchesSearch && matchesStatus;
//     });
//   }, [students, filters]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
//       <div
//         className={`flex items-center justify-between p-4 border-b bg-purple-50 border-purple-100`}
//       >
//         <div className="flex items-center gap-3.5">
//           <div
//             className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-purple-100 border-purple-100 text-purple-600`}
//           >
//             <Users className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
//               My Students
//             </h3>
//             <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
//               Students who enrolled, completed or are continuing their courses.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <span
//             className={`px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-600 border border-purple-100`}
//           >
//             {filteredStudents.length} Students
//           </span>
//         </div>
//       </div>
//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[960px]">
//           <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
//             <div className="col-span-3">Student</div>
//             <div className="col-span-2 text-center sm:text-left pl-4">
//               Status
//             </div>
//             <div className="col-span-3">Course</div>
//             <div className="col-span-2 text-center">Enrollment Date</div>
//             <div className="col-span-2 text-center pr-2">Actions</div>
//           </div>
//           <div className="divide-y divide-slate-100/60">
//             {filteredStudents.length === 0 && (
//               <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
//                 No students match your filters.
//               </div>
//             )}

//             {filteredStudents.map((student) => (
//               <div
//                 key={student._id}
//                 className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
//                     <div className="w-10 h-10 rounded-full overflow-hidden">
//                       {student.student?.profileImage ? (
//                         <img
//                           src={student.student.profileImage}
//                           alt={student.student?.name || "Student"}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/default-avatar.png";
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
//                           {student.student?.name?.charAt(0)?.toUpperCase() || "?"}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
//                       {student.student.name}
//                     </h4>
//                     <p className="text-[11px] font-semi text-slate-600 mt-0.5">
//                       {student.student.email}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-span-2 flex items-center gap-2 pl-4">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`w-2 h-2 rounded-full ${
//                         (student.status || "ongoing").toLowerCase() ===
//                         "completed"
//                           ? "bg-blue-500"
//                           : "bg-emerald-500"
//                       }`}
//                     />
//                     <span className="text-xs font-bold text-slate-700">
//                       {(student.status || "ongoing").toLowerCase() ===
//                       "completed"
//                         ? "Completed"
//                         : "Enrolled"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
//                   {student.course.title}
//                 </div>

//                 <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
//                   <span className="text-[11px] font-bold text-slate-500">
//                     {student.registrationDate}
//                   </span>
//                 </div>
//                 <div className="col-span-2 flex flex-row items-center justify-center gap-3">
//                   <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
//                     <MessageSquare
//                       className="w-4 h-4 text-[#00875a]"
//                       strokeWidth={2.5}
//                     />
//                   </button>
//                   <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
//                     <Users className="w-4 h-4" strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ----------------------------- Leads Table ----------------------------- */

// const MyLeadsTable = ({ filters }) => {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         const response = await axios.get(`${BASE_API_URL}/api/activities/my`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setLeads(Array.isArray(response.data.data) ? response.data.data : []);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchLeads();
//   }, []);

//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const name = lead.student?.name?.toLowerCase() || "";
//       const city = lead.student?.city?.toLowerCase() || "";
//       const course = lead.entity?.name?.toLowerCase() || "";
//       const search = filters.search.trim().toLowerCase();

//       const matchesSearch =
//         !search ||
//         name.includes(search) ||
//         city.includes(search) ||
//         course.includes(search);

//       const matchesActivity =
//         filters.activityType === "all" ||
//         lead.activityType === filters.activityType;

//       return matchesSearch && matchesActivity;
//     });
//   }, [leads, filters]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
//       <div className="flex items-center justify-between p-4 border-b bg-blue-50 border-blue-100">
//         <div className="flex items-center gap-3.5">
//           <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-blue-100 border-blue-100 text-blue-600">
//             <Eye className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
//               My Leads
//             </h3>
//             <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
//               Students who viewed, added or enquired about your courses.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-600 border border-blue-100">
//             {filteredLeads.length} New
//           </span>
//         </div>
//       </div>

//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[960px]">
//           <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
//             <div className="col-span-3">Student</div>
//             <div className="col-span-2 text-center sm:text-left pl-4">
//               Activity
//             </div>
//             <div className="col-span-3">Course</div>
//             <div className="col-span-2 text-center">Time</div>
//             <div className="col-span-2 text-center pr-2">Actions</div>
//           </div>

//           <div className="divide-y divide-slate-100/60">
//             {filteredLeads.length === 0 && (
//               <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
//                 No leads match your filters.
//               </div>
//             )}

//             {filteredLeads.map((lead) => (
//               <div
//                 key={lead.activityId}
//                 className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
//                     {lead.student?.profileImage ? (
//                       <img
//                         src={lead.student.profileImage}
//                         alt={lead.student?.name || "Student"}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "/default-avatar.png";
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
//                         {lead.student?.name?.charAt(0)?.toUpperCase() || "?"}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
//                       {lead.student?.name}
//                     </h4>
//                     <p className="text-[11px] font-semi text-slate-600 mt-0.5">
//                       {lead.student?.city}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="col-span-2 flex items-center gap-2 pl-4">
//                   {activityIconMap[lead.activityType] || (
//                     <Eye className="w-5 h-5 text-blue-500" />
//                   )}
//                   <span className="text-xs font-bold text-slate-600">
//                     {lead.activity}
//                   </span>
//                 </div>

//                 <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
//                   {lead.entity?.name}
//                 </div>

//                 <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
//                   <span className="text-[11px] font-bold text-slate-500">
//                     {lead.time}
//                   </span>
//                 </div>

//                 <div className="col-span-2 flex flex-row items-center justify-center gap-3">
//                   <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
//                     <MessageSquare
//                       className="w-4 h-4 text-[#00875a]"
//                       strokeWidth={2.5}
//                     />
//                   </button>
//                   <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
//                     <Users className="w-4 h-4" strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ----------------------------- Page ----------------------------- */

// const defaultFilters = {
//   search: "",
//   activityType: "all",
//   studentStatus: "all",
// };

// const LeadsEnquiries = () => {
//   const [filters, setFilters] = useState(defaultFilters);

//   return (
//     <div className="w-full min-h-screen bg-[#f8fafc] px-3 pb-4 sm:px-6 select-none text-left space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full gap-3">
//         <div>
//           <h1 className="ds-page-title">Leads &amp; Enquiries</h1>
//           <p className="ds-page-subtitle">
//             Manage and engage with your potential students.
//           </p>
//         </div>

//         <FilterBar
//           filters={filters}
//           setFilters={setFilters}
//           onClear={() => setFilters(defaultFilters)}
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {summaryStats.map((stat) => (
//           <div
//             key={stat.label}
//             className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
//           >
//             <p className="ds-card-label">{stat.label}</p>
//             <p className="ds-stat-value">{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-5">
//         <MyLeadsTable filters={filters} />
//         <MyStudentsTable filters={filters} />
//       </div>
//     </div>
//   );
// };

// export default LeadsEnquiries;






// import React, { useState, useEffect, useMemo, useRef } from "react";
// import axios from "axios";
// import {
//   MessageSquare,
//   HelpCircle,
//   Eye,
//   Search,
//   ShoppingCart,
//   Users,
//   SlidersHorizontal,
//   ChevronDown,
//   X,
// } from "lucide-react";

// const summaryStats = [
//   { label: "Total Leads", value: 2 },
//   { label: "This Month Leads", value: 2 },
//   { label: "Total Enrollments", value: 1 },
//   { label: "Ongoing Students", value: 1 },
// ];

// const activityIconMap = {
//   cart_added: <ShoppingCart className="w-5 h-5 text-blue-500" />,
//   profile_viewed: <Eye className="w-5 h-5 text-blue-500" />,
//   course_viewed: <Search className="w-5 h-5 text-blue-500" />,
//   enquiry: <HelpCircle className="w-5 h-5 text-emerald-600" />,
// };

// const activityTypeOptions = [
//   { value: "all", label: "All Activities" },
//   { value: "cart_added", label: "Added Course" },
//   { value: "profile_viewed", label: "Viewed Profile" },
//   { value: "course_viewed", label: "Viewed Course" },
//   { value: "enquiry", label: "Enquired" },
// ];

// const studentStatusOptions = [
//   { value: "all", label: "All Status" },
//   { value: "ongoing", label: "Ongoing" },
//   { value: "completed", label: "Completed" },
// ];

// /* ----------------------------- Filter Bar ----------------------------- */

// const FilterBar = ({ filters, setFilters, onClear }) => {
//   const [open, setOpen] = useState(false);
//   const panelRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const activeCount =
//     (filters.search ? 1 : 0) +
//     (filters.activityType !== "all" ? 1 : 0) +
//     (filters.studentStatus !== "all" ? 1 : 0);

//   return (
//     <div className="relative" ref={panelRef}>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm relative"
//       >
//         <SlidersHorizontal
//           className="w-3.5 h-3.5 text-slate-500"
//           strokeWidth={2}
//         />
//         Filter
//         {activeCount > 0 && (
//           <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-extrabold">
//             {activeCount}
//           </span>
//         )}
//         <ChevronDown
//           className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform ${
//             open ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-4 space-y-4">
//           <div className="flex items-center justify-between">
//             <h4 className="text-xs font-extrabold text-slate-800">Filters</h4>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-slate-400 hover:text-slate-600"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Search
//             </label>
//             <input
//               type="text"
//               value={filters.search}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, search: e.target.value }))
//               }
//               placeholder="Student name or course..."
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
//             />
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Lead Activity
//             </label>
//             <select
//               value={filters.activityType}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, activityType: e.target.value }))
//               }
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
//             >
//               {activityTypeOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Student Status
//             </label>
//             <select
//               value={filters.studentStatus}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, studentStatus: e.target.value }))
//               }
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
//             >
//               {studentStatusOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center justify-between pt-1">
//             <button
//               onClick={() => {
//                 onClear();
//               }}
//               className="text-[11px] font-bold text-slate-500 hover:text-slate-700"
//             >
//               Clear all
//             </button>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-[11px] font-extrabold text-white bg-[#00875a] hover:bg-[#00714c] rounded-lg px-3 py-1.5"
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ----------------------------- Students Table ----------------------------- */

// const MyStudentsTable = ({ filters }) => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/api/enrollments/get-students`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setStudents(Array.isArray(response.data.data) ? response.data.data : []);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const filteredStudents = useMemo(() => {
//     return students.filter((student) => {
//       const name = student.student?.name?.toLowerCase() || "";
//       const email = student.student?.email?.toLowerCase() || "";
//       const course = student.course?.title?.toLowerCase() || "";
//       const search = filters.search.trim().toLowerCase();

//       const matchesSearch =
//         !search ||
//         name.includes(search) ||
//         email.includes(search) ||
//         course.includes(search);

//       const status = (student.status || "ongoing").toLowerCase();
//       const matchesStatus =
//         filters.studentStatus === "all" || status === filters.studentStatus;

//       return matchesSearch && matchesStatus;
//     });
//   }, [students, filters]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
//       <div
//         className={`flex items-center justify-between p-4 border-b bg-purple-50 border-purple-100`}
//       >
//         <div className="flex items-center gap-3.5">
//           <div
//             className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-purple-100 border-purple-100 text-purple-600`}
//           >
//             <Users className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
//               My Students
//             </h3>
//             <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
//               Students who enrolled, completed or are continuing their courses.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <span
//             className={`px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-600 border border-purple-100`}
//           >
//             {filteredStudents.length} Students
//           </span>
//         </div>
//       </div>
//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[960px]">
//           <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
//             <div className="col-span-3">Student</div>
//             <div className="col-span-2 text-center sm:text-left pl-4">
//               Status
//             </div>
//             <div className="col-span-3">Course</div>
//             <div className="col-span-2 text-center">Enrollment Date</div>
//             <div className="col-span-2 text-center pr-2">Actions</div>
//           </div>
//           <div className="divide-y divide-slate-100/60">
//             {filteredStudents.length === 0 && (
//               <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
//                 No students match your filters.
//               </div>
//             )}

//             {filteredStudents.map((student) => (
//               <div
//                 key={student._id}
//                 className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
//                     <div className="w-10 h-10 rounded-full overflow-hidden">
//                       {student.student?.profileImage ? (
//                         <img
//                           src={student.student.profileImage}
//                           alt={student.student?.name || "Student"}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/default-avatar.png";
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
//                           {student.student?.name?.charAt(0)?.toUpperCase() || "?"}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
//                       {student.student.name}
//                     </h4>
//                     <p className="text-[11px] font-semi text-slate-600 mt-0.5">
//                       {student.student.email}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-span-2 flex items-center gap-2 pl-4">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`w-2 h-2 rounded-full ${
//                         (student.status || "ongoing").toLowerCase() ===
//                         "completed"
//                           ? "bg-blue-500"
//                           : "bg-emerald-500"
//                       }`}
//                     />
//                     <span className="text-xs font-bold text-slate-700">
//                       {(student.status || "ongoing").toLowerCase() ===
//                       "completed"
//                         ? "Completed"
//                         : "Enrolled"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
//                   {student.course.title}
//                 </div>

//                 <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
//                   <span className="text-[11px] font-bold text-slate-500">
//                     {student.registrationDate}
//                   </span>
//                 </div>
//                 <div className="col-span-2 flex flex-row items-center justify-center gap-3">
//                   <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
//                     <MessageSquare
//                       className="w-4 h-4 text-[#00875a]"
//                       strokeWidth={2.5}
//                     />
//                   </button>
//                   <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
//                     <Users className="w-4 h-4" strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ----------------------------- Leads Table ----------------------------- */

// const MyLeadsTable = ({ filters }) => {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         const response = await axios.get(`${BASE_API_URL}/api/activities/my`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setLeads(Array.isArray(response.data.data) ? response.data.data : []);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchLeads();
//   }, []);

//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const name = lead.student?.name?.toLowerCase() || "";
//       const city = lead.student?.city?.toLowerCase() || "";
//       const course = lead.entity?.name?.toLowerCase() || "";
//       const search = filters.search.trim().toLowerCase();

//       const matchesSearch =
//         !search ||
//         name.includes(search) ||
//         city.includes(search) ||
//         course.includes(search);

//       const matchesActivity =
//         filters.activityType === "all" ||
//         lead.activityType === filters.activityType;

//       return matchesSearch && matchesActivity;
//     });
//   }, [leads, filters]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
//       <div className="flex items-center justify-between p-4 border-b bg-blue-50 border-blue-100">
//         <div className="flex items-center gap-3.5">
//           <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-blue-100 border-blue-100 text-blue-600">
//             <Eye className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
//               My Leads
//             </h3>
//             <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
//               Students who viewed, added or enquired about your courses.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-600 border border-blue-100">
//             {filteredLeads.length} New
//           </span>
//         </div>
//       </div>

//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[960px]">
//           <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
//             <div className="col-span-3">Student</div>
//             <div className="col-span-2 text-center sm:text-left pl-4">
//               Activity
//             </div>
//             <div className="col-span-3">Course</div>
//             <div className="col-span-2 text-center">Time</div>
//             <div className="col-span-2 text-center pr-2">Actions</div>
//           </div>

//           <div className="divide-y divide-slate-100/60">
//             {filteredLeads.length === 0 && (
//               <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
//                 No leads match your filters.
//               </div>
//             )}

//             {filteredLeads.map((lead) => (
//               <div
//                 key={lead.activityId}
//                 className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
//                     {lead.student?.profileImage ? (
//                       <img
//                         src={lead.student.profileImage}
//                         alt={lead.student?.name || "Student"}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "/default-avatar.png";
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
//                         {lead.student?.name?.charAt(0)?.toUpperCase() || "?"}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
//                       {lead.student?.name}
//                     </h4>
//                     <p className="text-[11px] font-semi text-slate-600 mt-0.5">
//                       {lead.student?.city}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="col-span-2 flex items-center gap-2 pl-4">
//                   {activityIconMap[lead.activityType] || (
//                     <Eye className="w-5 h-5 text-blue-500" />
//                   )}
//                   <span className="text-xs font-bold text-slate-600">
//                     {lead.activity}
//                   </span>
//                 </div>

//                 <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
//                   {lead.entity?.name}
//                 </div>

//                 <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
//                   <span className="text-[11px] font-bold text-slate-500">
//                     {lead.time}
//                   </span>
//                 </div>

//                 <div className="col-span-2 flex flex-row items-center justify-center gap-3">
//                   <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
//                     <MessageSquare
//                       className="w-4 h-4 text-[#00875a]"
//                       strokeWidth={2.5}
//                     />
//                   </button>
//                   <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
//                     <Users className="w-4 h-4" strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ----------------------------- Page ----------------------------- */

// const defaultFilters = {
//   search: "",
//   activityType: "all",
//   studentStatus: "all",
// };

// const LeadsEnquiries = () => {
//   const [filters, setFilters] = useState(defaultFilters);

//   return (
//     <div className="w-full min-h-screen bg-[#f8fafc] px-3 pb-4 sm:px-6 select-none text-left space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full gap-3">
//         <div>
//           <h1 className="ds-page-title">Leads &amp; Enquiries</h1>
//           <p className="ds-page-subtitle">
//             Manage and engage with your potential students.
//           </p>
//         </div>

//         <FilterBar
//           filters={filters}
//           setFilters={setFilters}
//           onClear={() => setFilters(defaultFilters)}
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {summaryStats.map((stat) => (
//           <div
//             key={stat.label}
//             className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
//           >
//             <p className="ds-card-label">{stat.label}</p>
//             <p className="ds-stat-value">{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-5">
//         <MyLeadsTable filters={filters} />
//         <MyStudentsTable filters={filters} />
//       </div>
//     </div>
//   );
// };

// export default LeadsEnquiries;







// import React, { useState, useEffect, useMemo, useRef } from "react";
// import axios from "axios";
// import {
//   MessageSquare,
//   HelpCircle,
//   Eye,
//   Search,
//   ShoppingCart,
//   Users,
//   SlidersHorizontal,
//   ChevronDown,
//   X,
//   CheckCircle2,
//   Star,
// } from "lucide-react";

// const summaryStats = [
//   { label: "Total Leads", value: 2 },
//   { label: "This Month Leads", value: 2 },
//   { label: "Total Enrollments", value: 1 },
//   { label: "Ongoing Students", value: 1 },
// ];

// const activityIconMap = {
//   cart_added: <ShoppingCart className="w-5 h-5 text-blue-500" />,
//   profile_viewed: <Eye className="w-5 h-5 text-blue-500" />,
//   course_viewed: <Search className="w-5 h-5 text-blue-500" />,
//   enquiry: <HelpCircle className="w-5 h-5 text-emerald-600" />,
//   course_enrolled: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
//   institute_review: <Star className="w-5 h-5 text-amber-500" />,
// };

// const activityTypeOptions = [
//   { value: "all", label: "All Activities" },
//   { value: "cart_added", label: "Added To Cart" },
//   { value: "course_enrolled", label: "Enrolled" },
//   { value: "institute_review", label: "Reviewed Institute" },
//   { value: "profile_viewed", label: "Viewed Profile" },
//   { value: "course_viewed", label: "Viewed Course" },
//   { value: "enquiry", label: "Enquired" },
// ];

// const studentStatusOptions = [
//   { value: "all", label: "All Status" },
//   { value: "ongoing", label: "Ongoing" },
//   { value: "completed", label: "Completed" },
// ];

// /* ----------------------------- Filter Bar ----------------------------- */

// const FilterBar = ({ filters, setFilters, onClear }) => {
//   const [open, setOpen] = useState(false);
//   const panelRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const activeCount =
//     (filters.search ? 1 : 0) +
//     (filters.activityType !== "all" ? 1 : 0) +
//     (filters.studentStatus !== "all" ? 1 : 0);

//   return (
//     <div className="relative" ref={panelRef}>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm relative"
//       >
//         <SlidersHorizontal
//           className="w-3.5 h-3.5 text-slate-500"
//           strokeWidth={2}
//         />
//         Filter
//         {activeCount > 0 && (
//           <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-extrabold">
//             {activeCount}
//           </span>
//         )}
//         <ChevronDown
//           className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform ${
//             open ? "rotate-180" : ""
//           }`}
//         />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-4 space-y-4">
//           <div className="flex items-center justify-between">
//             <h4 className="text-xs font-extrabold text-slate-800">Filters</h4>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-slate-400 hover:text-slate-600"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Search
//             </label>
//             <input
//               type="text"
//               value={filters.search}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, search: e.target.value }))
//               }
//               placeholder="Student name or course..."
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
//             />
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Lead Activity
//             </label>
//             <select
//               value={filters.activityType}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, activityType: e.target.value }))
//               }
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
//             >
//               {activityTypeOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-600 block mb-1">
//               Student Status
//             </label>
//             <select
//               value={filters.studentStatus}
//               onChange={(e) =>
//                 setFilters((f) => ({ ...f, studentStatus: e.target.value }))
//               }
//               className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
//             >
//               {studentStatusOptions.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center justify-between pt-1">
//             <button
//               onClick={() => {
//                 onClear();
//               }}
//               className="text-[11px] font-bold text-slate-500 hover:text-slate-700"
//             >
//               Clear all
//             </button>
//             <button
//               onClick={() => setOpen(false)}
//               className="text-[11px] font-extrabold text-white bg-[#00875a] hover:bg-[#00714c] rounded-lg px-3 py-1.5"
//             >
//               Apply
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ----------------------------- Students Table ----------------------------- */

// const MyStudentsTable = ({ filters }) => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/api/enrollments/get-students`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setStudents(Array.isArray(response.data.data) ? response.data.data : []);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const filteredStudents = useMemo(() => {
//     return students.filter((student) => {
//       const name = student.student?.name?.toLowerCase() || "";
//       const email = student.student?.email?.toLowerCase() || "";
//       const course = student.course?.title?.toLowerCase() || "";
//       const search = filters.search.trim().toLowerCase();

//       const matchesSearch =
//         !search ||
//         name.includes(search) ||
//         email.includes(search) ||
//         course.includes(search);

//       const status = (student.status || "ongoing").toLowerCase();
//       const matchesStatus =
//         filters.studentStatus === "all" || status === filters.studentStatus;

//       return matchesSearch && matchesStatus;
//     });
//   }, [students, filters]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
//       <div
//         className={`flex items-center justify-between p-4 border-b bg-purple-50 border-purple-100`}
//       >
//         <div className="flex items-center gap-3.5">
//           <div
//             className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-purple-100 border-purple-100 text-purple-600`}
//           >
//             <Users className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
//               My Students
//             </h3>
//             <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
//               Students who enrolled, completed or are continuing their courses.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <span
//             className={`px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-600 border border-purple-100`}
//           >
//             {filteredStudents.length} Students
//           </span>
//         </div>
//       </div>
//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[960px]">
//           <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
//             <div className="col-span-3">Student</div>
//             <div className="col-span-2 text-center sm:text-left pl-4">
//               Status
//             </div>
//             <div className="col-span-3">Course</div>
//             <div className="col-span-2 text-center">Enrollment Date</div>
//             <div className="col-span-2 text-center pr-2">Actions</div>
//           </div>
//           <div className="divide-y divide-slate-100/60">
//             {filteredStudents.length === 0 && (
//               <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
//                 No students match your filters.
//               </div>
//             )}

//             {filteredStudents.map((student) => (
//               <div
//                 key={student._id}
//                 className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
//                     <div className="w-10 h-10 rounded-full overflow-hidden">
//                       {student.student?.profileImage ? (
//                         <img
//                           src={student.student.profileImage}
//                           alt={student.student?.name || "Student"}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/default-avatar.png";
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
//                           {student.student?.name?.charAt(0)?.toUpperCase() || "?"}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
//                       {student.student.name}
//                     </h4>
//                     <p className="text-[11px] font-semi text-slate-600 mt-0.5">
//                       {student.student.email}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-span-2 flex items-center gap-2 pl-4">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`w-2 h-2 rounded-full ${
//                         (student.status || "ongoing").toLowerCase() ===
//                         "completed"
//                           ? "bg-blue-500"
//                           : "bg-emerald-500"
//                       }`}
//                     />
//                     <span className="text-xs font-bold text-slate-700">
//                       {(student.status || "ongoing").toLowerCase() ===
//                       "completed"
//                         ? "Completed"
//                         : "Enrolled"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
//                   {student.course.title}
//                 </div>

//                 <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
//                   <span className="text-[11px] font-bold text-slate-500">
//                     {student.registrationDate}
//                   </span>
//                 </div>
//                 <div className="col-span-2 flex flex-row items-center justify-center gap-3">
//                   <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
//                     <MessageSquare
//                       className="w-4 h-4 text-[#00875a]"
//                       strokeWidth={2.5}
//                     />
//                   </button>
//                   <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
//                     <Users className="w-4 h-4" strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ----------------------------- Leads Table ----------------------------- */

// const MyLeadsTable = ({ filters }) => {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

//   useEffect(() => {
//     const fetchLeads = async () => {
//       try {
//         const response = await axios.get(`${BASE_API_URL}/api/activities/my`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         setLeads(Array.isArray(response.data.data) ? response.data.data : []);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchLeads();
//   }, []);

//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const name = lead.student?.name?.toLowerCase() || "";
//       const city = lead.student?.city?.toLowerCase() || "";
//       const course = lead.entity?.name?.toLowerCase() || "";
//       const search = filters.search.trim().toLowerCase();

//       const matchesSearch =
//         !search ||
//         name.includes(search) ||
//         city.includes(search) ||
//         course.includes(search);

//       const matchesActivity =
//         filters.activityType === "all" ||
//         lead.activityType === filters.activityType;

//       return matchesSearch && matchesActivity;
//     });
//   }, [leads, filters]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
//       <div className="flex items-center justify-between p-4 border-b bg-blue-50 border-blue-100">
//         <div className="flex items-center gap-3.5">
//           <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-blue-100 border-blue-100 text-blue-600">
//             <Eye className="w-5 h-5" />
//           </div>
//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
//               My Leads
//             </h3>
//             <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
//               Students who viewed, added or enquired about your courses.
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-600 border border-blue-100">
//             {filteredLeads.length} New
//           </span>
//         </div>
//       </div>

//       <div className="w-full overflow-x-auto">
//         <div className="min-w-[960px]">
//           <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
//             <div className="col-span-3">Student</div>
//             <div className="col-span-2 text-center sm:text-left pl-4">
//               Activity
//             </div>
//             <div className="col-span-3">Course</div>
//             <div className="col-span-2 text-center">Time</div>
//             <div className="col-span-2 text-center pr-2">Actions</div>
//           </div>

//           <div className="divide-y divide-slate-100/60">
//             {filteredLeads.length === 0 && (
//               <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
//                 No leads match your filters.
//               </div>
//             )}

//             {filteredLeads.map((lead) => (
//               <div
//                 key={lead.activityId}
//                 className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
//               >
//                 <div className="col-span-3 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
//                     {lead.student?.profileImage ? (
//                       <img
//                         src={lead.student.profileImage}
//                         alt={lead.student?.name || "Student"}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "/default-avatar.png";
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
//                         {lead.student?.name?.charAt(0)?.toUpperCase() || "?"}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
//                       {lead.student?.name}
//                     </h4>
//                     <p className="text-[11px] font-semi text-slate-600 mt-0.5">
//                       {lead.student?.city}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="col-span-2 flex items-center gap-2 pl-4">
//                   {activityIconMap[lead.activityType] || (
//                     <Eye className="w-5 h-5 text-blue-500" />
//                   )}
//                   <span className="text-xs font-bold text-slate-600">
//                     {lead.activity}
//                   </span>
//                 </div>

//                 <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
//                   {lead.entity?.name}
//                 </div>

//                 <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
//                   <span className="text-[11px] font-bold text-slate-500">
//                     {lead.time}
//                   </span>
//                 </div>

//                 <div className="col-span-2 flex flex-row items-center justify-center gap-3">
//                   <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
//                     <MessageSquare
//                       className="w-4 h-4 text-[#00875a]"
//                       strokeWidth={2.5}
//                     />
//                   </button>
//                   <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
//                     <Users className="w-4 h-4" strokeWidth={2.5} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ----------------------------- Page ----------------------------- */

// const defaultFilters = {
//   search: "",
//   activityType: "all",
//   studentStatus: "all",
// };

// const LeadsEnquiries = () => {
//   const [filters, setFilters] = useState(defaultFilters);

//   return (
//     <div className="w-full min-h-screen bg-[#f8fafc] px-3 pb-4 sm:px-6 select-none text-left space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full gap-3">
//         <div>
//           <h1 className="ds-page-title">Leads &amp; Enquiries</h1>
//           <p className="ds-page-subtitle">
//             Manage and engage with your potential students.
//           </p>
//         </div>

//         <FilterBar
//           filters={filters}
//           setFilters={setFilters}
//           onClear={() => setFilters(defaultFilters)}
//         />
//       </div>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {summaryStats.map((stat) => (
//           <div
//             key={stat.label}
//             className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
//           >
//             <p className="ds-card-label">{stat.label}</p>
//             <p className="ds-stat-value">{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-5">
//         <MyLeadsTable filters={filters} />
//         <MyStudentsTable filters={filters} />
//       </div>
//     </div>
//   );
// };

// export default LeadsEnquiries;









import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import {
  MessageSquare,
  HelpCircle,
  Eye,
  Search,
  ShoppingCart,
  Users,
  SlidersHorizontal,
  ChevronDown,
  X,
  CheckCircle2,
  Star,
} from "lucide-react";

const summaryStats = [
  { label: "Total Leads", value: 2 },
  { label: "This Month Leads", value: 2 },
  { label: "Total Enrollments", value: 1 },
  { label: "Ongoing Students", value: 1 },
];

const activityIconMap = {
  cart_added: <ShoppingCart className="w-5 h-5 text-blue-500" />,
  profile_viewed: <Eye className="w-5 h-5 text-blue-500" />,
  course_viewed: <Search className="w-5 h-5 text-blue-500" />,
  enquiry: <HelpCircle className="w-5 h-5 text-emerald-600" />,
  course_enrolled: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
  institute_review: <Star className="w-5 h-5 text-amber-500" />,
};

const activityTypeOptions = [
  { value: "all", label: "All Activities" },
  { value: "cart_added", label: "Added To Cart" },
  { value: "course_enrolled", label: "Enrolled" },
  { value: "institute_review", label: "Reviewed Institute" },
  { value: "profile_viewed", label: "Viewed Profile" },
  { value: "course_viewed", label: "Viewed Course" },
  { value: "enquiry", label: "Enquired" },
];

const studentStatusOptions = [
  { value: "all", label: "All Status" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

/* ----------------------------- Skeleton Loader ----------------------------- */

const TableSkeleton = ({ headerBg, iconBg, rows = 4 }) => (
  <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
    <div className={`flex items-center justify-between p-4 border-b ${headerBg}`}>
      <div className="flex items-center gap-3.5">
        <div className={`w-11 h-11 rounded-xl ${iconBg} animate-pulse`} />
        <div className="space-y-2">
          <div className="h-3.5 w-28 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-2.5 w-48 rounded-full bg-slate-200/70 animate-pulse" />
        </div>
      </div>
      <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />
    </div>

    <div className="w-full overflow-x-auto">
      <div className="min-w-[960px]">
        <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 px-5 py-2.5">
          <div className="col-span-3">
            <div className="h-2.5 w-14 rounded-full bg-slate-200 animate-pulse" />
          </div>
          <div className="col-span-2 pl-4">
            <div className="h-2.5 w-14 rounded-full bg-slate-200 animate-pulse" />
          </div>
          <div className="col-span-3">
            <div className="h-2.5 w-14 rounded-full bg-slate-200 animate-pulse" />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="h-2.5 w-14 rounded-full bg-slate-200 animate-pulse" />
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="h-2.5 w-14 rounded-full bg-slate-200 animate-pulse" />
          </div>
        </div>

        <div className="divide-y divide-slate-100/60">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center px-5 py-3"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
                <div className="space-y-2">
                  <div
                    className="h-3 rounded-full bg-slate-200 animate-pulse"
                    style={{ width: `${70 + ((i * 13) % 40)}px` }}
                  />
                  <div
                    className="h-2.5 rounded-full bg-slate-100 animate-pulse"
                    style={{ width: `${90 + ((i * 17) % 50)}px` }}
                  />
                </div>
              </div>
              <div className="col-span-2 pl-4">
                <div className="h-3 w-20 rounded-full bg-slate-200 animate-pulse" />
              </div>
              <div className="col-span-3 pr-2">
                <div
                  className="h-3 rounded-full bg-slate-200 animate-pulse"
                  style={{ width: `${100 + ((i * 21) % 60)}px` }}
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <div className="h-3 w-16 rounded-full bg-slate-200 animate-pulse" />
              </div>
              <div className="col-span-2 flex justify-center gap-3">
                <div className="w-10 h-10 rounded-md bg-slate-100 animate-pulse" />
                <div className="w-10 h-10 rounded-lg bg-slate-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TableError = ({ iconBg, message }) => (
  <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex flex-col items-center justify-center gap-2 py-14 px-6 text-center">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
        <X className="w-5 h-5" />
      </div>
      <p className="text-sm font-bold text-slate-700">Couldn't load data</p>
      <p className="text-xs font-medium text-slate-500 max-w-xs">
        {message || "Something went wrong. Please try refreshing the page."}
      </p>
    </div>
  </div>
);

/* ----------------------------- Filter Bar ----------------------------- */

const FilterBar = ({ filters, setFilters, onClear }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.activityType !== "all" ? 1 : 0) +
    (filters.studentStatus !== "all" ? 1 : 0);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm relative"
      >
        <SlidersHorizontal
          className="w-3.5 h-3.5 text-slate-500"
          strokeWidth={2}
        />
        Filter
        {activeCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-extrabold">
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 ml-0.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[280px] bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-800">Filters</h4>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              placeholder="Student name or course..."
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Lead Activity
            </label>
            <select
              value={filters.activityType}
              onChange={(e) =>
                setFilters((f) => ({ ...f, activityType: e.target.value }))
              }
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
            >
              {activityTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Student Status
            </label>
            <select
              value={filters.studentStatus}
              onChange={(e) =>
                setFilters((f) => ({ ...f, studentStatus: e.target.value }))
              }
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 bg-white"
            >
              {studentStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                onClear();
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-700"
            >
              Clear all
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-[11px] font-extrabold text-white bg-[#00875a] hover:bg-[#00714c] rounded-lg px-3 py-1.5"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------------- Students Table ----------------------------- */

const MyStudentsTable = ({ filters }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/api/enrollments/get-students`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudents(Array.isArray(response.data.data) ? response.data.data : []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student.student?.name?.toLowerCase() || "";
      const email = student.student?.email?.toLowerCase() || "";
      const course = student.course?.title?.toLowerCase() || "";
      const search = filters.search.trim().toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        email.includes(search) ||
        course.includes(search);

      const status = (student.status || "ongoing").toLowerCase();
      const matchesStatus =
        filters.studentStatus === "all" || status === filters.studentStatus;

      return matchesSearch && matchesStatus;
    });
  }, [students, filters]);

  if (loading) {
    return (
      <TableSkeleton
        headerBg="bg-purple-50 border-purple-100"
        iconBg="bg-purple-100"
      />
    );
  }

  if (error) {
    return (
      <TableError
        iconBg="bg-purple-100 text-purple-600"
        message={error.message}
      />
    );
  }

  return (
    <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
      <div
        className={`flex items-center justify-between p-4 border-b bg-purple-50 border-purple-100`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-purple-100 border-purple-100 text-purple-600`}
          >
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
              My Students
            </h3>
            <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
              Students who enrolled, completed or are continuing their courses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-600 border border-purple-100`}
          >
            {filteredStudents.length} Students
          </span>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[960px]">
          <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
            <div className="col-span-3">Student</div>
            <div className="col-span-2 text-center sm:text-left pl-4">
              Status
            </div>
            <div className="col-span-3">Course</div>
            <div className="col-span-2 text-center">Enrollment Date</div>
            <div className="col-span-2 text-center pr-2">Actions</div>
          </div>
          <div className="divide-y divide-slate-100/60">
            {filteredStudents.length === 0 && (
              <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
                No students match your filters.
              </div>
            )}

            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      {student.student?.profileImage ? (
                        <img
                          src={student.student.profileImage}
                          alt={student.student?.name || "Student"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
                          {student.student?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
                      {student.student.name}
                    </h4>
                    <p className="text-[11px] font-semi text-slate-600 mt-0.5">
                      {student.student.email}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2 pl-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        (student.status || "ongoing").toLowerCase() ===
                        "completed"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-700">
                      {(student.status || "ongoing").toLowerCase() ===
                      "completed"
                        ? "Completed"
                        : "Enrolled"}
                    </span>
                  </div>
                </div>

                <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
                  {student.course.title}
                </div>

                <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
                  <span className="text-[11px] font-bold text-slate-500">
                    {student.registrationDate}
                  </span>
                </div>
                <div className="col-span-2 flex flex-row items-center justify-center gap-3">
                  <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
                    <MessageSquare
                      className="w-4 h-4 text-[#00875a]"
                      strokeWidth={2.5}
                    />
                  </button>
                  <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
                    <Users className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Leads Table ----------------------------- */

const MyLeadsTable = ({ filters }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/activities/my`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLeads(Array.isArray(response.data.data) ? response.data.data : []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const name = lead.student?.name?.toLowerCase() || "";
      const city = lead.student?.city?.toLowerCase() || "";
      const course = lead.entity?.name?.toLowerCase() || "";
      const search = filters.search.trim().toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        city.includes(search) ||
        course.includes(search);

      const matchesActivity =
        filters.activityType === "all" ||
        lead.activityType === filters.activityType;

      return matchesSearch && matchesActivity;
    });
  }, [leads, filters]);

  if (loading) {
    return (
      <TableSkeleton
        headerBg="bg-blue-50 border-blue-100"
        iconBg="bg-blue-100"
        rows={5}
      />
    );
  }

  if (error) {
    return (
      <TableError
        iconBg="bg-blue-100 text-blue-600"
        message={error.message}
      />
    );
  }

  return (
    <div className="bg-white rounded-[16px] border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-blue-50 border-blue-100">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-blue-100 border-blue-100 text-blue-600">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-tight">
              My Leads
            </h3>
            <p className="text-[11.5px] font-medium text-slate-600 mt-0.5">
              Students who viewed, added or enquired about your courses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-600 border border-blue-100">
            {filteredLeads.length} New
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[960px]">
          <div className="grid grid-cols-12 bg-slate-50/40 border-b border-slate-100 text-[11px] font-bold text-slate-700 px-5 py-2.5 ">
            <div className="col-span-3">Student</div>
            <div className="col-span-2 text-center sm:text-left pl-4">
              Activity
            </div>
            <div className="col-span-3">Course</div>
            <div className="col-span-2 text-center">Time</div>
            <div className="col-span-2 text-center pr-2">Actions</div>
          </div>

          <div className="divide-y divide-slate-100/60">
            {filteredLeads.length === 0 && (
              <div className="px-5 py-6 text-center text-xs font-semibold text-slate-500">
                No leads match your filters.
              </div>
            )}

            {filteredLeads.map((lead) => (
              <div
                key={lead.activityId}
                className="grid grid-cols-12 items-center px-5 py-2 hover:bg-slate-50/30 transition-colors"
              >
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    {lead.student?.profileImage ? (
                      <img
                        src={lead.student.profileImage}
                        alt={lead.student?.name || "Student"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-sm">
                        {lead.student?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 leading-snug">
                      {lead.student?.name}
                    </h4>
                    <p className="text-[11px] font-semi text-slate-600 mt-0.5">
                      {lead.student?.city}
                    </p>
                  </div>
                </div>

                <div className="col-span-2 flex items-center gap-2 pl-4">
                  {activityIconMap[lead.activityType] || (
                    <Eye className="w-5 h-5 text-blue-500" />
                  )}
                  <span className="text-xs font-bold text-slate-600">
                    {lead.activity}
                  </span>
                </div>

                <div className="col-span-3 text-xs font-bold text-slate-700 pr-2">
                  {lead.entity?.name}
                </div>

                <div className="col-span-2 text-center flex flex-col justify-center items-center px-2">
                  <span className="text-[11px] font-bold text-slate-500">
                    {lead.time}
                  </span>
                </div>

                <div className="col-span-2 flex flex-row items-center justify-center gap-3">
                  <button className="w-10 h-10 rounded-md border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-[#00875a] hover:border-[#b2ddce] hover:bg-[#eefbf7] transition-all">
                    <MessageSquare
                      className="w-4 h-4 text-[#00875a]"
                      strokeWidth={2.5}
                    />
                  </button>
                  <button className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
                    <Users className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Page ----------------------------- */

const defaultFilters = {
  search: "",
  activityType: "all",
  studentStatus: "all",
};

const LeadsEnquiries = () => {
  const [filters, setFilters] = useState(defaultFilters);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] px-3 pb-4 sm:px-6 select-none text-left space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full gap-3">
        <div>
          <h1 className="ds-page-title">Leads &amp; Enquiries</h1>
          <p className="ds-page-subtitle">
            Manage and engage with your potential students.
          </p>
        </div>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onClear={() => setFilters(defaultFilters)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <p className="ds-card-label">{stat.label}</p>
            <p className="ds-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-5">
        <MyLeadsTable filters={filters} />
        <MyStudentsTable filters={filters} />
      </div>
    </div>
  );
};

export default LeadsEnquiries;