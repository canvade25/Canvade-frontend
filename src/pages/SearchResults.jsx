/**
 * SearchResults Component
 * Displays search results from both navbar and hero banner searches
 * Industry-standard implementation matching existing design system
 */

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  Clock,
  MapPin,
  BookOpen,
  BadgeCheck,
  MoreVertical,
  ArrowLeftRight,
  Navigation,
  ShoppingCart,
  ListPlus,
  Users,
  Scale,
  MessageSquare,
  Heart,
  Bell,
  Share2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CourseCard from "../components/Home/CourseCard";
import {
  InstituteCard,
  normalizeInstitute,
  getInstituteItems,
} from "../components/Home/InstituteRecommendation";
import { sendEnquiry } from "../../api/enquireApi";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

const getCourseItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.courses)) return data.data.courses;
  if (Array.isArray(data?.data?.course)) return data.data.course;
  if (Array.isArray(data?.data?.results)) return data.data.results;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.courses)) return data.courses;
  if (Array.isArray(data?.course)) return data.course;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const searchCoursesAPI = async (query, filters) => {
  let response;
  if (filters.category) {
    response = await fetch(
      `${API_BASE_URL}/api/search/category/${filters.category}`,
    );
  } else {
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
      params.set("search", query);
    }
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value && key !== "q") params.set(key, value);
    });
    response = await fetch(
      `${API_BASE_URL}/api/search/get${params.toString() ? `?${params}` : ""}`,
    );
  }

  if (!response.ok) throw new Error("Unable to fetch search results");

  const data = await response.json();
  return getCourseItems(data);
};

// Used by the "Find Your Nearest" cards on the Categories page — fetches
// institutes of a given type, sorted by distance when lat/lng is available,
// or a random order when it isn't (geolocation denied/unsupported).
const searchNearestInstitutesAPI = async ({ type, lat, lng }) => {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (lat && lng) {
    params.set("lat", lat);
    params.set("lng", lng);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/institute/all${params.toString() ? `?${params}` : ""}`,
  );
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error("Unable to fetch nearby institutes");
  }

  const data = await response.json();
  return getInstituteItems(data);
};

/**
 * Filter configuration
 */
const FILTER_CONFIG = {
  searchFor: {
    label: "Type",
    options: ["Institutes", "Schools", "Academies", "Colleges"],
    icon: "🏛️",
  },
  feeRange: {
    label: "Fee Range",
    options: [
      "Under Rs. 5,000",
      "Rs. 5,000 - 10,000",
      "Rs. 10,000 - 20,000",
      "Rs. 20,000 - 50,000",
      "Rs. 50,000 - 1,00,000",
      "Above Rs. 1,00,000",
    ],
    icon: "₹",
  },
  learningMode: {
    label: "Learning Mode",
    options: ["Online", "Onsite", "Hybrid"],
    icon: "⚡",
  },
  courseDuration: {
    label: "Duration",
    options: [
      "Less than 1 month",
      "1-3 months",
      "3-6 months",
      "More than 6 months",
      "1 year+"
    ],
    icon: "⏱️",
  },
  category: {
    label: "Category",
    options: [], // This will be populated by the URL param, not shown in UI
  },
};

/**
 * Active Filters Display Component
 */
function ActiveFilters({ filters, onRemoveFilter }) {
  const displayFilters = Object.entries(filters)
    .filter(
      ([key, value]) =>
        value && key !== "q" && FILTER_CONFIG[key]?.options.length > 0,
    )
    .map(([key, value]) => ({
      key,
      value,
      label: FILTER_CONFIG[key]?.label || key,
    }));

  if (displayFilters.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">Active Filters</p>
      <div className="flex flex-wrap gap-2">
        {displayFilters.map(({ key, value, label }) => (
          <button
            key={`${key}-${value}`}
            onClick={() => onRemoveFilter(key)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-md focus-visible:outline-2 focus-visible:outline-emerald-600"
            aria-label={`Remove filter: ${label}`}
          >
            {value}
            <X size={16} className="hover:scale-110 transition-transform" />
          </button>
        ))}
        <button
          onClick={() => onRemoveFilter("all")}
          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-gray-400"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

/**
 * Filter Sidebar Component
 */
function FilterSidebar({ filters, onFilterChange, isOpen, onClose }) {
  const [expandedSections, setExpandedSections] = useState(
    Object.keys(FILTER_CONFIG).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    ),
  );

  const toggleSection = useCallback((sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-80 transform overflow-y-auto bg-white shadow-xl transition-transform duration-300 md:relative md:top-auto md:z-0 md:max-h-[calc(100vh-7rem)] md:w-full md:transform-none md:rounded-2xl md:border md:border-slate-200 md:bg-white md:p-0 md:shadow-sm no-scrollbar ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-5">
          <div className="flex items-center justify-between md:hidden mb-2">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
              aria-label="Close filters"
            >
              <X size={24} />
            </button>
          </div>
          <div className="hidden md:block">
            <h3 className="text-xl font-bold tracking-tight text-slate-950">
              Filters
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Refine courses by type, fee and mode.
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-5">
            {Object.entries(FILTER_CONFIG)
              .filter(([, config]) => config.options.length > 0)
              .map(([key, config]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"
                >
                  <button
                    onClick={() => toggleSection(key)}
                    className="flex w-full items-center justify-between text-left font-bold text-slate-900 transition-colors hover:text-emerald-700"
                    aria-expanded={expandedSections[key]}
                  >
                    <span className="flex items-center gap-2 text-[15px]">
                      {config.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform text-gray-400 ${expandedSections[key] ? "rotate-180 text-emerald-600" : ""}`}
                    />
                  </button>

                  {expandedSections[key] && (
                    <div className="mt-3 space-y-2">
                      {config.options.map((option) => (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                            filters[key] === option
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : "border-white bg-white text-slate-600 hover:border-emerald-100 hover:text-emerald-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={filters[key] === option}
                            onChange={() => onFilterChange(key, option)}
                            className="h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600"
                            aria-label={`Filter by ${option}`}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </aside>
    </>
  );
}

/**
 * Main SearchResults Component
 */
export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userRole = (localStorage.getItem("Role") || localStorage.getItem("role") || "").toLowerCase();
const isStudentRole = userRole === "student";
const [openMenuId, setOpenMenuId] = useState(null);
const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
const [selectedCourse, setSelectedCourse] = useState(null);
const [studentAccessPrompt, setStudentAccessPrompt] = useState({
  open: false,
  actionLabel: "",
  action: null,
});

  const filters = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      searchFor: searchParams.get("searchFor") || "",
      feeRange: searchParams.get("feeRange") || "",
      learningMode: searchParams.get("learningMode") || "",
      courseDuration: searchParams.get("courseDuration") || "",
      category: searchParams.get("category") || "",
      nearest: searchParams.get("nearest") || "",
      type: searchParams.get("type") || "",
      lat: searchParams.get("lat") || "",
      lng: searchParams.get("lng") || "",
    }),
    [searchParams],
  );

  const isNearestInstituteMode = filters.nearest === "true" && Boolean(filters.type);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const results = isNearestInstituteMode
          ? await searchNearestInstitutesAPI(filters)
          : await searchCoursesAPI(filters.q, filters);
        setCourses(results);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [filters, isNearestInstituteMode]);

  useEffect(() => {
  const handleClickOutside = () => setOpenMenuId(null);
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

useEffect(() => {
  const handleScroll = () => setOpenMenuId(null);
  window.addEventListener("scroll", handleScroll, true);
  return () => window.removeEventListener("scroll", handleScroll, true);
}, []);

const trackCourseViewAndNavigate = async (course) => {
  const courseId = course?.courseId || course?._id || course?.id;
  const token = localStorage.getItem("token") || localStorage.getItem("Token");

  if (token && courseId) {
    try {
      await fetch(`${API_BASE_URL}/api/courses/${courseId}/view`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error incrementing course view:", error);
    }
  }

  navigate(`/courseview/${courseId}`);
};

const getInstituteRoute = (course) => {
  const instituteId =
    course?.institute?.instituteId ||
    course?.institute?.id ||
    course?.institute?._id ||
    course?.instituteId ||
    course?.basicDetails?.instituteId;

  return instituteId ? `/instituteview/${instituteId}` : "/instituteview";
};

const trackInstituteViewAndNavigate = async (course) => {
  const instituteId =
    course?.institute?.instituteId ||
    course?.institute?.id ||
    course?.institute?._id ||
    course?.instituteId ||
    course?.basicDetails?.instituteId;
  const token = localStorage.getItem("token") || localStorage.getItem("Token");

  if (token && instituteId) {
    try {
      await fetch(`${API_BASE_URL}/api/institute/${instituteId}/views`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error incrementing institute view:", error);
    }
  }

  navigate(getInstituteRoute(course));
};

const toggleMenu = (course, e) => {
  e.stopPropagation();
  if (openMenuId === course.courseId) {
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
  setOpenMenuId(course.courseId);
};

const requireStudentAccess = (actionLabel, action) => {
  if (isStudentRole) {
    action?.();
    return;
  }

  setStudentAccessPrompt({ open: true, actionLabel, action });
};

const closeStudentAccessPrompt = () => {
  setStudentAccessPrompt({ open: false, actionLabel: "", action: null });
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

const copyCourseLink = () => {
  navigator.clipboard?.writeText(`${window.location.origin}/courseview`);
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
        navigate("/dashboard/compare", { state: { course1: selectedCourse } });
      }
    })();
  });
};

const handleEnquiry = () => {
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

const handleAddToLearnList = () => {
  requireStudentAccess("add this course to your learn list", () => {
    (async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await addInCart(selectedCourse.courseId, token);
        window.dispatchEvent(new Event("cart-updated"));
        toast.success(data.message || "Course added to cart successfully");
      } catch (error) {
        toast.error(error?.message || "Already added to cart!");
        navigate("/cart");
      }
    })();
  });
};

