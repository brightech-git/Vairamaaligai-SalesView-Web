// components/ui/table/TableSkeleton.tsx
"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { Box, Skeleton, useTheme } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { useMediaQuery } from "@mui/material";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 5,
    columns = 2,
    className
}) => {
    const theme = useTheme();
    const { mode } = useThemeContext();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

    const skeletonColor = mode === 'dark' ? 'grey.700' : 'grey.300';

    if (isLargeScreen) {
        return (
            <Box
                className={className}
                sx={{
                    maxWidth: "95%",
                    margin: "auto",
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 1,
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                {/* Table Header Skeleton */}
                <Box
                    sx={{
                        display: 'flex',
                        bgcolor: '#4a4a4a',
                        p: 1
                    }}
                >
                    {Array.from({ length: columns }).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: 1,
                                p: 1,
                                display: 'flex',
                                justifyContent: index === columns - 1 ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width={120}
                                height={20}
                                sx={{ bgcolor: 'grey.400' }}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Table Body Skeleton */}
                <Box>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <Box
                            key={rowIndex}
                            sx={{
                                display: 'flex',
                                p: 1,
                                bgcolor: rowIndex % 2 === 0
                                    ? theme.palette.background.paper
                                    : theme.palette.action.hover,
                                borderBottom: rowIndex < rows - 1 ? `1px solid ${theme.palette.divider}` : 'none'
                            }}
                        >
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <Box
                                    key={colIndex}
                                    sx={{
                                        flex: 1,
                                        p: 1,
                                        display: 'flex',
                                        justifyContent: colIndex === columns - 1 ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <Skeleton
                                        variant="text"
                                        width={colIndex === 0 ? 150 : 80}
                                        height={20}
                                        sx={{ bgcolor: skeletonColor }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }

    // Mobile Skeleton
    return (
        <Box
            className={className}
            sx={{
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            {/* Mobile Table Header Skeleton */}
            <Box
                sx={{
                    display: 'flex',
                    bgcolor: '#4a4a4a',
                    p: 1
                }}
            >
                {Array.from({ length: columns }).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: 1,
                            p: 0.5,
                            display: 'flex',
                            justifyContent: index === columns - 1 ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <Skeleton
                            variant="text"
                            width={80}
                            height={18}
                            sx={{ bgcolor: 'grey.400' }}
                        />
                    </Box>
                ))}
            </Box>

            {/* Mobile Table Body Skeleton */}
            <Box>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <Box
                        key={rowIndex}
                        sx={{
                            display: 'flex',
                            p: 0.5,
                            bgcolor: rowIndex % 2 === 0
                                ? theme.palette.background.paper
                                : theme.palette.action.hover,
                            borderBottom: rowIndex < rows - 1 ? `1px solid ${theme.palette.divider}` : 'none'
                        }}
                    >
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Box
                                key={colIndex}
                                sx={{
                                    flex: 1,
                                    p: 0.5,
                                    display: 'flex',
                                    justifyContent: colIndex === columns - 1 ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    width={colIndex === 0 ? 100 : 60}
                                    height={16}
                                    sx={{ bgcolor: skeletonColor }}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TableSkeleton;