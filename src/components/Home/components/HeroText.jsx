import React, { memo } from 'react';
import { HERO_CONTENT } from '../constants/heroConstants';

const HeroText = memo(function HeroText() {
  return (
    <div className="font-sans select-none max-w-full lg:max-w-md xl:max-w-lg">
      {/* 1. Badge: Letter spacing ko tracking-wide par set kiya */}
      <p className="text-[11px] sm:text-xs md:text-[13px] lg:text-[13px] font-bold uppercase tracking-wider text-amber-400 mb-2 sm:mb-3">
        {HERO_CONTENT.badge}
      </p>

      {/* 2. Main Heading: Font size scaling & line height fix */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.4rem] xl:text-[2.65rem] font-semibold text-white leading-[1.12] tracking-normal mb-3 sm:mb-4">
        {HERO_CONTENT.heading.map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < HERO_CONTENT.heading.length - 1 && <br className="hidden sm:inline" />}
            {idx < HERO_CONTENT.heading.length - 1 && ' '}
          </React.Fragment>
        ))}
      </h1>

      {/* 3. Description: Pure white text and clean line height */}
      <p className="text-xs sm:text-sm md:text-base lg:text-[13.5px] xl:text-[14.5px] text-[#ffffffe0] leading-relaxed mb-4 sm:mb-5 max-w-lg lg:max-w-sm xl:max-w-md font-normal">
        Discover{' '}
        {HERO_CONTENT.description.map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < HERO_CONTENT.description.length - 1 && <br className="hidden md:inline" />}
            {idx < HERO_CONTENT.description.length - 1 && ' '}
          </React.Fragment>
        ))}
      </p>

      {/* 4. Tagline: Weight font-medium aur opacity balance */}
      <p className="text-xs sm:text-sm lg:text-[13px] xl:text-[14px] font-medium text-[#ffffffe0] tracking-normal">
        {HERO_CONTENT.tagline}
      </p>
    </div>
  );
});

export default HeroText;