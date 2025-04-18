"use client";

import type * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-500 text-white",
        warning: "border-yellow-500 bg-yellow-500 text-white",
        info: "border-blue-500 bg-blue-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  id: string;
  title?: string;
  description?: string;
  visible?: boolean;
}

export function Toast({ id, className, variant, title, description, visible = true, ...props }: ToastProps) {
  const { dismiss } = useToast();

  return (
    <div
      className={cn(
        toastVariants({ variant }),
        "max-w-md",
        visible ? "opacity-100" : "translate-y-2 opacity-0",
        "transition-all duration-300 ease-in-out",
        className,
      )}
      {...props}
    >
      <div className="flex-1 gap-2">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <button
        onClick={() => dismiss(id)}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed right-0 top-0 z-[100] flex max-h-screen flex-col gap-2 overflow-hidden p-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant as any}
          visible={toast.visible}
        />
      ))}
    </div>
  );
}
