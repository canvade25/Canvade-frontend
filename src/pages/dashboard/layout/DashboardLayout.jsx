import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getStuId } from "../../../../api/userApi";
import {
  Menu,
  Video,
  VideoIcon,
  UsersIcon,
  Users,
  FileText,
  Calendar,
  ArrowRight,
  CreditCard,
  Bookmark,
  Award,
  TrendingUp,
  Fingerprint,
} from "lucide-react";

const IMG_DATA_SCIENCE = "https://i.ibb.co/your-link/data-science.png";
const IMG_UIUX_BASICS = "https://i.ibb.co/your-link/uiux-basics.png";
const IMG_DIGITAL_MKT = "https://i.ibb.co/your-link/digital-mkt.png";
const IMG_BIZ_ANALYTICS = "https://i.ibb.co/your-link/biz-analytics.png";
const IMG_FULLSTACK = "https://i.ibb.co/your-link/fullstack.png";
const IMG_DATA_EXCEL = "https://i.ibb.co/your-link/data-excel.png";
const IMG_UIUX_ADV = "https://i.ibb.co/your-link/uiux-adv.png";
const IMG_DIGITAL_STRAT = "https://i.ibb.co/your-link/digital-strat.png";
const IMG_SHORT_TERM = "student6.png";
const IMG_WORKSHOPS = "student7.png";

export const Topbar = () => {
  const [name, setName] = useState("Ananya");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (data?.success) {
          setName(data.data.displayName || "Ananya");
        }
      } catch (error) {
        console.error("Fetch user error:", error);
      }
    };

    fetchUser();
  }, [API_BASE_URL]);

  return (
    <header className="pb-4 flex flex-col gap-1">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        Good morning, {name}! <span className="animate-bounce">👋</span>
      </h1>
      <p className="text-sm text-[#2e5c42] font-medium mt-2">
        Let's continue your learning journey today.
      </p>
    </header>
  )
};

