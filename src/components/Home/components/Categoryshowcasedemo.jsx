import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryShowcase from './Categoryshowcase';
import { categories } from '../constants/Categoriesdata';

const ROTATE_INTERVAL_MS = 30000;
const FADE_DURATION_MS = 300;

export default function CategoryShowcaseDemo() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * categories.length)
  );
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Preload all category images on mount so image switching is 100% instant without network latency flicker
  useEffect(() => {
    categories.forEach((cat) => {
      if (cat.image?.src) {
        const img = new Image();
        img.src = cat.image.src;
      }
      if (Array.isArray(cat.images)) {
        cat.images.forEach((i) => {
          if (i?.src) {
            const img = new Image();
            img.src = i.src;
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (isPaused) return undefined;

    const rotateTimer = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
        setIsVisible(true);
      }, FADE_DURATION_MS);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(rotateTimer);
  }, [isPaused]);

  const cat = categories[currentIndex];
  if (!cat) return null;

  const handleExplore = (category) => {
    navigate(`/search?category=${encodeURIComponent(category)}`);
  };

  const handleTabClick = (index) => {
    if (index === currentIndex) return;
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsVisible(true);
    }, FADE_DURATION_MS / 2);
  };

  return (
    <div
      className="py-4 md:py-6 w-full max-w-[1700px] mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] flex flex-col items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Category Tabs Header (Commented out)
      <div className="mb-4 sm:mb-6 w-full overflow-x-auto no-scrollbar py-1 px-1">
        <div className="flex items-center justify-start md:justify-center gap-2 min-w-max mx-auto">
          {categories.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id || item.category}
                type="button"
                onClick={() => handleTabClick(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#007965] text-white shadow-sm scale-105 font-semibold'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/90 hover:text-slate-900'
                }`}
              >
                {item.category}
              </button>
            );
          })}
        </div>
      </div>
      */}

      <div
        className={`w-full transition-opacity duration-300 ease-in-out transform-gpu ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.995]'
          }`}
      >
        <CategoryShowcase
          image={cat.image}
          images={cat.images}
          category={cat.category}
          description={cat.description}
          features={cat.features}
          onCtaClick={() => handleExplore(cat.category)}
        />
      </div>
    </div>
  );
}

