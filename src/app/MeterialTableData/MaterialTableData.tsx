"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import { useDashboard } from "@/hooks/useDashboard";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Modal, Box, Typography, IconButton ,useTheme ,Button} from "@mui/material";
import { formatNumber, DecimalFormat } from "@/lib/numberFormatter";


// Define interfaces for the data shape
interface MetalData {
    Metal_ID: string;
    TotalSales_Netwt?: number;
    TotalPurchase_Grswt?: number;
    Total_Netwt?: number;
}

interface StoneData {
    stnwt: number;
    stoneUnit: string;
    stnpcs: number;
    stnamt: number;
}

interface DashboardData {
    totalSalesWeight?: MetalData[];
    totalOldGoldPurchaseWeight?: MetalData[];
    totalStock?: MetalData[];
    stoneSummary?: StoneData[];
}

interface Column {
    id: string;
    label: string;
    align: "left" | "center" | "right";
}

const MaterialSummaryTable = () => {
    const { data, isLoading, error } = useDashboard(30); // refetch every 30 mins
    const [stoneModalOpen, setStoneModalOpen] = useState(false);
    const [selectedStones, setSelectedStones] = useState<StoneData[]>([]);
const theme = useTheme();
    if (isLoading) return <TableSkeleton rows={5} columns={2} />;;
    if (error) return <div>Error loading dashboard</div>;
    if (!data) return null;

    // Ensure these are arrays with type guards
    const totalSales: MetalData[] = Array.isArray(data.totalSalesWeight)
        ? data.totalSalesWeight
        : [];
    const totalPurchase: MetalData[] = Array.isArray(data.totalOldGoldPurchaseWeight)
        ? data.totalOldGoldPurchaseWeight
        : [];
    const totalStock: MetalData[] = Array.isArray(data.totalStock) ? data.totalStock : [];
    const stoneSummary: StoneData[] = Array.isArray(data.stoneSummary) ? data.stoneSummary : [];

    const materials = ["G", "S"]; // Gold, Silver
    const rows = materials.map((metalId) => {
        const sales = totalSales.find((s) => s.Metal_ID === metalId);
        const purchase = totalPurchase.find((p) => p.Metal_ID === metalId);
        const stock = totalStock.find((st) => st.Metal_ID === metalId);

        const stones =
            metalId === "G"
                ? stoneSummary.filter((s) => s.stoneUnit === "C" || s.stoneUnit === "G")
                : [];
        // Helper function to get stone type name
      
        return {
            material: metalId === "G" ? "Gold" : "Silver",
            sales: formatNumber(sales?.TotalSales_Netwt || 0, "3" as DecimalFormat),
            purchase: formatNumber(purchase?.TotalPurchase_Grswt || 0, "3" as DecimalFormat),
            stock: formatNumber(stock?.Total_Netwt || 0, "3" as DecimalFormat),
            stone:
                stones.length > 0 ? (
                    <IconButton
                        size="small"
                        onClick={() => {
                            setSelectedStones(stones);
                            setStoneModalOpen(true);
                        }}
                        sx={{
                            color: theme.palette.primary.main, // ✅ ensure contrast
                            backgroundColor: theme.palette.background.paper, // optional, subtle background
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover, // nice hover effect
                            },
                        }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                ) : null,
        };
    });

    const columns: Column[] = [
        { id: "material", label: "Material", align: "center" },
        { id: "sales", label: "Sales(gm)", align: "right" },
        { id: "purchase", label: "Purchase(gm)", align: "right" },
        { id: "stock", label: "Stock(gm)", align: "right" },
        { id: "stone", label: "Stone", align: "center" },
    ];
    const getStoneTypeName = (stoneUnit: string): string => {
        const stoneTypes: { [key: string]: string } = {
            'C': 'Carat Stones',
            'G': 'Gram Stones',
            'P': 'Piece Stones',
            'M': 'Milligram Stones'
        };
        return stoneTypes[stoneUnit] || `${stoneUnit} Stones`;
    };

    // Helper function to get stone color
    const getStoneColor = (stoneUnit: string): string => {
        const stoneColors: { [key: string]: string } = {
            'C': '#FF6B6B', // Red for Carat
            'G': '#4ECDC4', // Teal for Gram
            'P': '#45B7D1', // Blue for Piece
            'M': '#96CEB4'  // Green for Milligram
        };
        return stoneColors[stoneUnit] || '#94A3B8';
    };
    return (
        <Box>  
            <Typography variant="h6" sx={{
                mb: 1, textAlign: 'center ', fontWeight: 600, color: theme.palette.text.primary, fontFamily: 'var(--font-merriweather)',
                fontSize: { xs: '1.25rem', sm: '1.25rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem' } }}>
                        Material Summary
          </Typography>
                  
            <ResponsiveTable columns={columns} data={rows} stickyHeader />

            <Modal
                open={stoneModalOpen}
                onClose={() => setStoneModalOpen(false)}
                aria-labelledby="stone-modal-title"
                aria-describedby="stone-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: { xs: '95vw', sm: 400, md: 500 },
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        borderRadius: { xs: 1, md: 2 },
                        boxShadow: 24,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: { xs: 1, md: 2 },
                            borderBottom: 1,
                            borderColor: 'divider',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                        }}
                    >
                        <Typography
                            id="stone-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{
                                fontFamily: "'Quintessential', cursive",
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            💎 Stone Summary
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.9,
                                mt: 0.5,
                                fontFamily: "'Funnel Display', sans-serif",
                                color: 'primary.contrastText',
                                fontWeight: 500
                            }}
                        >
                            {selectedStones.length} stone type{selectedStones.length !== 1 ? 's' : ''}
                        </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{
                        p: { xs: 1, md: 3 },
                        flex: 1,
                        overflow: 'auto',
                    }}>
                        {selectedStones.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ fontFamily: "'Delius', cursive" }}
                                >
                                    No stone details available
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ spaceY: 1 }}>
                                {selectedStones.map((stone, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            p: {xs:1,md:2},
                                            mb: {xs:0.5,md:1},
                                            borderRadius: {xs:1,md:2},
                                            border: 1,
                                            borderColor: 'divider',
                                            bgcolor: idx % 2 === 0 ? 'background.default' : 'action.hover',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                boxShadow: 1,
                                                transform: 'translateY(-1px)',
                                            },
                                        }}
                                    >
                                        {/* Stone Type Badge */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: getStoneColor(stone.stoneUnit),
                                                    mr: 1,
                                                }}
                                            />
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontFamily: "'Funnel Display', sans-serif",
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {getStoneTypeName(stone.stoneUnit)}
                                            </Typography>
                                        </Box>

                                        {/* Stone Details Grid */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
                                            {/* Pieces */}
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontFamily: "'Funnel Display', sans-serif",
                                                        fontWeight: 500,
                                                        color: 'text.secondary',
                                                        display: 'block',
                                                    }}
                                                >
                                                    Pieces
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: "'Domine', serif",
                                                        fontWeight: 600,
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    {stone?.stnpcs || "0"} pcs
                                                </Typography>
                                            </Box>

                                            {/* Weight */}
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontFamily: "'Funnel Display', sans-serif",
                                                        fontWeight: 500,
                                                        color: 'text.secondary',
                                                        display: 'block',
                                                    }}
                                                >
                                                    Weight
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: "'Domine', serif",
                                                        fontWeight: 600,
                                                        color: 'primary.main',
                                                    }}
                                                >
                                                    {formatNumber(stone.stnwt, "3")} {stone.stoneUnit}
                                                </Typography>
                                            </Box>

                                            {/* Amount */}
                                            <Box >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontFamily: "'Funnel Display', sans-serif",
                                                        fontWeight: 500,
                                                        color: 'text.secondary',
                                                        display: 'block',
                                                    }}
                                                >
                                                    Amount
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: "'Domine', serif",
                                                        fontWeight: 700,
                                                        color: 'success.main',
                                                    }}
                                                >
                                                    ₹{formatNumber(stone.stnamt, "2")}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Footer with Totals */}
                    {selectedStones.length > 0 && (
                        <Box
                            sx={{
                                p: { xs: 1, md: 2 },
                                borderTop: 1,
                                borderColor: 'divider',
                                bgcolor: 'action.hover',
                            }}
                        >
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: "'Funnel Display', sans-serif",
                                            fontWeight: 500,
                                            color: 'text.secondary',
                                            display: 'block',
                                        }}
                                    >
                                        Total Pieces
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontFamily: "'Domine', serif",
                                            fontWeight: 600,
                                            color: 'text.primary',
                                        }}
                                    >
                                        {(selectedStones.reduce((sum, stone) => sum + stone.stnpcs, 0))} pcs
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontFamily: "'Funnel Display', sans-serif",
                                            fontWeight: 500,
                                            color: 'text.secondary',
                                            display: 'block',
                                        }}
                                    >
                                        Total Amount
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontFamily: "'Domine', serif",
                                            fontWeight: 700,
                                            color: 'success.main',
                                        }}
                                    >
                                        ₹{formatNumber(selectedStones.reduce((sum, stone) => sum + stone.stnamt, 0), "2")}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Close Button */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setStoneModalOpen(false)}
                            sx={{
                                fontFamily: "'Funnel Display', sans-serif",
                                fontWeight: 600,
                                borderRadius: 2,
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};
export default MaterialSummaryTable;