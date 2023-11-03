import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
//?? How does it works? why ClassValue is an array? 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat("en-US", { //?? what is Intl?
  style: 'currency',
  currency: 'USD'
}) 