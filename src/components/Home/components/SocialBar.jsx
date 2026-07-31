/**
 * SocialBar Component
 * Displays social media icons in a vertical bar
 * Only visible on desktop devices
 */

import React, { memo } from 'react';
import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { SOCIAL_ICONS } from '../constants/heroConstants';

const ICON_MAP = {
  facebook: <Facebook size={15} aria-hidden="true" />,
  instagram: <Instagram size={15} aria-hidden="true" />,
  x: <FaXTwitter size={14} aria-hidden="true" />,
  linkedin: <Linkedin size={15} aria-hidden="true" />,
  youtube: <Youtube size={15} aria-hidden="true" />,
};

const SocialBar = memo(function SocialBar() {
  return (
    <nav
      className="absolute left-0 top-1/2 z-40 -translate-y-1/2 flex flex-col gap-0.5 rounded-full border border-white/10 bg-black/75 p-1.5 backdrop-blur-md"
      aria-label="Social media links"
    >
      {SOCIAL_ICONS.map((social) => (
        <a
          key={social.key}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center rounded-full p-2 text-white/80 transition-all duration-200 hover:scale-110 hover:text-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
          aria-label={social.ariaLabel}
          title={social.label}
        >
          {ICON_MAP[social.key]}
          <span className="sr-only">{social.label}</span>
        </a>
      ))}
    </nav>
  );
});

export default SocialBar;
