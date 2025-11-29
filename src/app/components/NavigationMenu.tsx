/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../lib/slices/authSlice";

export default function NavigationMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Ensure this only runs on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDashboardOpen(false);
    setIsUserOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dashboardRef.current &&
        !dashboardRef.current.contains(event.target as Node)
      ) {
        setIsDashboardOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(
          'button[aria-label="Toggle mobile menu"]'
        )
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const dashboardItems = [
    { name: "Order Summary", href: "/dashboard/orders" },
    { name: "Sales", href: "/dashboard/sales" },
    { name: "Inventory", href: "/dashboard/inventory" },
    { name: "Report", href: "/dashboard/report" },
    { name: "User Management", href: "/dashboard/users" },
  ];

  const userItems = [
    { name: "Profile", href: "/profile", icon: "👤" },
    { name: "My Orders", href: "/my-orders", icon: "📦" },
    { name: "Settings", href: "/settings", icon: "⚙️" },
  ];

  const authItems = [
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" },
  ];

  const isActive = (href: string) => {
    if (!isMounted) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsDashboardOpen(false);
    setIsUserOpen(false);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await dispatch(logoutUser()).unwrap();
      setIsUserOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  // Don't render navigation until mounted on client
  if (!isMounted) {
    return (
      <div className="hidden md:flex items-center space-x-6">
        {/* Placeholder for SSR */}
        {navigationItems.map((item) => (
          <div
            key={item.name}
            className="px-3 py-2 rounded-lg transition-all duration-300 font-medium opacity-50"
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium ${
              isActive(item.href)
                ? "theme-accent bg-white/20 backdrop-blur-sm"
                : "hover:bg-white/10 hover:backdrop-blur-sm"
            }`}
          >
            {item.name}
          </Link>
        ))}

        {/* Dashboard Dropdown - Only for admin/staff */}
        {isAuthenticated &&
          (user?.role === "admin" || user?.role === "staff") && (
            <div className="relative" ref={dashboardRef}>
              <button
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium flex items-center space-x-1 ${
                  isActive("/dashboard")
                    ? "theme-accent bg-white/20 backdrop-blur-sm"
                    : "hover:bg-white/10 hover:backdrop-blur-sm"
                }`}
              >
                <span>Dashboard</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isDashboardOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDashboardOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 glassmorphism rounded-xl backdrop-blur-lg border border-white/20 shadow-xl z-50">
                  {dashboardItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsDashboardOpen(false)}
                      className={`block px-4 py-3 transition-all duration-300 border-b border-white/10 last:border-b-0 ${
                        isActive(item.href)
                          ? "theme-accent bg-white/20"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* User Profile Dropdown - Circular (Show when authenticated) */}
        {isAuthenticated && user ? (
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserOpen(!isUserOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                isUserOpen ||
                isActive("/profile") ||
                isActive("/my-orders") ||
                isActive("/settings")
                  ? "theme-accent border-white bg-white/20 backdrop-blur-sm"
                  : "border-white/30 hover:border-white/50 hover:bg-white/10"
              }`}
              aria-label="User menu"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg">👤</span>
              )}
            </button>

            {isUserOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 glassmorphism rounded-xl backdrop-blur-lg border border-white/20 shadow-xl z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs opacity-70 truncate">{user.email}</p>
                  <p className="text-xs opacity-50 capitalize mt-1">
                    {user.role}
                  </p>
                </div>

                {/* User Menu Items */}
                {userItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsUserOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 transition-all duration-300 border-b border-white/10 last:border-b-0 ${
                      isActive(item.href)
                        ? "theme-accent bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-300 border-t border-white/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                    logoutLoading ? "animate-pulse" : ""
                  }`}
                >
                  <span className="text-lg">{logoutLoading ? "⏳" : "🚪"}</span>
                  <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Auth Buttons - Show when user is not logged in */
          <div className="flex items-center space-x-3 ml-4">
            {authItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                  isActive(item.href)
                    ? "theme-accent bg-white/20 backdrop-blur-sm"
                    : "hover:bg-white/10 hover:backdrop-blur-sm"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
        aria-label="Toggle mobile menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Navigation - Dashboard is hidden in mobile */}
      {isMobileMenuOpen && (
        <div
          className="absolute top-16 left-0 right-0 glassmorphism backdrop-blur-lg border-b border-white/20 shadow-xl md:hidden z-40"
          ref={mobileMenuRef}
        >
          <div className="px-4 py-6 space-y-4">
            {/* Main Navigation */}
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeAllMenus}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  isActive(item.href)
                    ? "theme-accent bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* User Section - Show when authenticated */}
            {isAuthenticated && user ? (
              <div className="border-t border-white/20 pt-4">
                {/* User Info in Mobile */}
                <div className="px-4 py-3 mb-3 bg-white/5 rounded-lg">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs opacity-70">{user.email}</p>
                </div>

                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-between ${
                    isActive("/profile") ||
                    isActive("/my-orders") ||
                    isActive("/settings")
                      ? "theme-accent bg-white/20"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-lg">👤</span>
                    <span>My Account</span>
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isUserOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserOpen && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-white/20 pl-4">
                    {userItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeAllMenus}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                          isActive(item.href)
                            ? "theme-accent bg-white/20"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}

                    {/* Mobile Logout Button */}
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                        logoutLoading ? "animate-pulse" : ""
                      }`}
                    >
                      <span className="text-lg">
                        {logoutLoading ? "⏳" : "🚪"}
                      </span>
                      <span>{logoutLoading ? "Logging out..." : "Logout"}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons for Mobile */
              <div className="border-t border-white/20 pt-4 space-y-2">
                {authItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeAllMenus}
                    className={`block px-4 py-3 rounded-lg transition-all duration-300 font-medium text-center ${
                      isActive(item.href)
                        ? "theme-accent bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={closeAllMenus}
        />
      )}
    </>
  );
}
