export type DecimalFormat = "2" | "3";

/**
 * Format a number to 2 or 3 decimal places safely.
 * @param value number or null/undefined
 * @param format "2" | "3" (decimal places)
 * @returns formatted number as string
 */
export const formatNumber = (value: number | null | undefined, format: DecimalFormat = "2"): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
        return " ";
    }

    

    const num = Number(value);

    if( num === 0) return "";
    if (format === "2") return num.toFixed(2);
    return num.toFixed(3);
};
