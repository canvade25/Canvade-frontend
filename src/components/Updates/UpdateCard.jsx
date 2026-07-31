import React, { useEffect, useRef, useState } from "react";
import { Calendar, Copy, ExternalLink, MoreVertical, Share2 } from "lucide-react";

// Fixed color mapping according to your tags
export const tagColorMap = {
  "Press Release": "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "Institution Update": "bg-blue-50 text-blue-700 border border-blue-100",
  Partnership: "bg-purple-50 text-purple-700 border border-purple-100",
  Event: "bg-amber-50 text-amber-700 border border-amber-100",
  News: "bg-rose-50 text-rose-700 border border-rose-100",
};

const ImageSkeleton = () => (
  <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
  </div>
);

export default function UpdateCard({
  image,
  tag,
  title,
  description,
  date,
  _id,
  id,
  updateId: updateIdProp,
  link,
  url,
  onClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef(null);
  const updateId = updateIdProp || _id || id;
  const updateLink = link || url || (updateId ? `${window.location.origin}/updates/${updateId}` : window.location.href);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [image]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(updateLink);
    } finally {
      setMenuOpen(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url: updateLink });
      } else {
        await navigator.clipboard?.writeText(updateLink);
      }
    } finally {
      setMenuOpen(false);
    }
  };

  const handleOpen = () => {
    window.open(updateLink, "_blank", "noopener,noreferrer");
    setMenuOpen(false);
  };

  const resolvedCatColor =
    tagColorMap[tag] || "bg-gray-50 text-gray-700 border border-gray-100";

  const displayImage = imageError
    ? "https://placehold.co/600x400?text=No+Image"
    : image;

  return (
    <div
      onClick={onClick}
      className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md ${onClick ? "cursor-pointer" : ""}`}
      style={{ contain: "layout style paint" }}
    >
      <div ref={menuRef} className="absolute right-3 top-3 z-20">
        <button
          type="button"
          aria-label="Update actions"
          aria-expanded={menuOpen}
          onClick={(event) => {
            event.stopPropagation();
            setMenuOpen((current) => !current);
          }}
          className="grid h-8 w-8 place-items-center rounded-md text-gray-500 transition-colors hover:bg-white/80 hover:text-emerald-600"
        >
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <div
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl"
          >
            <button
              type="button"
              onClick={handleOpen}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ExternalLink size={14} />
              Open update
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Copy size={14} />
              Copy link
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        )}
      </div>

      <div className="h-44 overflow-hidden bg-gray-100 sm:h-48 2xl:h-52">
        {!imageLoaded && !imageError && <ImageSkeleton />}
        <img
          src={displayImage}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            setImageError(true);
          }}
          className={`h-full w-full object-cover transition-transform duration-500 hover:scale-105 ${imageLoaded ? "opacity-100" : "absolute opacity-0"}`}
          style={{ position: imageLoaded ? "relative" : "absolute", inset: 0 }}
        />
      </div>

      <div className="flex flex-grow flex-col p-5">
        <span
          className={`mb-3 w-fit rounded-md px-2 py-1 text-[11px] font-bold ${resolvedCatColor}`}
        >
          {tag}
        </span>
        <h3 className="mb-2 text-[17px] font-bold leading-snug text-gray-800">
          {title}
        </h3>
        <p className="mb-4 flex-grow text-[13px] leading-relaxed text-gray-500">
          {description}
        </p>
        <div className="flex items-center gap-2 border-t border-gray-50 pt-0 text-[15px] text-gray-700">
          <Calendar size={14} />
          {date}
        </div>
      </div>
    </div>
  );
}
