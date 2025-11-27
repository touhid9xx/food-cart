"use client";

import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setThemeColor, setThemeMode } from "@/app/lib/slices/themeSlice";


export default function Navbar() {
  const dispatch = useAppDispatch();
  const { mode, color } = useAppSelector((state) => state.theme);

  const themeColors = ["blue", "green", "purple"] as const;

  const getColorClasses = (themeColor: string) => {
    const baseClasses =
      "w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ";

    const colorMap = {
      blue: `bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 ${
        color === "blue" ? "ring-3 ring-blue-400 scale-110 shadow-lg" : ""
      }`,
      green: `bg-gradient-to-br from-green-400 to-green-600 border-green-300 ${
        color === "green" ? "ring-3 ring-green-400 scale-110 shadow-lg" : ""
      }`,
      purple: `bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300 ${
        color === "purple" ? "ring-3 ring-purple-400 scale-110 shadow-lg" : ""
      }`,
    };

    return baseClasses + colorMap[themeColor as keyof typeof colorMap];
  };

  return (
    <nav className="glassmorphism backdrop-blur-lg border-b border-white/20 shadow-xl sticky top-0 z-50 neon-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-current to-transparent bg-clip-text text-transparent neon-text">
              FoodCart
            </h1>
          </div>

          {/* Theme Controls */}
          <div className="flex items-center space-x-4">
            {/* Color Theme Buttons */}
            <div className="flex space-x-3 bg-black/10 dark:bg-white/10 rounded-full p-2">
              {themeColors.map((themeColor) => (
                <button
                  key={themeColor}
                  onClick={() => dispatch(setThemeColor(themeColor))}
                  className={getColorClasses(themeColor)}
                  aria-label={`Switch to ${themeColor} theme`}
                />
              ))}
            </div>

            {/* Light/Dark Mode Toggle */}
            <button
              onClick={() =>
                dispatch(setThemeMode(mode === "light" ? "dark" : "light"))
              }
              className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-yellow-300 to-orange-400 dark:from-gray-600 dark:to-gray-800 transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-xl"
              aria-label={`Switch to ${
                mode === "light" ? "dark" : "light"
              } mode`}
            >
              <span className="text-sm">{mode === "light" ? "☀️" : "🌙"}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
