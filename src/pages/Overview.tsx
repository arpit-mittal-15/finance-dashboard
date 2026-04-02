import React from "react";
import { motion } from "framer-motion";
import SummaryCards from "../components/dashboard/SummaryCards";
import ConversationalInsights from "../components/insights/ConversationalInsights";
import BalanceChart from "../components/dashboard/BalanceChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

export default function Overview() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Overview</h2>
        <ConversationalInsights />
      </div>

      <section>
        <SummaryCards />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceChart />
        </div>
        <div>
          <CategoryChart />
        </div>
      </section>

      <section>
        <RecentTransactions />
      </section>
    </motion.div>
  );
}
