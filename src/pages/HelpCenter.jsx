import React, { useState } from "react";
import {
  Search,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function FeedbackWidget() {
  const [vote, setVote] = useState(null);
  return (
    <div className="absolute right-0 bottom-0 transform translate-y-2 flex flex-col items-center bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 shadow-sm select-none">
      <span className="text-[9px] font-medium text-gray-400 tracking-tight mb-1">
        Is this helpful or not?
      </span>
      <div className="flex items-center gap-2 border-t border-gray-100 pt-1 w-full justify-center">
        <button
          onClick={() => setVote("up")}
          className={`p-1 rounded transition-colors ${vote === "up" ? "text-emerald-600" : "text-gray-300 hover:text-emerald-500"}`}
        >
          <ThumbsUp className="w-4 h-4 fill-current" />
        </button>
        <div className="w-px h-3.5 bg-gray-200"></div>
        <button
          onClick={() => setVote("down")}
          className={`p-1 rounded transition-colors ${vote === "down" ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const categories = [
  {
    id: 1,
    title: "1. Getting Started",
    items: [
      "What is Canvade",
      "How the platform works",
      "See More related content +",
    ],
  },
  {
    id: 2,
    title: "2. Finding the Right Course",
    items: [
      "How to search and compare courses",
      "What to check before enrolling",
      "See More related content +",
    ],
  },
  {
    id: 3,
    title: "3. Communication with Educators",
    items: [
      "How to contact Educators",
      "Using in-platform chat",
      "See More related content +",
    ],
  },
  {
    id: 4,
    title: "4. Payments and Enrollments",
    items: [
      "How to enroll in a course",
      "Payment process and safety",
      "See More related content +",
    ],
  },
  {
    id: 5,
    title: "5. Refunds and Disputes",
    items: [
      "Refund eligibility",
      "How to raise a complaint",
      "See More related content +",
    ],
  },
  {
    id: 6,
    title: "6. Safety and Trust",
    items: [
      "How Canvade prevents scams",
      "Educator verification process",
      "See More related content +",
    ],
  },
  {
    id: 7,
    title: "7. Account and Profile",
    items: [
      "Managing your account",
      "Updating personal details",
      "See More related content +",
    ],
  },
  {
    id: 8,
    title: "8. Policies and Rules",
    items: [
      "Platform rules for students",
      "What is not allowed",
      "See More related content +",
    ],
  },
  {
    id: 9,
    title: "9. Technical Issues",
    items: ["Login problems", "Payment failures", "See More related content +"],
  },
  {
    id: 10,
    title: "10. Support and Contact",
    items: [
      "How to contact support",
      "Response timelines",
      "See More related content +",
    ],
  },
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#333333] antialiased flex flex-col pt-16">
      <Navbar />

      <header className="sticky top-14 bg-white z-40 px-4 md:px-12 py-3 border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="flex items-center gap-2 select-none">
              <span className="w-2.5 h-10 md:h-12 bg-[#FAB814] rounded-sm block"></span>
              <h1 className="text-xl md:text-[1.65rem] font-bold tracking-tight text-[#056854]">
                Help Center
              </h1>
            </div>
          </div>

          <div className="w-full sm:flex-1 sm:max-w-lg flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm focus-within:border-[#056854] transition-colors">
            <div className="pl-3 text-gray-400 flex-shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Write your Question"
              className="w-full px-2 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            <button className="bg-[#EAEAEA] hover:bg-gray-200 border-l border-gray-300 text-xs font-medium text-gray-600 px-3 md:px-4 py-2 transition-colors flex-shrink-0">
              Search
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-8 lg:px-12 py-5 md:py-8 flex gap-6 md:gap-10 relative">
        <aside
          className={`
            fixed md:relative top-[120px] md:top-0 left-0 h-[calc(100vh-120px)] md:h-auto
            w-[270px] sm:w-[290px] md:w-[260px] lg:w-[300px]
            bg-[#F3F6F8] md:rounded-2xl p-4 overflow-y-auto z-30
            transition-transform duration-300 ease-in-out flex-shrink-0
            ${isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="space-y-3.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`rounded-xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "bg-[#056854] text-white shadow-md"
                      : "bg-white border border-gray-200/70 hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-semibold text-[13px] transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[#333333] hover:bg-gray-50"
                    }`}
                  >
                    {cat.title}
                  </button>

                  <ul className="px-4 pb-3.5 space-y-1.5 list-disc list-inside text-[12px]">
                    {cat.items.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() =>
                          item.includes("+") && toggleItem(`${cat.id}-${idx}`)
                        }
                        className={`cursor-pointer transition-colors leading-relaxed ${
                          isActive
                            ? "text-emerald-50/90 hover:text-white"
                            : "text-[#4F4F4F] hover:text-[#056854]"
                        } ${item.includes("+") ? "list-none font-semibold mt-1.5 text-[11.5px]" : ""}`}
                      >
                        {item}

                        {item.includes("+") &&
                          openItems[`${cat.id}-${idx}`] && (
                            <div className="mt-2 space-y-1 pl-2 text-[11px] font-normal">
                              <p>• Additional Help Content 1</p>
                              <p>• Additional Help Content 2</p>
                              <p>• Additional Help Content 3</p>
                            </div>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-8 leading-tight">
            Getting Started
          </h2>

          <div className="space-y-14">
            <article className="relative pb-8">
              <h3 className="text-[17px] font-bold text-[#111111] mb-2.5">
                1.&nbsp;&nbsp;What is Canvade?
              </h3>
              <p className="text-[13.5px] text-[#444444] leading-relaxed mb-4">
                Canvade is a discovery and enrollment platform that connects
                students with Educators such as institutes, colleges, schools,
                and universities.
              </p>
              <h4 className="text-[13.5px] font-bold text-[#222222] mb-2">
                It helps you:
              </h4>
              <ul className="list-disc list-inside text-[13.5px] text-[#444444] space-y-2 pl-1 mb-5">
                <li>
                  <span className="italic underline text-gray-600 cursor-pointer hover:text-black transition-colors">
                    Find and compare courses
                  </span>{" "}
                  in one place
                </li>
                <li>
                  View detailed information like curriculum, pricing, and media
                </li>
                <li>
                  <span className="italic underline text-gray-600 cursor-pointer hover:text-black transition-colors">
                    Communicate directly
                  </span>{" "}
                  with Educators
                </li>
                <li>Enroll securely through the platform</li>
              </ul>
              <p className="text-[13.5px] text-[#444444] leading-relaxed">
                Canvade acts as a trusted layer that improves transparency and
                reduces risks like scams or hidden charges.
              </p>
              <FeedbackWidget />
            </article>

            <article className="relative pb-8">
              <h3 className="text-[17px] font-bold text-[#111111] mb-2.5">
                2.&nbsp;&nbsp;How does Canvade work?
              </h3>
              <p className="text-[13.5px] font-bold text-[#222222] mb-3">
                Canvade follows a simple flow:
              </p>
              <div className="space-y-4 text-[13.5px] text-[#444444] pl-1">
                {[
                  {
                    title: "Search and Discover",
                    desc: (
                      <>
                        <span className="underline text-gray-600 cursor-pointer hover:text-black transition-colors">
                          Browse courses
                        </span>{" "}
                        based on your interest, location, or category
                      </>
                    ),
                  },
                  {
                    title: "Compare and Evaluate",
                    desc: "Check course details, pricing, curriculum, and Educator information",
                  },
                  {
                    title: "Connect with Educators",
                    desc: (
                      <>
                        Use{" "}
                        <span className="italic underline text-gray-600 cursor-pointer hover:text-black transition-colors">
                          in-platform chat
                        </span>{" "}
                        to ask questions and clarify doubts
                      </>
                    ),
                  },
                  {
                    title: "Enroll Securely",
                    desc: "Complete your payment through Canvade for a safe transaction",
                  },
                  {
                    title: "Start Learning",
                    desc: "Join the course with the selected Educator",
                  },
                ].map((step, i) => (
                  <div key={i}>
                    <h5 className="font-bold text-[#222222]">- {step.title}</h5>
                    <p className="pl-3 mt-0.5">{step.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-[13.5px] text-[#444444] leading-relaxed mt-4">
                The platform is designed to keep everything — discovery,
                communication, and payment — in one secure system.
              </p>
              <FeedbackWidget />
            </article>

            <article className="relative pb-8">
              <h3 className="text-[17px] font-bold text-[#111111] mb-2.5">
                3.&nbsp;&nbsp;How do I create an account on Canvade?
              </h3>
              <p className="text-[13.5px] font-bold text-[#222222] mb-3">
                Creating an account is simple:
              </p>
              <ul className="list-disc list-inside text-[13.5px] text-[#444444] space-y-2 pl-1 mb-5">
                <li>
                  <span className="italic underline text-gray-600 cursor-pointer hover:text-black transition-colors">
                    Sign up
                  </span>{" "}
                  using your basic details (such as name, phone number, or
                  email)
                </li>
                <li>Verify your account if required</li>
                <li>Complete your profile for a better experience</li>
              </ul>
              <p className="text-[13.5px] font-bold text-[#222222] mb-3">
                Once your account is created, you can:
              </p>
              <ul className="list-disc list-inside text-[13.5px] text-[#444444] space-y-2 pl-1 mb-4">
                <li>
                  <span className="italic underline text-gray-600 cursor-pointer hover:text-black transition-colors">
                    Explore courses
                  </span>
                </li>
                <li>
                  <span className="italic underline text-gray-600 cursor-pointer hover:text-black transition-colors">
                    Chat with Educators
                  </span>
                </li>
                <li>Enroll in programs</li>
              </ul>
              <p className="text-[13.5px] text-[#444444] leading-relaxed">
                Your account also keeps track of your enrollments, payments, and
                activity on the platform.
              </p>
              <FeedbackWidget />
            </article>

            <article className="relative pb-2">
              <h3 className="text-[17px] font-bold text-[#111111] mb-2.5">
                4.&nbsp;&nbsp;Do I need an account to use Canvade?
              </h3>
              <p className="text-[13.5px] text-[#444444] leading-relaxed mb-4">
                You can browse and explore courses on Canvade without creating
                an account. However, to access full features, an account is
                required.
              </p>
              <p className="text-[13.5px] font-bold text-[#222222] mb-2">
                You need an account to:
              </p>
              <ul className="list-disc list-inside text-[13.5px] space-y-2 pl-1">
                <li className="text-[#A6A6A6]">
                  <span className="italic underline cursor-not-allowed text-[#A6A6A6]">
                    Chat with Educators
                  </span>
                </li>
                <li className="text-[#A6A6A6]">Enroll in courses</li>
              </ul>
            </article>
          </div>

          <footer className="mt-16 flex items-center justify-center gap-1.5">
            <button className="p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 border border-gray-200 rounded-md transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-xs font-semibold border border-gray-300 bg-white text-gray-700 rounded-md shadow-sm">
              1
            </button>
            <button className="p-1.5 text-gray-300 hover:text-gray-500 hover:bg-gray-50 border border-gray-200 rounded-md transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </footer>
        </main>
      </div>

      <Footer />
    </div>
  );
}
