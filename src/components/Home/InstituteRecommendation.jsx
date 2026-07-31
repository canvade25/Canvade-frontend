import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  MapPin,
  MoreVertical,
  Star,
  Share2,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import { sendEnquiry } from "../../../api/enquireApi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

const DEFAULT_INSTITUTE_API_PATH = "/api/institute/all";

const FALLBACK_INSTITUTES = [
  {
    id: "fallback-masai-engineering",
    name: "Masai School of Engineering",
    category: "Institute",
    mode: "Onsite & Online",
    location: "New atish market , jaipur, rajasthan, India",
    extraLocations: "",
    rating: "4.8",
    image: "institute.png",
  },
  {
    id: "fallback-excelr-solutions",
    name: "ExcelR solutions",
    category: "Institute",
    mode: "Onsite & Online",
    location: "Hno- 51/11/19/316 a, West Arjun nagar, AGRA, U.P.",
    extraLocations: "",
    rating: "4.8",
    image: "institute.png",
  },
  {
    id: "fallback-masai-engineering-2",
    name: "Masai School of Engineering",
    category: "Institute",
    mode: "Onsite & Online",
    location: "efgsbdgbvtdgtvbdt, erdvgedbvfbdfd, erfrevfd",
    extraLocations: "",
    rating: "4.8",
    image: "institute.png",
  },
  {
    id: "fallback-hello",
    name: "hello",
    category: "Institute",
    mode: "Onsite & Online",
    location: "Plot No. 5, Krishna Savitri Nivas, Vaishnav Vihar",
    extraLocations: "",
    rating: "4.8",
    image: "institute.png",
  },
];

export const getInstituteItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.institutes)) return data.institutes;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.institute)) return data.institute;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const getInstituteRoute = (instituteId) =>
  instituteId ? `/instituteview/${instituteId}` : "/instituteview";

export const normalizeInstitute = (institute, index) => {
  const locations = Array.isArray(institute?.locations)
    ? institute.locations.filter(Boolean)
    : Array.isArray(institute?.basicDetails?.locations)
      ? institute.basicDetails.locations.filter(Boolean)
      : [];

  const firstLocation = locations[0];
  const locationLabel = firstLocation
    ? typeof firstLocation === "string"
      ? firstLocation
      : [
          firstLocation.addressLine1,
          firstLocation.addressLine2,
          firstLocation.city,
          firstLocation.state,
          firstLocation.country,
        ]
          .filter(Boolean)
          .join(", ")
    : "Moti Nagar, New Delhi";

  return {
    id: institute?.id || institute?._id || index,
    anim: ["anim-left", "anim-top", "anim-bottom", "anim-right"][index % 4],
    name:
      institute?.instituteName ||
      institute?.name ||
      institute?.title ||
      institute?.basicDetails?.instituteName ||
      institute?.basicDetails?.name ||
      "Institute",
    category: institute?.category || institute?.type || "Institute",
    mode:
      "Onsite & Online" ||
      institute?.mode ||
      institute?.learningMode ||
      institute?.basicDetails?.mode ||
      institute?.basicDetails?.learningMode ||
      null, // dummy hataya

    rating:
      institute?.rating ||
      institute?.averageRating ||
      institute?.basicDetails?.rating ||
      null, // dummy hataya
      avgRating: institute?.avgRating || institute?.averageRating || institute?.rating || 0,

    location:
      institute?.location || institute?.basicDetails?.location || locationLabel,
    extraLocations:
      institute?.extraLocations ||
      institute?.basicDetails?.extraLocations ||
      (locations.length > 1 ? `${locations.length - 1} More` : ""),
    image:
      institute?.media?.photos?.[0] ||
      institute?.image ||
      institute?.thumbnail ||
      institute?.logo ||
      institute?.profileImage ||
      institute?.basicDetails?.image ||
      "institute.png",
  };
};

