// src/services/estimationSummaryService.ts
"use client"
import adminInstance from "@/api/adminInstance";


export const fetchEstimationSummary = async (startDate: string, endDate: string) => {
    const response = await adminInstance.get('summary', {
        params: { startDate, endDate },
    });


    return response.data;
};