const handleNotifyWhenActive = () => {
  requireStudentAccess("enable notifications", () => {
    navigate("/notifications");
  });
};

const handleChatWithInstitute = (institute) => {
  requireStudentAccess("chat with this institute", async () => {
    try {
      const res = await sendEnquiry({ instituteId: institute?.id });
      if (!res.success) {
        toast.error(res.message || "Unable to open chat");
        return;
      }
      navigate("/chat", { state: { conversationId: res.data.conversationId } });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Unable to open chat",
      );
    }
  });
};

const menuItems = [
  { label: "Compare", icon: <Scale size={16} />, onClick: handleCompare },
  { label: "Enquiry", icon: <MessageSquare size={16} />, onClick: handleEnquiry },
  { label: "Add to Learn List", icon: <Heart size={16} />, onClick: handleAddToLearnList },
  { label: "Notify When Active", icon: <Bell size={16} />, onClick: handleNotifyWhenActive },
  { label: "Share", icon: <Share2 size={16} />, onClick: copyCourseLink },
  { label: "Similar Courses", icon: <BookOpen size={16} />, onClick: () => navigate("/updates") },
];

const handleEnroll = (course) => {
  requireStudentAccess("enroll", () => {
    localStorage.setItem("checkoutCourse", JSON.stringify(course));
    navigate("/checkout/" + course.courseId);
  });
};

