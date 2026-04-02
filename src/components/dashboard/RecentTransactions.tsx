import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import TransactionsTable from "../transactions/TransactionsTable";
import TransactionModal from "../transactions/TransactionModal";
import { Transaction } from "../../types";

export default function RecentTransactions() {
  const transactions = useFinanceStore((s) => s.transactions);
  const filters = useFinanceStore((s) => s.filters);
  const selectedAccountId = useFinanceStore((s) => s.selectedAccountId);
  const getFilteredTransactions = useFinanceStore((s) => s.getFilteredTransactions);
  
  const recent = getFilteredTransactions().slice(0, 5);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Recent Transactions
        </h3>
        <Link 
          to="/transactions" 
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      
      <TransactionsTable rows={recent} onEdit={openEdit} />
      
      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
      />
    </div>
  );
}
