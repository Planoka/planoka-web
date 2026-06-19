import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Utility pour merge les classes Tailwind */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

