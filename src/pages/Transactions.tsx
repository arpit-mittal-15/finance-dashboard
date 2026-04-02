import React from "react";
import { motion } from "framer-motion";
import TransactionsSection from "../components/transactions/TransactionsSection";

export default function Transactions() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Transactions</h2>
      <TransactionsSection />
    </motion.div>
  );
}
