import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Eye,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

const courseCategories = [
  "Information Technology",
  "Artificial Intelligence",
  "Software Development",
  "Finance",
  "Banking",
  "Accounting",
  "Healthcare",
  "Education",
  "Government",
  "Manufacturing",
  "Construction",
  "Real Estate",
];

const allMockCourses = [
  {
    title: "Full Stack Web Development",
    instructor: "Newton School",
    rating: "4.6",
    reviews: "1.2k",
    price: "₹12,999",
    oldPrice: "₹18,999",
    tag: "Bestseller",
    tagColor: "bg-emerald-50 text-emerald-700",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&auto=format&fit=crop&q=80",
    category: "Software Development",
  },
  {
    title: "Data Analytics with Excel",
    instructor: "Skill Academy",
    rating: "4.5",
    reviews: "856",
    price: "₹3,499",
    oldPrice: "₹5,999",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
    category: "Information Technology",
  },
  {
    title: "UI/UX Design Advanced",
    instructor: "DesignTrack",
    rating: "4.7",
    reviews: "945",
    price: "₹8,999",
    oldPrice: "₹12,999",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&auto=format&fit=crop&q=80",
    category: "Software Development",
  },
  {
    title: "Digital Marketing Strategy",
    instructor: "Intellipaat",
    rating: "4.4",
    reviews: "1k",
    price: "₹6,999",
    oldPrice: "₹9,999",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&auto=format&fit=crop&q=80",
    category: "Marketing & Advertising",
  },
  {
    id: 5,
    title: "Machine Learning with Python",
    instructor: "UpGrad",
    location: "Pune, Maharashtra",
    date: "12 May 2024",
    time: "09:45 AM",
    responses: 2,
    status: "Replied",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=120&auto=format&fit=crop&q=80",
    category: "Artificial Intelligence",
  },
  {
    id: 6,
    title: "Business Analytics",
    instructor: "ExcelR",
    location: "Online",
    date: "10 May 2024",
    time: "11:00 AM",
    responses: 4,
    status: "Replied",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80",
    category: "Finance",
  },
  {
    id: 7,
    title: "Cyber Security Essentials",
    instructor: "Simplilearn",
    location: "Bangalore, Karnataka",
    date: "08 May 2024",
    time: "03:30 PM",
    responses: 0,
    status: "No Reply",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80",
    category: "Information Technology",
  },
  {
    title: "Advanced Banking Principles",
    instructor: "Finance Academy",
    rating: "4.8",
    reviews: "2.1k",
    price: "₹14,999",
    oldPrice: "₹22,999",
    image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&auto=format&fit=crop&q=80",
    category: "Banking",
  },
  {
    title: "Modern Accounting",
    instructor: "CA Club",
    rating: "4.7",
    reviews: "1.5k",
    price: "₹7,999",
    oldPrice: "₹11,999",
    image: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=400&auto=format&fit=crop&q=80",
    category: "Accounting",
  },
  {
    title: "Healthcare Management",
    instructor: "Med-Versity",
    rating: "4.6",
    reviews: "980",
    price: "₹19,999",
    oldPrice: "₹25,999",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&auto=format&fit=crop&q=80",
    category: "Healthcare",
  },
  {
    title: "Primary School Teaching",
    instructor: "Edu-Next",
    rating: "4.9",
    reviews: "3.2k",
    price: "₹4,999",
    oldPrice: "₹8,999",
    image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=400&auto=format&fit=crop&q=80",
    category: "Education",
  },
  {
    title: "Public Administration",
    instructor: "Gov. Exams Prep",
    rating: "4.5",
    reviews: "2.5k",
    price: "₹9,999",
    oldPrice: "₹14,999",
    image: "https://images.unsplash.com/photo-1569063386798-34594856a829?w=400&auto=format&fit=crop&q=80",
    category: "Government",
  },
];

const myEnquiriesData = [
  {
    id: 1,
    title: "Full Stack Web Development",
    institute: "Newton School",
    location: "Bangalore, Karnataka",
    date: "20 May 2024",
    time: "10:30 AM",
    responses: 3,
    status: "Replied",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Data Science Pro",
    institute: "ExcelR",
    location: "Hyderabad, Telangana",
    date: "18 May 2024",
    time: "04:15 PM",
    responses: 2,
    status: "Replied",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "UI/UX Design Advanced",
    institute: "DesignTrack",
    location: "Mumbai, Maharashtra",
    date: "16 May 2024",
    time: "11:20 AM",
    responses: 1,
    status: "Pending",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Digital Marketing Mastery",
    institute: "Intellipaat",
    location: "Delhi, Delhi",
    date: "15 May 2024",
    time: "02:00 PM",
    responses: 0,
    status: "No Reply",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Machine Learning with Python",
    institute: "UpGrad",
    location: "Pune, Maharashtra",
    date: "12 May 2024",
    time: "09:45 AM",
    responses: 2,
    status: "Replied",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    title: "Business Analytics",
    institute: "ExcelR",
    location: "Online",
    date: "10 May 2024",
    time: "11:00 AM",
    responses: 4,
    status: "Replied",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    title: "Cyber Security Essentials",
    institute: "Simplilearn",
    location: "Bangalore, Karnataka",
    date: "08 May 2024",
    time: "03:30 PM",
    responses: 0,
    status: "No Reply",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&auto=format&fit=crop&q=80",
  },
];

