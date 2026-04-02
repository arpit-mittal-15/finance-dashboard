import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { Toast as ToastType } from "../../types";
import { useFinanceStore } from "../../store/useFinanceStore";

const ICON_MAP = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500" />,
  info: <Info className="w-5 h-5 text-indigo-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
};

const BORDER_MAP = {
  success: "border-emerald-500/20",
  error: "border-rose-500/20",
  info: "border-indigo-500/20",
  warning: "border-amber-500/20",
};

export default function Toast({ toast }: { toast: ToastType }) {
  const removeToast = useFinanceStore((s) => s.removeToast);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className={`flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border ${
        BORDER_MAP[toast.type]
      } rounded-xl shadow-lg shadow-slate-900/5 min-w-[280px] max-w-sm pointer-events-auto group`}
    >
      <div className="flex-shrink-0">{ICON_MAP[toast.type]}</div>
      <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-400"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
