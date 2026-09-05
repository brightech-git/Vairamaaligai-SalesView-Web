"use client";
import React from "react";
import { useDashBoardContext } from "@/context/DashBoardContext";
import { Box, Grid, useTheme ,Typography } from "@mui/material";

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

  const hasValidData = (arr:any) => {
    return (
      Array.isArray(arr) &&
      arr.length > 0 &&
      arr.some(item =>
        item && typeof item === "object" &&
        Object.values(item).some(v => v !== 0 && v !== null && v !== "")
      )
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        p: { xs: 0, md: 2 },
        marginTop: sidebarOpen ? 'rem' : '0.5rem'
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          p: { xs: 0, md: 2 },
          marginTop: sidebarOpen ? "0rem" : "0.5rem",
        }}
      >
        {branchesData.map((branch) => (
          <Box key={branch.branchId} sx={{ mb: 2 }}>

            {/* ➤ Branch Name Heading */}
            {/* ➤ Branch Name Heading */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                mt: 2,
                color: theme.palette.primary.main,
                textTransform: "uppercase",
                textAlign:'center'
              }}
            >
              {branch.branchName}
            </Typography>

            {hasValidData(branch.materialSummary) && (
              <MaterialSummaryTable
                branchName={branch.branchName}
                data={branch.materialSummary}
                loading={loading}
                error={error}
              />
            )}

            <Box sx={{ mt: 2, mb: 3 }}>
              <Grid container spacing={2.5} alignItems="stretch">

                {hasValidData(branch.paymentSummary) && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <PaymentSummary
                      data={branch.paymentSummary}
                      loading={loading}
                      error={error}
                    />
                  </Grid>
                )}

                {hasValidData(branch.schemePayment) && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <SchemePayment
                      data={branch.schemePayment}
                      loading={loading}
                      error={error}
                    />
                  </Grid>
                )}

                {hasValidData(branch.estimationSummary) && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <EstimationSummary
                      data={branch.estimationSummary}
                      loading={loading}
                      error={error}
                    />
                  </Grid>
                )}

              </Grid>
            </Box>

            {hasValidData(branch.cancelledBills) && (
              <BillCancelledPage
                data={branch.cancelledBills}
                loading={loading}
                error={error}
              />
            )}

          </Box>
        ))}
      </Box>

    </Box>
  );
};

export default Dashboard;
