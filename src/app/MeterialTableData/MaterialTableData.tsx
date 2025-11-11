"use client";
import React from "react";
import { useDashBoardContext } from "@/context/DashBoardContext";
import { Box, Typography, useTheme } from "@mui/material";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { formatNumber } from "@/lib/numberFormatter";

const MaterialSummaryTable: React.FC = () => {
    const theme = useTheme();
    const { materialSummary, loading, error } = useDashBoardContext();

    if (loading) return <TableSkeleton rows={4} columns={6} />;
    if (error) return <div>Error loading dashboard</div>;
    if (!materialSummary) return null;

    // Sort alphabetically by METALNAME
    const sortedData = [...materialSummary].sort((a, b) =>
        a.METALNAME.localeCompare(b.METALNAME)
    );

    const rows = sortedData.map((item) => ({
        material: item.METALNAME || "-",
        sales: formatNumber(item.SNETWT || 0, "3"),
        purchase: formatNumber(item.PGRSWT || 0, "3"),
        salesReturn: formatNumber(item.SRGRSWT || 0, "3"),
        stock: formatNumber(item.StkWT || 0, "3"),
        stone: formatNumber(item.StkStnWt || 0, "3"),
    }));

    const columns = [
        { id: "material", label: "Material", align: "center" as const },
        { id: "sales", label: "Sales(gm)", align: "right" as const },
        { id: "purchase", label: "Purchase(gm)", align: "right" as const },
        { id: "salesReturn", label: "Sales Return(gm)", align: "right" as const },
        { id: "stock", label: "Stock(gm)", align: "right" as const },
        { id: "stone", label: "Stone(gm)", align: "right" as const },
    ];

    return (
        <Box>
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
                Material Summary
            </Typography>

            <ResponsiveTable columns={columns} data={rows} stickyHeader />
        </Box>
    );
};

export default MaterialSummaryTable;
