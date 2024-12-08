const EMPTY_STRING = "";
const MONTH_FORMAT = "long";
const DAY_FORMAT = "numeric";
const YEAR_FORMAT = "numeric";
const LOCALE = "en-US";

/**
 * Formats a date into a human-readable string in the format "Month Day, Year".
 *
 * @param date - The date to format.
 * @returns The formatted date as a string, or an empty string if the input is invalid.
 */
export function formatDate(date: Date | undefined): string {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return new Intl.DateTimeFormat(LOCALE, {
      month: MONTH_FORMAT,
      day: DAY_FORMAT,
      year: YEAR_FORMAT,
    }).format(date);
  }
  return EMPTY_STRING;
}