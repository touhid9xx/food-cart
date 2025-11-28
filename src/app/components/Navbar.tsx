"use client";
import Link from "next/link";
import NavigationMenu from "./NavigationMenu";
import ThemeColorSelector from "./ThemeControls/ThemeColorSelector";
import ThemeModeToggle from "./ThemeControls/ThemeModeToggle";
import CartIcon from "./CartIcon";

export default function Navbar() {
  return (
    <nav className="glassmorphism backdrop-blur-lg border-b border-white/20 shadow-xl sticky top-0 z-50 neon-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-current to-transparent bg-clip-text text-transparent neon-text">
                FoodCart
              </h1>
            </Link>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu />

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <CartIcon />

            {/* Theme Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeColorSelector />
              <ThemeModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
