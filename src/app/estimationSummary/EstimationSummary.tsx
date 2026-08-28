"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";

interface EstimationSummaryProps {
    branchName?: string; // Optional, for single branch title
    data: any[] | { branchName: string; estimationSummary: any[] }[]; // Accept flat or branch-wise
    loading: boolean;
    error: string | null;
}

const EstimationSummary: React.FC<EstimationSummaryProps> = ({
    branchName,
    data,
    loading,
    error,
}) => {
    const theme = useTheme();

    if (loading) return <TableSkeleton rows={3} columns={2} />;

    if (error)
        return (
            <Box sx={{ p: 3, textAlign: "center", color: theme.palette.error.main }}>
                <Typography variant="body1">Failed to load estimation summary</Typography>
            </Box>
        );

    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    // Function to render a single branch table
    const renderTable = (tableData: any[], title?: string) => {
        if (!tableData || tableData.length === 0) return null;

        const order = ["TOTAL", "BILLED", "NOT BILLED"];

        const summaryData = order.map((status) => {
            const item = tableData.find((e: any) => e.EST_STATUS === status);
            return {
                label:
                    status === "TOTAL"
                        ? "Total Estimate"
                        : status === "BILLED"
                            ? "Total Billed"
                            : status === "NOT BILLED"
                                ? "Total Pending"
                                : status,
                value: item?.EST_COUNT || 0,
            };
        });

        const columns = [
            {
                id: "label",
                label: "Metric",
                align: "left" as const,
                render: (value: string) => <span>{value}</span>,
            },
            {
                id: "value",
                label: "Count",
                align: "right" as const,
                render: (value: number) => <span>{value}</span>,
            },
        ];

        return (
            <Box sx={{ mt: 10, mb: 3 }} key={title || Math.random()}>
                {title && (
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 1,
                            textAlign: "center",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontFamily: "var(--font-merriweather)",

                        }}
                    >
                        {title} - Estimation Summary
                    </Typography>
                )}
                {!title && (
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 1,
                            textAlign: "center",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontFamily: "var(--font-merriweather)",
                            
                        }}
                    >
                         Estimation Summary
                    </Typography>
                )}

                <ResponsiveTable columns={columns} data={summaryData} stickyHeader />
            </Box>
        );
    };

    // Handle multi-branch case
    if (Array.isArray(data) && data[0]?.branchName && data[0]?.estimationSummary) {
        return (
            <>
                {data.map((branch: any) =>
                    renderTable(branch.estimationSummary, branch.branchName)
                )}
            </>
        );
    }

    // Handle single-branch flat array
    return renderTable(data as any[], branchName);
};

export default EstimationSummary;
