"use client";

import { ReactNode } from "react";
import { Box, Spinner, Flex, Text, Button, createListCollection } from "@chakra-ui/react";
import { Table } from "@chakra-ui/react/table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useThemeContext } from "@/context/ThemeContext";
import { NativeSelectWrapper } from "../NativeSelectWrapper";
import { Toaster } from "@/components/ui/toaster";

export type TableColumn = {
  key: string;
  label: string;
  align?: "start" | "center" | "end";
  total?: boolean; // If true, shows total for this column
  totalAlign?: "start" | "center" | "end"; // Alignment for total value
};

type CustomTableProps<T> = {
  columns: TableColumn[];
  data: T[];
  renderRow: (row: T, index: number) => ReactNode;

  /** Optional loading and highlight support */
  isLoading?: boolean;
  highlightRowId?: string | number | null;
  rowIdKey?: keyof T;

  /** Styling */
  headerSize?: string;
  headerBg?: string;
  bodyBg?: string;
  headerColor?: string;
  borderColor?: string;
  size?: "sm" | "md" | "lg";
  emptyText?: string;
  showTotal?: boolean;

  /** Total row props */
  totals?: Record<string, any>; // Object containing total values for columns
  renderTotal?: (totals: Record<string, any>) => ReactNode; // Custom render function for total row
  totalBg?: string; // Background color for total row
  totalColor?: string; // Text color for total row
  totalFontSize?: string; // Font size for total row

  /** Pagination props */
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
    showTotalRecords?: boolean;
  };
};

