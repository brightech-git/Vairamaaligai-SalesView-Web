// types/DiscountReport/DiscountReport.ts

// Response rows come straight from GET /discount ("data" array).
// The shape is intentionally open — the UI derives its columns from whatever
// keys the backend actually sends instead of a fixed field list.
export type DiscountReportRow = Record<string, unknown>;

// Mirrors every @RequestParam the page sends the backend endpoint.
export interface DiscountReportParams {
    fromDate: string; // yyyy-MM-dd
    toDate: string;   // yyyy-MM-dd
    // companyId is hardcoded to "SFH" in DiscountReportService — not filterable.
    costId?: string; // branch cost centre code (e.g. "FJ"); "" = all branches
    metalId?: string; // e.g. "G", "S"; "ALL" = all metals
    groupBy?: "Y" | "N";
    withEx?: "Y" | "N";
}

export interface DiscountReportResponse {
    fromDate: string;
    toDate: string;
    companyId: string;
    costId: string;
    metalId: string;
    groupBy: string;
    withEx: string;
    branchCount: number;
    recordCount: number;
    data: DiscountReportRow[];
}
