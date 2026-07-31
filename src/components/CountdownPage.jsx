// import React, { useState, useEffect } from "react";

// const CountdownPage = () => {

//   const targetDate = new Date("July 1, 2026 00:00:00").getTime();
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = targetDate - now;
//       if (distance < 0) {
//         clearInterval(timer);
//       } else {
//         setTimeLeft({
//           days: Math.floor(distance / (1000 * 60 * 60 * 24)),
//           hours: Math.floor(
//             (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
//           ),
//           minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
//           seconds: Math.floor((distance % (1000 * 60)) / 1000),
//         });
//       }
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [targetDate]);

//   const floatingTags = [
//     { text: "Global Discovery", pos: "top-[12%] left-[8%] md:top-[18%] md:left-[12%]" },
//     { text: "+3000 Institutes", pos: "top-[12%] right-[8%] md:top-[18%] md:right-[10%]" },
//     { text: "Find Institutes", pos: "top-[48%] left-[4%] md:left-[6%]" },
//     { text: "+5000 Courses", pos: "top-[48%] right-[4%] md:right-[6%]" },
//     { text: "Hybrid Learning", pos: "bottom-[12%] left-[8%] md:bottom-[18%] md:left-[12%]" },
//     { text: "Compare & Enroll", pos: "bottom-[12%] right-[8%] md:bottom-[18%] md:right-[10%]" },
//   ];

//   return (
//     <div
//       className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center font-sans py-10"
//       style={{
//         backgroundColor: "#D6FFF6",
//         backgroundImage: `
//               radial-gradient(ellipse 80% 60% at top left, #B2FBE0 0%, transparent 70%),
//               radial-gradient(ellipse 80% 60% at top right, #B9FCF3 0%, transparent 70%),
//               radial-gradient(ellipse 80% 50% at bottom left, #F2F5E0 0%, transparent 70%),
//               radial-gradient(ellipse 80% 50% at bottom right, #EEF4F0 0%, transparent 70%)
//             `,
//       }}
//     >
   
//       <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none">
//         <svg width="100%" height="100%">
//           <defs>
//             <pattern
//               id="grid"
//               width="40"
//               height="40"
//               patternUnits="userSpaceOnUse"
//             >
//               <path
//                 d="M 40 0 L 0 0 0 40"
//                 fill="none"
//                 stroke="#1a9a6c"
//                 strokeWidth="0.5"
//               />
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#grid)" />
//         </svg>
//       </div>

//       <div className="absolute top-[20%] left-[20%] w-32 h-32 md:w-64 md:h-64 bg-white/30 rounded-full blur-[60px] md:blur-[100px] animate-pulse"></div>
//       <div className="absolute bottom-[20%] right-[20%] w-32 h-32 md:w-64 md:h-64 bg-yellow-100/20 rounded-full blur-[60px] md:blur-[100px] animate-pulse delay-700"></div>

//       {floatingTags.map((tag, i) => (
//         <div
//           key={i}
//           className={`absolute ${tag.pos} hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 md:px-5 py-1.5 md:py-2 rounded-full border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-700 hover:translate-y-[-5px] z-20`}
//         >
//           <span className="text-[#1a9a6c] text-base md:text-lg">•</span>
//           <span className="text-[10px] md:text-[12px] font-semibold text-[#2a5a42] tracking-tight">
//             {tag.text}
//           </span>
//         </div>
//       ))}

//       <div className="relative z-10 text-center px-6 flex flex-col items-center w-full max-w-5xl mx-auto">

//         <div className="mb-6 md:mb-8 flex flex-col items-center">
//           <img
//             src="/canvade.png"
//             alt="Canvade"
//             className="h-10 md:h-16 w-auto object-contain drop-shadow-sm mb-1"
//           />
//         </div>

//         <div className="bg-white/60 backdrop-blur-sm border border-white/80 text-[#1a6b4a] px-4 md:px-6 py-1 md:py-1.5 rounded-full flex items-center gap-2 mb-6 md:mb-8 shadow-sm">
//           <span className="w-1.5 h-1.5 bg-[#1a9a6c] rounded-full animate-ping"></span>
//           <span className="text-[11px] md:text-[14px] font-bold tracking-tight uppercase">
//             Launching Soon
//           </span>
//         </div>

//         <h1 className="text-[32px] sm:text-[48px] md:text-[72px] font-[600] text-[#1a9a6c] leading-[1.1] mb-6 tracking-tight">
//           DISCOVER COURSES
//           <br />& INSTITUTES{" "}
//           <span className="text-[#facc15] drop-shadow-sm">GLOBALLY</span>
//         </h1>

//        <p className="text-[#2e5c42] text-[12px] md:text-[15px] leading-relaxed max-w-3xl mb-8 md:mb-12 font-medium opacity-90">
//           Explore and compare courses and institutes worldwide in one place.
//           Find options that match your goals, evaluate them clearly, and make
//           confident decisions about your future.
//         </p>

//         <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-10 md:mb-14 tabular-nums w-full">
//           {[
//             { val: timeLeft.days, label: "DAYS", color: "text-[#1a9a6c]" },
//             { val: timeLeft.hours, label: "HOURS", color: "text-[#555555]" },
//             {
//               val: timeLeft.minutes,
//               label: "MINUTES",
//               color: "text-[#555555]",
//             },
//             {
//               val: timeLeft.seconds,
//               label: "SECONDS",
//               color: "text-[#555555]",
//             },
//           ].map((item, idx) => (
//             <React.Fragment key={idx}>
//               <div className="bg-white border border-gray-100 rounded-[12px] p-3 md:p-6 min-w-[75px] sm:min-w-[95px] md:min-w-[120px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex-1 sm:flex-none">
//                 <span
//                   className={`block text-2xl sm:text-3xl md:text-[52px] font-bold leading-none ${item.color}`}
//                 >
//                   {String(item.val).padStart(2, "0")}
//                 </span>
//                 <span className="block text-[8px] md:text-[11px] font-semibold text-[#1a9a6c] mt-2 md:mt-3 tracking-widest uppercase">
//                   {item.label}
//                 </span>
//               </div>
              
//               {idx < 3 && (
//                 <span className="hidden sm:block text-xl md:text-3xl font-bold text-[#1a9a6c] self-center -mt-4">
//                   :
//                 </span>
//               )}
//             </React.Fragment>
//           ))}
//         </div>

//         <div className="w-full max-w-[500px] flex flex-col sm:flex-row items-center bg-white/80 sm:bg-white border border-gray-200 rounded-[12px] sm:rounded-[10px] p-1.5 shadow-sm mt-4 gap-2 sm:gap-0">
//           <input
//             type="text"
//             placeholder="Enter Your email address or Phone no:"
//             className="w-full flex-1 bg-transparent px-4 py-3 sm:py-2.5 outline-none text-[14px] text-gray-700 font-normal placeholder:text-gray-600 text-center sm:text-left"
//           />
//           <button className="w-full sm:w-auto bg-[#1a9a6c] hover:bg-[#155e42] text-white font-medium py-3 sm:py-2.5 px-8 rounded-[9px] sm:rounded-[7px] transition-all active:scale-95 text-[14px] whitespace-nowrap shadow-md sm:shadow-none">
//             Notify Me
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CountdownPage;
