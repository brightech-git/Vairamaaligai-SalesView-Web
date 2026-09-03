"use client";

import { useMemo, useState } from "react";
import { Box, Flex, Text, Button, Spinner, Badge } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react/table";
import { LuSearch, LuRefreshCw, LuPercent, LuCalendar } from "react-icons/lu";
import { CustomTable, TableColumn } from "@/components/ui/table/CustomTable";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { NativeSelectWrapper } from "@/components/ui/NativeSelectWrapper";
import { useDiscountReport } from "@/hooks/DiscountReport/useDiscountReport";
import { useCostCentre, useMetals } from "@/hooks/useReport";
import { DiscountReportParams, DiscountReportRow } from "@/types/DiscountReport/DiscountReport";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Turns an arbitrary API field name (camelCase / snake_case / UPPERCASE) into a readable header. */
function humanizeKey(key: string): string {
    const spaced = key
        .replace(/_/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .trim();
    if (spaced === spaced.toUpperCase()) {
        return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
    }
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isDateKey(key: string): boolean {
    return /date/i.test(key);
}

function formatDateValue(value: string): string {
    const cleaned = value.split("T")[0];
    const [y, m, d] = cleaned.split("-");
    if (!y || !m || !d) return value;
    return `${d}/${m}/${y}`;
}

/** Renders a single cell value for display, applying only generic (key-name-based) rules. */
function formatCell(key: string, value: unknown): string {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "number") {
        return Number.isInteger(value) ? String(value) : value.toFixed(2);
    }
    if (typeof value === "string" && isDateKey(key) && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return formatDateValue(value);
    }
    return String(value);
}

// Columns we don't want cluttering the table — already surfaced via filters/summary.
const HIDDEN_COLUMNS = new Set(["costId", "RESULT", "SNO"]);

function buildColumns(rows: DiscountReportRow[]): TableColumn[] {
    if (!rows.length) return [];
    return Object.keys(rows[0])
        .filter((key) => !HIDDEN_COLUMNS.has(key))
        .map((key) => ({
            key,
            label: humanizeKey(key),
            align: typeof rows[0][key] === "number" ? "end" : "start",
        }));
}

const YES_NO_OPTIONS = [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" },
];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function DiscountReportPage() {
    const today = new Date().toISOString().split("T")[0];

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // Filter inputs (draft — not yet applied to the query)
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [costId, setCostId] = useState(""); // "" = all branches
    const [metalId, setMetalId] = useState("ALL"); // "ALL" = all metals
    const [groupBy, setGroupBy] = useState<"Y" | "N">("N"); // No = show all (detail rows)
    const [withEx, setWithEx] = useState<"Y" | "N">("Y"); // Yes by default

    // Applied params — only set once the user clicks "Search"
    const [appliedParams, setAppliedParams] = useState<DiscountReportParams | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Branches (cost centres) — drives the Branch filter dropdown
    const { data: costCentres = [] } = useCostCentre();
    const branchOptions = useMemo(
        () => costCentres.map((c) => ({ label: String(c.COSTNAME), value: String(c.COSTID) })),
        [costCentres]
    );

    // Metals — drives the Metal filter dropdown
    const { data: metals = [] } = useMetals();
    const metalOptions = useMemo(
        () => [
            { label: "ALL", value: "ALL" },
            ...metals.map((m) => ({ label: String(m.METALNAME), value: String(m.METALID) })),
        ],
        [metals]
    );

    const handleSearch = () => {
        setPage(1);
        setHasSearched(true);
        setAppliedParams({ fromDate, toDate, costId, metalId, groupBy, withEx });
    };

    const handleReset = () => {
        setFromDate(today);
        setToDate(today);
        setCostId("");
        setMetalId("ALL");
        setGroupBy("N");
        setWithEx("Y");
        setPage(1);
        setHasSearched(false);
        setAppliedParams(null);
    };

    const {
        data: reportData,
        isLoading: loading,
        error: queryError,
        refetch,
        isFetching,
    } = useDiscountReport(appliedParams ?? { fromDate, toDate, costId, metalId, groupBy, withEx }, hasSearched && !!appliedParams);

    const allData = useMemo(() => reportData?.data ?? [], [reportData]);
    const columns = useMemo(() => buildColumns(allData), [allData]);

    const totalPages = Math.max(1, Math.ceil(allData.length / pageSize));
    const pagedData = useMemo(
        () => allData.slice((page - 1) * pageSize, page * pageSize),
        [allData, page, pageSize]
    );

    const totalDiscount = useMemo(
        () => allData.reduce((sum, row) => sum + (Number(row["TOTALDISC"]) || 0), 0),
        [allData]
    );

    const handleRefresh = () => {
        setPage(1);
        refetch();
    };

    return (
        <Box p={{base : "2" , lg: "4"}} mt={{base : "4" ,lg: "10"}} minH="100vh" bg="#f0f2f5" fontFamily="'Segoe UI', Arial, sans-serif" w="100%">
            {/* Filter Bar */}
            <Box bg="#fff" border="1px solid #dde1e7" borderRadius="10px" mb={4} p={4} boxShadow="0 1px 3px rgba(0,0,0,0.06)">
                <Flex align="center" gap={3} mb={3}>
                    <Box w="38px" h="38px" bg="#eff6ff" borderRadius="9px" display="flex" alignItems="center" justifyContent="center" border="1px solid #dbeafe" flexShrink={0}>
                        <LuPercent size={18} color="#1e40af" />
                    </Box>
                    <Box>
                        <Text fontSize="15px" fontWeight="800" color="#1a1a2e">Discount Report</Text>
                        <Text fontSize="11px" color="#888">Bill-wise discount details</Text>
                    </Box>
                </Flex>

                <Flex align="flex-end" gap={3} flexWrap="wrap">
                    <Box>
                        <Text fontSize="12px" fontWeight={600} color="#334155" mb="4px">From Date</Text>
                        <Flex align="center" gap={2}>
                            <LuCalendar size={14} color="#1e40af" />
                            <DatePickerInput value={fromDate} onChange={setFromDate} maxDate={today} />
                        </Flex>
                    </Box>

                    <Box>
                        <Text fontSize="12px" fontWeight={600} color="#334155" mb="4px">To Date</Text>
                        <Flex align="center" gap={2}>
                            <LuCalendar size={14} color="#1e40af" />
                            <DatePickerInput value={toDate} onChange={setToDate} minDate={fromDate} maxDate={today} />
                        </Flex>
                    </Box>

                    <Box>
                        <Text fontSize="12px" fontWeight={600} color="#334155" mb="4px">Branch</Text>
                        <NativeSelectWrapper
                            value={costId}
                            onChange={(e) => setCostId(e.target.value)}
                            items={branchOptions}
                            placeholder="All Branches"
                            size="sm"
                            maxW="160px"
                            fontSize="12px"
                        />
                    </Box>

                    <Box>
                        <Text fontSize="12px" fontWeight={600} color="#334155" mb="4px">Metal</Text>
                        <NativeSelectWrapper
                            value={metalId}
                            onChange={(e) => setMetalId(e.target.value)}
                            items={metalOptions}
                            size="sm"
                            maxW="160px"
                            fontSize="12px"
                        />
                    </Box>

                    <Box>
                        <Text fontSize="12px" fontWeight={600} color="#334155" mb="4px">Group By</Text>
                        <NativeSelectWrapper
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value as "Y" | "N")}
                            items={YES_NO_OPTIONS}
                            size="sm"
                            maxW="110px"
                            fontSize="12px"
                        />
                    </Box>

                    <Box>
                        <Text fontSize="12px" fontWeight={600} color="#334155" mb="4px">With Ex</Text>
                        <NativeSelectWrapper
                            value={withEx}
                            onChange={(e) => setWithEx(e.target.value as "Y" | "N")}
                            items={YES_NO_OPTIONS}
                            size="sm"
                            maxW="110px"
                            fontSize="12px"
                        />
                    </Box>

                    <Button onClick={handleSearch} bg="#1e40af" color="white" fontWeight="700" fontSize="13px" px={5} h="35px" borderRadius="8px" _hover={{ bg: "#1e3a8a" }}>
                        <LuSearch style={{ marginRight: "6px" }} /> Search
                    </Button>
                    <Button onClick={handleReset} bg="#f8f9fa" color="#666" fontWeight="600" fontSize="13px" px={4} h="35px" borderRadius="8px" border="1px solid #e0e0e0" _hover={{ bg: "#f0f0f0" }}>
                        Reset
                    </Button>
                    <Button onClick={handleRefresh} bg="#f8f9fa" color="#666" fontWeight="600" fontSize="13px" px={4} h="35px" borderRadius="8px" border="1px solid #e0e0e0" _hover={{ bg: "#f0f0f0" }} loading={isFetching} disabled={!hasSearched}>
                        <LuRefreshCw style={{ marginRight: "6px" }} /> Refresh
                    </Button>
                </Flex>
            </Box>

            {!hasSearched && (
                <Flex direction="column" align="center" justify="center" py={20} gap={3}>
                    <Text fontSize="22px">🔍</Text>
                    <Text fontSize="14px" fontWeight="600" color="#888">Choose your filters and click Search to load the report.</Text>
                </Flex>
            )}

            {hasSearched && loading && (
                <Flex justify="center" align="center" py={20} gap={3} direction="column">
                    <Spinner size="lg" color="blue.500" borderWidth="3px" />
                    <Text color="#aaa" fontSize="13px">Loading discount report…</Text>
                </Flex>
            )}

            {hasSearched && queryError && !loading && (
                <Flex align="center" gap={3} mb={4} bg="red.50" border="1px solid red.200" borderRadius="10px" px={5} py={4}>
                    <Text fontSize="20px">🚨</Text>
                    <Box>
                        <Text fontSize="14px" fontWeight="700" color="red.700">Failed to load report</Text>
                        <Text fontSize="12px" color="red.500">Please try again.</Text>
                    </Box>
                </Flex>
            )}

            {hasSearched && !loading && !queryError && allData.length === 0 && (
                <Flex direction="column" align="center" justify="center" py={20} gap={3}>
                    <Text fontSize="22px">📭</Text>
                    <Text fontSize="14px" fontWeight="600" color="#888">No discount records found.</Text>
                </Flex>
            )}

            {hasSearched && !loading && !queryError && allData.length > 0 && (
                <Box>
                    <Flex align="center" justify="space-between" mb={3} flexWrap="wrap" gap={2}>
                        <Flex gap={2} flexWrap="wrap">
                            <Badge bg="#dbeafe" color="#1e40af" borderRadius="6px" px={2} py="3px" fontSize="11px" fontWeight="700" border="1px solid #bfdbfe">
                                {reportData?.recordCount ?? allData.length} records
                            </Badge>
                            {reportData?.branchCount !== undefined && (
                                <Badge bg="#f1f5f9" color="#334155" borderRadius="6px" px={2} py="3px" fontSize="11px" fontWeight="700" border="1px solid #e2e8f0">
                                    {reportData.branchCount} branch{reportData.branchCount === 1 ? "" : "es"}
                                </Badge>
                            )}
                            <Badge bg="#fef3c7" color="#92400e" borderRadius="6px" px={2} py="3px" fontSize="11px" fontWeight="700" border="1px solid #fde68a">
                                Total Discount: {totalDiscount.toFixed(2)}
                            </Badge>
                        </Flex>
                    </Flex>

                    <Box bg="#fff" border="1px solid #dde1e7" borderRadius="10px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.05)" p={3}>
                        <CustomTable<DiscountReportRow>
                            columns={columns}
                            data={pagedData}
                            isLoading={loading}
                            emptyText="No discount records found."
                            pagination={{
                                currentPage: page,
                                totalPages,
                                totalElements: allData.length,
                                pageSize,
                                onPageChange: setPage,
                                onPageSizeChange: (size) => { setPageSize(size); setPage(1); },
                                pageSizeOptions: [10, 20, 50, 100],
                                showPageSizeSelector: true,
                                showTotalRecords: true,
                            }}
                            renderRow={(row) => (
                                <>
                                    {columns.map((col) => (
                                        <Table.Cell key={col.key} textAlign={col.align}>
                                            {formatCell(col.key, row[col.key])}
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
