"use client";

export const dynamic = "force-dynamic";
import React from "react";
import {
    Card,
    Box,
    Skeleton,
    Typography,
    useTheme,
} from "@mui/material";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { useEstimationSummary } from "@/hooks/useEstimationSummary";

const EstimationSummary = () => {
    const theme = useTheme();
    const { data, isLoading, error } = useEstimationSummary();

    // --- Loading State (Skeleton shimmer)
    if (isLoading) return <TableSkeleton rows={5} columns={2} />;
    // --- Error State
    if (error)
        return (
            <Card sx={{ p: 3, textAlign: "center" }}>
                <Typography color={theme.palette.error.main}>
                    Failed to load estimation summary
                </Typography>
            </Card>
        );

    // --- Data mapping
    const summaryData = [
        { label: "Total Estimate", value: data?.TotalEstimate ?? 0 },
        { label: "Total Pending", value: data?.TotalPending ?? 0 },
        { label: "Total Billed", value: data?.TotalBilled ?? 0 },
    ];

    // --- Columns for ResponsiveTable
    const columns = [
        {
            id: "label",
            label: "Metric",
            align: "center" as const,
            render: (value: string) => (
                <span>
                    {value}
                </span>
            ),
        },
        {
            id: "value",
            label: "Count",
            align: "center" as const,
            render: (value: number) => (
                <span>
                    {value}
                </span>
            ),
        },
    ];

    return (
        <Box>
          
         
            <Typography variant="h6" sx={{
                mb: 1, textAlign: 'center ', fontWeight: 600, fontFamily: 'var(--font-merriweather)',
                fontSize: { xs: '1.25rem', sm: '1.25rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem' }
}}>
                                Estimation Summary
                             </Typography>
                         
                <ResponsiveTable columns={columns} data={summaryData} stickyHeader />
      
        </Box>
    );
};

export default EstimationSummary;
