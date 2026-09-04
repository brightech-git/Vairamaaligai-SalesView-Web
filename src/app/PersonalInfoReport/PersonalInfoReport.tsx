"use client";

import { useMemo, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    Chip,
    Select,
    MenuItem,
    Pagination,
    useTheme,
    type SelectChangeEvent,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { usePersonalInfoReport } from "@/hooks/usePersonalInfoReport";
import { PersonalInfoRow } from "@/types/PersonalInfoReport/PersonalInfoReport";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Friendlier labels for known columns — humanizeKey() alone reads oddly for
// all-caps/abbreviated backend field names like "PNAME" or "GSTNO".
const COLUMN_LABELS: Record<string, string> = {
    MOBILE: "Mobile",
    PNAME: "Name",
    ADDRESS1: "Address 1",
    ADDRESS2: "Address 2",
    ADDRESS3: "Address 3",
    AREA: "Area",
    CITY: "City",
    PINCODE: "Pincode",
    GSTNO: "GST No",
    PAN: "PAN",
};

function humanizeKey(key: string): string {
    if (COLUMN_LABELS[key]) return COLUMN_LABELS[key];
    const spaced = key
        .replace(/_/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .trim();
    if (spaced === spaced.toUpperCase()) {
        return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
    }
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Renders a single cell value for display. */
function formatCell(value: unknown): string {
    if (value === null || value === undefined || value === "" || value === "0") return "-";
    return String(value);
}

interface ReportColumn {
    id: string;
    label: string;
    align: "left" | "right";
    render: (value: unknown) => string;
}

function buildColumns(rows: PersonalInfoRow[]): ReportColumn[] {
    if (!rows.length) return [];
    return Object.keys(rows[0]).map((key) => ({
        id: key,
        label: humanizeKey(key),
        align: typeof rows[0][key] === "number" ? "right" : "left",
        render: formatCell,
    }));
}

const PAGE_SIZE_OPTIONS = [20, 50, 100, 200];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function PersonalInfoReportPage() {
    const theme = useTheme();
    const [page, setPage] = useState(1); // 1-based in the UI
    const [pageSize, setPageSize] = useState(20);

    const {
        data: reportData,
        isLoading: loading,
        error: queryError,
        refetch,
        isFetching,
    } = usePersonalInfoReport({ page: page - 1, size: pageSize }, true);

    const allData = useMemo(() => reportData?.data ?? [], [reportData]);
    const columns = useMemo(() => buildColumns(allData), [allData]);
    const totalPages = reportData?.totalPages ?? 1;

    const handleRefresh = () => refetch();

    const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);

    const handlePageSizeChange = (e: SelectChangeEvent<number>) => {
        setPageSize(Number(e.target.value));
        setPage(1);
    };

    return (
        <Box sx={{ p: { xs: 2, lg: 4 }, minHeight: "100vh", width: "100%" }}>
            {/* Header Bar */}
            <Box
                sx={{
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "10px",
                    mb: 2,
                    p: 2,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1.5}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                bgcolor: "#eff6ff",
                                borderRadius: "9px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid #dbeafe",
                                flexShrink: 0,
                            }}
                        >
                            <PersonOutlineIcon sx={{ fontSize: 18, color: "#1e40af" }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 15, fontWeight: 800, color: theme.palette.text.primary }}>
                                Personal Info Report
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: theme.palette.text.secondary }}>
                                Customer personal &amp; address details
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        onClick={handleRefresh}
                        disabled={isFetching}
                        startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            bgcolor: "#f8f9fa",
                            color: "#666",
                            fontWeight: 600,
                            fontSize: 13,
                            px: 2,
                            height: "35px",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            textTransform: "none",
                            "&:hover": { bgcolor: "#f0f0f0" },
                        }}
                    >
                        Refresh
                    </Button>
                </Stack>
            </Box>

            {loading && <TableSkeleton rows={pageSize > 10 ? 10 : pageSize} columns={6} />}

            {queryError && !loading && (
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.5}
                    sx={{ mb: 2, bgcolor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", px: 2.5, py: 2 }}
                >
                    <Typography sx={{ fontSize: 20 }}>🚨</Typography>
                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#b91c1c" }}>
                            Failed to load report
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#ef4444" }}>Please try again.</Typography>
                    </Box>
                </Stack>
            )}

            {!loading && !queryError && allData.length === 0 && (
                <Stack alignItems="center" justifyContent="center" gap={1.5} sx={{ py: 10 }}>
                    <Typography sx={{ fontSize: 22 }}>📭</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.text.secondary }}>
                        No records found.
                    </Typography>
                </Stack>
            )}

            {!loading && !queryError && allData.length > 0 && (
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
                        <Chip
                            label={`${reportData?.totalRecords ?? allData.length} records`}
                            size="small"
                            sx={{
                                bgcolor: "#dbeafe",
                                color: "#1e40af",
                                fontWeight: 700,
                                fontSize: 11,
                                border: "1px solid #bfdbfe",
                            }}
                        />
                    </Stack>

                    <Box
                        sx={{
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: "10px",
                            overflow: "hidden",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                            p: 1.5,
                        }}
                    >
                        <ResponsiveTable columns={columns} data={allData} stickyHeader />

                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            flexWrap="wrap"
                            gap={1.5}
                            sx={{ mt: 2, px: 0.5 }}
                        >
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
                                    Rows per page
                                </Typography>
                                <Select
                                    size="small"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    sx={{ fontSize: 12, height: 32 }}
                                >
                                    {PAGE_SIZE_OPTIONS.map((size) => (
                                        <MenuItem key={size} value={size} sx={{ fontSize: 12 }}>
                                            {size}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>

                            <Pagination
                                page={page}
                                count={totalPages}
                                onChange={handlePageChange}
                                color="primary"
                                size="small"
                                showFirstButton
                                showLastButton
                            />
                        </Stack>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
