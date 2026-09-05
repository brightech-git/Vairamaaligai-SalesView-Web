// src/services/dashboardService.ts
import adminInstance from "@/api/adminInstance";

export const dashBoardContent = async (filters: {
    fromDate: string;
    toDate: string;
}) => {


    try {
        const response = await adminInstance.get("dashboardNew", {
            params: filters,
        });
        return response.data;
    } catch (error) {
        console.error("❌ Dashboard API Error:", error);
        throw error;
    }
};
