import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Clock,
  HelpCircle,
  ArrowUpRight,
  Info,
  BookOpen,
  Download,
  Gift,
  Users,
  Share2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPaymentHistory } from "../../../../../api/orderApi.js";
import { getProfile } from "../../../../../api/userApi.js";

const Payments = () => {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      setIsLoading(true);
      try {
        const response = await getPaymentHistory();
        if (response?.success) {
          setPaymentDetails(response.data || []);
        } else {
          toast.error(response?.message || "Unable to load payment history");
        }
      } catch (error) {
        console.error("Payment history fetch failed:", error);
        toast.error("Unable to load payment history");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReferralCount = async () => {
      try {
        const response = await getProfile();
        if (response?.success) {
          setReferralCount(response.data?.referralCount || 0);
        }
      } catch (error) {
        console.error("Referral count fetch failed:", error);
      }
    };

    fetchPaymentDetails();
    fetchReferralCount();
  }, []);

  // Derive summary totals from the same paymentDetails array returned by getPaymentHistory()
  const { totalPaid, pendingAmount } = useMemo(() => {
    return paymentDetails.reduce(
      (acc, item) => {
        const amount = Number(item.amount) || 0;
        if (item.status === "captured") {
          acc.totalPaid += amount;
        } else if (
          item.status === "created" ||
          item.status === "pending" ||
          item.status === "authorized"
        ) {
          acc.pendingAmount += amount;
        }
        return acc;
      },
      { totalPaid: 0, pendingAmount: 0 }
    );
  }, [paymentDetails]);

  const parseCreatedAt = (createdAt) => {
    if (!createdAt) return null;
    if (createdAt instanceof Date) return createdAt;
    if (typeof createdAt === "number") return new Date(createdAt);
    if (typeof createdAt === "string") {
      const parsed = Date.parse(createdAt);
      return Number.isFinite(parsed) ? new Date(parsed) : null;
    }

    if (typeof createdAt.toDate === "function") return new Date(createdAt.toDate());
    if (typeof createdAt.toMillis === "function") return new Date(createdAt.toMillis());

    const seconds =
      typeof createdAt.seconds === "number"
        ? createdAt.seconds
        : typeof createdAt._seconds === "number"
        ? createdAt._seconds
        : null;

    return seconds !== null ? new Date(seconds * 1000) : null;
  };

  const formatCreatedDate = (createdAt) => {
    const date = parseCreatedAt(createdAt);
    return date
      ? date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";
  };

  const formatCreatedTime = (createdAt) => {
    const date = parseCreatedAt(createdAt);
    return date
      ? date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";
  };

  const formatAmount = (amount) => {
    if (amount == null) return "₹0";
    const parsed = Number(amount);
    return Number.isFinite(parsed) ? `₹${parsed.toLocaleString("en-IN")}` : amount;
  };

  const handleReferNow = () => {
    let studentUid = "";
    try {
      studentUid = JSON.parse(localStorage.getItem("user") || "null")?.uid || "";
    } catch {
      studentUid = "";
    }

    const referralLink = `https://canvade.com/?ref=${studentUid}`;
    const message = `🎓 Your next learning opportunity starts here!
👉 ${referralLink}

Looking for the right course? Canvade helps you discover and compare courses from different educators and institutes—all in one place. Find the course that matches your goals and start learning with confidence.

See you on Canvade! 🚀`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto p-4">
      {/* <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Payments & Earnings
        </h1>
        <p className="text-sm text-[#2e5c42] font-medium mt-3">
          Track your payments, invoices and earnings from referrals.
        </p>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full items-stretch">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm lg:col-span-3 flex flex-col justify-center">
          <span className="text-sm font-bold text-slate-900 block mb-6">
            Payment Summary
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 w-full">
            <div className="flex items-center gap-4 pb-4 sm:pb-0 sm:pr-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold text-slate-950">
                  {isLoading ? "…" : formatAmount(totalPaid)}
                </div>
                <p className="text-xs font-bold text-gray-500">
                  Total Paid
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold text-slate-950">
                  {isLoading ? "…" : formatAmount(pendingAmount)}
                </div>
                <p className="text-xs font-bold text-gray-500 whitespace-nowrap">
                  Pending Payments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-bold text-slate-950">₹0</div>
                <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 whitespace-nowrap">
                  Available Earnings
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-[#f4fbf9] border border-emerald-100/60 rounded-2xl p-6 shadow-sm flex justify-between items-center gap-4 relative overflow-hidden min-h-[160px]">
          <div className="space-y-4 z-10 flex-1">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-gray-900">
                Transaction History
              </h3>
              <p className="text-sm text-[#2e5c42]">
                View all your payment history and invoices.
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 w-[130px] py-2.5 border-2 border-[#10b981] text-[#10b981] text-xs font-bold rounded-lg bg-white hover:bg-emerald-50/50 transition-all shadow-sm active:scale-95">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div> 

           <div className="w-[110px] h-[120px] sm:w-[130px] sm:h-[130px] shrink-0 flex items-end justify-end self-end translate-x-2 translate-y-2">
            <img
              src="/student3.png"
              alt="Payment Card"
              className="w-full h-full object-contain object-bottom"
            />
          </div>
        </div> */}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
      </div>
      <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
        <div className="overflow-x-auto -mx-6 ">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="min-w-full divide-y divide-slate-100 bg-slate-50 rounded-2xl ">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Date</th>
                  {/* <th className="py-3 px-4">Status</th> */}
                  {/* <th className="py-3 px-4 text-right">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <tr className="animate-pulse">
                    <td className="py-4 px-4" colSpan={4}>
                      <div className="h-20 rounded-2xl bg-slate-100" />
                    </td>
                  </tr>
                ) : paymentDetails.length > 0 ? (
                  paymentDetails.map((item) => (
                    <tr
                      key={item.paymentId || item.orderId}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=60"
                            }
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm cursor-pointer hover:opacity-85 transition-all active:scale-95"
                            onClick={() => {
                              if (item.courseId) navigate(`/courseview/${item.courseId}`);
                            }}
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=60";
                            }}
                          />
                          <div>
                            <h4
                              onClick={() => {
                                if (item.courseId) navigate(`/courseview/${item.courseId}`);
                              }}
                              className="text-sm font-medium text-gray-900 group-hover:text-[#10b981] transition-colors leading-snug cursor-pointer hover:underline"
                            >
                              {item.title}
                            </h4>
                            <p className="text-sm text-[#2e5c42] font-medium mt-2">
                              By {item.createdBy || item.provider || "Unknown"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-600 ">
                        {item.orderId}
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-900">
                        {formatAmount(item.amount)}
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                        <div className="flex flex-col gap-1">
                          <span>{formatCreatedDate(item.createdAt)}</span>
                          <span className="text-slate-500">
                            {formatCreatedTime(item.createdAt)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 px-4 text-center text-sm text-slate-500">
                      No payment history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2 flex flex-col items-center gap-4 border-t border-slate-50">
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#10b981] hover:underline  px-4 py-2 transition-all">
            View All Payments <ChevronDown className="w-4 h-4" />
          </button>

          {/* <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Info
            </span>

            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Course Details
            </span>

            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              Invoice
            </span>

            <span className="flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              Download Certificate
            </span>
          </div> */}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Refer & Earn</h2>
          <p className="text-sm text-[#2e5c42] font-medium mt-3">
            Refer your friends or become our sales partner and earn unlimited
            rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-5 w-full items-stretch">
          <div className="bg-[#f7fdfb] border border-emerald-100/60 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm overflow-hidden min-h-[240px]">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-emerald-100 text-[#10b981] shadow-sm shrink-0">
                  <Gift className="w-8 h-8" />
                </div>
                <div className=" space-y-2">
                  <span className="text-xs font-bold text-gray-800 block">
                    Refer a Friend
                  </span>
                  <h3 className="text-[14px] font-semi text-[#10b981] leading-tight">
                    Earn without limit!
                  </h3>
                  <span className="text-xs text-gray-500 font-medium block mt-0.5">
                    (T&C Applied)
                  </span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-[#10b981] text-sm">✓</span> Share
                  courses with your friends
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#10b981] text-sm">✓</span> They enroll
                  and learn
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#10b981] text-sm">✓</span> You earn
                  exciting rewards
                </li>
              </ul>

              <button
                type="button"
                onClick={handleReferNow}
                className="flex items-center justify-center gap-2.5 w-[150px] py-3 bg-[#00aa6c] hover:bg-[#00945e] text-white text-[14px] font-semibold rounded-xl shadow-md shadow-emerald-100/50 transition-all active:scale-95"
              >
                Refer Now
                <Share2 className="w-3.5 h-3.5" />
              </button>

              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Users className="w-3.5 h-3.5 text-[#10b981]" />
                {referralCount > 0
                  ? `You've referred ${referralCount} friend${referralCount === 1 ? "" : "s"} so far`
                  : "No friends referred yet"}
              </p>
            </div>

            <div className="w-full sm:w-[260px] h-[220px] shrink-0 flex items-end justify-center mx-auto sm:mx-0 self-end -translate-y-4 sm:-translate-y-6">
              <img
                src="/student4.png"
                alt="Refer a Friend Illustration"
                className="w-full h-full object-contain object-bottom"
              />
            </div>
          </div>

          {/* <div className="bg-[#fffbf7] border border-orange-100/60 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm overflow-hidden min-h-[240px]">
            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border border-orange-100 text-orange-500 shadow-sm shrink-0">
                  <Users className="w-8 h-8" />
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-gray-500 block uppercase tracking-wide">
                      Become Our
                    </span>

                    <h3 className="text-base font-extrabold text-[#e07a00] leading-tight">
                      Sales Partner
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-[240px]">
                    Get free training, refer educators and earn without limit!
                  </p>

                  <span className="text-xs text-slate-500  font-medium">
                    (T&C Applied)
                  </span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 text-sm">✓</span> Get free
                  product training
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 text-sm">✓</span> Refer
                  educators & institutes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500 text-sm">✓</span> Earn
                  attractive commissions
                </li>
              </ul>

              <button className="flex items-center justify-center gap-2.5 w-[150px] py-3 bg-[#f08804] hover:bg-[#d67800] text-white text-[14px] font-semibold rounded-xl shadow-md shadow-emerald-100/50 transition-all active:scale-95">
                Apply Now 
                <Share2 className="w-3.5 h-3.5" />
              </button>

            </div>

            <div className="w-full sm:w-[260px] h-[220px] shrink-0 flex items-end justify-center mx-auto sm:mx-0 self-end -translate-y-4 sm:-translate-y-6">
              <img
                src="/student5.png"
                alt="Refer a Friend Illustration"
                className="w-full h-full object-contain object-bottom"
              />
            </div>
          </div> */}
        </div>

        <div className="text-center text-sm font-medium text-[#2e5c42] pt-6 flex items-center justify-center gap-1.5">
          Thank you for being a part of{" "}
          <span className="text-slate-600 tracking-tight font-black">
            CANVADE!
          </span>{" "}
          Keep learning and keep earning. 🚀
        </div>
      </section>
    </div>
  );
};

export default Payments;