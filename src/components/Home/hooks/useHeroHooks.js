/**
 * Custom hooks for HomeHero component
 * Responsible for managing responsive behavior and animations
 */

import { useState, useEffect, useCallback } from 'react';
import { BREAKPOINTS, ANIMATION } from '../constants/heroConstants';

/**
 * Hook for tracking window width and determining device type
 * Uses debouncing to prevent excessive re-renders
 *
 * @returns {Object} Object containing width and device type flags
 */
export function useResponsiveDesign() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.WIDE
  );

  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    width,
    isMobile: width < BREAKPOINTS.TABLET,
    isTablet: width >= BREAKPOINTS.TABLET && width < BREAKPOINTS.DESKTOP,
    isDesktop: width >= BREAKPOINTS.DESKTOP,
    isWide: width >= BREAKPOINTS.WIDE,
  };
}

/**
 * Hook for managing fade-in animation on component mount
 *
 * @returns {boolean} Whether element should be visible
 */
export function useFadeInAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, ANIMATION.duration / 6);

    return () => clearTimeout(timer);
  }, []);

  return isVisible;
}

/**
 * Hook for managing background image rotation
 * Handles fade transitions between images
 *
 * @param {string[]} images Array of image URLs
 * @returns {Object} Current image index and fading state
 */
export function useBackgroundRotation(images) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIsFading(true);
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsFading(false);
      }, ANIMATION.fadeInDuration);

      return () => clearTimeout(timer);
    }, ANIMATION.bgSwitchInterval);

    return () => clearInterval(interval);
  }, [images.length]);

  return { currentIndex, isFading };
}

/**
 * Hook for managing form state with validation
 *
 * @param {Object} initialState Initial form state
 * @returns {Object} Form state and handlers
 */
export function useFormState(initialState) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name] && errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [touched, errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    formData,
    errors,
    touched,
    setFormData,
    setErrors,
    handleChange,
    handleBlur,
    reset,
  };
}

/**
 * Hook for managing scroll to top button visibility
 *
 * @returns {boolean} Whether button should be visible
 */
export function useScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return { showButton, scrollToTop };
}
