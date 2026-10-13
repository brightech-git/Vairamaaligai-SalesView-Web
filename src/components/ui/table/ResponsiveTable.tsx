"use client";
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, useTheme, alpha } from "@mui/material";
interface Column { id: string; label: string; align?: "left" | "right" | "center"; minWidth?: number; maxWidth?: number; render?: (value: any, row: any) => React.ReactNode; headerBgColor?: string; }
interface ResponsiveTableProps { columns: Column[]; data: any[]; className?: string; stickyHeader?: boolean; }
const ResponsiveTable = ({ columns, data, className, stickyHeader = false }: ResponsiveTableProps) => {
  const theme = useTheme();
  return <TableContainer component={Paper} className={`glass-surface ${className ?? ""}`} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflowX: "auto", maxHeight: stickyHeader ? "calc(100vh - 260px)" : undefined }}>
    <Table stickyHeader={stickyHeader} sx={{ minWidth: columns.length > 4 ? 640 : 280 }}>
      <TableHead><TableRow>{columns.map(col => <TableCell key={col.id} align={col.align ?? "left"} sx={{ bgcolor: theme.palette.mode === "light" ? "#f4e9ed" : "#382832", color: "text.secondary", fontWeight: 700, fontSize: 12, py: .9, px: 1.25, whiteSpace: "nowrap", minWidth: col.minWidth, borderColor: "divider" }}>{col.label}</TableCell>)}</TableRow></TableHead>
      <TableBody>{data.map((row, index) => <TableRow key={index} sx={{ bgcolor: row.__isTotal ? alpha(theme.palette.primary.main, .06) : undefined, transition: "background-color 160ms", "&:hover": { bgcolor: "action.hover" }, "&:last-child td": { borderBottom: 0 } }}>
        {columns.map(col => { const value = row[col.id]; return <TableCell key={col.id} align={col.align ?? (typeof value === "number" ? "right" : "left")} sx={{ fontSize: 13, py: .9, px: 1.25, fontWeight: row.__isTotal ? 700 : 400, fontVariantNumeric: "tabular-nums", borderColor: "divider", minWidth: col.minWidth, maxWidth: col.maxWidth, whiteSpace: "nowrap" }}>{col.render ? col.render(value, row) : value}</TableCell>; })}
      </TableRow>)}</TableBody>
    </Table>
    {data.length === 0 && <Box sx={{ p: 5, textAlign: "center" }}><Typography variant="body2" color="text.secondary">No records for the selected filters.</Typography></Box>}
  </TableContainer>;
};
export default ResponsiveTable;