export const ContinueLearning = () => {
  const others = [
    {
      title: "UI/UX Design Basics",
      progress: 20,
      img: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Digital Marketing Mastery",
      progress: 40,
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80",
    },
    {
      title: "Business Analytics",
      progress: 10,
      img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
        <button className="text-sm font-bold text-[#10b981] hover:underline">
          View All (3)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex items-center gap-6 py-4">
          <div className="w-36 h-52 rounded-3xl overflow-hidden shrink-0 flex items-center justify-center p-2 group relative">
            <img
              src={IMG_DATA_SCIENCE}
              alt="Data Science"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <div className="flex-1 space-y-8">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Data Science Fundamentals
              </h3>
              <p className="text-sm text-[#2e5c42] font-medium mt-4">
                By ExcelR • Intermediate
              </p>
            </div>

            <div className="space-y-4 max-w-[280px]">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#10b981] h-full rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
              <p className="text-sm font-medium text-gray-600">65% Complete</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 w-full lg:border-l lg:border-slate-200 lg:pl-6">
          <p className="text-sm font-semibold text-gray-700">Other Courses</p>

          <div className="grid grid-cols-3 gap-2 w-full">
            {others.map((c, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center gap-2 h-full
                 ${index !== others.length - 1 ? "border-r border-slate-200 pr-2 sm:pr-4" : ""}`}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4 w-full px-2">
                  <h4 className="text-xs font-medium text-gray-800">
                    {c.title}
                  </h4>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden max-w-[110px] mx-auto">
                    <div
                      className="bg-[#10b981] h-full rounded-full"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    {c.progress}% Complete
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const DashboardCard = () => {
  const sessions = [
    {
      id: 1,
      type: "LIVE",
      title: "Python for Data Analysis",
      instructor: "Rajesh Kumar",
      date: "20 May 2024",
      time: "04:00 PM",
      icon: VideoIcon,
      iconBg: "bg-emerald-50 text-emerald-600",
      tagClass: "bg-[#10b981] text-white",
      btnText: "Join",
      btnStyle:
        "border-2 border-[#10b981] text-[#10b981] hover:bg-emerald-50 bg-white",
    }
  ];
  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Upcoming Sessions
        </h2>
        <button className="text-sm font-bold text-[#10b981] hover:underline">
          View Calendar
        </button>
      </div>

      <div className="divide-y divide-slate-100/80">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="py-5 first:pt-2 last:pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex gap-4 items-start sm:items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${session.iconBg}`}
              >
                <session.icon className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <div>
                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${session.tagClass}`}
                  >
                    {session.type}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {session.title}
                </h3>

                <p className="text-sm text-[#2e5c42] font-medium">
                  By {session.instructor}
                </p>

                <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold pt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{session.date}</span>
                  <span className="text-slate-300">•</span>
                  <span>{session.time}</span>
                </div>
              </div>
            </div>

            <button
              className={`px-10 py-3 rounded-lg text-sm font-medium transition-colors shrink-0 w-full sm:w-[150px] text-center border whitespace-nowrap ${session.btnStyle}`}
            >
              {session.btnText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export const RecommendedCourses = () => {
  const courses = [
    {
      title: "Full Stack Web Development",
      by: "Newton School",
      badge: "Bestseller",
      rating: "4.6",
      reviews: "1.2k",
      price: "12,999",
      original: "18,999",
      img: "https://images.unsplash.com/.../or-your-asset-path.jpg",
    },
    {
      title: "Data Analytics with Excel",
      by: "Skill Academy",
      badge: null,
      rating: "4.5",
      reviews: "856",
      price: "3,499",
      original: "5,999",
      img: "https://images.unsplash.com/.../excel-asset.jpg",
    },
  ];

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Recommended for You
        </h2>
        <button className="text-sm font-bold text-[#10b981] hover:underline">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {courses.map((c) => (
          <div
            key={c.title}
            className="border border-slate-100 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-200 flex flex-col justify-between cursor-pointer"
          >
            <div className="h-36 w-full overflow-hidden bg-slate-50 flex items-center justify-center">
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5">
                {c.badge ? (
                  <span className="text-xs font-bold text-[#10b981] block min-h-[16px]">
                    {c.badge}
                  </span>
                ) : (
                  <div className="text-xs min-h-[16px] block" />
                )}

                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 min-h-[38px]">
                  {c.title}
                </h3>

                <p className="text-xs text-gray-500 font-medium">By {c.by}</p>

                <div className="flex items-center gap-1 text-xs font-semibold">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-gray-700">{c.rating}</span>
                  <span className="text-gray-500 font-normal">
                    ({c.reviews})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-50/60">
                <span className="text-sm font-extrabold text-gray-900">
                  ₹{c.price}
                </span>
                <span className="text-xs text-gray-600 line-through font-medium">
                  ₹{c.original}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const DashboardSummaryGrid = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders/get-pending`, {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (data?.success) {
          setPendingPayments(data.data || []);
        }
      } catch (error) {
        console.error("Fetch pending payments error:", error);
      }
    };

    fetchPendingPayments();
  }, []);
  const hasPending = pendingPayments && pendingPayments.length > 0;
  const firstPayment = hasPending ? pendingPayments[0] : null;
console.log("firstPayment", firstPayment);

  const handlePayNow = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: firstPayment.amount,
      currency: firstPayment.currency,
      order_id: firstPayment.orderId,

      handler: async (response) => {
        try {
          const token = localStorage.getItem("token");

          const res = await fetch(`${API_BASE_URL}/api/orders/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: firstPayment.courseId,
            }),
          });

          const data = await res.json();

          if (data.success) {
            alert("Payment Successful!");
            // Refresh pending payments or redirect to My Courses
          } else {
            alert(data.message);
          }
        } catch (err) {
          console.error(err);
          alert("Payment verification failed.");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
      <div className="bg-white p-5 border border-slate-100 rounded-2xl flex flex-col justify-between min-h-[170px] shadow-sm">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-sm font-bold text-slate-900">Pending Payments</h3>
          <button className="text-xs font-bold text-[#10b981] hover:underline">
            View All
          </button>
        </div>

        {!hasPending ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 py-4">
            <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-[13px] text-slate-400 font-semibold">
              No pending transaction
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-3 items-center my-auto pt-4">
              <div className="w-14 h-14 bg-indigo-50/70 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                  {firstPayment?.courseName || firstPayment?.title || "Untitled Course"}
                </h4>

                <p className="text-[11px] text-slate-400 font-semibold">
                  by {firstPayment?.createdBy || firstPayment?.provider || ""}
                </p>

                <p className="text-[11px] text-slate-400 font-medium">
                  {firstPayment?.dueDate
                    ? `Due on ${new Date(firstPayment.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-semibold text-red-500">
                ₹{firstPayment?.amount ?? 0}
              </span>
              <button onClick={handlePayNow} className="px-4 py-1.5 border-2 border-[#10b981] text-[#10b981] text-xs font-semibold rounded-lg hover:bg-emerald-50 transition-colors bg-white">
                Pay Now
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-5 border border-slate-100 rounded-2xl flex flex-col justify-between min-h-[170px] shadow-sm">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-sm font-bold text-slate-900">Saved Courses</h3>
          <button className="text-xs font-bold text-[#10b981] hover:underline">
            View All
          </button>
        </div>

        <div className="flex justify-between items-center w-full mt-auto pb-1">
          <div className="space-y-1">
            <div className="text-4xl font-bold text-slate-900 leading-none">
              6
            </div>
            <p className="text-xs text-slate-400 font-bold">Courses saved</p>
          </div>

          <div className="w-14 h-14 bg-[#e6f4ea] text-[#10b981] rounded-full flex items-center justify-center shrink-0">
            <Bookmark className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 border border-slate-100 rounded-2xl flex flex-col justify-between min-h-[170px] shadow-sm">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-sm font-bold text-slate-900">My Certificates</h3>
          <button className="text-xs font-bold text-[#10b981] hover:underline">
            View All
          </button>
        </div>

        <div className="flex justify-between items-center w-full mt-auto pb-1">
          <div className="space-y-1">
            <div className="text-4xl font-bold text-slate-900 leading-none">
              2
            </div>
            <p className="text-xs text-slate-400 font-bold">
              Certificates earned
            </p>
          </div>

          <div className="w-14 h-14 bg-[#e6f4ea] text-[#10b981] rounded-full flex items-center justify-center shrink-0">
            <Award className="w-8 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DiscoverMore = () => (
  <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm w-full">
    <h2 className="text-base font-bold text-slate-900 mb-5 tracking-tight">
      Discover More
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="bg-[#ecf7f2] rounded-2xl p-6 flex justify-between items-center overflow-hidden min-h-[160px]">
        <div className="space-y-3 flex flex-col items-start justify-center">
          <h3 className="text-[15px] font-bold text-[#10b981]">
            Short Term Courses
          </h3>
          <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
            Learn in less time,
            <br />
            achieve more.
          </p>
          <button className="mt-1 px-4 py-2 border border-[#10b981] text-[#10b981] text-xs font-bold rounded-lg bg-white/40 hover:bg-[#10b981]/10 transition-colors">
            Explore Courses
          </button>
        </div>

        <div className="w-40 h-32 shrink-0 flex items-center justify-center">
          <img
            src={IMG_SHORT_TERM}
            alt="Short Term"
            className="w-[180%] h-[180%] max-w-none object-contain mix-blend-multiply translate-y-2"
          />
        </div>
      </div>

      {/* <div className="bg-[#fdf3e7] rounded-2xl p-6 flex justify-between items-center overflow-hidden min-h-[160px]">
        <div className="space-y-3 flex flex-col items-start justify-center">
          <h3 className="text-[15px] font-bold text-[#1e293b]">
            Recommended Workshops
          </h3>
          <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
            Practical learning,
            <br />
            real-world skills.
          </p>
          <button className="mt-1 px-4 py-2 border border-[#f59e0b]/40 text-slate-700 text-xs font-bold rounded-lg bg-white/40 hover:bg-[#f59e0b]/10 transition-colors">
            Explore Workshops
          </button>
        </div>

        <div className="w-40 h-32 shrink-0 flex items-center justify-center">
          <img
            src={IMG_WORKSHOPS}
            alt="Workshops"
            className="w-[180%] h-[180%] max-w-none object-contain mix-blend-multiply translate-y-2"
          />
        </div>
      </div> */}
    </div>
  </section>
);

export const LearningOverview = () => {
  const stats = [
    {
      label: "Active",
      value: "4",
      sub: "Courses ",
      highlight: true,
    },
    {
      label: "Completed",
      value: "6",
      sub: "Courses ",
      highlight: false,
    },
    {
      label: "Applied / Enrolled",
      value: "8",
      sub: "Courses ",
      highlight: false,
    },

  ];

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          My Learning Overview
        </h2>
        <button className="text-xs font-bold text-[#10b981] hover:underline flex items-center gap-1">
          Go to My Learning <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full">
        {stats.map((s, index) => (
          <div
            key={s.label}
            className={`flex-1 w-full flex items-center justify-between
          ${index !== stats.length - 1 ? "border-b sm:border-b-0 sm:border-r border-slate-100 py-3 sm:py-0 sm:pr-6" : "py-3 sm:py-0"} 
          ${index !== 0 ? "sm:pl-8" : ""}`}
          >
            <div
              className={`w-full transition-all duration-200 rounded-2xl p-4
            ${s.highlight
                  ? "bg-[#ecf7f2] hover:bg-[#e1f2e9]"
                  : "bg-transparent hover:bg-slate-50/80 cursor-pointer"
                }`}
            >
              <p
                className={`text-xs font-bold ${s.highlight ? "text-[#10b981]" : "text-slate-500"
                  }`}
              >
                {s.label}
              </p>

              <p
                className={`text-3xl font-bold mt-2 leading-none ${s.highlight ? "text-[#10b981]" : "text-slate-800"
                  }`}
              >
                {s.value}
              </p>

              <p className="text-[11px] text-slate-400 font-bold mt-2">
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-center text-sm font-semibold text-[#2e5c42]">
        You're doing great! Keep it up 🚀
      </div>
    </section>
  );
};

const StudentIdBadge = () => {
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStuId = async () => {
      try {
        const data = await getStuId();
        if (isMounted && data?.success) {
          setStudentId(data.studentId || null);
        }
      } catch (error) {
        console.error("Fetch student ID error:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStuId();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <div className="h-8 w-36 rounded-full bg-slate-100 animate-pulse" aria-hidden="true" />;
  }

  if (!studentId) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-1.5 shadow-sm">
      <Fingerprint className="h-4 w-4 shrink-0 text-[#10b981]" strokeWidth={2.5} />
      <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700/70">
        Student ID
      </span>
      <span className="text-[11px] font-bold text-emerald-700/70">:</span>
      <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700/70">
      </span>
      <span className="text-[13px] font-mono font-bold tracking-tight text-emerald-800">
        {studentId}
      </span>
    </div>
  );
};

const DashboardLayout = ({ sidebar, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarEl = React.cloneElement(sidebar, { closeSidebar: () => setSidebarOpen(false) });

  return (
    <div className="dashboard-root min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />

      <div className="flex flex-1 w-full max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12 gap-6 pt-24 pb-6 items-start">

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed lg:sticky lg:top-24 top-0 left-0 h-full lg:h-[calc(100vh-6rem)] z-40 lg:z-auto pt-20 lg:pt-0 shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
        >
          {sidebarEl}
        </div>

        <main className="flex-1 min-w-0 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm p-4 space-y-6">
          <div className="flex items-center">
            <button
              className="lg:hidden flex items-center gap-2 text-sm font-semibold text-[#2e5c42] hover:text-gray-900 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
              <span>Menu</span>
            </button>

            <div className="ml-auto">
              <StudentIdBadge />
            </div>
          </div>

          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
