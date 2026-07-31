import React, { useState, useRef, useEffect } from "react";
import { X, Play } from "lucide-react";

const REEL_DATA = [
  {
    id: 1,
    video: "/Find%20the%20right%20course%20faster.mp4",
    title: "Find the Right Course Faster",
    subtitle: "Quick search across thousands of top-rated programs",
  },
  {
    id: 2,
    video: "/Compare%20before%20you%20choose.mp4",
    title: "Compare Before You Choose",
    subtitle: "Compare fees, mode, ratings & campus transparency",
    highlight: true,
  },
  {
    id: 3,
    video: "/Enquire%20and%20enroll%20safely.mp4",
    title: "Enquire & Enroll Safely",
    subtitle: "Direct student enrollment with zero hidden costs",
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
      className={`group relative cursor-pointer flex flex-col transition-all duration-500 ease-out mx-auto w-full max-w-[270px] ${reel.highlight ? "lg:-translate-y-2" : ""
        }`}
      style={{ touchAction: "pan-x pan-y" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onPlay(reel)}
    >
      {/* Outer Glow & Card Container */}
      <div
        className={`relative aspect-[9/16] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-slate-900 border-2 transition-all duration-500 transform-gpu isolate ${reel.highlight
          ? "border-emerald-400/80 shadow-[0_12px_30px_rgba(16,185,129,0.22)] group-hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)] group-hover:scale-[1.03]"
          : "border-slate-200/80 shadow-lg group-hover:border-emerald-400/60 group-hover:shadow-[0_15px_35px_rgba(16,185,129,0.16)] group-hover:scale-[1.02]"
          }`}
      >
        {/* Video preview element */}
        <video
          ref={videoRef}
          src={`${reel.video}#t=1.5`}
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
        />

        {/* Gradient Overlays for readable text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border border-white/50 backdrop-blur-md shadow-xl transition-all duration-500 ${isHovered
              ? "scale-110 bg-emerald-500 text-white border-emerald-300"
              : "bg-white/30 text-white group-hover:bg-emerald-500 group-hover:border-emerald-400"
              }`}
          >
            <Play size={22} className="ml-0.5 fill-current drop-shadow-md" />
          </div>
        </div>

        {/* Bottom Text Overlay inside the Card */}
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
        {/* Modal Header */}
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

        {/* Video Player */}
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
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const centerMiddleSlide = () => {
      if (scrollContainerRef.current && scrollContainerRef.current.clientWidth > 0) {
        const middleChild = scrollContainerRef.current.children[1];
        if (middleChild) {
          const containerWidth = scrollContainerRef.current.clientWidth;
          const targetScroll = middleChild.offsetLeft - (containerWidth - middleChild.clientWidth) / 2;
          scrollContainerRef.current.scrollLeft = targetScroll;
        }
      }
    };

    centerMiddleSlide();
    const timer = setTimeout(centerMiddleSlide, 150);

    window.addEventListener("resize", centerMiddleSlide);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", centerMiddleSlide);
    };
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const children = scrollContainerRef.current.children;
      let closestIndex = 0;
      let minDistance = Infinity;
      const containerCenter = scrollLeft + clientWidth / 2;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const distance = Math.abs(containerCenter - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      setActiveIndex(closestIndex);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-14 bg-slate-50/60 select-none overflow-hidden border-y border-slate-100">
      <div className="max-w-[940px] mx-auto">

        {/* Section Header - Exact Image 2 Match */}
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-medium text-slate-900 tracking-tight mb-3">
            Understand{" "}
            <span className="text-emerald-600 font-medium">
              CANVADE
            </span>{" "}
            in Seconds
          </h2>

          <p className="text-slate-500 pb-2 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Watch quick reels to see how Canvade helps you discover courses,
            compare institutes, and choose the right path - all in one place.
          </p>
        </div>

        {/* ── DESKTOP & TABLET VIEW (Compact Grid) ── */}
        <div className="hidden md:grid grid-cols-3 gap-5 lg:gap-7 items-center max-w-[880px] mx-auto">
          {REEL_DATA.map((reel) => (
            <ReelCard key={reel.id} reel={reel} onPlay={setSelectedReel} />
          ))}
        </div>

        {/* ── MOBILE VIEW (Swipeable Horizontal Carousel) ── */}
        <div className="block md:hidden relative">
          {/* Carousel Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 px-2 -mx-2 no-scrollbar scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {REEL_DATA.map((reel) => (
              <div
                key={reel.id}
                className="w-[85vw] max-w-[275px] shrink-0 snap-center"
                style={{ touchAction: "pan-x pan-y" }}
              >
                <ReelCard reel={reel} onPlay={setSelectedReel} />
              </div>
            ))}
          </div>

          {/* Mobile Carousel Indicators (Dots) */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {REEL_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const child = scrollContainerRef.current.children[idx];
                    if (child) {
                      const containerWidth = scrollContainerRef.current.clientWidth;
                      const scrollLeft = child.offsetLeft - (containerWidth - child.clientWidth) / 2;
                      scrollContainerRef.current.scrollTo({
                        left: scrollLeft,
                        behavior: "smooth",
                      });
                    }
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? "w-5 bg-emerald-600" : "w-1.5 bg-slate-300"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Video Fullscreen Modal */}
      {selectedReel && (
        <VideoModal reel={selectedReel} onClose={() => setSelectedReel(null)} />
      )}
    </section>
  );
}