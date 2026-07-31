// src/hooks/useBreakpoint.js
import { useState, useEffect } from "react";
import { BREAKPOINTS } from "../../../utils/constants";

function useBreakpoint() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return {
    isMobile: w < BREAKPOINTS.mobile,
    isTablet: w >= BREAKPOINTS.mobile && w < BREAKPOINTS.tablet,
    isDesktop: w >= BREAKPOINTS.tablet,
    width: w,
  };
}

export default useBreakpoint;