function InstituteRecommendationSection({
  title = "Institute Recommendation.",
  apiPath = DEFAULT_INSTITUTE_API_PATH,
}) {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const userRole = (
    localStorage.getItem("Role") ||
    localStorage.getItem("role") ||
    ""
  ).toLowerCase();
  const isStudentRole = userRole === "student";
  const [isLoading, setIsLoading] = useState(true);
  const [institutes, setInstitutes] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchInstitutes = async () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("Token");
      setIsLoading(true);

      try {
        const fetchInstituteList = async (path) => {
          const response = await fetch(`${API_BASE_URL}${path}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          });

          if (!response.ok) return [];

          const data = await response.json();
          return getInstituteItems(data);
        };

        let instituteList = await fetchInstituteList(apiPath);
        if (
          instituteList.length === 0 &&
          apiPath !== DEFAULT_INSTITUTE_API_PATH
        ) {
          instituteList = await fetchInstituteList(DEFAULT_INSTITUTE_API_PATH);
        }

        const displayItems =
          instituteList.length > 0 ? instituteList : FALLBACK_INSTITUTES;

        setInstitutes(displayItems.map(normalizeInstitute));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching institutes:", error);
          setInstitutes([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutes();
    return () => controller.abort();
  }, [apiPath]);

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
    const current = sliderRef.current;
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
    const menuHeight = 160;
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
    const { current } = sliderRef;
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

  const handleChatClick = async (institute) => {
    if (!isStudentRole) {
      toast.error("Please log in as a student to chat with an institute.");
      navigate("/get-started/login/student");
      return;
    }
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
  };

  const arrowButtonClass = (direction, active) =>
    [
      "h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-95",
      direction === "left"
        ? "border-[#16C79A] bg-white text-[#12B886] hover:bg-emerald-50"
        : "border-[#16C79A] bg-[#12B886] text-white hover:bg-[#0EA678]",
      active ? "" : "cursor-not-allowed",
    ].join(" ");

  const handleInstituteCardClick = async (institute) => {
    const instituteId = institute?.id;
    const token =
      localStorage.getItem("token") || localStorage.getItem("Token");

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

    navigate(getInstituteRoute(instituteId));
  };

  const copyInstituteLink = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/instituteview`);
  };

  const menuItems = [
    // {
    //   label: "Profile",
    //   icon: <Home size={16} />,
    //   onClick: () => navigate("/instituteview"),
    // },
    {
      label: "Share",
      icon: <Share2 size={16} />,
      onClick: copyInstituteLink,
    },
    {
      label: "Updates",
      icon: <Bell size={16} />,
      onClick: () => navigate("/updates"),
    },
  ];

  const skeletonCards = Array.from({ length: 4 });

  return (
    <section className="px-4 md:px-16 py-12 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-gray-800 tracking-tight">
            {title}
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
          ref={sliderRef}
          className="flex xl:grid xl:grid-cols-4 gap-5 overflow-x-auto xl:overflow-x-visible pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading ? (
            skeletonCards.map((_, index) => (
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
                    <div className="h-4 w-28 rounded bg-gray-200" />
                    <div className="h-4 w-12 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))
          ) : institutes.length > 0 ? (
            institutes.map((item) => (
              <InstituteCard
                key={item.id}
                item={item}
                onCardClick={() => handleInstituteCardClick(item)}
                onMenuClick={(e) => toggleMenu(item.id, e)}
                onChatClick={() => handleChatClick(item)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">
                No institutes to display at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Portal menu — rendered into document.body, never clipped */}
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
    </section>
  );
}

export function InstituteRecommendationTwo() {
  return (
    <InstituteRecommendationSection
      title="Institute Recommendation."
      apiPath="/api/institute/all?section=institute-recommendation-2"
    />
  );
}

export function InstituteRecommendationThree() {
  return (
    <InstituteRecommendationSection
      title="Institute Recommendation."
      apiPath="/api/institute/all?section=institute-recommendation-3"
    />
  );
}

export function InstituteRecommendationFour() {
  return (
    <InstituteRecommendationSection
      title="Institute Recommendation."
      apiPath="/api/institute/all?section=institute-recommendation-4"
    />
  );
}
// InstituteRecommendation.jsx ke top pe, InstituteRecommendationSection se PEHLE add karo:

export function InstituteCard({ item, onCardClick, onMenuClick, onChatClick }) {
  return (
    <div
      onClick={onCardClick}
      className="flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[45vw] md:w-[360px] lg:w-[390px] xl:w-full snap-start bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-500 hover:shadow-xl group cursor-pointer"
    >
      <div className="p-2 pb-0">
        <div className="relative">
          <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-t-[8px] rounded-bl-[15px]">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`w-1.5 h-1.5 rounded-full ${dot === 2 ? "bg-white w-2.5" : "bg-white/50"}`}
                />
              ))}
            </div>

            <div className="absolute bottom-0 right-0 bg-white pl-2 pt-0 rounded-tl-lg flex items-center gap-2 h-8">
              <span className="bg-[#FFC107] text-[9px] text-white px-2 py-0.5 rounded-md capitalize">
                Top Rated
              </span>
              <div className="flex items-center gap-0.5 pr-3">
                <Star size={12} fill="#FFC107" stroke="#FFC107" />
                <span className="text-[11px] text-gray-700">
                  {item.avgRating > 0 && (
                    <div className="flex items-center gap-0.5 pr-3">
                      <Star size={12} fill="#FFC107" stroke="#FFC107" />
                      <span className="text-[11px] text-gray-700">
                        {Number(item.avgRating).toFixed(1)}
                      </span>
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-3">
        <h3 className="text-base font-medium text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[40px]">
          {item.name}
        </h3>

        <div className="flex items-stretch text-gray-700 text-[11px] mb-2 border-b border-gray-200">
          <div className="flex items-center gap-1.5 font-medium pb-3 pr-4">
            <Home className="w-4 h-4 text-gray-700" />
            <span>{item.category}</span>
          </div>
          <div className="flex items-center gap-2.5 font-medium border-l border-gray-300 pl-6 pb-3 ml-auto">
            <BookOpen className="w-4 h-4 text-gray-700" />
            <span>{item.mode}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-700 text-[12px] mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0 text-gray-700" />
          <span className="truncate">
            {item.location}{" "}
            {item.extraLocations && (
              <span className="text-gray-800 ml-1">
                ({item.extraLocations})
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChatClick?.(item);
            }}
            className="flex-grow py-2 rounded-lg bg-[#E5E5E5] hover:bg-emerald-600 hover:text-white text-gray-700 text-[12px] font-semibold transition-all"
          >
            Chat
          </button>

          <button
            type="button"
            onClick={onMenuClick}
            className="ml-2 p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-[#707070]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InstituteRecommendation() {
  return <InstituteRecommendationSection />;
}
