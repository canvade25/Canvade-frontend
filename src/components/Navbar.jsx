import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, ShoppingCart, Search, Menu, X, ChevronDown, Heart, User } from "lucide-react";
import { getCartItems } from "../../api/cartApi";
import { getProfile } from "../../api/userApi";
const LOGO_SRC = "/canvade1.png";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const [isMobileDashboardOpen, setIsMobileDashboardOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [profileName, setProfileName] = useState(() => getStoredUser()?.displayName || "");
  const [profileImage, setProfileImage] = useState(() => getStoredUser()?.profileImage || "");
  const dropdownRef = useRef(null);
  const profileMenuRef = useRef(null);

  const token = localStorage.getItem("token") || localStorage.getItem("Token");
  const userRole = (localStorage.getItem("Role") || localStorage.getItem("role") || "").toLowerCase();
  const isLoggedIn = !!token;
  const isInstituteRole = ["admin", "institute", "educator"].includes(userRole);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Token");
    localStorage.removeItem("Role");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isDashboardActive = () =>
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/student/dashboard");

  const handleAccountSettings = () => {
    setIsProfileMenuOpen(false);
    navigate(isInstituteRole ? "/admin/dashboard/profile" : "/dashboard/profile");
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileDashboardOpen(false);
  };

  // Auto-close mobile menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useEffect(() => {
    const loadCartCount = async () => {
      if (!isLoggedIn || isInstituteRole) {
        setCartCount(0);
        return;
      }

      try {
        const items = await getCartItems(token);
        setCartCount(Array.isArray(items) ? items.length : 0);
      } catch (error) {
        console.error("Failed to load cart count:", error);
        setCartCount(0);
      }
    };

    loadCartCount();
  }, [isLoggedIn, isInstituteRole, token, location.pathname]);

  useEffect(() => {
    const refreshCartCount = () => {
      const currentToken = localStorage.getItem("token") || localStorage.getItem("Token");
      if (!currentToken || isInstituteRole) {
        setCartCount(0);
        return;
      }

      getCartItems(currentToken)
        .then((items) => setCartCount(Array.isArray(items) ? items.length : 0))
        .catch((error) => {
          console.error("Failed to refresh cart count:", error);
          setCartCount(0);
        });
    };

    const handleCartUpdated = () => refreshCartCount();
    const handleStorageChange = (event) => {
      if (["token", "Token", "Role", "role"].includes(event.key)) {
        refreshCartCount();
      }
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isInstituteRole]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDashboardDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch account details (name, photo, student ID) for the profile popup
  useEffect(() => {
    if (!isLoggedIn) {
      setStudentId(null);
      setProfileName("");
      setProfileImage("");
      return;
    }

    let mounted = true;
    getProfile()
      .then((res) => {
        if (!mounted || !res?.success) return;
        const data = res.data || {};
        setProfileName(data.displayName || "");
        setProfileImage(data.profileImage || "");
        setStudentId(data.studentId || null);
      })
      .catch((error) => console.error("Fetch profile error:", error));

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  const navLinkStyle = (path, forceActive = false) =>
    `text-[14px] font-sans transition-colors whitespace-nowrap cursor-pointer ${
      forceActive || isActive(path)
        ? "text-emerald-600 font-semibold"
        : "text-gray-600 hover:text-emerald-500"
    }`;

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-[99] xl:hidden transition-opacity duration-200 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center">
        <div className="w-full max-w-[1700px] px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <nav className="relative flex items-center justify-between rounded-b-2xl border border-gray-100 bg-white px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3 shadow-sm gap-2 sm:gap-3">

            {/* Left — Logo + Search */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 min-w-0">
              <img
                src={LOGO_SRC}
                alt="Canvade"
                className="h-6 sm:h-7 md:h-8 w-auto cursor-pointer object-contain shrink-0"
                onClick={() => navigate("/")}
              />

              <div className="hidden h-11 md:flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                <Search size={17} className="text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Courses and Institutes"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="h-full w-[170px] lg:w-[240px] xl:w-[270px] 2xl:w-[320px] px-2 text-[15px] outline-none bg-transparent placeholder:text-gray-400 font-inter"
                />
                <button
                  onClick={handleSearch}
                  className="mr-1 h-9 rounded-md bg-gray-100 px-5 text-[13px] font-medium text-slate-800 hover:bg-emerald-500 hover:text-white shrink-0 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Center — Desktop Nav Links */}
            <div className="hidden xl:flex items-center gap-5 2xl:gap-8 mx-auto">
              <Link to="/" className={navLinkStyle("/")}>Explore</Link>
              <Link to="/categories" className={navLinkStyle("/categories")}>Categories</Link>
              <Link to="/chat" className={navLinkStyle("/chat")}>Chat</Link>
              <Link to="/updates" className={navLinkStyle("/updates")}>Updates</Link>

              {isLoggedIn ? (
                <Link
                  to={isInstituteRole ? "/admin/dashboard" : "/dashboard"}
                  className={navLinkStyle(isInstituteRole ? "/admin/dashboard" : "/dashboard")}
                >
                  {isInstituteRole ? "Admin Dashboard" : "Student Dashboard"}
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDashboardDropdownOpen(!isDashboardDropdownOpen)}
                    className={`${navLinkStyle("", isDashboardActive())} flex items-center gap-1 focus:outline-none`}
                  >
                    Dashboard
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isDashboardDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDashboardDropdownOpen && (
                    <div className="absolute top-[130%] left-0 bg-white border border-gray-100 rounded-xl shadow-xl p-2 min-w-[180px] flex flex-col z-[110]">
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsDashboardDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-[13px] font-sans font-medium transition-colors text-left ${
                          isActive("/admin/dashboard")
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-gray-600 hover:bg-slate-50 hover:text-emerald-600"
                        }`}
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsDashboardDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-[13px] font-sans font-medium transition-colors text-left ${
                          isActive("/dashboard")
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-gray-600 hover:bg-slate-50 hover:text-emerald-600"
                        }`}
                      >
                        Student Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right — Icons + CTA + Hamburger */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
              <button
                onClick={() => navigate("/notifications")}
                className="p-1.5 sm:p-2 rounded-full transition-colors text-black hover:bg-emerald-50 hover:text-emerald-600"
              >
                <Bell size={18} strokeWidth={2.5} fill="currentColor" className="sm:w-5 sm:h-5" />
              </button>

              {!isInstituteRole && (
                <Link
                  to="/cart"
                  className="relative p-1.5 sm:p-2 rounded-full transition-colors text-black hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <Heart size={18} strokeWidth={2.5} fill="currentColor" className="sm:w-5 sm:h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isLoggedIn ? (
                <div className="relative hidden xl:block ml-1" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen((v) => !v)}
                    className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-all duration-200 active:scale-95 ${
                      isProfileMenuOpen
                        ? "border-emerald-400 ring-2 ring-emerald-100"
                        : "border-gray-200 hover:ring-2 hover:ring-emerald-100"
                    }`}
                    aria-label="Account menu"
                    aria-expanded={isProfileMenuOpen}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={profileName || "Account"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-emerald-50 text-[13px] font-bold text-emerald-700">
                        {profileName ? profileName.trim()[0]?.toUpperCase() : <User size={16} strokeWidth={2.5} />}
                      </span>
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute top-[130%] right-0 w-64 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden z-[110]">
                      <div className="flex items-center gap-3 px-4 py-3.5">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-emerald-50">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt={profileName || "Account"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[16px] font-bold text-emerald-700">
                              {profileName ? profileName.trim()[0]?.toUpperCase() : <User size={18} strokeWidth={2.5} />}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-sans font-bold text-gray-900">
                            {profileName || (isInstituteRole ? "Institute Account" : "Student Account")}
                          </p>
                          <p className="truncate text-[12px] font-sans text-gray-400">
                            {studentId || (isInstituteRole ? "Institute" : " ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col border-t border-gray-100">
                        <button
                          onClick={handleAccountSettings}
                          className="border-b border-gray-100 px-4 py-3 text-left text-[13px] font-sans font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          Account Settings
                        </button>
                        <button
                          onClick={() => { setIsProfileMenuOpen(false); navigate("/help-center"); }}
                          className="border-b border-gray-100 px-4 py-3 text-left text-[13px] font-sans font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          Help and Support
                        </button>
                        <button
                          onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }}
                          className="px-4 py-3 text-left text-[13px] font-sans font-semibold text-red-600 transition-colors hover:bg-red-50"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/get-started")}
                  className="hidden xl:block rounded-md bg-white border border-gray-200 hover:bg-emerald-500 hover:text-white px-3 2xl:px-5 py-2 text-[13px] font-sans font-semibold text-gray-700 transition-colors duration-500 ease-in-out active:scale-95 ml-1"
                >
                  Get Started
                </button>
              )}

              <button
                className="xl:hidden p-1.5 sm:p-2 text-gray-600 hover:bg-gray-50 rounded-lg ml-0.5 sm:ml-1 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
              </button>
            </div>

            {/* Mobile / Tablet Dropdown Menu */}
            <div
              className={`absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-gray-100 bg-white shadow-2xl xl:hidden overflow-hidden transition-all duration-200 origin-top ${
                isMenuOpen
                  ? "opacity-100 scale-y-100 pointer-events-auto"
                  : "opacity-0 scale-y-95 pointer-events-none"
              }`}
            >
              {/* Mobile Search — hidden on md+ since search is in navbar */}
              <div className="p-3 sm:p-4 border-b border-gray-100 md:hidden">
                <div className="flex h-11 items-center rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <Search size={17} className="text-gray-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Courses and Institutes"
                    className="flex-1 min-w-0 px-2 text-[14px] font-inter outline-none bg-transparent placeholder:text-gray-400"
                  />
                  <button className="mr-1 h-9 rounded-md bg-gray-100 px-4 text-[13px] font-medium text-slate-800 hover:bg-gray-200 shrink-0 transition-colors">
                    Search
                  </button>
                </div>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col px-3 sm:px-4 py-1">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-sans font-semibold border-b border-gray-100 transition-colors ${
                    isActive("/") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                  }`}
                >
                  Explore <span className="text-gray-300 text-xl">›</span>
                </Link>

                <Link
                  to="/categories"
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-sans font-semibold border-b border-gray-100 transition-colors ${
                    isActive("/categories") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                  }`}
                >
                  Categories <span className="text-gray-300 text-xl">›</span>
                </Link>

                <Link
                  to="/chat"
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-sans font-semibold border-b border-gray-100 transition-colors ${
                    isActive("/chat") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                  }`}
                >
                  Chat <span className="text-gray-300 text-xl">›</span>
                </Link>

                <Link
                  to="/updates"
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-sans font-semibold border-b border-gray-100 transition-colors ${
                    isActive("/updates") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                  }`}
                >
                  Updates <span className="text-gray-300 text-xl">›</span>
                </Link>

                {/* Dashboard Link / Accordion */}
                {isLoggedIn ? (
                  <Link
                    to={isInstituteRole ? "/admin/dashboard" : "/dashboard"}
                    onClick={closeMenu}
                    className={`flex items-center justify-between py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-sans font-semibold border-b border-gray-100 transition-colors ${
                      isDashboardActive() ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                    }`}
                  >
                    {isInstituteRole ? "Admin Dashboard" : "Student Dashboard"} <span className="text-gray-300 text-xl">›</span>
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => setIsMobileDashboardOpen(!isMobileDashboardOpen)}
                      className={`w-full flex items-center justify-between py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-sans font-semibold border-b border-gray-100 transition-colors focus:outline-none ${
                        isDashboardActive() ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                      }`}
                    >
                      Dashboard
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          isMobileDashboardOpen ? "rotate-180 text-emerald-500" : "text-gray-400"
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isMobileDashboardOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-col bg-emerald-50/50 rounded-xl my-2 overflow-hidden border border-emerald-100/60">
                        <Link
                          to="/admin/dashboard"
                          onClick={closeMenu}
                          className={`flex items-center justify-between px-4 py-3.5 text-[14px] font-sans font-semibold border-b border-emerald-100/40 transition-colors ${
                            isActive("/admin/dashboard")
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/70"
                          }`}
                        >
                          Admin Dashboard <span className="text-gray-300">›</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={closeMenu}
                          className={`flex items-center justify-between px-4 py-3.5 text-[14px] font-sans font-semibold transition-colors ${
                            isActive("/dashboard")
                              ? "text-emerald-700 bg-emerald-50"
                              : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/70"
                          }`}
                        >
                          Student Dashboard <span className="text-gray-300">›</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Bar — Notifications, Cart, Get Started */}
              <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3 sm:gap-5">
                  <button
                    onClick={() => { navigate("/notifications"); closeMenu(); }}
                    className="flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] font-sans text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <Bell size={15} strokeWidth={2.5} fill="currentColor" className="sm:w-4 sm:h-4" />
                    <span>Notifications</span>
                  </button>
                  {!isInstituteRole && (
                    <Link
                      to="/cart"
                      onClick={closeMenu}
                      className="relative flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] font-sans text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <Heart size={15} strokeWidth={2.5} fill="currentColor" className="sm:w-4 sm:h-4" />
                      <span>Learn List</span>
                      {cartCount > 0 && (
                        <span className="absolute -right-3 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow-sm">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {isLoggedIn ? (
                    <button
                      onClick={() => { handleLogout(); closeMenu(); }}
                      className="rounded-xl bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-sans font-semibold transition-colors active:scale-95"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => { navigate("/get-started"); closeMenu(); }}
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] font-sans font-semibold transition-colors active:scale-95"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            </div>

          </nav>
        </div>
      </div>
    </>
  );
}
