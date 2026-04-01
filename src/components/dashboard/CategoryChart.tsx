import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { useFinanceStore } from "../../store/useFinanceStore";
import { getCategoryColor } from "../../data/categories";
import { formatCurrency } from "../../utils/helpers";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
      <div className="flex items-center gap-1.5 mb-0.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: data.payload.color }} />
        <span className="text-sm font-medium text-slate-900 dark:text-white">{data.name}</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{formatCurrency(data.value)}</p>
    </div>
  );
}

function ActiveShape(props: any) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector cx={cx} cy={cy} innerRadius={innerRadius - 2} outerRadius={outerRadius + 4}
      startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.9} />
  );
}

export default function CategoryChart({ dateFrom = "" }: { dateFrom?: string }) {
  const transactions = useFinanceStore((s) => s.transactions);
  const [activeIndex, setActiveIndex] = useState(-1);

  const data = useMemo(() => {
    let expenses = transactions.filter((t) => t.type === "expense");
    if (dateFrom) expenses = expenses.filter((t) => t.date >= dateFrom);
    const map: Record<string, number> = {};
    expenses.forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: getCategoryColor(name) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, dateFrom]);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }} className="glass-card p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
        Spending by Category
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
              innerRadius={55} outerRadius={80} paddingAngle={2}
              onMouseEnter={(_, i) => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(-1)}
              activeIndex={activeIndex} activeShape={ActiveShape}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent"
                  opacity={activeIndex === -1 || activeIndex === i ? 1 : 0.4} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1.5 max-h-[160px] overflow-y-auto">
        {data.map((item, i) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center justify-between text-sm"
              onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(-1)}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-white ml-2">{pct}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
