import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Transaction, Filters, SortConfig, Role, Insight, BudgetProgress, TrendDataPoint, ForecastPoint, Toast, ToastType, Account } from "../types";
import { INITIAL_TRANSACTIONS } from "../data/transactions";
import { getCategoryColor } from "../data/categories";
import { percentageChange, getMonth } from "../utils/helpers";

// ── State shape ──────────────────────────────────────────────
interface FinanceState {
  // Core data
  transactions: Transaction[];
  accounts: Account[];
  role: Role;
  darkMode: boolean;
  budgets: Record<string, number>;

  // UI state
  filters: Filters;
  selectedAccountId: string | "all";
  searchQuery: string;
  sortBy: SortConfig;
  currentPage: number;
  pageSize: number;
  sidebarOpen: boolean;
  toasts: Toast[];

  // Actions
  setRole: (role: Role) => void;
  setBudget: (category: string, amount: number) => void;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (f: Partial<Filters>) => void;
  setSelectedAccountId: (id: string | "all") => void;
  resetFilters: () => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (s: SortConfig) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  addToast: (message: string, type?: Toast["type"], duration?: number) => void;
  removeToast: (id: string) => void;

  // Derived selectors
  getTotals: () => { income: number; expense: number; balance: number };
  getAccountBalances: () => Record<string, number>;
  getFilteredTransactions: () => Transaction[];
  getCategoryBreakdown: () => { name: string; value: number; color: string }[];
  getBalanceOverTime: () => {
    date: string;
    balance: number;
    income: number;
    expense: number;
  }[];
  getMonthlyComparison: () => {
    currentIncome: number;
    previousIncome: number;
    currentExpense: number;
    previousExpense: number;
  };
  getSmartInsights: () => Insight[];
  getConversationalInsights: () => { text: string; type: "spending" | "savings" | "budget" | "info" }[];
  getBudgetProgress: () => BudgetProgress[];
  getCategoryTrends: () => TrendDataPoint[];
  getForecast: () => ForecastPoint[];
  getAllCategories: () => string[];
  addAccount: (account: Omit<Account, "id">) => void;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
}

// ── Default filters ──────────────────────────────────────────
const DEFAULT_FILTERS: Filters = {
  type: "all",
  category: "all",
  dateStart: "",
  dateEnd: "",
};

const DEFAULT_ACCOUNTS: Account[] = [
  { id: "bank-1", name: "Main Bank Account", type: "bank", balance: 25000, color: "#4f46e5" },
  { id: "wallet-1", name: "Personal Wallet", type: "wallet", balance: 5000, color: "#ec4899" },
  { id: "upi-1", name: "UPI Pay", type: "upi", balance: 1000, color: "#10b981" },
];

