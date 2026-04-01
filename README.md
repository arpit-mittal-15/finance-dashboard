# FinanceFlow — Smart Finance Dashboard

A production-quality, SaaS-grade personal finance dashboard built with React, TypeScript, and modern web technologies. Track income, expenses, and get AI-powered financial insights — all in a beautifully designed interface.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 📊 Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses with animated count-up effects and monthly trend indicators (↑/↓)
- **Balance Over Time** — Smooth area chart with gradient fill showing cumulative balance trajectory
- **Expense Breakdown** — Interactive donut chart with hover highlights and synced legend

### 💳 Transactions
- Full-featured data table with **description, category badges, type tags, and color-coded amounts**
- **Debounced search** (300ms) across all transaction fields
- **Multi-filter panel** — type, category, and date range
- **Sorting** — by date or amount (ascending/descending)
- **Pagination** — 8 rows per page with smart page number ellipsis

### 👤 Role-Based Access
- **Viewer** — read-only access
- **Admin** — can add, edit, and delete transactions
- Seamless role switching via the navbar toggle

### ➕ Add/Edit Transactions
- Beautiful modal form with **type toggle, category picker, date, amount, and description**
- **Client-side validation** with inline error messages
- Dynamic category list based on transaction type
- Reusable for both create and edit flows

### 📈 Smart Insights
- **Savings Rate** — percentage of income saved
- **Highest Spending Category** — identify top expense areas
- **Monthly Comparison** — expense trend vs last month
- **Average Daily Expense** — per-day spending
- **Category-specific alerts** — e.g., "Health spending +313% this month"
- **Transaction count** — activity for the current month

### 🎨 Design & UX
- **Dark mode** — toggle with localStorage persistence
- **Glassmorphic cards** with subtle shadows and backdrop blur
- **Framer Motion animations** — card entrances, modal transitions, row staggers
- **Responsive design** — mobile, tablet, and desktop layouts
- **Custom scrollbar** styling
- **Inter font** from Google Fonts

### 🚀 Advanced Features
- **CSV & JSON export** — download all transaction data
- **Local Storage persistence** — transactions, role, and dark mode preference survive page reloads
- **Category color system** — consistent colors across table badges, charts, and filters
- **Empty state handling** — friendly message when no results match filters
- **Section scroll navigation** — sidebar items smoothly scroll to dashboard sections

---

## 🛠 Tech Stack

| Technology       | Purpose                     |
| ---------------- | --------------------------- |
| React 18         | Component framework         |
| TypeScript 5     | Type safety                 |
| Vite 5           | Build tool & dev server     |
| Tailwind CSS 3.4 | Utility-first styling       |
| Zustand 4        | State management            |
| Recharts 2       | Charts (Area, Pie)          |
| Lucide React     | Icon system                 |
| Framer Motion    | Animations & transitions    |
| nanoid           | Unique ID generation        |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable components
│   │   ├── Badge.tsx          # Color-coded badges
│   │   ├── Card.tsx           # Glass card wrapper
│   │   ├── EmptyState.tsx     # Zero-data placeholder
│   │   └── Modal.tsx          # Animated modal dialog
│   ├── dashboard/             # Dashboard section
│   │   ├── SummaryCards.tsx    # Balance / Income / Expense
│   │   ├── BalanceChart.tsx    # Area chart
│   │   └── CategoryChart.tsx  # Donut chart
│   ├── transactions/          # Transactions section
│   │   ├── FiltersBar.tsx     # Search + filters + sort
│   │   ├── TransactionsTable.tsx
│   │   ├── TransactionModal.tsx
│   │   ├── Pagination.tsx
│   │   └── TransactionsSection.tsx  # Section orchestrator
│   ├── insights/
│   │   └── InsightsPanel.tsx  # Smart insight cards
│   └── layout/
│       ├── Sidebar.tsx        # Side navigation
│       ├── Navbar.tsx         # Top bar with controls
│       └── Layout.tsx         # Shell layout
├── store/
│   └── useFinanceStore.ts     # Zustand store (persist)
├── hooks/
│   ├── useDebounce.ts         # Debounced value hook
│   └── useAnimatedCounter.ts  # Count-up animation hook
├── utils/
│   ├── helpers.ts             # Formatters & calculations
│   └── export.ts              # CSV / JSON export
├── data/
│   ├── transactions.ts        # 50 mock transactions
│   └── categories.ts          # Category color system
├── types/
│   └── index.ts               # TypeScript interfaces
├── pages/
│   └── Dashboard.tsx          # Main dashboard page
├── App.tsx
├── main.tsx
└── index.css                  # Tailwind + custom styles
```

---

## 🏗 Architecture

### State Management (Zustand)

The entire app state lives in a single Zustand store with `persist` middleware:

- **Core data**: `transactions[]`, `role`, `darkMode`
- **UI state**: `filters`, `searchQuery`, `sortBy`, `currentPage`, `pageSize`
- **Actions**: CRUD operations, filter/sort setters, pagination controls
- **Derived selectors**: computed values that answer questions:
  - `getTotals()` → income, expense, balance
  - `getFilteredTransactions()` → applies all filters + search + sort
  - `getCategoryBreakdown()` → expense aggregation by category
  - `getBalanceOverTime()` → cumulative balance points for the chart
  - `getMonthlyComparison()` → current vs previous month
  - `getSmartInsights()` → generated insight objects
  - `getAllCategories()` → unique category list

**Persistence**: only `transactions`, `role`, `darkMode`, and `pageSize` are persisted to `localStorage` via the `partialize` option. UI state like filters and search reset on page load for a clean experience.

### Data Flow

```
Mock Data → Zustand Store → Components
                ↑                ↓
            Actions ←── User Interactions
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd finance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

---

## 📝 License

MIT
