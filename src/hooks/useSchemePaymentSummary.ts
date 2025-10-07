// src/hooks/usePaymentModes.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { schemePaymentSummary } from "@/service/SchemePaymentService";

export const useSchemePayment = () => {
    const { formattedStartDate, formattedEndDate } = useAppContext();
    const startDate = formattedStartDate;
    const endDate = formattedEndDate;

    return useQuery({
        queryKey: ["paymentModes", startDate, endDate],
        queryFn: () => schemePaymentSummary(startDate, endDate),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};
