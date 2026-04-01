import React from "react";
import { motion } from "framer-motion";
import {
  PiggyBank,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertTriangle,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { Insight } from "../../types";
import { useFinanceStore } from "../../store/useFinanceStore";

const ICON_MAP: Record<string, React.ElementType> = {
  "piggy-bank": PiggyBank,
  "trending-up": TrendingUp,
  "bar-chart": BarChart3,
  calendar: Calendar,
  "alert-triangle": AlertTriangle,
  receipt: Receipt,
};

const TYPE_STYLES: Record<string, string> = {
  positive: "border-emerald-200 dark:border-emerald-800",
  negative: "border-red-200 dark:border-red-800",
  neutral: "border-slate-200 dark:border-slate-800",
  warning: "border-amber-200 dark:border-amber-800",
};

const TYPE_ICON_STYLES: Record<string, string> = {
  positive:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  negative: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  warning:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
};

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  const Icon = ICON_MAP[insight.icon] || BarChart3;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 + index * 0.04 }}
      className={`rounded-xl border bg-white dark:bg-slate-900 p-4 ${TYPE_STYLES[insight.type]}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg flex-shrink-0 ${TYPE_ICON_STYLES[insight.type]}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {insight.title}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {insight.value}
            </p>
            {insight.change !== undefined && (
              <span
                className={`inline-flex items-center text-xs font-medium ${
                  insight.change >= 0 ? "text-red-500" : "text-emerald-500"
                }`}
              >
                {insight.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function InsightsPanel() {
  const insights = useFinanceStore((s) => s.getSmartInsights());
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
    >
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
        Insights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
