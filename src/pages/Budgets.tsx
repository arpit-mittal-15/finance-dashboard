import React from "react";
import { motion } from "framer-motion";
import BudgetSection from "../components/dashboard/BudgetSection";
import BudgetSummaryCards from "../components/dashboard/BudgetSummaryCards";
import BudgetDistribution from "../components/dashboard/BudgetDistribution";

export default function Budgets() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
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
    </motion.div>
  );
}
