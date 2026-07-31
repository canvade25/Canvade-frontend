import { useState } from "react";
import {
  BarChart2, Megaphone, ClipboardList, BookOpen, CreditCard,
  UserCircle, Star, CalendarDays, Newspaper, Trophy, TrendingUp,
  Target, Lightbulb, GraduationCap, Users, Briefcase, Play, Pause,
  Pencil, MoreHorizontal, Menu, PlayCircle, PlusCircle, Info, ChevronRight, X,
} from "lucide-react";

const sidebarItems = [
  { icon: BarChart2, label: "Analytics", sub: "See your performance at a glance" },
  { icon: Megaphone, label: "Promotions", sub: "Get more visibility and leads" },
  { icon: ClipboardList, label: "Leads & Enquiries", sub: "Potential students to connect" },
  { icon: BookOpen, label: "Courses and Workshops", sub: "Create and Manage your Courses and Workshops" },
  { icon: CreditCard, label: "Revenue & Payments", sub: "Revenue, Payment, Withdrawal and History" },
  { icon: UserCircle, label: "Profile & Verification", sub: "Update your institute profile" },
  { icon: Star, label: "Reviews & Ratings", sub: "Trust and Credibility" },
  { icon: CalendarDays, label: "Batch Planner", sub: "Plan and manage your Batches" },
  { icon: Newspaper, label: "Blogs & Press Release", sub: "Share updates and Announcements" },
];

const campaigns = [
  { name: "Digital Marketing Mastery", type: "Online Course", status: "Active", budget: "₹ 5,000", budgetType: "Daily", spent: "₹ 3,240", spentOf: "of ₹ 5,000", leads: 176, enrollments: 28, costPerLead: "₹ 18.41", roi: "5.2x", roiAmount: "₹ 16,850", color: "bg-green-500", statusColor: "text-green-600 bg-green-50" },
  { name: "Graphic Design Bootcamp", type: "Offline Course • Delhi", status: "Active", budget: "₹ 3,000", budgetType: "Daily", spent: "₹ 2,150", spentOf: "of ₹ 3,000", leads: 124, enrollments: 18, costPerLead: "₹ 17.34", roi: "4.1x", roiAmount: "₹ 8,810", color: "bg-green-500", statusColor: "text-green-600 bg-green-50" },
  { name: "Spoken English Program", type: "Offline Course • Mumbai", status: "Paused", budget: "₹ 2,000", budgetType: "Daily", spent: "₹ 1,250", spentOf: "of ₹ 2,000", leads: 64, enrollments: 7, costPerLead: "₹ 19.53", roi: "2.8x", roiAmount: "₹ 3,520", color: "bg-yellow-500", statusColor: "text-yellow-600 bg-yellow-50" },
  { name: "Data Science Essentials", type: "Online Course", status: "Completed", budget: "₹ 4,000", budgetType: "Total", spent: "₹ 4,000", spentOf: "of ₹ 4,000", leads: 212, enrollments: 34, costPerLead: "₹ 18.87", roi: "6.3x", roiAmount: "₹ 25,200", color: "bg-gray-400", statusColor: "text-gray-500 bg-gray-100" },
];

const funnelData = [
  { label: "Impressions", value: "50,246", color: "bg-teal-200", width: "100%" },
  { label: "Clicks", value: "3,782", color: "bg-blue-300", width: "75%" },
  { label: "Leads", value: "842", color: "bg-yellow-300", width: "50%" },
  { label: "Enrollments", value: "126", color: "bg-purple-300", width: "25%" },
];

const chartData = [20,35,45,80,60,50,70,55,90,120,100,85,110,130,115,95,80,70,90,100,85,95,110,120,105,115,125,140,130,150,160];
const chartLabels = ["1 May","5 May","10 May","15 May","20 May","25 May","31 May"];

