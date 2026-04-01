import React from "react";
import { getCategoryBadgeClasses } from "../../data/categories";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "income" | "expense" | "category";
  category?: string;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  category,
  className = "",
}: BadgeProps) {
  const base = "badge";

  const variantClasses: Record<string, string> = {
    default:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    income:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    expense:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  const classes =
    variant === "category" && category
      ? getCategoryBadgeClasses(category)
      : variantClasses[variant] || variantClasses.default;

  return <span className={`${base} ${classes} ${className}`}>{children}</span>;
}
