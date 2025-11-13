"use client";
import React from "react";
import { useDashBoardContext } from "@/context/DashBoardContext";
import { Box, Grid, useTheme } from "@mui/material";

import MaterialSummaryTable from "../MeterialTableData/MaterialTableData";
import PaymentSummary from "../PaymentSummary/PaymentSummary";
import SchemePayment from "../SchemePaymentSummary/SchemePayment";
import EstimationSummary from "../estimationSummary/EstimationSummary";
import BillCancelledPage from "../BillCancelledTable/BillCancelledPage";
import { useThemeContext } from "@/context/ThemeContext";

const Dashboard = () => {
  const theme = useTheme();
  const { branchesData, loading, error } = useDashBoardContext();
  const { sidebarOpen } =useThemeContext();

  if (error) return <div>{error}</div>;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        p: { xs: 0, md: 2 },
        marginTop: sidebarOpen ? '3rem' : '0.5rem'
      }}
    >
      {branchesData.map((branch) => (
        <Box key={branch.branchName} sx={{ mb: 2 }}>
          <MaterialSummaryTable
            branchName={branch.branchName}
            data={branch.materialSummary}
            loading={loading}
            error={error}
          />

          <Box sx={{ mt: 2, mb: 3 }}>
            <Grid container spacing={2.5} alignItems="stretch">
              <Grid size={{xs:12, md:4}} >
                <PaymentSummary
                  data={branch.paymentSummary}
                  loading={loading}
                  error={error}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <SchemePayment
                  data={branch.schemePayment}
                  loading={loading}
                  error={error}
                />
              </Grid>

              <Grid size={{xs:12, md:4}}>
                <EstimationSummary
                  data={branch.estimationSummary}
                  loading={loading}
                  error={error}
                />
              </Grid>
            </Grid>
          </Box>

          <BillCancelledPage
            data={branch.cancelledBills}
            loading={loading}
            error={error}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Dashboard;
