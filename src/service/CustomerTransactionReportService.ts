// service/CustomerTransactionReportService.ts

import adminInstance from "../api/adminInstance";
import { CustomerTransactionParams, CustomerTransactionRow } from "@/types/CustomerTransactionReport/CustomerTransactionReport";

export const getCustomerTransactionReport = async (
    params: CustomerTransactionParams
): Promise<CustomerTransactionRow[]> => {
    try {
        const query: Record<string, any> = {
            fromDate: params.fromDate,
            toDate: params.toDate,
            ...(params.billNo && { billNo: params.billNo }),
            ...(params.customer && { customer: params.customer }),
            ...(params.phoneNo && { phoneNo: params.phoneNo }),
            ...(params.pan && { pan: params.pan }),
            ...(params.gstNo && { gstNo: params.gstNo }),
            ...(params.address && { address: params.address }),
            adminDb: 'SFLADMINDB',
            companyId: 'SFH',
            withOrd : 'N',
            withCanBill : 'N',
            withApproval : 'N',
            costCentre : 'ALL'
        };

        const { data } = await adminInstance.get(
            "/customer-transactions",
            { params: query }
        );
        return data;
    } catch (err) {
        throw new Error(`Error fetching Customer Transaction Report: ${err}`);
    }
};