// ── Store ────────────────────────────────────────────────────
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────
      transactions: INITIAL_TRANSACTIONS,
      accounts: DEFAULT_ACCOUNTS,
      selectedAccountId: "all",
      role: "viewer",
      darkMode: false,
      budgets: {},
      filters: { ...DEFAULT_FILTERS },
      searchQuery: "",
      sortBy: { field: "date", direction: "desc" },
      currentPage: 1,
      pageSize: 8,
      sidebarOpen: false,
      toasts: [],

      // ── Actions ──────────────────────────────────────────
      setRole: (role) => set({ role }),
      setBudget: (category, amount) => {
        set((s) => ({ budgets: { ...s.budgets, [category]: amount } }));
        get().addToast(`Budget updated for ${category}`, "success");
      },

      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          if (next) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { darkMode: next };
        }),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      addTransaction: (t) => {
        const tx: Transaction = { ...t, id: nanoid() };
        set((s) => {
          const updatedAccounts = s.accounts.map((acc) => {
            if (acc.id === t.accountId) {
              const diff = t.type === "income" ? t.amount : -t.amount;
              return { ...acc, balance: acc.balance + diff };
            }
            return acc;
          });

          return {
            transactions: [tx, ...s.transactions],
            accounts: updatedAccounts,
            currentPage: 1,
          };
        });
        get().addToast("Transaction added successfully", "success");
      },

      editTransaction: (id, patch) => {
        set((s) => {
          const oldTx = s.transactions.find((t) => t.id === id);
          if (!oldTx) return s;

          let updatedAccounts = [...s.accounts];

          // Revert old transaction's impact
          updatedAccounts = updatedAccounts.map((acc) => {
            if (acc.id === oldTx.accountId) {
              const diff = oldTx.type === "income" ? -oldTx.amount : oldTx.amount;
              return { ...acc, balance: acc.balance + diff };
            }
            return acc;
          });

          // Apply new transaction's impact
          const newTx = { ...oldTx, ...patch };
          updatedAccounts = updatedAccounts.map((acc) => {
            if (acc.id === newTx.accountId) {
              const diff = newTx.type === "income" ? newTx.amount : -newTx.amount;
              return { ...acc, balance: acc.balance + diff };
            }
            return acc;
          });

          return {
            transactions: s.transactions.map((t) => (t.id === id ? newTx : t)),
            accounts: updatedAccounts,
          };
        });
        get().addToast("Transaction updated", "success");
      },

      deleteTransaction: (id) => {
        set((s) => {
          const oldTx = s.transactions.find((t) => t.id === id);
          if (!oldTx) return s;

          const updatedAccounts = s.accounts.map((acc) => {
            if (acc.id === oldTx.accountId) {
              const diff = oldTx.type === "income" ? -oldTx.amount : oldTx.amount;
              return { ...acc, balance: acc.balance + diff };
            }
            return acc;
          });

          return {
            transactions: s.transactions.filter((t) => t.id !== id),
            accounts: updatedAccounts,
          };
        });
        get().addToast("Transaction deleted", "info");
      },

      setFilters: (f) =>
        set((s) => ({
          filters: { ...s.filters, ...f },
          currentPage: 1,
        })),

      setSelectedAccountId: (id) =>
        set({
          selectedAccountId: id,
          filters: { ...DEFAULT_FILTERS },
          searchQuery: "",
          currentPage: 1,
        }),

      resetFilters: () =>
        set({
          filters: { ...DEFAULT_FILTERS },
          selectedAccountId: "all",
          searchQuery: "",
          currentPage: 1,
        }),

      setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),

      setSortBy: (s) => set({ sortBy: s }),

      setCurrentPage: (page) => set({ currentPage: page }),

      setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

      addToast: (message, type = "info", duration = 3000) => {
        const id = nanoid();
        set((s) => {
          const newToasts = [...s.toasts, { id, message, type, duration }];
          return { toasts: newToasts.slice(-2) };
        });
        setTimeout(() => get().removeToast(id), duration);
      },

      removeToast: (id) =>
        set((s) => ({
          toasts: s.toasts.filter((t) => t.id !== id),
        })),

      // ── Derived selectors ────────────────────────────────
      getTotals: () => {
        const tx = get().getFilteredTransactions();
        const income = tx
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = tx
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        return { income, expense, balance: income - expense };
      },

      getAccountBalances: () => {
        const tx = get().transactions;
        const accounts = get().accounts;
        const balances: Record<string, number> = {};

        accounts.forEach((acc) => {
          const accTx = tx.filter((t) => t.accountId === acc.id);
          const income = accTx
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          const expense = accTx
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          
          const baseBalance = Number(acc.balance) || 0;
          balances[acc.id] = baseBalance + (income - expense);
        });

        return balances;
      },

      getFilteredTransactions: () => {
        const { transactions, filters, searchQuery, sortBy, selectedAccountId } = get();
        let list = [...transactions];

        // Type filter
        if (filters.type !== "all") {
          list = list.filter((t) => t.type === filters.type);
        }

        // Category filter
        if (filters.category !== "all") {
          list = list.filter((t) => t.category === filters.category);
        }

        // Date range filter
        if (filters.dateStart) {
          list = list.filter((t) => t.date >= filters.dateStart);
        }
        if (filters.dateEnd) {
          list = list.filter((t) => t.date <= filters.dateEnd);
        }

        // Account filter
        if (selectedAccountId !== "all") {
          list = list.filter((t) => t.accountId === selectedAccountId);
        }

        // Search
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

        // Sort
        list.sort((a, b) => {
          const dir = sortBy.direction === "asc" ? 1 : -1;
          if (sortBy.field === "date") {
            return a.date.localeCompare(b.date) * dir;
          }
          return (a.amount - b.amount) * dir;
        });

        return list;
      },

      getCategoryBreakdown: () => {
        const { selectedAccountId } = get();
        const tx = get().transactions.filter(
          (t) =>
            t.type === "expense" &&
            (selectedAccountId === "all" || t.accountId === selectedAccountId),
        );
        const map: Record<string, number> = {};
        tx.forEach((t) => {
          map[t.category] = (map[t.category] || 0) + (Number(t.amount) || 0);
        });
        return Object.entries(map)
          .map(([name, value]) => ({
            name,
            value,
            color: getCategoryColor(name),
          }))
          .sort((a, b) => b.value - a.value);
      },

      getBalanceOverTime: () => {
        const { selectedAccountId } = get();
        const tx = get().transactions.filter(
          (t) => selectedAccountId === "all" || t.accountId === selectedAccountId,
        );
        const sorted = [...tx].sort((a, b) => a.date.localeCompare(b.date));
        const points: {
          date: string;
          balance: number;
          income: number;
          expense: number;
        }[] = [];
        let running = 0;
        const dateMap: Record<string, { income: number; expense: number }> = {};

        sorted.forEach((t) => {
          if (!dateMap[t.date]) {
            dateMap[t.date] = { income: 0, expense: 0 };
          }
          const val = Number(t.amount) || 0;
          if (t.type === "income") {
            dateMap[t.date].income += val;
          } else {
            dateMap[t.date].expense += val;
          }
        });

        Object.keys(dateMap)
          .sort()
          .forEach((date) => {
            const d = dateMap[date];
            running += d.income - d.expense;
            points.push({
              date,
              balance: running,
              income: d.income,
              expense: d.expense,
            });
          });

        return points;
      },

      getMonthlyComparison: () => {
        const { selectedAccountId } = get();
        const tx = get().transactions.filter(
          (t) => selectedAccountId === "all" || t.accountId === selectedAccountId,
        );
        const months = [...new Set(tx.map((t) => getMonth(t.date)))].sort();
        const latest = months[months.length - 1] || "";
        const prev = months[months.length - 2] || "";

        const calc = (month: string) => {
          const filtered = tx.filter((t) => getMonth(t.date) === month);
          const income = filtered
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + (Number(t.amount) || 0), 0);
          const expense = filtered
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + (Number(t.amount) || 0), 0);
          return { income, expense };
        };

        const current = calc(latest);
        const previous = calc(prev);

        return {
          currentIncome: current.income,
          previousIncome: previous.income,
          currentExpense: current.expense,
          previousExpense: previous.expense,
        };
      },

      getSmartInsights: () => {
        const state = get();
        const tx = state.transactions;
        const totals = state.getTotals();
        const comparison = state.getMonthlyComparison();
        const insights: Insight[] = [];

        // 1. Savings rate
        const savingsRate =
          totals.income > 0
            ? Math.round(
                ((totals.income - totals.expense) / totals.income) * 100,
              )
            : 0;
        insights.push({
          id: "savings-rate",
          icon: "piggy-bank",
          title: "Savings Rate",
          value: `${savingsRate}%`,
          type:
            savingsRate >= 30
              ? "positive"
              : savingsRate >= 10
                ? "neutral"
                : "negative",
        });

        // 2. Highest spending category
        const breakdown = state.getCategoryBreakdown();
        if (breakdown.length > 0) {
          const top = breakdown[0];
          insights.push({
            id: "top-category",
            icon: "trending-up",
            title: "Highest Spending",
            value: `${top.name}`,
            type: "warning",
          });
        }

        // 3. Monthly expense comparison
        const expChange = percentageChange(
          comparison.currentExpense,
          comparison.previousExpense,
        );
        insights.push({
          id: "monthly-expense",
          icon: "bar-chart",
          title: "Monthly Expenses",
          value: `${expChange >= 0 ? "+" : ""}${expChange}% vs last month`,
          change: expChange,
          type:
            expChange > 10
              ? "negative"
              : expChange < -5
                ? "positive"
                : "neutral",
        });

        // 4. Average daily expense (current month)
        const months = [...new Set(tx.map((t) => getMonth(t.date)))].sort();
        const latestMonth = months[months.length - 1] || "";
        const currentMonthExpenses = tx.filter(
          (t) => t.type === "expense" && getMonth(t.date) === latestMonth,
        );
        const totalCurrentMonthExpense = currentMonthExpenses.reduce(
          (s, t) => s + t.amount,
          0,
        );
        const daysInMonth = new Date(
          parseInt(latestMonth.slice(0, 4)),
          parseInt(latestMonth.slice(5, 7)),
          0,
        ).getDate();
        const avgDaily = Math.round(totalCurrentMonthExpense / daysInMonth);
        insights.push({
          id: "avg-daily",
          icon: "calendar",
          title: "Avg Daily Expense",
          value: `₹${avgDaily.toLocaleString("en-IN")}`,
          type: "neutral",
        });

        // 5. Category-specific insight
        if (months.length >= 2) {
          const prevMonth = months[months.length - 2];
          const currentByCategory: Record<string, number> = {};
          const prevByCategory: Record<string, number> = {};

          tx.filter(
            (t) => t.type === "expense" && getMonth(t.date) === latestMonth,
          ).forEach(
            (t) =>
              (currentByCategory[t.category] =
                (currentByCategory[t.category] || 0) + t.amount),
          );

          tx.filter(
            (t) => t.type === "expense" && getMonth(t.date) === prevMonth,
          ).forEach(
            (t) =>
              (prevByCategory[t.category] =
                (prevByCategory[t.category] || 0) + t.amount),
          );

          // Find the category with biggest increase
          let maxIncrease = 0;
          let maxCat = "";
          Object.entries(currentByCategory).forEach(([cat, amount]) => {
            const prev = prevByCategory[cat] || 0;
            if (prev > 0) {
              const change = percentageChange(amount, prev);
              if (change > maxIncrease) {
                maxIncrease = change;
                maxCat = cat;
              }
            }
          });

          if (maxCat && maxIncrease > 0) {
            insights.push({
              id: "category-increase",
              icon: "alert-triangle",
              title: `${maxCat} Spending`,
              value: `+${maxIncrease}% this month`,
              change: maxIncrease,
              type: maxIncrease > 20 ? "negative" : "warning",
            });
          }
        }

        // 6. Total transactions this month
        const txThisMonth = tx.filter(
          (t) => getMonth(t.date) === latestMonth,
        ).length;
        insights.push({
          id: "tx-count",
          icon: "receipt",
          title: "Transactions This Month",
          value: `${txThisMonth} transactions`,
          type: "neutral",
        });

        return insights;
      },

      getAllCategories: () => {
        const cats = get().transactions.map((t) => t.category);
        return [...new Set(cats)].sort();
      },

      getBudgetProgress: () => {
        const { transactions, budgets, selectedAccountId } = get();
        const latestMonth = getMonth(new Date().toISOString());

        const currentMonthExpenses = transactions.filter(
          (t) =>
            t.type === "expense" &&
            getMonth(t.date) === latestMonth &&
            (selectedAccountId === "all" || t.accountId === selectedAccountId),
        );
        
        const spentByCategory: Record<string, number> = {};
        currentMonthExpenses.forEach((t) => {
          spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
        });

        return Object.entries(budgets).map(([category, budget]) => {
          const spent = spentByCategory[category] || 0;
          return {
            category,
            budget,
            spent,
            remaining: Math.max(0, budget - spent),
            percentage: budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0,
          };
        }).sort((a, b) => b.percentage - a.percentage);
      },

      getConversationalInsights: () => {
        const { getTotals, getMonthlyComparison, transactions, getCategoryBreakdown } = get();
        const insights: { text: string; type: "spending" | "savings" | "budget" | "info" }[] = [];
        const comparison = getMonthlyComparison();
        const latestMonth = getMonth(new Date().toISOString());
        
        // Expense changes
        if (comparison.previousExpense > 0) {
          const change = percentageChange(comparison.currentExpense, comparison.previousExpense);
          if (change > 0) {
            insights.push({ 
              text: `Spending is up ${change}% this month.`,
              type: "spending" 
            });
          } else if (change < 0) {
            insights.push({ 
              text: `Great job! You spent ${Math.abs(change)}% less than last month.`,
              type: "savings" 
            });
          }
        }
        
        // Savings rate
        if (comparison.previousIncome > 0 && comparison.currentIncome > 0) {
           const prevRate = Math.round(((comparison.previousIncome - comparison.previousExpense) / comparison.previousIncome) * 100);
           const currRate = Math.round(((comparison.currentIncome - comparison.currentExpense) / comparison.currentIncome) * 100);
           
           if (currRate < prevRate) {
              insights.push({ 
                text: `Savings rate dropped from ${prevRate}% to ${currRate}%.`,
                type: "info" 
              });
           } else if (currRate > prevRate) {
              insights.push({ 
                text: `Your savings rate improved to ${currRate}%!`,
                type: "savings" 
              });
           }
        }

        // Highest expense
        const breakdowns = getCategoryBreakdown();
        if (breakdowns.length > 0) {
          insights.push({ 
            text: `Top expense: ${breakdowns[0].name} (₹${breakdowns[0].value.toLocaleString("en-IN")}).`,
            type: "spending" 
          });
        }
        
        // Budget alerts
        const { budgets, selectedAccountId } = get();
        const currentMonthExpenses = transactions.filter(
          (t) =>
            t.type === "expense" &&
            getMonth(t.date) === latestMonth &&
            (selectedAccountId === "all" || t.accountId === selectedAccountId),
        );
        const spentByCategory: Record<string, number> = {};
        currentMonthExpenses.forEach(t => spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount);
        
        Object.entries(budgets).forEach(([cat, budget]) => {
           const spent = spentByCategory[cat] || 0;
           if (budget > 0) {
              const perc = spent / budget;
              if (perc >= 1) insights.push({ 
                text: `${cat} budget exceeded by ₹${(spent - budget).toLocaleString("en-IN")}.`,
                type: "budget" 
              });
              else if (perc >= 0.8) insights.push({ 
                text: `${cat} budget is at ${Math.round(perc * 100)}%.`,
                type: "budget" 
              });
           }
        });

        return insights;
      },

      getCategoryTrends: () => {
        const { selectedAccountId } = get();
        const tx = get().transactions.filter(
          (t) =>
            t.type === "expense" &&
            (selectedAccountId === "all" || t.accountId === selectedAccountId),
        );
        const months = [...new Set(tx.map((t) => getMonth(t.date)))].sort();
        
        return months.map(month => {
            const point: TrendDataPoint = { date: month };
            const monthTx = tx.filter(t => getMonth(t.date) === month);
            monthTx.forEach(t => {
               point[t.category] = ((point[t.category] as number) || 0) + t.amount;
            });
            return point;
        });
      },

      getForecast: () => {
        // Simple moving average forecast
        const { selectedAccountId } = get();
        const tx = get().transactions.filter(
          (t) =>
            t.type === "expense" &&
            (selectedAccountId === "all" || t.accountId === selectedAccountId),
        );
        const months = [...new Set(tx.map((t) => getMonth(t.date)))].sort();
        
        const data: ForecastPoint[] = months.map(m => {
           const actual = tx.filter(t => getMonth(t.date) === m).reduce((sum, t) => sum + t.amount, 0);
           return { month: m, actual };
        });
        
        if (data.length >= 3) {
            // Predict next month based on last 3
            const last3 = data.slice(-3);
            const avg = last3.reduce((sum, d) => sum + (d.actual || 0), 0) / 3;
            
            // Create next month string
            const lastMonthStr = data[data.length - 1].month;
            const [y, m] = lastMonthStr.split('-');
            const nextD = new Date(parseInt(y), parseInt(m), 1);
            const nextMonthStr = getMonth(nextD.toISOString());
            
            data.push({ month: nextMonthStr, forecast: Math.round(avg) });
            // Add trailing forecast points to last actual for visual connection
            data[data.length - 2].forecast = data[data.length - 2].actual;
        }
        
        return data;
      },

      addAccount: (account) => {
        const id = nanoid();
        set((s) => ({
          accounts: [...s.accounts, { ...account, id }],
        }));
        get().addToast(`Account "${account.name}" added`, "success");
      },

      updateAccount: (id, patch) => {
        set((s) => ({
          accounts: s.accounts.map((acc) =>
            acc.id === id ? { ...acc, ...patch } : acc,
          ),
        }));
        get().addToast("Account updated", "success");
      },

      deleteAccount: (id) => {
        const accounts = get().accounts;
        if (accounts.length <= 1) {
          get().addToast("Cannot delete the only account", "error");
          return;
        }
        set((s) => ({
          accounts: s.accounts.filter((acc) => acc.id !== id),
          transactions: s.transactions.filter((t) => t.accountId !== id),
        }));
        get().addToast("Account deleted", "info");
      },
    }),
    {
      name: "financeflow-store",
      partialize: (state) => ({
        transactions: state.transactions,
        accounts: state.accounts,
        selectedAccountId: state.selectedAccountId,
        role: state.role,
        darkMode: state.darkMode,
        budgets: state.budgets,
        pageSize: state.pageSize,
      }),
    },
  ),
);
