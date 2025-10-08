"use client";
export const dynamic = "force-dynamic";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useBillCancelled } from "@/hooks/useBillCancelled";
import ResponsiveTable from "@/components/ui/table/ResponsiveTable";
import TableSkeleton from "@/components/ui/table/TableSkeleton";
import Box from "@mui/material/Box";
import { Typography ,useTheme} from "@mui/material";


interface Column {
    id: string;
    label: string;
    align: "left" | "center" | "right";
    render?: (value: any, row: any) => React.ReactNode;
    minWidth?: number;
    maxWidth?: number;
}

const BillCancelledPage = () => {
    const { formattedStartDate, formattedEndDate } = useAppContext();

    const { data, loading, error } = useBillCancelled({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
    });
    const theme=useTheme();
    console.log(data, "data in BillCancelledPage");

    const columns: Column[] = [
        { id: "TRANNO", label: "Tran No", align: "center" },
        { id: "TRANDATE", label: "Tran Date", align: "left" },
        { id: "USERNAME", label: "User Name", align: "left" },
        {
            id: "NETWT",
            label: "Net Weight",
            align: "right",
            // ✅ show up to 3 decimal places always
            render: (value) => (typeof value === "number" ? value.toFixed(3) : value),
            maxWidth: 120, // ✅ reduce width
        },
        {
            id: "AMOUNT",
            label: "Amount (₹)",
            align: "right",
            render: (value) =>
                typeof value === "number"
                    ? value.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                    : value,
            maxWidth: 140, // ✅ narrower than default
        },
    ];

    if (loading) return <TableSkeleton rows={5} columns={2} />;

    if (error) {
        return (
            <Box className="text-red-600 text-center mt-10">
                Error loading data: {error.message}
            </Box>
        );
    }

    return (
        <div className="p-0">
            {data && data.length > 0 && (
                <>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 1,
                            textAlign: 'center',
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontFamily: 'var(--font-satisfy)',
                            fontSize: { xs: '1.25rem', sm: '1.25rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem' }
                        }}
                    >
                      Cancelled Bill's
                    </Typography>

                    <ResponsiveTable columns={columns} data={data} stickyHeader />
                </>
            )}
            {data && data.length === 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 2,
                        textAlign: 'center',
                    }}
                >
                    {/* Icon */}
                    <Box
                        sx={{
                            fontSize: '3rem',
                            mb: 0,
                            opacity: 0.8,
                        }}
                    >
                        📋
                    </Box>

                    {/* Title */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontFamily: 'var(--font-merriweather)',
                            mb: 0.5,
                        }}
                    >
                        No Cancelled Bills
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontFamily: 'var(--font-funnel)',
                            mb: 0.5,
                            maxWidth: 300,
                            lineHeight: 1.5,
                        }}
                    >
                        No cancelled bills found for the current filters
                    </Typography>

                    {/* Action Button */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            transition: 'all 0.2s ease',
                           
                        }}
                       
                    >
                        <Typography
                            sx={{
                                fontSize: '1.1rem',
                            }}
                        >
                            🔄
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontFamily: 'var(--font-funnel)',
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                            }}
                        >
                            Try to Adjust Filters
                        </Typography>
                    </Box>
                </Box>
            )}
        </div>
    );
};

export default BillCancelledPage;
