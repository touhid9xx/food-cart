"use client";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setThemeMode } from "../../../lib/slices/themeSlice";

export default function ThemeModeToggle() {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  const getModeButtonClasses = () => {
    const baseClasses =
      "w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-xl ";

    if (mode === "light") {
      return (
        baseClasses +
        "bg-gradient-to-br from-yellow-300 to-amber-400 border-amber-200 text-amber-900 shadow-md hover:ring-2 hover:ring-yellow-300"
      );
    } else {
      return (
        baseClasses +
        "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-300 text-white shadow-md hover:ring-2 hover:ring-indigo-300"
      );
    }
  };

  const getModeIcon = () => {
    if (mode === "light") {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      );
    }
  };

  return (
    <div className="bg-opacity-25 dark:bg-dark-opacity-25 rounded-full p-1 backdrop-blur-sm border border-white/30">
      <button
        onClick={() =>
          dispatch(setThemeMode(mode === "light" ? "dark" : "light"))
        }
        className={getModeButtonClasses()}
        aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
      >
        {getModeIcon()}
      </button>
    </div>
  );
}