const handleEnrollClick = (item, e) => {
  e.stopPropagation();
  handleEnroll(item);
};

  const handleFilterChange = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);
      if (newParams.get(key) === value) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      if (key === "all") {
        const newParams = new URLSearchParams();
        if (filters.q) newParams.set("q", filters.q);
        setSearchParams(newParams);
      } else {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        setSearchParams(newParams);
      }
    },
    [searchParams, setSearchParams, filters.q],
  );

  const hasFilters = Object.entries(filters).some(
    ([key, value]) => value && key !== "q",
  );
  const coursePool = courses;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow bg-white pt-24">
        <div className="mx-auto max-w-[1700px] px-4 pb-12 md:px-8 lg:px-12">
          {isNearestInstituteMode && (
            <div className="mb-5">
              <h1 className="text-xl font-bold text-slate-950 sm:text-2xl">
                {filters.type}s near you
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {filters.lat && filters.lng
                  ? "Sorted by distance from your current location."
                  : "Turn on location access for results sorted by distance."}
              </p>
            </div>
          )}
          <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm"
            >
              <Filter size={17} />
              Filters
            </button>
            <span className="text-xs font-semibold text-slate-500">
              {coursePool.length} results
            </span>
          </div>
          <ActiveFilters
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  isOpen={false}
                  onClose={() => setIsMobileFilterOpen(false)}
                />
              </div>
            </aside>

            <div className="min-w-0 space-y-8">
              {isLoading ? (
                <div className="flex min-h-[360px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                    <p className="text-sm font-semibold text-slate-700">
                      Loading search results...
                    </p>
                  </div>
                </div>
              ) : coursePool.length > 0 ? (
                <>
                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
  {coursePool.map((item, index) => {
    if (isNearestInstituteMode || filters.searchFor === "Institutes") {
      const institute = normalizeInstitute(item, index);
      return (
        <InstituteCard
          key={institute.id || index}
          item={institute}
          onCardClick={() => trackInstituteViewAndNavigate(item)}
          onMenuClick={(event) => event.stopPropagation()}
          onChatClick={() => handleChatWithInstitute(institute)}
        />
      );
    }

    return (
      <CourseCard
        key={`${item.courseId || item._id || item.id || item.title}-${index}`}
        item={item}
        visible
        widthClass="w-full"
        onCardClick={() => trackCourseViewAndNavigate(item)}
        onInstituteClick={(event) => {
          event.stopPropagation();
          trackInstituteViewAndNavigate(item);
        }}
        onEnrollClick={(event) => handleEnrollClick(item, event)}
        onMenuClick={(event) => toggleMenu(item, event)}
      />
    );
  })}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-8 py-20 text-center">
                  <h2 className="mb-2 text-xl font-bold text-slate-950">
                    {isNearestInstituteMode
                      ? "No nearby institutes found"
                      : "No courses found"}
                  </h2>
                  <p className="mb-6 text-sm text-slate-600">
                    {isNearestInstituteMode
                      ? "We couldn't find any institutes of this type right now."
                      : "Try adjusting your search term."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams({});
                      navigate("/");
                    }}
                    className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Clear All & Start Over
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {studentAccessPrompt.open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Continue to {studentAccessPrompt.actionLabel.toLowerCase()}?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              You need a student account to {studentAccessPrompt.actionLabel.toLowerCase()}.
              Confirm to open the student sign-in page.
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
                <span className="text-gray-500">{menuItem.icon}</span>
                <span className="text-gray-700">{menuItem.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}

      <Footer />
    </div>
  );
}

// import React, { useMemo, useState, useCallback, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import {
//   X,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
//   Star,
//   Clock,
//   MapPin,
//   BookOpen,
//   BadgeCheck,
//   MoreVertical,
//   ArrowLeftRight,
//   Navigation,
//   ShoppingCart,
//   ListPlus,
//   Users,
// } from 'lucide-react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import CourseCard from '../components/Home/CourseCard';

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || 'https://canvade-backend.onrender.com';

// const getCourseItems = (data) => {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.data)) return data.data;
//   if (Array.isArray(data?.data?.courses)) return data.data.courses;
//   if (Array.isArray(data?.data?.course)) return data.data.course;
//   if (Array.isArray(data?.data?.results)) return data.data.results;
//   if (Array.isArray(data?.data?.items)) return data.data.items;
//   if (Array.isArray(data?.courses)) return data.courses;
//   if (Array.isArray(data?.course)) return data.course;
//   if (Array.isArray(data?.results)) return data.results;
//   if (Array.isArray(data?.items)) return data.items;
//   return [];
// };

// const searchCoursesAPI = async (query, filters) => {
//   let response;
//   if (filters.category) {
//     response = await fetch(`${API_BASE_URL}/api/search/category/${filters.category}`);
//   } else {
//     const params = new URLSearchParams();
//     if (query) {
//       params.set('q', query);
//       params.set('search', query);
//     }
//     Object.entries(filters || {}).forEach(([key, value]) => {
//       if (value && key !== 'q') params.set(key, value);
//     });
//     response = await fetch(`${API_BASE_URL}/api/search/get${params.toString() ? `?${params}` : ''}`);
//   }

//   if (!response.ok) throw new Error('Unable to fetch search results');

//   const data = await response.json();
//   return getCourseItems(data);
// };

// /**
//  * Filter configuration
//  */
// const FILTER_CONFIG = {
//   searchFor: {
//     label: 'Type',
//     options: ['Institutes', 'Schools', 'Academies', 'Colleges'],
//     icon: '🏛️',
//   },
//   feeRange: {
//     label: 'Fee Range',
//     options: [
//       'Under Rs. 5,000',
//       'Rs. 5,000 - 10,000',
//       'Rs. 10,000 - 20,000',
//       'Rs. 20,000 - 50,000',
//       'Rs. 50,000 - 1,00,000',
//       'Above Rs. 1,00,000',
//       'Free',
//     ],
//     icon: '₹',
//   },
//   learningMode: {
//     label: 'Learning Mode',
//     options: ['Online', 'Onsite', 'Hybrid'],
//     icon: '⚡',
//   },
//   courseDuration: {
//     label: 'Duration',
//     options: [
//       'Less than 1 month',
//       '1-3 months',
//       '3-6 months',
//       'More than 6 months',
//     ],
//     icon: '⏱️',
//   },
//   category: {
//     label: 'Category',
//     options: [], // This will be populated by the URL param, not shown in UI
//   },
// };

// /**
//  * Active Filters Display Component
//  */
// function ActiveFilters({ filters, onRemoveFilter }) {
//   const displayFilters = Object.entries(filters)
//     .filter(([key, value]) => value && key !== 'q' && FILTER_CONFIG[key]?.options.length > 0)
//     .map(([key, value]) => ({
//       key,
//       value,
//       label: FILTER_CONFIG[key]?.label || key,
//     }));

//   if (displayFilters.length === 0) return null;

