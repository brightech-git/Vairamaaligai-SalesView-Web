"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { formatNumber } from "@/lib/numberFormatter";
import type { MaterialGroupBy } from "@/context/DashBoardContext";
import { useDashBoardContext } from "@/context/DashBoardContext";

interface MaterialSummaryTableProps {
    branchName?: string;      // Optional, for single branch title
    data: any[] | { branchName: string; materialSummary: any[] }[]; // Either flat array or branch-wise
    loading: boolean;
    error: string | null;
}

const MaterialSummaryTable: React.FC<MaterialSummaryTableProps> = ({
    branchName,
    data,
    loading,
    error,
}) => {
    const theme = useTheme();

    const { filters } = useDashBoardContext();
    

    if (loading) return <TableSkeleton rows={4} columns={6} />;
    if (error) return <div>Error loading dashboard</div>;
    if (!data || data.length === 0) return null;

    const groupField = filters.type === "category" ? "CATNAME" : "METALNAME";
    const groupLabel = filters.type === "category" ? "Category" : "Material";

    // Helper function to render a single table
    const renderTable = (tableData: any[], title?: string) => {
        if (!tableData || tableData.length === 0) return null;

        const sortedData = [...tableData]; // optionally sort by METALNAME
        const rows = sortedData.map((item) => ({
            material: item[groupField] || "-",
            sales: formatNumber(item.SNETWT || 0, "3"),
            purchase: formatNumber(item.PGRSWT || 0, "3"),
            salesReturn: formatNumber(item.SRGRSWT || 0, "3"),
            stock: formatNumber(item.StkWT || 0, "3"),
            stone: formatNumber(item.StkStnWt || 0, "3"),
        }));

        const columns = [
            { id: "material", label: groupLabel, align: "left" as const },
            { id: "sales", label: "Sales(gm)", align: "right" as const },
            { id: "purchase", label: "Purchase(gm)", align: "right" as const },
            { id: "salesReturn", label: "Sales Return(gm)", align: "right" as const },
            { id: "stock", label: "Stock(gm)", align: "right" as const },
            { id: "stone", label: "Stone(gm)", align: "right" as const },
        ];

        return (
            <Box sx={{ mt:10, mb: 3 }} key={title || Math.random()}>
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
                        {title} - {groupLabel} Summary
                    </Typography>
                )}
                <ResponsiveTable columns={columns} data={rows} stickyHeader />
            </Box>
        );
    };

    // If data is branch-wise array of objects
    if (Array.isArray(data) && data[0]?.branchName && data[0]?.materialSummary) {
        return (
            <>
                {data.map((branch: any) =>
                    renderTable(branch.materialSummary, branch.branchName)
                )}
            </>
        );
    }

    // Otherwise assume it's a flat array
    return renderTable(data, branchName);
};

export default MaterialSummaryTable;
