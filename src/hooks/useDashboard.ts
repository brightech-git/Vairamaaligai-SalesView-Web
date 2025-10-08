// src/hooks/useDashboard.ts
"use client";
export const dynamic = "force-dynamic";
import { useAppContext } from "@/context/AppContext";
import { useMaterialTableData } from "./useMaterialTableData";

export const useDashboard = (refetchIntervalMinutes = 10) => {
    const { formattedStartDate, formattedEndDate } = useAppContext();

    return useMaterialTableData({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        refetchIntervalMinutes,
    });
};