//   return (
//     <div >
//       <p className="text-sm font-semibold text-gray-700 mb-3">Active Filters</p>
//       <div className="flex flex-wrap gap-2">
//         {displayFilters.map(({ key, value, label }) => (
//           <button
//             key={`${key}-${value}`}
//             onClick={() => onRemoveFilter(key)}
//             className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-md focus-visible:outline-2 focus-visible:outline-emerald-600"
//             aria-label={`Remove filter: ${label}`}
//           >
//             {value}
//             <X size={16} className="hover:scale-110 transition-transform" />
//           </button>
//         ))}
//         <button
//           onClick={() => onRemoveFilter('all')}
//           className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-gray-400"
//         >
//           Clear All
//         </button>
//       </div>
//     </div>
//   );
// }

// /**
//  * Filter Sidebar Component
//  */
// function FilterSidebar({ filters, onFilterChange, isOpen, onClose }) {
//   const [expandedSections, setExpandedSections] = useState(
//     Object.keys(FILTER_CONFIG).reduce((acc, key) => ({ ...acc, [key]: true }), {})
//   );

//   const toggleSection = useCallback((sectionKey) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionKey]: !prev[sectionKey],
//     }));
//   }, []);

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-black/30 md:hidden"
//           onClick={onClose}
//           aria-hidden="true"
//         />
//       )}

//       <aside
//         className={`fixed left-0 top-0 z-40 h-screen w-80 transform overflow-y-auto bg-white shadow-xl transition-transform duration-300 md:relative md:top-auto md:z-0 md:max-h-[calc(100vh-7rem)] md:w-full md:transform-none md:rounded-2xl md:border md:border-slate-200 md:bg-white md:p-0 md:shadow-sm ${
//           isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//         }`}
//       >
//         <div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-5">
//           <div className="flex items-center justify-between md:hidden mb-2">
//             <h2 className="text-xl font-bold text-gray-900">Filters</h2>
//             <button
//               onClick={onClose}
//               className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
//               aria-label="Close filters"
//             >
//               <X size={24} />
//             </button>
//           </div>
//           <div className="hidden md:block">
//             <h3 className="text-xl font-bold tracking-tight text-slate-950">Filters</h3>
//             <p className="mt-1 text-xs font-medium text-slate-500">Refine courses by type, fee and mode.</p>
//           </div>
//         </div>

//         <div className="p-5">
//           <div className="space-y-5">
//             {Object.entries(FILTER_CONFIG).filter(([, config]) => config.options.length > 0).map(([key, config]) => (
//               <div key={key} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
//                 <button
//                   onClick={() => toggleSection(key)}
//                   className="flex w-full items-center justify-between text-left font-bold text-slate-900 transition-colors hover:text-emerald-700"
//                   aria-expanded={expandedSections[key]}
//                 >
//                   <span className="flex items-center gap-2 text-[15px]">
//                     {config.label}
//                   </span>
//                   <ChevronDown
//                     size={18}
//                     className={`transition-transform text-gray-400 ${expandedSections[key] ? 'rotate-180 text-emerald-600' : ''}`}
//                   />
//                 </button>

//                 {expandedSections[key] && (
//                   <div className="mt-3 space-y-2">
//                     {config.options.map((option) => (
//                       <label
//                         key={option}
//                         className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
//                           filters[key] === option
//                             ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
//                             : 'border-white bg-white text-slate-600 hover:border-emerald-100 hover:text-emerald-700'
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={filters[key] === option}
//                           onChange={() => onFilterChange(key, option)}
//                           className="h-4 w-4 shrink-0 rounded border-slate-300 accent-emerald-600"
//                           aria-label={`Filter by ${option}`}
//                         />
//                         <span>{option}</span>
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// const formatCurrency = (value) => {
//   const number = Number(value || 0);
//   if (!Number.isFinite(number) || number <= 0) return 'Price on request';
//   return `₹ ${number.toLocaleString('en-IN')}`;
// };

// const getCourseLocations = (course) => {
//   const locations =
//     course.basicDetails?.locations ||
//     course.locations ||
//     course.institute?.locations ||
//     course.location;
//   if (Array.isArray(locations) && locations.length > 0) {
//     return locations.filter(Boolean);
//   }
//   if (locations) return [locations];
//   return [{ city: 'Location', state: 'not specified' }];
// };

// const getLocationText = (location) => {
//   if (typeof location === 'string') return location;
//   return [
//     location?.addressLine1,
//     location?.addressLine2,
//     location?.city,
//     location?.state,
//     location?.zipCode,
//   ]
//     .filter(Boolean)
//     .join(', ');
// };

// /**
//  * Course Card Component - Matching existing design system
//  */
// function SearchResultCourseCard({ course }) {
//   const navigate = useNavigate();

//   return <SearchResultCourseCardV2 course={course} />;

//   const title = course.basicDetails?.courseTitle || course.title;
//   const image = course.uploadMaterials?.thumbnail || 'course.png';
//   const institution = course.institute?.name || 'Unknown Institute';
//   const location = course.institute?.locations?.[0]
//     ? `${course.institute.locations[0].city}, ${course.institute.locations[0].state}`
//     : 'Location not specified';
//   const duration = course.basicDetails?.duration || '3 months';
//   const mode = course.mode || 'Online';
//   const currentPrice = course.priceDetails?.currentPrice || 10000;
//   const actualPrice = course.priceDetails?.actualPrice || 15000;
//   const rating = course.rating || 4.5;

//   return (
//     <div
//       onClick={() => navigate(`/courseview/${course.id}`)}
//       className="flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-500 hover:shadow-xl group cursor-pointer hover:-translate-y-1"
//     >
//       <div className="p-2 pb-0">
//         <div className="relative">
//           <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-t-[8px] rounded-bl-[15px]">
//             <img
//               src={image}
//               alt={title}
//               onError={(e) => {
//                 e.target.src = 'course.png';
//               }}
//               className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
//             />

