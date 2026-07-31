import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MessageSquare,
  User,
  Banknote,
  Compass,
  PlusSquare,
  BookOpen,
  Flame,
  Star,
  ShoppingCart,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotificationItem = ({ icon: Icon, title, description, isPromotion, audience }) => (
  <div
    className={`flex items-start gap-4 p-4 rounded-2xl mb-3 border transition-all cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/60 hover:shadow-md ${isPromotion ? "bg-[#FFF9E5] border-amber-100" : "bg-[#F4F7F9] border-transparent"}`}
  >
    <div className="p-2.5 bg-white rounded-lg shadow-sm flex items-center justify-center">
      <Icon size={20} className="text-[#059669]" strokeWidth={2.5} />
    </div>
    <div className="flex-1">
      <h3 className="text-[15px] font-bold text-[#1F2937] leading-tight">
        {title}
      </h3>
      <p className="text-[14px] text-[#6B7280] mt-1 leading-relaxed">
        {description}
      </p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-emerald-600">
        {audience}
      </p>
    </div>
  </div>
);

// Human-readable label per activityType, as returned/expected from the backend.
const activityLabels = {
  course_view: "Viewed Course",
  institute_view: "Viewed Institute",
  cart_added: "Added To Cart",
  course_enrolled: "Enrolled",
  course_review: "Reviewed Course",
  institute_review: "Reviewed Institute",
};

// Icon per activityType. cart_added -> ShoppingCart as requested.
const activityIconMap = {
  course_view: BookOpen,
  institute_view: Compass,
  cart_added: ShoppingCart,
  course_enrolled: Flame,
  course_review: Star,
  institute_review: Star,
};

// Builds a friendly description sentence from the raw activity record.
const buildDescription = (activity) => {
  const studentName = activity.student?.name || "A student";
  const entityName = activity.entity?.name || "your listing";

  switch (activity.activityType) {
    case "course_view":
      return `${studentName} viewed your course "${entityName}".`;
    case "institute_view":
      return `${studentName} viewed your institute profile.`;
    case "cart_added":
      return `${studentName} added "${entityName}" to their cart.`;
    case "course_enrolled":
      return `${studentName} enrolled in "${entityName}".`;
    case "course_review":
      return `${studentName} left a review on "${entityName}".`;
    case "institute_review":
      return `${studentName} left a review on your institute.`;
    default:
      return activity.activity || `${studentName} interacted with "${entityName}".`;
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/api/activities/my`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNotifications(
          Array.isArray(response.data.data) ? response.data.data : []
        );
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow w-full px-5 md:px-10 lg:px-20 mt-20 mb-10">
        <div className="max-w-full">
          {loading && (
            <div className="text-center text-sm font-semibold text-slate-500 py-10">
              Loading notifications...
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-sm font-semibold text-red-500 py-10">
              Error: {error.message}
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="text-center text-sm font-semibold text-slate-500 py-10">
              No notifications yet.
            </div>
          )}

          {!loading &&
            !error &&
            notifications.map((activity) => (
              <NotificationItem
                key={activity.activityId}
                icon={activityIconMap[activity.activityType] || MessageSquare}
                title={
                  activity.activity ||
                  activityLabels[activity.activityType] ||
                  "New Activity"
                }
                description={buildDescription(activity)}
                isPromotion={false}
                audience="Educator"
              />
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPage;