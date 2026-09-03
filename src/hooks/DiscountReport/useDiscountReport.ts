import { useQuery } from "@tanstack/react-query";
import { DiscountReportParams } from "@/types/DiscountReport/DiscountReport";
import { getDiscountReport } from "@/service/DiscountReportService";

export const useDiscountReport = (params: DiscountReportParams, enabled: boolean) => {
    return useQuery({
        queryKey: ["discount-report", params],
        queryFn: () => getDiscountReport(params),
        enabled,
    });
};
