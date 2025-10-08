// src/services/paymentModeService.ts
"use client"
import adminInstance from "@/api/adminInstance";

export const schemePaymentSummary = async (startDate: string, endDate: string) => {
    const response = await adminInstance.get('/paymentSummary', {
        params: { startDate, endDate },
    });
    console.log("Scheme Payment Response:", response.data);
    return response.data;

    console
};
