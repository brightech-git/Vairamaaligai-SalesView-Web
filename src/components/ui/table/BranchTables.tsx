"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface BranchData<T> {
    branchName: string;
    data: T[];
}

interface BranchTablesProps<T> {
    branchName?: string;         // optional single branch
    data?: T[];                  // optional single branch data
    branchesData?: BranchData<T>[]; // optional multiple branches
    TableComponent: React.FC<{ data: T[]; branchName?: string }>; // your existing table component
}

const BranchTables = <T,>({
    branchName,
    data,
    branchesData,
    TableComponent,
}: BranchTablesProps<T>) => {
    const theme = useTheme();

    // Determine which branches to render
    const allBranches =
        branchesData && branchesData.length > 0
            ? branchesData
            : data && data.length > 0
                ? [{ branchName: branchName || "", data }]
                : [];

    if (allBranches.length === 0) return null;

    return (
        <>
            {allBranches.map((branch, idx) => (
                <Box key={idx} sx={{ mb: 3 }}>
                    <TableComponent data={branch.data} branchName={branch.branchName} />
                </Box>
            ))}
        </>
    );
};

export default BranchTables;
