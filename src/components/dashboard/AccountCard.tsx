import React from "react";
import { Landmark, Wallet, CreditCard } from "lucide-react";
import { formatCurrency } from "../../utils/helpers";
import { Account } from "../../types";

const ICON_MAP = {
  bank: Landmark,
  wallet: Wallet,
  upi: CreditCard,
};

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onClick: () => void;
}

export default function AccountCard({ account, isSelected, onClick }: AccountCardProps) {
  const Icon = ICON_MAP[account.type] || Wallet;

  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 w-full sm:w-[260px] p-6 rounded-2xl border transition-all duration-300 text-left group overflow-hidden ${
        isSelected
          ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
      }`}
    >
      {/* Selection Glow */}
      {isSelected && (
        <div 
          className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl"
          style={{ backgroundColor: account.color }}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${account.color}15`, color: account.color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
          isSelected ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
        }`}>
          {account.type}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">
          {account.name}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {formatCurrency(account.balance)}
        </h3>
      </div>

      {isSelected && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: account.color }}
        />
      )}
    </button>
  );
}
