/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Ensure this only runs on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDashboardOpen(false);
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
    { name: "User", href: "/dashboard/user" },
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

        {/* Dashboard Dropdown */}
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

        {/* Auth Buttons */}
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

      {/* Mobile Navigation */}
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

            {/* Dashboard Section */}
            <div className="border-t border-white/20 pt-4">
              <button
                onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                className={`w-full px-4 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-between ${
                  isActive("/dashboard")
                    ? "theme-accent bg-white/20"
                    : "hover:bg-white/10"
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
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-white/20 pl-4">
                  {dashboardItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeAllMenus}
                      className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
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

            {/* Auth Buttons */}
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
