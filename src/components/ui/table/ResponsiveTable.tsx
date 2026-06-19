"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/context/ThemeContext";
import { useMediaQuery, useTheme } from "@mui/material";
import TableSkeleton from "./TableSkeleton";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

// ---------------- TYPES ----------------
interface Column {
    id: string;
    label: string;
    align?: "left" | "right" | "center";
    render?: (value: any, row: any) => React.ReactNode;
}

interface SubColumn extends Column {
    parentColumnId?: string;
}

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

interface ResponsiveTableProps {
    columns: Column[];
    subColumns?: SubColumn[];
    data: any[];
    className?: string;
    stickyHeader?: boolean;
    pagination?: PaginationProps;
    loading?: boolean;
}

// ---------------- COMPONENT ----------------
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
    columns,
    subColumns = [],
    data,
    className,
    stickyHeader = false,
    loading = false,
    pagination,
}) => {
    const { mode } = useThemeContext();
    const theme = useTheme();
    const isCompact = useMediaQuery("(max-width:600px)");

    const tableTheme = createTheme({
        palette: { mode },
    });

    // ---------------- PARENT GROUP ----------------
    const grouped = columns.map((col) => ({
        ...col,
        children: subColumns.filter((s) => s.parentColumnId === col.id),
    }));

    // ---------------- ORPHAN SUBCOLUMNS ----------------
    const orphanSubs = subColumns.filter(
        (s) => !s.parentColumnId || !columns.some((c) => c.id === s.parentColumnId)
    );

    // ---------------- FLAT COLUMNS (BODY) ----------------
    const flatColumns = React.useMemo(() => {
        return [
            ...grouped.flatMap((c) => (c.children.length ? c.children : [c])),
            ...orphanSubs,
        ];
    }, [grouped, orphanSubs]);

    const headerStyle = {
        background: theme.palette.primary.main,
        color: theme.palette.text.secondary,
        fontWeight: 600,
        fontSize: isCompact ? 11 : 13,
        padding: isCompact ? "4px" : "6px 8px",
        whiteSpace: "nowrap",
    };

    const bodyStyle = {
        fontSize: isCompact ? 11 : 12.5,
        padding: isCompact ? "4px" : "6px 8px",
        whiteSpace: "nowrap",
    };

    const getAlign = (value: any, col: Column) => {
        if (col.align) return col.align;
        return typeof value === "number" ? "right" : "left";
    };

    if (loading) return <TableSkeleton />;

    return (
        <MuiThemeProvider theme={tableTheme}>
            <TableContainer
                component={Paper}
                className={cn("shadow-sm border", className)}
                sx={{ maxHeight: stickyHeader ? "calc(100vh - 250px)" : "auto" }}
            >
                <Table stickyHeader={stickyHeader} size="small">

                    {/* ================= HEADER 1 ================= */}
                    <TableHead>
                        <TableRow>
                            {grouped.map((col) => (
                                <TableCell
                                    key={col.id}
                                    align="center"
                                    colSpan={col.children.length > 0 ? col.children.length : 1}
                                    rowSpan={col.children.length > 0 ? 1 : 2}
                                    sx={headerStyle}
                                >
                                    {col.label}
                                </TableCell>
                            ))}

                            {/* orphan columns go directly to header */}
                            {orphanSubs.map((sub) => (
                                <TableCell
                                    key={sub.id}
                                    rowSpan={2}
                                    align="center"
                                    sx={headerStyle}
                                >
                                    {sub.label}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* ================= HEADER 2 ================= */}
                        {grouped.some((c) => c.children.length > 0) && (
                            <TableRow>
                                {grouped.flatMap((col) =>
                                    col.children.map((child) => (
                                        <TableCell
                                            key={child.id}
                                            align="center"
                                            sx={{
                                                ...headerStyle,
                                                fontSize: isCompact ? 10 : 12,
                                            }}
                                        >
                                            {child.label}
                                        </TableCell>
                                    ))
                                )}
                            </TableRow>
                        )}
                    </TableHead>

                    {/* ================= BODY ================= */}
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, i) => (
                                <TableRow key={i} hover>
                                    {flatColumns.map((col) => {
                                        const value = row[col.id];

                                        return (
                                            <TableCell
                                                key={col.id}
                                                align={getAlign(value, col)}
                                                sx={bodyStyle}
                                            >
                                                {col.render
                                                    ? col.render(value, row)
                                                    : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={flatColumns.length}
                                    align="center"
                                    sx={{ py: 4 }}
                                >
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                    {/* ================= PAGINATION ================= */}
                    {pagination && (
                        <TableFooter>
                            <TableRow >
                                <TablePagination
                                    rowsPerPageOptions={
                                        pagination.pageSizeOptions ?? [5, 10, 25, 50]
                                    }
                                    count={pagination.total}
                                    rowsPerPage={pagination.pageSize}
                                    page={pagination.page}
                                    onPageChange={(_, p) =>
                                        pagination.onPageChange(p)
                                    }
                                    onRowsPerPageChange={(e) =>
                                        pagination.onPageSizeChange(
                                            parseInt(e.target.value, 10)
                                        )
                                    }
                                    sx={{ borderBottom: "none" }}
                                
                                />
                            </TableRow>
                        </TableFooter>
                    )}

                </Table>
            </TableContainer>
        </MuiThemeProvider>
    );
};

export default ResponsiveTable;