"use client";

export const dynamic = "force-dynamic";
import React from "react";
import { Card, Box, Typography, useTheme } from "@mui/material";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { usePaymentSummary } from "@/hooks/usePaymentSummary";
import { formatNumber } from "@/lib/numberFormatter";

const PaymentSummary = () => {
    const theme = useTheme();
    const { data, isLoading, error } = usePaymentSummary();

    if (isLoading) return <TableSkeleton rows={5} columns={2} />;

    if (error)
        return (
            <Card sx={{ p: 3, textAlign: "center", color: theme.palette.error.main }}>
                <Typography variant="body1">Failed to load payment summary</Typography>
            </Card>
        );

    // ... rest of your actual data processing and table rendering
    const rows = [
        { mode: "Cash", amount: data?.cash || 0 },
        { mode: "Credit/Debit Card", amount: data?.creditCardBill || 0 },
        { mode: "Cheque / UPI", amount: data?.chequeAndUPI || 0 },
        { mode: "Scheme Adjustment", amount: data?.schemeAdjustment || 0 },
    ];

    const total = rows.reduce((sum, r) => sum + r.amount, 0);

    const tableData = [
        ...rows,
        { mode: "Total", amount: total, isTotal: true },
    ];

    const columns = [
        {
            id: "mode",
            label: "Payment Mode",
            align: "left" as const,
            render: (value: any, row: any) => (
                <span>
                    {value}
                </span>
            ),
        },
        {
            id: "amount",
            label: "Amount (₹)",
            align: "right" as const,
            render: (value: number, row: any) => (
                <span>
                    ₹ {formatNumber(value, "2")}
                </span>
            ),
        },
    ];

    return (
        <Box>
            <Typography variant="h6" sx={{
                mb: 1, textAlign: 'center ', fontWeight: 600, color: theme.palette.text.primary, fontFamily: 'var(--font-merriweather)',
                fontSize: { xs: '1.25rem', sm: '1.25rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem' } }}>
                                    Payment Summary
                                </Typography>
            <ResponsiveTable columns={columns} data={tableData} stickyHeader />
        </Box>
    );
};

export default PaymentSummary;