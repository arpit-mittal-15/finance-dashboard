import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useFinanceStore } from "../../store/useFinanceStore";
import { getCategoryColor } from "../../data/categories";
import { formatCurrency } from "../../utils/helpers";
import { PieChart as PieChartIcon } from "lucide-react";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 px-3 py-2">
      <div className="flex items-center gap-1.5 mb-0.5">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: data.payload.color }}
        />
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {data.name}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Budget: {formatCurrency(data.value)}
      </p>
    </div>
  );
}

export default function BudgetDistribution() {
  const budgets = useFinanceStore((s) => s.budgets);

  const data = Object.entries(budgets)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: getCategoryColor(name),
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="w-5 h-5 text-indigo-500" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Budget Distribution
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          Set budgets to see distribution.
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  stroke="none"
                  paddingAngle={2}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {data.map((item) => {
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-400 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white ml-2">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
