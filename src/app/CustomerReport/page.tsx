"use client";

import { useMemo, useState } from "react";
import { Box, Flex, Text, Button, Spinner, Badge } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react/table";
import { LuSearch, LuRefreshCw, LuUsers, LuCalendar } from "react-icons/lu";
import { CustomTable, TableColumn } from "@/components/ui/table/CustomTable";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { CapitalizedInput } from "@/components/ui/CapitalizedInput";
import { useCustomerTransactionReport } from "@/hooks/CustomerTransactionReport/useCustomerTransactionReport";
import { CustomerTransactionParams, CustomerTransactionRow } from "@/types/CustomerTransactionReport/CustomerTransactionReport";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Turns an arbitrary API field name (camelCase / snake_case) into a readable header. */
function humanizeKey(key: string): string {
    const spaced = key
        .replace(/_/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .trim();
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

function buildColumns(rows: CustomerTransactionRow[]): TableColumn[] {
    if (!rows.length) return [];
    return Object.keys(rows[0]).map((key) => ({
        key,
        label: humanizeKey(key),
        align: typeof rows[0][key] === "number" ? "end" : "start",
    }));
}

type FilterField = { key: keyof CustomerTransactionParams; label: string; inputModeType?: "text" | "mobile" | "pan" | "gst" };

const FILTER_FIELDS: FilterField[] = [
    { key: "billNo", label: "Bill No" },
    { key: "customer", label: "Customer" },
    { key: "phoneNo", label: "Phone No", inputModeType: "mobile" },
    { key: "pan", label: "PAN", inputModeType: "pan" },
    { key: "gstNo", label: "GST No", inputModeType: "gst" },
    { key: "address", label: "Address" },
];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function CustomerTransactionReportPage() {
    const today = new Date().toISOString().split("T")[0];

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // Filter inputs (draft — not yet applied to the query)
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [filters, setFilters] = useState<Partial<Record<keyof CustomerTransactionParams, string>>>({});

    // Applied params — only set once the user clicks "Search"
    const [appliedParams, setAppliedParams] = useState<CustomerTransactionParams | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleFilterChange = (field: keyof CustomerTransactionParams, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        setPage(1);
        setHasSearched(true);
        setAppliedParams({
            fromDate,
            toDate,
            ...(filters.billNo && { billNo: filters.billNo }),
            ...(filters.customer && { customer: filters.customer }),
            ...(filters.phoneNo && { phoneNo: filters.phoneNo }),
            ...(filters.pan && { pan: filters.pan }),
            ...(filters.gstNo && { gstNo: filters.gstNo }),
            ...(filters.address && { address: filters.address }),
        });
    };

    const handleReset = () => {
        setFromDate(today);
        setToDate(today);
        setFilters({});
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
    } = useCustomerTransactionReport(appliedParams ?? { fromDate, toDate }, hasSearched && !!appliedParams);

    const allData = reportData || [];
    const columns = useMemo(() => buildColumns(allData), [allData]);

    const totalPages = Math.max(1, Math.ceil(allData.length / pageSize));
    const pagedData = useMemo(
        () => allData.slice((page - 1) * pageSize, page * pageSize),
        [allData, page, pageSize]
    );

    const handleRefresh = () => {
        setPage(1);
        refetch();
    };

    return (
        <Box p={{base : "2" , lg: "4"}} mt={{base : "2" ,lg: "4"}} minH="100vh" bg="#f0f2f5" fontFamily="'Segoe UI', Arial, sans-serif" w="100%">
            {/* Filter Bar */}
            <Box bg="#fff" border="1px solid #dde1e7" borderRadius="10px" mb={4} p={4} boxShadow="0 1px 3px rgba(0,0,0,0.06)">
                <Flex align="center" gap={3} mb={3}>
                    <Box w="38px" h="38px" bg="#eff6ff" borderRadius="9px" display="flex" alignItems="center" justifyContent="center" border="1px solid #dbeafe" flexShrink={0}>
                        <LuUsers size={18} color="#1e40af" />
                    </Box>
                    <Box>
                        <Text fontSize="15px" fontWeight="800" color="#1a1a2e">Customer Transaction Report</Text>
                        <Text fontSize="11px" color="#888">Customer-wise bill transaction details</Text>
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

                    {FILTER_FIELDS.map((f) => (
                        <Box key={f.key}>
                            <Text fontSize="12px" fontWeight={600} color="#334155" mb="4px">{f.label}</Text>
                            <CapitalizedInput<CustomerTransactionParams>
                                value={filters[f.key] ?? ""}
                                field={f.key}
                                onChange={(field, value) => handleFilterChange(field, value)}
                                inputModeType={f.inputModeType}
                                placeholder={f.label}
                                size="sm"
                                maxWidth="160px"
                                rounded="sm"
                            />
                        </Box>
                    ))}

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
                    <Text color="#aaa" fontSize="13px">Loading customer transaction report…</Text>
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
                    <Text fontSize="14px" fontWeight="600" color="#888">No customer transactions found.</Text>
                </Flex>
            )}

            {hasSearched && !loading && !queryError && allData.length > 0 && (
                <Box>
                    <Flex align="center" justify="space-between" mb={3} flexWrap="wrap" gap={2}>
                        <Badge bg="#dbeafe" color="#1e40af" borderRadius="6px" px={2} py="3px" fontSize="11px" fontWeight="700" border="1px solid #bfdbfe">
                            {allData.length} records
                        </Badge>
                    </Flex>

                    <Box bg="#fff" border="1px solid #dde1e7" borderRadius="10px" overflow="hidden" boxShadow="0 1px 3px rgba(0,0,0,0.05)" p={3}>
                        <CustomTable<CustomerTransactionRow>
                            columns={columns}
                            data={pagedData}
                            isLoading={loading}
                            emptyText="No customer transactions found."
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
