import React from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { Sparkles, TrendingUp, TrendingDown, Wallet, Target, Info as InfoIcon } from "lucide-react";
import { motion } from "framer-motion";

const ICON_MAP = {
  spending: { icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  savings: { icon: TrendingDown, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  budget: { icon: Target, color: "text-amber-500", bg: "bg-amber-500/10" },
  info: { icon: InfoIcon, color: "text-indigo-500", bg: "bg-indigo-500/10" },
};

export default function ConversationalInsights() {
  const insights = useFinanceStore(s => s.getConversationalInsights());

  if (insights.length === 0) return null;

  return (
    <div className="relative mb-8 pt-2">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
        <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          Smart Analysis
        </h3>
      </div>

      {/* Horizontal scroll for all screen sizes */}
      <div className="relative overflow-visible">
        <div className="flex overflow-x-auto pb-6 gap-5 no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-smooth">
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          {insights.map((insight, idx) => {
            const { icon: Icon, color, bg } = ICON_MAP[insight.type];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="flex-shrink-0 w-[280px] p-5 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all group flex flex-col justify-start"
              >
                <div className={`p-2.5 w-fit rounded-xl mb-4 ${bg} ${color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                  {insight.text}
                </p>
              </motion.div>
            );
          })}
        </div>
        
        {/* Subtle Fade-to-White/Slate at the edges for scroll cue */}
        <div className="absolute top-0 right-0 bottom-6 w-20 bg-gradient-to-l from-slate-50/50 dark:from-slate-900/50 to-transparent pointer-events-none rounded-r-3xl" />
      </div>

      {/* Decorative background glows */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[60px] pointer-events-none" />
    </div>
  );
}