//             {/* Badge and Rating */}
//             <div className="absolute bottom-0 right-0 bg-white pl-2 pt-0 rounded-tl-lg flex items-center gap-2 h-8">
//               {course.badge && (
//                 <span className="bg-[#FFC107] text-[9px] text-white px-2 py-0.5 rounded-md capitalize">
//                   {course.badge}
//                 </span>
//               )}
//               <div className="flex items-center gap-0.5 pr-3">
//                 <span className="text-[#FFC107] text-sm">★</span>
//                 <span className="text-[11px] text-gray-700">{rating}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="p-4 pt-3">
//         {/* Institution Button */}
//         <button
//           type="button"
//           className="flex w-full items-center gap-1 bg-[#f1f5f9] px-3.5 py-1 rounded-[6px] mb-2 overflow-hidden cursor-pointer hover:bg-[#e8f1f5] transition-colors"
//           onClick={(event) => {
//             event.stopPropagation();
//             navigate(`/instituteview`);
//           }}
//         >
//           <span className="text-[10px] font-medium text-[#2563eb] uppercase tracking-[0.04em] truncate min-w-0">
//             {institution}
//           </span>
//           <BadgeCheck className="w-4 h-4 text-white fill-[#3b82f6] flex-shrink-0" />
//         </button>

//         {/* Title */}
//         <h3 className="text-base font-medium text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[40px]">
//           {title}
//         </h3>

//         {/* Duration and Mode */}
//         <div className="flex items-stretch text-gray-700 text-[11px] mb-2 border-b border-gray-200">
//           <div className="flex items-center gap-1.5 font-medium pb-3 pr-4">
//             <Clock className="w-4 h-4 text-gray-700" />
//             <span>{duration}</span>
//           </div>
//           <div className="flex items-center gap-2.5 font-medium border-l border-gray-300 pl-4 md:pl-6 pb-3 ml-auto">
//             <Zap className="w-4 h-4 text-gray-700" />
//             <span>{mode}</span>
//           </div>
//         </div>

//         {/* Location */}
//         <div className="flex items-center gap-1.5 text-gray-700 text-[12px] mb-2">
//           <MapPin className="w-4 h-4 flex-shrink-0 text-gray-700" />
//           <span className="truncate">{location}</span>
//         </div>

