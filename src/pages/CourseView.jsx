import React, { useState, useRef, useEffect } from "react";
import {
  Star,
  Clock,
  MapPin,
  BookOpen,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Heart,
  ArrowLeftRight,
  Award,
  Briefcase,
  Globe,
  Calendar,
  Users,
  Building2,
  ShieldCheck,
  UserCheck,
  Play,
  ShoppingCart,
  ListPlus,
  BadgeCheck
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { showSuccess, showError } from "../utils/toast";
import { addInCart, addToCompare } from "../../api/courseApi";
import { sendEnquiry } from "../../api/enquireApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

const TABS = [
  "Overview",
  "Curriculum",
  "Fees & Scholarships",
  "Location",
  "Faculty",
  "Reviews",
  "FAQs",
];

const LEARN_ITEMS = [
  "Advanced research methodologies in psychology",
  "Theories of human behavior and development",
  "Critical analysis and academic writing",
  "Data analysis and statistical tools",
  "Ethical practices in psychological research",
  "Application of research in real-world scenarios",
];

const CURRICULUM = [
  { year: "Year 1", title: "Foundation & Core Concepts", modules: 8 },
  { year: "Year 2", title: "Advanced Research Methods", modules: 7 },
  { year: "Year 3", title: "Specialization & Electives", modules: 9 },
  { year: "Year 4", title: "Research & Dissertation", modules: 6 },
];

const FACULTY = [
  {
    name: "Dr. Amit Verma",
    degree: "PhD in Psychology, Delhi University",
    exp: "10+ Years Exp.",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Dr. Neha Sharma",
    degree: "PhD in Behavioral Sciences, JNU",
    exp: "8+ Years Exp.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Dr. Rohan Mehta",
    degree: "PhD in Clinical Psychology, AIIMS",
    exp: "12+ Years Exp.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
  },
];

const REVIEWS = [
  {
    name: "Priya S.",
    rating: 5,
    text: "Exceptional program! The faculty is world-class and the curriculum is very well structured.",
    date: "Jan 2024",
  },
  {
    name: "Arjun M.",
    rating: 4,
    text: "Great learning experience. The online and onsite blend works perfectly for working professionals.",
    date: "Dec 2023",
  },
  {
    name: "Sneha K.",
    rating: 5,
    text: "The research guidance and dissertation support are outstanding. Highly recommend this program.",
    date: "Nov 2023",
  },
];

const FAQS = [
  {
    q: "What is the eligibility criteria for this PhD program?",
    a: "Applicants must have completed their Post Graduation (Masters degree) in a relevant field with a minimum of 55% marks from a recognized university.",
  },
  {
    q: "Is this program available in online mode?",
    a: "Yes, the program is available in both Onsite and Online modes to accommodate students from different locations.",
  },
  {
    q: "What is the fee structure and are scholarships available?",
    a: "The total fee is ₹2,90,000 with a 15% discount currently available. Merit-based and need-based scholarships are also offered.",
  },
  {
    q: "How is the dissertation process handled?",
    a: "Students are assigned a dedicated research guide in Year 3. The dissertation spans Year 3-4 with regular review sessions and academic support.",
  },
];

const FEES = [
  {
    label: "Application Fee",
    amount: "₹ 2,000",
    note: "One-time, non-refundable",
  },
  { label: "Year 1 Tuition", amount: "₹ 75,000", note: "Per academic year" },
  { label: "Year 2 Tuition", amount: "₹ 75,000", note: "Per academic year" },
  { label: "Year 3 Tuition", amount: "₹ 70,000", note: "Includes electives" },
  { label: "Year 4 Tuition", amount: "₹ 68,000", note: "Dissertation year" },
  {
    label: "Total Fee",
    amount: "₹ 2,90,000",
    note: "After 15% scholarship",
    highlight: true,
  },
];

const SCHOLARSHIPS = [
  {
    title: "Merit Scholarship",
    desc: "Up to 25% fee waiver for students with >80% in Post Graduation",
    deadline: "30 Jun 2024",
  },
  {
    title: "Need-Based Grant",
    desc: "Full or partial fee support for economically weaker sections",
    deadline: "15 Jul 2024",
  },
  {
    title: "Research Fellowship",
    desc: "Monthly stipend of ₹15,000 for selected PhD scholars",
    deadline: "1 Aug 2024",
  },
];

const GALLERY_SLIDES = [
  {
    bg: "from-[#0d1b2a] via-[#0d1b2a] to-[#0d1b2a]",
    label: "E-LEARNING",
    sub: "NOW MASTER",
    accent: "teal",
  },
  {
    bg: "from-[#0d1b2a] via-[#0d1b2a] to-[#0d1b2a]",
    label: "RESEARCH",
    sub: "DEEP DIVE",
    accent: "blue",
  },
  {
    bg: "from-[#12082a] via-[#0d1b2a] to-[#0d1b2a]",
    label: "PSYCHOLOGY",
    sub: "EXPLORE",
    accent: "purple",
  },
  {
    bg: "from-[#0d1b2a] via-[#0d1b2a] to-[#0d1b2a]",
    label: "BEHAVIOR",
    sub: "UNDERSTAND",
    accent: "teal",
  },
  {
    bg: "from-[#0d1b2a] via-[#0d1b2a] to-[#0d1b2a]",
    label: "DOCTORATE",
    sub: "ACHIEVE MORE",
    accent: "blue",
  },
  {
    bg: "from-[#0a2218] via-[#0d1b2a] to-[#0d1b2a]",
    label: "RESEARCH",
    sub: "NEW CLASSES",
    accent: "green",
  },
  {
    bg: "from-[#0d1b2a] via-[#0d1b2a] to-[#0d1b2a]",
    label: "FACULTY",
    sub: "EXPERT TEAM",
    accent: "teal",
  },
  {
    bg: "from-[#1a0d2a] via-[#0d1b2a] to-[#0d1b2a]",
    label: "CAMPUS",
    sub: "12+ CITIES",
    accent: "purple",
  },
];

const ACCREDITATION_HIGHLIGHT_LABELS = [
  "UGC Recognized",
  "AICTE Approved",
  "NAAC Accredited",
  "NSDC Certified",
  "Skill India Aligned",
  "Government Recognized",
  "Industry Recognized",
  "ISO Certified",
  "Internationally Accredited",
  "Certification Included",
  "Placement Assistance Available",
  "Internship Included",
  "Authorized Training Partner",
  "Authorized Examination Centre",
  "University Affiliated",
  "Corporate Certified Program",
];

const ACCENT_COLORS = {
  teal: {
    text: "text-teal-400",
    ring: "border-teal-400",
    bg: "from-teal-400 to-emerald-500",
  },
  blue: {
    text: "text-blue-400",
    ring: "border-blue-400",
    bg: "from-blue-400 to-cyan-500",
  },
  purple: {
    text: "text-purple-400",
    ring: "border-purple-400",
    bg: "from-purple-400 to-violet-500",
  },
  green: {
    text: "text-green-400",
    ring: "border-green-400",
    bg: "from-green-400 to-teal-500",
  },
};

const EMPTY_COURSE = {
  basicDetails: {},
  priceDetails: {},
  curriculumDetails: [],
  faqs: [],
};

const DEFAULT_LOCATION = {
  addressLine1: "Moti Nagar",
  city: "New Delhi",
  state: "Delhi",
  country: "India",
};

const asArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const toText = (value) => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return (
    value.name || value.title || value.label || value.value || String(value)
  );
};

