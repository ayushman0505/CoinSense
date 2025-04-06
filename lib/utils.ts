import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in Indian Rupees
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

// Indian tax slab calculation for FY 2023-24 (New Tax Regime)
export function calculateTax(annualIncome: number) {
  // Tax slabs for the new tax regime
  if (annualIncome <= 300000) {
    return 0
  } else if (annualIncome <= 600000) {
    return (annualIncome - 300000) * 0.05
  } else if (annualIncome <= 900000) {
    return 15000 + (annualIncome - 600000) * 0.1
  } else if (annualIncome <= 1200000) {
    return 45000 + (annualIncome - 900000) * 0.15
  } else if (annualIncome <= 1500000) {
    return 90000 + (annualIncome - 1200000) * 0.2
  } else {
    return 150000 + (annualIncome - 1500000) * 0.3
  }
}

// Get tax slab description
export function getTaxSlab(annualIncome: number) {
  if (annualIncome <= 300000) {
    return "Nil (0%)"
  } else if (annualIncome <= 600000) {
    return "₹0 + 5% above ₹3,00,000"
  } else if (annualIncome <= 900000) {
    return "₹15,000 + 10% above ₹6,00,000"
  } else if (annualIncome <= 1200000) {
    return "₹45,000 + 15% above ₹9,00,000"
  } else if (annualIncome <= 1500000) {
    return "₹90,000 + 20% above ₹12,00,000"
  } else {
    return "₹1,50,000 + 30% above ₹15,00,000"
  }
}

