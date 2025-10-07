// src/service/DashboardService.ts
import adminInstance from "@/api/adminInstance";

// — Types for each API response —
export interface TotalSalesWeight {
    TotalSales_Grswt: number;
    TotalSales_Netwt: number;
    MetalCategory: string;
    Metal_ID: string;
}

export interface TotalOldGoldPurchaseWeight {
    Metal_ID: string;
    TotalPurchase_Grswt: number;
}

export interface StoneSummary {
    stnwt: number;
    stoneUnit: string;
    stnpcs: number;
    stnamt: number;
}

// — Service functions —

export const getTotalSalesWeight = async (
    startDate: string,
    endDate: string
): Promise<TotalSalesWeight[]> => {
    const response = await adminInstance.get<TotalSalesWeight[]>("/totalSalesWeight", {
        params: { startDate, endDate },
    });
    return response.data;
};

export const getTotalOldGoldPurchaseWeight = async (
    startDate: string,
    endDate: string
): Promise<TotalOldGoldPurchaseWeight[]> => {
    const response = await adminInstance.get<TotalOldGoldPurchaseWeight[]>("/totalOldGoldPurchaseWeight", {
        params: { startDate, endDate },
    });
    return response.data;
};

export const getTotalStock = async (): Promise<number> => {
    const response = await adminInstance.get<number>("/totalStock");
    return response.data;
};

export const getStoneSummary = async (
    startDate: string,
    endDate: string
): Promise<StoneSummary[]> => {
    const response = await adminInstance.get<StoneSummary[]>("/stoneSummary", {
        params: { startDate, endDate },
    });
    return response.data;
};
