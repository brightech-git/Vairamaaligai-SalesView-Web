"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";

interface BillCancelledPageProps {
    branchName?: string;
    data: any[] | { branchName: string; cancelledBills: any[] }[]; // Accept flat or branch-wise
    loading: boolean;
    error: string | null;
}

const BillCancelledPage: React.FC<BillCancelledPageProps> = ({
    branchName,
    data,
    loading,
    error,
}) => {
    const theme = useTheme();
    const columns = [
        { id: "TRANNO", label: "Tran No", align: "center" as const },
        { id: "TRANDATE", label: "Tran Date", align: "left" as const },
        { id: "USERNAME", label: "User Name", align: "left" as const },
        {
            id: "NETWT",
            label: "Net Weight (g)",
            align: "right" as const,
            render: (value: any) =>
                typeof value === "number" ? value.toFixed(3) : value,
            maxWidth: 120,
        },
        {
            id: "AMOUNT",
            label: "Amount (₹)",
            align: "right" as const,
            render: (value: any) =>
                typeof value === "number"
                    ? value.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                    : value,
            maxWidth: 140,
        },
    ];

    if (loading) return <TableSkeleton rows={5} columns={5} />;

    if (error)
        return (
            <Box sx={{ p: 3, textAlign: "center", color: theme.palette.error.main }}>
                <Typography variant="body1">
                    Error loading cancelled bills: {error}
                </Typography>
            </Box>
        );

    if (!data || (Array.isArray(data) && data.length === 0))
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                    textAlign: "center",
                }}
            >
                <Box sx={{ fontSize: "3rem", mb: 0, opacity: 0.8 }}>📋</Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontFamily: "var(--font-merriweather)",
                        mb: 0.5,
                    }}
                >
                    {branchName ? `${branchName} - ` : ""}No Cancelled Bills
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.primary,
                        fontFamily: "var(--font-funnel)",
                        mb: 0.5,
                        maxWidth: 300,
                        lineHeight: 1.5,
                    }}
                >
                    No cancelled bills found for the current filters.
                </Typography>
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "1.1rem" }}>🔄</Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            fontFamily: "var(--font-funnel)",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}
                    >
                        Try adjusting filters
                    </Typography>
                </Box>
            </Box>
        );

    // Helper function to render one branch’s table
    const renderTable = (tableData: any[], title?: string) => {
        if (!tableData || tableData.length === 0) return null;

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
                            fontFamily: "var(--font-satisfy)",
                            fontSize: { xs: "1.25rem", sm: "1.25rem" },
                        }}
                    >
                        {title} - Cancelled Bills
                    </Typography>
                )}

                <ResponsiveTable columns={columns} data={tableData} stickyHeader />
            </Box>
        );
    };

    // Handle multiple branches
    if (Array.isArray(data) && data[0]?.branchName && data[0]?.cancelledBills || data[0]?.CancelledBills ) {
        return (
            <>
                {data.map((branch: any) =>
                    renderTable(branch.cancelledBills || branch.CancelledBills, branch.branchName)
                )}
            </>
        );
    }

    // Handle single branch
    return renderTable(data as any[], branchName);
};

export default BillCancelledPage;
