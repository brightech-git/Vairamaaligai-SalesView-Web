"use client";
export const dynamic = "force-dynamic";

import React, { useMemo, useState } from "react";
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
import Checkbox from "@mui/material/Checkbox";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Column {
    id: string;
    label: string;
    align?: "left" | "right" | "center";
    render?: (value: any, row: any) => React.ReactNode;
}

/**
 * SubColumn parentColumnId rules:
 *  - undefined | null  → ORPHAN  (rowSpan=2, appended after all parent columns)
 *  - "ALL"             → appears under EVERY parent column header
 *  - "<someId>"        → belongs to that specific parent column
 */
export interface SubColumn {
    id: string;
    label: string;
    align?: "left" | "right" | "center";
    parentColumnId?: string | null;
    render?: (value: any, row: any) => React.ReactNode;
}

export interface SelectionConfig<T> {
    enabled: boolean;
    selectedRowIds?: (string | number)[];
    onSelectionChange?: (selectedIds: (string | number)[], selectedRows: T[]) => void;
    selectableKey?: keyof T;
    selectionColumnWidth?: string | number;
    showSelectAll?: boolean;
}

export interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export interface ResponsiveTableProps<T extends Record<string, any>> {
    columns: Column[];
    subColumns?: SubColumn[];
    data: T[];
    renderRow: (row: T, index: number, isSelected: boolean, bodyColumns: (Column | SubColumn)[]) => React.ReactNode;
    renderTotalRow?: (data: T[], bodyColumns: (Column | SubColumn)[]) => React.ReactNode;
    rowIdKey?: keyof T;
    highlightRowId?: string | number | null;
    selection?: SelectionConfig<T>;
    pagination?: PaginationProps;
    className?: string;
    stickyHeader?: boolean;
    loading?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE — mirrors ReportExport GROUP_PALETTES exactly
// Index 0 = first cost-center group (col index 3–6), etc.
// Lead columns (index < 3) return null → falls back to theme primary
// ─────────────────────────────────────────────────────────────────────────────

interface GroupPalette {
    header: string;     
    subHeader: string;  
    dataTint: string;   
    foot: string;       
}

export const GROUP_PALETTES: GroupPalette[] = [
    // Blue  — HEAD OFFICE
    { header: "rgb(66,165,245)", subHeader: "rgb(26,125,205)", dataTint: "rgb(232,244,253)", foot: "rgb(66,165,245)" },
    // Green — JN ROAD
    { header: "rgb(102,187,106)", subHeader: "rgb(62,147,66)", dataTint: "rgb(232,245,233)", foot: "rgb(102,187,106)" },
    // Orange — THIRUTTANI
    { header: "rgb(255,167,38)", subHeader: "rgb(215,127,0)", dataTint: "rgb(255,248,225)", foot: "rgb(255,167,38)" },
    // Purple — THIRUVALLUR
    { header: "rgb(171,71,188)", subHeader: "rgb(131,31,148)", dataTint: "rgb(243,229,245)", foot: "rgb(171,71,188)" },
];

/** Returns palette for a given flat column index (3-based for cost-center cols), or null for lead cols */
function paletteFor(colIndex: number): GroupPalette | null {
    if (colIndex < 3) return null;
    const gi = Math.floor((colIndex - 3) / 4);
    return GROUP_PALETTES[gi % GROUP_PALETTES.length] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function ResponsiveTable<T extends Record<string, any>>({
    columns,
    subColumns = [],
    data,
    renderRow,
    renderTotalRow,
    rowIdKey,
    highlightRowId = null,
    selection,
    pagination,
    className,
    stickyHeader = false,
    loading = false,
}: ResponsiveTableProps<T>) {
    const { mode } = useThemeContext();
    const theme = useTheme();
    const isCompact = useMediaQuery("(max-width:600px)");

    const tableTheme = createTheme({ palette: { mode } });

    // ── Selection state ──────────────────────────────────────────────────────
    const [internalSelectedIds, setInternalSelectedIds] = useState<(string | number)[]>([]);
    const isSelectionEnabled = selection?.enabled ?? false;
    const selectableKey = (selection?.selectableKey ?? rowIdKey ?? "id") as keyof T;
    const selectedIds = selection?.selectedRowIds ?? internalSelectedIds;

    const allRowIds = useMemo(() => data.map((row) => String(row[selectableKey])), [data, selectableKey]);
    const isAllSelected = allRowIds.length > 0 && selectedIds.length === allRowIds.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < allRowIds.length;

    const handleSelectionChange = (rowId: string | number, checked: boolean) => {
        const newIds = checked
            ? [...selectedIds, rowId]
            : selectedIds.filter((id) => String(id) !== String(rowId));
        if (!selection?.selectedRowIds) setInternalSelectedIds(newIds);
        if (selection?.onSelectionChange) {
            const rows = data.filter((r) => newIds.includes(String(r[selectableKey])));
            selection.onSelectionChange(newIds, rows);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        const newIds = checked ? allRowIds : [];
        if (!selection?.selectedRowIds) setInternalSelectedIds(newIds);
        selection?.onSelectionChange?.(newIds, checked ? data : []);
    };

    // ── Sub-column resolution ────────────────────────────────────────────────
    const getChildrenForParent = (colId: string): SubColumn[] =>
        subColumns.filter((s) => s.parentColumnId === colId || s.parentColumnId === "ALL");

    const orphanSubs: SubColumn[] = subColumns.filter(
        (s) => !s.parentColumnId || s.parentColumnId === null
    );

    const grouped = useMemo(
        () => columns.map((col) => ({ ...col, children: getChildrenForParent(col.id) })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [columns, subColumns]
    );

    const hasSubColumns = grouped.some((c) => c.children.length > 0) || orphanSubs.length > 0;

    const bodyColumns: (Column | SubColumn)[] = useMemo(() => {
        const cols: (Column | SubColumn)[] = [];
        grouped.forEach((col) => {
            if (col.children.length > 0) cols.push(...col.children);
            else cols.push(col);
        });
        cols.push(...orphanSubs);
        return cols;
    }, [grouped, orphanSubs]);

    // ── Base styles ──────────────────────────────────────────────────────────
    const ROW1_HEIGHT = isCompact ? 28 : 35;

    const baseHeaderStyle: React.CSSProperties = {
        color: "#fff",
        fontWeight: 600,
        fontSize: isCompact ? 10 : 12,
        padding: isCompact ? "4px" : "6px 8px",
        whiteSpace: "nowrap",
        textAlign: "center",
    };

    const baseSubHeaderStyle: React.CSSProperties = {
        color: "#fff",
        fontWeight: 500,
        fontSize: isCompact ? 9 : 10,
        padding: isCompact ? "4px" : "5px 8px",
        whiteSpace: "nowrap",
        textAlign: "center",
        top: ROW1_HEIGHT,
    };

    const bodyStyle: React.CSSProperties = {
        fontSize: isCompact ? 5 : 6,
        padding: isCompact ? "4px" : "6px 8px",
        whiteSpace: "nowrap",
    };

    const totalRowStyle: React.CSSProperties = {
        ...bodyStyle,
        fontWeight: 700,
        background: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
    };

    // ── Column index tracker across grouped + orphan rendering ───────────────
    // We need to know the flat column index for each parent col to pick the right palette.
    // Build a map: parentCol array index → flat start index in bodyColumns
    const parentFlatStart = useMemo(() => {
        const starts: number[] = [];
        let cursor = 0;
        grouped.forEach((col) => {
            starts.push(cursor);
            cursor += col.children.length > 0 ? col.children.length : 1;
        });
        return starts;
    }, [grouped]);

    if (loading) return <TableSkeleton />;

    return (
        <MuiThemeProvider theme={tableTheme}>
            <TableContainer
                component={Paper}
                className={cn("shadow-sm border", className)}
                sx={{ maxHeight: stickyHeader ? "calc(100vh - 150px)" : "auto" }}
            >
                <Table stickyHeader={stickyHeader} size="small">

                    {/* ═══════════ HEADER ═══════════ */}
                    <TableHead>

                        {/* ROW 1 — parent / group headers */}
                        <TableRow>
                            {isSelectionEnabled && (
                                <TableCell
                                    align="center"
                                    rowSpan={hasSubColumns ? 2 : 1}
                                    style={{
                                        ...baseHeaderStyle,
                                        background: theme.palette.primary.main,
                                        width: selection?.selectionColumnWidth ?? 48,
                                        padding: "0 4px",
                                    }}
                                >
                                    {selection?.showSelectAll !== false && (
                                        <Checkbox
                                            size="small"
                                            checked={isAllSelected}
                                            indeterminate={isIndeterminate}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            sx={{ color: "inherit", "&.Mui-checked": { color: "inherit" } }}
                                        />
                                    )}
                                </TableCell>
                            )}

                            {grouped.map((col, pi) => {
                                const hasChildren = col.children.length > 0;
                                const flatIdx = parentFlatStart[pi];
                                const palette = paletteFor(flatIdx);
                                const bg = palette ? palette.header : theme.palette.primary.main;

                                return (
                                    <TableCell
                                        key={col.id}
                                        align={col.align ?? "center"}
                                        colSpan={hasChildren ? col.children.length : 1}
                                        rowSpan={!hasChildren && hasSubColumns ? 2 : 1}
                                        style={{ ...baseHeaderStyle, background: bg }}
                                    >
                                        {col.label}
                                    </TableCell>
                                );
                            })}

                            {/* Orphan sub-columns */}
                            {orphanSubs.map((sub) => (
                                <TableCell
                                    key={sub.id}
                                    align={sub.align ?? "center"}
                                    rowSpan={2}
                                    style={{ ...baseHeaderStyle, background: theme.palette.primary.main }}
                                >
                                    {sub.label}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* ROW 2 — sub-column headers with per-group sub-header color */}
                        {hasSubColumns && (
                            <TableRow>
                                {grouped.flatMap((col, pi) => {
                                    const flatIdx = parentFlatStart[pi];
                                    const palette = paletteFor(flatIdx);
                                    const subBg = palette ? palette.subHeader : theme.palette.primary.light;

                                    return col.children.map((child) => (
                                        <TableCell
                                            key={`${col.id}-${child.id}`}
                                            align={child.align ?? "center"}
                                            style={{ ...baseSubHeaderStyle, background: subBg }}
                                        >
                                            {child.label}
                                        </TableCell>
                                    ));
                                })}
                            </TableRow>
                        )}
                    </TableHead>

                    {/* ═══════════ BODY ═══════════ */}
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={bodyColumns.length + (isSelectionEnabled ? 1 : 0)}
                                    align="center"
                                    sx={{ py: 4, fontSize: 8, color: "text.secondary" }}
                                >
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => {
                                const rowId = rowIdKey ? String(row[rowIdKey]) : String(index);
                                const isHighlighted = highlightRowId != null && rowId === String(highlightRowId);
                                const selectionId = String(row[selectableKey]);
                                const isSelected = isSelectionEnabled && selectedIds.includes(selectionId);

                                return (
                                    <TableRow
                                        key={rowId}
                                        hover
                                        selected={isSelected}
                                        sx={{ ...(isHighlighted ? { backgroundColor: "warning.light" } : {}) }}
                                  
                                    >
                                        {isSelectionEnabled && (
                                            <TableCell align="center" style={{ ...bodyStyle ,padding: "0 4px" }}>
                                                <Checkbox
                                                    size="small"
                                                    checked={isSelected}
                                                    onChange={(e) => handleSelectionChange(selectionId, e.target.checked)}
                                                />
                                            </TableCell>
                                        )}
                                        {renderRow(row, index, isSelected, bodyColumns)}
                                    </TableRow>
                                );
                            })
                        )}

                        {/* TOTAL ROW */}
                        {renderTotalRow && data.length > 0 && (
                            <TableRow sx={{ position: "sticky", bottom: 0, zIndex: 1 }} style={totalRowStyle}>
                                {isSelectionEnabled && <TableCell style={totalRowStyle} />}
                                {renderTotalRow(data, bodyColumns)}
                            </TableRow>
                        )}
                    </TableBody>

                    {/* ═══════════ PAGINATION ═══════════ */}
                    {pagination && (
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={pagination.pageSizeOptions ?? [5, 10, 25, 50]}
                                    count={pagination.total}
                                    rowsPerPage={pagination.pageSize}
                                    page={pagination.page}
                                    onPageChange={(_, p) => pagination.onPageChange(p)}
                                    onRowsPerPageChange={(e) =>
                                        pagination.onPageSizeChange(parseInt(e.target.value, 10))
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
}

export default ResponsiveTable;