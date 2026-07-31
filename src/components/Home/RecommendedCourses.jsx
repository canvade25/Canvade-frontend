import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock3,
  BookOpen,
  MapPin,
  ArrowRight,
  MoreVertical,
  Scale,
  MessageSquare,
  Heart,
  Bell,
  Share2,
} from "lucide-react";
import CourseCard from "./CourseCard";
import { addInCart, addToCompare } from "../../../api/courseApi";
import { sendEnquiry } from "../../../api/enquireApi";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

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

export default function RecommendedCourses() {
  const navigate = useNavigate();
  const userRole = (localStorage.getItem("Role") || localStorage.getItem("role") || "").toLowerCase();
  const isStudentRole = userRole === "student";
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const scrollRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [studentAccessPrompt, setStudentAccessPrompt] = useState({
    open: false,
    actionLabel: "",
  });
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses/`, {
          headers: {
            // Add your Authorization token here
            // 'Authorization': 'Bearer YOUR_TOKEN'
          }
        });
        const data = await response.json();
        if (data.success) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on scroll so it doesn't drift from its button
  useEffect(() => {
    const handleScroll = () => setOpenMenuId(null);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  useEffect(() => {
    const current = scrollRef.current;
    if (!current) return;

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
  }, []);

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

    // Convert viewport coords → document coords by adding scroll offset
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
      active ? "" : "cursor-not-allowed",
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
      action,
    });
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


  const handleInstituteClick = () => {
    trackInstituteViewAndNavigate(selectedCourse, navigate);
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
          toast.error("Already added to cart!");
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
      onClick: handleAddToLearnList,
    },
    {
      label: "Notify When Active",
      icon: <Bell size={16} />,
      onClick: handleNotifyWhenActive,
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

  // TODO: Similar Courses should be linked by backend-provided industry/category mapping.
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

  const skeletonCards = Array.from({ length: 4 });

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="bg-[#f8fafc] rounded-[30px] md:rounded-[40px] p-4 md:p-10 shadow-sm border border-gray-100">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div className="w-full flex flex-col items-center text-center">
                <h2 className="text-1xl md:text-4xl font-medium text-gray-800 mb-2 tracking-tight">
                  <span className="text-emerald-600">Courses</span> Picked Just
                  for You
                </h2>
                <p className="text-gray-500 text-xs md:text-sm max-w-2xl">
                  Courses and Programs selected based on your interests, profile,
                  and activity — helping you find the right options faster.
                </p>
              </div>

              <div className="flex gap-2 self-end">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className={arrowButtonClass("left", canScrollLeft)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className={arrowButtonClass("right", canScrollRight)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex xl:grid xl:grid-cols-4 gap-5 overflow-x-auto xl:overflow-x-visible pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {isLoading
                ? skeletonCards.map((_, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[84vw] sm:w-[45vw] md:w-[360px] lg:w-[390px] xl:w-full snap-start bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-pulse"
                  >
                    <div className="p-2 pb-0">
                      <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-t-[8px] rounded-bl-[15px] bg-gray-200" />
                    </div>

                    <div className="p-4 pt-3">
                      <div className="h-6 w-44 rounded bg-gray-200 mb-2" />
                      <div className="h-4 w-4/5 rounded bg-gray-200 mb-2" />
                      <div className="flex items-stretch gap-4 mb-3 border-b border-gray-100 pb-3">
                        <div className="h-4 w-24 rounded bg-gray-200" />
                        <div className="h-4 w-20 rounded bg-gray-200 ml-auto" />
                      </div>
                      <div className="h-4 w-3/4 rounded bg-gray-200 mb-4" />
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-10 w-24 rounded-md bg-gray-200" />
                        <div className="h-9 w-28 rounded-md bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))
                : courses.map((item) => (
                  <CourseCard
                    key={item.courseId}
                    item={item}
                    visible={visible}
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
      </div>

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
                <span
                  className={
                    "text-gray-500"
                  }
                >
                  {menuItem.icon}
                </span>

                <span className="text-gray-700">{menuItem.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </section>
  );
}
