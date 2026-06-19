import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportColumn {
    header: string;
    key: string;
    align?: "left" | "right" | "center";
    decimals?: number;
}

export interface ExportOptions {
    fileName?: string;
    sheetName?: string;
    title?: string;
    subtitle?: string;
    /** The costId of the selected cost center. Pass undefined or "ALL" for none. */
    selectedCostId?: string;
}

type AnyRow = Record<string, any>;

// ─────────────────────────────────────────────────────────────────────────────
// COST CENTER CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export interface CostCenterGroup {
    costId: string;
    label: string;
    keyPrefix: string;
}

export const COST_CENTER_GROUPS: CostCenterGroup[] = [
    { costId: "FH", label: "HEAD OFFICE", keyPrefix: "fh" },
    { costId: "FJ", label: "JN ROAD", keyPrefix: "fj" },
    { costId: "FT", label: "THIRUTTANI", keyPrefix: "ft" },
    { costId: "FL", label: "THIRUVALLUR", keyPrefix: "fl" },
];

const SUB_COLS = [
    { suffix: "tags", header: "TAGS", decimals: 0 },
    { suffix: "pcs", header: "PCS", decimals: 0 },
    { suffix: "grswt", header: "GRSWT", decimals: 3 },
    { suffix: "netwt", header: "NETWT", decimals: 3 },
] as const;

