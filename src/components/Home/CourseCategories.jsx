import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  Scale,
  Share2,
} from "lucide-react";
import CourseCard from "./CourseCard";
import { addInCart, addToCompare } from "../../../api/courseApi";
import { sendEnquiry } from "../../../api/enquireApi";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

const COURSE_CATEGORY_SECTIONS = {
  primary: {
    title: "Course Categories",
    apiPath: "/api/courses/",
    showTopSpacer: true,
  },
  secondary: {
    title: "Course Categories",
    apiPath: "/api/courses/?section=course-category-2",
  },
  tertiary: {
    title: "Course Categories",
    apiPath: "/api/courses/?section=course-category-3",
  },
  fourth: {
    title: "Course Categories",
    apiPath: "/api/courses/?section=course-category-4",
  },
  fifth: {
    title: "Course Categories",
    apiPath: "/api/courses/?section=course-category-5",
  },
  sixth: {
    title: "Course Categories",
    apiPath: "/api/courses/?section=course-category-6",
  },
};

const FALLBACK_COURSES = [
  {
    courseId: "fallback-full-stack-development",
    title: "Full Stak Development",
    image: "course.png",
    institution: "MASAI SCHOOL OF ENGINEERING",
    duration: "3-6 months",
    mode: "Onsite & Online",
    location: "New atish market , jaipur, rajasthan",
    currentPrice: "₹ 8,997",
    actualPrice: "₹ 9,999",
    rating: "4.8",
  },
  {
    courseId: "fallback-python",
    title: "Python",
    image: "course.png",
    institution: "ICAI - THE INSTITUTE OF CHARTERED ACCOUNTANTS",
    duration: "0-3 months",
    mode: "Onsite & Online",
    location: "Moti Nagar, New Delhi",
    currentPrice: "₹ 4,999",
    actualPrice: "₹ 10,000",
    rating: "4.8",
  },
  {
    courseId: "fallback-full-stack-web-development",
    title: "Full Stack Web Development",
    image: "course.png",
    institution: "ICAI - THE INSTITUTE OF CHARTERED ACCOUNTANTS",
    duration: "4 Year",
    mode: "Onsite & Online",
    location: "Moti Nagar, New Delhi",
    currentPrice: "₹ 40,000",
    actualPrice: "₹ 50,000",
    rating: "4.8",
  },
  {
    courseId: "fallback-data-science",
    title: "Data Science Professional Course",
    image: "course.png",
    institution: "ICAI - THE INSTITUTE OF CHARTERED ACCOUNTANTS",
    duration: "6 Months",
    mode: "Hybrid",
    location: "Moti Nagar, New Delhi",
    currentPrice: "₹ 29,000",
    actualPrice: "₹ 40,000",
    rating: "4.8",
  },
];

const getCourseItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.courses)) return data.courses;
  if (Array.isArray(data?.course)) return data.course;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const getInstituteRoute = (course) => {
  const instituteId =
    course?.institute?.instituteId ||
    course?.institute?.id ||
    course?.institute?._id ||
    course?.instituteId ||
    course?.basicDetails?.instituteId ||
    course?.createdById ||
    course?.basicDetails?.createdById;

  return instituteId ? `/instituteview/${instituteId}` : "/instituteview";
};

