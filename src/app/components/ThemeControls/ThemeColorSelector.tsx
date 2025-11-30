"use client";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setThemeColor } from "../../../lib/slices/themeSlice";

export default function ThemeColorSelector() {
  const dispatch = useAppDispatch();
  const { color } = useAppSelector((state) => state.theme);

  const themeColors = ["blue", "green", "purple"] as const;

  const getColorClasses = (themeColor: string) => {
    const baseClasses =
      "w-10 h-10 rounded-full border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ";

    const colorMap = {
      blue: `bg-gradient-to-br from-blue-400 to-blue-600 border-blue-200 shadow-md ${
        color === "blue"
          ? "ring-3 ring-blue-400 ring-opacity-80 scale-110 shadow-lg"
          : "hover:ring-2 hover:ring-blue-300"
      }`,
      green: `bg-gradient-to-br from-green-400 to-green-600 border-green-200 shadow-md ${
        color === "green"
          ? "ring-3 ring-green-400 ring-opacity-80 scale-110 shadow-lg"
          : "hover:ring-2 hover:ring-green-300"
      }`,
      purple: `bg-gradient-to-br from-purple-400 to-purple-600 border-purple-200 shadow-md ${
        color === "purple"
          ? "ring-3 ring-purple-400 ring-opacity-80 scale-110 shadow-lg"
          : "hover:ring-2 hover:ring-purple-300"
      }`,
    };

    return baseClasses + colorMap[themeColor as keyof typeof colorMap];
  };

  return (
    <div className="flex space-x-3 bg-opacity-25 dark:bg-dark-opacity-25 rounded-full p-2 backdrop-blur-sm border border-white/30">
      {themeColors.map((themeColor) => (
        <button
          key={themeColor}
          onClick={() => dispatch(setThemeColor(themeColor))}
          className={getColorClasses(themeColor)}
          aria-label={`Switch to ${themeColor} theme`}
          title={`${
            themeColor.charAt(0).toUpperCase() + themeColor.slice(1)
          } Theme`}
        />
      ))}
    </div>
  );
}
