export type AccountType = "bank" | "wallet" | "upi";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
}

// ── Transaction ──────────────────────────────────────────────
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string; // ISO YYYY-MM-DD
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
  accountId: string;
}

// ── Role ─────────────────────────────────────────────────────
export type Role = "viewer" | "admin";

// ── Filters & Sorting ────────────────────────────────────────
export interface Filters {
  type: TransactionType | "all";
  category: string; // "all" | specific category
  dateStart: string;
  dateEnd: string;
}

export interface SortConfig {
  field: "date" | "amount";
  direction: "asc" | "desc";
}

// ── Category info ────────────────────────────────────────────
export interface CategoryInfo {
  name: string;
  color: string;
  bgLight: string;
  bgDark: string;
}

// ── Chart data shapes ────────────────────────────────────────
export interface BalancePoint {
  date: string;
  balance: number;
  income: number;
  expense: number;
}

export interface CategorySlice {
  name: string;
  value: number;
  color: string;
}

// ── Insight ──────────────────────────────────────────────────
export interface Insight {
  id: string;
  icon: string; // lucide icon name mapped in component
  title: string;
  value: string;
  change?: number; // percentage
  type: "positive" | "negative" | "neutral" | "warning";
}

// ── Budgets ──────────────────────────────────────────────────
export interface BudgetProgress {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
}

// ── Advanced Chart Data ──────────────────────────────────────
export interface TrendDataPoint {
  date: string;
  [category: string]: string | number; // "YYYY-MM" -> spending amount per category
}

export interface ForecastPoint {
  month: string;
  actual?: number;
  forecast?: number;
}

// ── Notifications ────────────────────────────────────────────
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
