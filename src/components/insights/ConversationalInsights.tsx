import React from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { Sparkles } from "lucide-react";

export default function ConversationalInsights() {
  const getConversationalInsights = useFinanceStore(s => s.getConversationalInsights);
  const insights = getConversationalInsights();

  if (insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 p-5 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          AI Analysis
        </h3>
      </div>
      
      <ul className="space-y-3">
        {insights.map((text, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
