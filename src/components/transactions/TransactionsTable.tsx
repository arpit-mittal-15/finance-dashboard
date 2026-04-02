import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "../../types";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatCurrency, formatDate } from "../../utils/helpers";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";
import Tooltip from "../ui/Tooltip";

interface TransactionsTableProps {
  rows: Transaction[];
  onEdit: (t: Transaction) => void;
}

export default function TransactionsTable({
  rows,
  onEdit,
}: TransactionsTableProps) {
  const role = useFinanceStore((s) => s.role);
  const accounts = useFinanceStore((s) => s.accounts);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  if (rows.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/80 dark:bg-slate-800/50">
            <th className="table-header">Date</th>
            <th className="table-header">Description</th>
            <th className="table-header">Category</th>
            <th className="table-header">Account</th>
            <th className="table-header">Type</th>
            <th className="table-header text-right">Amount</th>
            {role === "admin" && (
              <th className="table-header text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((tx, i) => {
            const account = accounts.find((a) => a.id === tx.accountId);
            return (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="table-cell whitespace-nowrap text-slate-600 dark:text-slate-400">
                  {formatDate(tx.date)}
                </td>
                <td className="table-cell">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {tx.description}
                  </span>
                </td>
                <td className="table-cell">
                  <Badge variant="category" category={tx.category}>
                    {tx.category}
                  </Badge>
                </td>
                <td className="table-cell">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                    {account?.name || "Unknown"}
                  </span>
                </td>
                <td className="table-cell">
                  <Badge variant={tx.type}>
                    {tx.type === "income" ? "Income" : "Expense"}
                  </Badge>
                </td>
                <td className="table-cell text-right whitespace-nowrap">
                  <span
                    className={`font-semibold ${
                      tx.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </td>
                {role === "admin" && (
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Tooltip content="Edit Transaction">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete Transaction">
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                )}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
