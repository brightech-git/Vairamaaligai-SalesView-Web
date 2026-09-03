"use client";

import { useMemo, useState } from "react";
import { Box, Flex, Text, Button, Spinner, Badge } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react/table";
import { LuRefreshCw, LuUserRound } from "react-icons/lu";
import { CustomTable, TableColumn } from "@/components/ui/table/CustomTable";
import { usePersonalInfoReport } from "@/hooks/PersonalInfoReport/usePersonalInfoReport";
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

function buildColumns(rows: PersonalInfoRow[]): TableColumn[] {
    if (!rows.length) return [];
    return Object.keys(rows[0]).map((key) => ({
        key,
        label: humanizeKey(key),
        align: typeof rows[0][key] === "number" ? "end" : "start",
    }));
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function PersonalInfoReportPage() {
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

    const handleRefresh = () => refetch();

    const handlePageChange = (newPage: number) => setPage(newPage);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    return (
        <Box p={{base : "2" , lg: "4"}} mt={{base : "4" ,lg: "10"}} minH="100vh" bg="#f0f2f5" fontFamily="'Segoe UI', Arial, sans-serif" w="100%">
            {/* Header Bar */}
            <Box bg="#fff" border="1px solid #dde1e7" borderRadius="10px" mb={4} p={4} boxShadow="0 1px 3px rgba(0,0,0,0.06)">
                <Flex align="center" justify="space-between" flexWrap="wrap" gap={3}>
                    <Flex align="center" gap={3}>
                        <Box w="38px" h="38px" bg="#eff6ff" borderRadius="9px" display="flex" alignItems="center" justifyContent="center" border="1px solid #dbeafe" flexShrink={0}>
                            <LuUserRound size={18} color="#1e40af" />
                        </Box>
                        <Box>
                            <Text fontSize="15px" fontWeight="800" color="#1a1a2e">Personal Info Report</Text>
                            <Text fontSize="11px" color="#888">Customer personal & address details</Text>
                        </Box>
                    </Flex>

                    <Button onClick={handleRefresh} bg="#f8f9fa" color="#666" fontWeight="600" fontSize="13px" px={4} h="35px" borderRadius="8px" border="1px solid #e0e0e0" _hover={{ bg: "#f0f0f0" }} loading={isFetching}>
                        <LuRefreshCw style={{ marginRight: "6px" }} /> Refresh
                    </Button>
                </Flex>
            </Box>

            {loading && (
                <Flex justify="center" align="center" py={20} gap={3} direction="column">
                    <Spinner size="lg" color="blue.500" borderWidth="3px" />
                    <Text color="#aaa" fontSize="13px">Loading personal info report…</Text>
                </Flex>
            )}

            {queryError && !loading && (
                <Flex align="center" gap={3} mb={4} bg="red.50" border="1px solid red.200" borderRadius="10px" px={5} py={4}>
                    <Text fontSize="20px">🚨</Text>
                    <Box>
                        <Text fontSize="14px" fontWeight="700" color="red.700">Failed to load report</Text>
                        <Text fontSize="12px" color="red.500">Please try again.</Text>
                    </Box>
                </Flex>
            )}

            {!loading && !queryError && allData.length === 0 && (
                <Flex direction="column" align="center" justify="center" py={20} gap={3}>
                    <Text fontSize="22px">📭</Text>
                    <Text fontSize="14px" fontWeight="600" color="#888">No records found.</Text>
                </Flex>
            )}

            {!loading && !queryError && allData.length > 0 && (
                <Box>
                    <Flex align="center" justify="space-between" mb={3} flexWrap="wrap" gap={2}>
                        <Badge bg="#dbeafe" color="#1e40af" borderRadius="6px" px={2} py="3px" fontSize="11px" fontWeight="700" border="1px solid #bfdbfe">
                            {reportData?.totalRecords ?? allData.length} records
                        </Badge>
                    </Flex>

                    <Box bg="#fff" border="1px solid #dde1e7" borderRadius="10px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.05)" p={3}>
                        <CustomTable<PersonalInfoRow>
                            columns={columns}
                            data={allData}
                            isLoading={loading}
                            emptyText="No records found."
                            pagination={{
                                currentPage: page,
                                totalPages: reportData?.totalPages ?? 1,
                                totalElements: reportData?.totalRecords ?? 0,
                                pageSize,
                                onPageChange: handlePageChange,
                                onPageSizeChange: handlePageSizeChange,
                                pageSizeOptions: [20, 50, 100, 200],
                                showPageSizeSelector: true,
                                showTotalRecords: true,
                            }}
                            renderRow={(row) => (
                                <>
                                    {columns.map((col) => (
                                        <Table.Cell key={col.key} textAlign={col.align}>
                                            {formatCell(row[col.key])}
                                        </Table.Cell>
                                    ))}
                                </>
                            )}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}
