"use client";


import { useQuery } from "@tanstack/react-query";
import {
    getTotalSalesWeight,
    getTotalOldGoldPurchaseWeight,
    getTotalStock,
    getStoneSummary,
    TotalSalesWeight,
    TotalOldGoldPurchaseWeight,
    StoneSummary,
}from "@/service/getMaterialTableData";

export interface DashboardData {
    totalSalesWeight: TotalSalesWeight[];
    totalOldGoldPurchaseWeight: TotalOldGoldPurchaseWeight[];
    totalStock: number;
    stoneSummary: StoneSummary[];
}

interface UseDashboardDataProps {
    startDate: string;
    endDate: string;
    refetchIntervalMinutes?: number; // optional refetch interval
}

export const useMaterialTableData = ({
    startDate,
    endDate,
    refetchIntervalMinutes = 10,
}: UseDashboardDataProps) => {
    return useQuery<DashboardData>({
        queryKey: ["dashboardData", startDate, endDate], // key includes dates for automatic refetch
        queryFn: async () => {
            const [totalSalesWeight, totalOldGoldPurchaseWeight, totalStock, stoneSummary] =
                await Promise.all([
                    getTotalSalesWeight(startDate, endDate),
                    getTotalOldGoldPurchaseWeight(startDate, endDate),
                    getTotalStock(),
                    getStoneSummary(startDate, endDate),
                ]);

            return {
                totalSalesWeight,
                totalOldGoldPurchaseWeight,
                totalStock,
                stoneSummary,
            };
        },
        staleTime: 1000 * 60 * 5, // 5 mins before considered stale
        refetchInterval: refetchIntervalMinutes * 60 * 1000, // auto refetch every X minutes
        refetchOnWindowFocus: true, // optional, refetch when window refocus
    });
};