//         {/* Price and Enroll */}
//         <div className="flex items-center justify-between">
//           <div className="bg-[#F6F6F6] px-2 py-1 rounded-md space-y-0.5">
//             <p className="text-[15px] font-semibold text-gray-900 leading-tight">
//               ₹ {currentPrice.toLocaleString('en-IN')}
//             </p>
//             <p className="text-[10px] text-[#303030] line-through">
//               ₹ {actualPrice.toLocaleString('en-IN')}
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               onClick={(event) => {
//                 event.stopPropagation();
//                 navigate(`/courseview/${course.id}`);
//               }}
//               className="group/enroll bg-[#E5E5E5] hover:bg-emerald-600 hover:text-white text-gray-700 text-[13px] font-semibold px-4 md:px-5 py-3 rounded-md flex items-center gap-2 transition-all"
//             >
//               Explore
//               <span className="hidden sm:inline-flex w-4 h-4 rounded-md bg-[#484848] text-white items-center justify-center align-middle transition-colors group-hover/enroll:bg-white group-hover/enroll:text-emerald-700">
//                 <ArrowRight className="w-2.5 h-2.5" />
//               </span>
//             </button>

//             <button
//               type="button"
//               onClick={(event) => {
//                 event.stopPropagation();
//               }}
//               className="p-1 rounded-full hover:bg-gray-100"
//               aria-label="More options"
//             >
//               <MoreVertical className="w-5 h-5 text-[#707070]" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const formatPrice = (value) => {
//   const number = Number(value || 0);
//   if (!Number.isFinite(number) || number <= 0) return 'Price on request';
//   return `Rs. ${number.toLocaleString('en-IN')}`;
// };

// function SearchResultCourseCardV2({ course }) {
//   const navigate = useNavigate();

//   const courseId = course.id || course._id || '';
//   const title = course.basicDetails?.courseTitle || course.title || 'Course title unavailable';
//   const image = course.uploadMaterials?.thumbnail || course.thumbnail || course.image || 'course.png';
//   const institution = course.institute?.name || course.instituteName || course.institution || 'Unknown Institute';
//   const locations = getCourseLocations(course);
//   const primaryLocation = getLocationText(locations[0]) || 'Location not specified';
//   const extraLocationCount = Math.max(locations.length - 1, 0);
//   const duration = course.basicDetails?.duration || course.duration || '3 months';
//   const mode = course.mode || course.basicDetails?.mode || 'Online';
//   const currentPrice = course.priceDetails?.currentPrice || course.currentPrice || 10000;
//   const actualPrice = course.priceDetails?.actualPrice || course.actualPrice || 15000;
//   const rating = course.rating || course.averageRating || 4.5;
//   const reviews = course.reviews || course.reviewCount || 128;
//   const lastMonthEnrollments =
//     course.lastMonthEnrollments || course.enrollmentsLastMonth || course.monthlyEnrollments || 235;
//   const lastMonthEnrollmentLabel = Number(lastMonthEnrollments).toLocaleString('en-IN');
//   const discount =
//     Number(actualPrice) > Number(currentPrice)
//       ? Math.round(((Number(actualPrice) - Number(currentPrice)) / Number(actualPrice)) * 100)
//       : 0;

//   const openPrimaryMap = (event) => {
//     event.stopPropagation();
//     const mapLink = locations[0]?.googleMapLink || locations[0]?.mapLink;
//     if (mapLink) window.open(mapLink, '_blank', 'noopener,noreferrer');
//   };

//   return (
//     <div
//       onClick={() => navigate(`/courseview/${courseId}`)}
//       className="group flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
//     >
//       <div className="p-2 pb-0">
//         <div className="relative aspect-[16/9] max-h-[154px] overflow-hidden rounded-xl bg-slate-100">
//           <img
//             src={image}
//             alt={title}
//             onError={(event) => {
//               event.currentTarget.src = 'course.png';
//             }}
//             className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
//           />
//           <button
//             type="button"
//             onClick={(event) => event.stopPropagation()}
//             className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-500 shadow-sm transition hover:text-slate-900"
//             aria-label="More options"
//           >
//             <MoreVertical className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       <div className="space-y-3 p-4">
//         <div className="flex flex-wrap items-center gap-2">
//           <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
//             <BadgeCheck className="h-3.5 w-3.5" />
//             Student's Choice
//           </span>
//           <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
//             <Star className="h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
//             {rating} ({reviews} Reviews)
//           </span>
//         </div>

//         <button
//           type="button"
//           className="flex max-w-full items-center gap-1 text-left text-[12px] font-bold text-[#2789e5] transition hover:text-emerald-700"
//           onClick={(event) => {
//             event.stopPropagation();
//             navigate('/instituteview');
//           }}
//         >
//           <span className="truncate">{institution}</span>
//           <BadgeCheck className="h-4 w-4 flex-shrink-0 fill-[#3b82f6] text-white" />
//         </button>

//         <h3 className="min-h-[54px] text-lg font-bold leading-tight text-slate-950 line-clamp-3">
//           {title}
//         </h3>

//         <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3 text-sm font-medium text-slate-600">
//           <div className="flex items-center gap-2">
//             <Clock className="h-4 w-4 text-slate-700" />
//             <span>{duration}</span>
//           </div>
//           <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
//             <BookOpen className="h-4 w-4 text-slate-700" />
//             <span>{mode}</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
//           <MapPin className="h-4 w-4 flex-shrink-0 text-slate-700" />
//           <span className="truncate">
//             {primaryLocation}
//             {extraLocationCount > 0 && (
//               <span className="ml-1 font-bold text-slate-900">({extraLocationCount} More)</span>
//             )}
//           </span>
//         </div>

//         <div className="grid gap-3 xl:grid-cols-[0.9fr_1.1fr]">
//           <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
//             <p className="text-xl font-bold leading-none text-slate-950">
//               {formatPrice(currentPrice)}
//             </p>
//             <p className="mt-1 text-xs font-medium text-slate-500">
//               <span className="line-through">{formatPrice(actualPrice)}</span>
//               {discount > 0 && (
//                 <span className="ml-2 font-bold text-emerald-600">({discount}% Off)</span>
//               )}
//             </p>
//             <div className="mt-3 grid gap-2">
//               <button
//                 type="button"
//                 onClick={(event) => {
//                   event.stopPropagation();
//                   navigate(`/checkout/${courseId}`);
//                 }}
//                 className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#007965] text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(0,121,101,0.22)] transition hover:bg-[#006252]"
//               >
//                 <ShoppingCart className="h-4 w-4" />
//                 Checkout
//               </button>
//               <button
//                 type="button"
//                 onClick={(event) => {
//                   event.stopPropagation();
//                   navigate(`/courseview/${courseId}`);
//                 }}
//                 className="flex h-9 w-full items-center justify-center rounded-lg border border-emerald-200 bg-white text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
//               >
//                 Enquire Now
//               </button>
//             </div>
//             <p className="mt-2 text-center text-[11px] font-semibold text-slate-400">
//               Get free counselling & guidance
//             </p>
//           </div>

//           <div className="rounded-xl border border-slate-100 bg-white p-3">
//             <p className="text-xs font-bold text-slate-950">Locations</p>
//             <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
//               {locations.slice(0, 4).map((item, index) => (
//                 <div
//                   key={`${getLocationText(item)}-${index}`}
//                   className="rounded-lg bg-slate-50 p-2 text-[11px] font-medium leading-snug text-slate-600"
//                 >
//                   <span className="line-clamp-2">
//                     {getLocationText(item) || 'Location not specified'}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <button
//               type="button"
//               onClick={openPrimaryMap}
//               className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
//             >
//               <Navigation className="h-3.5 w-3.5 text-red-500" />
//               Open in Google Maps
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-700">
//           <Users className="h-3.5 w-3.5 text-orange-500" />
//           {lastMonthEnrollmentLabel} students enrolled last month
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <button
//             type="button"
//             onClick={(event) => event.stopPropagation()}
//             className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
//           >
//             <ListPlus className="h-4 w-4" />
//             Learning List
//           </button>
//           <button
//             type="button"
//             onClick={(event) => event.stopPropagation()}
//             className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
//           >
//             <ArrowLeftRight className="h-4 w-4" />
//             Compare
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// const toCompactSections = (items, sectionCount = 8, cardsPerSection = 3) => {
//   if (!items.length) return [];
//   return Array.from({ length: sectionCount }, (_, sectionIndex) =>
//     Array.from(
//       { length: cardsPerSection },
//       (_, cardIndex) => items[(sectionIndex * cardsPerSection + cardIndex) % items.length]
//     )
//   );
// };

// function SectionControls() {
//   return (
//     <div className="flex items-center gap-2">
//       <button
//         type="button"
//         className="grid h-8 w-8 place-items-center rounded-full border border-emerald-500 bg-white text-emerald-600 transition hover:bg-emerald-50"
//         aria-label="Previous"
//       >
//         <ChevronLeft className="h-4 w-4" />
//       </button>
//       <button
//         type="button"
//         className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600"
//         aria-label="Next"
//       >
//         <ChevronRight className="h-4 w-4" />
//       </button>
//     </div>
//   );
// }

// function CompactCourseCard({ course, index }) {
//   const navigate = useNavigate();
//   const courseId = course.id || course._id || index;
//   const title = course.basicDetails?.courseTitle || course.title || 'Philosophy of Doctorate in Human Behavior and Psychological Research';
//   const image = course.uploadMaterials?.thumbnail || course.thumbnail || course.image || 'course.png';
//   const institution = course.institute?.name || course.instituteName || course.institution || 'ICAI - The Institute of Chartered Accountants';
//   const locations = getCourseLocations(course);
//   const primaryLocation = getLocationText(locations[0]) || 'Moti Nagar, New Delhi';
//   const extraLocationCount = Math.max(locations.length - 1, 0);
//   const duration = course.basicDetails?.duration || course.duration || '4 Year';
//   const mode = course.mode || course.basicDetails?.mode || 'Onsite & Online';
//   const currentPrice = course.priceDetails?.currentPrice || course.currentPrice || 290000;
//   const actualPrice = course.priceDetails?.actualPrice || course.actualPrice || 340000;
//   const rating = course.rating || course.averageRating || 4.8;
//   const lastMonthEnrollments =
//     course.lastMonthEnrollments || course.enrollmentsLastMonth || course.monthlyEnrollments || 235;
//   const lastMonthEnrollmentLabel = Number(lastMonthEnrollments).toLocaleString('en-IN');
//   const discount =
//     Number(actualPrice) > Number(currentPrice)
//       ? Math.round(((Number(actualPrice) - Number(currentPrice)) / Number(actualPrice)) * 100)
//       : 0;

//   return (
//     <article
//       onClick={() => navigate(`/courseview/${courseId}`)}
//       className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
//     >
//       <div className="p-2 pb-0">
//         <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
//           <img
//             src={image}
//             alt={title}
//             onError={(event) => {
//               event.currentTarget.src = 'course.png';
//             }}
//             className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
//           />
//           <div className="absolute bottom-2 right-2 flex items-center gap-1">
//             <span className="rounded-md bg-[#ffc107] px-2 py-1 text-[10px] font-bold text-white">
//               Student's Choice
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-1 text-[11px] font-semibold text-slate-800">
//               <Star className="h-3 w-3 fill-[#ffc107] text-[#ffc107]" />
//               {rating}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2 px-3 pb-3 pt-2">
//         <button
//           type="button"
//           onClick={(event) => {
//             event.stopPropagation();
//             navigate('/instituteview');
//           }}
//           className="flex h-6 w-full items-center gap-1 rounded-md bg-slate-100 px-2 text-left text-[10px] font-bold uppercase tracking-wide text-blue-600"
//         >
//           <span className="truncate">{institution}</span>
//           <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0 fill-[#3b82f6] text-white" />
//         </button>

//         <h3 className="min-h-[38px] text-[13px] font-bold leading-snug text-slate-950 line-clamp-2">
//           {title}
//         </h3>

//         <div className="grid grid-cols-2 gap-y-2 border-b border-slate-200 pb-2 text-[12px] font-medium text-slate-700">
//           <div className="flex items-center gap-1.5">
//             <Clock className="h-4 w-4 text-slate-800" />
//             <span className="truncate">{duration}</span>
//           </div>
//           <div className="flex items-center gap-1.5 pl-3">
//             <BookOpen className="h-4 w-4 text-slate-800" />
//             <span className="truncate">{mode}</span>
//           </div>
//           <div className="col-span-2 flex items-center gap-1.5">
//             <MapPin className="h-4 w-4 flex-shrink-0 text-slate-800" />
//             <span className="truncate">
//               {primaryLocation}
//               {extraLocationCount > 0 && <span className="ml-1 font-bold text-slate-950">({extraLocationCount} More)</span>}
//             </span>
//           </div>
//         </div>

//         <div className="rounded-lg bg-slate-50 px-2.5 py-2">
//           <div className="flex items-end gap-2">
//             <p className="text-[15px] font-extrabold leading-none text-slate-950">
//               {formatPrice(currentPrice)}
//             </p>
//             <p className="text-[10px] font-semibold text-slate-500">
//               <span className="line-through">{formatPrice(actualPrice)}</span>
//               {discount > 0 && <span className="ml-1 text-emerald-600">({discount}% Off)</span>}
//             </p>
//           </div>
//           <div className="mt-2 grid grid-cols-[1.15fr_0.85fr] gap-2">
//             <button
//               type="button"
//               onClick={(event) => {
//                 event.stopPropagation();
//                 navigate(`/checkout/${courseId}`);
//               }}
//               className="inline-flex h-8 items-center justify-center gap-1 rounded-md bg-[#007965] px-2 text-[11px] font-extrabold text-white shadow-sm transition hover:bg-[#006252]"
//             >
//               <ShoppingCart className="h-3.5 w-3.5" />
//               Checkout
//             </button>
//             <button
//               type="button"
//               onClick={(event) => {
//                 event.stopPropagation();
//                 navigate(`/courseview/${courseId}`);
//               }}
//               className="inline-flex h-8 items-center justify-center rounded-md border border-emerald-200 bg-white px-2 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-50"
//             >
//               Enquire
//             </button>
//           </div>
//           <p className="mt-1.5 text-center text-[9px] font-semibold text-slate-400">
//             Get free counselling & guidance
//           </p>
//         </div>

//         <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-700">
//           <Users className="h-3.5 w-3.5 text-orange-500" />
//           {lastMonthEnrollmentLabel} students enrolled last month
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <button
//             type="button"
//             onClick={(event) => event.stopPropagation()}
//             className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-emerald-200 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-50"
//           >
//             <ListPlus className="h-3.5 w-3.5" />
//             Learning List
//           </button>
//           <button
//             type="button"
//             onClick={(event) => event.stopPropagation()}
//             className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-emerald-200 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-50"
//           >
//             <ArrowLeftRight className="h-3.5 w-3.5" />
//             Compare
//           </button>
//         </div>

//         <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-2.5 py-2">
//           <div className="min-w-0">
//             <p className="text-[11px] font-bold text-slate-950">Location</p>
//             <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-500">
//               {primaryLocation}
//             </p>
//           </div>
//           <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
//             {locations.length} {locations.length === 1 ? 'branch' : 'branches'}
//           </span>
//         </div>

//         <div className="grid grid-cols-3 gap-1.5">
//           {locations.slice(0, 3).map((item, locationIndex) => (
//             <button
//               key={`${getLocationText(item)}-${locationIndex}`}
//               type="button"
//               onClick={(event) => event.stopPropagation()}
//               className={`h-8 rounded-full border px-2 text-[10px] font-bold transition ${
//                 locationIndex === 0
//                   ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
//                   : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
//               }`}
//             >
//               Location {locationIndex + 1}
//             </button>
//           ))}
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={(event) => event.stopPropagation()}
//             className="ml-auto grid h-8 w-6 place-items-center text-slate-500 hover:text-slate-900"
//             aria-label="More options"
//           >
//             <MoreVertical className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }

// function CompactInstituteCard({ institute, index }) {
//   const navigate = useNavigate();
//   const image = institute.image || 'institute.png';

//   return (
//     <article
//       onClick={() => navigate('/instituteview')}
//       className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
//     >
//       <div className="p-2 pb-0">
//         <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
//           <img
//             src={image}
//             alt={institute.name}
//             onError={(event) => {
//               event.currentTarget.src = 'institute.png';
//             }}
//             className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
//           />
//           <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-1 text-[11px] font-semibold text-slate-800">
//             <Star className="h-3 w-3 fill-[#ffc107] text-[#ffc107]" />
//             {institute.rating || 4.8}
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2 px-3 pb-3 pt-2">
//         <h3 className="min-h-[34px] text-[13px] font-bold leading-snug text-slate-950 line-clamp-2">
//           {institute.name}
//         </h3>
//         <div className="grid grid-cols-2 border-b border-slate-200 pb-2 text-[11px] font-medium text-slate-600">
//           <div className="flex items-center gap-1.5">
//             <BadgeCheck className="h-3.5 w-3.5 text-slate-700" />
//             <span>Institute</span>
//           </div>
//           <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
//             <BookOpen className="h-3.5 w-3.5 text-slate-700" />
//             <span className="truncate">{institute.mode}</span>
//           </div>
//         </div>
//         <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
//           <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-700" />
//           <span className="truncate">{institute.location}</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={(event) => {
//               event.stopPropagation();
//               navigate('/instituteview');
//             }}
//             className="h-8 flex-1 rounded-md bg-[#E5E5E5] text-[11px] font-bold text-slate-800 transition hover:bg-emerald-600 hover:text-white"
//           >
//             Visit Page for all Details
//           </button>
//           <button
//             type="button"
//             onClick={(event) => event.stopPropagation()}
//             className="grid h-8 w-6 place-items-center text-slate-500 hover:text-slate-900"
//             aria-label="More options"
//           >
//             <MoreVertical className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }

// function SearchResultSection({ title, items = [] }) {
//   const navigate = useNavigate();

//   return (
//     <section>
//       <div className="mb-3 flex items-center justify-between gap-4">
//         <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
//         <SectionControls />
//       </div>
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//         {items.map((item, index) => (
//           <CourseCard
//             key={`${item.courseId || item._id || item.id || item.title}-${index}`}
//             item={item}
//             visible
//             widthClass="w-full"
//             onCardClick={() => navigate(`/courseview/${item.courseId || item._id || item.id}`)}
//             onInstituteClick={(event) => {
//               event.stopPropagation();
//               navigate('/instituteview');
//             }}
//             onEnrollClick={(event) => {
//               event.stopPropagation();
//               navigate(`/checkout/${item.courseId || item._id || item.id}`);
//             }}
//             onMenuClick={(event) => event.stopPropagation()}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// /**
//  * Main SearchResults Component
//  */
// export default function SearchResults() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const filters = useMemo(
//     () => ({
//       q: searchParams.get('q') || '',
//       searchFor: searchParams.get('searchFor') || '',
//       feeRange: searchParams.get('feeRange') || '',
//       learningMode: searchParams.get('learningMode') || '',
//       courseDuration: searchParams.get('courseDuration') || '',
//       category: searchParams.get('category') || '',
//     }),
//     [searchParams]
//   );

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setIsLoading(true);
//       try {
//         const results = await searchCoursesAPI(filters.q, filters);
//         setCourses(results);
//       } catch (error) {
//         console.error('Error fetching courses:', error);
//         setCourses([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [filters]);

//   const handleFilterChange = useCallback(
//     (key, value) => {
//       const newParams = new URLSearchParams(searchParams);
//       if (newParams.get(key) === value) {
//         newParams.delete(key);
//       } else {
//         newParams.set(key, value);
//       }
//       setSearchParams(newParams);
//     },
//     [searchParams, setSearchParams]
//   );

//   const handleRemoveFilter = useCallback(
//     (key) => {
//       if (key === 'all') {
//         const newParams = new URLSearchParams();
//         if (filters.q) newParams.set('q', filters.q);
//         setSearchParams(newParams);
//       } else {
//         const newParams = new URLSearchParams(searchParams);
//         newParams.delete(key);
//         setSearchParams(newParams);
//       }
//     },
//     [searchParams, setSearchParams, filters.q]
//   );

//   const hasFilters = Object.entries(filters).some(
//     ([key, value]) => value && key !== 'q'
//   );
//   const coursePool = courses;
//   const courseSections = toCompactSections(coursePool, 8, 3);

//   return (
//     <div className="flex min-h-screen flex-col bg-white">
//       <Navbar />

//       <main className="flex-grow bg-white pt-24">
//         <div className="mx-auto max-w-[1280px] px-4 pb-12">
//           <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
//             <button
//               type="button"
//               onClick={() => setIsMobileFilterOpen(true)}
//               className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm"
//             >
//               <Filter size={17} />
//               Filters
//             </button>
//             <span className="text-xs font-semibold text-slate-500">
//               {coursePool.length} results
//             </span>
//           </div>
//           <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />
//           <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
//             <aside className="hidden lg:block">
//               <div className="sticky top-24">
//                 <FilterSidebar
//                   filters={filters}
//                   onFilterChange={handleFilterChange}
//                   isOpen={false}
//                   onClose={() => setIsMobileFilterOpen(false)}
//                 />
//               </div>
//             </aside>

//             <div className="min-w-0 space-y-8">
//               {isLoading ? (
//                 <div className="flex min-h-[360px] items-center justify-center">
//                   <div className="text-center">
//                     <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
//                     <p className="text-sm font-semibold text-slate-700">Loading search results...</p>
//                   </div>
//                 </div>
//               ) : coursePool.length > 0 ? (
//                 <>
//                   {courseSections.map((sectionItems, index) => (
//                     <SearchResultSection
//                       key={`course-section-${index}`}
//                       title="Course Categories"
//                       items={sectionItems}
//                     />
//                   ))}
//                   <div className="flex items-center justify-center gap-1 pt-1 text-[11px] text-slate-500">
//                     <button className="rounded border border-slate-200 px-2 py-1 text-emerald-600">1</button>
//                     <button className="rounded border border-slate-200 px-2 py-1">2</button>
//                     <button className="rounded border border-slate-200 px-2 py-1">3</button>
//                     <button className="rounded border border-slate-200 px-2 py-1">23</button>
//                     <button className="rounded border border-slate-200 px-2 py-1">›</button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-8 py-20 text-center">
//                   <h2 className="mb-2 text-xl font-bold text-slate-950">No courses found</h2>
//                   <p className="mb-6 text-sm text-slate-600">Try adjusting your search term.</p>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSearchParams({});
//                       navigate('/');
//                     }}
//                     className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
//                   >
//                     Clear All & Start Over
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