const STATUS_STYLES = {
  Replied: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-600 border-amber-100",
  "No Reply": "bg-rose-50 text-rose-600 border-rose-100",
};

const Enquiries = ({ mode = "recommended" }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredEnquiries = useMemo(() => {
    return myEnquiriesData.filter((enq) => {
      const matchesTab = activeTab === "All" || enq.status === activeTab;
      const matchesSearch =
        enq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enq.institute.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const totalItems = filteredEnquiries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEnquiries.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (mode === "enquiries") {
    return (
      <section className="space-y-6 w-full max-w-[1400px] mx-auto p-4">
        <div>
          <h1 className="text-2xl font-medium text-slate-950">My Enquiries</h1>
          <p className="text-sm text-slate-600 font-medium mt-0.5">
            Track all your course enquiries and responses in one place.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["All Enquiries", "Replied", "Pending", "No Reply"].map((tab) => {
              const normalizedTab = tab === "All Enquiries" ? "All" : tab;
              const isActive = activeTab === normalizedTab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(normalizedTab);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-emerald-50 text-[#10b981] border-emerald-200 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#10b981] transition-colors placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-600 tracking-wider">
                  <th className="py-3 px-4">Course / Institute</th>
                  <th className="py-3 px-4">Enquired On</th>
                  <th className="py-3 px-4">Responses</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm"
                          />
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#10b981] transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              {item.institute}
                            </p>
                            <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1 pt-0.5">
                              <MapPin className="w-4 h-4 text-slate-500" />{" "}
                              {item.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                        <div>{item.date}</div>
                        <div className="text-[12px] text-slate-500 font-normal mt-0.5">
                          {item.time}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs">
                        <span className="font-bold text-slate-900">
                          {item.responses}
                        </span>
                        <span className="text-slate-500 font-medium block text-[11px]">
                          Replies
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md border ${STATUS_STYLES[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="p-1.5 border border-emerald-100 rounded-lg text-[#10b981] bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm">
                            <Eye className="w-4 h-4" />
                          </button>

                          <button className="p-1.5 border border-emerald-100 rounded-lg text-gray-600 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-100 transition-all shadow-sm">
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button className="p-1.5 border border-rose-100 rounded-lg text-rose-500 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-sm font-semibold text-slate-400"
                    >
                      No enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {totalItems === 0 ? 0 : indexOfFirstItem + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-800">
              {Math.min(indexOfLastItem, totalItems)}
            </span>{" "}
            of <span className="font-bold text-slate-800">{totalItems}</span>{" "}
            enquiries
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-1.5 border border-slate-200 rounded-lg transition-all ${
                currentPage === 1
                  ? "text-slate-300 cursor-not-allowed bg-slate-50/50"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all border ${
                  currentPage === index + 1
                    ? "bg-white text-[#10b981] border-[#10b981] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-1.5 border border-slate-200 rounded-lg transition-all ${
                currentPage === totalPages
                  ? "text-slate-300 cursor-not-allowed bg-slate-50/50"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  const CourseCard = ({ item }) => (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
      <div className="space-y-3">
        <div className="w-full h-32 bg-slate-100 rounded-xl overflow-hidden relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {item.tag && (
            <span
              className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}
            >
              {item.tag}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-[#10b981] transition-colors">
            {item.title}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">
            By {item.instructor}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-50 space-y-2">
        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          {item.rating}{" "}
          <span className="text-slate-400 font-normal">({item.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-black text-slate-900">
            {item.price}
          </span>
          <span className="text-[10px] text-slate-400 line-through font-medium">
            {item.oldPrice}
          </span>
        </div>
      </div>
    </div>
  );

  if (isSearchPage) {
    return (
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          {urlSearchQuery
            ? `Showing results for "${urlSearchQuery}"`
            : "Search for courses or institutes"}
        </h2>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchResults.map((item, idx) => (
              <CourseCard key={idx} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-semibold text-slate-700 mb-2">
              {urlSearchQuery === null || urlSearchQuery.trim() === ""
                ? "Start by typing in the search bar above."
                : "No courses found."}
            </p>
            <p className="text-sm text-slate-500">
              {urlSearchQuery === null || urlSearchQuery.trim() === ""
                ? "We'll show you matching courses and institutes here."
                : "Try using different keywords or check for typos."}
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {topCategories.map((category) => (
        <section key={category} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">{category}</h2>
            <button className="text-sm font-semibold text-[#10b981] hover:underline">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coursesByCategory[category].slice(0, 4).map((item, idx) => (
              <CourseCard key={idx} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Enquiries;
