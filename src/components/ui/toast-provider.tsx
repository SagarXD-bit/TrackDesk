"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "var(--toast-bg, #fff)",
          color: "var(--toast-color, #1f2937)",
          border: "1px solid var(--toast-border, #e5e7eb)",
        },
      }}
    />
  );
}
