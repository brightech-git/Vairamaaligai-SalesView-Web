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
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import SchemeAutocomplete from "@/components/ui/SchemeAutocomplete";
import { formatNumber } from "@/lib/numberFormatter";
import { fetchSchemeReport } from "@/service/SchemeReportService";
import type { SchemeListItem } from "@/service/SchemeReportService";
import { useCompanyDetails } from "@/context/CompanyDetailsContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type DateMode = "range" | "asOn";

const TOTAL_LABEL = "Total";

const formatWeight = (v: number) => formatNumber(v, "3");
const formatAmountPdf = (v: number) => formatNumber(v, "2");

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
    const { companyDetails } = useCompanyDetails();

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

    const tables = React.useMemo(() => {
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
            { id: "amount", label: "Amount (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `${formatNumber(v, "2")}`) },
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
            { id: "amount", label: "Amount (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `${formatNumber(v, "2")}`) },
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
            { id: "opening", label: "Opening (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `${formatNumber(v, "2")}`) },
            { id: "receipt", label: "Receipt (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `${formatNumber(v, "2")}`) },
            { id: "closedAmt", label: "Closed (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `${formatNumber(v, "2")}`) },
            { id: "outstanding", label: "Outstanding (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `${formatNumber(v, "2")}`) },
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
            // { id: "groupCode", label: "Group", align: "left" as const, render: (v: string, row: any) => boldIfTotal(row, v) },
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
            { id: "amount", label: "Amount (₹)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, `${formatNumber(v, "2")}`) },
            { id: "weight", label: "Weight (g)", align: "right" as const, render: (v: number, row: any) => boldIfTotal(row, formatNumber(v, "3")) },
        ];

        return {
            receipt: {
                title: "Scheme Receipt Summary",
                hasData: receiptRows.length > 0,
                columns: receiptColumns,
                data: receiptData,
                pdfHead: ["Group", "No of Rects", "Amount", "Weight (g)"],
                pdfBody: receiptData.map((r: any) => [r.group, String(r.noOfRects), formatAmountPdf(r.amount), formatWeight(r.weight)]),
                pdfTextCols: 1,
            },
            collection: {
                title: "Collection Summary",
                hasData: collectionSummary.length > 0,
                columns: collectionColumns,
                data: collectionData,
                pdfHead: ["Collection Type", "Amount"],
                pdfBody: collectionData.map((r: any) => [r.type, formatAmountPdf(r.amount)]),
                pdfTextCols: 1,
            },
            amount: {
                title: "Scheme Summary (Amount)",
                hasData: amountRows.length > 0,
                columns: amountColumns,
                data: amountData,
                pdfHead: ["Scheme", "Opening", "Receipt", "Closed", "Outstanding"],
                pdfBody: amountData.map((r: any) => [r.schemeName, formatAmountPdf(r.opening), formatAmountPdf(r.receipt), formatAmountPdf(r.closedAmt), formatAmountPdf(r.outstanding)]),
                pdfTextCols: 1,
            },
            weight: {
                title: "Scheme Summary (Weight)",
                hasData: weightRows.length > 0,
                columns: weightColumns,
                data: weightData,
                pdfHead: ["Scheme", "Opening (g)", "Receipt (g)", "Cheque Return (g)", "Closed (g)", "Outstanding (g)"],
                pdfBody: weightData.map((r: any) => [r.schemeName, formatWeight(r.opening), formatWeight(r.receipt), formatWeight(r.chequeReturn), formatWeight(r.closedWeight), formatWeight(r.outstanding)]),
                pdfTextCols: 1,
            },
            newMember: {
                title: "New Member Collection",
                hasData: newMemberRows.length > 0,
                columns: newMemberColumns,
                data: newMemberData,
                pdfHead: ["Scheme", "Group", "No of Rects", "Amount", "Weight (g)"],
                pdfBody: newMemberData.map((r: any) => [r.schemeName, r.group, String(r.noOfRects), formatAmountPdf(r.amount), formatWeight(r.weight)]),
                pdfTextCols: 2,
            },
        };
    }, [reportData, receiptSummary, collectionSummary, schemeAmountSummary, schemeWeightSummary, newMemberCollection]);

    const hasReportData =
        !!tables &&
        (tables.receipt.hasData || tables.collection.hasData || tables.amount.hasData || tables.weight.hasData || tables.newMember.hasData);

    const renderReport = () => {
        if (loading) return <TableSkeleton rows={6} columns={4} />;
        if (error)
            return (
                <Box sx={{ p: 3, textAlign: "center", color: theme.palette.error.main }}>
                    <Typography variant="body1">{error}</Typography>
                </Box>
            );
        if (!tables) return null;

        const { receipt, collection, amount, weight, newMember } = tables;
        const showFirstRow = receipt.hasData || collection.hasData;

        if (!showFirstRow && !amount.hasData && !weight.hasData && !newMember.hasData) {
            return (
                <Box sx={{ p: 4, textAlign: "center", color: theme.palette.text.secondary }}>
                    <Typography variant="body1">No data available for the selected filters</Typography>
                </Box>
            );
        }

        return (
            <>
                {/* First row */}
                {showFirstRow && (
                    <Box
                        display="grid"
                        gridTemplateColumns={receipt.hasData && collection.hasData ? "repeat(2, 1fr)" : "1fr"}
                        gap={4}
                    >
                        {receipt.hasData &&
                            renderSection(
                                receipt.title,
                                <ResponsiveTable columns={receipt.columns} data={receipt.data} stickyHeader />
                            )}

                        {collection.hasData &&
                            renderSection(
                                collection.title,
                                <ResponsiveTable columns={collection.columns} data={collection.data} stickyHeader />
                            )}
                    </Box>
                )}

                {/* Remaining sections */}
                {amount.hasData &&
                    renderSection(
                        amount.title,
                        <ResponsiveTable columns={amount.columns} data={amount.data} stickyHeader />
                    )}

                {weight.hasData &&
                    renderSection(
                        weight.title,
                        <ResponsiveTable columns={weight.columns} data={weight.data} stickyHeader />
                    )}

                {newMember.hasData &&
                    renderSection(
                        newMember.title,
                        <ResponsiveTable columns={newMember.columns} data={newMember.data} stickyHeader />
                    )}
            </>
        );
    };

    const handleExportPdf = () => {
        if (!tables) return;

        const effectiveFrom = dateMode === "asOn" ? asOnDate : fromDate;
        const effectiveTo = dateMode === "asOn" ? asOnDate : toDate;
        const periodLabel =
            dateMode === "asOn"
                ? `As On: ${effectiveFrom ? format(effectiveFrom, "dd/MM/yyyy") : "-"}`
                : `Period: ${effectiveFrom ? format(effectiveFrom, "dd/MM/yyyy") : "-"} to ${effectiveTo ? format(effectiveTo, "dd/MM/yyyy") : "-"}`;

        const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;

        // ---- Letterhead ----
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(companyDetails?.COMPANYNAME || "Rangas", margin, 32);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        // const contactLine = [companyDetails?.companyAddress, companyDetails?.CONTACTNUMBER]
        //     .filter(Boolean)
        //     .join("   |   ");
        // if (contactLine) doc.text(contactLine, margin, 48);
        // if (companyDetails?.companyGST) doc.text(`GSTIN: ${companyDetails.companyGST}`, margin, 62);

        doc.setLineWidth(1);
        doc.setDrawColor(0, 0, 0);
        // doc.line(margin, 30, pageWidth - margin, 30);

        let y = 64;

        // ---- Report title & filters ----
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("Scheme Report", margin, y);
        y += 18;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.text(periodLabel, margin, y);
        doc.text(`Scheme: ${scheme?.schemeName || "All Schemes"}`, pageWidth - margin, y, { align: "right" });
        y += 14;
        doc.text(`Generated on: ${format(new Date(), "dd/MM/yyyy hh:mm a")}`, margin, y);
        y += 10;

        const sections = [tables.receipt, tables.collection, tables.amount, tables.weight, tables.newMember].filter(
            (s) => s.hasData
        );

        if (sections.length === 0) {
            doc.setFontSize(11);
            doc.text("No data available for the selected filters.", margin, y + 20);
        }

        const pageHeight = doc.internal.pageSize.getHeight();

        sections.forEach((section) => {
            if (y + 100 > pageHeight - 40) {
                doc.addPage();
                y = 40;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.text(section.title, margin, y + 14);
            doc.setFont("helvetica", "normal");

            const columnStyles: Record<number, { halign: "left" | "right" }> = {};
            section.pdfHead.forEach((_, idx) => {
                columnStyles[idx] = { halign: idx < section.pdfTextCols ? "left" : "right" };
            });

            autoTable(doc, {
                startY: y + 22,
                margin: { left: margin, right: margin },
                head: [section.pdfHead],
                body: section.pdfBody,
                theme: "grid",
                styles: {
                    font: "helvetica",
                    fontSize: 9,
                    cellPadding: 5,
                    textColor: [0, 0, 0],
                    lineColor: [0, 0, 0],
                    lineWidth: 0.5,
                },
                headStyles: {
                    fillColor: [235, 235, 235],
                    textColor: [0, 0, 0],
                    fontStyle: "bold",
                    halign: "center",
                },
                columnStyles,
                alternateRowStyles: { fillColor: [248, 248, 248] },
                didParseCell: (data) => {
                    if (data.section === "body" && data.row.index === section.pdfBody.length - 1) {
                        data.cell.styles.fontStyle = "bold";
                        data.cell.styles.fillColor = [220, 220, 220];
                    }
                },
                didDrawPage: () => {
                    const str = `Page ${doc.getNumberOfPages()}`;
                    doc.setFontSize(8);
                    doc.setTextColor(0, 0, 0);
                    doc.text(str, pageWidth - margin, doc.internal.pageSize.getHeight() - 20, { align: "right" });
                },
            });

            const finalY = (doc as any).lastAutoTable.finalY as number;
            y = finalY + 26;
        });

        const fileSuffix = format(new Date(), "yyyyMMdd_HHmmss");
        doc.save(`Scheme_Report_${fileSuffix}.pdf`);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: "hidden",
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1.5,
                            p :1,
                            backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.12 : 0.06),
                        }}
                    >
                        <Box 
                            sx={{
                            display: "flex",
                            gap: 1.5,
                        }}>
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
                                <Typography variant="caption" sx={{ color: theme.palette.text.primary }}>
                                    Select a date range (or as-on date) and scheme to generate the report
                                </Typography>
                            </Box>
                        </Box>
                       
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
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
                                size="small"
                                sx={{ textTransform: "none"  }}
                            >
                                Show Report
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<PictureAsPdfOutlinedIcon />}
                                onClick={handleExportPdf}
                                disabled={!hasReportData}
                                size="small"
                                sx={{ textTransform: "none" }}
                            >
                                Export PDF
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ p: 1 }}>
                        

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
                                gap: 2,
                                mb: 2,
                                alignItems: "center",
                            }}
                        >
                            <Box>
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

                        {/* <Divider sx={{ my: 2 }} /> */}

                       
                    </Box>
                </Paper>

                {renderReport()}
            </Box>
        </LocalizationProvider>
    );
};

export default SchemeReport;
