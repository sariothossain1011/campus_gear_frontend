import type { DecimalValue } from "@/lib/validations/types";

/**
 * The backend charges through Stripe in `STRIPE_CURRENCY` (USD unless it is
 * configured otherwise). Keep this in step with it so the totals shown are the
 * amounts actually charged.
 */
const CURRENCY = process.env.CAMPUS_GEAR_CURRENCY?.trim() || "USD";

const money = new Intl.NumberFormat("en", {
  style: "currency",
  currency: CURRENCY,
});

/** Decimal fields arrive as strings (`"25.5"`); never do maths on the raw value. */
export function toNumber(value: DecimalValue | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatMoney(value: DecimalValue | null | undefined) {
  const number = toNumber(value);
  return number === null ? "—" : money.format(number);
}

// Rental dates are stored as midnight UTC; formatting in UTC keeps a booking
// for the 12th from showing as the 11th west of Greenwich.
const shortDate = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const fullDate = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(value: string) {
  return fullDate.format(new Date(value));
}

export function formatDateRange(start: string, end: string) {
  const from = new Date(start);
  const to = new Date(end);
  return from.getTime() === to.getTime()
    ? fullDate.format(from)
    : `${shortDate.format(from)} – ${fullDate.format(to)}`;
}
