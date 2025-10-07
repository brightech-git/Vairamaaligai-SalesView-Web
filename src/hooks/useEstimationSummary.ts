// src/hooks/useEstimationSummary.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { fetchEstimationSummary } from "@/service/estimationSummaryService";

export const useEstimationSummary = () => {
    const { formattedStartDate, formattedEndDate } = useAppContext();
    const startDate = formattedStartDate;
    const endDate = formattedEndDate;
    
    return useQuery({
        queryKey: ["estimationSummary", startDate, endDate],
        queryFn: () => fetchEstimationSummary(startDate, endDate),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};
