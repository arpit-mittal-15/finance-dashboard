import React, { useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import Modal from "../ui/Modal";
import { AccountType } from "../../types";

interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const COLORS = [
  "#4f46e5", // Indigo
  "#10b981", // Emerald
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
];

export default function AddAccountModal({ open, onClose }: AddAccountModalProps) {
  const addAccount = useFinanceStore((s) => s.addAccount);
  const [form, setForm] = useState({
    name: "",
    type: "bank" as AccountType,
    balance: "",
    color: COLORS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (form.balance === "" || isNaN(Number(form.balance)))
      errs.balance = "Valid initial balance is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addAccount({
      name: form.name.trim(),
      type: form.type,
      balance: Number(form.balance),
      color: form.color,
    });
    setForm({ name: "", type: "bank", balance: "", color: COLORS[0] });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Account Name
          </label>
          <input
            type="text"
            placeholder="e.g. HDFC Bank, Personal Wallet"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`input-base ${errors.name ? "!border-red-400 !ring-red-400/20" : ""}`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Account Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["bank", "wallet", "upi"] as AccountType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  form.type === t
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500 dark:text-indigo-400"
                    : "bg-slate-100 border-transparent text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Initial Balance */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Initial Balance (₹)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={form.balance}
            onChange={(e) => setForm({ ...form, balance: e.target.value })}
            className={`input-base ${errors.balance ? "!border-red-400 !ring-red-400/20" : ""}`}
          />
          {errors.balance && (
            <p className="text-xs text-red-500">{errors.balance}</p>
          )}
        </div>

        {/* Color Palette */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Account Color Theme
          </label>
          <div className="flex gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, color: c })}
                className={`w-8 h-8 rounded-full border-4 transition-all ${
                  form.color === c ? "border-slate-200 dark:border-slate-700 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary font-bold uppercase text-xs">
            Cancel
          </button>
          <button type="submit" className="btn-primary font-bold uppercase text-xs">
            Create Account
          </button>
        </div>
      </form>
    </Modal>
  );
}