const LEAD_COLS: ExportColumn[] = [
    { key: "itemName", header: "ITEM", align: "left" },
    { key: "subItemName", header: "SUBITEM", align: "left" },
    { key: "size", header: "SIZE", align: "left" },
    { key: "range", header: "RANGE", align: "left" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COLOR PALETTE  (RGB as [r,g,b] and as "RRGGBB" hex)
// One entry per cost-center group — group header / sub-header / data tint
// ─────────────────────────────────────────────────────────────────────────────

type RGB = [number, number, number];

interface GroupPalette {
    /** Group header row  (strong) */
    header: RGB;
    /** Sub-column header row (slightly darker than header) */
    subHeader: RGB;
    /** Data cell tint (very light)  */
    dataTint: RGB;
    /** Total/foot row (same as header) */
    foot: RGB;
}

export const GROUP_PALETTES: GroupPalette[] = [
    // Blue  — HEAD OFFICE
    { header: [66, 165, 245], subHeader: [26, 125, 205], dataTint: [232, 244, 253], foot: [66, 165, 245] },
    // Green — JN ROAD
    { header: [102, 187, 106], subHeader: [62, 147, 66], dataTint: [232, 245, 233], foot: [102, 187, 106] },
    // Orange — THIRUTTANI
    { header: [255, 167, 38], subHeader: [215, 127, 0], dataTint: [255, 248, 225], foot: [255, 167, 38] },
    // Purple — THIRUVALLUR
    { header: [171, 71, 188], subHeader: [131, 31, 148], dataTint: [243, 229, 245], foot: [171, 71, 188] },
];

/** Highlight overlays when a group is selected */
const SELECTED_HEADER_OVERLAY: RGB = [245, 127, 23];   // amber tint on header
const SELECTED_DATA_OVERLAY: RGB = [255, 243, 197];   // stronger pale amber on data cells

/** Convert RGB tuple → "RRGGBB" hex string for XLSX */
function toHex([r, g, b]: RGB): string {
    return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatCell(value: any, decimals?: number): string | number {
    if (value == null || value === "" || value === 0) return "";
    if (typeof value === "number") {
        return decimals !== undefined ? value.toFixed(decimals) : value;
    }
    return String(value);
}

function buildFlatColumns(): ExportColumn[] {
    const cols: ExportColumn[] = [...LEAD_COLS];
    for (const grp of COST_CENTER_GROUPS) {
        for (const sub of SUB_COLS) {
            cols.push({ key: `${grp.keyPrefix}${sub.suffix}`, header: sub.header, align: "right", decimals: sub.decimals });
        }
    }
    return cols;
}

function buildRows(data: AnyRow[], columns: ExportColumn[]): (string | number)[][] {
    return data.map((row) => columns.map((col) => formatCell(row[col.key], col.decimals)));
}

function buildTotalRow(data: AnyRow[], columns: ExportColumn[]): (string | number)[] {
    return columns.map((col, i) => {
        if (i === 0) return "TOTAL";
        const isNumeric = data.every((r) => r[col.key] == null || typeof r[col.key] === "number");
        if (!isNumeric) return "";
        const sum = data.reduce((acc, r) => acc + (Number(r[col.key]) || 0), 0);
        return formatCell(sum, col.decimals);
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// EXCEL EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export function exportToExcel(
    data: AnyRow[],
    _columns: ExportColumn[],
    options: ExportOptions = {}
) {
    const { fileName = "report", sheetName = "Report", title = "Report", subtitle = "", selectedCostId } = options;

    const flatCols = buildFlatColumns();
    const colCount = flatCols.length;
    const dataRows = buildRows(data, flatCols);
    const total = buildTotalRow(data, flatCols);

    const wsData: any[][] = [];
    wsData.push([title, ...Array(colCount - 1).fill("")]);
    if (subtitle) wsData.push([subtitle, ...Array(colCount - 1).fill("")]);
    wsData.push(Array(colCount).fill(""));                        // spacer

    // Group header row
    const groupRow: string[] = ["ITEM", "SUBITEM", "SIZE","RANGE"];
    for (const grp of COST_CENTER_GROUPS) groupRow.push(grp.label, "", "", "");
    wsData.push(groupRow);

    // Sub-column header row
    const subRow: string[] = ["", "", ""];
    for (const _grp of COST_CENTER_GROUPS) for (const sub of SUB_COLS) subRow.push(sub.header);
    wsData.push(subRow);

    wsData.push(Array(colCount).fill(""));                        // spacer before data
    dataRows.forEach((r) => wsData.push(r));
    wsData.push(Array(colCount).fill(""));                        // spacer before total
    wsData.push(total);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = flatCols.map((_, i) => ({ wch: i < 3 ? 16 : 10 }));

    // Row indices
    const titleRowIdx = 0;
    const subtitleOffset = subtitle ? 1 : 0;
    const groupRowIdx = 2 + subtitleOffset;
    const subRowIdx = groupRowIdx + 1;
    const dataStartIdx = subRowIdx + 2;                         // +2 for spacer
    const totalRowIdx = dataStartIdx + dataRows.length + 1;    // +1 for spacer

    // Merges
    const merges: XLSX.Range[] = [];
    merges.push({ s: { r: titleRowIdx, c: 0 }, e: { r: titleRowIdx, c: colCount - 1 } });
    if (subtitle) merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } });
    for (let c = 0; c < 3; c++) merges.push({ s: { r: groupRowIdx, c }, e: { r: subRowIdx, c } });
    COST_CENTER_GROUPS.forEach((_, gi) => {
        const startC = 3 + gi * 4;
        merges.push({ s: { r: groupRowIdx, c: startC }, e: { r: groupRowIdx, c: startC + 3 } });
    });
    ws["!merges"] = merges;

    // Style helpers
    const C_WHITE = "FFFFFF";
    const C_BLACK = "000000";
    const C_LEAD = "1565C0";
    const C_LEAD_DARK = "0D47A1";
    const border = {
        top: { style: "thin", color: { rgb: C_BLACK } }, bottom: { style: "thin", color: { rgb: C_BLACK } },
        left: { style: "thin", color: { rgb: C_BLACK } }, right: { style: "thin", color: { rgb: C_BLACK } },
    };

    function hdrStyle(hexBg: string, sz = 9): any {
        return { font: { bold: true, color: { rgb: C_WHITE }, sz }, fill: { fgColor: { rgb: hexBg } }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border };
    }

    // Title
    const tRef = XLSX.utils.encode_cell({ r: titleRowIdx, c: 0 });
    if (ws[tRef]) ws[tRef].s = { font: { bold: true, color: { rgb: C_WHITE }, sz: 14 }, fill: { fgColor: { rgb: C_LEAD } }, alignment: { horizontal: "center", vertical: "center" } };

    // Lead column headers (ITEM / SUBITEM /SIZE / RANGE)
    for (let c = 0; c < 3; c++) {
        const ref = XLSX.utils.encode_cell({ r: groupRowIdx, c });
        if (ws[ref]) ws[ref].s = hdrStyle(C_LEAD, 9);
    }

    // Per-group coloring
    COST_CENTER_GROUPS.forEach((grp, gi) => {
        const startC = 3 + gi * 4;
        const palette = GROUP_PALETTES[gi % GROUP_PALETTES.length];
        const isSelected = !!selectedCostId && selectedCostId !== "ALL" && selectedCostId === grp.costId;

        const headerHex = isSelected ? toHex(SELECTED_HEADER_OVERLAY) : toHex(palette.header);
        const subHeaderHex = toHex(palette.subHeader);
        const dataTintHex = isSelected ? toHex(SELECTED_DATA_OVERLAY) : toHex(palette.dataTint);
        const footHex = toHex(palette.foot);

        // Group header cell
        const gRef = XLSX.utils.encode_cell({ r: groupRowIdx, c: startC });
        if (ws[gRef]) ws[gRef].s = hdrStyle(headerHex, 9);

        // Sub-column headers
        for (let s = 0; s < 4; s++) {
            const sRef = XLSX.utils.encode_cell({ r: subRowIdx, c: startC + s });
            if (ws[sRef]) ws[sRef].s = hdrStyle(subHeaderHex, 8);
        }

        // Data cells
        for (let dr = 0; dr < dataRows.length; dr++) {
            for (let s = 0; s < 4; s++) {
                const dRef = XLSX.utils.encode_cell({ r: dataStartIdx + dr, c: startC + s });
                if (!ws[dRef]) ws[dRef] = { t: "z" };
                ws[dRef].s = { fill: { fgColor: { rgb: dataTintHex } }, alignment: { horizontal: "right" }, border };
            }
        }

        // Total/foot cells
        for (let s = 0; s < 4; s++) {
            const fRef = XLSX.utils.encode_cell({ r: totalRowIdx, c: startC + s });
            if (ws[fRef]) ws[fRef].s = { font: { bold: true, color: { rgb: C_WHITE }, sz: 10 }, fill: { fgColor: { rgb: footHex } }, alignment: { horizontal: "right", vertical: "center" }, border };
        }
    });

    // Lead total cells (ITEM / SUBITEM /SIZE / RANGE in total row)
    for (let c = 0; c < 3; c++) {
        const ref = XLSX.utils.encode_cell({ r: totalRowIdx, c });
        if (ws[ref]) ws[ref].s = { font: { bold: true, color: { rgb: C_WHITE }, sz: 10 }, fill: { fgColor: { rgb: C_LEAD_DARK } }, alignment: { horizontal: c === 0 ? "left" : "center", vertical: "center" }, border };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export function exportToPDF(
    data: AnyRow[],
    _columns: ExportColumn[],
    options: ExportOptions = {}
) {
    const { fileName = "report", title = "Report", subtitle = "", selectedCostId } = options;

    const flatCols = buildFlatColumns();
    const rows = buildRows(data, flatCols);
    const total = buildTotalRow(data, flatCols);

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 5;
    let cursorY = margin;

    // Title
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(21, 101, 192);
    doc.text(title, pageWidth / 2, cursorY + 6, { align: "center" });
    cursorY += 10;

    // Subtitle
    if (subtitle) {
        doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
        doc.text(subtitle, pageWidth / 2, cursorY + 4, { align: "center" });
        cursorY += 8;
    }

    // Generated date
    doc.setFontSize(8); doc.setTextColor(150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, cursorY, { align: "right" });
    cursorY += 4;

    const LEAD_BLUE: RGB = [21, 101, 192];
    const LEAD_DARK: RGB = [13, 71, 161];

    // ── Head row 1 — group labels ─────────────────────────────────────────
    const headRow1: any[] = [
        { content: "ITEM", rowSpan: 2, styles: { halign: "center", fillColor: LEAD_BLUE, textColor: 255, fontStyle: "bold" } },
        { content: "SUBITEM", rowSpan: 2, styles: { halign: "center", fillColor: LEAD_BLUE, textColor: 255, fontStyle: "bold" } },
        { content: "SIZE", rowSpan: 2, styles: { halign: "center", fillColor: LEAD_BLUE, textColor: 255, fontStyle: "bold" } },
        { content: "RANGE", rowSpan: 2, styles: { halign: "center", fillColor: LEAD_BLUE, textColor: 255, fontStyle: "bold" } },
    ];

    COST_CENTER_GROUPS.forEach((grp, gi) => {
        const palette = GROUP_PALETTES[gi % GROUP_PALETTES.length];
        const isSelected = !!selectedCostId && selectedCostId !== "ALL" && selectedCostId === grp.costId;
        const fillColor = isSelected ? SELECTED_HEADER_OVERLAY : palette.header;
        headRow1.push({ content: grp.label, colSpan: 4, styles: { halign: "center", fillColor, textColor: 255, fontStyle: "bold" } });
    });

    // ── Head row 2 — sub-column labels ────────────────────────────────────
    const headRow2: any[] = [];
    COST_CENTER_GROUPS.forEach((_, gi) => {
        const palette = GROUP_PALETTES[gi % GROUP_PALETTES.length];
        SUB_COLS.forEach((sub) => {
            headRow2.push({ content: sub.header, styles: { halign: "center", fillColor: palette.subHeader, textColor: 255 } });
        });
    });

    // Column alignment
    const columnStyles: Record<number, any> = {};
    flatCols.forEach((_, i) => { columnStyles[i] = { halign: i < 3 ? "left" : "right" }; });

    const selectedGroupIdx = selectedCostId && selectedCostId !== "ALL"
        ? COST_CENTER_GROUPS.findIndex((g) => g.costId === selectedCostId) : -1;
    const selectedStartCol = selectedGroupIdx >= 0 ? 3 + selectedGroupIdx * 4 : -1;

    autoTable(doc, {
        head: [headRow1, headRow2],
        body: rows,
        foot: [total],
        startY: cursorY,
        margin: { left: margin, right: margin },

        styles: { fontSize: 7, cellPadding: 1 },

        headStyles: { textColor: 255, fontStyle: "bold", halign: "center" },

        footStyles: { fillColor: LEAD_DARK, textColor: 255, fontStyle: "bold" },

        columnStyles,

        didParseCell(hookData) {
            const col = hookData.column.index;
            if (col < 3) return;

            const gi = Math.floor((col - 3) / 4);
            const palette = GROUP_PALETTES[gi % GROUP_PALETTES.length];
            const isSelGroup = selectedStartCol >= 0 && col >= selectedStartCol && col < selectedStartCol + 4;

            if (hookData.section === "body") {
                hookData.cell.styles.fillColor = isSelGroup ? SELECTED_DATA_OVERLAY : palette.dataTint;
                hookData.cell.styles.textColor = [0, 0, 0];
            }

            if (hookData.section === "foot") {
                hookData.cell.styles.fillColor = isSelGroup ? SELECTED_HEADER_OVERLAY : palette.foot;
                hookData.cell.styles.textColor = [255, 255, 255];
            }

            if (hookData.section === "foot") {
                hookData.cell.styles.halign = col === 0 ? "left" : "right";
            }
        },

        didDrawPage(hookData) {
            const pageCount = (doc as any).internal.getNumberOfPages();
            doc.setFontSize(7); doc.setTextColor(150);
            doc.text(`Page ${hookData.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 5, { align: "center" });
        },
    });

    doc.save(`${fileName}.pdf`);
}