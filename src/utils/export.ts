import type { Transaction } from "../types";

/** Download a string as a file */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Export transactions as CSV */
export function exportToCSV(transactions: Transaction[]) {
  const headers = ["Date", "Amount", "Category", "Type", "Description"];
  const rows = transactions.map((t) => [
    t.date,
    t.amount.toString(),
    t.category,
    t.type,
    `"${t.description.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(csv, `financeflow-transactions-${timestamp}.csv`, "text/csv");
}

/** Export transactions as JSON */
export function exportToJSON(transactions: Transaction[]) {
  const json = JSON.stringify(transactions, null, 2);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(
    json,
    `financeflow-transactions-${timestamp}.json`,
    "application/json",
  );
}
