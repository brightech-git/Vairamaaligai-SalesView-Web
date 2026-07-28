"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { formatNumber } from "@/lib/numberFormatter";

interface SchemePaymentProps {
    branchName?: string; // Optional, for single branch title
    data: any[] | { branchName: string; schemePayment: any[] }[]; // Accept flat or branch-wise
    loading: boolean;
    error: string | null;
}

const SchemePayment: React.FC<SchemePaymentProps> = ({
    branchName,
    data,
    loading,
    error,
}) => {
    const theme = useTheme();

    if (loading) return <TableSkeleton rows={5} columns={2} />;

    if (error)
        return (
            <Box sx={{ p: 3, textAlign: "center", color: theme.palette.error.main }}>
                <Typography variant="body1">Failed to load Chit Collection</Typography>
            </Box>
        );

    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    // Helper: render one branch table
    const renderTable = (tableData: any[], title?: string) => {
        if (!tableData || tableData.length === 0) return null;

        const rows = tableData.map((item: any) => ({
            paymode: item.CHITMODEPAY || "-",
            amount: Number(item.CHITAMOUNT) || 0,
        }));

        const total = rows.reduce((sum, r) => sum + r.amount, 0);

        const columns = [
            {
                id: "paymode",
                label: "Payment Mode",
                align: "left" as const,
                render: (value: string) => <span>{value}</span>,
            },
            {
                id: "amount",
                label: "Amount (₹)",
                align: "right" as const,
                render: (value: number) => <span>₹ {formatNumber(value, "2")}</span>,
            },
        ];

        return (
            <Box sx={{ mt: 3 }} key={title}>
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
                        {title} - Chit Collection
                    </Typography>
                )}
                 {!title &&(
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
                                            Chit Collection
                                    </Typography>
                                )
                                }
                <ResponsiveTable columns={columns} data={rows} stickyHeader />
              
            </Box>
        );
    };

    // Handle multiple branches
    if (Array.isArray(data) && data[0]?.branchName &&( data[0]?.SchemePayment || data[0]?.schemePayment[0])) {
        return (
            <>
                {data.map((branch: any) =>
                    renderTable(branch.SchemePayment || branch.schemePayment, branch.branchName)
                )}
            </>
        );
    }

    // Handle single flat dataset
    return renderTable(data as any[], branchName);
};

export default SchemePayment;
