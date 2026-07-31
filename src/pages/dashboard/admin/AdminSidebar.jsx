import React from "react";
import {
  BarChart3,
  Megaphone,
  Users,
  BookOpen,
  Wallet,
  UserCheck,
  Star,
  Calendar,
  FileText,
  X,
} from "lucide-react";

const adminMenuItems = [
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    sub: "See your performance at a glance",
  },
  {
    id: "promotions",
    label: "Promotions",
    icon: Megaphone,
    sub: "Get more visibility and leads",
  },
  {
    id: "leads",
    label: "Leads & Enquiries",
    icon: Users,
    sub: "Potential students to connect",
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    sub: "Create and manage your courses",
  },
  {
    id: "payments",
    label: "Revenue & Payments",
    icon: Wallet,
    sub: "Revenue, Payment, Withdrawal and History",
  },
  {
    id: "profile",
    label: "Profile & Verification",
    icon: UserCheck,
    sub: "Update your institute profile",
  },
  {
    id: "reviews",
    label: "Reviews & Ratings",
    icon: Star,
    sub: "Trust and Credibility",
  },
  {
    id: "batches",
    label: "Batch Planner",
    icon: Calendar,
    sub: "Plan and manage your Batches",
  },
  {
    id: "blogs",
    label: "Updates",
    icon: FileText,
    sub: "Share updates and Announcements",
  },
];

const AdminSidebar = ({ activeTab, setActiveTab, closeSidebar }) => {
  return (
    <aside className="w-[280px] h-full shrink-0 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between lg:hidden mb-3">
        <span className="text-sm font-bold text-slate-700 font-sans">Menu</span>
        <button
          onClick={closeSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-5">
        {adminMenuItems.map((item) => {
          const isActive = activeTab === item.id;
          const isPromotion = item.id === "promotions";

          let currentBtnStyle = "";

          if (isActive) {
            if (isPromotion) {
              currentBtnStyle = "ds-sidebar-active";
            } else {
              currentBtnStyle = "ds-sidebar-active";
            }
          } else {
            if (isPromotion) {
              currentBtnStyle = "ds-sidebar-promo";
            } else {
              currentBtnStyle = "ds-sidebar-idle";
            }
          }

          return (
            <div key={item.id} className="w-full flex flex-col gap-1.5">
              <button
                onClick={() => { setActiveTab(item.id); closeSidebar?.(); }}
                className={`min-w-0 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex items-center gap-3 ${currentBtnStyle}`}
              >
                <item.icon
                  className={`w-[19px] h-[19px] shrink-0 ${
                    isActive || isPromotion
                      ? "text-white"
                      : "text-slate-500 group-hover:text-white"
                  }`}
                />
                <span className="font-semibold text-sm tracking-wide">
                  {item.label}
                </span>
              </button>

              <span className="text-[10px] font-medium text-slate-400 pl-4 leading-tight block">
                {item.sub}
              </span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
