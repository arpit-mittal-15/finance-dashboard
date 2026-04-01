import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import type { Transaction } from "../../types";
import FiltersBar from "./FiltersBar";
import TransactionsTable from "./TransactionsTable";
import TransactionModal from "./TransactionModal";
import Pagination from "./Pagination";

export default function TransactionsSection() {
  const role = useFinanceStore((s) => s.role);
  const currentPage = useFinanceStore((s) => s.currentPage);
  const pageSize = useFinanceStore((s) => s.pageSize);
  const setCurrentPage = useFinanceStore((s) => s.setCurrentPage);

  // Subscribe to filter-relevant state so the component re-renders
  const transactions = useFinanceStore((s) => s.transactions);
  const filters = useFinanceStore((s) => s.filters);
  const searchQuery = useFinanceStore((s) => s.searchQuery);
  const sortBy = useFinanceStore((s) => s.sortBy);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  // Compute filtered transactions with proper reactivity
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (filters.type !== "all") {
      list = list.filter((t) => t.type === filters.type);
    }
    if (filters.category !== "all") {
      list = list.filter((t) => t.category === filters.category);
    }
    if (filters.dateStart) {
      list = list.filter((t) => t.date >= filters.dateStart);
    }
    if (filters.dateEnd) {
      list = list.filter((t) => t.date <= filters.dateEnd);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          t.amount.toString().includes(q) ||
          t.date.includes(q),
      );
    }

    list.sort((a, b) => {
      const dir = sortBy.direction === "asc" ? 1 : -1;
      if (sortBy.field === "date") {
        return a.date.localeCompare(b.date) * dir;
      }
      return (a.amount - b.amount) * dir;
    });

    return list;
  }, [transactions, filters, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setEditing(tx);
    setModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Transactions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        {role === "admin" && (
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        )}
      </div>

      <FiltersBar />

      <div className="mt-4">
        <TransactionsTable rows={paginatedRows} onEdit={openEdit} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
      />
    </motion.div>
  );
}
