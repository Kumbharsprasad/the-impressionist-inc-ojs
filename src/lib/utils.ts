import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple ID generator
export function generateId(length: number = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}
