import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Sun,
  Moon,
  Download,
  FileJson,
  FileText,
  Shield,
  Eye,
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { exportToCSV, exportToJSON } from "../../utils/export";

export default function Navbar() {
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);
  const darkMode = useFinanceStore((s) => s.darkMode);
  const toggleDarkMode = useFinanceStore((s) => s.toggleDarkMode);
  const setSidebarOpen = useFinanceStore((s) => s.setSidebarOpen);
  const transactions = useFinanceStore((s) => s.transactions);

  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node))
        setExportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Role switcher */}
          <div className="hidden sm:flex items-center gap-0.5 px-1 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setRole("viewer")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                role === "viewer"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Viewer
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                role === "admin"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
          </div>

          {/* Mobile role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="sm:hidden text-xs px-2 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-0"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>

          {/* Export */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="btn-ghost"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Export</span>
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <button
                  onClick={() => {
                    exportToCSV(transactions);
                    setExportOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <FileText className="w-4 h-4 text-slate-400" /> Export CSV
                </button>
                <button
                  onClick={() => {
                    exportToJSON(transactions);
                    setExportOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <FileJson className="w-4 h-4 text-slate-400" /> Export JSON
                </button>
              </div>
            )}
          </div>

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
