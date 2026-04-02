import React, { useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { EXPENSE_CATEGORIES } from "../../data/categories";
import { AlertCircle, Target, Plus, Check } from "lucide-react";
import Modal from "../ui/Modal";

export default function BudgetSection() {
  const getBudgetProgress = useFinanceStore((s) => s.getBudgetProgress);
  const setBudget = useFinanceStore((s) => s.setBudget);
  const budgets = useFinanceStore((s) => s.budgets);
  const progressList = getBudgetProgress();

  const [open, setOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCat && amount) {
      setBudget(selectedCat, Number(amount));
      setOpen(false);
      setAmount("");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" /> Category Budgets
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your monthly spending limits.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-secondary text-sm py-1.5 h-auto flex-shrink-0">
          <Plus className="w-4 h-4 mr-1" /> Add / Edit
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {progressList.length === 0 ? (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No budgets set for this month.
          </div>
        ) : (
          progressList.map((p) => {
            const isWarning = p.percentage >= 80 && p.percentage < 100;
            const isDanger = p.percentage >= 100;

            return (
              <div key={p.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    {p.category}
                    {isDanger && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    <span className={isDanger ? "text-red-500 font-semibold" : "text-slate-900 dark:text-white font-semibold"}>
                      ₹{p.spent.toLocaleString("en-IN")}
                    </span>{" "}
                    / ₹{p.budget.toLocaleString("en-IN")}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDanger ? "bg-red-500" : isWarning ? "bg-amber-400" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, p.percentage))}%` }}
                  />
                </div>
                {p.percentage > 0 && (
                   <p className="text-xs text-slate-500 text-right">
                     {p.remaining > 0 ? `₹${p.remaining.toLocaleString("en-IN")} left` : "Limit reached!"}
                   </p>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Set Category Budget">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="input-base"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Budget (₹)</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="input-base"
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Budget</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
