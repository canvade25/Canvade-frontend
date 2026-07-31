import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UpdateCard from "../components/Updates/UpdateCard";

const ITEMS_PER_PAGE = 6;

const CATEGORIES = [
  { name: "All Updates" },
  { name: "Announcements" },
  { name: "Events" },
  { name: "New Courses" },
  { name: "Results" },
];

const YEARS = [
  { year: "2026" },
  { year: "2025" },
  { year: "2024" },
];

const UpdatesPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Updates");
  const [activeYear, setActiveYear] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Latest");

  const [allUpdates, setAllUpdates] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL || "https://canvade-backend.onrender.com";

  const fetchUpdates = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/updates/all`);
      const json = await response.json();
      if (json && json.success && Array.isArray(json.data)) {
        setAllUpdates(json.data);
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const filteredUpdates = useMemo(() => {
    return allUpdates.filter((item) => {
      const matchCategory = activeCategory === "All Updates" || item.tag === activeCategory;
      const itemYear = item.createdAt ? new Date(item.createdAt).getFullYear().toString() : "2026";
      const matchYear = itemYear === activeYear;
      return matchCategory && matchYear;
    });
  }, [allUpdates, activeCategory, activeYear]);

  const totalPages = useMemo(() => Math.ceil(filteredUpdates.length / ITEMS_PER_PAGE), [filteredUpdates]);

  const paginatedUpdates = useMemo(() => {
    return filteredUpdates.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredUpdates, currentPage]);

  const handlePageChange = useCallback((page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [totalPages]);

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setSidebarOpen(false);
    setCurrentPage(1);
  }, []);

  const handleYearChange = useCallback((year) => {
    setActiveYear(year);
    setCurrentPage(1);
  }, []);

  const SidebarContent = () => (
    <div className="space-y-4">

      <div>
        <h4 className="font-bold text-[#111827] mb-4 text-[16px]">
          Categories
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${activeCategory === cat.name
                  ? "bg-[#E6F4F1] text-[#059669] font-bold"
                  : "text-gray-700 hover:bg-gray-50 font-bold"
                }`}
            >
              <span className="text-[14px]">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-[#111827] text-[16px]">Year</h4>
          <ChevronDown size={18} className="text-gray-700 " />
        </div>
        <div className="space-y-1">
          {YEARS.map((item) => (
            <div
              key={item.year}
              onClick={() => handleYearChange(item.year)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${activeYear === item.year
                  ? "bg-[#E6F4F1] text-[#059669] font-semibold"
                  : "text-gray-700 hover:bg-gray-50 font-bold"
                }`}
            >
              <span className="text-[14px]">{item.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />

        <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-6 px-4 pt-24 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10 2xl:grid-cols-[280px_minmax(0,1fr)] 2xl:px-12">
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setSidebarOpen(false)}
              />
              <aside
                className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl overflow-y-auto p-6 z-50"
                style={{ scrollbarWidth: "none" }}
              >
                <style>{`aside::-webkit-scrollbar { display: none; }`}</style>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-gray-800 text-[16px]">
                    Filters
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                <SidebarContent />
              </aside>
            </div>
          )}

          <aside
            className="hidden lg:block sticky top-24 self-start border-r border-gray-100 bg-white pr-4 py-2"
            style={{ scrollbarWidth: "none" }}
          >
            <SidebarContent />
          </aside>

          <main
            className="min-w-0 bg-white pb-16"
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`
            aside::-webkit-scrollbar { display: none; }
          `}</style>

            <div className="w-full py-2 lg:pl-2 2xl:pl-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex w-fit items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Menu size={16} />
                  Filters
                </button>
                <p className="text-gray-700 text-[13px] font-medium">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredUpdates.length)} of{" "}
                  {filteredUpdates.length} updates
                </p>
                <div className="flex items-center gap-2 text-[13px] text-gray-600">
                  <span className="opacity-60">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2 font-bold text-gray-800 shadow-sm hover:border-emerald-200 focus:border-emerald-300 focus:outline-none transition-colors"
                    >
                      <option value="Latest">Latest</option>
                      <option value="Most Popular">Most Popular</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Only changed auto-fit to auto-fill here to restrict card widening */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5 xl:gap-6">
                {paginatedUpdates.map((item) => {
                  const updateId = item.updateId || item._id || item.id;
                  return (
                    <UpdateCard
                      key={updateId}
                      {...item}
                      image={item.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500"}
                      date={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                      onClick={
                        updateId
                          ? () => navigate(`/updates/${updateId}`, { state: { update: item } })
                          : undefined
                      }
                    />
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-14 mb-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2.5 rounded-full transition-colors ${currentPage === 1
                        ? "text-gray-200 cursor-not-allowed"
                        : "hover:bg-gray-100 text-gray-400 hover:text-emerald-600"
                      }`}
                  >
                    Prev
                  </button>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2.5 rounded-full transition-colors ${currentPage === totalPages
                        ? "text-gray-200 cursor-not-allowed"
                        : "hover:bg-gray-100 text-gray-400 hover:text-emerald-600"
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdatesPage;