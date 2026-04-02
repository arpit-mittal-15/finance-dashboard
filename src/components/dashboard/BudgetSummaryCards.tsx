import React from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { Target, TrendingDown, Wallet, Sparkles } from "lucide-react";
import { formatCurrency, getMonth } from "../../utils/helpers";

export default function BudgetSummaryCards() {
  const getBudgetProgress = useFinanceStore((s) => s.getBudgetProgress);
  const budgets = useFinanceStore((s) => s.budgets);
  const setBudget = useFinanceStore((s) => s.setBudget);
  const transactions = useFinanceStore((s) => s.transactions);
  const progressList = getBudgetProgress();

  const totalBudget = progressList.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = progressList.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const handleAutoSuggest = () => {
    // Basic logic: auto suggest based on average of past 3 months
    const expenses = transactions.filter(t => t.type === "expense");
    const months = [...new Set(expenses.map(t => getMonth(t.date)))].sort().slice(-3);
    
    if (months.length === 0) return;
    
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(t => {
      if (months.includes(getMonth(t.date))) {
         categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    Object.entries(categoryTotals).forEach(([cat, total]) => {
      const avg = Math.round(total / months.length);
      // Round to nearest 500
      const suggested = Math.ceil(avg / 500) * 500;
      setBudget(cat, suggested);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="glass-card p-5 border-l-4 border-indigo-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Budget</p>
        </div>
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalBudget)}</h4>
      </div>

      <div className="glass-card p-5 border-l-4 border-rose-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Budget Spent</p>
        </div>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalSpent)}</h4>
          {totalBudget > 0 && <span className={`text-xs font-semibold ${percentage >= 100 ? 'text-red-500' : 'text-slate-400'}`}>({Math.round(percentage)}%)</span>}
        </div>
      </div>

      <div className="glass-card p-5 border-l-4 border-emerald-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Remaining Base</p>
        </div>
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalRemaining)}</h4>
      </div>

      {/* Auto Suggest Box */}
      <div className="glass-card p-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-16 h-16" />
        </div>
        <h4 className="text-sm font-semibold mb-2 relative z-10">Smart Budget</h4>
        <p className="text-xs text-indigo-100 mb-3 relative z-10 leading-relaxed">
          Auto-calculate ideal budgets based on your past spending history.
        </p>
        <button onClick={handleAutoSuggest} className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors w-max relative z-10 backdrop-blur-sm">
          Auto-Suggest Budgets
        </button>
      </div>
    </div>
  );
}
