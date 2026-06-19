"use client";


import React, { useState } from "react";
import {
    Box,
    Button,
    Tooltip,
    CircularProgress,
    Typography,
    Divider,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";

interface ExportToolbarProps {
    onExcelExport: () => Promise<void> | void;
    onPdfExport: () => Promise<void> | void;
    /** Label shown on the left e.g. "125 records" */
    recordCount?: number;
    disabled?: boolean;
    title?: string;
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({
    onExcelExport,
    onPdfExport,
    recordCount,
    disabled = false,
    title,
}) => {
    const [excelLoading, setExcelLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    const handleExcel = async () => {
        setExcelLoading(true);
        try { await onExcelExport(); }
        finally { setExcelLoading(false); }
    };

    const handlePdf = async () => {
        setPdfLoading(true);
        try { await onPdfExport(); }
        finally { setPdfLoading(false); }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
       

            flexDirection={"row"}
            gap={0}
            px={1.5}
            py={1}
            sx={{
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
        >
            {/* Left side — title + record count */}
            <Box display="flex" alignItems="center" flexDirection={"column"} gap={1}>
                
                {title && (
                    <Box display="flex" alignItems="center" flexDirection={"row"} gap={1}>
                    <TableChartIcon sx={{ fontSize:{xs:10 ,sm:12 ,md:14,lg:16}, color: "primary.main" }} />
                    <Typography variant="body2" sx={{ fontSize:{xs:10 ,sm:12 ,md:14,lg:16}}} fontWeight={600} color="text.primary">
                        {title}
                    </Typography>
                    </Box>
                )}
                {recordCount !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                        ({recordCount.toLocaleString()} records)
                    </Typography>
                )}
            </Box>

            {/* Right side — export buttons */}
            <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontSize: { xs: 8, sm: 10, md: 12, lg: 14 } }}>
                    Export as:
                </Typography>

                <Tooltip title="Download Excel (.xlsx)" arrow>
                    <span>
                        <Button
                            size="small"
                            variant="outlined"
                            disabled={disabled || excelLoading}
                            onClick={handleExcel}
                            startIcon={
                                excelLoading
                                    ? <CircularProgress size={14} color="inherit" />
                                    : <FileDownloadIcon />
                            }
                            sx={{
                                borderColor: "#1B5E20",
                                color: "#1B5E20",
                                fontWeight: 600,
                                fontSize: { xs: 10, sm: 12, md: 14, },
                                textTransform: "none",
                                "&:hover": {
                                    bgcolor: "#E8F5E9",
                                    borderColor: "#1B5E20",
                                },
                            }}
                            
                        >
                            Excel
                        </Button>
                    </span>
                </Tooltip>

                <Tooltip title="Download PDF report" arrow>
                    <span>
                        <Button
                            size="small"
                            variant="outlined"
                            disabled={disabled || pdfLoading}
                            onClick={handlePdf}
                            startIcon={
                                pdfLoading
                                    ? <CircularProgress size={14} color="inherit" />
                                    : <PictureAsPdfIcon />
                            }
                            sx={{
                                borderColor: "#B71C1C",
                                color: "#B71C1C",
                                fontWeight: 600,
                                fontSize: { xs: 8, sm: 10 ,lg:12 },
                                textTransform: "none",
                                "&:hover": {
                                    bgcolor: "#FFEBEE",
                                    borderColor: "#B71C1C",
                                },
                            }}
                        >
                            PDF
                        </Button>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default ExportToolbar;