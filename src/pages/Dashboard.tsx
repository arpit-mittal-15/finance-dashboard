import React, { useMemo, useState } from "react";
import { useFinanceStore } from "../store/useFinanceStore";
import SummaryCards from "../components/dashboard/SummaryCards";
import BalanceChart from "../components/dashboard/BalanceChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import TransactionsSection from "../components/transactions/TransactionsSection";
import InsightsPanel from "../components/insights/InsightsPanel";

type TimeRange = "1M" | "3M" | "6M" | "ALL";

const RANGES: { key: TimeRange; label: string }[] = [
  { key: "1M", label: "1M" },
  { key: "3M", label: "3M" },
  { key: "6M", label: "6M" },
  { key: "ALL", label: "All" },
];

export default function Dashboard() {
  const [chartRange, setChartRange] = useState<TimeRange>("ALL");
  const transactions = useFinanceStore((s) => s.transactions);

  // Compute dateFrom based on latest transaction date
  const dateFrom = useMemo(() => {
    if (chartRange === "ALL") return "";
    const dates = transactions.map((t) => t.date).sort();
    const latest = dates[dates.length - 1] || new Date().toISOString().slice(0, 10);
    const d = new Date(latest + "T00:00:00");
    const months: Record<string, number> = { "1M": 1, "3M": 3, "6M": 6 };
    d.setMonth(d.getMonth() - months[chartRange]);
    return d.toISOString().slice(0, 10);
  }, [chartRange, transactions]);

  return (
    <div className="space-y-6">
      <section id="section-overview">
        <SummaryCards />
      </section>

      <section id="section-analytics">
        {/* Section header with time range filter */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Analytics
          </h3>
          <div className="flex gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setChartRange(r.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  chartRange === r.key
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <BalanceChart dateFrom={dateFrom} />
          </div>
          <div>
            <CategoryChart dateFrom={dateFrom} />
          </div>
        </div>
      </section>

      <section id="section-transactions">
        <TransactionsSection />
      </section>

      <section id="section-insights">
        <InsightsPanel />
      </section>
    </div>
  );
}
