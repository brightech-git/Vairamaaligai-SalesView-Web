import { useQuery } from "@tanstack/react-query";
import { CustomerTransactionParams } from "@/types/CustomerTransactionReport/CustomerTransactionReport";
import { getCustomerTransactionReport } from "@/service/CustomerTransactionReportService";

export const useCustomerTransactionReport = (params: CustomerTransactionParams, enabled: boolean) => {
    return useQuery({
        queryKey: ["customer-transaction-report", params],
        queryFn: () => getCustomerTransactionReport(params),
        enabled,
    });
};
