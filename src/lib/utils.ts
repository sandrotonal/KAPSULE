import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: number, currency: string = "TRY"): string {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: currency === "TL" ? "TRY" : currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function getDaysRemaining(expiryDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const CATEGORY_LABELS: Record<string, string> = {
  // Subscriptions & Receipts
  Software: 'Yazılım',
  Entertainment: 'Eğlence',
  Work: 'İş',
  Cloud: 'Bulut',
  Health: 'Sağlık',
  Utility: 'Hizmet',
  Tech: 'Teknoloji',
  Home: 'Ev',
  Travel: 'Seyahat',
  Clothing: 'Giyim',
  Food: 'Yemek',
  Utilities: 'Faturalar',
  Services: 'Hizmetler',

  // Documents
  Personal: 'Kişisel',
  Finance: 'Finans',
  Insurance: 'Sigorta',
  Vehicle: 'Araç',
  Identity: 'Kimlik',
  Property: 'Mülk',

  // Defaults
  Subscription: 'Abonelik',
  Receipt: 'Fiş',
  Warranty: 'Garanti',
  Document: 'Belge',
};

export function getCategoryLabel(rawCategory: string): string {
  if (!rawCategory) return 'Genel';
  return CATEGORY_LABELS[rawCategory] || rawCategory;
}
