"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/context/ThemeContext";
import { useMediaQuery, useTheme } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

interface Column {
    id: string;
    label: string;
    align?: "left" | "right" | "center";
    minWidth?: number;
    maxWidth?: number;
    render?: (value: any, row: any) => React.ReactNode;
    headerBgColor?: string;
}

interface ResponsiveTableProps {
    columns: Column[];
    data: any[];
    className?: string;
    stickyHeader?: boolean;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
    columns,
    data,
    className,
    stickyHeader = false
}) => {
    const { mode } = useThemeContext();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

    const getHeaderStyle = () => ({
        background: '#E9E3DF',
        color: "#030333ff",
        fontWeight: 600,
        fontSize: "15.5px",
        border: 'none',
        paddingTop: "4px",
        paddingBottom: "4px",
        paddingLeft: "6px",
        paddingRight: "6px",
        position: "sticky",
        top: 0,
        zIndex: 1,
        whiteSpace: "nowrap",
    });

    const getAutoAlign = (value: any, col: Column) => {
        if (col.align) return col.align;
        return typeof value === "number" ? "right" : "left";
    };

    // MUI Theme for table
    const tableTheme = createTheme({
        palette: {
            mode,
            background: {
                paper: theme.palette.background.paper,
                default: theme.palette.background.default
            },
            text: {
                primary: theme.palette.text.primary,
                secondary: theme.palette.text.secondary,
            },
        },
        typography: {
            fontFamily: "var(--font-funnel), sans-serif",
            h1: { fontFamily: "var(--font-quintessential)" },
            h2: { fontFamily: "var(--font-grenze)" },
            h3: { fontFamily: "var(--font-almendra)" },
            body1: { fontFamily: "var(--font-funnel)" },
            body2: { fontFamily: "var(--font-delius)" },
        },
        components: {
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderColor: theme.palette.grey[200],
                    },
                    head: {
                        fontWeight: 700,
                    },
                },
            },
        },
    });

    // ------------------- MUI Table for Desktop -------------------
    if (isLargeScreen) {
        return (
            <MuiThemeProvider theme={tableTheme}>
                <TableContainer
                    component={Paper}
                    className={cn("rounded-xl shadow-md border border-gray-200", className)}
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        backgroundImage: "none",
                        maxWidth: "95%",
                        margin: "auto",
                        maxHeight: stickyHeader ? "calc(100vh - 240px)" : "none",
                    }}
                >
                    <Table stickyHeader={stickyHeader}>
                        <TableHead>
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableCell
                                        key={col.id}
                                        align={col.align || "left"}
                                        sx={{
                                            ...getHeaderStyle(),
                                            textAlign: col.align || "left",
                                            px: 1,
                                            py: 0.75,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "var(--font-domine)",
                                                display: "inline-block",
                                                width: "100%",
                                                textAlign: col.align || "left",
                                            }}
                                        >
                                            {col.label}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                            transform: 'translateY(-1px)',
                                            transition: 'all 0.2s ease',
                                        },
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {columns.map((col) => {
                                        const value = row[col.id];
                                        return (
                                            <TableCell
                                                key={col.id}
                                                align={getAutoAlign(value, col) as any}
                                                sx={{
                                                    fontFamily: "var(--font-montserrat)",
                                                    fontSize: 14.5,
                                                    fontWeight: 500,
                                                    color: theme.palette.text.primary,
                                                    py: 0.5,
                                                    px: 1,
                                                    lineHeight: 1.3,
                                                    whiteSpace: "nowrap",
                                                    maxWidth: col.maxWidth || 150,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {col.render ? col.render(value, row) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MuiThemeProvider>
        );
    }

    // ------------------- Mobile View with Tailwind CSS Table -------------------
    return (
        <div className={cn(
            "w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden",
            "bg-[var(--color-paper)]",
            className
        )}>
            {/* Mobile Table Container */}
            <div className="w-full overflow-hidden">
                {/* Table Header */}
                <div className="flex bg-gray-600 sticky top-0 z-10">
                    {columns.map((col, index) => (
                        <div
                            key={col.id}
                            className={cn(
                                "flex-1 min-w-0 p-2 border-r border-gray-500 last:border-r-0",
                                "text-white font-domine font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis",
                                col.align === 'center' && 'text-center',
                                col.align === 'right' && 'text-right',
                                !col.align && 'text-left'
                            )}
                            style={{
                                flex: col.minWidth ? 'none' : 1,
                                minWidth: col.minWidth ? `${col.minWidth}px` : '70px',
                                backgroundColor:theme.palette.text.secondary,   
                                color:'#030333ff', 
                                paddingTop: "4px",
                                paddingBottom: "4px",
                                paddingLeft: "6px",
                                paddingRight: "6px",
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                                whiteSpace: "nowrap",
                                fontSize: "12.5px",
                                fontWeight: 600,

                            }}
                        >
                            {col.label}
                        </div>
                    ))}
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((row, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                                idx % 2 === 0
                                    ? "bg-white dark:bg-gray-900"
                                    : "bg-gray-50 dark:bg-gray-800"
                            )}
                        >
                            {columns.map((col) => {
                                const value = row[col.id];
                                const displayValue = col.render ? col.render(value, row) : value;

                                return (
                                    <div
                                        key={col.id}
                                        className={cn(
                                            "flex-1 min-w-0 p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0",
                                            "font-montserrat text-sm font-medium text-gray-900 dark:text-white",
                                            "whitespace-nowrap overflow-hidden text-ellipsis",
                                            col.align === 'center' && 'text-center',
                                            col.align === 'right' && 'text-right',
                                            !col.align && 'text-left'
                                        )}
                                        style={{
                                            flex: col.minWidth ? 'none' : 1,
                                            minWidth: col.minWidth ? `${col.minWidth}px` : '75px',
                                            fontSize: "11.55px",
                                            textTransform: "capitalize"
                                           
                                        }}
                                    >
                                        {displayValue}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {data.length === 0 && (
                    <div className="flex justify-center items-center p-8 text-gray-500 dark:text-gray-400">
                        <span className="font-domine">No data available</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponsiveTable;