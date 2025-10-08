// src/hooks/usePaymentSummary.ts
"use client";
export const dynamic = "force-dynamic";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { fetchPaymentSummary } from "@/service/paymentSummaryService";

export const usePaymentSummary = () => {
    const { formattedStartDate, formattedEndDate } = useAppContext();
    console.log("Date Range in usePaymentSummary:", formattedEndDate);
    const startDate = formattedStartDate;
    const endDate = formattedEndDate;

    console.log("Fetching payment summary with dates:", startDate, endDate);

    return useQuery({
        queryKey: ["paymentSummary", startDate, endDate],
        queryFn: () => fetchPaymentSummary(startDate, endDate),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30, // 30 mins
    });
};
