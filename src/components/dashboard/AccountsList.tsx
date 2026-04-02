import React, { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import AccountCard from "./AccountCard";
import AddAccountModal from "./AddAccountModal";
import Tooltip from "../ui/Tooltip";
import { formatCurrency } from "../../utils/helpers";

export default function AccountsList() {
  const accounts = useFinanceStore((s) => s.accounts);
  const selectedAccountId = useFinanceStore((s) => s.selectedAccountId);
  const setSelectedAccountId = useFinanceStore((s) => s.setSelectedAccountId);
  const accountBalances = useFinanceStore((s) => s.getAccountBalances());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalBalance = Object.values(accountBalances).reduce((sum, b) => sum + b, 0);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
            Your Accounts
          </h3>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-secondary px-3 py-1.5 gap-1.5 text-xs font-bold uppercase transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      <div className="relative overflow-visible">
        <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 scroll-smooth">
          <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          
          {/* All Accounts Toggle Card */}
          <button
            onClick={() => setSelectedAccountId("all")}
            className={`relative flex-shrink-0 w-full sm:w-[260px] p-6 rounded-2xl border transition-all duration-300 text-left group overflow-hidden ${
              selectedAccountId === "all"
                ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
                selectedAccountId === "all" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
              }`}>
                View All
              </span>
            </div>
            
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">
                Total Combined Balance
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(totalBalance)}
              </h3>
            </div>
          </button>

          {/* Individual Account Cards */}
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={{
                ...account,
                balance: accountBalances[account.id] ?? account.balance,
              }}
              isSelected={selectedAccountId === account.id}
              onClick={() => setSelectedAccountId(account.id)}
            />
          ))}
        </div>
        
        {/* Subtle Scroll Cue */}
        <div className="absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent pointer-events-none rounded-r-3xl md:hidden" />
      </div>

      <AddAccountModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
