import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUaPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("380") && digits.length === 12) {
    return `+38 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+38 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }
  return raw;
}

export function normalizeUaPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("380") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+38${digits}`;
  if (digits.length === 9) return `+380${digits}`;
  return raw.trim();
}

export function isValidUaPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return (
    (digits.startsWith("380") && digits.length === 12) ||
    (digits.startsWith("0") && digits.length === 10) ||
    digits.length === 9
  );
}