const trackInstituteViewAndNavigate = async (course, navigate) => {
  const instituteId =
    course?.institute?.instituteId ||
    course?.institute?.id ||
    course?.institute?._id ||
    course?.instituteId ||
    course?.basicDetails?.instituteId ||
    course?.createdById ||
    course?.basicDetails?.createdById;
  const token = localStorage.getItem("token") || localStorage.getItem("Token");

  if (token && instituteId) {
    try {
      await fetch(`${API_BASE_URL}/api/institute/${instituteId}/views`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error incrementing institute view:", error);
    }
  }

  navigate(getInstituteRoute(course));
};

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

function CourseCategoriesSection({ title, apiPath, showTopSpacer = false }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const userRole = (localStorage.getItem("Role") || localStorage.getItem("role") || "").toLowerCase();
  const isStudentRole = userRole === "student";
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentAccessPrompt, setStudentAccessPrompt] = useState({
    open: false,
    actionLabel: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const fetchCourseList = async (path) => {
          const response = await fetch(`${API_BASE_URL}${path}`);
          if (!response.ok) return [];
          const data = await response.json();
          return getCourseItems(data);
        };

        let items = await fetchCourseList(apiPath);
        if (items.length === 0 && apiPath !== COURSE_CATEGORY_SECTIONS.primary.apiPath) {
          items = await fetchCourseList(COURSE_CATEGORY_SECTIONS.primary.apiPath);
        }

        const anims = ["anim-left", "anim-top", "anim-bottom", "anim-right"];
        const displayItems = items.length > 0 ? items : FALLBACK_COURSES;

        setCourses(
          displayItems.map((course, index) => ({
            ...course,
            anim: anims[index % anims.length],
          })),
        );
      } catch (error) {

        toast.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [apiPath, title]);

  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);
    document.addEventListener("mousedown", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, []);

  useEffect(() => {
    const current = scrollRef.current;
    if (!current) return undefined;

    const updateButtons = () => {
      const maxScrollLeft = current.scrollWidth - current.clientWidth;
      setCanScrollLeft(current.scrollLeft > 2);
      setCanScrollRight(current.scrollLeft < maxScrollLeft - 2);
    };

    updateButtons();
    current.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      current.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [courses.length, isLoading]);


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

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const card = current.querySelector(':scope > div');
      if (!card) return;
      const cardWidth = card.offsetWidth;
      const gap = parseInt(window.getComputedStyle(current).gap) || 20;
      const scrollAmount = cardWidth + gap;
      current.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(() => {
        const maxScrollLeft = current.scrollWidth - current.clientWidth;
        setCanScrollLeft(current.scrollLeft > 2);
        setCanScrollRight(current.scrollLeft < maxScrollLeft - 2);
      }, 350);
    }
  };

  const arrowButtonClass = (direction, active) =>
    [
      "h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-95",
      direction === "left"
        ? "border-[#16C79A] bg-white text-[#12B886] hover:bg-emerald-50"
        : "border-[#16C79A] bg-[#12B886] text-white hover:bg-[#0EA678]",
      active ? "" : "cursor-not-allowed opacity-60",
    ].join(" ");

  const copyCourseLink = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/courseview`);
  };

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

  const handleAddToCart = async (courses) => {
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

  // TODO: Similar Courses should be linked by backend-provided industry/category mapping.
  const menuItems = [
    {
      label: "Compare",
      icon: <Scale size={16} />,
      onClick: handleCompare,
    },
    {
      label: "Enquiry",
      icon: <MessageSquare size={16} />,
      onClick: handleEnquiry,
    },
    {
      label: "Add to Learn List",
      icon: <Heart size={16} />,
      onClick: handleAddToCart,
    },
    {
      label: "Notify When Active",
      icon: <Bell size={16} />,
      onClick: () => requireStudentAccess("enable notifications", () => navigate("/notifications")),
    },
    {
      label: "Share",
      icon: <Share2 size={16} />,
      onClick: copyCourseLink,
    },
    {
      label: "Similar Courses",
      icon: <BookOpen size={16} />,
      onClick: () => navigate("/updates"),
    },
  ];



  const handleEnroll = (course) => {
    requireStudentAccess("enroll", () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      navigate(`/checkout/${course.courseId}`);
    });
  };
  const handleEnrollClick = (item, e) => {
    e.stopPropagation();
    handleEnroll(item);
  };




  const skeletonCards = Array.from({ length: 4 });

  return (
    <section className="bg-white py-10 first:pt-12 overflow-hidden">
      <div className="mx-auto max-w-[1700px] px-4 md:px-8 lg:px-12">
        {/* {showTopSpacer && (
          <div className="mb-10 h-[360px] rounded-2xl bg-slate-100 md:h-[560px] lg:h-[760px]" />
        )} */}
        <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-gray-800 tracking-tight">
            {title}
          </h2>
          <div className="flex gap-3">
              <button
                type="button"
                onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={arrowButtonClass("left", canScrollLeft)}
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
              <button
                type="button"
                onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={arrowButtonClass("right", canScrollRight)}
            >
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex xl:grid xl:grid-cols-4 gap-5 overflow-x-auto xl:overflow-x-visible pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? skeletonCards.map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[45vw] md:w-[360px] lg:w-[390px] xl:w-full snap-start bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-pulse"
                >
                  <div className="p-2 pb-0">
                    <div className="h-44 md:h-48 w-full rounded-t-[8px] rounded-bl-[15px] bg-gray-200" />
                  </div>
                  <div className="p-4 pt-3 space-y-3">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-5 w-4/5 rounded bg-gray-200" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-10 w-28 rounded-md bg-gray-200" />
                      <div className="h-9 w-24 rounded-md bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))
            : courses.map((item) => (
                <CourseCard
                  key={item.courseId || item._id || item.id}
                  item={item}
                  visible={visible}
                  widthClass="w-[calc(100vw-2rem)] sm:w-[45vw] md:w-[360px] lg:w-[390px] xl:w-full"
                    onCardClick={() => trackCourseViewAndNavigate(item, navigate)}
                  onInstituteClick={(e) => {
                    e.stopPropagation();
                      trackInstituteViewAndNavigate(item, navigate);
                  }}
                  onEnrollClick={(e) => handleEnrollClick(item, e)}
                  onMenuClick={(e) => toggleMenu(item, e)}
                />
              ))}
        </div>
        </div>
      </div>

      {openMenuId !== null &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: menuPos.top,
              left: menuPos.left,
              zIndex: 9999,
            }}
            className="w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-lg"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            {menuItems.map((menuItem) => (
              <button
                key={menuItem.label}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  menuItem.onClick();
                  setOpenMenuId(null);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
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
    </section>
  );
}

export function CourseCategoriesTwo() {
  return <CourseCategoriesSection {...COURSE_CATEGORY_SECTIONS.secondary} />;
}

export function CourseCategoriesThree() {
  return <CourseCategoriesSection {...COURSE_CATEGORY_SECTIONS.tertiary} />;
}

export function CourseCategoriesFour() {
  return <CourseCategoriesSection {...COURSE_CATEGORY_SECTIONS.fourth} />;
}

export function CourseCategoriesFive() {
  return <CourseCategoriesSection {...COURSE_CATEGORY_SECTIONS.fifth} />;
}

export function CourseCategoriesSix() {
  return <CourseCategoriesSection {...COURSE_CATEGORY_SECTIONS.sixth} />;
}

export default function CourseCategories() {
  return <CourseCategoriesSection {...COURSE_CATEGORY_SECTIONS.primary} />;
}
