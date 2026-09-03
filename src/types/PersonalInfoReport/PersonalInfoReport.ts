// types/PersonalInfoReport/PersonalInfoReport.ts

// Response rows come straight from GET /personal-info ("data" array).
// The shape is intentionally open — the UI derives its columns from whatever
// keys the backend actually sends instead of a fixed field list.
export type PersonalInfoRow = Record<string, unknown>;

// Mirrors every @RequestParam accepted by the backend endpoint.
export interface PersonalInfoParams {
    costId?: string; // branch cost centre code (e.g. "FJ"); omitted = all branches
    page: number; // 0-based, matches the backend's default
    size: number;
}

export interface PersonalInfoResponse {
    costId: string | null;
    page: number;
    size: number;
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    data: PersonalInfoRow[];
}
