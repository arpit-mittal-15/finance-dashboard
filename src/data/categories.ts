import type { CategoryInfo } from "../types";

export const CATEGORIES: Record<string, CategoryInfo> = {
  Salary: {
    name: "Salary",
    color: "#10b981",
    bgLight: "bg-emerald-50 text-emerald-700",
    bgDark: "dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  Freelance: {
    name: "Freelance",
    color: "#14b8a6",
    bgLight: "bg-teal-50 text-teal-700",
    bgDark: "dark:bg-teal-500/10 dark:text-teal-400",
  },
  Investment: {
    name: "Investment",
    color: "#22c55e",
    bgLight: "bg-green-50 text-green-700",
    bgDark: "dark:bg-green-500/10 dark:text-green-400",
  },
  "Food & Dining": {
    name: "Food & Dining",
    color: "#f97316",
    bgLight: "bg-orange-50 text-orange-700",
    bgDark: "dark:bg-orange-500/10 dark:text-orange-400",
  },
  Groceries: {
    name: "Groceries",
    color: "#84cc16",
    bgLight: "bg-lime-50 text-lime-700",
    bgDark: "dark:bg-lime-500/10 dark:text-lime-400",
  },
  Shopping: {
    name: "Shopping",
    color: "#f43f5e",
    bgLight: "bg-rose-50 text-rose-700",
    bgDark: "dark:bg-rose-500/10 dark:text-rose-400",
  },
  Rent: {
    name: "Rent",
    color: "#8b5cf6",
    bgLight: "bg-violet-50 text-violet-700",
    bgDark: "dark:bg-violet-500/10 dark:text-violet-400",
  },
  Utilities: {
    name: "Utilities",
    color: "#06b6d4",
    bgLight: "bg-cyan-50 text-cyan-700",
    bgDark: "dark:bg-cyan-500/10 dark:text-cyan-400",
  },
  Transport: {
    name: "Transport",
    color: "#eab308",
    bgLight: "bg-yellow-50 text-yellow-700",
    bgDark: "dark:bg-yellow-500/10 dark:text-yellow-400",
  },
  Health: {
    name: "Health",
    color: "#ec4899",
    bgLight: "bg-pink-50 text-pink-700",
    bgDark: "dark:bg-pink-500/10 dark:text-pink-400",
  },
  Entertainment: {
    name: "Entertainment",
    color: "#6366f1",
    bgLight: "bg-indigo-50 text-indigo-700",
    bgDark: "dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  Education: {
    name: "Education",
    color: "#3b82f6",
    bgLight: "bg-blue-50 text-blue-700",
    bgDark: "dark:bg-blue-500/10 dark:text-blue-400",
  },
};

/** Return the colour string for a given category, defaulting to slate */
export function getCategoryColor(category: string): string {
  return CATEGORIES[category]?.color ?? "#94a3b8";
}

/** Return Tailwind badge classes for a given category */
export function getCategoryBadgeClasses(category: string): string {
  const cat = CATEGORIES[category];
  if (!cat)
    return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  return `${cat.bgLight} ${cat.bgDark}`;
}

/** Ordered list of all expense categories */
export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Shopping",
  "Rent",
  "Utilities",
  "Transport",
  "Health",
  "Entertainment",
  "Education",
];

/** Ordered list of all income categories */
export const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment"];

/** All category names */
export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
