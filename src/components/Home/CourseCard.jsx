import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Clock3,
  MapPin,
  MoreVertical,
} from "lucide-react";

const formatPrice = (value) => {
  if (value == null || value === "") return "";
  if (typeof value === "string") return value;
  return `₹ ${Number(value).toLocaleString("en-IN")}`;
};
import { getCourseReviews } from "../../../api/courseApi";

const DEFAULT_CARD = {
  title: "Philosophy of Doctorate in Human Behavior and Phycological Research",
  image: "course.png",
  institution: "ICAI - THE INSTITUTE OF CHARTERED ACCOUNTANTS",
  duration: "4 Year",
  mode: "Onsite & Online",
  location: "Moti Nagar, New Delhi",
  currentPrice: "₹ 2,90,000",
  actualPrice: "₹ 3,40,000",
  rating: "4.8",
};

const CourseImageSkeleton = () => (
  <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
  </div>
);

export default function CourseCard({
  item,
  visible,
  widthClass = "w-[84vw] sm:w-[45vw] md:w-[360px] lg:w-[390px] xl:w-full",
  onCardClick,
  onInstituteClick,
  onEnrollClick,
  onMenuClick,
}) {
  const title =
    item?.basicDetails?.courseTitle || item?.title || DEFAULT_CARD.title;
  const image =
    item?.uploadMaterials?.thumbnail || item?.image || DEFAULT_CARD.image;
  const institution =
    item?.institute?.name ||
    item?.instituteName ||
    item?.institution ||
    DEFAULT_CARD.institution;
  const instituteLogo = item?.institute?.media?.logo || "workshop.png";
  const duration =
    item?.basicDetails?.duration || item?.duration || DEFAULT_CARD.duration;
  const mode =
    item?.basicDetails?.learningMode ||
    item?.basicDetails?.mode ||
    item?.mode ||
    DEFAULT_CARD.mode;
  const isRemoteOrOnline = ["remote", "online"].includes(
    (
      item?.basicDetails?.learningMode ||
      item?.basicDetails?.mode ||
      ""
    ).toLowerCase(),
  );

  const location = isRemoteOrOnline
    ? item?.basicDetails?.locations?.[0] || "Remote"
    : item?.institute?.locations?.[0]
      ? `${item.institute.locations[0].addressLine1}, ${item.institute.locations[0].city}, ${item.institute.locations[0].state}`
      : item?.basicDetails?.locations?.[0] ||
        item?.location ||
        DEFAULT_CARD.location;
  const instituteLocations = item?.institute?.locations || [];
  const extraLocationsCount = Math.max(instituteLocations.length - 1, 0);
  const currentPrice = formatPrice(
    item?.priceDetails?.currentPrice ??
      item?.currentPrice ??
      DEFAULT_CARD.currentPrice,
  );

  const actualPrice = formatPrice(
    item?.priceDetails?.actualPrice ??
      item?.actualPrice ??
      DEFAULT_CARD.actualPrice,
  );
  const [liveRating, setLiveRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const courseId = item?.courseId || item?._id || item?.id;

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [image]);

  useEffect(() => {
    if (!courseId) return;

    let isMounted = true;

    const fetchRating = async () => {
      try {
        const res = await getCourseReviews(courseId);
        const reviews = res?.reviews || [];
        if (reviews.length > 0) {
          const avg =
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviews.length;
          if (isMounted) {
            setLiveRating(avg.toFixed(1));
            setReviewCount(reviews.length);
          }
        }
      } catch (error) {
        console.error("Error fetching course reviews:", error);
      }
    };

    fetchRating();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const rating = liveRating;

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(true);
    setImageError(true);
  }, []);

  return (
    <div
      onClick={onCardClick}
      className={`flex-shrink-0 ${widthClass} snap-start bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-500 hover:shadow-xl group cursor-pointer ${
        visible ? item.anim : "opacity-0 translate-y-10"
      }`}
      style={{ contain: "layout style paint" }}
    >
      <div className="p-2 pb-0">
        <div className="relative">
          <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-t-[8px] rounded-bl-[15px]">
            {!imageLoaded && <CourseImageSkeleton />}
            <img
              src={imageError ? "course.png" : image}
              alt={title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "absolute opacity-0"}`}
              style={{ position: imageLoaded ? "relative" : "absolute", inset: 0 }}
            />

            <div className="absolute bottom-0 right-0 bg-white pl-2 pt-0 rounded-tl-lg flex items-center gap-2 h-8">
              <span className="bg-[#FFC107] text-[9px] text-white px-2 py-0.5 rounded-md capitalize">
                Student's Choice
              </span>
              {rating && (
                <div className="flex items-center gap-0.5 pr-3">
                  <span className="text-[#FFC107] text-sm">★</span>
                  <span className="text-[11px] text-gray-700">{rating}</span>
                  {reviewCount > 0 && (
                    <span className="text-[10px] text-gray-500 ml-0.5">
                      ({reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="absolute bottom-2 -left-0.5 translate-y-1/4 w-10 h-10 rounded-full overflow-hidden bg-white z-10 shadow-sm"
            onClick={(event) => {
              event.stopPropagation();
              onInstituteClick?.(event);
            }}
            aria-label="View institute"
          >
            <img
              src={instituteLogo}
              alt={institution}
              onError={(e) => {
                e.currentTarget.src = "workshop.png";
              }}
              className="w-full h-full mx-auto object-cover rounded-full scale-200"
            />
          </button>
        </div>
      </div>

      <div className="p-4 pt-3">
        <button
          type="button"
          className="flex w-full items-center gap-1 bg-[#f1f5f9] px-3.5 py-1 rounded-[6px] mb-2 overflow-hidden cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            onInstituteClick?.(event);
          }}
        >
          <span className="text-[10px] font-medium text-[#2563eb] uppercase tracking-[0.04em] truncate min-w-0">
            {institution}
          </span>
          <BadgeCheck className="w-4 h-4 text-white fill-[#3b82f6] flex-shrink-0" />
        </button>

        <h3 className="text-base font-medium text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[40px]">
          {title}
        </h3>

        <div className="flex items-stretch text-gray-700 text-[11px] mb-2 border-b border-gray-200">
          <div className="flex items-center gap-1.5 font-medium pb-3 pr-4">
            <Clock3 className="w-4 h-4 text-gray-700" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2.5 font-medium border-l border-gray-300 pl-4 md:pl-6 pb-3 ml-auto">
            <BookOpen className="w-4 h-4 text-gray-700" />
            <span>{mode}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-700 text-[12px] mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0 text-gray-700" />
          <span className="truncate">
            {location}
            {extraLocationsCount > 0 && (
              <span className="text-gray-800 ml-1">
                ({extraLocationsCount} More)
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-[#F6F6F6] px-2 py-1 rounded-md space-y-0.5">
            <p className="text-[15px] font-semibold text-gray-900 leading-tight">
              {currentPrice}
            </p>
            <p className="text-[10px] text-[#303030] line-through">
              {actualPrice}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEnrollClick?.(event);
              }}
              className="group/enroll bg-[#E5E5E5] hover:bg-emerald-600 hover:text-white text-gray-700 text-[13px] font-semibold px-5 md:px-5 py-3 rounded-md flex items-center gap-2 transition-all"
            >
              Enroll
              <span className="hidden sm:inline-flex w-4 h-4 rounded-md bg-[#484848] text-white items-center justify-center align-middle transition-colors group-hover/enroll:bg-white group-hover/enroll:text-emerald-700">
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onMenuClick?.(event);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5 text-[#707070]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
