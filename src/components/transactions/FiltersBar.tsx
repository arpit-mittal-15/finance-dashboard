import React, { useState } from "react";
import { Search, Filter, X, RotateCcw } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { useDebounce } from "../../hooks/useDebounce";

export default function FiltersBar() {
  const filters = useFinanceStore((s) => s.filters);
  const setFilters = useFinanceStore((s) => s.setFilters);
  const setSearchQuery = useFinanceStore((s) => s.setSearchQuery);
  const setSortBy = useFinanceStore((s) => s.setSortBy);
  const resetFilters = useFinanceStore((s) => s.resetFilters);
  const allCategories = useFinanceStore((s) => s.getAllCategories());

  const [localSearch, setLocalSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(localSearch, 300);
  React.useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.dateStart !== "" ||
    filters.dateEnd !== "" ||
    localSearch !== "";

  return (
    <div className="space-y-3">
      {/* Top bar: search + filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="input-base pl-10 pr-10"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter toggle + Sort */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary ${
              showFilters
                ? "!bg-indigo-50 !text-indigo-600 !border-indigo-200 dark:!bg-indigo-500/10 dark:!text-indigo-400 dark:!border-indigo-500/30"
                : ""
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>

          <select
            onChange={(e) => {
              const [field, dir] = e.target.value.split(":");
              setSortBy({
                field: field as "date" | "amount",
                direction: dir as "asc" | "desc",
              });
            }}
            className="input-base w-auto min-w-[140px]"
          >
            <option value="date:desc">Newest first</option>
            <option value="date:asc">Oldest first</option>
            <option value="amount:desc">Highest amount</option>
            <option value="amount:asc">Lowest amount</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={() => {
                resetFilters();
                setLocalSearch("");
              }}
              className="btn-ghost text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10"
              title="Clear all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded filter row */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value as any })}
              className="input-base"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
              className="input-base"
            >
              <option value="all">All categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              From
            </label>
            <input
              type="date"
              value={filters.dateStart}
              onChange={(e) => setFilters({ dateStart: e.target.value })}
              className="input-base"
            />
          </div>

          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              To
            </label>
            <input
              type="date"
              value={filters.dateEnd}
              onChange={(e) => setFilters({ dateEnd: e.target.value })}
              className="input-base"
            />
          </div>
        </div>
      )}
    </div>
  );
}