export function CustomTable<T extends Record<string, any>>({
  columns,
  data,
  renderRow,
  isLoading = false,
  headerBg,
  bodyBg,
  headerColor,
  headerSize = 'xs',
  borderColor,
  size = "sm",
  emptyText = "No records found",
  highlightRowId = null,
  rowIdKey,
  pagination,
  totals,
  renderTotal,
  totalBg,
  totalColor,
  totalFontSize = "xs",
}: CustomTableProps<T>) {

  const theme = useThemeContext();
 

  // Apply theme defaults when caller doesn't pass explicit values
  const resolvedHeaderBg    = headerBg    ?? theme.colors.tableHeaderBg;
  const resolvedHeaderColor = headerColor ?? (headerBg ? theme.colors.primaryText : theme.colors.tableHeaderText);
  const resolvedBodyBg      = bodyBg      ?? theme.colors.tableBg;
  const resolvedBorderColor = borderColor ?? theme.colors.tableBorder;
  const resolvedTotalBg     = totalBg     ?? theme.colors.tableFooterBg;
  const resolvedTotalColor  = totalColor  ?? theme.colors.tableFooterText;

  const enableScroll = data.length > 10;
  const rowHeight = 44; // approx for size="sm"
  const maxBodyHeight = rowHeight * 10;

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      pagination.onPageChange(page);
    }
  };

  // Create collection for page size options
  const pageSizeOptions = pagination?.pageSizeOptions || [10, 20, 50, 100];
  const pageSizeCollection = createListCollection({
    items: pageSizeOptions.map(size => ({
      label: String(size),
      value: String(size)
    }))
  });

  // Check if any column has total property set to true
  const hasTotals = totals && Object.keys(totals).length > 0 && columns.some(col => col.total === true);

  // Default total row renderer
  const defaultRenderTotal = () => {
    if (!hasTotals) return null;

    return (
      <Table.Row bg={resolvedTotalBg} fontWeight="semibold" position="sticky"
        bottom="0"
        zIndex={1}>
        {columns.map((col) => {
          const totalValue = totals[col.key];
          const align = col.totalAlign || col.align || "start";

          return (
            <Table.Cell
              key={col.key}
              textAlign={align}
              color={resolvedTotalColor}
              borderColor={resolvedBorderColor}
              fontSize={totalFontSize}
              p={2}
              fontWeight="medium"
            >
              {totalValue !== undefined ? totalValue : "-"}
            </Table.Cell>
          );
        })}
      </Table.Row>
    );
  };

  const totalRowContent = renderTotal
    ? renderTotal(totals || {})
    : defaultRenderTotal();

  return (
    <Box w="100%">
      <Box overflowX="auto">
        <Toaster />
        <Box
          maxH={enableScroll ? `${maxBodyHeight}px` : "auto"}
          overflowY={enableScroll ? "auto" : "visible"}
        >
          <Table.Root
            size={size}
            minW="max-content"
            border="1px solid"
            borderColor={resolvedBorderColor}
            showColumnBorder
            shadowColor={resolvedBorderColor}
            stickyHeader
         
            
          >
            {/* HEADER */}
            <Table.Header>
              <Table.Row bg={resolvedHeaderBg}>
                {columns.map((col) => (
                  <Table.ColumnHeader
                    key={col.key}
                    textAlign={col.align ?? "start"}
                    borderColor={resolvedBorderColor}
                    whiteSpace="nowrap"
                    fontSize={headerSize}
                    p={1}
                    style={{ color: resolvedHeaderColor }}
                  >
                    {col.label}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            {/* BODY */}
            <Table.Body>
              {isLoading ? (
                <Table.Row bg={resolvedBodyBg}>
                  <Table.Cell colSpan={columns.length} textAlign="center">
                    <Spinner size="sm" /> Loading...
                  </Table.Cell>
                </Table.Row>
              ) : data.length === 0 ? (
                <Table.Row bg={resolvedBodyBg}>
                  <Table.Cell colSpan={columns.length} textAlign="center">
                    {emptyText}
                  </Table.Cell>
                </Table.Row>
              ) : (
                data.map((row, index) => {
                  const rowId = rowIdKey ? row[rowIdKey] : null;
                  const isHighlighted =
                    highlightRowId != null && rowId === highlightRowId;

                  return (
                    <Table.Row
                      key={rowId ?? index}
                      bg={isHighlighted ? theme.colors.badgeBg : resolvedBodyBg}
                      transition="background-color 0.3s ease"
                      fontSize="xs"
                      fontWeight="400"
                    >
                      {renderRow(row, index)}
                    </Table.Row>
                  );
                })
              )}

              {/* TOTAL ROW - Added after body rows, before pagination */}
              {!isLoading && data.length > 0 && totalRowContent}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>

      {/* Pagination */}
      {pagination && (
        <Flex
          justify="space-between"
          align="center"
          mt={4}
          gap={2}
          wrap="wrap"
        >
          {/* Left side - Total records */}
          {pagination.showTotalRecords && (
            <Text fontSize="xs" color={theme.colors.secondaryText}>
              Showing {data.length} of {pagination.totalElements} records
            </Text>
          )}

          {/* Right side - Pagination controls */}
          <Flex align="center" gap={2} ml="auto">
            {/* Page size selector */}
            {pagination.showPageSizeSelector && pagination.onPageSizeChange && (
              <Flex align="center" gap={2}>
                <Text fontSize="xs" whiteSpace="nowrap">
                  Show:
                </Text>
                <NativeSelectWrapper
                  onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                  items={pageSizeCollection.items.map(item => ({ label: item.label, value: item.value }))}
                  value={pagination.pageSize.toString()}
                  css={{ maxW: "80px", rounded: 'sm' }}
                />
                <Text fontSize="xs" whiteSpace="nowrap">
                  per page
                </Text>
              </Flex>
            )}

            {/* Page navigation */}
            <Flex align="center" gap={1}>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1}
                title="First page"
              >
                <ChevronsLeft size={14} />
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                title="Previous page"
              >
                <ChevronLeft size={14} />
              </Button>

              <Text fontSize="xs" minW="80px" textAlign="center">
                Page {pagination.currentPage} of {pagination.totalPages}
              </Text>

              <Button
                size="xs"
                variant="ghost"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                title="Next page"
              >
                <ChevronRight size={14} />
              </Button>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
                title="Last page"
              >
                <ChevronsRight size={14} />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}