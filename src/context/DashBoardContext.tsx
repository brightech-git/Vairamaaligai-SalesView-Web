"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
    ReactNode,
} from "react";
import { dashBoardContent } from "@/service/DashBoardService";

type DashboardFilters = {
    fromDate: string;
    toDate: string;
    costId?: string;
    adminDB?: string;
    transDB?: string;
    schemeDB?: string;
};

type DashBoardContextType = {
    filters: DashboardFilters;
    materialSummary: any[];
    schemePayment: any[];
    paymentSummary: any[];
    estimationSummary: any[];
    loading: boolean;
    error: string | null;
    setFilters: React.Dispatch<React.SetStateAction<DashboardFilters>>;
    refresh: () => void;
};

const DashBoardContext = createContext<DashBoardContextType | undefined>(
    undefined
);

export const useDashBoardContext = () => {
    const context = useContext(DashBoardContext);
    if (!context) {
        throw new Error("useDashBoardContext must be used within a DashBoardProvider");
    }
    return context;
};

export const DashBoardProvider = ({ children }: { children: ReactNode }) => {
    const [filters, setFilters] = useState<DashboardFilters>({
        fromDate: "",
        toDate: "",
        costId: "",
        adminDB: "VAIADMINDB",
        transDB: "VAIT2627",
        schemeDB: "VAISH0708",
    });

    const [materialSummary, setMaterialSummary] = useState<any[]>([]);
    const [schemePayment, setSchemePayment] = useState<any[]>([]);
    const [paymentSummary, setPaymentSummary] = useState<any[]>([]);
    const [estimationSummary, setEstimationSummary] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = async () => {
        if (!filters.fromDate || !filters.toDate) return; // wait until valid date
        try {
            setLoading(true);
            setError(null);
            const res = await dashBoardContent(filters);

            // Set separate states
            setMaterialSummary(res.resultSets?.[0] || []);
            setSchemePayment(res.resultSets?.[1] || []);
            setPaymentSummary(res.resultSets?.[2] || []);
            setEstimationSummary(res.resultSets?.[3] || []);
        } catch (err: any) {
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, [filters]);

    const value = useMemo(
        () => ({
            filters,
            materialSummary,
            schemePayment,
            paymentSummary,
            estimationSummary,
            loading,
            error,
            setFilters,
            refresh: fetchDashboard,
        }),
        [filters, materialSummary, schemePayment, paymentSummary, estimationSummary, loading, error]
    );

    return (
        <DashBoardContext.Provider value={value}>
            {children}
        </DashBoardContext.Provider>
    );
};
