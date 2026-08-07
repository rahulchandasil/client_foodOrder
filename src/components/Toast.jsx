import { useEffect } from "react";

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 2500);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div
      className={`pointer-events-auto mb-3 w-full max-w-sm rounded-2xl px-4 py-3 text-sm font-medium shadow-xl ring-1 backdrop-blur ${
        toast.type === "success"
          ? "bg-emerald-500/95 text-white ring-emerald-200"
          : "bg-rose-500/95 text-white ring-rose-200"
      }`}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
};

export const ToastViewport = ({ toasts, onClose }) => {
  return (
    <div className="fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
