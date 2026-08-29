import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateTraineeId(index: number): string {
  return `MH-SKILL-2026-${String(index).padStart(6, "0")}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    employed: "bg-emerald-100 text-emerald-800",
    "self-employed": "bg-amber-100 text-amber-800",
    apprentice: "bg-purple-100 text-purple-800",
    seeking: "bg-orange-100 text-orange-800",
    "not-working": "bg-red-100 text-red-800",
    verified: "bg-emerald-100 text-emerald-800",
    pending: "bg-yellow-100 text-yellow-800",
    unverified: "bg-gray-100 text-gray-800",
    enrolled: "bg-blue-100 text-blue-800",
    certified: "bg-indigo-100 text-indigo-800",
    placed: "bg-teal-100 text-teal-800",
    "in-progress": "bg-blue-100 text-blue-800",
    recommended: "bg-purple-100 text-purple-800",
    approved: "bg-emerald-100 text-emerald-800",
    measured: "bg-indigo-100 text-indigo-800",
  };
  return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
