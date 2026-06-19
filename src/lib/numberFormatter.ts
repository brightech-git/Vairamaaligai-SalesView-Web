export type DecimalFormat = "2" | "3";


export const formatNumber = (value: number | null | undefined, format: DecimalFormat = "2"): string => {
    if (value === null || value === undefined || isNaN(Number(value))) {
        return "0.00";
    }

    const num = Number(value);
    if (format === "2") return num.toFixed(2);
    return num.toFixed(3);
};

export const formatToNumber = (
    value: any,
    decimalScale?: number ,
) => {
    const num = Number(value);

    // validation
    if (value === null || value === undefined || isNaN(num)) {
        return ""; // or return null depending on your use case
    }

    if (num === 0) {
        return "";
    }
    const scale = decimalScale ?? 2;

    return num.toFixed(scale);
};