"use client";
import { useAppSelector } from "@/app/lib/hooks";
import { useEffect } from "react";


export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode, color } = useAppSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove(
      "light",
      "dark",
      "blue-theme",
      "green-theme",
      "purple-theme"
    );

    // Add current theme classes
    root.classList.add(mode, `${color}-theme`);
  }, [mode, color]);

  return <>{children}</>;
}
