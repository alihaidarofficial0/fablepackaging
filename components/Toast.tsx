"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: ToastItem) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  show(message: string, type: ToastType = "info", duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = { id, message, type, duration };
    listeners.forEach((listener) => listener(item));
    return id;
  },
  success(message: string, duration = 4000) {
    return this.show(message, "success", duration);
  },
  error(message: string, duration = 4000) {
    return this.show(message, "error", duration);
  },
  warning(message: string, duration = 4000) {
    return this.show(message, "warning", duration);
  },
  info(message: string, duration = 4000) {
    return this.show(message, "info", duration);
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleNewToast = (newToast: ToastItem) => {
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration !== Infinity) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration || 4000);
      }
    };

    listeners.add(handleNewToast);
    return () => {
      listeners.delete(handleNewToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => {
        const config = {
          success: {
            icon: CheckCircle2,
            bg: "bg-white border-l-4 border-emerald-500 text-emerald-800",
            iconColor: "text-emerald-500",
          },
          error: {
            icon: AlertCircle,
            bg: "bg-white border-l-4 border-red-500 text-red-800",
            iconColor: "text-red-500",
          },
          warning: {
            icon: AlertTriangle,
            bg: "bg-white border-l-4 border-amber-500 text-amber-800",
            iconColor: "text-amber-500",
          },
          info: {
            icon: Info,
            bg: "bg-white border-l-4 border-[#D96B2B] text-[#BC5420]",
            iconColor: "text-[#D96B2B]",
          },
        }[t.type];

        const IconComponent = config.icon;

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-[#E7DDD2] shadow-xl transition-all duration-300 ${config.bg}`}
          >
            <IconComponent className={`size-5 shrink-0 ${config.iconColor} mt-0.5`} />
            <div className="flex-1 text-xs font-semibold leading-relaxed text-[#0B1F33]">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[#98A2B3] hover:text-[#0B1F33] p-0.5 rounded transition-colors shrink-0 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
