import React, { useState, useEffect, useRef } from "react";
import UpdateCard from "../Updates/UpdateCard";

export default function NewsletterSection() {
  // API Integration States
  const [updates, setUpdates] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

  // Fetch data exactly matching your backend API payload structure
  useEffect(() => {
    const fetchNewsletterUpdates = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/updates/all`);
        const json = await response.json();
        if (json && json.success && Array.isArray(json.data)) {
          setUpdates(json.data);
        }
      } catch (error) {
        console.error("Error fetching updates for newsletter:", error);
      }
    };
    fetchNewsletterUpdates();
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;
    const maxScroll = scrollWidth - containerWidth;
    if (maxScroll <= 0) return;
    const percentage = scrollLeft / maxScroll;
    const totalItems = Math.min(updates.length, 4);
    const index = Math.round(percentage * (totalItems - 1));
    setActiveIndex(Math.max(0, Math.min(index, totalItems - 1)));
  };

  const scrollToCard = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector(`[data-card-index="${index}"]`);
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const displayedUpdates = updates.slice(0, 4);

  return (
    <section className="px-4 md:px-16 py-12 bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center w-full max-w-[1100px] mx-auto mb-10 px-2">
          <h2 className="text-2xl md:text-4xl font-heading font-medium text-gray-800 mb-6 tracking-tight">
            Stay Updated with <span className="text-[#008566]">What's Happening</span>{" "}
            in <span className="text-[#008566]">Education</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-[920px] mx-auto -mt-3">
            Discover the latest announcements, student achievements, workshops, admissions, events, press releases, and institute updates from across the CANVADE network. Follow the institutions and categories you care about and stay informed about opportunities that could shape your future.
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex xl:grid xl:grid-cols-4 gap-5 overflow-x-auto xl:overflow-x-visible pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 md:-mx-16 md:px-16 xl:mx-0 xl:px-0 scroll-px-4 md:scroll-px-16 xl:scroll-px-0"
        >
          {displayedUpdates.map((item, idx) => (
            <div
              key={item.updateId || `newsletter-${idx}`}
              data-card-index={idx}
              className="w-[85vw] max-w-[320px] sm:max-w-none sm:w-[45vw] md:w-[30vw] xl:w-full flex-shrink-0 snap-center"
            >
              <UpdateCard
                {...item}
                image={item.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500"}
                date={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
              />
            </div>
          ))}
        </div>

        {/* Pagination Dots (Mobile/Tablet only) */}
        {displayedUpdates.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4 xl:hidden">
            {displayedUpdates.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === idx ? "w-6 bg-[#008566]" : "w-2 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}