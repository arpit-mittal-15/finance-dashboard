import React from "react";
import { AnimatePresence } from "framer-motion";
import { useFinanceStore } from "../../store/useFinanceStore";
import Toast from "./Toast";

export default function ToastContainer() {
  const toasts = useFinanceStore((s) => s.toasts);

  return (
    <div className="fixed bottom-0 right-0 p-4 sm:p-6 z-[999999] pointer-events-none flex flex-col gap-3 items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
