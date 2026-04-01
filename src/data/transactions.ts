import type { Transaction } from "../types";

/**
 * 50 deterministic mock transactions spanning Dec 2025 – Mar 2026.
 * Mix of income (Salary, Freelance, Investment) and expenses across
 * 9 categories, with realistic INR amounts and descriptions.
 */
export const INITIAL_TRANSACTIONS: Transaction[] = [
  // ── December 2025 ──────────────────────────────────────────
  { id: "tx-01", date: "2025-12-01", amount: 75000, category: "Salary",        type: "income",  description: "Monthly salary — December" },
  { id: "tx-02", date: "2025-12-02", amount: 25000, category: "Rent",          type: "expense", description: "Apartment rent" },
  { id: "tx-03", date: "2025-12-03", amount: 4500,  category: "Groceries",     type: "expense", description: "Weekly groceries at BigBasket" },
  { id: "tx-04", date: "2025-12-05", amount: 2800,  category: "Food & Dining", type: "expense", description: "Dinner at Olive Garden" },
  { id: "tx-05", date: "2025-12-07", amount: 3200,  category: "Utilities",     type: "expense", description: "Electricity bill" },
  { id: "tx-06", date: "2025-12-09", amount: 12000, category: "Shopping",      type: "expense", description: "Winter jacket & shoes" },
  { id: "tx-07", date: "2025-12-11", amount: 1500,  category: "Transport",     type: "expense", description: "Uber rides" },
  { id: "tx-08", date: "2025-12-14", amount: 15000, category: "Freelance",     type: "income",  description: "Logo design for StartupX" },
  { id: "tx-09", date: "2025-12-16", amount: 5500,  category: "Entertainment", type: "expense", description: "Concert tickets" },
  { id: "tx-10", date: "2025-12-18", amount: 3800,  category: "Health",        type: "expense", description: "Gym membership renewal" },
  { id: "tx-11", date: "2025-12-22", amount: 8000,  category: "Shopping",      type: "expense", description: "Christmas gifts" },
  { id: "tx-12", date: "2025-12-28", amount: 6500,  category: "Food & Dining", type: "expense", description: "New Year's eve party" },

  // ── January 2026 ───────────────────────────────────────────
  { id: "tx-13", date: "2026-01-01", amount: 75000, category: "Salary",        type: "income",  description: "Monthly salary — January" },
  { id: "tx-14", date: "2026-01-02", amount: 25000, category: "Rent",          type: "expense", description: "Apartment rent" },
  { id: "tx-15", date: "2026-01-04", amount: 5200,  category: "Groceries",     type: "expense", description: "Weekly groceries + snacks" },
  { id: "tx-16", date: "2026-01-06", amount: 1800,  category: "Food & Dining", type: "expense", description: "Café with friends" },
  { id: "tx-17", date: "2026-01-08", amount: 2900,  category: "Utilities",     type: "expense", description: "Internet + mobile" },
  { id: "tx-18", date: "2026-01-10", amount: 4500,  category: "Transport",     type: "expense", description: "Weekend trip bus tickets" },
  { id: "tx-19", date: "2026-01-12", amount: 7500,  category: "Education",     type: "expense", description: "Udemy course bundle" },
  { id: "tx-20", date: "2026-01-14", amount: 20000, category: "Freelance",     type: "income",  description: "Mobile app UI project" },
  { id: "tx-21", date: "2026-01-16", amount: 3500,  category: "Food & Dining", type: "expense", description: "Team dinner" },
  { id: "tx-22", date: "2026-01-18", amount: 9500,  category: "Health",        type: "expense", description: "Dental treatment" },
  { id: "tx-23", date: "2026-01-20", amount: 5000,  category: "Investment",    type: "income",  description: "Mutual fund dividend" },
  { id: "tx-24", date: "2026-01-22", amount: 4200,  category: "Entertainment", type: "expense", description: "Movies + Netflix" },
  { id: "tx-25", date: "2026-01-25", amount: 6800,  category: "Shopping",      type: "expense", description: "Headphones & accessories" },

  // ── February 2026 ──────────────────────────────────────────
  { id: "tx-26", date: "2026-02-01", amount: 75000, category: "Salary",        type: "income",  description: "Monthly salary — February" },
  { id: "tx-27", date: "2026-02-02", amount: 25000, category: "Rent",          type: "expense", description: "Apartment rent" },
  { id: "tx-28", date: "2026-02-04", amount: 4800,  category: "Groceries",     type: "expense", description: "Weekly groceries" },
  { id: "tx-29", date: "2026-02-06", amount: 3200,  category: "Food & Dining", type: "expense", description: "Valentine's dinner" },
  { id: "tx-30", date: "2026-02-08", amount: 2500,  category: "Utilities",     type: "expense", description: "Water + gas bill" },
  { id: "tx-31", date: "2026-02-10", amount: 15000, category: "Shopping",      type: "expense", description: "Valentine gifts" },
  { id: "tx-32", date: "2026-02-12", amount: 2200,  category: "Transport",     type: "expense", description: "Monthly metro pass" },
  { id: "tx-33", date: "2026-02-14", amount: 8000,  category: "Entertainment", type: "expense", description: "Weekend getaway" },
  { id: "tx-34", date: "2026-02-16", amount: 18000, category: "Freelance",     type: "income",  description: "Dashboard redesign project" },
  { id: "tx-35", date: "2026-02-18", amount: 1500,  category: "Health",        type: "expense", description: "Pharmacy & vitamins" },
  { id: "tx-36", date: "2026-02-22", amount: 5500,  category: "Education",     type: "expense", description: "Technical books" },
  { id: "tx-37", date: "2026-02-26", amount: 3800,  category: "Food & Dining", type: "expense", description: "Team lunch outing" },

  // ── March 2026 ─────────────────────────────────────────────
  { id: "tx-38", date: "2026-03-01", amount: 75000, category: "Salary",        type: "income",  description: "Monthly salary — March" },
  { id: "tx-39", date: "2026-03-02", amount: 25000, category: "Rent",          type: "expense", description: "Apartment rent" },
  { id: "tx-40", date: "2026-03-04", amount: 5500,  category: "Groceries",     type: "expense", description: "Groceries + organic produce" },
  { id: "tx-41", date: "2026-03-06", amount: 4200,  category: "Food & Dining", type: "expense", description: "Birthday dinner" },
  { id: "tx-42", date: "2026-03-08", amount: 3100,  category: "Utilities",     type: "expense", description: "Electricity + broadband" },
  { id: "tx-43", date: "2026-03-10", amount: 7000,  category: "Shopping",      type: "expense", description: "Spring wardrobe update" },
  { id: "tx-44", date: "2026-03-12", amount: 2800,  category: "Transport",     type: "expense", description: "Cab rides" },
  { id: "tx-45", date: "2026-03-14", amount: 8000,  category: "Investment",    type: "income",  description: "Stock dividend payout" },
  { id: "tx-46", date: "2026-03-16", amount: 6200,  category: "Health",        type: "expense", description: "Annual health checkup" },
  { id: "tx-47", date: "2026-03-18", amount: 25000, category: "Freelance",     type: "income",  description: "E-commerce redesign project" },
  { id: "tx-48", date: "2026-03-20", amount: 3500,  category: "Entertainment", type: "expense", description: "Gaming subscription + in-app" },
  { id: "tx-49", date: "2026-03-24", amount: 4800,  category: "Food & Dining", type: "expense", description: "Holi celebration dinner" },
  { id: "tx-50", date: "2026-03-28", amount: 3000,  category: "Education",     type: "expense", description: "Workshop registration" },
];
