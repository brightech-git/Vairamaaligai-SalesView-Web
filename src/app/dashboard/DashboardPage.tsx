"use client";
import React from "react";
import { useDashBoardContext } from "@/context/DashBoardContext";
import { Box, Grid, useTheme ,Typography, Alert, Paper } from "@mui/material";

import MaterialSummaryTable from "../MeterialTableData/MaterialTableData";
import PaymentSummary from "../PaymentSummary/PaymentSummary";
import SchemePayment from "../SchemePaymentSummary/SchemePayment";
import EstimationSummary from "../estimationSummary/EstimationSummary";
import BillCancelledPage from "../BillCancelledTable/BillCancelledPage";
import TableSkeleton from "@/components/ui/table/TableSkeleton";


const Dashboard = () => {
  const theme = useTheme();
  const { branchesData, loading, error } = useDashBoardContext();


  console.log(branchesData,'branchesData')
  if (error) return <Alert severity="error">{error}</Alert>;
  if (loading) return <Box sx={{ display: "grid", gap: 3 }}><TableSkeleton rows={4} columns={4} /><TableSkeleton rows={4} columns={3} /></Box>;
  if (!branchesData.length) return <Paper sx={{ p: 6, textAlign: "center", border: "1px solid", borderColor: "divider" }}><Typography variant="h6">No reports for this period</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Choose another date range to view your branch activity.</Typography></Paper>;

  const hasValidData = (arr: unknown) => {
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
        p: 0,
        marginTop: 0
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          p: 0,
          marginTop: 0,
        }}
      >
        {branchesData.map((branch) => (
          <Paper className="glass-surface" key={branch.branchName} sx={{ mb: 2, p: { xs: 1.25, md: 1.5 }, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>

            {/* ➤ Branch Name Heading */}
            {/* ➤ Branch Name Heading */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                mt: .5,
                color: theme.palette.primary.main,
                textTransform: "none",
                textAlign:'left'
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

            <Box sx={{ mt: 1.5, mb: 1.5 }}>
              <Grid container spacing={1.5} alignItems="stretch">

                {hasValidData(branch.paymentSummary) && (
                  <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                    <PaymentSummary
                      data={branch.paymentSummary}
                      loading={loading}
                      error={error}
                    />
                  </Grid>
                )}

                {hasValidData(branch.schemePayment) && (
                  <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                    <SchemePayment
                      data={branch.schemePayment}
                      loading={loading}
                      error={error}
                    />
                  </Grid>
                )}

                {hasValidData(branch.estimationSummary) && (
                  <Grid size={{ xs: 12, md: 6, xl: 4 }}>
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

          </Paper>
        ))}
      </Box>

    </Box>
  );
};

export default Dashboard;
