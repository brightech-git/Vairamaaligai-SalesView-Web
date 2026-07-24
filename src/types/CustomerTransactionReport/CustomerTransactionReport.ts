// types/CustomerTransactionReport/CustomerTransactionReport.ts

// Response rows come straight from GET /customer-transactions (List<Map<String, Object>>).
// The shape is intentionally open — the UI derives its columns from whatever
// keys the backend actually sends instead of a fixed field list.
export type CustomerTransactionRow = Record<string, unknown>;

// Mirrors every @RequestParam accepted by the backend endpoint.
export interface CustomerTransactionParams {
    fromDate: string; // yyyy-MM-dd
    toDate: string;   // yyyy-MM-dd
    costCentre?: string;
    nodeId?: string;
    companyId?: string;
    withOrd?: "Y" | "N";
    withCanBill?: "Y" | "N";
    adminDb?: string;
    metal?: string;
    cashId?: string;
    billNo?: string;
    withApproval?: "Y" | "N";
    customer?: string;
    phoneNo?: string;
    pan?: string;
    gstNo?: string;
    address?: string;
    searchBillNo?: string;
    fromTranDate?: string;
    toTranDate?: string;
}
