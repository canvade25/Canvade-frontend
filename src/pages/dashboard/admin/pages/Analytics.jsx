import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import api from "../../../../../api/axios";

const formatCount = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatCurrency = (value) =>
  `₹ ${new Intl.NumberFormat("en-IN").format(Number(value || 0))}`;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Normalizes a status/key string so API keys like "active", "Active",
// "closed_for_intake", "closedForIntake", "Closed for Intake" all match.
const normalizeKey = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const toTitleCase = (str) =>
  String(str || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const COURSE_STATUS_LABELS = [
  { label: "Active", key: "active" },
  { label: "Closed for Intake", key: "closedforintake" },
  { label: "Inactive", key: "inactive" },
  { label: "Archived", key: "archived" },
  { label: "Deleted", key: "deleted" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

// ── Smooth curve through the REAL monthly values (Catmull-Rom → cubic
// Bezier). Visually matches the old hand-drawn "Q ... T ..." paths, but
// every point on the curve is derived from actual data, nothing invented. ──
const buildSmoothPath = (values, { width = 1000, height = 200 } = {}) => {
  const max = Math.max(...values, 1);
  const n = values.length;
  const stepX = n > 1 ? width / (n - 1) : width;
  const points = values.map((v, i) => [
    n > 1 ? i * stepX : 0,
    height - (v / max) * height,
  ]);

  if (points.length < 2) {
    const [x, y] = points[0] || [0, height];
    return {
      linePath: `M ${x.toFixed(1)} ${y.toFixed(1)}`,
      areaPath: `M ${x.toFixed(1)} ${y.toFixed(1)} L ${x.toFixed(1)} ${height} L 0 ${height} Z`,
    };
  }

  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  const last = points[points.length - 1];
  const areaPath = `${d} L ${last[0].toFixed(1)} ${height} L 0 ${height} Z`;
  return { linePath: d, areaPath };
};

// 5 axis labels computed from the real max value (top → bottom), instead
// of a fixed decorative scale like "100k / 50k / 20k / 10k / 0k".
const buildAxisLabels = (max, formatter) => {
  const steps = [1, 0.75, 0.5, 0.25, 0];
  return steps.map((s) => formatter(Math.round(max * s)));
};

const YearSelect = ({ year, onChange }) => (
  <div className="relative">
    <select
      value={year}
      onChange={(e) => onChange(Number(e.target.value))}
      className="appearance-none flex items-center gap-1 text-xs font-semibold text-slate-400 border border-slate-100 rounded-lg pl-2 pr-6 py-1 bg-white outline-none cursor-pointer hover:bg-slate-50 transition-colors"
    >
      {YEAR_OPTIONS.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

// Trend chart in the file-2 visual style: left axis labels, background
// grid, gridlines drawn in SVG, dashed smoothed line + gradient area.
// Axis labels and the curve itself are both derived from real data.
const TrendChart = ({ values, color, gradientId, formatter }) => {
  const hasData = values.some((v) => v > 0);
  const max = Math.max(...values, 0);
  const axisLabels = buildAxisLabels(max, formatter);
  const { linePath, areaPath } = buildSmoothPath(values);

  return (
    <div className="w-full h-48 relative mt-2 flex gap-1">
      <div className="flex flex-col justify-between text-[10px] text-slate-400 font-medium text-right shrink-0 py-0.5 w-7">
        {axisLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden">
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400 z-20">
            No data yet
          </div>
        )}

        <div className="w-full h-full relative z-10">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 200"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                <stop offset="60%" stopColor={color} stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 50, 100, 150, 200].map((yVal, idx) => (
              <line
                key={`h-${idx}`}
                x1="0"
                y1={yVal}
                x2="1000"
                y2={yVal}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            ))}
            {[
              0, 90.9, 181.8, 272.7, 363.6, 454.5, 545.4, 636.3, 727.2, 818.1,
              909, 1000,
            ].map((xVal, idx) => (
              <line
                key={`v-${idx}`}
                x1={xVal}
                y1="0"
                x2={xVal}
                y2="200"
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            ))}

            {hasData && (
              <>
                <path d={areaPath} fill={`url(#${gradientId})`} />
                <path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

// Donut card in the file-2 visual style (ring + big center number + two
// legend chips), but the split shown is always a genuine derived stat —
// never an invented breakdown.
const DonutCard = ({
  title,
  year,
  onYearChange,
  centerLabel,
  ringPercent,
  ringColorA,
  ringColorB,
  legendA,
  legendB,
  loading,
}) => (
  <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm lg:col-span-4 flex flex-col justify-between min-h-[220px]">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold text-gray-700 tracking-tight">
        {title}
      </h3>
      <YearSelect year={year} onChange={onYearChange} />
    </div>

    <div className="my-auto flex items-center justify-center relative py-6">
      <div className="w-40 h-40 rounded-full flex items-center justify-center relative">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke={ringColorB}
            strokeWidth="4.2"
            strokeOpacity="0.8"
          />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke={ringColorA}
            strokeWidth="4.2"
            strokeDasharray={`${loading ? 0 : ringPercent} 100`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <span className="text-[22px] font-bold text-gray-700 tracking-tight leading-none">
            {loading ? "—" : centerLabel}
          </span>
          <span className="text-[10px] font-medium text-slate-400 mt-1">
            Total for {year}
          </span>
        </div>
      </div>
    </div>

    <div className="flex justify-center items-center gap-8 text-xs font-bold text-gray-700 border-t border-slate-50 pt-3">
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: ringColorA }}
          />
          <span>{loading ? "—" : legendA.value}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {legendA.label}
        </span>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: ringColorB }}
          />
          <span>{loading ? "—" : legendB.value}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {legendB.label}
        </span>
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const [overview, setOverview] = useState({
    instituteViews: 0,
    courseViews: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    loading: true,
    error: "",
  });
  const [overviewPeriod, setOverviewPeriod] = useState("this_month");

  const [courseStatus, setCourseStatus] = useState({
    data: [],
    loading: true,
    error: "",
  });
  const [topStates, setTopStates] = useState({
    data: [],
    loading: true,
    error: "",
  });

  const [viewsYear, setViewsYear] = useState(CURRENT_YEAR);
  const [viewsTrend, setViewsTrend] = useState({
    data: [],
    loading: true,
    error: "",
  });

  const [enrollYear, setEnrollYear] = useState(CURRENT_YEAR);
  const [enrollTrend, setEnrollTrend] = useState({
    data: [],
    totalEnrollments: 0,
    loading: true,
    error: "",
  });

  const [revenueYear, setRevenueYear] = useState(CURRENT_YEAR);
  const [revenueTrend, setRevenueTrend] = useState({
    data: [],
    totalRevenue: 0,
    loading: true,
    error: "",
  });

  // ── One-time data: overview totals, course status, top states ──────────
  useEffect(() => {
    let isMounted = true;

      setOverview(cur => ({ ...cur, loading: true }));

    (async () => {
      try {
        const res = await api.get("/api/analytics/views", {
          params: { period: overviewPeriod },
        });
        const data = res.data || {};
        if (!isMounted) return;
        setOverview({
          instituteViews: Number(data.instituteViews || 0),
          courseViews: Number(data.courseViews || 0),
          totalEnrollments: Number(data.totalEnrollments || 0),
          totalRevenue: Number(data.totalRevenue || 0),
          loading: false,
          error: "",
        });
      } catch (error) {
        console.error("Failed to load overview analytics:", error);
        if (!isMounted) return;
        setOverview((cur) => ({
          ...cur,
          loading: false,
          error: "Unable to load overview",
        }));
      }
    })();

    (async () => {
      try {
        const res = await api.get("/api/analytics/course-status");
        if (!isMounted) return;
        setCourseStatus({
          data: res.data?.data || [],
          loading: false,
          error: "",
        });
      } catch (error) {
        console.error("Failed to load course status analytics:", error);
        if (!isMounted) return;
        setCourseStatus((cur) => ({
          ...cur,
          loading: false,
          error: "Unable to load",
        }));
      }
    })();

    (async () => {
      try {
        const res = await api.get("/api/analytics/locations", {
          params: { type: "state" },
        });
        if (!isMounted) return;
        setTopStates({ data: res.data?.data || [], loading: false, error: "" });
      } catch (error) {
        console.error("Failed to load location analytics:", error);
        if (!isMounted) return;
        setTopStates((cur) => ({
          ...cur,
          loading: false,
          error: "Unable to load",
        }));
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [overviewPeriod]);

  // ── Year-scoped trend data ───────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    setViewsTrend((cur) => ({ ...cur, loading: true }));

    api
      .get("/api/analytics/views/trend", { params: { year: viewsYear } })
      .then((res) => {
        if (!isMounted) return;
        setViewsTrend({
          data: res.data?.data || [],
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        console.error("Failed to load views trend:", error);
        if (!isMounted) return;
        setViewsTrend((cur) => ({
          ...cur,
          loading: false,
          error: "Unable to load",
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [viewsYear]);

  useEffect(() => {
    let isMounted = true;
    setEnrollTrend((cur) => ({ ...cur, loading: true }));

    api
      .get("/api/analytics/enrollments", { params: { year: enrollYear } })
      .then((res) => {
        if (!isMounted) return;
        setEnrollTrend({
          data: res.data?.data || [],
          totalEnrollments: Number(res.data?.totalEnrollments || 0),
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        console.error("Failed to load enrollment trend:", error);
        if (!isMounted) return;
        setEnrollTrend((cur) => ({
          ...cur,
          loading: false,
          error: "Unable to load",
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [enrollYear]);

  useEffect(() => {
    let isMounted = true;
    setRevenueTrend((cur) => ({ ...cur, loading: true }));

    api
      .get("/api/analytics/revenue", { params: { year: revenueYear } })
      .then((res) => {
        if (!isMounted) return;
        setRevenueTrend({
          data: res.data?.data || [],
          totalRevenue: Number(res.data?.totalRevenue || 0),
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        console.error("Failed to load revenue trend:", error);
        if (!isMounted) return;
        setRevenueTrend((cur) => ({
          ...cur,
          loading: false,
          error: "Unable to load",
        }));
      });

    return () => {
      isMounted = false;
    };
  }, [revenueYear]);

  // ── Derived view models ─────────────────────────────────────────────
  const overviewStats = [
    {
      label: "Profile Views",
      value: overview.loading ? "—" : formatCount(overview.instituteViews),
    },
    {
      label: "Course Views",
      value: overview.loading ? "—" : formatCount(overview.courseViews),
    },
    {
      label: "Enrollments",
      value: overview.loading ? "—" : formatCount(overview.totalEnrollments),
    },
    {
      label: "Revenue",
      value: overview.loading ? "—" : formatCurrency(overview.totalRevenue),
    },
  ];

  const statusCountsLookup = courseStatus.data.reduce((acc, item) => {
    acc[normalizeKey(item.status)] = Number(item.count) || 0;
    return acc;
  }, {});

  const courseCounters = COURSE_STATUS_LABELS.map(({ label, key }) => ({
    label,
    count: statusCountsLookup[key] || 0,
  }));

  const stateMetrics = (() => {
    const filtered = topStates.data.filter(
      (s) => s.location && normalizeKey(s.location) !== "unknown",
    );
    const top4 = filtered.slice(0, 4);
    const max =
      top4.reduce((m, s) => Math.max(m, Number(s.count) || 0), 0) || 1;
    return top4.map((s) => ({
      name: toTitleCase(s.location),
      total: Number(s.count) || 0,
      percentage: Math.round(((Number(s.count) || 0) / max) * 100),
    }));
  })();

  // Views: dual series (Profile vs Course) — the donut split below is the
  // real totals of each series, not an invented breakdown.
  const instituteValues = viewsTrend.data.map((d) => d.instituteViews || 0);
  const courseValues = viewsTrend.data.map((d) => d.courseViews || 0);
  const combinedViews = instituteValues.map(
    (v, i) => v + (courseValues[i] || 0),
  );
  const instituteTotal = instituteValues.reduce((a, b) => a + b, 0);
  const courseTotal = courseValues.reduce((a, b) => a + b, 0);
  const viewsGrandTotal = instituteTotal + courseTotal;
  const viewsRingPercent =
    viewsGrandTotal > 0
      ? Math.round((instituteTotal / viewsGrandTotal) * 100)
      : 0;

  // Enrollments / Revenue: single series — donut split is real Peak Month
  // vs Rest-of-Year, derived from the same trend data as the chart.
  const enrollValues = enrollTrend.data.map((d) => d.count || 0);
  const enrollPeakValue = Math.max(...enrollValues, 0);
  const enrollTotal = enrollValues.reduce((a, b) => a + b, 0);
  const enrollPeakIdx = enrollValues.indexOf(enrollPeakValue);
  const enrollRingPercent =
    enrollTotal > 0 ? Math.round((enrollPeakValue / enrollTotal) * 100) : 0;

  const revenueValues = revenueTrend.data.map((d) => d.revenue || 0);
  const revenuePeakValue = Math.max(...revenueValues, 0);
  const revenueTotal = revenueValues.reduce((a, b) => a + b, 0);
  const revenuePeakIdx = revenueValues.indexOf(revenuePeakValue);
  const revenueRingPercent =
    revenueTotal > 0 ? Math.round((revenuePeakValue / revenueTotal) * 100) : 0;

  return (
    <div
      className="space-y-6 w-full bg-slate-50/40 min-h-screen pb-14"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700 tracking-tight">
            Overview
          </h2>
          <div className="relative">
  <select
    value={overviewPeriod}
    onChange={(e) => setOverviewPeriod(e.target.value)}
    className="appearance-none flex items-center gap-2 border border-slate-200/70 rounded-xl pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 transition-colors shadow-sm outline-none cursor-pointer"
  >
    <option value="this_month">This Month</option>
    <option value="last_month">Last Month</option>
    <option value="last_3_months">Last 3 Months</option>
    <option value="this_year">This Year</option>
    <option value="all_time">All Time</option>
  </select>
  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {overviewStats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#f4f7fa] rounded-2xl p-4 flex flex-col justify-between min-h-[96px] transition-all duration-200 lg:col-span-3"
            >
              <p className="text-xs font-semibold text-slate-500 tracking-tight">
                {stat.label}
              </p>
              <span className="text-[22px] font-bold text-[#333333] tracking-tight leading-none mt-2">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {overview.error ? (
          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {overview.error}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch w-full">
        <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm lg:col-span-8 flex flex-col justify-start gap-3 mt-6">
          <h2 className="text-lg font-bold text-[#333333] tracking-tight">
            Courses and Programmes
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full">
            {courseCounters.map((item, i) => (
              <div
                key={i}
                className="bg-[#f4f7fa] rounded-xl p-2.5 px-3 flex flex-col justify-between min-h-[68px]"
              >
                <p className="text-[10px] font-semibold text-gray-700 leading-tight">
                  {item.label}
                </p>
                <p className="text-xl font-bold text-gray-700 leading-none mt-0.5">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm lg:col-span-4 flex flex-col">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-[#333333] tracking-wide">
              Your Top 4 states
            </p>
            <button className="rounded-full border border-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50">
              View All States
            </button>
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col">
            {stateMetrics.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs font-medium text-slate-400">
                {topStates.loading
                  ? "Loading..."
                  : "No visitor location data yet"}
              </div>
            ) : (
              stateMetrics.map((state, i) => (
                <div
                  key={i}
                  className="w-full flex items-center justify-between relative h-[24px] bg-[#f4f7fa] rounded-md overflow-hidden border border-slate-100/30"
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1fa485] via-[#1fa485]/80 to-[#1fa485]/40 rounded-r-sm transition-all duration-500"
                    style={{ width: `${state.percentage}%` }}
                  />
                  <span className="text-[11px] font-bold text-white z-10 pl-2.5 drop-shadow-sm select-none">
                    {state.name}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-700 z-10 pr-2.5">
                    {state.total}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 w-full">
        {/* Views Trend + Reach Data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[340px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-700 tracking-tight">
                Views Trend
              </h3>
              <YearSelect year={viewsYear} onChange={setViewsYear} />
            </div>

            <TrendChart
              values={combinedViews}
              color="#1fa485"
              gradientId="viewsFidelityGrad"
              formatter={formatCount}
            />

            <div className="w-full flex justify-between text-[11px] text-slate-400 font-bold mt-3 pt-1 pl-7">
              {MONTHS.map((m) => (
                <span
                  key={m}
                  className="w-full text-center first:text-left last:text-right"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <DonutCard
            title="Reach Data"
            year={viewsYear}
            onYearChange={setViewsYear}
            centerLabel={formatCount(viewsGrandTotal)}
            ringPercent={viewsRingPercent}
            ringColorA="#1fa485"
            ringColorB="#22d3ee"
            legendA={{ label: "Profile", value: formatCount(instituteTotal) }}
            legendB={{ label: "Courses", value: formatCount(courseTotal) }}
            loading={viewsTrend.loading}
          />
        </div>

        {/* Enrollments + Enrollments Data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[340px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-700 tracking-tight">
                Enrollments
              </h3>
              <YearSelect year={enrollYear} onChange={setEnrollYear} />
            </div>

            <TrendChart
              values={enrollValues}
              color="#06b6d4"
              gradientId="enrollFidelityGrad"
              formatter={formatCount}
            />

            <div className="w-full flex justify-between text-[11px] text-slate-400 font-bold mt-3 pt-1 pl-7">
              {MONTHS.map((m) => (
                <span
                  key={m}
                  className="w-full text-center first:text-left last:text-right"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <DonutCard
            title="Enrollments Data"
            year={enrollYear}
            onYearChange={setEnrollYear}
            centerLabel={formatCount(enrollTrend.totalEnrollments)}
            ringPercent={enrollRingPercent}
            ringColorA="#1e40af"
            ringColorB="#22d3ee"
            legendA={{
              label:
                enrollPeakIdx >= 0
                  ? `Peak (${MONTHS[enrollPeakIdx]})`
                  : "Peak Month",
              value: formatCount(enrollPeakValue),
            }}
            legendB={{
              label: "Other Months",
              value: formatCount(enrollTotal - enrollPeakValue),
            }}
            loading={enrollTrend.loading}
          />
        </div>

        {/* Revenue + Revenue Data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[340px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-700 tracking-tight">
                Revenue (₹)
              </h3>
              <YearSelect year={revenueYear} onChange={setRevenueYear} />
            </div>

            <TrendChart
              values={revenueValues}
              color="#eab308"
              gradientId="revenueFidelityGrad"
              formatter={formatCurrency}
            />

            <div className="w-full flex justify-between text-[11px] text-slate-400 font-bold mt-3 pt-1 pl-7">
              {MONTHS.map((m) => (
                <span
                  key={m}
                  className="w-full text-center first:text-left last:text-right"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <DonutCard
            title="Revenue Data"
            year={revenueYear}
            onYearChange={setRevenueYear}
            centerLabel={formatCurrency(revenueTrend.totalRevenue)}
            ringPercent={revenueRingPercent}
            ringColorA="#f59e0b"
            ringColorB="#facc15"
            legendA={{
              label:
                revenuePeakIdx >= 0
                  ? `Peak (${MONTHS[revenuePeakIdx]})`
                  : "Peak Month",
              value: formatCurrency(revenuePeakValue),
            }}
            legendB={{
              label: "Other Months",
              value: formatCurrency(revenueTotal - revenuePeakValue),
            }}
            loading={revenueTrend.loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;

// import React, { useEffect, useState } from "react";
// import { ChevronDown } from "lucide-react";
// import api from "../../../../../api/axios";

// const formatCount = (value) =>
//   new Intl.NumberFormat("en-IN").format(Number(value || 0));

// const formatCurrency = (value) =>
//   `₹ ${new Intl.NumberFormat("en-IN").format(Number(value || 0))}`;

// const MONTHS = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// ];

// // Normalizes a status/key string so API keys like "active", "Active",
// // "closed_for_intake", "closedForIntake", "Closed for Intake" all match.
// const normalizeKey = (str) =>
//   String(str || "")
//     .toLowerCase()
//     .replace(/[^a-z0-9]/g, "");

// const toTitleCase = (str) =>
//   String(str || "")
//     .toLowerCase()
//     .split(" ")
//     .filter(Boolean)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");

// const COURSE_STATUS_LABELS = [
//   { label: "Active", key: "active" },
//   { label: "Closed for Intake", key: "closedforintake" },
//   { label: "Inactive", key: "inactive" },
//   { label: "Archived", key: "archived" },
//   { label: "Deleted", key: "deleted" },
// ];

// const PERIOD_OPTIONS = [
//   { label: "This Month", value: "this_month" },
//   { label: "Last Month", value: "last_month" },
//   { label: "This Year", value: "this_year" },
//   { label: "All Time", value: "all_time" },
// ];

// const PeriodSelect = ({ period, onChange }) => (
//   <div className="relative">
//     <select
//       value={period}
//       onChange={e => onChange(e.target.value)}
//       className="appearance-none border border-slate-200/70 rounded-xl pl-4 pr-9 py-1.5 text-xs font-semibold text-slate-500 bg-white outline-none cursor-pointer hover:bg-slate-50 transition-colors shadow-sm"
//     >
//       {PERIOD_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
//     </select>
//     <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//   </div>
// );

// const CURRENT_YEAR = new Date().getFullYear();
// const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

// // ── Smooth curve through the REAL monthly values (Catmull-Rom → cubic
// // Bezier). Visually matches the old hand-drawn "Q ... T ..." paths, but
// // every point on the curve is derived from actual data, nothing invented. ──
// const buildSmoothPath = (values, { width = 1000, height = 200 } = {}) => {
//   const max = Math.max(...values, 1);
//   const n = values.length;
//   const stepX = n > 1 ? width / (n - 1) : width;
//   const points = values.map((v, i) => [
//     n > 1 ? i * stepX : 0,
//     height - (v / max) * height,
//   ]);

//   if (points.length < 2) {
//     const [x, y] = points[0] || [0, height];
//     return {
//       linePath: `M ${x.toFixed(1)} ${y.toFixed(1)}`,
//       areaPath: `M ${x.toFixed(1)} ${y.toFixed(1)} L ${x.toFixed(1)} ${height} L 0 ${height} Z`,
//     };
//   }

//   let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
//   for (let i = 0; i < points.length - 1; i++) {
//     const p0 = points[i - 1] || points[i];
//     const p1 = points[i];
//     const p2 = points[i + 1];
//     const p3 = points[i + 2] || p2;
//     const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
//     const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
//     const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
//     const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
//     d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
//   }
//   const last = points[points.length - 1];
//   const areaPath = `${d} L ${last[0].toFixed(1)} ${height} L 0 ${height} Z`;
//   return { linePath: d, areaPath };
// };

// // 5 axis labels computed from the real max value (top → bottom), instead
// // of a fixed decorative scale like "100k / 50k / 20k / 10k / 0k".
// const buildAxisLabels = (max, formatter) => {
//   const steps = [1, 0.75, 0.5, 0.25, 0];
//   return steps.map((s) => formatter(Math.round(max * s)));
// };

// const YearSelect = ({ year, onChange }) => (
//   <div className="relative">
//     <select
//       value={year}
//       onChange={(e) => onChange(Number(e.target.value))}
//       className="appearance-none flex items-center gap-1 text-xs font-semibold text-slate-400 border border-slate-100 rounded-lg pl-2 pr-6 py-1 bg-white outline-none cursor-pointer hover:bg-slate-50 transition-colors"
//     >
//       {YEAR_OPTIONS.map((y) => (
//         <option key={y} value={y}>
//           {y}
//         </option>
//       ))}
//     </select>
//     <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
//   </div>
// );

// // Trend chart in the file-2 visual style: left axis labels, background
// // grid, gridlines drawn in SVG, dashed smoothed line + gradient area.
// // Axis labels and the curve itself are both derived from real data.
// const TrendChart = ({ values, color, gradientId, formatter }) => {
//   const hasData = values.some((v) => v > 0);
//   const max = Math.max(...values, 0);
//   const axisLabels = buildAxisLabels(max, formatter);
//   const { linePath, areaPath } = buildSmoothPath(values);

//   return (
//     <div className="w-full h-48 relative mt-2 flex gap-1">
//       <div className="flex flex-col justify-between text-[10px] text-slate-400 font-medium text-right shrink-0 py-0.5 w-7">
//         {axisLabels.map((label, i) => (
//           <span key={i}>{label}</span>
//         ))}
//       </div>

//       <div className="flex-1 relative rounded-xl overflow-hidden">
//         {!hasData && (
//           <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400 z-20">
//             No data yet
//           </div>
//         )}

//         <div className="w-full h-full relative z-10">
//           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
//             <defs>
//               <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor={color} stopOpacity="0.5" />
//                 <stop offset="60%" stopColor={color} stopOpacity="0.18" />
//                 <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
//               </linearGradient>
//             </defs>

//             {[0, 50, 100, 150, 200].map((yVal, idx) => (
//               <line key={`h-${idx}`} x1="0" y1={yVal} x2="1000" y2={yVal} stroke="#f1f5f9" strokeWidth="1" />
//             ))}
//             {[0, 90.9, 181.8, 272.7, 363.6, 454.5, 545.4, 636.3, 727.2, 818.1, 909, 1000].map((xVal, idx) => (
//               <line key={`v-${idx}`} x1={xVal} y1="0" x2={xVal} y2="200" stroke="#f1f5f9" strokeWidth="1" />
//             ))}

//             {hasData && (
//               <>
//                 <path d={areaPath} fill={`url(#${gradientId})`} />
//                 <path
//                   d={linePath}
//                   fill="none"
//                   stroke={color}
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeDasharray="4 4"
//                 />
//               </>
//             )}
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Donut card in the file-2 visual style (ring + big center number + two
// // legend chips), but the split shown is always a genuine derived stat —
// // never an invented breakdown.
// const DonutCard = ({
//   title,
//   year,
//   onYearChange,
//   centerLabel,
//   ringPercent,
//   ringColorA,
//   ringColorB,
//   legendA,
//   legendB,
//   loading,
// }) => (
//   <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm lg:col-span-4 flex flex-col justify-between min-h-[220px]">
//     <div className="flex justify-between items-center">
//       <h3 className="text-xl font-bold text-gray-700 tracking-tight">{title}</h3>
//       <YearSelect year={year} onChange={onYearChange} />
//     </div>

//     <div className="my-auto flex items-center justify-center relative py-6">
//       <div className="w-40 h-40 rounded-full flex items-center justify-center relative">
//         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
//           <circle cx="18" cy="18" r="14" fill="none" stroke={ringColorB} strokeWidth="4.2" strokeOpacity="0.8" />
//           <circle
//             cx="18"
//             cy="18"
//             r="14"
//             fill="none"
//             stroke={ringColorA}
//             strokeWidth="4.2"
//             strokeDasharray={`${loading ? 0 : ringPercent} 100`}
//             strokeDashoffset="0"
//             strokeLinecap="round"
//           />
//         </svg>

//         <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
//           <span className="text-[22px] font-bold text-gray-700 tracking-tight leading-none">
//             {loading ? "—" : centerLabel}
//           </span>
//           <span className="text-[10px] font-medium text-slate-400 mt-1">Total for {year}</span>
//         </div>
//       </div>
//     </div>

//     <div className="flex justify-center items-center gap-8 text-xs font-bold text-gray-700 border-t border-slate-50 pt-3">
//       <div className="flex flex-col items-center gap-0.5">
//         <div className="flex items-center gap-1.5">
//           <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ringColorA }} />
//           <span>{loading ? "—" : legendA.value}</span>
//         </div>
//         <span className="text-[11px] text-slate-400 font-medium">{legendA.label}</span>
//       </div>

//       <div className="flex flex-col items-center gap-0.5">
//         <div className="flex items-center gap-1.5">
//           <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ringColorB }} />
//           <span>{loading ? "—" : legendB.value}</span>
//         </div>
//         <span className="text-[11px] text-slate-400 font-medium">{legendB.label}</span>
//       </div>
//     </div>
//   </div>
// );

// const Analytics = () => {
//   const [overview, setOverview] = useState({
//     instituteViews: 0,
//     courseViews: 0,
//     totalEnrollments: 0,
//     totalRevenue: 0,
//     loading: true,
//     error: "",
//   });

//   const [overviewPeriod, setOverviewPeriod] = useState("this_month");

//   const [courseStatus, setCourseStatus] = useState({ data: [], loading: true, error: "" });
//   const [topStates, setTopStates] = useState({ data: [], loading: true, error: "" });

//   const [viewsYear, setViewsYear] = useState(CURRENT_YEAR);
//   const [viewsTrend, setViewsTrend] = useState({ data: [], loading: true, error: "" });

//   const [enrollYear, setEnrollYear] = useState(CURRENT_YEAR);
//   const [enrollTrend, setEnrollTrend] = useState({
//     data: [],
//     totalEnrollments: 0,
//     loading: true,
//     error: "",
//   });

//   const [revenueYear, setRevenueYear] = useState(CURRENT_YEAR);
//   const [revenueTrend, setRevenueTrend] = useState({
//     data: [],
//     totalRevenue: 0,
//     loading: true,
//     error: "",
//   });

//   useEffect(() => {
//     let isMounted = true;
//     setOverview(cur => ({ ...cur, loading: true }));
//     (async () => {
//       try {
//         const res = await api.get("/api/analytics/overview", {
//           params: { period: overviewPeriod },
//         });
//         const data = res.data?.data || {};
//         if (!isMounted) return;
//         setOverview({
//           instituteViews: Number(data.instituteViews || 0),
//           courseViews: Number(data.courseViews || 0),
//           totalEnrollments: Number(data.totalEnrollments || 0),
//           totalRevenue: Number(data.totalRevenue || 0),
//           loading: false,
//           error: "",
//         });
//       } catch (error) {
//         console.error("Failed to load overview analytics:", error);
//         if (!isMounted) return;
//         setOverview((cur) => ({ ...cur, loading: false, error: "Unable to load overview" }));
//       }
//     })();

//     (async () => {
//       try {
//         const res = await api.get("/api/analytics/course-status");
//         if (!isMounted) return;
//         setCourseStatus({ data: res.data?.data || [], loading: false, error: "" });
//       } catch (error) {
//         console.error("Failed to load course status analytics:", error);
//         if (!isMounted) return;
//         setCourseStatus((cur) => ({ ...cur, loading: false, error: "Unable to load" }));
//       }
//     })();

//     (async () => {
//       try {
//         const res = await api.get("/api/analytics/locations", { params: { type: "state" } });
//         if (!isMounted) return;
//         setTopStates({ data: res.data?.data || [], loading: false, error: "" });
//       } catch (error) {
//         console.error("Failed to load location analytics:", error);
//         if (!isMounted) return;
//         setTopStates((cur) => ({ ...cur, loading: false, error: "Unable to load" }));
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, [overviewPeriod]);

//   // ── One-time data: course status, top states ──────────
//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       try {
//         setCourseStatus({ data: [], loading: true, error: "" });
//         const res = await api.get("/api/analytics/course-status");
//         if (!isMounted) return;
//         setCourseStatus({ data: res.data?.data || [], loading: false, error: "" });
//       } catch (error) {
//         console.error("Failed to load course status analytics:", error);
//         if (!isMounted) return;
//         setCourseStatus((cur) => ({ ...cur, loading: false, error: "Unable to load" }));
//       }
//     })();

//     (async () => {
//       try {
//         setTopStates({ data: [], loading: true, error: "" });
//         const res = await api.get("/api/analytics/locations", { params: { type: "state" } });
//         if (!isMounted) return;
//         setTopStates({ data: res.data?.data || [], loading: false, error: "" });
//       } catch (error) {
//         console.error("Failed to load location analytics:", error);
//         if (!isMounted) return;
//         setTopStates((cur) => ({ ...cur, loading: false, error: "Unable to load" }));
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // ── Year-scoped trend data ───────────────────────────────────────────
//   useEffect(() => {
//     let isMounted = true;
//     setViewsTrend((cur) => ({ ...cur, loading: true }));

//     api
//       .get("/api/analytics/views/trend", { params: { year: viewsYear } })
//       .then((res) => {
//         if (!isMounted) return;
//         setViewsTrend({ data: res.data?.data || [], loading: false, error: "" });
//       })
//       .catch((error) => {
//         console.error("Failed to load views trend:", error);
//         if (!isMounted) return;
//         setViewsTrend((cur) => ({ ...cur, loading: false, error: "Unable to load" }));
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [viewsYear]);

//   useEffect(() => {
//     let isMounted = true;
//     setEnrollTrend((cur) => ({ ...cur, loading: true }));

//     api
//       .get("/api/analytics/enrollments", { params: { year: enrollYear } })
//       .then((res) => {
//         if (!isMounted) return;
//         setEnrollTrend({
//           data: res.data?.data || [],
//           totalEnrollments: Number(res.data?.totalEnrollments || 0),
//           loading: false,
//           error: "",
//         });
//       })
//       .catch((error) => {
//         console.error("Failed to load enrollment trend:", error);
//         if (!isMounted) return;
//         setEnrollTrend((cur) => ({ ...cur, loading: false, error: "Unable to load" }));
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [enrollYear]);

//   useEffect(() => {
//     let isMounted = true;
//     setRevenueTrend((cur) => ({ ...cur, loading: true }));

//     api
//       .get("/api/analytics/revenue", { params: { year: revenueYear } })
//       .then((res) => {
//         if (!isMounted) return;
//         setRevenueTrend({
//           data: res.data?.data || [],
//           totalRevenue: Number(res.data?.totalRevenue || 0),
//           loading: false,
//           error: "",
//         });
//       })
//       .catch((error) => {
//         console.error("Failed to load revenue trend:", error);
//         if (!isMounted) return;
//         setRevenueTrend((cur) => ({ ...cur, loading: false, error: "Unable to load" }));
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [revenueYear]);

//   // ── Derived view models ─────────────────────────────────────────────
//   const overviewStats = [
//     { label: "Profile Views", value: overview.loading ? "—" : formatCount(overview.instituteViews) },
//     { label: "Course Views", value: overview.loading ? "—" : formatCount(overview.courseViews) },
//     { label: "Enrollments", value: overview.loading ? "—" : formatCount(overview.totalEnrollments) },
//     { label: "Revenue", value: overview.loading ? "—" : formatCurrency(overview.totalRevenue) },
//   ];

//   const statusCountsLookup = courseStatus.data.reduce((acc, item) => {
//     acc[normalizeKey(item.status)] = Number(item.count) || 0;
//     return acc;
//   }, {});

//   const courseCounters = COURSE_STATUS_LABELS.map(({ label, key }) => ({
//     label,
//     count: statusCountsLookup[key] || 0,
//   }));

//   const stateMetrics = (() => {
//     const filtered = topStates.data.filter(
//       (s) => s.location && normalizeKey(s.location) !== "unknown",
//     );
//     const top4 = filtered.slice(0, 4);
//     const max = top4.reduce((m, s) => Math.max(m, Number(s.count) || 0), 0) || 1;
//     return top4.map((s) => ({
//       name: toTitleCase(s.location),
//       total: Number(s.count) || 0,
//       percentage: Math.round(((Number(s.count) || 0) / max) * 100),
//     }));
//   })();

//   // Views: dual series (Profile vs Course) — the donut split below is the
//   // real totals of each series, not an invented breakdown.
//   const instituteValues = viewsTrend.data.map((d) => d.instituteViews || 0);
//   const courseValues = viewsTrend.data.map((d) => d.courseViews || 0);
//   const combinedViews = instituteValues.map((v, i) => v + (courseValues[i] || 0));
//   const instituteTotal = instituteValues.reduce((a, b) => a + b, 0);
//   const courseTotal = courseValues.reduce((a, b) => a + b, 0);
//   const viewsGrandTotal = instituteTotal + courseTotal;
//   const viewsRingPercent = viewsGrandTotal > 0 ? Math.round((instituteTotal / viewsGrandTotal) * 100) : 0;

//   // Enrollments / Revenue: single series — donut split is real Peak Month
//   // vs Rest-of-Year, derived from the same trend data as the chart.
//   const enrollValues = enrollTrend.data.map((d) => d.count || 0);
//   const enrollPeakValue = Math.max(...enrollValues, 0);
//   const enrollTotal = enrollValues.reduce((a, b) => a + b, 0);
//   const enrollPeakIdx = enrollValues.indexOf(enrollPeakValue);
//   const enrollRingPercent = enrollTotal > 0 ? Math.round((enrollPeakValue / enrollTotal) * 100) : 0;

//   const revenueValues = revenueTrend.data.map((d) => d.revenue || 0);
//   const revenuePeakValue = Math.max(...revenueValues, 0);
//   const revenueTotal = revenueValues.reduce((a, b) => a + b, 0);
//   const revenuePeakIdx = revenueValues.indexOf(revenuePeakValue);
//   const revenueRingPercent = revenueTotal > 0 ? Math.round((revenuePeakValue / revenueTotal) * 100) : 0;

//   return (
//     <div className="space-y-6 w-full bg-slate-50/40 min-h-screen pb-14" style={{ fontFamily: "Inter, sans-serif" }}>
//       <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm w-full">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-bold text-gray-700 tracking-tight">Overview</h2>
//           <PeriodSelect period={overviewPeriod} onChange={setOverviewPeriod} />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
//           {overviewStats.map((stat, i) => (
//             <div
//               key={i}
//               className="bg-[#f4f7fa] rounded-2xl p-4 flex flex-col justify-between min-h-[96px] transition-all duration-200 lg:col-span-3"
//             >
//               <p className="text-xs font-semibold text-slate-500 tracking-tight">{stat.label}</p>
//               <span className="text-[22px] font-bold text-[#333333] tracking-tight leading-none mt-2">
//                 {stat.value}
//               </span>
//             </div>
//           ))}
//         </div>

//         {overview.error ? (
//           <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
//             {overview.error}
//           </div>
//         ) : null}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch w-full">
//         <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm lg:col-span-8 flex flex-col justify-start gap-3 mt-6">
//           <h2 className="text-lg font-bold text-[#333333] tracking-tight">Courses and Programmes</h2>

//           <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full">
//             {courseCounters.map((item, i) => (
//               <div key={i} className="bg-[#f4f7fa] rounded-xl p-2.5 px-3 flex flex-col justify-between min-h-[68px]">
//                 <p className="text-[10px] font-semibold text-gray-700 leading-tight">{item.label}</p>
//                 <p className="text-xl font-bold text-gray-700 leading-none mt-0.5">{item.count}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm lg:col-span-4 flex flex-col">
//           <div className="mb-3 flex items-center justify-between gap-3">
//             <p className="text-xs font-bold text-[#333333] tracking-wide">Your Top 4 states</p>
//             <button className="rounded-full border border-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50">
//               View All States
//             </button>
//           </div>

//           <div className="space-y-1.5 flex-1 flex flex-col">
//             {stateMetrics.length === 0 ? (
//               <div className="flex-1 flex items-center justify-center text-xs font-medium text-slate-400">
//                 {topStates.loading ? "Loading..." : "No visitor location data yet"}
//               </div>
//             ) : (
//               stateMetrics.map((state, i) => (
//                 <div
//                   key={i}
//                   className="w-full flex items-center justify-between relative h-[24px] bg-[#f4f7fa] rounded-md overflow-hidden border border-slate-100/30"
//                 >
//                   <div
//                     className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1fa485] via-[#1fa485]/80 to-[#1fa485]/40 rounded-r-sm transition-all duration-500"
//                     style={{ width: `${state.percentage}%` }}
//                   />
//                   <span className="text-[11px] font-bold text-white z-10 pl-2.5 drop-shadow-sm select-none">
//                     {state.name}
//                   </span>
//                   <span className="text-[10px] font-semibold text-gray-700 z-10 pr-2.5">{state.total}</span>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="space-y-6 w-full">
//         {/* Views Trend + Reach Data */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
//           <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[340px]">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-700 tracking-tight">Views Trend</h3>
//               <YearSelect year={viewsYear} onChange={setViewsYear} />
//             </div>

//             <TrendChart
//               values={combinedViews}
//               color="#1fa485"
//               gradientId="viewsFidelityGrad"
//               formatter={formatCount}
//             />

//             <div className="w-full flex justify-between text-[11px] text-slate-400 font-bold mt-3 pt-1 pl-7">
//               {MONTHS.map((m) => (
//                 <span key={m} className="w-full text-center first:text-left last:text-right">
//                   {m}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <DonutCard
//             title="Reach Data"
//             year={viewsYear}
//             onYearChange={setViewsYear}
//             centerLabel={formatCount(viewsGrandTotal)}
//             ringPercent={viewsRingPercent}
//             ringColorA="#1fa485"
//             ringColorB="#22d3ee"
//             legendA={{ label: "Profile", value: formatCount(instituteTotal) }}
//             legendB={{ label: "Courses", value: formatCount(courseTotal) }}
//             loading={viewsTrend.loading}
//           />
//         </div>

//         {/* Enrollments + Enrollments Data */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
//           <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[340px]">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-700 tracking-tight">Enrollments</h3>
//               <YearSelect year={enrollYear} onChange={setEnrollYear} />
//             </div>

//             <TrendChart
//               values={enrollValues}
//               color="#06b6d4"
//               gradientId="enrollFidelityGrad"
//               formatter={formatCount}
//             />

//             <div className="w-full flex justify-between text-[11px] text-slate-400 font-bold mt-3 pt-1 pl-7">
//               {MONTHS.map((m) => (
//                 <span key={m} className="w-full text-center first:text-left last:text-right">
//                   {m}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <DonutCard
//             title="Enrollments Data"
//             year={enrollYear}
//             onYearChange={setEnrollYear}
//             centerLabel={formatCount(enrollTrend.totalEnrollments)}
//             ringPercent={enrollRingPercent}
//             ringColorA="#1e40af"
//             ringColorB="#22d3ee"
//             legendA={{
//               label: enrollPeakIdx >= 0 ? `Peak (${MONTHS[enrollPeakIdx]})` : "Peak Month",
//               value: formatCount(enrollPeakValue),
//             }}
//             legendB={{ label: "Other Months", value: formatCount(enrollTotal - enrollPeakValue) }}
//             loading={enrollTrend.loading}
//           />
//         </div>

//         {/* Revenue + Revenue Data */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
//           <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[340px]">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-700 tracking-tight">Revenue (₹)</h3>
//               <YearSelect year={revenueYear} onChange={setRevenueYear} />
//             </div>

//             <TrendChart
//               values={revenueValues}
//               color="#eab308"
//               gradientId="revenueFidelityGrad"
//               formatter={formatCurrency}
//             />

//             <div className="w-full flex justify-between text-[11px] text-slate-400 font-bold mt-3 pt-1 pl-7">
//               {MONTHS.map((m) => (
//                 <span key={m} className="w-full text-center first:text-left last:text-right">
//                   {m}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <DonutCard
//             title="Revenue Data"
//             year={revenueYear}
//             onYearChange={setRevenueYear}
//             centerLabel={formatCurrency(revenueTrend.totalRevenue)}
//             ringPercent={revenueRingPercent}
//             ringColorA="#f59e0b"
//             ringColorB="#facc15"
//             legendA={{
//               label: revenuePeakIdx >= 0 ? `Peak (${MONTHS[revenuePeakIdx]})` : "Peak Month",
//               value: formatCurrency(revenuePeakValue),
//             }}
//             legendB={{ label: "Other Months", value: formatCurrency(revenueTotal - revenuePeakValue) }}
//             loading={revenueTrend.loading}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
