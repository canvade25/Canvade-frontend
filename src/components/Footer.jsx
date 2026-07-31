import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SOCIAL_ICONS } from "./Home/constants/heroConstants";
import { sendContactMessage } from "../../api/supportApi";
const LOGO_SRC = "/canvade1.png";

export default function Footer() {
  const navigate = useNavigate();
  const isLoggedIn = !!(localStorage.getItem("token") || localStorage.getItem("Token"));
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to send a message");
      navigate("/login");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a message first");
      return;
    }

    setSending(true);
    try {
      await sendContactMessage(message.trim());
      toast.success("Message sent to support");
      setMessage("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const footerLinks = {
    "Other Actions": [
      // "Value we Provide (Students)",
      // "Trust we Build (Institutions)",
      "About Canvade",
      "Help Center",
      "Contact us",
      "Blogs & Press Release",
    ],
    "Future Skills": [
      "AI & ML",
      "Data Science",
      "Cybersecurity",
      "Robotics & Automation",
      "Renewable Energy",
      "Biotechnology",
      "Cloud Computing",
      "Financial Technology",
    ],
    "Popular Searches": [
      "Top Collages (Country)",
      "Top Collages (City)",
      "Weekend Institutes (Country)",
      "Weekend Institutes (City)",
      "Short Term Course",
      "Workshops (Country)",
      "Workshops (City)",
      "Placement Guarantee",
    ],
  };

  const socialUrl = (key) => SOCIAL_ICONS.find((s) => s.key === key)?.url;

  const socialIcons = [
    {
      name: "ig",
      url: socialUrl("instagram"),
      svg: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      ),
    },
    {
      name: "fb",
      url: socialUrl("facebook"),
      svg: (
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
      ),
    },
    {
      name: "li",
      url: socialUrl("linkedin"),
      svg: (
        <path d="M22.225 0h-20.451c-.98 0-1.774.795-1.774 1.774v20.451c0 .98.794 1.774 1.774 1.774h20.451c.981 0 1.775-.794 1.775-1.774v-20.451c0-.979-.794-1.774-1.775-1.774zm-14.444 20.451h-3.557v-11.445h3.557v11.445zm-1.778-12.926c-1.139 0-2.062-.922-2.062-2.061 0-1.14.923-2.061 2.062-2.061 1.138 0 2.061.921 2.061 2.061 0 1.139-.923 2.061-2.061 2.061zm16.222 12.926h-3.555v-5.572c0-1.328-.026-3.037-1.852-3.037-1.852 0-2.137 1.447-2.137 2.943v5.666h-3.556v-11.445h3.414v1.561h.049c.475-.9 1.636-1.848 3.366-1.848 3.599 0 4.261 2.368 4.261 5.448v6.284z" />
      ),
    },
    {
      name: "x",
      url: socialUrl("x"),
      svg: (
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
      ),
    },
    {
      name: "yt",
      url: socialUrl("youtube"),
      svg: (
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      ),
    },
  ];

  return (
    <footer className="bg-[#333333] text-white pt-12 md:pt-16 pb-8 px-5 sm:px-8 md:px-16  overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="lg:col-span-4 pr-0 lg:pr-12">
            <img
              src={LOGO_SRC}
              alt="Canvade"
              className="h-9 md:h-10 w-auto mb-6"
            />
            <p className="text-[#cccccc] text-[13px] leading-relaxed mb-8 text-left md:text-justify ">
              Canvade is a discovery-first platform that helps students easily
              explore courses and institutions. From local institutes to global
              education hubs, students can review essential course details,
              compare options, and confidently choose the right place to learn
              and grow.
            </p>

            <div className="flex flex-wrap gap-3">
              {socialIcons.map((icon, i) => (
                <a
                  key={i}
                  href={icon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={icon.name}
                  className="h-8 w-8 rounded-full bg-[#4d4d4d] flex items-center justify-center cursor-pointer hover:bg-emerald-500 transition-all duration-300"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white/90"
                  >
                    {icon.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 sm:grid sm:grid-cols-3 sm:gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
               <div key={title}>
                <h4 className="text-[14px] md:text-[15px] text-white font-heading font-medium mb-4 md:mb-5 tracking-tight">
                  {title}
                </h4>
                 <ul className="flex flex-wrap gap-x-3 gap-y-1.5 sm:flex-col sm:gap-y-2.5 md:gap-y-3">
                  {links.map((link, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 group cursor-pointer"
                    >
                      <span className="text-white mt-1.5 h-1 w-1 rounded-full bg-white shrink-0 hidden sm:inline-block" />

                      {link === "About Canvade" ? (
  <Link
    to="/about"
    className="text-[#cccccc] text-[11px] md:text-[12px] group-hover:text-white transition-colors"
  >
    {link}
  </Link>
) : link === "Help Center" ? (
  <Link
    to="/help-center"
    className="text-[#cccccc] text-[11px] md:text-[12px] group-hover:text-white transition-colors"
  >
    {link}
  </Link>
) :link === "Blogs & Press Release" ? (
  <Link
    to="/updates"
    className="text-[#cccccc] text-[11px] md:text-[12px] group-hover:text-white transition-colors"
  >
    {link}
  </Link>
) : title === "Future Skills" ? (
  <button
    type="button"
    onClick={() => navigate(`/search?category=${encodeURIComponent(link)}`)}
    className="text-left text-[#cccccc] text-[11px] md:text-[12px] group-hover:text-white transition-colors"
  >
    {link}
  </button>
) : (
  <span className="text-[#cccccc] text-[11px] md:text-[12px] group-hover:text-white transition-colors">
    {link}
  </span>
)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {/* <input
                type="text"
                placeholder="Email ID or Phone no:"
                className="w-full bg-white rounded-lg px-4 py-3 text-gray-800 text-sm  outline-none placeholder:text-gray-400 border border-transparent focus:border-emerald-500 transition-all"
              /> */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isLoggedIn ? "Write your Message" : "Log in to write a message"
                }
                disabled={!isLoggedIn}
                rows="3"
                className="w-full bg-white rounded-lg px-4 py-3 text-gray-800 text-sm  outline-none placeholder:text-gray-400 resize-none border border-transparent focus:border-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="w-full sm:w-auto bg-[#e0e0e0] text-[#333333] px-8 py-2.5 rounded-lg text-sm font-heading font-bold hover:bg-emerald-600 hover:text-white transition-all duration-300 active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending..." : isLoggedIn ? "Send Message" : "Log in to Send"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 ">
          <div className="text-[11px] md:text-[12px] text-[#999999] text-center lg:text-left order-3 lg:order-1">
            Copyright © 2026{" "}
            <span className="font-heading font-bold text-white/80">
              Canvade.
            </span>{" "}
            All Rights Reserved
          </div>

          <Link
            to="/get-started/login/educator"
            className="text-[12px] md:text-[13px] font-heading font-bold text-center lg:text-left text-white/90 hover:text-emerald-300 tracking-tight order-1 lg:order-2 cursor-pointer transition-colors"
          >
            Are you an Institute? Reach Students Worldwide.
          </Link>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 order-2 lg:order-3">
            <div className="flex gap-4 text-[11px] md:text-[12px] text-[#cccccc]">
              <Link
                to="/privacy-policy"
                className="hover:text-white cursor-pointer transition-colors"
              >
                Privacy Policy
              </Link>

              <span className="text-[#666666]">•</span>

              <Link
                to="/terms"
                className="hover:text-white cursor-pointer transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
