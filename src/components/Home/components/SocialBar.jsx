/**
 * SocialBar Component
 * Fixed left-side floating social media icons bar
 * Light theme — Instagram, X (Twitter), LinkedIn
 * Only visible when user has scrolled a bit
 */

import React, { memo, useState, useEffect } from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

const SOCIAL_LINKS = [
  {
    key: 'instagram',
    label: 'Instagram',
    ariaLabel: 'Follow us on Instagram',
    url: 'https://www.instagram.com/canvade_/',
    icon: <Instagram size={17} aria-hidden="true" />,
    hoverColor: 'hover:text-pink-500 hover:border-pink-300 hover:bg-pink-50',
  },
  {
    key: 'x',
    label: 'X (Twitter)',
    ariaLabel: 'Follow us on X',
    url: 'https://x.com/Canvade_',
    icon: <FaXTwitter size={16} aria-hidden="true" />,
    hoverColor: 'hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    ariaLabel: 'Follow us on LinkedIn',
    url: 'https://www.linkedin.com/company/canvade/?viewAsMember=true',
    icon: <Linkedin size={17} aria-hidden="true" />,
    hoverColor: 'hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50',
  },
];

const SocialBar = memo(function SocialBar() {
  return (
    <nav
      className="fixed left-4 bottom-6 z-50 flex flex-col items-center gap-2"
      aria-label="Social media links"
    >
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.key}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${social.hoverColor}`}
          aria-label={social.ariaLabel}
          title={social.label}
        >
          {social.icon}
          <span className="sr-only">{social.label}</span>
        </a>
      ))}
    </nav>
  );
});

export default SocialBar;
