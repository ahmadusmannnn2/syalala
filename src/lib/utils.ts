import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Promotion } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatValidDays(days: string[] | null): string {
  if (!days || days.length === 0) return "Setiap hari";
  const dayMap: Record<string, string> = {
    monday: "Senin",
    tuesday: "Selasa",
    wednesday: "Rabu",
    thursday: "Kamis",
    friday: "Jumat",
    saturday: "Sabtu",
    sunday: "Minggu",
  };
  return days.map((d) => dayMap[d.toLowerCase()] || d).join(", ");
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function getJakartaDateTime(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "long",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    day: values.weekday.toLowerCase(),
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

function timeToMinutes(time: string | null) {
  if (!time) return null;

  const [hour, minute] = time.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;

  return hour * 60 + minute;
}

function isWithinTimeRange(currentMinutes: number, start: number, end: number) {
  if (start <= end) {
    return currentMinutes >= start && currentMinutes <= end;
  }

  return currentMinutes >= start || currentMinutes <= end;
}

export function isPromotionCurrentlyValid(promo: Promotion, now = new Date()): boolean {
  if (!promo.is_active) return false;

  const current = getJakartaDateTime(now);

  if (promo.start_date && current.date < promo.start_date) return false;
  if (promo.end_date && current.date > promo.end_date) return false;

  if (
    promo.valid_days?.length &&
    !promo.valid_days.some((day) => day.toLowerCase() === current.day)
  ) {
    return false;
  }

  const ranges = [
    [timeToMinutes(promo.valid_time_start), timeToMinutes(promo.valid_time_end)],
    [timeToMinutes(promo.valid_time_start_2), timeToMinutes(promo.valid_time_end_2)],
  ].filter((range): range is [number, number] => range[0] !== null && range[1] !== null);

  if (ranges.length === 0) return true;

  return ranges.some(([start, end]) =>
    isWithinTimeRange(current.minutes, start, end)
  );
}
