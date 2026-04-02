import React from "react";
import BudgetSection from "../components/dashboard/BudgetSection";
import BudgetSummaryCards from "../components/dashboard/BudgetSummaryCards";
import BudgetDistribution from "../components/dashboard/BudgetDistribution";

export default function Budgets() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Budgets & Planning</h2>
      
      <BudgetSummaryCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <BudgetSection />
        </div>
        <div className="xl:col-span-1">
          <BudgetDistribution />
        </div>
      </div>
    </div>
  );
}
