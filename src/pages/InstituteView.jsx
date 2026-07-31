import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Share2,
  Bookmark,
  AlertCircle,
  CheckCircle2,
  Building,
  Award,
  Users,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Lock,
  HelpCircle,
  Headphones,
  LayoutGrid,
  FileText,
  ImageIcon,
  Briefcase,
  Phone,
  MessageSquare,
  BadgeCheck,
  Clock3,
  MoreVertical,
  Scale,
  Heart,
  Bell,
  CircleDot,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UpdateCard from "../components/Updates/UpdateCard";
import { getInstituteReviews } from "../../api/reviewApi";
import { addInCart, addToCompare } from "../../api/courseApi";
import { sendEnquiry } from "../../api/enquireApi";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";
const FALLBACK_INSTITUTE_ID = "ozLWFuoUI3jKmFg6zJes";
const LOCATION_FALLBACK = {
  addressLine1: "Canvade Campus, Knowledge Park III",
  addressLine2: "Greater Noida, Uttar Pradesh - 201306",
};
const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=900&auto=format&fit=crop&q=80";

// ─── Static Data ────────────────────────────────────────────────────────────

const SUB_TABS = [
  "Overview",
  "Courses",
  "Blogs",
  "Reviews",
  "Photos",
  "Placements",
  "Contact",
];

const USER_REVIEWS = [
  {
    name: "Rohit Sharma",
    meta: "B.Tech CSE • 2024 Batch",
    rating: 5,
    text: "Great faculty, excellent infrastructure and a vibrant campus life. The hands-on learning experience here is highly valuable.",
    time: "2 weeks ago",
  },
  {
    name: "Anjali Gupta",
    meta: "MBA Analytics • 2025 Batch",
    rating: 4,
    text: "The placement cell is very proactive. Guest lectures from industry professionals happen regularly which provides amazing corporate insight.",
    time: "1 month ago",
  },
];

