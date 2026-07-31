import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock3,
  BookOpen,
  MapPin,
  MoreVertical,
  ArrowRight,
  Scale,
  MessageSquare,
  Heart,
  Bell,
  Share2,
} from "lucide-react";
import CourseCard from "./CourseCard";

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

const COURSE_DATA = [
  {
    id: 1,
    anim: "anim-left",
    title:
      "Philosophy of Doctorate in Human Behavior and Phycological Research",
    institution: "ICAI - The Institute of Chartered Accountants",
    duration: "4 Year",
    mode: "Onsite & Online",
    location: "Moti Nagar, New Delhi",
    oldPrice: "₹ 3,40,000",
    newPrice: "₹ 2,90,000",
    rating: "4.8",
    image: "course.png",
  },
  {
    id: 2,
    anim: "anim-top",
    title:
      "Philosophy of Doctorate in Human Behavior and Phycological Research",
    institution: "ICAI - The Institute of Chartered Accountants",
    duration: "4 Year",
    mode: "Onsite & Online",
    location: "Moti Nagar, New Delhi",
    oldPrice: "₹ 3,40,000",
    newPrice: "₹ 2,90,000",
    rating: "4.8",
    image: "course.png",
  },
  {
    id: 3,
    anim: "anim-bottom",
    title:
      "Philosophy of Doctorate in Human Behavior and Phycological Research",
    institution: "ICAI - The Institute of Chartered Accountants",
    duration: "4 Year",
    mode: "Onsite & Online",
    location: "Moti Nagar, New Delhi",
    oldPrice: "₹ 3,40,000",
    newPrice: "₹ 2,90,000",
    rating: "4.8",
    image: "course.png",
  },
  {
    id: 4,
    anim: "anim-right",
    title:
      "Philosophy of Doctorate in Human Behavior and Phycological Research",
    institution: "ICAI - The Institute of Chartered Accountants",
    duration: "4 Year",
    mode: "Onsite & Online",
    location: "Moti Nagar, New Delhi",
    oldPrice: "₹ 3,40,000",
    newPrice: "₹ 2,90,000",
    rating: "4.8",
    image: "course.png",
  },
];

export default function WorkshopsRegistration() {
  const scrollRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

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

  const toggleMenu = (id, e) => {
    e.stopPropagation();
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
    setOpenMenuId(id);
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const card = current.querySelector(":scope > div");
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

  const menuItems = [
    {
      label: "Compare",
      icon: <Scale size={16} />,
      onClick: () => navigate("/compare"),
    },
    {
      label: "Enquiry",
      icon: <MessageSquare size={16} />,
      onClick: () => navigate("/chat"),
    },
    {
      label: "Add to Learn List",
      icon: <Heart size={16} />,
      onClick: () => navigate("/cart"),
    },
    {
      label: "Notify When Active",
      icon: <Bell size={16} />,
      onClick: () => navigate("/notifications"),
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

  const skeletonCards = Array.from({ length: 4 });

  return (
    <section className="px-4 md:px-16 py-12 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-gray-800 tracking-tight">
            Workshops Registration
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={arrowButtonClass("left", canScrollLeft)}
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
            <button
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
                    <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-t-[8px] rounded-bl-[15px] bg-gray-200" />
                  </div>
                  <div className="p-4 pt-3 space-y-3">
                    <div className="h-4 w-28 rounded bg-gray-200" />
                    <div className="h-5 w-4/5 rounded bg-gray-200" />
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-20 rounded bg-gray-200" />
                      <div className="h-4 w-16 rounded bg-gray-200" />
                    </div>
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-28 rounded-md bg-gray-200" />
                      <div className="h-9 w-24 rounded-md bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))
            : COURSE_DATA.map((item) => (
                <CourseCard
                  key={item.id}
                  item={item}
                  visible={visible}
                  onCardClick={() => trackCourseViewAndNavigate(item, navigate)}
                  onInstituteClick={(e) => {
                    e.stopPropagation();
                    trackInstituteViewAndNavigate(item, navigate);
                  }}
                  onEnrollClick={(e) => {
                    e.stopPropagation();
                    trackCourseViewAndNavigate(item, navigate);
                  }}
                  onMenuClick={(e) => toggleMenu(item.id, e)}
                />
              ))}
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
          document.body
        )}
    </section>
  );
}
