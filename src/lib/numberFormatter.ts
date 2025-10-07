// src/lib/numberFormatter.ts
export type DecimalFormat = "2" | "3";

/**
 * Format a number to 2 or 3 decimal places
 * @param value number
 * @param format "2" | "3" (decimal places)
 * @returns formatted number as string
 */
export const formatNumber = (value: number, format: DecimalFormat = "2"): string => {
    if (isNaN(value)) return "0";
    if (format === "2") return value.toFixed(2);
    return value.toFixed(3);
};
