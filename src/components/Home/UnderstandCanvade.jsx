import React, { useState, useRef, useEffect } from "react";
import { X, Play, ChevronLeft, ChevronRight } from "lucide-react";

const REEL_DATA = [
  {
    id: 1,
    video: "/testimonial-1.mp4",
    title: "Find the Right Course Faster",
    subtitle: "Quick search across thousands of top-rated programs",
  },
  {
    id: 2,
    video: "/testimonial-2.mp4",
    title: "Compare Before You Choose",
    subtitle: "Compare fees, mode, ratings & campus transparency",
    highlight: true,
  },
  {
    id: 3,
    video: "/testimonial-3.mp4",
    title: "Enquire & Enroll Safely",
    subtitle: "Direct student enrollment with zero hidden costs",
  },
  {
    id: 4,
    video: "/testimonial-4.mp4",
    title: "Explore Internships",
    subtitle: "Apply for verified internship roles directly",
  },
  {
    id: 5,
    video: "/testimonial-5.mp4",
    title: "Skill Upgrades",
    subtitle: "Learn trending industry-relevant courses",
  },
  {
    id: 6,
    video: "/testimonial-6.mp4",
    title: "Build Resume",
    subtitle: "Create professional portfolio layouts easily",
  },
  {
    id: 7,
    video: "/testimonial-7.mp4",
    title: "Find Placements",
    subtitle: "Connect with verified partner hiring teams",
  },
];

/* ── Individual Reel Card Component ── */
function ReelCard({ reel, onPlay }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay preview blocked:", err);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 1.5;
    }
  };

  return (
    <div
      className={`group relative cursor-pointer flex flex-col transition-all duration-500 ease-out mx-auto w-full ${
        reel.highlight ? "lg:-translate-y-1" : ""
      }`}
      style={{ touchAction: "pan-x pan-y" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onPlay(reel)}
    >
      <div
        className={`relative aspect-[9/16] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-slate-900 border-2 transition-all duration-500 transform-gpu isolate ${
          reel.highlight
            ? "border-emerald-400/80 shadow-[0_12px_30px_rgba(16,185,129,0.22)] group-hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)] group-hover:scale-[1.03]"
            : "border-slate-200/80 shadow-lg group-hover:border-emerald-400/60 group-hover:shadow-[0_15px_35px_rgba(16,185,129,0.16)] group-hover:scale-[1.02]"
        }`}
      >
        <video
          ref={videoRef}
          src={`${reel.video}#t=1.5`}
          loop
          muted
          playsInline
          preload="metadata"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border border-white/50 backdrop-blur-md shadow-xl transition-all duration-500 ${
              isHovered
                ? "scale-110 bg-emerald-500 text-white border-emerald-300"
                : "bg-white/30 text-white group-hover:bg-emerald-500 group-hover:border-emerald-400"
            }`}
          >
            <Play size={22} className="ml-0.5 fill-current drop-shadow-md" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-left z-10 pointer-events-none">
          <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-0.5 drop-shadow-md group-hover:text-emerald-300 transition-colors">
            {reel.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-white/80 leading-snug line-clamp-2 drop-shadow-xs font-normal">
            {reel.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Fullscreen Video Modal Component ── */
function VideoModal({ reel, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay with sound prevented by browser. Playing muted...", error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch((e) => console.error("Muted fallback play failed:", e));
          }
        });
      }
    }
  }, [reel]);

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs sm:max-w-sm aspect-[9/16] max-h-[82vh] bg-black rounded-[28px] overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.3)] border border-white/20 flex flex-col transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 p-3.5 bg-gradient-to-b from-black/90 via-black/50 to-transparent z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-white font-bold text-xs sm:text-sm drop-shadow-md truncate max-w-[200px] sm:max-w-[240px]">
              {reel.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Close video"
          >
            <X size={16} />
          </button>
        </div>

        <video
          ref={videoRef}
          src={reel.video}
          controls
          playsInline
          className="w-full h-full object-contain bg-black"
        />
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function UnderstandCanvade() {
  const [selectedReel, setSelectedReel] = useState(null);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtons = () => {
    const current = scrollContainerRef.current;
    if (current) {
      const maxScrollLeft = current.scrollWidth - current.clientWidth;
      setCanScrollLeft(current.scrollLeft > 2);
      setCanScrollRight(current.scrollLeft < maxScrollLeft - 2);
    }
  };

  useEffect(() => {
    const current = scrollContainerRef.current;
    if (!current) return;

    updateButtons();
    current.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      current.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  const scroll = (direction) => {
    const { current } = scrollContainerRef;
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
      setTimeout(updateButtons, 350);
    }
  };

  const arrowButtonClass = (direction, active) =>
    [
      "h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-95",
      direction === "left"
        ? "border-[#16C79A] bg-white text-[#12B886] hover:bg-emerald-50"
        : "border-[#16C79A] bg-[#12B886] text-white hover:bg-[#0EA678]",
      active ? "" : "cursor-not-allowed opacity-50",
    ].join(" ");

  return (
    <section className="w-full max-w-[1700px] mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-14 bg-slate-50/60 select-none overflow-hidden border-y border-slate-100">
      <div className="w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 w-full mx-auto">
          <div className="w-full flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-4xl font-medium text-slate-900 tracking-tight mb-2">
              Understand <strong className="font-extrabold text-emerald-600">CANVADE</strong> in Seconds
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl">
              Watch quick reels to see how Canvade helps you discover courses,
              compare institutes, and choose the right path - all in one place.
            </p>
          </div>

          <div className="flex gap-2 self-end">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={arrowButtonClass("left", canScrollLeft)}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={arrowButtonClass("right", canScrollRight)}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory scroll-smooth w-full mx-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {REEL_DATA.map((reel) => (
            <div
              key={reel.id}
              className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[45vw] md:w-[290px] snap-start"
            >
              <ReelCard reel={reel} onPlay={setSelectedReel} />
            </div>
          ))}
        </div>

      </div>

      {/* Video Fullscreen Modal */}
      {selectedReel && (
        <VideoModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
      )}
    </section>
  );
}