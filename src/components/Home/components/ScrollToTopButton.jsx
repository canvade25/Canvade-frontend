/**
 * ScrollToTopButton Component
 * Floating button to scroll page to top smoothly
 * Only visible when user has scrolled down
 */

import React, { memo } from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollToTop } from '../hooks/useHeroHooks';

const ScrollToTopButton = memo(function ScrollToTopButton() {
  const { showButton, scrollToTop } = useScrollToTop();

  return (
    showButton && (
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed right-4 bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-100 bg-white text-emerald-700 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2"
        aria-label="Scroll to top of page"
        title="Back to top"
      >
        <ArrowUp size={20} strokeWidth={2.5} aria-hidden="true" />
      </button>
    )
  );
});

export default ScrollToTopButton;
