import { getAllReports, getItems, getMetals, getRanges, getSizes, getSubItems, getCostIds } from "@/service/ReportService";
import { useQuery } from "@tanstack/react-query";

// 📁 useReport.ts
export const useAllReports = (params: any, enabled: boolean) => {
    return useQuery({
        queryKey: ["allReports", params], // 🔥 dynamic key
        queryFn: () => getAllReports(params),
        enabled, // 🔥 only run when View clicked
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 10,
    });
};


// ================= METAL =================
export const useMetals = () => {
    return useQuery({
        queryKey: ["metals"],
        queryFn: getMetals,
        staleTime: 1000 * 60 * 30,
    });
};

// ================= ITEM =================
export const useItems = () => {
    return useQuery({
        queryKey: ["items"],
        queryFn: getItems,
        staleTime: 1000 * 60 * 30,
    });
};

// ================= SUB ITEM =================
export const useSubItems = (itemId?: number) => {
    return useQuery({
        queryKey: ["subitems", itemId],
        queryFn: () => getSubItems(itemId),
        enabled: !!itemId, // 🔥 important
    });
};

// ================= SIZE =================
export const useSizes = (itemId?: number) => {
    return useQuery({
        queryKey: ["sizes", itemId],
        queryFn: () => getSizes(itemId),
        enabled: !!itemId,
    });
};

// ================= RANGE =================
export const useRanges = (params: {
    itemId?: number;
    subItemId?: number;
    page?: number;
    pageSize?: number;
}) => {
    return useQuery({
        queryKey: ["ranges", params],
        queryFn: () => getRanges(params),
    });
};


// ================= COST CENTRES =================

export const useCostCentre = () => {
    return useQuery({
        queryKey: ["costCentre"],
        queryFn: getCostIds,
        staleTime: 1000 * 60 * 30,
    });
};