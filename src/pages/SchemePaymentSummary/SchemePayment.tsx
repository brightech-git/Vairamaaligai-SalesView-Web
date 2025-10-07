"use client";

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
import { useSchemePayment } from "@/hooks/useSchemePaymentSummary";
import { formatNumber } from "@/lib/numberFormatter";

const SchemePayment = () => {
    const theme = useTheme();
    const { data, isLoading, error } = useSchemePayment();

    // --- Loading State
    if (isLoading) return <TableSkeleton rows={5} columns={2} />;;

    // --- Error State
    if (error)
        return (
            <Card sx={{ p: 3, textAlign: "center" }}>
                <Typography color={theme.palette.error.main}>
                    Failed to load payment modes
                </Typography>
            </Card>
        );

    // --- Prepare data
   

    const tableData =
        data?.map((item: any) => ({
            paymode: item.paymode,
            amount: item.amount,
        })) || [];

    
    // --- Columns
    const columns = [
        {
            id: "paymode",
            label: "Payment Mode",
            align: "left" as const,
            render: (value: string, row: any) => (
                <span >
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
                fontSize: { xs: '1.25rem', sm: '1.25rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem' }
}}>
                       Scheme Payments
                    </Typography>
           
                <ResponsiveTable columns={columns} data={tableData} stickyHeader />
       
        </Box>
    );
};

export default SchemePayment;