function ReviewForm({ instituteId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token =
      localStorage.getItem("token") || localStorage.getItem("Token");

    try {
      await axios.post(
        `${API_BASE_URL}/api/institute-reviews/${instituteId}`,
        { rating, review },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      toast.success("Review submitted successfully!");
      setRating(0);
      setReview("");
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while submitting your review.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-100 bg-gray-50 p-4 md:p-5 space-y-4"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Write a Review
          </h3>
          <p className="text-sm text-gray-500">
            Share your experience with this institute.
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              className="p-1"
              aria-label={`${i} star rating`}
            >
              <Star
                size={22}
                className={
                  i <= rating
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
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review"
          rows={1}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 md:min-h-[48px]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function StarRatingsRow({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(parseFloat(rating))
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

function LoadingSkeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

function InstituteHeroSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-3 md:p-4">
      <section className="p-3 md:p-4 w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Gallery Skeleton */}
          <div className="w-full lg:w-[28%] shrink-0 space-y-2.5">
            <LoadingSkeleton className="aspect-[4/3] rounded-xl w-full" />
            <div className="grid grid-cols-3 gap-2">
              <LoadingSkeleton className="aspect-[4/3] rounded-lg" />
              <LoadingSkeleton className="aspect-[4/3] rounded-lg" />
              <LoadingSkeleton className="aspect-[4/3] rounded-lg" />
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
            <div>
              <LoadingSkeleton className="h-8 w-3/4 mb-2" />
              <LoadingSkeleton className="h-5 w-1/2 mb-4" />
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <LoadingSkeleton className="h-6 w-20 rounded-md" />
                <LoadingSkeleton className="h-6 w-24 rounded-md" />
              </div>
              <LoadingSkeleton className="h-5 w-48 mb-6" />
              <LoadingSkeleton className="h-4 w-full mb-2" />
              <LoadingSkeleton className="h-4 w-11/12 mb-6" />
              <div className="flex flex-wrap gap-2.5 mb-6">
                <LoadingSkeleton className="h-7 w-28 rounded-full" />
                <LoadingSkeleton className="h-7 w-32 rounded-full" />
                <LoadingSkeleton className="h-7 w-24 rounded-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2.5 rounded-xl border border-gray-200/60 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <LoadingSkeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="flex-1">
                      <LoadingSkeleton className="h-3 w-12 mb-1.5" />
                      <LoadingSkeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <LoadingSkeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  );
}

const formatLocation = (location) => {
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

const getLocationMapHref = (location) => {
  if (!location) return "";
  if (typeof location === "object" && location.googleMapLink) {
    return location.googleMapLink;
  }
  const label = formatLocation(location);
  return label
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(label)}`
    : "";
};

const getLocationEmbedUrl = (location) => {
  const label = formatLocation(location);
  const query = label || LOCATION_FALLBACK.addressLine1;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

const formatHighlights = (highlights) => {
  if (!highlights || typeof highlights !== "object") return [];

  return Object.entries(highlights).flatMap(([group, values]) => {
    if (!Array.isArray(values)) return [];
    return values.filter(Boolean).map((value) => ({ group, value }));
  });
};

const normalizeCourse = (course, index) => {
  const anims = ["anim-left", "anim-top", "anim-bottom", "anim-right"];
  return {
    ...course,
    anim: anims[index % anims.length],
    title: course?.basicDetails?.courseTitle || course?.title || "Course title",
    institution:
      course?.createdByName ||
      course?.basicDetails?.institution ||
      course?.basicDetails?.createdByName ||
      "Institute",
    duration:
      course?.basicDetails?.courseDuration ||
      course?.basicDetails?.duration ||
      "Duration",
    mode:
      course?.basicDetails?.mode ||
      course?.basicDetails?.learningMode ||
      "Mode",
    location: course?.basicDetails?.locations?.[0] || "Location unavailable",
    locationCount: Array.isArray(course?.basicDetails?.locations)
      ? course.basicDetails.locations.length
      : 0,
    oldPrice:
      course?.priceDetails?.actualPrice != null
        ? `₹ ${Number(course.priceDetails.actualPrice).toLocaleString("en-IN")}`
        : "₹ 0",
    newPrice:
      course?.priceDetails?.currentPrice != null
        ? `₹ ${Number(course.priceDetails.currentPrice).toLocaleString("en-IN")}`
        : "₹ 0",
    rating: course?.rating ? Number(course.rating).toFixed(1) : "N/A",
    image:
      course?.uploadMaterials?.thumbnail ||
      course?.institute?.media?.photos?.[0] ||
      "course.png",
  };
};

const normalizeBlog = (blog) => ({
  ...blog,
  image:
    blog?.image ||
    blog?.thumbnail ||
    blog?.coverImage ||
    blog?.bannerImage ||
    blog?.media?.thumbnail ||
    blog?.media?.image ||
    blog?.uploadMaterials?.thumbnail ||
    "https://placehold.co/600x400?text=No+Image",
  tag: blog?.tag || blog?.category || blog?.type || "News",
  title: blog?.title || blog?.updateTitle || blog?.heading || "Untitled Update",
  description:
    blog?.description || blog?.summary || blog?.content?.slice?.(0, 120) || "",
  date:
    blog?.date ||
    (blog?.createdAt?._seconds
      ? new Date(blog.createdAt._seconds * 1000).toLocaleDateString("en-GB")
      : blog?.createdAt
        ? new Date(blog.createdAt).toLocaleDateString("en-GB")
        : ""),
});

const trackCourseViewAndNavigate = async (course, navigate) => {
  const courseId = course?.courseId || course?._id || course?.id;
  const token = localStorage.getItem("token") || localStorage.getItem("Token");

  if (token && courseId) {
    try {
      await fetch(`${API_BASE_URL}/api/courses/${courseId}/view`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error incrementing course view:", error);
    }
  }

  navigate(`/courseview/${courseId}`);
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function InstituteView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { instituteId: routeInstituteId } = useParams();
  const activeInstituteId =
    routeInstituteId ||
    location.state?.instituteId ||
    localStorage.getItem("selectedInstituteId") ||
    FALLBACK_INSTITUTE_ID;

  // institute-level state
  const [activeSubTab, setActiveSubTab] = useState("Overview");
  const [isSaved, setIsSaved] = useState(false);
  const [loadingInstitute, setLoadingInstitute] = useState(true);
  const [institute, setInstitute] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  // Photo lightbox state — single boolean, no timers, so open/close can
  // never race (see ProfileVerificationLanding for the same pattern).
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // course-cards state (from RecommendedCourses)
  const [visible, setVisible] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentAccessPrompt, setStudentAccessPrompt] = useState({
    open: false,
    actionLabel: "",
  });

  const userRole = (
    localStorage.getItem("Role") ||
    localStorage.getItem("role") ||
    ""
  ).toLowerCase();
  const isStudentRole = userRole === "student";

  const coursesScrollRef = useRef(null);
  const blogsScrollRef = useRef(null);
  const reviewsScrollRef = useRef(null);

  // Trigger entrance animations after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchInstitute = async () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("Token");
      setLoadingInstitute(true);
      setFetchError("");

      try {
        const fetchInstituteDetails = (withAuth = true) =>
          fetch(`${API_BASE_URL}/api/institute/view/${activeInstituteId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(withAuth && token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            },
            signal: controller.signal,
          });

        let response = await fetchInstituteDetails(false);

        if (response.status === 401 && token) {
          response = await fetchInstituteDetails(true);
        }

        if (!response.ok) {
          const listResponse = await fetch(
            `${API_BASE_URL}/api/institute/all`,
            {
              method: "GET",
              signal: controller.signal,
            },
          );

          if (!listResponse.ok) {
            throw new Error(
              `Failed to fetch institute details (${response.status})`,
            );
          }

          const listData = await listResponse.json();
          const instituteList = Array.isArray(listData?.institutes)
            ? listData.institutes
            : Array.isArray(listData?.data)
              ? listData.data
              : Array.isArray(listData)
                ? listData
                : [];
          const matchedInstitute = instituteList.find((item) => {
            const itemId = item?._id || item?.id || item?.instituteId;
            return String(itemId || "") === String(activeInstituteId || "");
          });

          if (!matchedInstitute) {
            throw new Error(
              `Failed to fetch institute details (${response.status})`,
            );
          }

          setInstitute(matchedInstitute);
          return;
        }

        const data = await response.json();
        if (!data?.success || !data?.institute) {
          throw new Error(data?.message || "Unable to load institute details");
        }

        setInstitute(data.institute);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching institute:", error);
          setFetchError(error.message || "Error fetching institute data");
          setInstitute(null);
        }
      } finally {
        setLoadingInstitute(false);
      }
    };

    fetchInstitute();
    return () => controller.abort();
  }, [activeInstituteId]);

  useEffect(() => {
    if (!activeInstituteId) return;

    const controller = new AbortController();
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/updates/get-updateby-instituteid/${activeInstituteId}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setBlogs(data.data.map(normalizeBlog));
        }
      } catch (error) {
        if (error.name !== "AbortError")
          console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
    return () => controller.abort();
  }, [activeInstituteId]);

  useEffect(() => {
    if (!activeInstituteId) return;

    const controller = new AbortController();
    const fetchReviews = async () => {
      try {
        const reviewsData = await getInstituteReviews(activeInstituteId);
        const reviewList = reviewsData.data || reviewsData.reviews;
        if (reviewsData.success && Array.isArray(reviewList)) {
          setReviews(reviewList);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching reviews:", error);
        }
      }
    };
    fetchReviews();
    return () => controller.abort();
  }, [activeInstituteId, reviewCount]);

  useEffect(() => {
    setSelectedLocationIndex(0);
  }, [institute?._id]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("Token");
      setLoadingCourses(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/courses/`, {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch courses (${response.status})`);
        }

        const data = await response.json();
        if (!data?.success || !Array.isArray(data?.data)) {
          throw new Error(data?.message || "Unable to load courses");
        }

        setCourses(
          data.data.map((course, index) => normalizeCourse(course, index)),
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching courses:", error);
          setCourses([]);
        }
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
    return () => controller.abort();
  }, []);

  // Close context menu on outside click or scroll
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", close, true);
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleReviewSubmitted = () => {
    setReviewCount((c) => c + 1);
  };

  const displayReviews = reviews.length > 0 ? reviews : USER_REVIEWS;

  const totalReviews = displayReviews.length;
  const averageRating =
    totalReviews > 0
      ? displayReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        totalReviews
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = displayReviews.filter(
      (r) => Math.round(r.rating) === stars,
    ).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  const handleNextReview = () =>
    setCurrentReviewIdx((p) => (p + 1) % displayReviews.length);

  const handlePrevReview = () =>
    setCurrentReviewIdx(
      (p) => (p - 1 + displayReviews.length) % displayReviews.length,
    );

  const featuredReview = displayReviews[currentReviewIdx];
  const featuredReviewerName =
    featuredReview?.studentName || featuredReview?.name || "Anonymous";
  const featuredReviewInitials =
    featuredReviewerName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "S";
  const featuredReviewDate = featuredReview?.createdAt?._seconds
    ? new Date(
        featuredReview.createdAt._seconds * 1000,
      ).toLocaleDateString("en-GB")
    : featuredReview?.time || "";
  const featuredReviewText = featuredReview?.review || featuredReview?.text || "";

  const scrollCourses = (direction) => {
    if (coursesScrollRef.current) {
      coursesScrollRef.current.scrollBy({
        left: direction * 320,
        behavior: "smooth",
      });
    }
  };

  const scrollToReviews = () => {
    reviewsScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollBlogs = (direction) => {
    if (blogsScrollRef.current) {
      blogsScrollRef.current.scrollBy({
        left: direction * 280,
        behavior: "smooth",
      });
    }
  };

  const toggleMenu = (course, e) => {
    e.stopPropagation();
    const id = course?.courseId || course?._id || course?.id || course;
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const menuHeight = 260;
    const menuWidth = 224;
    const spaceBelow = window.innerHeight - rect.bottom;

    const top =
      (spaceBelow > menuHeight ? rect.bottom + 4 : rect.top - menuHeight - 4) +
      window.scrollY;
    const left =
      Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8) +
      window.scrollX;

    setMenuPos({ top, left });
    setSelectedCourse(course);
    setOpenMenuId(id);
  };

  const handleEnroll = (course) => {
    requireStudentAccess("enroll", () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      localStorage.setItem("checkoutCourse", JSON.stringify(course));
      const courseId = course?.courseId || course?._id;
      if (courseId) {
        navigate(`/checkout/${courseId}`);
      } else {
        navigate("/checkout?step=payment");
      }
    });
  };

  const getInstituteRouteForCourse = (course) => {
    const instituteId =
      course?.institute?.instituteId ||
      course?.institute?.id ||
      course?.institute?._id ||
      course?.instituteId ||
      course?.basicDetails?.instituteId ||
      course?.createdById ||
      course?.basicDetails?.createdById;

    return instituteId
      ? `/instituteview/${instituteId}`
      : `/instituteview/${activeInstituteId}`;
  };

  const requireStudentAccess = (actionLabel, action) => {
    if (isStudentRole) {
      action?.();
      return;
    }

    setStudentAccessPrompt({ open: true, actionLabel });
  };

  const closeStudentAccessPrompt = () =>
    setStudentAccessPrompt({ open: false, actionLabel: "" });

  const confirmStudentAccessPrompt = () => {
    closeStudentAccessPrompt();
    localStorage.removeItem("token");
    localStorage.removeItem("Token");
    localStorage.removeItem("Role");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/get-started/login/student");
  };

  const copyCourseLink = () => {
    const link = `${window.location.origin}/courseview/${selectedCourse?.courseId || selectedCourse?._id || ""}`;
    navigator.clipboard?.writeText(link);
    toast.success("Course link copied to clipboard");
  };

  const handleEnquireCourse = () => {
    requireStudentAccess("send an enquiry", async () => {
      try {
        const res = await sendEnquiry({ courseId: selectedCourse?.courseId });
        if (!res.success) {
          toast.error(res.message || "Unable to send enquiry");
          return;
        }
        navigate("/chat", { state: { conversationId: res.data.conversationId } });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Unable to send enquiry",
        );
      }
    });
  };

  const handleEnquireInstitute = () => {
    requireStudentAccess("send an enquiry", async () => {
      try {
        const res = await sendEnquiry({ instituteId: activeInstituteId });
        if (!res.success) {
          toast.error(res.message || "Unable to send enquiry");
          return;
        }
        navigate("/chat", { state: { conversationId: res.data.conversationId } });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || error?.message || "Unable to send enquiry",
        );
      }
    });
  };

  const handleCompare = () => {
    requireStudentAccess("compare courses", () => {
      (async () => {
        const token = localStorage.getItem("token");
        try {
          await addToCompare(selectedCourse.courseId, token);
        } catch (err) {
          console.error(err);
        } finally {
          navigate("/dashboard/compare", {
            state: { course1: selectedCourse },
          });
        }
      })();
    });
  };

  const handleAddToCart = async () => {
    requireStudentAccess("add this course to your learn list", async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await addInCart(selectedCourse.courseId, token);

        window.dispatchEvent(new Event("cart-updated"));

        toast.success(data.message || "Course added to cart successfully");
      } catch (error) {
        toast.error(error);
        toast.error("Already added to cart!");
        navigate("/cart");
      }
    });
  };

  const menuItems = [
    { label: "Compare", icon: <Scale size={16} />, onClick: handleCompare },
    {
      label: "Enquiry",
      icon: <MessageSquare size={16} />,
      onClick: handleEnquireCourse,
    },
    {
      label: "Add to Learn List",
      icon: <Heart size={16} />,
      onClick: handleAddToCart,
    },
    {
      label: "Notify When Active",
      icon: <Bell size={16} />,
      onClick: () =>
        requireStudentAccess("enable notifications", () =>
          navigate("/notifications"),
        ),
    },
    { label: "Share", icon: <Share2 size={16} />, onClick: copyCourseLink },
    {
      label: "Similar Courses",
      icon: <BookOpen size={16} />,
      onClick: () => navigate("/updates"),
    },
  ];

  const instituteName = institute?.name || "Canvade Institute of Technology";
  const tagline =
    institute?.tagline || "Empowering Careers, Transforming Futures";
  const description =
    institute?.description ||
    "Canvade Institute of Technology is committed to academic excellence, practical learning and holistic development. We offer industry-aligned programs designed to prepare students for tomorrow's challenges.";
  const establishYear = institute?.establishDate
    ? new Date(institute.establishDate).getFullYear()
    : "2012";
  // const rating = institute?.rating || 4.6;
  const locationOptions =
    Array.isArray(institute?.locations) && institute.locations.length
      ? institute.locations
      : [LOCATION_FALLBACK];
  const selectedLocation =
    locationOptions[
      Math.min(selectedLocationIndex, locationOptions.length - 1)
    ] || LOCATION_FALLBACK;
  const locationLabel =
    formatLocation(selectedLocation) ||
    `${LOCATION_FALLBACK.addressLine1}, ${LOCATION_FALLBACK.addressLine2}`;
  const locationMapHref = getLocationMapHref(selectedLocation);
  const locationEmbedUrl = getLocationEmbedUrl(selectedLocation);
  const highlightItems = formatHighlights(institute?.highlights);
  const courseSkeletonCards = Array.from({ length: 4 });
  const instituteCourses = courses.filter((course) => {
    const courseInstituteId =
      course?.instituteId ||
      course?.institute?.instituteId ||
      course?.institute?.id ||
      course?.institute?._id;

    return String(courseInstituteId || "") === String(activeInstituteId || "");
  });

  // ── Gallery / lightbox data ─────────────────────────────────────────────
  // Real images from the API: institute.media.logo is the big hero shot,
  // institute.media.photos is the gallery strip. Both feed the SAME
  // lightboxImages array so whatever thumbnail you click is exactly what
  // opens (hero = index 0, then each photo in order).
  const mainImage = institute?.media?.photos?.[0] || FALLBACK_HERO_IMAGE;
  const photos = Array.isArray(institute?.media?.photos)
    ? institute.media.photos
    : [];
  const lightboxImages = [mainImage, ...photos];
  const galleryImages = photos.slice(0, 2);
  const hasMorePhotos = photos.length > 2;
  const blurredThumbnail = hasMorePhotos ? photos[2] : null;
  const remainingPhotos = Math.max(0, photos.length - 2);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const showNextPhoto = () =>
    setLightboxIndex((prev) =>
      lightboxImages.length ? (prev + 1) % lightboxImages.length : 0,
    );

  const showPrevPhoto = () =>
    setLightboxIndex((prev) =>
      lightboxImages.length
        ? (prev - 1 + lightboxImages.length) % lightboxImages.length
        : 0,
    );

  // Only close when the click lands directly on the backdrop itself, never
  // when it bubbles up from a child (image, buttons, counter, etc).
  const handleLightboxBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  };

  const handleLightboxCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  };

  // Keyboard navigation while the lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNextPhoto();
      if (e.key === "ArrowLeft") showPrevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, lightboxImages.length]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased pt-20">
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="w-full py-2.5">
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4 flex-wrap">
          <div />
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <Share2 size={13} /> Share
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold transition-colors ${
                isSaved
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Bookmark size={13} fill={isSaved ? "currentColor" : "none"} />{" "}
              Save
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <AlertCircle size={13} /> Report
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1700px] w-full mx-auto px-4 md:px-8 lg:px-12 py-6 flex-1 space-y-4">
        {/* ── Institute Hero Card ── */}
        {loadingInstitute ? (
          <InstituteHeroSkeleton />
        ) : fetchError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-red-800">
                  Institute details could not be loaded
                </h2>
                <p className="mt-1 text-sm leading-relaxed">{fetchError}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-3 md:p-4">
            <section className="p-3 md:p-4 w-full">
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                {/* Gallery */}
                <div className="w-full lg:w-[28%] shrink-0 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden group bg-slate-100 border border-gray-100 w-full text-left p-0"
                  >
                    <img
                      src={mainImage}
                      alt={instituteName}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-md shadow flex items-center gap-1 pointer-events-none">
                      <AlertCircle size={15} />{" "}
                      {institute?.status === "pending"
                        ? "Pending Verification"
                        : "Verified Institute"}
                    </span>
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.map((photo, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => openLightbox(idx + 1)}
                        className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-100 bg-slate-100 p-0"
                      >
                        <img
                          src={photo}
                          alt={`${instituteName} photo ${idx + 1}`}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                      </button>
                    ))}
                    {blurredThumbnail ? (
                      <button
                        type="button"
                        onClick={() => openLightbox(3)}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-100 bg-slate-900 cursor-pointer p-0"
                      >
                        <img
                          src={blurredThumbnail}
                          alt={`${instituteName} more photos`}
                          className="w-full h-full object-cover opacity-40 pointer-events-none"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold pointer-events-none">
                          +{remainingPhotos}
                        </div>
                      </button>
                    ) : (
                      galleryImages.length < 3 &&
                      Array.from({
                        length:
                          3 -
                          galleryImages.length -
                          (galleryImages.length < 2 ? 0 : 0),
                      }).map((_, i) => null)
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 w-400">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                        {instituteName}
                      </h1>
                      <BadgeCheck
                        size={28}
                        className=" text-white fill-[#12B886] flex-shrink-0"
                      />
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-4">
                      {tagline}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="bg-slate-50 border border-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                        Est. {establishYear}
                      </span>
                      <span className="bg-slate-50 border border-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">
                        {highlightItems[0]?.value || "Institute"}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-2 mb-4 cursor-pointer w-fit"
                      onClick={scrollToReviews}
                    >
                      <span className="text-sm font-bold text-slate-800">
                        {averageRating.toFixed(1)}
                      </span>
                      <StarRatingsRow rating={averageRating} size={15} />
                      <span className="text-xs text-gray-400 font-medium hover:underline">
                        ({totalReviews} Review{totalReviews !== 1 ? "s" : ""})
                      </span>
                    </div>

                    <p className="text-[13px] text-gray-600 leading-relaxed max-w-[800px] mb-6">
                      {description}
                    </p>

                    <div className="flex flex-wrap gap-2.5 mb-6">
                      {highlightItems.slice(0, 6).map(({ group, value }) => (
                        <span
                          key={`${group}-${value}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold"
                        >
                          <ShieldCheck size={13} />
                          {value}
                        </span>
                      ))}
                    </div>

                    <div className="inline-grid grid-cols-2 md:grid-cols-2 gap-4 p-2.5 bg-white rounded-xl border border-gray-200/60 mb-6">
                      {[
                        {
                          Icon: Building,
                          label: "Institute Type",
                          val: "Private",
                        },
                        {
                          Icon: Award,
                          label: "Accreditation",
                          val: highlightItems[1]?.value || "NAAC A Grade",
                        },
                        // {
                        //   Icon: Users,
                        //   label: "Students Enrolled",
                        //   val: institute?.viewerIds?.length ? `${institute.viewerIds.length}+` : "2,500+",
                        // },
                        // { Icon: GraduationCap, label: "Faculty", val: "120+" },
                      ].map(({ Icon, label, val }) => (
                        <div key={label} className="flex items-center gap-3.5">
                          <Icon size={18} className="text-gray-600 shrink-0" />
                          <div>
                            <p className="text-[11px] text-gray-500 font-medium mb-1">
                              {label}
                            </p>
                            <p className="text-[13px] font-medium text-slate-800">
                              {val}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleEnquireInstitute}
                      className="px-10 py-2.5 bg-[#007965] hover:bg-[#006252] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── Content Sections ── */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 md:p-6 lg:p-8 space-y-6">
          {/* ════ Popular Courses ════ */}
          <section className="bg-slate-50 rounded-xl border border-gray-100 p-5 space-y-4">
            {/* Header — matches Latest Blogs style */}
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Popular Courses
              </h2>
              <div className="flex items-center gap-3">
                <button className="text-emerald-700 font-semibold text-xs sm:text-sm flex items-center gap-1 hover:underline">
                  View All Courses <ChevronRight size={14} />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollCourses(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#16C79A] bg-white text-[#12B886] transition-all duration-200 hover:bg-emerald-50 active:scale-95"
                    aria-label="Previous courses"
                  >
                    <ChevronLeft className="h-5 w-5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCourses(1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#16C79A] bg-[#12B886] text-white transition-all duration-200 hover:bg-[#0EA678] active:scale-95"
                    aria-label="Next courses"
                  >
                    <ChevronRight className="h-5 w-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              {/* Cards scroll container */}
              <div
                ref={coursesScrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar px-1 pb-2 snap-x snap-mandatory"
              >
                {loadingCourses ? (
                  courseSkeletonCards.map((_, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 snap-start cursor-pointer group w-[82vw] sm:w-[44vw] md:w-[300px] lg:w-[280px] xl:w-[300px] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-pulse"
                    >
                      <div className="p-2 pb-0">
                        <div className="relative h-44 w-full overflow-hidden rounded-t-[8px] rounded-bl-[15px] bg-gray-200" />
                      </div>
                      <div className="p-4 pt-3">
                        <div className="h-6 w-3/4 rounded bg-gray-200 mb-2" />
                        <div className="h-4 w-4/5 rounded bg-gray-200 mb-3" />
                        <div className="flex items-stretch gap-4 mb-3 border-b border-gray-100 pb-3">
                          <div className="h-4 w-24 rounded bg-gray-200" />
                          <div className="h-4 w-20 rounded bg-gray-200 ml-auto" />
                        </div>
                        <div className="h-4 w-3/4 rounded bg-gray-200 mb-4" />
                        <div className="flex items-center justify-between gap-3">
                          <div className="h-10 w-24 rounded-md bg-gray-200" />
                          <div className="h-9 w-24 rounded-md bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : instituteCourses.length === 0 ? (
                  <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
                    No courses found for this institute.
                  </div>
                ) : (
                  instituteCourses.map((item, index) => (
                    <div
                      key={item.courseId || item._id || index}
                      onClick={() => trackCourseViewAndNavigate(item, navigate)}
                      className={`flex-shrink-0 snap-start cursor-pointer group w-[82vw] sm:w-[44vw] md:w-[300px] lg:w-[280px] xl:w-[300px] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-500 hover:shadow-xl ${visible ? item.anim : "opacity-0 translate-y-10"}`}
                    >
                      <div className="p-2 pb-0">
                        <div className="relative">
                          <div className="relative h-44 w-full overflow-hidden rounded-t-[8px] rounded-bl-[15px]">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 right-0 bg-white pl-2 rounded-tl-lg flex items-center gap-2 h-8">
                              <span className="bg-[#FFC107] text-[9px] text-white px-2 py-0.5 rounded-md capitalize">
                                Student's Choice
                              </span>
                              <div className="flex items-center gap-0.5 pr-3">
                                <span className="text-[#FFC107] text-sm">
                                  ★
                                </span>
                                <span className="text-[11px] text-gray-700">
                                  {item.rating}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Institute logo avatar */}
                          <div
                            className="absolute bottom-2 -left-0.5 translate-y-1/4 w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white z-10"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(getInstituteRouteForCourse(item));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                navigate(getInstituteRouteForCourse(item));
                              }
                            }}
                          >
                            <img
                              src={
                                item?.institute?.media?.logo || "workshop.png"
                              }
                              alt="Logo"
                              className="w-full h-full mx-auto p-0.5 object-cover rounded-full scale-200"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-3">
                        {/* Institution badge */}
                        <div
                          className="flex items-center gap-1 bg-[#f1f5f9] px-3.5 py-1 rounded-[6px] mb-2 overflow-hidden cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(getInstituteRouteForCourse(item));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              navigate(getInstituteRouteForCourse(item));
                            }
                          }}
                        >
                          <span className="text-[10px] font-medium text-[#2563eb] uppercase tracking-tight truncate min-w-0">
                            {item.institute?.name}
                          </span>
                          <BadgeCheck className="w-4 h-4 text-white fill-[#3b82f6] flex-shrink-0" />
                        </div>

                        <h3 className="text-base font-medium text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[40px]">
                          {item.title}
                        </h3>

                        <div className="flex items-stretch text-gray-700 text-[11px] mb-2 border-b border-gray-200">
                          <div className="flex items-center gap-1.5 font-medium pb-3 pr-4">
                            <Clock3 className="w-4 h-4 text-gray-700" />
                            <span>{item.duration}</span>
                          </div>
                          <div className="flex items-center gap-2.5 font-medium border-l border-gray-300 pl-4 md:pl-6 pb-3 ml-auto">
                            <BookOpen className="w-4 h-4 text-gray-700" />
                            <span>{item.mode}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-gray-600 text-[12px] mb-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-gray-600" />
                          <span className="truncate">
                            {item.location}{" "}
                            {item.locationCount > 1 && (
                              <span className="text-gray-800 ml-1">
                                ({item.locationCount - 1} More)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="bg-[#F6F6F6] px-2 py-1 rounded-md space-y-0.5">
                            <p className="text-[15px] font-semibold text-gray-900 leading-tight">
                              {item.newPrice}
                            </p>
                            <p className="text-[10px] text-[#303030] line-through">
                              {item.oldPrice}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEnroll(item);
                              }}
                              className="bg-[#E5E5E5] hover:bg-emerald-600 hover:text-white text-gray-700 text-[12px] font-semibold px-3 md:px-4 py-2 rounded-md flex items-center gap-2 transition-all"
                            >
                              Enroll
                              <span className="hidden sm:inline-flex w-4 h-4 rounded-md bg-[#484848] text-white items-center justify-center align-middle">
                                <ArrowRight className="w-2.5 h-2.5" />
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => toggleMenu(item, e)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  toggleMenu(item, e);
                              }}
                              className="p-1 rounded-full hover:bg-gray-100"
                              aria-label="More options"
                            >
                              <MoreVertical className="w-5 h-5 text-[#707070]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* ════ Latest Blogs ════ */}
          <section className="lg:col-span-2 overflow-hidden rounded-xl border border-gray-100 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Latest Blogs
              </h2>
              <div className="flex items-center gap-3">
                <button className="text-emerald-700 font-semibold text-xs sm:text-sm flex items-center gap-1 hover:underline">
                  View All Blogs <ChevronRight size={14} />
                </button>
                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => scrollBlogs(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#16C79A] bg-white text-[#12B886] transition-all duration-200 hover:bg-emerald-50 active:scale-95"
                    aria-label="Previous blogs"
                  >
                    <ChevronLeft className="h-5 w-5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollBlogs(1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#16C79A] bg-[#12B886] text-white transition-all duration-200 hover:bg-[#0EA678] active:scale-95"
                    aria-label="Next blogs"
                  >
                    <ChevronRight className="h-5 w-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => scrollBlogs(-1)}
                className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#16C79A] bg-white text-[#12B886] shadow-md transition-all duration-200 hover:bg-emerald-50 active:scale-95 sm:hidden"
                aria-label="Previous blogs"
              >
                <ChevronLeft className="h-5 w-5 stroke-[3]" />
              </button>

              <div
                ref={blogsScrollRef}
                className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
              >
                {blogs.map((blog, idx) => (
                  <div
                    key={idx}
                    className="w-[82vw] flex-shrink-0 snap-start sm:w-[44vw] md:w-[calc((100%_-_20px)/2)] lg:w-[calc((100%_-_60px)/4)]"
                  >
                    <UpdateCard {...blog} />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollBlogs(1)}
                className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#16C79A] bg-[#12B886] text-white shadow-md transition-all duration-200 hover:bg-[#0EA678] active:scale-95 sm:hidden"
                aria-label="Next blogs"
              >
                <ChevronRight className="h-5 w-5 stroke-[3]" />
              </button>
            </div>
          </section>

          {/* ════ Location ════ */}
          <section className="rounded-xl border border-gray-100 bg-slate-50 p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Location
              </h2>
              {locationOptions.length > 1 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  {locationOptions.length} Branches
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 flex flex-col gap-4 rounded-xl border border-gray-200/60 bg-white p-4 lg:h-[320px]">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <MapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      {selectedLocation.city || instituteName}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                      {locationLabel}
                    </p>
                  </div>
                </div>

                {locationOptions.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {locationOptions.map((loc, index) => (
                      <button
                        key={`${formatLocation(loc)}-${index}`}
                        type="button"
                        onClick={() => setSelectedLocationIndex(index)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                          selectedLocationIndex === index
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-slate-50 text-slate-600 hover:bg-gray-100"
                        }`}
                      >
                        {loc.city || loc.addressLine1 || `Location ${index + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "City", value: selectedLocation.city },
                    { label: "State", value: selectedLocation.state },
                    { label: "Country", value: selectedLocation.country },
                    {
                      label: "Pincode",
                      value: selectedLocation.zipCode || selectedLocation.zip,
                    },
                  ]
                    .filter((item) => item.value)
                    .map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-gray-100 bg-slate-50 px-3 py-2"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          {item.label}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-bold text-slate-800">
                          {item.value}
                        </p>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => window.open(locationMapHref, "_blank")}
                  className="mt-auto flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-gray-100"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Google_Maps_pin.svg"
                    alt="Google Maps"
                    className="h-4 w-4"
                  />
                  Open in Google Maps
                </button>
              </div>

              <div className="lg:col-span-7">
                <div className="relative h-[260px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm lg:h-[320px]">
                  <iframe
                    title="Institute Location"
                    src={locationEmbedUrl}
                    className="absolute inset-0 w-full border-0"
                    style={{
                      height: "calc(100% + 30px)",
                      marginTop: "-10px",
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center -translate-y-5">
                      <MapPin
                        size={28}
                        className="text-red-500 fill-red-500 drop-shadow-md"
                      />
                      <span className="text-[11px] font-semibold text-red-600 whitespace-nowrap bg-white/80 px-1.5 py-0.5 rounded mt-0.5">
                        {instituteName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ════ Reviews & Ratings ════ */}
          <section
            ref={reviewsScrollRef}
            className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Reviews &amp; Ratings
              </h2>
              {/* <button className="text-emerald-600 font-semibold text-xs sm:text-sm flex items-center gap-1 hover:underline">
                View All Reviews <ChevronRight size={14} />
              </button> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 pb-5 border-b border-gray-100">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-center flex flex-col justify-center">
                <p className="text-5xl font-black text-slate-900">
                  {averageRating.toFixed(1)}
                </p>
                <div className="flex justify-center mt-2">
                  <StarRatingsRow rating={averageRating} size={18} />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Based on {totalReviews} reviews
                </p>
              </div>
              <div className="w-full space-y-3 self-center">
                {ratingDistribution.map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 w-3">
                      {row.stars}
                    </span>
                    <Star
                      size={10}
                      className="text-amber-400 fill-amber-400 shrink-0"
                    />
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Student Reviews
              </h3>
              {totalReviews > 0 ? (
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
                        <StarRatingsRow
                          rating={featuredReview?.rating}
                          size={13}
                        />
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
                          onClick={handlePrevReview}
                          aria-label="Previous review"
                          className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 hover:text-emerald-700 transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextReview}
                          aria-label="Next review"
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

            <ReviewForm
              instituteId={activeInstituteId}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </section>

          {/* ════ Trust Badges ════ */}
          <div className="max-w-[1200px] mx-auto w-full px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  Icon: ShieldCheck,
                  title: "Verified Institutes",
                  desc: "Connect with genuine and trusted institutions.",
                },
                {
                  Icon: Lock,
                  title: "Safe & Reliable",
                  desc: "Your personal details and payments are handled securely.",
                },
                {
                  Icon: HelpCircle,
                  title: "Free for Students",
                  desc: "Explore courses and send enquiries at no cost.",
                },
                {
                  Icon: Headphones,
                  title: "Student Support",
                  desc: "Get guidance and support whenever you need help.",
                },
              ].map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 p-2.5 shadow-2xs"
                >
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 rounded-full">
                    <Icon size={18} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed mb-1">
                      {title}
                    </p>
                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Context Menu Portal ── */}
      {openMenuId !== null &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: menuPos.top,
              left: menuPos.left,
              zIndex: 9999,
            }}
            className="w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map((menuItem) => (
              <button
                key={menuItem.label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  menuItem.onClick();
                  setOpenMenuId(null);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                {menuItem.icon}
                <span>{menuItem.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}

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

      {/* ── Photo Lightbox ──────────────────────────────────────────────────
          Always mounted; visibility + animation driven purely by the
          lightboxOpen boolean via CSS classes (no timers, no race). */}
      <div
        className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 p-4 transition-opacity duration-300 ease-out ${
          lightboxOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleLightboxBackdropClick}
        aria-hidden={!lightboxOpen}
      >
        <button
          type="button"
          onClick={handleLightboxCloseClick}
          className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Close gallery"
        >
          <X className="h-5 w-5 pointer-events-none" />
        </button>

        <div className="absolute top-5 left-5 z-20 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
          {lightboxIndex + 1} / {lightboxImages.length}
        </div>

        {lightboxImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrevPhoto();
            }}
            className="absolute left-4 md:left-8 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6 pointer-events-none" />
          </button>
        )}

        <div className="relative max-w-5xl w-full flex items-center justify-center pointer-events-none">
          <div
            className={`transition-all duration-300 ease-out ${
              lightboxOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            {lightboxOpen && lightboxImages[lightboxIndex] && (
              <img
                key={lightboxIndex}
                src={lightboxImages[lightboxIndex]}
                alt={`Photo ${lightboxIndex + 1}`}
                className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
            )}
          </div>
        </div>

        {lightboxImages.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNextPhoto();
            }}
            className="absolute right-4 md:right-8 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6 pointer-events-none" />
          </button>
        )}
      </div>
    </div>
  );
}
