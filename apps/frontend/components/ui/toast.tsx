"use client";

import { cn } from "@/lib/utils";

type ToastProps = {
  title: string;
  description?: string;
  tone: "success" | "error";
};

export function Toast({ title, description, tone }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50 w-80 rounded-md border px-4 py-3 shadow-lg",
        tone === "success"
          ? "border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
          : "border-red-300 bg-red-100 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
      )}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-semibold">{title}</p>
      {description ? <p className="mt-1 text-xs opacity-90">{description}</p> : null}
    </div>
  );
}
