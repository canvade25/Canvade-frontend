/**
 * FloatingRightBar Component
 * Right-side floating panel: Search + Canday AI + Back to top
 * Light theme matching the site's design
 */

import React, { memo, useState } from 'react';
import { ArrowUp, Search, MessageCircle } from 'lucide-react';
import { useScrollToTop } from '../hooks/useHeroHooks';
import { useNavigate } from 'react-router-dom';

const FloatingRightBar = memo(function FloatingRightBar() {
  const { showButton, scrollToTop } = useScrollToTop();
  const navigate = useNavigate();
  const [aiHover, setAiHover] = useState(false);

  const btnBase =
    'flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-md active:translate-y-0 focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2';

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col items-center gap-2">
      {/* Search */}
      <button
        type="button"
        onClick={() => navigate('/search')}
        className={btnBase}
        aria-label="Search courses and institutes"
        title="Search"
      >
        <Search size={18} strokeWidth={2} aria-hidden="true" />
      </button>

      {/* Canday AI Chatbot */}
      <div className="relative">
        <button
          type="button"
          onClick={() => navigate('/chat')}
          onMouseEnter={() => setAiHover(true)}
          onMouseLeave={() => setAiHover(false)}
          className={`${btnBase} border-purple-200 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600`}
          aria-label="Open Canday AI chatbot"
          title="Canday AI"
        >
          <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        {aiHover && (
          <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-[11px] font-medium text-white shadow-lg pointer-events-none">
            Canday AI
          </span>
        )}
      </div>

      {/* Back to Top */}
      {showButton && (
        <button
          type="button"
          onClick={scrollToTop}
          className={`${btnBase} border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700`}
          aria-label="Scroll to top of page"
          title="Back to top"
        >
          <ArrowUp size={18} strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

export default FloatingRightBar;
