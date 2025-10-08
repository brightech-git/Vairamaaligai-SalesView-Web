// ✅ src/service/BillCancelService.ts
"use client"
import adminInstance from "@/api/adminInstance";

export interface BillCancel {
    NETWT: number;
    TRANNO: number;
    AMOUNT: number;
    USERNAME: string;
    TRANDATE: string;
}

// Now expect formatted strings instead of Date objects
export const getBillCancelledIssues = async (
    startDate: string,
    endDate: string
): Promise<BillCancel[]> => {
    const response = await adminInstance.get<BillCancel[]>("/billCancel", {
        params: { startDate, endDate },
    });
    return response.data;
};
