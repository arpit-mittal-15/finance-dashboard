import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { useAnimatedCounter } from "../../hooks/useAnimatedCounter";
import { formatCurrency, percentageChange } from "../../utils/helpers";

function SummaryCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  valueColor,
  change,
  delay,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  change: number;
  delay: number;
}) {
  const animatedValue = useAnimatedCounter(value, 800);
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className={`text-2xl font-semibold ${valueColor}`}>
            {formatCurrency(animatedValue)}
          </p>
          <div
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            {Math.abs(change)}% vs last month
          </div>
        </div>
        <div className={`p-2.5 rounded-lg ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}

export default function SummaryCards() {
  const totals = useFinanceStore((s) => s.getTotals());
  const comparison = useFinanceStore((s) => s.getMonthlyComparison());

  const incomeChange = percentageChange(comparison.currentIncome, comparison.previousIncome);
  const expenseChange = percentageChange(comparison.currentExpense, comparison.previousExpense);
  const balanceChange = percentageChange(
    comparison.currentIncome - comparison.currentExpense,
    comparison.previousIncome - comparison.previousExpense,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryCard title="Total Balance" value={totals.balance} icon={Wallet}
        iconBg="bg-blue-50 dark:bg-blue-500/10" iconColor="text-blue-600 dark:text-blue-400"
        valueColor="text-slate-900 dark:text-white" change={balanceChange} delay={0} />
      <SummaryCard title="Total Income" value={totals.income} icon={TrendingUp}
        iconBg="bg-emerald-50 dark:bg-emerald-500/10" iconColor="text-emerald-600 dark:text-emerald-400"
        valueColor="text-emerald-600 dark:text-emerald-400" change={incomeChange} delay={0.05} />
      <SummaryCard title="Total Expenses" value={totals.expense} icon={TrendingDown}
        iconBg="bg-red-50 dark:bg-red-500/10" iconColor="text-red-500 dark:text-red-400"
        valueColor="text-red-500 dark:text-red-400" change={expenseChange} delay={0.1} />
    </div>
  );
}
