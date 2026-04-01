import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useFinanceStore } from "../../store/useFinanceStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const darkMode = useFinanceStore((s) => s.darkMode);

  // Sync dark mode class on mount & changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* Main area offset by sidebar on desktop */}
      <div className="flex flex-col flex-1 lg:ml-[240px] min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
