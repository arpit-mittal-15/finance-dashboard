import React, { useEffect, useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import type { Transaction, TransactionType } from "../../types";
import Modal from "../ui/Modal";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../data/categories";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  editing: Transaction | null;
}

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  amount: "",
  category: "",
  type: "expense" as TransactionType,
  description: "",
};

export default function TransactionModal({
  open,
  onClose,
  editing,
}: TransactionModalProps) {
  const accounts = useFinanceStore((s) => s.accounts);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const editTransaction = useFinanceStore((s) => s.editTransaction);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    accountId: accounts[0]?.id || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editing) {
      setForm({
        date: editing.date,
        amount: String(editing.amount),
        category: editing.category,
        type: editing.type,
        description: editing.description,
        accountId: editing.accountId,
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        accountId: accounts[0]?.id || "",
      });
    }
    setErrors({});
  }, [editing, open, accounts]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.date) errs.date = "Date is required";
    if (!form.amount || Number(form.amount) <= 0)
      errs.amount = "Amount must be greater than 0";
    if (!form.category) errs.category = "Category is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.accountId) errs.accountId = "Account is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      date: form.date,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      description: form.description.trim(),
      accountId: form.accountId,
    };

    if (editing) {
      editTransaction(editing.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Transaction" : "Add Transaction"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Type
          </label>
          <div className="flex gap-2">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t, category: "" }))}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  form.type === t
                    ? t === "income"
                      ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30"
                      : "bg-red-50 text-red-700 border-2 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {t === "income" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        </div>

        {/* Account Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Account
          </label>
          <select
            value={form.accountId}
            onChange={(e) =>
              setForm((f) => ({ ...f, accountId: e.target.value }))
            }
            className={`input-base ${errors.accountId ? "!border-red-400 !ring-red-400/20" : ""}`}
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.type.toUpperCase()})
              </option>
            ))}
          </select>
          {errors.accountId && (
            <p className="text-xs text-red-500">{errors.accountId}</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Amount (₹)
          </label>
          <input
            type="number"
            min="1"
            placeholder="Enter amount"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className={`input-base ${errors.amount ? "!border-red-400 !ring-red-400/20" : ""}`}
          />
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className={`input-base ${errors.category ? "!border-red-400 !ring-red-400/20" : ""}`}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className={`input-base ${errors.date ? "!border-red-400 !ring-red-400/20" : ""}`}
          />
          {errors.date && (
            <p className="text-xs text-red-500">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <input
            type="text"
            placeholder="What was this for?"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className={`input-base ${errors.description ? "!border-red-400 !ring-red-400/20" : ""}`}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {editing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
