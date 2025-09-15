/**
 * Date utilities for handling date operations across the application
 * Provides robust date parsing, validation, and formatting functions
 */

export type DateInput = string | number | Date | null | undefined;

/**
 * Safely converts any date input to a valid Date object
 * Returns null if input is invalid, allowing callers to handle fallbacks
 */
export function getValidDate(dateInput: DateInput): Date | null {
  // Handle null/undefined
  if (dateInput == null) {
    return null;
  }

  // If already a Date object, validate it
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }

  // Handle string inputs
  if (typeof dateInput === "string") {
    // Handle empty strings
    if (dateInput.trim() === "") {
      return null;
    }

    // Try parsing the string
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  // Handle number inputs (timestamps)
  if (typeof dateInput === "number") {
    // Handle invalid numbers
    if (!isFinite(dateInput) || dateInput < 0) {
      return null;
    }

    // Handle both milliseconds and seconds timestamps
    const timestamp =
      dateInput < 10000000000 ? dateInput * 1000 : dateInput;
    const parsed = new Date(timestamp);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  // Fallback for any other type
  return null;
}

/**
 * Safely converts any date input to a valid Date object with fallback
 * Returns current date if input is invalid or null/undefined
 */
export function getValidDateWithFallback(dateInput: DateInput): Date {
  const validDate = getValidDate(dateInput);
  return validDate || new Date();
}

/**
 * Formats a date for display in the UI
 * Returns a localized date string or fallback text
 */
export function formatDateForDisplay(
  dateInput: DateInput,
  options: {
    locale?: string;
    fallback?: string;
    includeTime?: boolean;
  } = {}
): string {
  const {
    locale = "en-US",
    fallback = "Unknown date",
    includeTime = false,
  } = options;

  const date = getValidDateWithFallback(dateInput);

  try {
    const formatOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    if (includeTime) {
      formatOptions.hour = "2-digit";
      formatOptions.minute = "2-digit";
    }

    return date.toLocaleDateString(locale, formatOptions);
  } catch (error) {
    console.warn("Date formatting failed:", error);
    return fallback;
  }
}

/**
 * Formats a date for relative display (e.g., "2 days ago", "just now")
 */
export function formatRelativeDate(dateInput: DateInput): string {
  const date = getValidDateWithFallback(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else {
    return formatDateForDisplay(date);
  }
}

/**
 * Safely converts a date to ISO string for storage/export
 */
export function dateToISOString(dateInput: DateInput): string {
  const date = getValidDateWithFallback(dateInput);
  return date.toISOString();
}

/**
 * Safely parses an ISO string back to a Date object
 */
export function dateFromISOString(isoString: string): Date {
  return getValidDateWithFallback(isoString);
}

/**
 * Creates a new Date object with current timestamp
 * Useful for consistent date creation across the app
 */
export function createCurrentDate(): Date {
  return new Date();
}

/**
 * Validates if a date input represents a valid date
 */
export function isValidDate(dateInput: DateInput): boolean {
  if (dateInput == null) return false;

  const date = new Date(dateInput as any);
  return !isNaN(date.getTime());
}

/**
 * Safely handles date conversion for storage operations
 * Ensures dates are properly serialized and can be restored
 */
export function prepareDateForStorage(dateInput: DateInput): string {
  return dateToISOString(dateInput);
}

/**
 * Safely handles date restoration from storage
 * Ensures stored date strings are properly converted back to Date objects
 * Handles both ISO strings and serialized Date objects from Chrome storage
 * IMPORTANT: Only uses current date as fallback for truly missing dates
 */
export function restoreDateFromStorage(storedDate: any): Date {
  // Handle null/undefined - only then use current date
  if (storedDate == null) {
    console.warn(
      "Missing date in storage, using current date as fallback"
    );
    return new Date();
  }

  // If it's already a Date object (shouldn't happen in storage but just in case)
  if (storedDate instanceof Date) {
    return isNaN(storedDate.getTime()) ? new Date() : storedDate;
  }

  // Handle string inputs (ISO strings) - this is the main case for our serialized dates
  if (typeof storedDate === "string") {
    const parsed = getValidDate(storedDate);
    if (parsed) {
      return parsed;
    }
    // If we can't parse a stored string date, something is seriously wrong
    console.error("Failed to parse stored date string:", storedDate);
    return new Date();
  }

  // Handle serialized Date objects from Chrome storage
  // Chrome storage sometimes serializes Date objects as plain objects
  if (typeof storedDate === "object" && storedDate !== null) {
    // Try to extract timestamp or ISO string from serialized Date object
    if (typeof storedDate.getTime === "function") {
      // It's still a Date-like object
      try {
        return new Date(storedDate.getTime());
      } catch (e) {
        console.error("Failed to restore Date-like object:", e);
        return new Date();
      }
    }

    // Check if it has date-like properties
    if (storedDate._isAMomentObject || storedDate.toISOString) {
      try {
        return new Date(storedDate.toISOString());
      } catch (e) {
        // Fall through to other attempts
      }
    }

    // Try to convert object to string and parse
    try {
      const dateStr = storedDate.toString();
      const parsed = getValidDate(dateStr);
      if (parsed) {
        return parsed;
      }
    } catch (e) {
      // Fall through to fallback
    }
  }

  // Handle number inputs (timestamps)
  if (typeof storedDate === "number") {
    const parsed = getValidDate(storedDate);
    if (parsed) {
      return parsed;
    }
  }

  // Only reach here if we truly can't parse the stored date
  console.error(
    "Could not restore date from storage, using current date:",
    storedDate
  );
  return new Date();
}

/**
 * Gets a user-friendly date format for file names
 */
export function getDateForFilename(dateInput?: DateInput): string {
  const date = getValidDateWithFallback(dateInput);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
}

/**
 * Compares two dates safely
 * Returns -1 if first date is earlier, 1 if later, 0 if equal
 */
export function compareDates(date1: DateInput, date2: DateInput): number {
  const d1 = getValidDateWithFallback(date1);
  const d2 = getValidDateWithFallback(date2);

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
}
