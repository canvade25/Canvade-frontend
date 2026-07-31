import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Coins,
  User,
  Star,
  X,
} from 'lucide-react';
const LOGO_SRC = "/canvade1.png";

const menuItems = [
  // { id: 'dashboard',   label: 'Dashboard',             icon: LayoutDashboard, sub: 'Potential students to connect' },
  // { id: 'enquiries',   label: 'My Enquiries',          icon: GraduationCap,   sub: 'See your performance at a glance' },
  { id: 'enrollments', label: 'My Enrollments',        icon: MessageSquare,   sub: 'Manage your Courses' },
  { id: 'payments',    label: 'Payments',    icon: Coins,           sub: ' Payment, Withdrawal and History' },
  { id: 'profile',     label: 'Profile & Verification',icon: User,            sub: 'Manage your student profile' },
  { id: 'compare',     label: 'Compare',               icon: Star,            sub: 'Trust and Credibility' },
];

const Sidebar = ({ activeTab, setActiveTab, closeSidebar }) => {
  return (
    <aside className="w-[280px] h-full shrink-0 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between lg:hidden mb-2">
        <span className="text-sm font-bold text-slate-700 font-sans">Menu</span>
        <button
          onClick={closeSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="w-full flex flex-col gap-1">
              
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex items-center gap-3 ${
                  isActive
                    ? 'ds-sidebar-active'
                    : 'ds-sidebar-idle'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'
                  }`}
                />
                
                <span className="font-medium text-sm tracking-wide">
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

export default Sidebar;
