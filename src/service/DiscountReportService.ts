// service/DiscountReportService.ts

import adminInstance from "../api/adminInstance";
import { DiscountReportParams, DiscountReportResponse } from "@/types/DiscountReport/DiscountReport";

export const getDiscountReport = async (
    params: DiscountReportParams
): Promise<DiscountReportResponse> => {
    try {
        const query: Record<string, any> = {
            fromDate: params.fromDate,
            toDate: params.toDate,
            companyId: "SFH",
            // costId omitted/empty = all branches (the API does not accept "ALL" here)
            costId: params.costId || "",
            metalId: params.metalId || "ALL",
            groupBy: params.groupBy || "N",
            withEx: params.withEx || "Y",
        };

        const { data } = await adminInstance.get("/discount", { params: query });
        return data;
    } catch (err) {
        throw new Error(`Error fetching Discount Report: ${err}`);
    }
};
