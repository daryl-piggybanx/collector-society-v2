import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FormData } from "~/components/form/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function filterEmptyValues(data: FormData) {
  const filtered: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          filtered[key] = value;
        }
      } else {
        filtered[key] = value;
      }
    }
  });
  
  return filtered;
}