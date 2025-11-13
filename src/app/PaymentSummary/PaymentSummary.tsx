"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { formatNumber } from "@/lib/numberFormatter";

interface PaymentSummaryProps {
    branchName?: string;
    data: any[] | { branchName: string; paymentSummary: any[] }[];
    loading: boolean;
    error: string | null;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
    branchName,
    data,
    loading,
    error,
}) => {
    const theme = useTheme();

    console.log("data", data)

    if (loading) return <TableSkeleton rows={5} columns={2} />;
    if (error)
        return (
            <Box sx={{ p: 3, textAlign: "center", color: theme.palette.error.main }}>
                <Typography variant="body1">Failed to load payment summary</Typography>
            </Box>
        );
    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    const renderTable = (tableData: any[], title?: string) => {
        if (!tableData || tableData.length === 0) return null;

        const rows = tableData.map((item: any) => ({
            mode: item.PAYMODE || "-",
            amount: Number(item.AMOUNT) || 0,
        }));


        const columns = [
            {
                id: "mode",
                label: "Payment Mode",
                align: "left" as const,
                render: (v: any) => <span>{v}</span>,
            },
            {
                id: "amount",
                label: "Amount (₹)",
                align: "right" as const,
                render: (v: number) => <span>₹ {formatNumber(v ?? 0, "2")}</span>,
            },
        ];

        return (
            <Box sx={{ mb: 3 }} key={title || Math.random()}>
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
                        {title} - Payment Summary
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
                        Payment Summary
                    </Typography>
                )
                }
                <ResponsiveTable columns={columns} data={rows} stickyHeader />
                
            </Box>
        );
    };

    if (
        Array.isArray(data) &&
        data[0]?.branchName &&
        (data[0]?.PaymentSummary || data[0]?.paymentSummary)
    ) {
        return (
            <>
                {data.map((branch: any) =>
                    renderTable(
                        branch.PaymentSummary || branch.paymentSummary,
                        branch.branchName
                    )
                )}
            </>
        );
    }

    return renderTable(data as any[], branchName);
};

export default PaymentSummary;
