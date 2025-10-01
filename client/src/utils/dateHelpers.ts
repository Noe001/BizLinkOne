import { differenceInCalendarDays } from "date-fns";

/**
 * Calculate days until a target date from now
 * @param date Target date
 * @returns Number of days (negative if past, 0 if today, positive if future)
 */
export function daysUntilDate(date: Date | null | undefined): number | null {
  if (!date) return null;
  return differenceInCalendarDays(date, new Date());
}

/**
 * Check if a date is overdue
 * @param date Target date
 * @returns true if date is in the past
 */
export function isDateOverdue(date: Date | null | undefined): boolean {
  const days = daysUntilDate(date);
  return days !== null && days < 0;
}

/**
 * Check if a date is due soon (within specified days)
 * @param date Target date
 * @param withinDays Number of days to consider "soon" (default: 2)
 * @returns true if date is within the specified range
 */
export function isDateDueSoon(date: Date | null | undefined, withinDays: number = 2): boolean {
  const days = daysUntilDate(date);
  return days !== null && days >= 0 && days <= withinDays;
}
