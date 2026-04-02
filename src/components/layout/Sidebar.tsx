import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Lightbulb,
  Settings,
  X,
  BarChart3,
  PieChart
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";

const NAV_ITEMS = [
  { path: "/", label: "Overview", icon: LayoutDashboard },
  { path: "/analytics", label: "Analytics", icon: PieChart },
  { path: "/budgets", label: "Budgets", icon: Lightbulb },
  { path: "/transactions", label: "Transactions", icon: Receipt },
  { path: "/settings", label: "Settings", icon: Settings, disabled: true },
];

export default function Sidebar() {
  const sidebarOpen = useFinanceStore((s) => s.sidebarOpen);
  const setSidebarOpen = useFinanceStore((s) => s.setSidebarOpen);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">
          FinanceFlow
        </span>

        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto lg:hidden p-1.5 rounded-md hover:bg-slate-800 text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          item.disabled ? (
            <button
              key={item.path}
              disabled
              className="sidebar-link w-full text-slate-600 cursor-not-allowed flex items-center gap-3 px-3 py-2 rounded-lg"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          )
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-300 truncate">Arpit</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[240px] lg:fixed lg:inset-y-0 lg:left-0 z-40 border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="fixed inset-y-0 left-0 z-50 w-[240px] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
