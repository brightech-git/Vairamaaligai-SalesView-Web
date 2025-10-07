"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { format, subDays } from "date-fns";
import MetalRatesService, { MetalRates as ApiMetalRates } from "@/service/MetalRatesService";

interface DateRange {
    startDate: Date;
    endDate: Date;
}

interface MetalRates {
    G: number; // Gold
    S: number; // Silver
    P: number; // Platinum
}

interface AppContextType {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
    metalRates: MetalRates;
    setMetalRates: (rates: MetalRates) => void;
    selectedChip: string;
    setSelectedChip: (chip: string) => void;
    fetchDataWithDates: (start: Date, end: Date) => void;

    /** 🆕 formatted values for API usage */
    formattedStartDate: string;
    formattedEndDate: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);

    // Return a default context during SSR instead of throwing
    if (!context && typeof window === 'undefined') {
        return {
            dateRange: { startDate: new Date(), endDate: new Date() },
            setDateRange: () => { },
            metalRates: { G: 0, S: 0, P: 0 },
            setMetalRates: () => { },
            selectedChip: "last7days",
            setSelectedChip: () => { },
            fetchDataWithDates: () => { },
            formattedStartDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
            formattedEndDate: format(new Date(), "yyyy-MM-dd"),
        } as AppContextType;
    }

    if (!context) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: subDays(new Date(), 7),
        endDate: new Date(),
    });

    const [metalRates, setMetalRates] = useState<MetalRates>({
        G: 0,
        S: 0,
        P: 0,
    });

    const [selectedChip, setSelectedChip] = useState<string>("last7days");

    // ✅ Fetch metal rates from API
    const fetchMetalRates = async () => {
        try {
            const data: ApiMetalRates = await MetalRatesService.getRates();
            setMetalRates({
                G: data.GOLDRATE,
                S: data.SILVERRATE,
                P: data.PATTINUMRATE,
            });
        } catch (error) {
            console.error("Failed to fetch metal rates:", error);
            setMetalRates({
                G: 0,
                S: 0,
                P: 0,
            });
        }
    };

    const fetchDataWithDates = async (start: Date, end: Date) => {
        try {
            const formattedStart = format(start, "yyyy-MM-dd");
            const formattedEnd = format(end, "yyyy-MM-dd");
            console.log("Fetching data for:", formattedStart, formattedEnd);

            setDateRange({ startDate: start, endDate: end });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // ✅ Fetch metal rates once on mount
    useEffect(() => {
        fetchMetalRates();
        fetchDataWithDates(dateRange.startDate, dateRange.endDate);
    }, []);

    // Memoized formatted dates
    const formattedStartDate = useMemo(() => format(dateRange.startDate, "yyyy-MM-dd"), [dateRange.startDate]);
    const formattedEndDate = useMemo(() => format(dateRange.endDate, "yyyy-MM-dd"), [dateRange.endDate]);

    const value: AppContextType = {
        dateRange,
        setDateRange,
        metalRates,
        setMetalRates,
        selectedChip,
        setSelectedChip,
        fetchDataWithDates,
        formattedStartDate,
        formattedEndDate,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
