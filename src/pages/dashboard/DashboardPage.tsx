"use client";

import BillCancelledPage from "@/pages/BillCancelledTable/BillCancelledPage";
import  MaterialSummaryTable  from "@/pages/MeterialTableData/MaterialTableData";
import PaymentSummary from "@/pages/PaymentSummary/PaymentSummary";
import SchemePayment from "@/pages/SchemePaymentSummary/SchemePayment";
import EstimationSummary from "@/pages/estimationSummary/EstimationSummary";
import { Grid, Box, useTheme } from "@mui/material";
const Dashboard = () => {
    const theme = useTheme();

return (
    <Box
        sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: "100%",
            p: {xs:0 ,md:2},
        }}
    >
        {/* Material Summary Table */ }
{/* Material Summary Table */ }
<MaterialSummaryTable />

{/* Summary Section */ }
<Box
    sx={{
        mt: 2,
        mb: 3,
        px: {xs:0, md: 2 ,lg:3},
    }}
>
    <Grid
        container
        spacing={2.5}
        alignItems="stretch"
        justifyContent="space-between"
    >
        {/* Each Grid item will auto-scale and be same height */}
        <Grid size={{ xs: 12, md: 4 }}>
            <PaymentSummary />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
            <SchemePayment />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
            <EstimationSummary />
        </Grid>
    </Grid>
</Box>

{/* Bill Cancelled Table */ }
<BillCancelledPage />
</Box>
)}
export default Dashboard;
