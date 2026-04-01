import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Transaction, Filters, SortConfig, Role, Insight } from "../types";
import { INITIAL_TRANSACTIONS } from "../data/transactions";
import { getCategoryColor } from "../data/categories";
import { percentageChange, getMonth } from "../utils/helpers";

// ── State shape ──────────────────────────────────────────────
interface FinanceState {
  // Core data
  transactions: Transaction[];
  role: Role;
  darkMode: boolean;

  // UI state
  filters: Filters;
  searchQuery: string;
  sortBy: SortConfig;
  currentPage: number;
  pageSize: number;
  sidebarOpen: boolean;

  // Actions
  setRole: (role: Role) => void;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (s: SortConfig) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Derived selectors
  getTotals: () => { income: number; expense: number; balance: number };
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
  getAllCategories: () => string[];
}

// ── Default filters ──────────────────────────────────────────
const DEFAULT_FILTERS: Filters = {
  type: "all",
  category: "all",
  dateStart: "",
  dateEnd: "",
};

// ── Store ────────────────────────────────────────────────────
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────
      transactions: INITIAL_TRANSACTIONS,
      role: "viewer",
      darkMode: false,
      filters: { ...DEFAULT_FILTERS },
      searchQuery: "",
      sortBy: { field: "date", direction: "desc" },
      currentPage: 1,
      pageSize: 8,
      sidebarOpen: false,

      // ── Actions ──────────────────────────────────────────
      setRole: (role) => set({ role }),

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
        set((s) => ({
          transactions: [tx, ...s.transactions],
          currentPage: 1,
        }));
      },

      editTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      setFilters: (f) =>
        set((s) => ({
          filters: { ...s.filters, ...f },
          currentPage: 1,
        })),

      resetFilters: () =>
        set({
          filters: { ...DEFAULT_FILTERS },
          searchQuery: "",
          currentPage: 1,
        }),

      setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),

      setSortBy: (s) => set({ sortBy: s }),

      setCurrentPage: (page) => set({ currentPage: page }),

      setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

      // ── Derived selectors ────────────────────────────────
      getTotals: () => {
        const tx = get().transactions;
        const income = tx
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = tx
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        return { income, expense, balance: income - expense };
      },

      getFilteredTransactions: () => {
        const { transactions, filters, searchQuery, sortBy } = get();
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
        const tx = get().transactions.filter((t) => t.type === "expense");
        const map: Record<string, number> = {};
        tx.forEach((t) => {
          map[t.category] = (map[t.category] || 0) + t.amount;
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
        const sorted = [...get().transactions].sort((a, b) =>
          a.date.localeCompare(b.date),
        );
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
          if (t.type === "income") {
            dateMap[t.date].income += t.amount;
          } else {
            dateMap[t.date].expense += t.amount;
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
        const tx = get().transactions;
        const months = [...new Set(tx.map((t) => getMonth(t.date)))].sort();
        const latest = months[months.length - 1] || "";
        const prev = months[months.length - 2] || "";

        const calc = (month: string) => {
          const filtered = tx.filter((t) => getMonth(t.date) === month);
          const income = filtered
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + t.amount, 0);
          const expense = filtered
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + t.amount, 0);
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
    }),
    {
      name: "financeflow-store",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
        pageSize: state.pageSize,
      }),
    },
  ),
);
