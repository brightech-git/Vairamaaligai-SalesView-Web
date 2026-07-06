"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    useTheme,
    alpha,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import SchemeAutocomplete from "@/components/ui/SchemeAutocomplete";
import { formatNumber } from "@/lib/numberFormatter";
import { fetchSchemeReport } from "@/service/SchemeReportService";
import type { SchemeListItem } from "@/service/SchemeReportService";

type DateMode = "range" | "asOn";

const TOTAL_LABEL = "Total";

const buildTotalsRow = (rows: any[], keyField: string, numericFields: string[]) => {
    if (rows.length === 0) return null;
    const totals: any = { [keyField]: TOTAL_LABEL, __isTotal: true };
    numericFields.forEach((field) => {
        totals[field] = rows.reduce((sum, r) => sum + (Number(r[field]) || 0), 0);
    });
    return totals;
};

const boldIfTotal = (row: any, content: React.ReactNode) => (
    <span style={{ fontWeight: row.__isTotal ? 700 : 500 }}>{content}</span>
);

const SchemeReport: React.FC = () => {
    const theme = useTheme();

    const [dateMode, setDateMode] = useState<DateMode>("range");
    const [fromDate, setFromDate] = useState<Date | null>(new Date());
    const [toDate, setToDate] = useState<Date | null>(new Date());
    const [asOnDate, setAsOnDate] = useState<Date | null>(new Date());
    const [scheme, setScheme] = useState<SchemeListItem | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any[] | null>(null);

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: DateMode | null) => {
        if (newMode) setDateMode(newMode);
    };

    const handleViewReport = async () => {
        const effectiveFrom = dateMode === "asOn" ? asOnDate : fromDate;
        const effectiveTo = dateMode === "asOn" ? asOnDate : toDate;
        if (!effectiveFrom || !effectiveTo) return;

        setLoading(true);
        setError(null);
        try {
            const data = await fetchSchemeReport({
                fromDate: format(effectiveFrom, "yyyy-MM-dd"),
                toDate: format(effectiveTo, "yyyy-MM-dd"),
                schemeId: scheme?.schemeId,
            });
            console.log("Scheme Report Data:", data);
            setReportData(Array.isArray(data) ? data : null);
        } catch (err) {
            setError("Failed to load scheme report");
            setReportData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setDateMode("range");
        setFromDate(new Date());
        setToDate(new Date());
        setAsOnDate(new Date());
        setScheme(null);
        setReportData(null);
        setError(null);
    };

    const [receiptSummary, collectionSummary, schemeAmountSummary, schemeWeightSummary, newMemberCollection] =
        reportData ?? [[], [], [], [], []];

    const sectionTitleSx = {
        mb: 1.5,
        fontWeight: 600,
        color: theme.palette.text.primary,
        fontFamily: "var(--font-merriweather)",
    };

    const renderSection = (title: string, table: React.ReactNode) => (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={sectionTitleSx}>
                {title}
            </Typography>
            {table}
        </Box>
    );

    const renderReport = () => {
        if (loading) return <TableSkeleton rows={6} columns={4} />;
        if (error)
            return (
                <Box sx={{ p: 3, textAlign: "center", color: theme.palette.error.main }}>
                    <Typography variant="body1">{error}</Typography>
                </Box>
            );
        if (!reportData) return null;

        // 1. Scheme Receipt Summary View
        const receiptRows = (receiptSummary || []).map((r: any) => ({
            group: r.Group ?? "-",
            noOfRects: r["No Of Rects"] ?? 0,
            amount: Number(r.AMOUNT) || 0,
            weight: Number(r.WEIGHT) || 0,
        }));
        const receiptTotal = buildTotalsRow(receiptRows, "group", ["noOfRects", "amount", "weight"]);
        const receiptData = receiptTotal ? [...receiptRows, receiptTotal] : receiptRows;
        const receiptColumns = [
            { id: "group", label: "Group", align: "left" as const, render: (v: string, row: any) => boldIfTotal(row, v) },
            { id: "noOfRects", label: "No of Rects", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, v) },
            { id: "amount", label: "Amount (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `₹ ${formatNumber(v, "2")}`) },
            { id: "weight", label: "Weight (g)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, formatNumber(v, "3")) },
        ];

        // 2. Collection Summary View (single-row object -> label/value rows)
        const collectionLabels: Record<string, string> = {
            CASHAMOUNT: "Cash",
            CARDAMOUNT: "Credit Card",
            CHEQUEAMOUNT: "Cheque",
            ETRANSFERAMOUNT: "Net Banking",
            CREDITPURCHASE: "Credit Purchase",
            GIFTADJUSTMENT: "Gift Adjustment",
            HOMEAMOUNT: "Home Collection",
            ADVAMOUNT: "Advance",
            VAAMOUNT: "VA Amount",
            ONLAMOUNT: "Online",
            OTHERAMOUNT: "Other",
        };
        const collectionObj = (collectionSummary && collectionSummary[0]) || {};
        const collectionRows = Object.entries(collectionLabels).map(([field, label]) => ({
            type: label,
            amount: Number(collectionObj[field]) || 0,
        }));
        const collectionTotalRow = {
            type: TOTAL_LABEL,
            amount: Number(collectionObj.TOTAMOUNT) || 0,
            __isTotal: true,
        };
        const collectionData = [...collectionRows, collectionTotalRow];
        const collectionColumns = [
            { id: "type", label: "Collection Type", align: "left" as const, render: (v: string, row: any) => boldIfTotal(row, v) },
            { id: "amount", label: "Amount (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `₹ ${formatNumber(v, "2")}`) },
        ];

        // 3. Scheme Summary View (Amount)
        const amountRows = (schemeAmountSummary || []).map((r: any) => ({
            schemeName: r.SCHEMENAME ?? "-",
            opening: Number(r.OPENING) || 0,
            receipt: Number(r.RECEIPT) || 0,
            closedAmt: Number(r.CLOSEDAMT) || 0,
            outstanding: Number(r.OUTSTANDING) || 0,
        }));
        const amountTotal = buildTotalsRow(amountRows, "schemeName", ["opening", "receipt", "closedAmt", "outstanding"]);
        const amountData = amountTotal ? [...amountRows, amountTotal] : amountRows;
        const amountColumns = [
            { id: "schemeName", label: "Scheme", align: "left" as const, render: (v: string, row: any) => boldIfTotal(row, v) },
            { id: "opening", label: "Opening (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `₹ ${formatNumber(v, "2")}`) },
            { id: "receipt", label: "Receipt (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `₹ ${formatNumber(v, "2")}`) },
            { id: "closedAmt", label: "Closed (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `₹ ${formatNumber(v, "2")}`) },
            { id: "outstanding", label: "Outstanding (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `₹ ${formatNumber(v, "2")}`) },
        ];

        // 4. Scheme Summary View (Weight)
        const weightRows = (schemeWeightSummary || []).map((r: any) => ({
            schemeName: r.SCHEMENAME ?? "-",
            groupCode: r.GROUPCODE || "-",
            opening: Number(r.OPENING) || 0,
            receipt: Number(r.RECEIPT) || 0,
            chequeReturn: Number(r.CHEQUERETURN) || 0,
            closedWeight: Number(r.CLOSEDWEIGHT) || 0,
            outstanding: Number(r.OUTSTANDING) || 0,
        }));
        const weightTotal = buildTotalsRow(weightRows, "schemeName", ["opening", "receipt", "chequeReturn", "closedWeight", "outstanding"]);
        const weightData = weightTotal ? [...weightRows, weightTotal] : weightRows;
        const weightColumns = [
            { id: "schemeName", label: "Scheme", align: "left" as const, render: (v: string, row: any) => boldIfTotal(row, v) },
            { id: "groupCode", label: "Group", align: "left" as const, render: (v: string, row: any) => boldIfTotal(row, v) },
            { id: "opening", label: "Opening (g)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, formatNumber(v, "3")) },
            { id: "receipt", label: "Receipt (g)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, formatNumber(v, "3")) },
            { id: "chequeReturn", label: "Cheque Return (g)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, formatNumber(v, "3")) },
            { id: "closedWeight", label: "Closed (g)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, formatNumber(v, "3")) },
            { id: "outstanding", label: "Outstanding (g)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, formatNumber(v, "3")) },
        ];

        // 5. New Member Collection View
        const newMemberRows = (newMemberCollection || []).map((r: any) => ({
            schemeName: r.schemeName ?? r.SCHEMENAME ?? "-",
            group: r.Group ?? "-",
            noOfRects: r["No Of Rects"] ?? 0,
            amount: Number(r.AMOUNT) || 0,
            weight: Number(r.WEIGHT) || 0,
        }));
        const newMemberTotal = buildTotalsRow(newMemberRows, "schemeName", ["noOfRects", "amount", "weight"]);
        const newMemberData = newMemberTotal ? [...newMemberRows, newMemberTotal] : newMemberRows;
        const newMemberColumns = [
            { id: "schemeName", label: "Scheme", align: "left" as const, render: (v: string, row: any) => boldIfTotal(row, v) },
            { id: "group", label: "Group", align: "left" as const, render: (v: string, row: any) => boldIfTotal(row, v) },
            { id: "noOfRects", label: "No of Rects", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, v) },
            { id: "amount", label: "Amount (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `₹ ${formatNumber(v, "2")}`) },
            { id: "weight", label: "Weight (g)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, formatNumber(v, "3")) },
        ];

        return (
            <Box>
                {renderSection("Scheme Receipt Summary", <ResponsiveTable columns={receiptColumns} data={receiptData} stickyHeader />)}
                {renderSection("Collection Summary", <ResponsiveTable columns={collectionColumns} data={collectionData} stickyHeader />)}
                {renderSection("Scheme Summary (Amount)", <ResponsiveTable columns={amountColumns} data={amountData} stickyHeader />)}
                {renderSection("Scheme Summary (Weight)", <ResponsiveTable columns={weightColumns} data={weightData} stickyHeader />)}
                {renderSection("New Member Collection", <ResponsiveTable columns={newMemberColumns} data={newMemberData} stickyHeader />)}
            </Box>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: { xs: 1, md: 2 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: "hidden",
                        mb: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            px: 3,
                            py: 2,
                            backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.12 : 0.06),
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                            }}
                        >
                            <ReceiptLongOutlinedIcon />
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                Scheme Report
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                Select a date range (or as-on date) and scheme to generate the report
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <ToggleButtonGroup
                                value={dateMode}
                                exclusive
                                onChange={handleModeChange}
                                size="small"
                            >
                                <ToggleButton value="range" sx={{ textTransform: "none" }}>
                                    Date Range
                                </ToggleButton>
                                <ToggleButton value="asOn" sx={{ textTransform: "none" }}>
                                    As On Date
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            {dateMode === "range" ? (
                                <>
                                    <DatePicker
                                        label="From Date"
                                        value={fromDate}
                                        onChange={setFromDate}
                                        maxDate={toDate || new Date()}
                                        format="dd/MM/yyyy"
                                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    />
                                    <DatePicker
                                        label="To Date"
                                        value={toDate}
                                        onChange={setToDate}
                                        minDate={fromDate || undefined}
                                        maxDate={new Date()}
                                        format="dd/MM/yyyy"
                                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                                    />
                                </>
                            ) : (
                                <DatePicker
                                    label="As On Date"
                                    value={asOnDate}
                                    onChange={setAsOnDate}
                                    maxDate={new Date()}
                                    format="dd/MM/yyyy"
                                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                                />
                            )}
                            <SchemeAutocomplete value={scheme} onChange={setScheme} />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<RestartAltRoundedIcon />}
                                onClick={handleReset}
                                sx={{ textTransform: "none" }}
                            >
                                Clear
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<VisibilityRoundedIcon />}
                                onClick={handleViewReport}
                                sx={{ textTransform: "none" }}
                            >
                                Show Report
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {renderReport()}
            </Box>
        </LocalizationProvider>
    );
};

export default SchemeReport;
