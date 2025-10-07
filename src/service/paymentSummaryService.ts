import adminInstance from "@/api/adminInstance";

export const fetchPaymentSummary = async (startDate: string, endDate: string) => {
    const [scheme, upi, credit, cash] = await Promise.all([
        adminInstance.get('/SchemeAdjustment', { params: { startDate, endDate } }),
        adminInstance.get('/totalChequeAndUPI', { params: { startDate, endDate } }),
        adminInstance.get('/totalCreditCardBill', { params: { startDate, endDate } }),
        adminInstance.get('/totalCash', { params: { startDate, endDate } }),
    ]);

    return {
        schemeAdjustment: scheme.data?.Amount || 0,
        chequeAndUPI: upi.data?.total_Cheque_and_UPI || 0,
        creditCardBill: credit.data?.[0]?.CreditCard_Bill || 0,
        cash: cash.data?.[0]?.Total_Cash || 0,
    };
};
