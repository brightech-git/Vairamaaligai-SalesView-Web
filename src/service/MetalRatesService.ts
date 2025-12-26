// services/MetalRatesService.ts
"use client"
import adminInstance from "@/api/adminInstance";// adjust the path

export interface MetalRates {
    SILVERRATE: number;

    GOLDRATE: number;
}

const MetalRatesService = {
    getRates: async (): Promise<MetalRates> => {
        try {
            const response = await adminInstance.get('/rates');
            console.log("API Response:", response.data);
           return response.data;
        
        } catch (error) {
            console.error("Error fetching metal rates:", error);
            return {
                SILVERRATE: 0,
                GOLDRATE: 0,
            }; // fallback in case of error
        }
    },
};

export default MetalRatesService;