function MiniLineChart() {
  const w = 480, h = 120;
  const max = Math.max(...chartData);
  const min = Math.min(...chartData);
  const pts = chartData.map((v, i) => {
    const x = (i / (chartData.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 16) - 8;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `0,${h} ${polyline} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 130 }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#chartGrad)" />
      <polyline points={polyline} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
      {chartData.map((v, i) => {
        const x = (i / (chartData.length - 1)) * w;
        const y = h - ((v - min) / (max - min)) * (h - 16) - 8;
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#fff" stroke="#10b981" strokeWidth="1.5" />;
      })}
    </svg>
  );
}

import { useEffect } from "react";
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

export default function PromotionsDashboard() {
  const [activeNav, setActiveNav] = useState("Promotions");
  const [activeTab, setActiveTab] = useState("Leads");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  const handleNavClick = (label) => {
    setActiveNav(label);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f9fafb", position: "relative" }}>

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 30,
          }}
        />
      )}

      <aside
        style={{
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          height: "100%",
          zIndex: isMobile ? 40 : 10,
          width: sidebarOpen ? "224px" : "0px",
          minWidth: sidebarOpen ? "224px" : "0px",
          maxWidth: sidebarOpen ? "224px" : "0px",
          overflow: "hidden",
          background: "#fff",
          borderRight: sidebarOpen ? "1px solid #f3f4f6" : "none",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease, min-width 0.3s ease, max-width 0.3s ease",
          flexShrink: 0,
        }}
      >
        <div style={{ width: "224px", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ padding: "14px 12px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px", borderRadius: "6px", display: "flex", alignItems: "center" }}
            >
              <X size={18} />
            </button>
          </div>

          <nav style={{ flex: 1, overflowY: "auto", paddingTop: 4, paddingBottom: 8 }}>
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.label)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 16px",
                  display: "block",
                  border: "none",
                  cursor: "pointer",
                  background: activeNav === item.label ? "#059669" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (activeNav !== item.label) e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={(e) => { if (activeNav !== item.label) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ flexShrink: 0, color: activeNav === item.label ? "#fff" : "#374151", display: "flex" }}>
                    <item.icon size={16} />
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: activeNav === item.label ? "#fff" : "#1f2937", whiteSpace: "nowrap" }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ fontSize: 10.5, lineHeight: 1.4, marginTop: 3, paddingLeft: 26, color: activeNav === item.label ? "#a7f3d0" : "#6b7280" }}>
                  {item.sub}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>

        <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", borderBottom: "1px solid #f3f4f6", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Promotions</h1>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Create, manage and track your promotional campaigns</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <PlayCircle size={13} /> <span style={{ display: window.innerWidth < 480 ? "none" : "inline" }}>How it works?</span>
            </button>
            <button style={{ background: "#059669", color: "#fff", fontSize: 11, fontWeight: 700, padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <PlusCircle size={13} /> Create Promotion
            </button>
          </div>
        </div>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: 10 }}>
            {[
              { label: "Active Campaigns", value: "3", sub: "View all →", icon: BarChart2, iconBg: "#d1fae5", iconColor: "#059669" },
              { label: "Total Spend", value: "₹ 18,450", sub: "This Month", icon: Briefcase, iconBg: "#fef9c3", iconColor: "#ca8a04" },
              { label: "Leads Generated", value: "842", sub: "This Month", icon: Users, iconBg: "#dbeafe", iconColor: "#2563eb" },
              { label: "Enrollments", value: "126", sub: "This Month", icon: GraduationCap, iconBg: "#ede9fe", iconColor: "#7c3aed" },
              { label: "ROI (Revenue / Spend)", value: "4.6x", sub: "₹ 84,900 Revenue", icon: TrendingUp, iconBg: "#d1fae5", iconColor: "#059669" },
            ].map((kpi) => (
              <div key={kpi.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", padding: 12, display: "flex", alignItems: "flex-start", justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 9.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{kpi.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "2px 0" }}>{kpi.value}</p>
                  <p style={{ fontSize: 9.5, color: "#059669", fontWeight: 600, margin: 0 }}>{kpi.sub}</p>
                </div>
                <div style={{ background: kpi.iconBg, color: kpi.iconColor, width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8 }}>
                  <kpi.icon size={15} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 12 }}>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 16, gridColumn: "span 1" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: 0 }}>Performance Overview</h2>
                  <Info size={12} color="#d1d5db" />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4 }}>
                  {["Spend","Impressions","Clicks","Leads","Enrollments","ROI"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontSize: 10.5, padding: "4px 10px", borderRadius: 8, fontWeight: 600, border: "none", cursor: "pointer", background: activeTab === tab ? "#059669" : "transparent", color: activeTab === tab ? "#fff" : "#6b7280", transition: "background 0.15s" }}>
                      {tab}
                    </button>
                  ))}
                  <select style={{ fontSize: 10.5, border: "1px solid #e5e7eb", borderRadius: 8, padding: "4px 8px", color: "#4b5563" }}>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>Last 3 Months</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: 10, color: "#d1d5db", paddingBottom: 20, height: 130 }}>
                  {[200,150,100,50,0].map((v) => <span key={v}>{v}</span>)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <MiniLineChart />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 4, padding: "0 4px" }}>
                    {chartLabels.map((l) => <span key={l}>{l}</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: "0 0 12px 0" }}>Funnel Overview</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {funnelData.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div className={f.color} style={{ width: f.width, marginLeft: `${i * 8}%`, borderRadius: 6, height: 32, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>{f.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, margin: 0 }}>Conversion Rate</p>
                  <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>From Clicks to Enrollments</p>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>3.33%</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: "0 0 12px 0" }}>Top Performing Campaign</h2>
              <div style={{ background: "linear-gradient(135deg,#f0fdf4,#f0fdfa)", borderRadius: 12, padding: 12, border: "1px solid #d1fae5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, background: "#059669", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Trophy size={16} color="#fff" />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: 0 }}>Digital Marketing Mastery</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Lead Conversion Rate</p><p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>7.41%</p></div>
                  <div><p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>Cost / Lead</p><p style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>₹ 18.41</p></div>
                </div>
                <button style={{ marginTop: 12, width: "100%", background: "#059669", color: "#fff", fontSize: 11, fontWeight: 700, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer" }}>
                  Increase Budget
                </button>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: "0 0 12px 0" }}>Smart Recommendations</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: TrendingUp, text: "Increase budget for Digital Marketing Mastery. You can get 30% more leads.", action: "Increase Budget", bg: "#f0fdf4", border: "#d1fae5", iconColor: "#059669" },
                  { icon: Target, text: "Delhi audience is converting 2x better for Graphic Design Bootcamp.", action: "View Insights", bg: "#eff6ff", border: "#bfdbfe", iconColor: "#2563eb" },
                  { icon: Lightbulb, text: "Your Spoken English Program has high interest. Promote to get more leads.", action: "Promote Now", bg: "#fefce8", border: "#fde68a", iconColor: "#ca8a04" },
                ].map((r, i) => (
                  <div key={i} style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: r.iconColor, flexShrink: 0, marginTop: 1 }}><r.icon size={14} /></span>
                      <div>
                        <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>{r.text}</p>
                        <button style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 4, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 2 }}>
                          {r.action} <ChevronRight size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 16 }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: "0 0 12px 0" }}>Billing & History</h2>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px 0" }}>Available Balance</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>₹ 7,350</p>
                <button style={{ background: "#f3f4f6", color: "#374151", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>Add Funds</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button style={{ fontSize: 11, color: "#059669", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>Transaction History →</button>
                <button style={{ fontSize: 11, color: "#059669", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textAlign: "right" }}>Invoices →</button>
              </div>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                <p style={{ fontSize: 10, color: "#9ca3af", margin: "0 0 6px 0" }}>Spend This Month</p>
                <div style={{ width: "100%", background: "#f3f4f6", borderRadius: 999, height: 6 }}>
                  <div style={{ width: "65%", background: "#10b981", height: 6, borderRadius: 999 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
                  <span>₹ 18,450 spent</span><span>₹ 28,000 limit</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: "0 0 14px 0" }}>Your Campaigns</h2>
            <div style={{ overflowX: "auto", margin: "0 -16px", padding: "0 16px" }}>
              <table style={{ width: "100%", minWidth: 700, fontSize: 11, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                    {["Campaign","Status","Budget","Spent","Leads","Enrollments","Cost / Lead","ROI","Actions"].map((h) => (
                      <th key={h} style={{ textAlign: "left", color: "#9ca3af", fontWeight: 600, paddingBottom: 8, paddingRight: 14, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                      <td style={{ padding: "10px 14px 10px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className={c.color} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                            {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: "#1f2937", margin: 0, fontSize: 11 }}>{c.name}</p>
                            <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{c.type}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ paddingRight: 14 }}>
                        <span className={c.statusColor} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4, width: "fit-content" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.status === "Active" ? "#22c55e" : c.status === "Paused" ? "#eab308" : "#9ca3af", display: "inline-block" }} />
                          {c.status}
                        </span>
                      </td>
                      <td style={{ paddingRight: 14 }}>
                        <p style={{ fontWeight: 600, color: "#1f2937", margin: 0 }}>{c.budget}</p>
                        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{c.budgetType}</p>
                      </td>
                      <td style={{ paddingRight: 14 }}>
                        <p style={{ fontWeight: 600, color: "#1f2937", margin: 0 }}>{c.spent}</p>
                        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{c.spentOf}</p>
                      </td>
                      <td style={{ paddingRight: 14, fontWeight: 600, color: "#1f2937" }}>{c.leads}</td>
                      <td style={{ paddingRight: 14, fontWeight: 600, color: "#1f2937" }}>{c.enrollments}</td>
                      <td style={{ paddingRight: 14, fontWeight: 600, color: "#1f2937" }}>{c.costPerLead}</td>
                      <td style={{ paddingRight: 14 }}>
                        <p style={{ fontWeight: 700, color: "#1f2937", margin: 0 }}>{c.roi}</p>
                        <p style={{ fontSize: 10, color: "#059669", fontWeight: 600, margin: 0 }}>{c.roiAmount}</p>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {[
                            { Icon: c.status === "Paused" ? Play : Pause },
                            { Icon: Pencil },
                            { Icon: MoreHorizontal },
                          ].map(({ Icon }, j) => (
                            <button key={j} style={{ width: 24, height: 24, borderRadius: 6, background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon size={11} color="#4b5563" />
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button style={{ fontSize: 11, color: "#059669", fontWeight: 700, marginTop: 12, background: "none", border: "none", cursor: "pointer" }}>
              View all campaigns →
            </button>
          </div>

          <div style={{ background: "linear-gradient(135deg,#f0fdf4,#f0fdfa)", borderRadius: 12, border: "1px solid #a7f3d0", padding: 16, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, background: "#059669", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Megaphone size={18} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: 0 }}>Reach more students. Get more enrollments.</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Promote your courses and connect with students actively looking to learn.</p>
              </div>
            </div>
            <button style={{ background: "#059669", color: "#fff", fontSize: 11, fontWeight: 700, padding: "9px 16px", borderRadius: 8, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
              Create New Promotion
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}