const getFileUrl = (value) => {
  if (!value) return "";
  const raw =
    typeof value === "string"
      ? value
      : value.url ||
      value.secure_url ||
      value.path ||
      value.preview ||
      value.name ||
      "";

  if (!raw || typeof raw !== "string") return "";
  if (
    raw.startsWith("blob:") ||
    raw.startsWith("data:") ||
    raw.startsWith("http")
  ) {
    return raw;
  }
  return `${API_BASE_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

const formatCourseLocation = (location) => {
  if (!location) return "";
  if (typeof location === "string") return location;
  return [
    location.addressLine1,
    location.addressLine2,
    location.city,
    location.state,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
};

// Short label for a location: prefers "City, State" and falls back sensibly
// so we never have to show generic "Location 1 / Location 2" placeholders.
const formatCourseLocationShort = (location, index = 0) => {
  if (!location) return `Branch ${index + 1}`;
  if (typeof location === "string") return location;
  const cityState = [location.city, location.state].filter(Boolean).join(", ");
  if (cityState) return cityState;
  const fallback = [
    location.addressLine1,
    location.addressLine2,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
  return fallback || `Branch ${index + 1}`;
};

const getMapsHref = (location) => {
  if (!location) return "";
  if (typeof location === "object" && location.googleMapLink) {
    return location.googleMapLink;
  }
  const label = formatCourseLocation(location);
  return label
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`
    : "";
};

