"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { getBillCancelledIssues, BillCancel } from "@/service/BillCancelService";

interface UseBillCancelledProps {
    startDate: string; // formatted as yyyy-MM-dd
    endDate: string;
}

export const useBillCancelled = ({ startDate, endDate }: UseBillCancelledProps) => {
    const [data, setData] = useState<BillCancel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!startDate || !endDate) return;

            try {
                setLoading(true);
                setError(null);

                const result = await getBillCancelledIssues(startDate, endDate);
                setData(result);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate]);

    return { data, loading, error };
};
