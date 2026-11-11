import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateSkillGap(
  requiredProficiency: number,
  candidateProficiency: number
): number {
  if (requiredProficiency === 0) return 0;
  const gap = ((requiredProficiency - candidateProficiency) / requiredProficiency) * 100;
  return Math.max(0, Math.round(gap * 100) / 100);
}

export function calculateOverallSkillGap(
  skills: Array<{ required: number; current: number; weight?: number }>
): number {
  if (skills.length === 0) return 0;
  const totalWeight = skills.reduce((sum, s) => sum + (s.weight || 1), 0);
  const weightedGap = skills.reduce((sum, s) => {
    const gap = calculateSkillGap(s.required, s.current);
    return sum + gap * (s.weight || 1);
  }, 0);
  return Math.round((weightedGap / totalWeight) * 100) / 100;
}

export function getSkillStatus(gap: number): "met" | "improvement" | "missing" {
  if (gap <= 10) return "met";
  if (gap <= 50) return "improvement";
  return "missing";
}

export function getSkillStatusColor(status: "met" | "improvement" | "missing"): string {
  switch (status) {
    case "met": return "text-green-600";
    case "improvement": return "text-yellow-600";
    case "missing": return "text-red-600";
  }
}

export function getSkillStatusBg(status: "met" | "improvement" | "missing"): string {
  switch (status) {
    case "met": return "bg-green-100 text-green-800";
    case "improvement": return "bg-yellow-100 text-yellow-800";
    case "missing": return "bg-red-100 text-red-800";
  }
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}
