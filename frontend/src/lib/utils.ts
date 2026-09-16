import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

export function greetingForHour(hour = new Date().getHours()) {
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function todayLabel(locale = 'en-IN') {
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function isUnauthorized(error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status
  return status === 401 || status === 403
}