const getMapsEmbedUrl = (location) => {
  if (!location) return "";
  const label = formatCourseLocation(location);
  return label
    ? `https://maps.google.com/maps?q=${encodeURIComponent(label)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : "";
};

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const getCourseMedia = (course) => {
  const uploadMaterials = course?.uploadMaterials || {};
  return [
    uploadMaterials.thumbnail,
    course?.thumbnail,
    course?.thumbnailUrl,
    uploadMaterials.course_thumbnail,
    ...asArray(uploadMaterials.images),
    ...asArray(uploadMaterials.courseImages),
    ...asArray(uploadMaterials.galleryImages),
    ...asArray(course?.images),
    ...asArray(course?.courseImages),
    ...asArray(course?.galleryImages),
    ...asArray(course?.gallery),
  ]
    .map(getFileUrl)
    .filter(Boolean);
};

const getInstituteDisplayName = (course) =>
  course?.institute?.name ||
  course?.institute?.instituteName ||
  course?.institute?.institutionName ||
  course?.institute?.profile?.name ||
  course?.institute?.basicDetails?.name ||
  course?.instituteName ||
  course?.institutionName ||
  course?.basicDetails?.instituteName ||
  course?.basicDetails?.institution ||
  course?.basicDetails?.institutionName ||
  course?.name ||
  "Institute";

const getInstituteDisplayLogo = (course) =>
  getFileUrl(
    course?.media?.logo ||
    course?.institute?.logo ||
    course?.institute?.profileImage ||
    course?.institute?.image ||
    course?.institute?.thumbnail ||
    course?.instituteLogo ||
    course?.createdByLogo ||
    course?.basicDetails?.instituteLogo,
  );

const getInstituteDisplayId = (course) =>
  course?.institute?._id ||
  course?.institute?.id ||
  course?.instituteId ||
  course?.institutionId ||
  course?.basicDetails?.instituteId;

function StarRow({ rating, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </span>
  );
}

function LoadingSkeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

function InstituteInformationCard({ course, loading, compact = false }) {
  const instituteName = getInstituteDisplayName(course);
  const instituteStats = compact
    ? [
      { label: "Established", val: "1949" },
      { label: "Campus", val: "12+ Cities" },
      { label: "Students Enrolled", val: "25,000+" },
      { label: "Website", val: "www.icai.edu.in", link: true },
    ]
    : [
      { label: "Established", val: "1949" },
      { label: "Campus", val: "12+ Cities" },
      { label: "Students Enrolled", val: "25,000+" },
      { label: "Website", val: "www.icai.edu.in", link: true },
    ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-md">
      <h4 className="font-semibold text-[18px] text-slate-900 mb-4">
        Institute Information
      </h4>

      {loading ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 mb-4">
            <LoadingSkeleton className="w-12 h-12 rounded-full shrink-0 mt-1" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-4 w-4/5" />
              <LoadingSkeleton className="h-3 w-2/3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: instituteStats.length }).map((_, index) => (
              <div key={index} className="space-y-2">
                <LoadingSkeleton className="h-3 w-16" />
                <LoadingSkeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          <LoadingSkeleton className="h-10 w-full rounded-xl" />
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden border border-gray-200 shadow-sm mt-1 bg-white">
              <img
                src="/workshop.png"
                alt="Institute Logo"
                className="w-full h-full object-cover object-center scale-125 rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`flex items-center justify-between" font-bold text-[14px] text-slate-900 flex-wrap gap-2`}
              >
                <span>{instituteName}</span>
                <CheckCircle
                  size={16}
                  className="fill-blue-600 text-white shrink-0"
                />
              </div>
              <div className="flex items-center text-amber-400 font-bold text-xs mt-0.5">
                <Star size={13} fill="currentColor" /> 4.6/5
                <span className="text-gray-500 font-medium ml-1.5">
                  (256 Reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {instituteStats.map(({ label, val, link }, index) => (
              <div key={index} className="space-y-2">
                <p className="text-gray-400 text-[10px] uppercase tracking-wide">
                  {label}
                </p>
                {link ? (
                  <a
                    href="#"
                    className="font-semibold text-emerald-600 underline"
                  >
                    {val}
                  </a>
                ) : (
                  <p className="font-semibold text-slate-700">{val}</p>
                )}
              </div>
            ))}
          </div>

          <button className="w-full py-2 border mt-2 border-emerald-500 text-emerald-600 text-xs font-bold rounded-xl hover:bg-emerald-50 transition-colors">
            View Institute Profile →
          </button>
        </>
      )}
    </div>
  );
}

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedCurr, setExpandedCurr] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [shortlisted, setShortlisted] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [course, setCourse] = useState(EMPTY_COURSE);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    text: "",
  });
  const [userReviews, setUserReviews] = useState([]);
  const [fetchedReviews, setFetchedReviews] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [courseRating, setCourseRating] = useState(0);
  const [featuredReviewIndex, setFeaturedReviewIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const userRole = (
    localStorage.getItem("Role") ||
    localStorage.getItem("role") ||
    ""
  ).toLowerCase();
  const isStudentRole = userRole === "student";
  const [studentAccessPrompt, setStudentAccessPrompt] = useState({
    open: false,
    actionLabel: "",
  });

  const tabBarRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourse = async () => {
      if (!courseId) {
        setCourse(EMPTY_COURSE);
        setFetchError("Select a course card to view its details.");
        return;
      }

      const token =
        localStorage.getItem("token") || localStorage.getItem("Token");

      setLoading(true);
      setFetchError("");

      setFetchedReviews([]); // Reset reviews on course change
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/courses/${courseId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch course details (${response.status})`,
          );
        }

        const data = await response.json();
        if (data.success && data.data) {
          setCourse(data.data);
          setFetchError("");
        } else {
          throw new Error(data.message || "Unable to load course details");
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setCourse(EMPTY_COURSE);
        setFetchError("");
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    return () => controller.abort();
  }, [courseId]);

  useEffect(() => {
    if (!courseId) {
      return;
    }

    const controller = new AbortController();

    const fetchTabData = async () => {
      if (activeTab === "Reviews") {
        try {
          const reviewsResponse = await fetch(
            `${API_BASE_URL}/api/course-reviews/get/${courseId}`,
            {
              signal: controller.signal,
            },
          );

          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            if (reviewsData.success && Array.isArray(reviewsData.reviews)) {
              setFetchedReviews(reviewsData.reviews);
            }
          } else {
            console.warn(`Could not fetch reviews for course ${courseId}`);
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error fetching reviews:", error);
          }
        }
      } else if (activeTab === "Faculty") {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/courses/faculties/${courseId}`,
            { signal: controller.signal },
          );
          if (!response.ok) {
            throw new Error("Failed to fetch faculty");
          }
          const data = await response.json();
          if (data.success && Array.isArray(data.faculty)) {
            setFaculty(data.faculty);
          } else {
            setFaculty([]);
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error fetching faculty:", error);
            setFaculty([]);
          }
        }
      }
    };

    fetchTabData();
    return () => controller.abort();
  }, [activeTab, courseId]);
  useEffect(() => {
    if (!courseId) return;
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/api/course-reviews/get/${courseId}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews)) {
          setReviewCount(data.reviews.length);
          setFetchedReviews(data.reviews);

          // ✅ Real average calculate karo
          if (data.reviews.length > 0) {
            const avg =
              data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
              data.reviews.length;
            setCourseRating(avg);
          } else {
            setCourseRating(0);
          }
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [courseId]);

  useEffect(() => {
    const t = setInterval(
      () => setCurrentSlide((p) => (p + 1) % GALLERY_SLIDES.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + galleryCount) % galleryCount);
  const nextSlide = () => setCurrentSlide((p) => (p + 1) % galleryCount);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const el = tabBarRef.current?.querySelector(`[data-tab="${tab}"]`);
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const submitReview = async (event) => {
    event.preventDefault();
    const text = reviewForm.text.trim();
    if (!text) {
      showError("Please write a review before submitting.");
      return;
    }

    const token =
      localStorage.getItem("token") || localStorage.getItem("Token");
    if (!token) {
      showError("You must be logged in to submit a review.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/course-reviews/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: reviewForm.rating,
            review: text,
            // name is not sent, backend should associate user from token
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      // Add the new review to the list.
      // Ideally the backend returns the saved review object with user details.
      const newReview = data.data || {
        name: "You", // Placeholder name
        rating: reviewForm.rating,
        text,
        date: "Just now",
      };

      setUserReviews((prev) => [newReview, ...prev]);
      setReviewForm({ rating: 5, text: "" }); // Reset form
      showSuccess("Your review has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      showError(
        error.message || "An error occurred while submitting your review.",
      );
    }
  };

  // Student-only gate: mirrors CourseCategoriesSection's requireStudentAccess.
  const requireStudentAccess = (actionLabel, action) => {
    if (isStudentRole) {
      action?.();
      return;
    }

    setStudentAccessPrompt({
      open: true,
      actionLabel,
    });
  };

  const closeStudentAccessPrompt = () => {
    setStudentAccessPrompt({ open: false, actionLabel: "" });
  };

  const confirmStudentAccessPrompt = () => {
    closeStudentAccessPrompt();
    localStorage.removeItem("token");
    localStorage.removeItem("Token");
    localStorage.removeItem("Role");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/get-started/login/student");
  };

  const getActiveCourseId = () =>
    course?.basicDetails?.courseId ||
    course?.courseId ||
    course?._id ||
    course?.id ||
    courseId;

  const handleCompare = () => {
    requireStudentAccess("compare courses", () => {
      (async () => {
        const token = localStorage.getItem("token");
        try {
          await addToCompare(getActiveCourseId(), token);
        } catch (err) {
          console.error(err);
        } finally {
          navigate("/dashboard/compare", { state: { course1: course } });
        }
      })();
    });
  };

  const handleAddToCart = () => {
    requireStudentAccess("add this course to your learn list", async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await addInCart(getActiveCourseId(), token);

        window.dispatchEvent(new Event("cart-updated"));
        setShortlisted(true);

        showSuccess(data.message || "Course added to cart successfully");
      } catch (error) {
        showError("Already added to cart!");
        navigate("/cart");
      }
    });
  };

  const handleEnquire = () => {
    requireStudentAccess("send an enquiry", async () => {
      try {
        const res = await sendEnquiry({ courseId: getActiveCourseId() });
        if (!res.success) {
          showError(res.message || "Unable to send enquiry");
          return;
        }
        navigate("/chat", { state: { conversationId: res.data.conversationId } });
      } catch (error) {
        showError(
          error?.response?.data?.message || error?.message || "Unable to send enquiry",
        );
      }
    });
  };

  const handleCheckout = () => {
    requireStudentAccess("enroll", () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      localStorage.setItem("checkoutCourse", JSON.stringify(course));
      navigate(`/checkout/${courseId || course?._id || course?.id || ""}`);
    });
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-4">
            <LoadingSkeleton className="h-6 w-44" />
            <LoadingSkeleton className="h-4 w-full" />
            <LoadingSkeleton className="h-4 w-11/12" />
            <LoadingSkeleton className="h-4 w-10/12" />
            <LoadingSkeleton className="h-4 w-8/12" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-4">
            <LoadingSkeleton className="h-6 w-36" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3">
                  <LoadingSkeleton className="h-6 w-6 rounded-full shrink-0" />
                  <LoadingSkeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-4">
            <LoadingSkeleton className="h-6 w-40" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-sm text-gray-600"
                >
                  <LoadingSkeleton className="h-4 w-4 mt-1 rounded-full shrink-0" />
                  <LoadingSkeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "Overview": {
        return (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                {highlightItems.map((item, i) => (
                  <div
                    key={`${item.label}-${i}`}
                    className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3"
                  >
                    <div className="flex items-center gap-2 text-emerald-700">
                      <ShieldCheck size={15} className="shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {item.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800 leading-snug">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Learning Outcomes
              </h3>
              <ul className="space-y-4 sm:space-y-5">
                {(learningOutcomes.length > 0
                  ? learningOutcomes
                  : LEARN_ITEMS
                ).map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <CheckCircle
                      size={18}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Career Path
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(careerPaths.length
                  ? careerPaths
                  : ["No career paths added yet."]
                ).map((item, i) => (
                  <div
                    key={`${item}-${i}`}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <Briefcase
                      size={18}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />
                    <span className="text-sm font-medium text-slate-700 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case "Curriculum": {
        const curriculumItems = Array.isArray(course.curriculumDetails)
          ? course.curriculumDetails
          : [];

        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Curriculum Overview
              </h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {curriculumItems.length} Modules
              </span>
            </div>
            <div className="space-y-2.5">
              {curriculumItems.map((item, idx) => {
                const modules = Array.isArray(item.modules) ? item.modules : [];

                return (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedCurr(expandedCurr === idx ? null : idx)
                      }
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mr-2">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          Module {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-800 line-clamp-1">
                          {item.heading ||
                            item.moduleTitle ||
                            `Section ${idx + 1}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-400 hidden sm:block">
                          {modules.length} Modules
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-gray-400 transition-transform ${expandedCurr === idx ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>
                    {expandedCurr === idx && (
                      <div className="p-4 border-t border-gray-100 bg-white">
                        <ul className="space-y-2">
                          {modules.map((module, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <div className="min-w-0">
                                <span className="block font-medium text-slate-700 line-clamp-1">
                                  {module.name ||
                                    module.moduleName ||
                                    `Module ${i + 1}`}
                                </span>
                                {module.description && (
                                  <span className="block text-xs text-gray-500 line-clamp-1">
                                    {module.description}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case "Fees & Scholarships":
        return (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Fee Structure
              </h3>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Actual Price
                  </p>
                  <span className="font-bold text-slate-800 text-sm line-through">
                    ₹ {course.priceDetails.actualPrice?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="text-sm font-semibold text-emerald-700">
                    Discount
                  </p>
                  <span className="font-bold text-emerald-700 text-sm">
                    - {course.priceDetails.discount}%
                  </span>
                </div>
                {(course.priceDetails.courseExpenses || []).map(
                  (expense, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3"
                    >
                      <p className="text-sm font-semibold text-slate-700">
                        {expense.reason || expense.name}
                      </p>
                      <span className="font-bold text-slate-800 text-sm">
                        ₹{" "}
                        {(expense.amount ?? expense.expense)?.toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                  ),
                )}
                <div className="flex items-center justify-between py-3 bg-emerald-50 -mx-5 px-5 rounded-xl mt-1">
                  <p className="text-sm font-semibold text-emerald-800">
                    Total Fee
                  </p>
                  <span className="font-bold text-emerald-700 text-base">
                    ₹{" "}
                    {course.priceDetails.currentPrice?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Scholarships Available
              </h3>
              <div className="space-y-3">
                {(course.priceDetails.scholarships || []).map((s, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex items-start gap-3"
                  >
                    <Award
                      className="text-emerald-600 shrink-0 mt-0.5"
                      size={18}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {typeof s === "string"
                          ? s
                          : s.name || s.title || s.label || "Scholarship"}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "Faculty": {
        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5"></div>
            {faculty.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {faculty.map((f, i) => (
                  <div
                    key={i}
                    className="border border-gray-200/70 rounded-2xl p-5 text-center bg-white flex flex-col items-center justify-between shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-2 border-emerald-100 bg-white flex-shrink-0 shadow-md">
                      <img
                        src={getFileUrl(
                          f.image || f.imageUrl || f.profileImage,
                        )}
                        alt={f.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name || "F")}&background=d1fae5&color=059669`;
                        }}
                      />
                    </div>

                    <div className="flex-grow flex flex-col items-center">
                      <h4 className="font-bold text-base text-slate-900 leading-tight">
                        {f.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 capitalize line-clamp-2 min-h-[40px] max-w-[200px] leading-relaxed">
                        {Array.isArray(f.subjects) && f.subjects.length > 0
                          ? f.subjects.join(", ")
                          : "Subjects not specified"}
                      </p>
                    </div>

                    <div className="mt-4 w-full">
                      <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                        {f.experience
                          ? f.experience.replace(/years?/i, "Yr. Exp.")
                          : "Experience not specified"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 col-span-full">
                No faculty information available for this course.
              </div>
            )}
          </div>
        );
      }
      case "Location": {
        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Location</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {formatCourseLocation(selectedLocation)}
                </p>
              </div>
              {courseLocations.length > 1 && (
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                  {courseLocations.length} branches
                </span>
              )}
            </div>

            {courseLocations.length > 1 && (
              <div className="flex flex-wrap gap-2.5">
                {courseLocations.map((location, index) => (
                  <button
                    key={`loc-tab-${formatCourseLocation(location)}-${index}`}
                    type="button"
                    onClick={() => setSelectedLocationIndex(index)}
                    className={`rounded-full border px-4 py-2 text-xs sm:text-sm font-bold transition ${index === selectedLocationIndex
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                      }`}
                  >
                    {formatCourseLocationShort(location, index)}
                  </button>
                ))}
              </div>
            )}

            <div className="h-64 sm:h-80 w-full overflow-hidden rounded-xl border border-slate-200">
              <iframe
                key={selectedLocationIndex}
                className="h-full w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedUrl}
              ></iframe>
            </div>

            {getMapsHref(selectedLocation) && (
              <a
                href={getMapsHref(selectedLocation) || undefined}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <MapPin size={14} className="text-red-500" />
                Open in Google Maps
              </a>
            )}
          </div>
        );
      }
      case "Reviews": {
        const allReviews = [...userReviews, ...fetchedReviews];
        const totalReviews = allReviews.length;
        const averageRating =
          totalReviews > 0
            ? allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            totalReviews
            : 0;
        const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
          const count = allReviews.filter(
            (r) => Math.round(r.rating) === star,
          ).length;
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          return { star, count, percentage };
        });

        const safeFeaturedIndex =
          totalReviews > 0 ? featuredReviewIndex % totalReviews : 0;
        const featuredReview = allReviews[safeFeaturedIndex];

        const showRandomReview = () => {
          if (totalReviews <= 1) return;
          let nextIndex = Math.floor(Math.random() * totalReviews);
          if (nextIndex === safeFeaturedIndex) {
            nextIndex = (nextIndex + 1) % totalReviews;
          }
          setFeaturedReviewIndex(nextIndex);
        };

        const featuredReviewerName =
          featuredReview?.studentName || featuredReview?.name || "Anonymous";
        const featuredReviewInitials = featuredReviewerName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join("") || "S";
        const featuredReviewDate = featuredReview?.createdAt?._seconds
          ? new Date(
            featuredReview.createdAt._seconds * 1000,
          ).toLocaleDateString("en-GB")
          : featuredReview?.date
            ? new Date(featuredReview.date).toString() === "Invalid Date"
              ? featuredReview.date
              : new Date(featuredReview.date).toLocaleDateString("en-GB")
            : "";
        const featuredReviewText =
          featuredReview?.review ||
          featuredReview?.comment ||
          featuredReview?.text ||
          "";

        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 pb-5 border-b border-gray-100">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-center flex flex-col justify-center">
                <p className="text-5xl font-black text-slate-900">
                  {averageRating.toFixed(1)}
                </p>
                <div className="flex justify-center mt-2">
                  <StarRow rating={averageRating} size={18} />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Based on {totalReviews} reviews
                </p>
              </div>
              <div className="w-full space-y-3 self-center">
                {ratingDistribution.map((dist) => (
                  <div key={dist.star} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 w-3">
                      {dist.star}
                    </span>
                    <Star
                      size={10}
                      className="text-amber-400 fill-amber-400 shrink-0"
                    />
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {dist.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={submitReview}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Write a Review
                  </h3>
                  <p className="text-sm text-gray-500">
                    Share your experience with this course.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setReviewForm((prev) => ({ ...prev, rating }))
                      }
                      className="p-1"
                      aria-label={`${rating} star rating`}
                    >
                      <Star
                        size={22}
                        className={
                          rating <= reviewForm.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300 fill-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                <textarea
                  value={reviewForm.text}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, text: e.target.value }))
                  }
                  placeholder="Write your review"
                  rows={1}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 md:min-h-[48px]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Submit
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Student Reviews
              </h3>
              {featuredReview ? (
                <div className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                        {featuredReviewInitials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {featuredReviewerName}
                        </p>
                        <StarRow rating={featuredReview.rating} size={13} />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                    "{featuredReviewText}"
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {featuredReviewDate}
                    </span>
                    {totalReviews > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={showRandomReview}
                          aria-label="Show another review"
                          className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 hover:text-emerald-700 transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={showRandomReview}
                          aria-label="Show another review"
                          className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 hover:text-emerald-700 transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No reviews yet. Be the first to write one!
                </div>
              )}
            </div>
          </div>
        );
      }
      case "FAQs": {
        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-3">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Frequently Asked Questions
            </h3>
            {course.faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="text-sm font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="p-4 border-t border-gray-100 bg-white">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const galleryMedia = getCourseMedia(course);
  const galleryCount = galleryMedia.length || GALLERY_SLIDES.length;
  const activeGalleryImage = galleryMedia.length
    ? galleryMedia[currentSlide % galleryMedia.length]
    : "";

  useEffect(() => {
    setImgLoaded(false);
  }, [activeGalleryImage]);
  const slide = GALLERY_SLIDES[currentSlide % GALLERY_SLIDES.length];
  const accent = ACCENT_COLORS[slide.accent];
  const courseDuration =
    course.basicDetails.duration ||
    course.basicDetails.courseDuration ||
    "4 Year";
  const courseLocations = asArray(
    course.basicDetails.locations ||
    course.locations ||
    course.institute?.locations ||
    course.location ||
    DEFAULT_LOCATION,
  ).filter(Boolean);
  const primaryLocation = courseLocations[0] || DEFAULT_LOCATION;
  const selectedLocation =
    courseLocations[selectedLocationIndex] || primaryLocation;
  const mapEmbedUrl = getMapsEmbedUrl(selectedLocation);
  const instituteName = getInstituteDisplayName(course);
  const instituteId = getInstituteDisplayId(course);
  const instituteLogo = getInstituteDisplayLogo(course);
  const openInstituteProfile = () => {
    if (instituteId) {
      localStorage.setItem("selectedInstituteId", instituteId);
    }
    navigate("/instituteview", {
      state: {
        instituteId,
        instituteName,
      },
    });
  };
  const courseTitle =
    course.basicDetails.courseTitle ||
    course.title ||
    "Philosophy of Doctorate in Human Behavior and Psychological Research";
  const courseDescription =
    course.basicDetails.aboutCourse ||
    course.basicDetails.description ||
    course.description ||
    "Discover a structured program built for practical learning, academic clarity, and career-focused outcomes.";

  const currentPrice = toNumber(
    course.priceDetails.currentPrice ||
    course.priceDetails.offerPrice ||
    course.priceDetails.finalPrice ||
    course.currentPrice ||
    course.price,
    290000,
  );
  const actualPrice = toNumber(
    course.priceDetails.actualPrice ||
    course.priceDetails.mrp ||
    course.priceDetails.originalPrice ||
    course.actualPrice,
    currentPrice > 0 ? 340000 : 0,
  );
  const discountPercent =
    course.priceDetails.discount ||
    (actualPrice > currentPrice
      ? Math.round(((actualPrice - currentPrice) / actualPrice) * 100)
      : 0);
  const courseTag =
    course.tag ||
    course.badge ||
    course.basicDetails.tag ||
    course.basicDetails.badge ||
    "Student's Choice";
  const lastMonthEnrollments =
    course.lastMonthEnrollments ||
    course.enrollmentsLastMonth ||
    course.analytics?.lastMonthEnrollments ||
    course.monthlyEnrollments ||
    128;
  const lastMonthEnrollmentLabel = Number.isFinite(Number(lastMonthEnrollments))
    ? Number(lastMonthEnrollments).toLocaleString("en-IN")
    : String(lastMonthEnrollments);
  const learningOutcomes = Array.isArray(course.basicDetails.learningOutcomes)
    ? course.basicDetails.learningOutcomes.filter(Boolean)
    : Array.isArray(course.learningOutcomes)
      ? course.learningOutcomes.filter(Boolean)
      : [];
  const courseInformation = course.basicDetails.courseInformation || {};
  const accreditationItems = Array.isArray(courseInformation.accreditation)
    ? courseInformation.accreditation.filter(Boolean)
    : [];
  const learningMode =
    courseInformation.learningMode ||
    course.basicDetails.learningMode ||
    course.basicDetails.mode ||
    course.learningMode ||
    "Onsite & Online";
  const careerPaths = asArray(
    course.basicDetails.careerPaths || course.careerPaths,
  )
    .map(toText)
    .filter(Boolean);
  const courseReviewItems = asArray(course.reviews || course.courseReviews)
    .map((review) => ({
      name: review.name || review.studentName || review.userName || "Student",
      rating: Number(review.rating || review.stars || 5),
      text: review.text || review.comment || review.review || "",
      date: review.date || review.createdAt || "",
    }))
    .filter((review) => review.text);
  const highlightItems = [
    {
      label: "Accreditation",
      value: accreditationItems.length
        ? accreditationItems.join(", ")
        : "Not specified",
    },
    { label: "Learning Mode", value: learningMode || "Not specified" },
    {
      label: "Course Language",
      value: courseInformation.language || course.language || "Not specified",
    },
    {
      label: "Course Level",
      value:
        courseInformation.courseLevel ||
        courseInformation.level ||
        course.level ||
        "Not specified",
    },
    {
      label: "Course Difficulty",
      value:
        courseInformation.difficulty || course.difficulty || "Not specified",
    },
    {
      label: "Certification Type",
      value:
        courseInformation.certification ||
        course.certification ||
        "Not specified",
    },
    {
      label: "Supporting Materials",
      value:
        courseInformation.supportingMaterials ||
        course.supportingMaterials ||
        "Not specified",
    },
    {
      label: "Placement Assistance",
      value:
        courseInformation.placementAssistance ||
        course.placementAssistance ||
        "Not specified",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased pt-16 font-sans">
      <Navbar />

      <div className="mt-3 sm:mt-6 w-full bg-white ">
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch lg:min-h-[300px]">
            <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0">
              {loading ? (
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 shadow-sm w-full aspect-video lg:aspect-auto lg:h-full min-h-[220px] lg:min-h-[300px] p-4 flex flex-col justify-between animate-pulse">
                  <div className="flex justify-between items-center z-10">
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                    <div className="h-6 w-12 bg-gray-200 rounded-md" />
                  </div>

                  <div className="flex flex-col items-center justify-center my-auto py-6 z-10 gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="h-4 w-36 bg-gray-200 rounded-md" />
                  </div>

                  <div className="flex justify-center gap-1.5 z-10">
                    <div className="h-1.5 w-6 bg-gray-300 rounded-full" />
                    <div className="h-1.5 w-1.5 bg-gray-200 rounded-full" />
                    <div className="h-1.5 w-1.5 bg-gray-200 rounded-full" />
                    <div className="h-1.5 w-1.5 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ) : (
                <div
                  className={`relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm
                           w-full aspect-video lg:aspect-auto lg:h-full
                           flex flex-col justify-between p-4 group select-none
                           ${activeGalleryImage ? "bg-white border border-gray-100" : `bg-gradient-to-br ${slide.bg}`}`}
                >
                  {activeGalleryImage ? (
                    <>
                      {!imgLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10">
                          <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <img
                        src={activeGalleryImage}
                        alt={courseTitle}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgLoaded(true)}
                        className={`absolute inset-0 h-full w-full object-cover bg-white transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                      />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/60 z-0" />
                      <div
                        className={`absolute top-4 right-4 w-32 h-32 rounded-full border-2 ${accent.ring} opacity-20`}
                      />
                      <div
                        className={`absolute -bottom-6 -right-6 w-48 h-48 rounded-full border-2 ${accent.ring} opacity-10`}
                      />
                    </>
                  )}

                  {!activeGalleryImage && (
                    <div className="z-10 flex flex-col items-center justify-center text-center my-auto py-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${accent.bg} rounded-full border-2 ${accent.ring}
                                   mb-3 flex items-center justify-center shadow-lg cursor-pointer
                                   hover:scale-105 transition-transform`}
                      >
                        <Play
                          size={20}
                          className="text-white fill-white ml-0.5"
                        />
                      </div>
                      <h4
                        className={`text-white font-black text-xl sm:text-2xl md:text-3xl tracking-tight drop-shadow-lg ${accent.text}`}
                        style={{
                          WebwebkitTextStroke: "1px rgba(255,255,255,0.1)",
                        }}
                      >
                        {slide.label}
                      </h4>
                      <p
                        className={`${accent.text} text-xs font-bold tracking-[0.25em] uppercase mt-1`}
                      >
                        {slide.sub}
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between z-10">
                    <button
                      onClick={prevSlide}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white
                               flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white
                               flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="z-10 self-start bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md font-medium">
                    {(currentSlide % galleryCount) + 1} / {galleryCount}
                  </div>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {Array.from({ length: galleryCount }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1.5 rounded-full transition-all ${i === currentSlide % galleryCount ? "bg-teal-400 w-5" : activeGalleryImage ? "bg-slate-300 w-1.5" : "bg-white/35 w-1.5"}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full lg:flex-1 min-w-0 space-y-5">
              {loading ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <LoadingSkeleton className="h-6 w-32 rounded-full" />
                    <LoadingSkeleton className="h-5 w-28 rounded-full" />
                  </div>
                  <LoadingSkeleton className="h-5 w-64" />
                  <LoadingSkeleton className="h-8 w-full max-w-[620px]" />
                  <LoadingSkeleton className="h-12 w-full max-w-[760px]" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <LoadingSkeleton className="h-6 w-6 rounded-full shrink-0" />
                        <LoadingSkeleton className="h-4 w-44" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center gap-12 mb-3">
                    <span
                      className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5
                                   rounded-full border border-emerald-200 flex items-center gap-1.5"
                    >
                      <Award size={13} /> {courseTag}
                    </span>
                    <div
                      className="flex items-center gap-1.5 cursor-pointer"
                      onClick={() => {
                        handleTabClick("Reviews");
                        setTimeout(() => {
                          tabBarRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }, 100);
                      }}
                    >
                      <StarRow
                        rating={reviewCount > 0 ? courseRating : 0}
                        size={15}
                      />
                      <span className="text-sm font-bold text-slate-700">
                        {reviewCount > 0
                          ? courseRating.toFixed(1)
                          : "No ratings yet"}
                      </span>
                      <span className="text-gray-600 text-sm">
                        ({reviewCount} Reviews)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openInstituteProfile}
                    className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1.5 text-left text-blue-700 transition hover:bg-blue-100"
                  >
                    {/* <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-blue-100 bg-white">
                      <img
                        src={instituteLogo || "/workshop.png"}
                        alt={instituteName}
                        className="h-full w-full object-cover"
                      />
                    </span> */}
                    <span className="min-w-0 truncate text-sm font-semibold sm:text-[15px]">
                      {instituteName}
                    </span>
                    <BadgeCheck className="w-4 h-4 text-white fill-[#3b82f6] flex-shrink-0" />
                  </button>

                  <h1 className="mb-3 max-w-[760px] text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl md:text-[34px]">
                    {courseTitle}
                  </h1>

                  <p
                    className={`mb-1.5 max-w-[780px] text-sm leading-6 text-slate-600 md:text-[15px] ${showFullAbout ? "" : "line-clamp-3"
                      }`}
                  >
                    {courseDescription}
                  </p>
                  {courseDescription.length > 160 && (
                    <button
                      type="button"
                      onClick={() => setShowFullAbout((v) => !v)}
                      className="mb-4 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      {showFullAbout ? "Show less" : "Read more"}
                    </button>
                  )}
                  {courseDescription.length <= 160 && <div className="mb-4" />}

                  {fetchError && (
                    <div className="mb-4 rounded-xl border px-4 py-3 text-sm border-amber-200 bg-amber-50 text-amber-800">
                      {fetchError}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 text-slate-600 sm:max-w-[620px]">
                    <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
                      <div className="inline-flex items-center gap-3 text-base font-semibold">
                        <Clock size={22} className="text-slate-600" />
                        <span>{courseDuration}</span>
                      </div>
                      <div className="inline-flex items-center gap-3 text-base font-semibold">
                        <BookOpen size={22} className="text-slate-600" />
                        <span>{learningMode}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0">
                <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4 animate-pulse">
                  <div className="h-8 w-36 bg-gray-200 rounded-md" />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-10 bg-gray-200 rounded-xl" />
                    <div className="h-10 bg-gray-200 rounded-xl" />
                  </div>
                  <div className="h-3 w-48 bg-gray-200 rounded-md mx-auto mt-2" />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-11 bg-gray-200 rounded-xl" />
                    <div className="h-11 bg-gray-200 rounded-xl" />
                  </div>
                  <div className="h-8 w-full bg-gray-200 rounded-xl mt-2" />
                </div>
              </div>
            ) : (
              <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0">
                <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-md divide-y divide-gray-100">
                  <div className="p-5">
                    <div className="flex flex-wrap items-end gap-2">
                      <p className="text-[28px] font-extrabold leading-none tracking-tight text-slate-950">
                        ₹ {currentPrice.toLocaleString("en-IN")}
                      </p>
                      {actualPrice ? (
                        <span className="pb-1 text-sm font-semibold text-slate-400 line-through">
                          ₹ {actualPrice.toLocaleString("en-IN")}
                        </span>
                      ) : null}
                      {discountPercent ? (
                        <span className="mb-0.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
                          {discountPercent}% Off
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={handleEnquire}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        Enquire Now
                      </button>
                      <button
                        onClick={handleCheckout}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#007965] text-sm font-extrabold text-white shadow-none transition hover:bg-[#006252]"
                      >
                        <ShoppingCart size={16} />
                        Checkout
                      </button>
                    </div>
                    <p className="mt-2 text-center text-xs font-bold text-slate-400">
                      Get free counselling & guidance
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setShortlisted((v) => !v);
                          handleAddToCart();
                        }}
                        className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold transition ${shortlisted
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                      >
                        <ListPlus size={15} />
                        Learning List
                      </button>
                      <button
                        onClick={handleCompare}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 text-sm font-extrabold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        <ArrowLeftRight size={15} />
                        Compare
                      </button>
                    </div>

                    <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-orange-50 px-3 py-2 text-xs font-extrabold text-slate-800">
                      <Users size={14} className="text-orange-500" />
                      {lastMonthEnrollmentLabel} students enrolled last month
                    </p>
                  </div>

                  <div className="p-4">
                    <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      Secure checkout • Verified institute
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1700px] w-full mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 w-full min-w-0 space-y-5">
            <div
              ref={tabBarRef}
              className="sticky top-14 md:top-[60px] z-20 bg-white border-b border-gray-200 overflow-x-auto flex gap-1 sm:gap-4 md:gap-6 lg:gap-10 -mx-4 px-4"
              style={{
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  data-tab={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`flex-shrink-0 px-2 sm:px-3 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {renderTabContent()}
          </div>
        </div>
      </div>

      {studentAccessPrompt.open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Continue to {studentAccessPrompt.actionLabel.toLowerCase()}?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              You need a student account to{" "}
              {studentAccessPrompt.actionLabel.toLowerCase()}. Confirm to open
              the student sign-in page.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeStudentAccessPrompt}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStudentAccessPrompt}
                className="rounded-lg bg-[#24977a] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d7a63]"
              >
                Go to Student Login
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}