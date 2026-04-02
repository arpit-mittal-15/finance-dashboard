import React from "react";
import TransactionsSection from "../components/transactions/TransactionsSection";

export default function Transactions() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Transactions</h2>
      <TransactionsSection />
    </div>
  );
}
