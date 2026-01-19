import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatScore(score: number | null): string {
  if (score === null) return "-";
  return score.toFixed(1);
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return "CERTIFIED";
  if (score >= 6) return "SOLID";
  if (score >= 4) return "MIXED";
  return "DYOR";
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "text-bodega-gold";
  if (score >= 6) return "text-bodega-orange";
  if (score >= 4) return "text-bodega-coral";
  return "text-bodega-burgundy";
}

export function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
