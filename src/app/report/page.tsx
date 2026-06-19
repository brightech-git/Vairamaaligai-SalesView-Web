"use client";

import React, { useRef, useState } from "react";
import { Button, Box } from "@mui/material";
import TableCell from "@mui/material/TableCell";

import MultiSelectComboBox from "@/components/ui/MultiSelect";
import SelectBox from "@/components/ui/CustomSelect";
import FormRow from "@/components/ui/FormRow";
import ExportToolbar from "@/components/ui/export/Exporttoolbar";

import {
    useMetals, useAllReports, useItems,
    useRanges, useSizes, useSubItems, useCostCentre,
} from "@/hooks/useReport";

import { useThemeContext } from "@/context/ThemeContext";
import ResponsiveTable, { Column, SubColumn, GROUP_PALETTES } from "@/components/ui/table/ReportTabel";
import { formatToNumber } from "@/lib/numberFormatter";
import { exportToExcel, exportToPDF, ExportColumn, } from '@/components/ui/export/ReportExport';
import { fontSize } from "@mui/system";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type OptionType = { label: string; value: string };

type ReportRow = {
    itemName?: string; subItemName?: string; range?: string; size?:String;
    fhtags?: number; fhpcs?: number; fhgrswt?: number; fhnetwt?: number;
    fjtags?: number; fjpcs?: number; fjgrswt?: number; fjnetwt?: number;
    fttags?: number; ftpcs?: number; ftgrswt?: number; ftnetwt?: number;
    fltags?: number; flpcs?: number; flgrswt?: number; flnetwt?: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// TABLE COLUMNS
// ─────────────────────────────────────────────────────────────────────────────

const columns: Column[] = [
    { id: "itemName", label: "ITEM", align: "left" },
    { id: "subItemName", label: "SUBITEM", align: "left" },
    { id: "size", label: "SIZE", align: "left" },
    { id: "range", label: "RANGE", align: "left" },
    { id: "FH", label: "HEAD OFFICE", align: "center" },
    { id: "FJ", label: "JN ROAD", align: "center" },
    { id: "FT", label: "THIRUTTANI", align: "center" },
    { id: "FL", label: "THIRUVALLUR", align: "center" },
];

const subColumns: SubColumn[] = [
    { id: "fhTags", label: "TAGS", parentColumnId: "FH", align: "right" },
    { id: "fhPcs", label: "PCS", parentColumnId: "FH", align: "right" },
    { id: "fhGrswt", label: "GRSWT", parentColumnId: "FH", align: "right" },
    { id: "fhNetwt", label: "NETWT", parentColumnId: "FH", align: "right" },
    { id: "fjTags", label: "TAGS", parentColumnId: "FJ", align: "right" },
    { id: "fjPcs", label: "PCS", parentColumnId: "FJ", align: "right" },
    { id: "fjGrswt", label: "GRSWT", parentColumnId: "FJ", align: "right" },
    { id: "fjNetwt", label: "NETWT", parentColumnId: "FJ", align: "right" },
    { id: "ftTags", label: "TAGS", parentColumnId: "FT", align: "right" },
    { id: "ftPcs", label: "PCS", parentColumnId: "FT", align: "right" },
    { id: "ftGrswt", label: "GRSWT", parentColumnId: "FT", align: "right" },
    { id: "ftNetwt", label: "NETWT", parentColumnId: "FT", align: "right" },
    { id: "flTags", label: "TAGS", parentColumnId: "FL", align: "right" },
    { id: "flPcs", label: "PCS", parentColumnId: "FL", align: "right" },
    { id: "flGrswt", label: "GRSWT", parentColumnId: "FL", align: "right" },
    { id: "flNetwt", label: "NETWT", parentColumnId: "FL", align: "right" },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT COLUMNS
// ─────────────────────────────────────────────────────────────────────────────

const exportColumns: ExportColumn[] = [
    { key: "itemName", header: "ITEM", align: "left" },
    { key: "subItemName", header: "SUBITEM", align: "left" },
    { key: "range", header: "RANGE", align: "left" },
    

    { key: "fhtags", header: "HO - TAGS", align: "right", decimals: 0 },
    { key: "fhpcs", header: "HO - PCS", align: "right", decimals: 0 },
    { key: "fhgrswt", header: "HO - GRSWT", align: "right", decimals: 3 },
    { key: "fhnetwt", header: "HO - NETWT", align: "right", decimals: 3 },

    { key: "fjtags", header: "JNR - TAGS", align: "right", decimals: 0 },
    { key: "fjpcs", header: "JNR - PCS", align: "right", decimals: 0 },
    { key: "fjgrswt", header: "JNR - GRSWT", align: "right", decimals: 3 },
    { key: "fjnetwt", header: "JNR - NETWT", align: "right", decimals: 3 },

    { key: "fttags", header: "THR - TAGS", align: "right", decimals: 0 },
    { key: "ftpcs", header: "THR - PCS", align: "right", decimals: 0 },
    { key: "ftgrswt", header: "THR - GRSWT", align: "right", decimals: 3 },
    { key: "ftnetwt", header: "THR - NETWT", align: "right", decimals: 3 },

    { key: "fltags", header: "TVAL - TAGS", align: "right", decimals: 0 },
    { key: "flpcs", header: "TVAL - PCS", align: "right", decimals: 0 },
    { key: "flgrswt", header: "TVAL - GRSWT", align: "right", decimals: 3 },
    { key: "flnetwt", header: "TVAL - NETWT", align: "right", decimals: 3 },
];

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR HELPERS
// GROUP_PALETTES[0] = HEAD OFFICE (Blue)
// GROUP_PALETTES[1] = JN ROAD     (Green)
// GROUP_PALETTES[2] = THIRUTTANI  (Orange)
// GROUP_PALETTES[3] = THIRUVALLUR (Purple)
// ─────────────────────────────────────────────────────────────────────────────

// Convert "rgb(r,g,b)" string → MUI sx-compatible string (already valid CSS)
const P = GROUP_PALETTES;   // shorthand

/** sx object for a data body cell belonging to group gi */
function dataSx(gi: number) {
    return { backgroundColor: P[gi].dataTint, color: "#000" , fontSize:'12px' };
}

/** sx object for a total/foot cell belonging to group gi */
function footSx(gi: number) {
    return { backgroundColor: P[gi].foot, color: "#fff", fontWeight: 700 ,fontSize:'14px'};
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN
// ─────────────────────────────────────────────────────────────────────────────

const ReportScreen = () => {
    const itemRef = useRef<HTMLInputElement>(null);
    const subItemRef = useRef<HTMLInputElement>(null);
    const rangeRef = useRef<HTMLInputElement>(null);
    const sizeRef = useRef<HTMLInputElement>(null);
    const costRef = useRef<HTMLInputElement>(null);

    const { colors } = useThemeContext();

    const [viewMode, setViewMode] = useState<"form" | "table">("form");
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<any>(null);

    const [form, setForm] = useState({
        metal: "", item: "", subItem: "",
        range: [] as OptionType[],
        size: "", cost: "", tag: "",
        selectionType: "", reportType: "", displayType: "",
    });

    const handleChange = (name: string, value: any) =>
        setForm((prev) => ({ ...prev, [name]: value }));

    // ── API ──────────────────────────────────────────────────────────────────
    const { data, isLoading } = useAllReports(filters, true);

    console.log(data,'data')

    const { data: metals = [] } = useMetals();
    const { data: items = [] } = useItems();
    const { data: costCenter = [] } = useCostCentre();
    const { data: subItems = [] } = useSubItems(form.item ? Number(form.item) : undefined);
    const { data: sizes = [] } = useSizes(form.item ? Number(form.item) : undefined);
    const { data: rangesData } = useRanges({
        itemId: form.item ? Number(form.item) : undefined,
        subItemId: form.subItem ? Number(form.subItem) : undefined,
        page: 0, pageSize: 10,
    });

    const ALL_OPTION = { label: "ALL", value: "ALL" };

    const metalsOptionList = [ALL_OPTION, ...(metals?.map((m) => ({ label: String(m.METALNAME), value: String(m.METALID) })) ?? [])];
    const itemList = [ALL_OPTION, ...(items?.map((m) => ({ label: String(m.ITEMNAME), value: String(m.ITEMID) })) ?? [])];
    const subItemOptionList = [ALL_OPTION, ...(subItems?.map((m) => ({ label: String(m.SUBITEMNAME), value: String(m.SUBITEMID) })) ?? [])];
    const sizeList = [ALL_OPTION, ...(sizes?.map((m) => ({ label: String(m.SIZENAME), value: String(m.SIZEID) })) ?? [])];
    const rangeOptions = [ALL_OPTION, ...(rangesData?.map((r: any) => ({ label: String(r), value: String(r) })) ?? [])];
    const costCenters = [ALL_OPTION, ...(costCenter?.map((c) => ({ label: String(c.COSTNAME), value: String(c.COSTID) })) ?? [])];

    const reportData: ReportRow[] = data?.data || [];

    console.log(reportData,'reportData');

    // ── Export subtitle ──────────────────────────────────────────────────────
    const buildSubtitle = () => {
        const parts: string[] = [];
        if (form.metal) parts.push(`Metal: ${metalsOptionList.find(m => m.value === form.metal)?.label ?? form.metal}`);
        if (form.item) parts.push(`Item: ${itemList.find(i => i.value === form.item)?.label ?? form.item}`);
        if (form.subItem) parts.push(`Sub Item: ${subItemOptionList.find(s => s.value === form.subItem)?.label ?? form.subItem}`);
        if (form.size) parts.push(`Size: ${sizeList.find(s => s.value === form.size)?.label ?? form.size}`);
        if (form.cost) parts.push(`Cost Centre: ${costCenters.find(c => c.value === form.cost)?.label ?? form.cost}`);
        if (form.range.length) parts.push(`Range: ${form.range.map(r => r.label).join(", ")}`);
        return parts.join("  |  ");
    };

    // ── Export handlers ──────────────────────────────────────────────────────
    const handleExcelExport = () =>
        exportToExcel(reportData, exportColumns, {
            fileName: "stock-report", sheetName: "Stock Report",
            title: "STOCK REPORT", subtitle: buildSubtitle(),
            selectedCostId: form.cost || undefined,
        });

    const handlePdfExport = () =>
        exportToPDF(reportData, exportColumns, {
            fileName: "stock-report", title: "STOCK REPORT",
            subtitle: buildSubtitle(), selectedCostId: form.cost || undefined,
        });

    // ── Actions ──────────────────────────────────────────────────────────────
    const handleView = () => {
        setPage(0);
        setFilters({
            itemId: form.item, subItemId: form.subItem,
            metalId: form.metal, sizeId: form.size, costId: form.cost,
            range: form.range.map((r) => r.value).join(","),
            page: 0, pageSize,
        });
        setViewMode("table");
    };

    const handleClear = () => {
        setForm({ metal: "", item: "", subItem: "", range: [], size: "", cost: "", tag: "", selectionType: "", reportType: "", displayType: "" });
        setFilters(null);
        setViewMode("form");
        setPage(0);
    };

    React.useEffect(() => {
        if (!filters) return;
        setFilters((prev: any) => ({ ...prev, page, pageSize }));
    }, [page, pageSize]);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <Box display="flex" flexDirection="column" gap={2} mt={{xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>

            {/* ═══════════ FILTER FORM ═══════════ */}
            {viewMode === "form" && (
                <Box maxWidth={600} mx="auto" bgcolor={colors?.background.greyColor} p={1}>
                    <Box sx={{ color: colors?.text.primary, mb: 1, fontWeight: 600, textAlign: "center" }}>
                        STOCK REPORT
                    </Box>
                    <FormRow label="Metal" >
                        <SelectBox options={metalsOptionList} value={form.metal} fieldName="metal" onChange={handleChange} nextRef={itemRef} size="small" placeHolder="ALL" fontSize={{xs:"10px" ,sm:"12px",md:"14px"}} />
                    </FormRow>
                    <FormRow label="Item Name">
                        <SelectBox options={itemList} value={form.item} fieldName="item" onChange={handleChange} ref={itemRef} nextRef={subItemRef} size="small" placeHolder="ALL" fontSize={{ xs: "10px", sm: "12px", md: "14px" }} />
                    </FormRow>
                    <FormRow label="Sub Item">
                        <SelectBox options={subItemOptionList} fieldName="subItem" value={form.subItem} onChange={handleChange} ref={subItemRef} nextRef={rangeRef} size="small" placeHolder="ALL" fontSize={{ xs: "10px", sm: "12px", md: "14px" }} />
                    </FormRow>
                    <FormRow label="Range">
                        <MultiSelectComboBox fieldName="range" options={rangeOptions} value={form.range} onChange={handleChange} ref={rangeRef} nextRef={sizeRef}  />
                    </FormRow>
                    <FormRow label="Size">
                        <SelectBox options={sizeList} fieldName="size" value={form.size} onChange={handleChange} ref={sizeRef} nextRef={costRef} placeHolder="ALL" fontSize={{ xs: "10px", sm: "12px", md: "14px" }} />
                    </FormRow>
                    <FormRow label="Cost Centre">
                        <SelectBox options={costCenters} value={form.cost} fieldName="cost" onChange={handleChange} ref={costRef} placeHolder="ALL" />
                    </FormRow>
                    <Box display="flex" justifyContent="center" gap={2} mt={3}>
                        <Button variant="contained" onClick={handleView}>Show</Button>
                        <Button variant="outlined" onClick={handleClear}>Clear</Button>
                    </Box>
                </Box>
            )}

            {/* ═══════════ TABLE VIEW ═══════════ */}
            {viewMode === "table" && (
                <Box width="100%" display="flex" flexDirection="column" gap={1.5}>

                    {/* Top bar */}
                    <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                        <Button variant="outlined" size="small" onClick={() => setViewMode("form")} sx={{fontSize:{xs:"8px" ,sm:"10px",lg:"12px"}}}> ← Back</Button>
                        <Box flex={1} minWidth={0}>
                            <ExportToolbar
                                title="Stock Report"
                                recordCount={data?.totalRecords ?? reportData.length}
                                disabled={isLoading || reportData.length === 0}
                                onExcelExport={handleExcelExport}
                                onPdfExport={handlePdfExport}
                            />
                        </Box>
                    </Box>

                    {/* Table */}
                    <ResponsiveTable<ReportRow>
                        columns={columns}
                        subColumns={subColumns}
                        data={reportData}
                        stickyHeader
                        loading={isLoading}

                        renderRow={(row) => (
                            <>
                                {/* ── Lead columns (no tint) ── */}
                                <TableCell align="left" sx={{fontSize:'10px'}}>{row.itemName ?? ""}</TableCell>
                                <TableCell align="left" sx={{ fontSize: '10px' }}>{row.subItemName ?? ""}</TableCell>
                                <TableCell align="left" sx={{ fontSize: '10px' }}>{row.size ?? ""}</TableCell>
                                <TableCell align="left" sx={{ fontSize: '10px' }} >{row.range ?? ""}</TableCell>

                                {/* ── GROUP 0 — HEAD OFFICE (Blue) ── */}
                                <TableCell align="right" sx={dataSx(0)} >{formatToNumber(row.fhtags, 0)}</TableCell>
                                <TableCell align="right" sx={dataSx(0)} >{formatToNumber(row.fhpcs, 0)}</TableCell>
                                <TableCell align="right" sx={dataSx(0)} >{formatToNumber(row.fhgrswt, 3)}</TableCell>
                                <TableCell align="right" sx={dataSx(0)} >{formatToNumber(row.fhnetwt, 3)}</TableCell>

                                {/* ── GROUP 1 — JN ROAD (Green) ── */}
                                <TableCell align="right" sx={dataSx(1)} >{formatToNumber(row.fjtags, 0)}</TableCell>
                                <TableCell align="right" sx={dataSx(1)} >{formatToNumber(row.fjpcs, 0)}</TableCell>
                                <TableCell align="right" sx={dataSx(1)} >{formatToNumber(row.fjgrswt, 3)}</TableCell>
                                <TableCell align="right" sx={dataSx(1)} >{formatToNumber(row.fjnetwt, 3)}</TableCell>

                                {/* ── GROUP 2 — THIRUTTANI (Orange) ── */}
                                <TableCell align="right" sx={dataSx(2)} >{formatToNumber(row.fttags, 0)}</TableCell>
                                <TableCell align="right" sx={dataSx(2)} >{formatToNumber(row.ftpcs, 0)}</TableCell>
                                <TableCell align="right" sx={dataSx(2)} >{formatToNumber(row.ftgrswt, 3)}</TableCell>
                                <TableCell align="right" sx={dataSx(2)} >{formatToNumber(row.ftnetwt, 3)}</TableCell>

                                {/* ── GROUP 3 — THIRUVALLUR (Purple) ──*/}
                                <TableCell align="right" sx={dataSx(3)} >{formatToNumber(row.fltags, 0)}</TableCell>
                                <TableCell align="right" sx={dataSx(3)} >{formatToNumber(row.flpcs, 0)}</TableCell>
                                <TableCell align="right" sx={dataSx(3)} >{formatToNumber(row.flgrswt, 3)}</TableCell>
                                <TableCell align="right" sx={dataSx(3)} >{formatToNumber(row.flnetwt, 3)}</TableCell>
                            </>
                        )}

                        renderTotalRow={(allData) => {
                            const sum = (key: keyof ReportRow) =>
                                allData.reduce((acc, r) => acc + ((r[key] as number) || 0), 0);

                            return (
                                <>
                                    {/* Lead total cells */}
                                    <TableCell sx={{ fontWeight: 700, color: "#FFF" }}>TOTAL</TableCell>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />

                                    {/* GROUP 0 — HEAD OFFICE */}
                                    <TableCell align="right" sx={footSx(0)}>{formatToNumber(sum("fhtags"), 0)}</TableCell>
                                    <TableCell align="right" sx={footSx(0)}>{formatToNumber(sum("fhpcs"), 0)}</TableCell>
                                    <TableCell align="right" sx={footSx(0)}>{formatToNumber(sum("fhgrswt"), 3)}</TableCell>
                                    <TableCell align="right" sx={footSx(0)}>{formatToNumber(sum("fhnetwt"), 3)}</TableCell>

                                    {/* GROUP 1 — JN ROAD */}
                                    <TableCell align="right" sx={footSx(1)}>{formatToNumber(sum("fjtags"), 0)}</TableCell>
                                    <TableCell align="right" sx={footSx(1)}>{formatToNumber(sum("fjpcs"), 0)}</TableCell>
                                    <TableCell align="right" sx={footSx(1)}>{formatToNumber(sum("fjgrswt"), 3)}</TableCell>
                                    <TableCell align="right" sx={footSx(1)}>{formatToNumber(sum("fjnetwt"), 3)}</TableCell>

                                    {/* GROUP 2 — THIRUTTANI */}
                                    <TableCell align="right" sx={footSx(2)}>{formatToNumber(sum("fttags"), 0)}</TableCell>
                                    <TableCell align="right" sx={footSx(2)}>{formatToNumber(sum("ftpcs"), 0)}</TableCell>
                                    <TableCell align="right" sx={footSx(2)}>{formatToNumber(sum("ftgrswt"), 3)}</TableCell>
                                    <TableCell align="right" sx={footSx(2)}>{formatToNumber(sum("ftnetwt"), 3)}</TableCell>

                                    {/* GROUP 3 — THIRUVALLUR */}
                                    <TableCell align="right" sx={footSx(3)}>{formatToNumber(sum("fltags"), 0)}</TableCell>
                                    <TableCell align="right" sx={footSx(3)}>{formatToNumber(sum("flpcs"), 0)}</TableCell>
                                    <TableCell align="right" sx={footSx(3)}>{formatToNumber(sum("flgrswt"), 3)}</TableCell>
                                    <TableCell align="right" sx={footSx(3)}>{formatToNumber(sum("flnetwt"), 3)}</TableCell>
                                </>
                            );
                        }}

                        pagination={{
                            page,
                            pageSize,
                            total: data?.totalRecords || 0,
                            onPageChange: setPage,
                            onPageSizeChange: setPageSize,
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default ReportScreen;