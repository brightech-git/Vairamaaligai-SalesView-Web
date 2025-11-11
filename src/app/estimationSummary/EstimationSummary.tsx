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
import { useDashBoardContext } from "@/context/DashBoardContext";

const EstimationSummary = () => {
    const theme = useTheme();
    const {estimationSummary ,loading ,error} =useDashBoardContext();

    console.log(estimationSummary,'EstimationSummary')

    // --- Loading State (Skeleton shimmer)
    if (loading) return <TableSkeleton rows={5} columns={2} />;
    // --- Error State
    if (error)
        return (
            <Card sx={{ p: 3, textAlign: "center" }}>
                <Typography color={theme.palette.error.main}>
                    Failed to load estimation summary
                </Typography>
            </Card>
        );

   

    const order = ["TOTAL", "BILLED", "NOT BILLED"];

    const summaryData = order.map((status) => {
        const item = estimationSummary?.find((e: any) => e.EST_STATUS === status);
        return {
            label:
                status === "TOTAL" ? "Total Estimate" :
                    status === "BILLED" ? "Total Billed" :
                        status === "NOT BILLED" ? "Total Pending" : status,
            value: item?.EST_COUNT || 0,
        };
    });


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
