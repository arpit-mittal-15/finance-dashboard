import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Transaction, Filters, SortConfig, Role, Insight, BudgetProgress, TrendDataPoint, ForecastPoint } from "../types";
import { INITIAL_TRANSACTIONS } from "../data/transactions";
import { getCategoryColor } from "../data/categories";
import { percentageChange, getMonth } from "../utils/helpers";

// ── State shape ──────────────────────────────────────────────
interface FinanceState {
  // Core data
  transactions: Transaction[];
  role: Role;
  darkMode: boolean;
  budgets: Record<string, number>;

  // UI state
  filters: Filters;
  searchQuery: string;
  sortBy: SortConfig;
  currentPage: number;
  pageSize: number;
  sidebarOpen: boolean;

  // Actions
  setRole: (role: Role) => void;
  setBudget: (category: string, amount: number) => void;
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
  getConversationalInsights: () => string[];
  getBudgetProgress: () => BudgetProgress[];
  getCategoryTrends: () => TrendDataPoint[];
  getForecast: () => ForecastPoint[];
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
      budgets: {},
      filters: { ...DEFAULT_FILTERS },
      searchQuery: "",
      sortBy: { field: "date", direction: "desc" },
      currentPage: 1,
      pageSize: 8,
      sidebarOpen: false,

      // ── Actions ──────────────────────────────────────────
      setRole: (role) => set({ role }),
      setBudget: (category, amount) =>
        set((s) => ({ budgets: { ...s.budgets, [category]: amount } })),

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

      getBudgetProgress: () => {
        const { transactions, budgets } = get();
        const latestMonth = getMonth(new Date().toISOString());
        
        const currentMonthExpenses = transactions.filter(
          (t) => t.type === "expense" && getMonth(t.date) === latestMonth
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
        const texts: string[] = [];
        const comparison = getMonthlyComparison();
        const totals = getTotals();
        const latestMonth = getMonth(new Date().toISOString());
        
        // Expense changes
        if (comparison.previousExpense > 0) {
          const change = percentageChange(comparison.currentExpense, comparison.previousExpense);
          if (change > 0) {
            texts.push(`You spent ${change}% more this month compared to last month.`);
          } else if (change < 0) {
            texts.push(`Great job! You spent ${Math.abs(change)}% less this month compared to last month.`);
          }
        }
        
        // Savings rate drop or increase
        if (comparison.previousIncome > 0 && comparison.currentIncome > 0) {
           const prevRate = Math.round(((comparison.previousIncome - comparison.previousExpense) / comparison.previousIncome) * 100);
           const currRate = Math.round(((comparison.currentIncome - comparison.currentExpense) / comparison.currentIncome) * 100);
           
           if (currRate < prevRate) {
              texts.push(`Your savings rate dropped from ${prevRate}% to ${currRate}%.`);
           } else if (currRate > prevRate) {
              texts.push(`Your savings rate improved to ${currRate}%!`);
           }
        }

        // Highest expense
        const breakdowns = getCategoryBreakdown();
        if (breakdowns.length > 0) {
          texts.push(`Your highest expense category is ${breakdowns[0].name} at ₹${breakdowns[0].value.toLocaleString("en-IN")}.`);
        }
        
        // Budget alerts
        const { budgets } = get();
        const currentMonthExpenses = transactions.filter(t => t.type === "expense" && getMonth(t.date) === latestMonth);
        const spentByCategory: Record<string, number> = {};
        currentMonthExpenses.forEach(t => spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount);
        
        Object.entries(budgets).forEach(([cat, budget]) => {
           const spent = spentByCategory[cat] || 0;
           if (budget > 0) {
              const perc = spent / budget;
              if (perc >= 1) texts.push(`You have exceeded your ${cat} budget by ₹${(spent - budget).toLocaleString("en-IN")}.`);
              else if (perc >= 0.8) texts.push(`You are nearing your limit for ${cat}. Only ₹${(budget - spent).toLocaleString("en-IN")} left.`);
           }
        });

        return texts;
      },

      getCategoryTrends: () => {
        const tx = get().transactions.filter(t => t.type === "expense");
        const months = [...new Set(tx.map(t => getMonth(t.date)))].sort();
        
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
        const tx = get().transactions.filter(t => t.type === "expense");
        const months = [...new Set(tx.map(t => getMonth(t.date)))].sort();
        
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
    }),
    {
      name: "financeflow-store",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
        budgets: state.budgets,
        pageSize: state.pageSize,
      }),
    },
  ),
);
