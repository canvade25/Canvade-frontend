import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ShieldCheck,
  Calendar,
  Monitor,
  Star,
  Clock,
  User,
  Mail,
  Phone,
  Trash2,
  RefreshCcw,
  ArrowRight,
  Heart,
  Lock,
  CheckCircle2,
  Headphones,
  MapPin,
  Tag,
  BadgeCheck,
  ChevronDown,
  Check,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Simple reusable skeleton block. Purely cosmetic placeholder, no UI/layout change.
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

const formatTimeStr = (value) => {
  if (!value) return "";
  const [rawHour, minute] = value.split(":").map(Number);
  const suffix = rawHour >= 12 ? "PM" : "AM";
  const hour = rawHour % 12 || 12;
  return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
};

const formatDateStr = (value) => {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const cleanAndFormatName = (name) => {
  if (!name) return "";
  // If name has numbers at the end (like divyanshchoudhary789), strip them
  let clean = name.replace(/\d+$/, "");
  // Split on dots, underscores, or spaces to handle usernames
  const parts = clean.split(/[._\s]+/);
  const formattedParts = parts.map((part) => {
    if (!part) return "";
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });
  return formattedParts.filter(Boolean).join(" ");
};

export default function CheckoutPage() {
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount }
  const [couponError, setCouponError] = useState("");
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Controlled states for Student Details
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  const locationRef = useRef(null);
  const batchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
      if (batchRef.current && !batchRef.current.contains(event.target)) {
        setIsBatchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

  useEffect(() => {
    fetchCourse();
    fetchCourseBatches();
    fetchUserProfile();
  }, [courseId]);

  useEffect(() => {
    if (user) {
      setFullName(cleanAndFormatName(user.displayName || ""));
      setEmailAddress(user.email || "");
      setMobileNumber(user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    if (course?.locations && course.locations.length > 0) {
      const loc = course.locations[0];
      const defaultLoc = [loc.addressLine1, loc.city, loc.state, loc.country]
        .filter(Boolean)
        .join(", ");
      setSelectedLocation(defaultLoc);
    }
  }, [course]);

  const fetchCourseBatches = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/batches`);
      const data = await res.json();
      if (data.success) {
        setBatches(data.batches || []);
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
    }
  };

  const filteredBatches = batches.filter((b) => {
    if (!selectedLocation) return true;
    if (!b.locations || b.locations.length === 0) return true;
    return b.locations.some((locStr) => {
      const cleanLocStr = locStr.toLowerCase().replace(/\s/g, "");
      const cleanSelected = selectedLocation.toLowerCase().replace(/\s/g, "");
      return cleanSelected.includes(cleanLocStr) || cleanLocStr.includes(cleanSelected);
    });
  });

  useEffect(() => {
    if (filteredBatches.length > 0) {
      const exists = filteredBatches.some((b) => b.batchId === selectedBatchId);
      if (!exists) {
        setSelectedBatchId(filteredBatches[0].batchId);
      }
    } else {
      setSelectedBatchId("");
    }
  }, [filteredBatches]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`);
      const data = await res.json();

      if (data.success) {
        setCourse(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Derived pricing values (real data, fallback to 0/-- while loading) ----
  const actualPrice = course?.priceDetails?.actualPrice ?? 0;
  const discountPercent = course?.priceDetails?.discount ?? 0;
  const currentPrice = course?.priceDetails?.currentPrice ?? actualPrice;
  const discountAmount = actualPrice - currentPrice;
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const payableAmount = Math.max(currentPrice - couponDiscount, 0);
  const emiMonths = 12;
  const isEmiAvailable = course?.isEmiAvailable === true;
  const emiPerMonth =
    isEmiAvailable && payableAmount ? Math.ceil(payableAmount / emiMonths) : 0;

  const handleApplyCoupon = () => {
    const trimmed = coupon.trim().toUpperCase();
    if (!trimmed) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const courseCoupon = course?.priceDetails?.couponCode;
    const courseCouponCode = String(courseCoupon?.code || "").trim().toUpperCase();

    if (!courseCouponCode || trimmed !== courseCouponCode) {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code");
      return;
    }

    const amount = Number(courseCoupon.discountAmount || 0);
    setAppliedCoupon({ code: courseCouponCode, discountAmount: amount });
    setCouponError("");
    toast.success(`Coupon applied! You saved ₹ ${amount.toLocaleString("en-IN")}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCoupon("");
    setCouponError("");
  };

  const courseThumbnail =
    course?.uploadMaterials?.thumbnail ||
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400";

  const courseLocation1 =
    course?.locations?.[0]?.city || "Location not specified";
  const courseLocation2 =
    course?.locations?.[0]?.country || "Location not specified";

  const studentName = user?.displayName || "";
  const studentEmail = user?.email || "";
  const studentPhone = user?.phoneNumber || "";

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/orders/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId,
          couponCode: appliedCoupon?.code || undefined,
          location: selectedLocation || undefined,
          batchId: selectedBatchId || undefined,
          studentDetails: {
            fullName,
            emailAddress,
            mobileNumber,
          },
        }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const { orderId, amount, currency, key } = result.data;

      const options = {
        key,
        amount,
        currency,
        order_id: orderId,

        name: "Canvade",

        description: course?.basicDetails?.courseTitle,

        prefill: {
          name: fullName,
          email: emailAddress,
          contact: mobileNumber,
        },

        theme: {
          color: "#008560",
        },

        handler: async function (response) {
          verifyPayment(response);
        },

        modal: {
          ondismiss: function () {
            console.log("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Unable to initiate payment");
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/orders/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
            courseId,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Enrollment Successful");
        navigate("/dashboard/enrollments");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment verification failed");
    }
  };

  return (
    <>
      <div className="checkout-root min-h-screen bg-white">
        <Navbar />

        <main className="max-w-[1700px] mx-auto pt-28 px-3 sm:px-4 md:px-8 lg:px-12">
          <div className="mobile-header-stack flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1
                className="text-3xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Review Your Selection
              </h1>
              <p className="text-gray-500 font-medium">
                You're one step away from securing your seat.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3 mobile-full">
              <div className="bg-white p-2 rounded-lg text-emerald-600 shadow-sm shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-emerald-900">
                  Your data is 100% secure
                </p>
                <p className="text-[11px] text-emerald-700">
                  We use encrypted and secure payment
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow space-y-6 min-w-">
              <div className="bg-white rounded-2xl border border-gray-100 p-10 mobile-section-p shadow-sm">
                <h2 className="text-[18px] font-bold text-gray-800 mb-6">
                  Course in Cart
                </h2>

                <div className="flex flex-col gap-6 mb-8">
                  <div className="mobile-course-row flex flex-col md:flex-row gap-6">
                    <div className="relative mobile-img-full w-full md:w-64 h-44 rounded-2xl overflow-hidden shrink-0">
                      {loading ? (
                        <Skeleton className="w-full h-full rounded-2xl" />
                      ) : (
                        <>
                          <img
                            src={courseThumbnail}
                            alt="Course"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                            Bestseller
                          </span>
                          {/* <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-gray-700 hover:text-red-500 border-0">
                            <Heart size={16} />
                          </button> */}
                        </>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      {loading ? (
                        <Skeleton className="h-6 w-32 mb-3 rounded-md" />
                      ) : (
                        <span className="text-emerald-600 bg-emerald-50 text-[11px] font-bold px-3 py-1 rounded-md mb-3 inline-block">
                          Professional Certificate
                        </span>
                      )}

                      {loading ? (
                        <Skeleton className="h-7 w-3/4 mb-2" />
                      ) : (
                        <h3 className="text-[22px] xs-text-xl font-bold text-gray-900 leading-tight mb-2">
                          {course?.basicDetails?.courseTitle}
                        </h3>
                      )}

                      <div className="flex flex-col gap-y-3.5">
                        <div className="flex items-center gap-2">
                          {loading ? (
                            <Skeleton className="h-4 w-40" />
                          ) : (
                            <>
                              <p className="font-medium text-gray-800 text-[14px] leading-tight">
                                {course?.name}
                              </p>
                              <BadgeCheck
                                size={16}
                                className="text-blue-500 fill-white"
                              />
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          {loading ? (
                            <Skeleton className="h-4 w-48" />
                          ) : (
                            <>
                              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                              <span className="text-[14px] font-medium">
                                {courseLocation1}, {courseLocation2}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mobile-icon-grid grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
                    {[
                      {
                        icon: <Clock size={20} />,
                        label: "Duration",
                        value: course?.basicDetails?.duration,
                      },
                      {
                        icon: <Monitor size={20} />,
                        label: "Mode",
                        value: course?.basicDetails?.learningMode,
                      },
                      // {
                      //   icon: <Calendar size={20} />,
                      //   label: "Batch Starts",
                      //   value: course?.batchPlan?.[0]?.batchStartDate,
                      // },
                      {
                        icon: <Star size={20} />,
                        label: "(1,245 Reviews)",
                        value: "4.6",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="p-3 bg-gray-200 rounded-full text-gray-700 shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          {loading ? (
                            <>
                              <Skeleton className="h-4 w-12 mb-1.5" />
                              <Skeleton className="h-3 w-16" />
                            </>
                          ) : (
                            <>
                              <p className="mobile-icon-val text-[16px] font-bold text-gray-900">
                                {item.value}
                              </p>
                              <p className="mobile-icon-lbl text-[14px] text-gray-400 font-bold">
                                {item.label}
                              </p>
                            </>
                          )}
                        </div>
                        {i < 2 && (
                          <div className="hidden md:block ml-auto h-8 border-r border-gray-100" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="bg-emerald-50/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-emerald-100/60 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg text-emerald-600 shadow-sm shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-[16px] font-bold text-gray-800">
                        High Demand Course
                      </p>
                      {loading ? (
                        <Skeleton className="h-4 w-40 mt-1" />
                      ) : (
                        <p className="text-[14px] text-gray-500">
                          {course?.totalStudents ?? 0}+ students have already
                          enrolled
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[14px] font-bold text-emerald-700 shrink-0">
                    Limited Seats Left!
                  </span>
                </div> */}

                {/*<div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-red-500 font-bold text-sm hover:opacity-80 border-0 bg-transparent">
                    <Trash2 size={16} /> Remove
                  </button>
                  <button className="flex items-center gap-2 text-emerald-700 font-bold text-sm hover:opacity-80 border-0 bg-transparent">
                    <RefreshCcw size={16} /> Change Batch
                  </button>
                </div>*/}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 mobile-section-p shadow-sm">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                  <h2 className="text-[18px] font-bold text-gray-800">
                    Student Details
                  </h2>
                  {!user && (
                    <button
                      onClick={fetchUserProfile}
                      className="text-emerald-700 font-bold text-sm hover:opacity-80 border-0 bg-transparent"
                    >
                      Login to auto-fill your details
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-700 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none text-sm font-medium"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-700 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none text-sm font-medium"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-700 block">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative" ref={locationRef}>
                    <label className="text-[13px] font-bold text-gray-700 block">
                      Location
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-3.5 pl-12 pr-10 outline-none text-sm font-medium text-left flex items-center justify-between shadow-sm hover:bg-gray-100/50 transition-all"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span className="truncate">
                          {selectedLocation || "Select Location"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      </button>
                      <MapPin
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>

                    {isLocationOpen && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto py-1">
                        {course?.locations && course.locations.length > 0 ? (
                          course.locations.map((loc, idx) => {
                            const label = [loc.addressLine1, loc.city, loc.state, loc.country]
                              .filter(Boolean)
                              .join(", ");
                            const isSelected = selectedLocation === label;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setSelectedLocation(label);
                                  setIsLocationOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-emerald-50/50 transition-colors flex items-center justify-between ${
                                  isSelected ? "bg-emerald-50/30 text-emerald-700 font-bold" : "text-gray-700"
                                }`}
                              >
                                <span className="truncate">{label}</span>
                                {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400 text-center">
                            No locations available
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2 relative" ref={batchRef}>
                    <label className="text-[13px] font-bold text-gray-700 block">
                      Select Batch
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (filteredBatches.length > 0) {
                            setIsBatchOpen(!isBatchOpen);
                          }
                        }}
                        disabled={filteredBatches.length === 0}
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-3.5 pl-12 pr-10 outline-none text-sm font-medium text-left flex items-center justify-between shadow-sm hover:bg-gray-100/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span className="truncate">
                          {selectedBatchId ? (() => {
                            const b = filteredBatches.find(x => x.batchId === selectedBatchId);
                            if (!b) return "Select Batch";
                            const daysStr = b.days?.map(d => d.slice(0, 3)).join(", ") || "";
                            const timeStr = `${formatTimeStr(b.startTime)} - ${formatTimeStr(b.endTime)}`;
                            const dateStr = `Starts ${formatDateStr(b.startDate)}`;
                            return `${b.batchName} (${b.batchCode}) — ${dateStr} | ${timeStr} [${daysStr}]`;
                          })() : "No batches available for this location"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      </button>
                      <Calendar
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>

                    {isBatchOpen && filteredBatches.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto py-1">
                        {filteredBatches.map((b) => {
                          const daysStr = b.days?.map(d => d.slice(0, 3)).join(", ") || "";
                          const timeStr = `${formatTimeStr(b.startTime)} - ${formatTimeStr(b.endTime)}`;
                          const dateStr = `Starts ${formatDateStr(b.startDate)}`;
                          const isSelected = selectedBatchId === b.batchId;
                          return (
                            <button
                              key={b.batchId}
                              type="button"
                              onClick={() => {
                                setSelectedBatchId(b.batchId);
                                setIsBatchOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-emerald-50/50 transition-colors flex items-center justify-between border-b last:border-0 border-gray-50/50 ${
                                isSelected ? "bg-emerald-50/30 font-bold" : ""
                              }`}
                            >
                              <div className="flex flex-col gap-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[14px] ${isSelected ? "text-emerald-800" : "text-slate-800 font-bold"}`}>
                                    {b.batchName}
                                  </span>
                                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    {b.batchCode}
                                  </span>
                                </div>
                                <div className="text-[12px] text-gray-500 flex flex-wrap gap-x-2 gap-y-0.5">
                                  <span>{dateStr}</span>
                                  <span className="text-gray-300">•</span>
                                  <span>{timeStr}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-emerald-600 font-medium">{daysStr}</span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100/60 flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600 shrink-0"
                  />
                  <p className="text-[12px] text-emerald-800 font-medium">
                    We will use these details for enrollment and communication.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 mobile-section-p shadow-sm">
                <h2 className="text-[18px] font-bold text-gray-800 mb-6">
                  Why students trust Canvade
                </h2>
                <div className="mobile-trust-grid grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <ShieldCheck size={24} />,
                      title: "Verified Institutes",
                      desc: "All our partners are verified and trusted",
                    },
                    {
                      icon: <Lock size={24} />,
                      title: "Secure Payments",
                      desc: "100% secure payments with multiple options",
                    },
                    {
                      icon: <Headphones size={24} />,
                      title: "24/7 Support",
                      desc: "We're here to help you anytime",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[18px] font-bold text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-[14px] text-gray-500 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mobile-sidebar-full tablet-sidebar-full w-full lg:w-[400px] shrink-0 space-y-6">
              {/* Coupon Code — ab sabse upar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-6">
                  <p className="text-[16px] font-bold text-gray-800 mb-4">
                    Have a coupon code?
                  </p>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-800">
                          {appliedCoupon.code} applied
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-sm font-bold text-emerald-700 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={coupon}
                          onChange={(e) => {
                            setCoupon(e.target.value);
                            setCouponError("");
                          }}
                          className="min-w-0 flex-grow rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm outline-none focus:border-emerald-300"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="shrink-0 rounded-xl border-2 border-emerald-500 bg-white px-6 py-3 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-50"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-2 text-[13px] font-semibold text-red-500">
                          {couponError}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mobile-order-sum tablet-order-sum bg-white rounded-2xl border border-gray-100 p-6 mobile-section-p shadow-sm w-full">
                <h3 className="text-[20px] font-bold text-gray-900 mb-8">
                  Order Summary
                </h3>

                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="min-w-0 flex-1">
                    {loading ? (
                      <>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </>
                    ) : (
                      <>
                        <p className="text-[16px] font-bold text-gray-900 leading-tight">
                          {course?.basicDetails?.courseTitle}
                        </p>
                        <p className="text-[14px] text-slate-500 mt-1">
                          {course?.name}
                        </p>
                      </>
                    )}
                  </div>
                  {loading ? (
                    <Skeleton className="h-5 w-20 shrink-0" />
                  ) : (
                    <span className="text-[16px] font-bold text-gray-900 shrink-0">
                      ₹ {currentPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-50 pt-6 space-y-4 border-b pb-6 mb-6">
                  {[
                    {
                      label: "Original Price",
                      value: `₹ ${actualPrice.toLocaleString("en-IN")}`,
                      color: "text-gray-900",
                    },
                    {
                      label: "Discount",
                      value: `- ₹ ${discountAmount.toLocaleString("en-IN")}`,
                      color: "text-emerald-600",
                    },
                    {
                      label: "Course Price",
                      value: `₹ ${currentPrice.toLocaleString("en-IN")}`,
                      color: "text-gray-900",
                    },
                    ...(appliedCoupon
                      ? [
                          {
                            label: `Coupon Discount (${appliedCoupon.code})`,
                            value: `- ₹ ${couponDiscount.toLocaleString("en-IN")}`,
                            color: "text-emerald-600",
                          },
                        ]
                      : []),
                    //{ label: "Platform Fee",                  value: "₹ 499",     color: "text-gray-900"    },
                    //{ label: "GST (18%)",                     value: "₹ 8,099",   color: "text-gray-900"    },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between text-[15px]">
                      <span
                        className={
                          i === 1 || row.color === "text-emerald-600"
                            ? "text-emerald-600 font-medium"
                            : "text-gray-600 font-medium"
                        }
                      >
                        {row.label}
                      </span>
                      {loading ? (
                        <Skeleton className="h-4 w-16" />
                      ) : (
                        <span className={`${row.color} font-bold`}>
                          {row.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-1">
                  <span className="text-[18px] font-bold text-gray-900">
                    Total
                  </span>
                  {loading ? (
                    <Skeleton className="h-7 w-24" />
                  ) : (
                    <span className="mobile-total-amt text-[24px] font-black text-gray-900">
                      ₹ {payableAmount.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-slate-400 mb-8">
                  Inclusive of all taxes
                </p>

                <div className="mobile-saving-wrap bg-emerald-50/50 border border-emerald-100/50 p-3 rounded-xl flex items-center justify-center gap-2 mb-6">
                  <div className="bg-emerald-500 text-white rounded-md p-1 shrink-0">
                    <Tag size={14} fill="currentColor" />
                  </div>
                  {loading ? (
                    <Skeleton className="h-4 w-40" />
                  ) : (
                    <p className="mobile-saving-text text-[14px] font-bold text-emerald-800">
                      You Save ₹ {(discountAmount + couponDiscount).toLocaleString("en-IN")}{" "}
                      <span className="font-medium text-emerald-700">
                        on this order
                      </span>
                    </p>
                  )}
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="mobile-enroll-btn w-full bg-[#008560] hover:bg-[#006e52] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Proceed to Enroll
                  <ArrowRight size={20} />
                </button>

                {isEmiAvailable && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 mobile-section-p shadow-sm flex items-center justify-between gap-4">
                    <ShieldCheck size={18} className="text-emerald-600" />
                    <span className="text-[13px] font-semibold">
                      EMI available on eligible payments
                    </span>
                  </div>
                )}
              </div>

              {isEmiAvailable && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mobile-section-p shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[14px] font-bold text-gray-800">
                      EMI Options Available
                    </p>
                    <p className="text-[12px] text-gray-400 mb-2">
                      No cost EMI starting from
                    </p>
                    <p className="text-[22px] font-bold text-gray-900">
                      ₹ {emiPerMonth.toLocaleString("en-IN")}{" "}
                      <span className="text-sm font-medium text-gray-400">
                        /month
                      </span>
                    </p>
                    <button className="text-emerald-700 font-bold text-[13px] mt-2 flex items-center gap-1 border-0 bg-transparent">
                      View Plans <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="mobile-emi-icon w-16 h-16 shrink-0 opacity-20 flex items-center justify-center">
                    <Calendar size={48} className="text-gray-400" />
                  </div>
                </div>
              )}

              {/* We Accept — apni jagah, ab akela card */}
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
    <div className="p-6">
      <p className="text-[12px] font-bold text-gray-400 uppercase mb-4 tracking-widest">
        We Accept
      </p>
      <div className="grid grid-cols-5 gap-2">
        {[
          { src: "/UPI.png", alt: "UPI" },
          { src: "/rupay.png", alt: "RuPay" },
          { src: "/visa.png", alt: "Visa" },
          { src: "/mastercard.png", alt: "Mastercard" },
        ].map(({ src, alt }) => (
          <div
            key={alt}
            className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <img
              src={src}
              className="max-h-5 max-w-[44px] object-contain"
              alt={alt}
            />
          </div>
        ))}
        <div className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <span className="text-[10px] font-bold text-slate-700">
            Razorpay
          </span>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>


          <div className="mobile-not-ready mt-12 bg-emerald-50/40 border border-emerald-100/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              {/*
              <h4 className="text-[18px] font-bold text-gray-800">
                Not ready to enroll yet?
              </h4>
              <p className="text-gray-500 text-sm mt-1">
                Save this course for later and continue learning.
              </p>
            </div>
            <button className="mobile-save-btn bg-white border border-emerald-600 text-emerald-600 font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-50 transition-colors shrink-0">
              <Heart size={18} /> Save for Later
            </button>
          </div>*/}

              <div className="mobile-bottom-sec mt-8 bg-white border border-gray-100 rounded-2xl p-8 mobile-section-p flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm ">
                <div className="mobile-border-none flex items-center gap-5 md:border-r border-gray-100 md:pr-12 w-full md:w-auto">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <p className="text-[18px] font-bold text-gray-800 leading-tight">
                      Your Future is Safe with Canvade
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Join thousands of students who are building better careers
                    </p>
                  </div>
                </div>

                <div className="mobile-bottom-right flex items-center justify-between md:justify-end gap-10 w-full md:w-auto flex-grow md:flex-grow-0">
                  <div className="shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 leading-none">
                        4.7/5
                      </span>
                      <Star
                        className="text-amber-400 fill-amber-400"
                        size={20}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
                      Based on 25,000+ reviews
                    </p>
                  </div>

                  <div className="flex -space-x-3 shrink-0">
                    {[11, 12, 13].map((i) => (
                      <img
                        key={i}
                        src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                        className="mobile-avatar-w w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm"
                        alt="user"
                      />
                    ))}
                    <div className="mobile-avatar-w w-12 h-12 rounded-full bg-gray-50 border-4 border-white flex items-center justify-center text-[11px] font-extrabold text-gray-600 shadow-sm">
                      +25K
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
