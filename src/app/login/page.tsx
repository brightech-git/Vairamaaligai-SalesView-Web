"use client";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { AssessmentOutlined, ReceiptLongOutlined, StorefrontOutlined } from "@mui/icons-material";
import LoginForm from "./LoginForm";
import ThemeSettings from "@/components/ThemeSettings";
import CompanyLogo from "@/components/CompanyLogo";
import { useCompanyDetails } from "@/context/CompanyDetailsContext";
const LoginPage = () => {
 const { companyDetails } = useCompanyDetails();
 return <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
  <Box className="glass-surface" sx={{ position: "fixed", right: 16, top: 16, zIndex: 5, border: "1px solid", borderColor: "divider", borderRadius: 1.5 }}><ThemeSettings /></Box>
  <Box sx={{ bgcolor: "#481527", color: "#fff", p: { xs: 4, md: 7, xl: 10 }, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}><CompanyLogo size="100px" /></Box>
    <Box className="page-enter" sx={{ py: { xs: 5, md: 10 }, maxWidth: 500 }}>
      <Chip label="SALES INTELLIGENCE" size="small" sx={{ bgcolor: "#ffffff12", color: "#edc7d4", mb: 3, letterSpacing: 1.5, fontSize: 11 }} />
      <Typography component="h1" sx={{ fontSize: { xs: 34, lg: 48 }, fontWeight: 700, lineHeight: 1.2, letterSpacing: -1 }}>A clearer view of<br />your business.</Typography>
      <Typography sx={{ mt: 3, color: "#dbb4c3", fontSize: 16, maxWidth: 390 }}>Your sales, collections, and branch reports together in one focused workspace.</Typography>
      <Box sx={{ display: "grid", gap: 2.5, mt: 5 }}>{[[StorefrontOutlined, "Branch performance"], [AssessmentOutlined, "Detailed sales summaries"], [ReceiptLongOutlined, "Scheme reports & exports"]].map(([Icon, label]) => { const ItemIcon = Icon as typeof StorefrontOutlined; return <Box key={String(label)} sx={{ display: "flex", gap: 1.5, alignItems: "center", color: "#f2dbe4" }}><ItemIcon fontSize="small" /><Typography variant="body2">{String(label)}</Typography></Box>; })}</Box>
    </Box>
    <Typography variant="caption" sx={{ color: "#d8aebf" }}>Sales View · Business reporting workspace</Typography>
  </Box>
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 3, sm: 6 }, bgcolor: "background.default" }}>
    <Paper className="page-enter glass-surface" sx={{ width: "100%", maxWidth: 440, p: { xs: 2.5, sm: 3.5 }, border: "1px solid", borderColor: "divider", borderRadius: 3, boxShadow: "0 12px 40px #48152708" }}>
      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1.2 }}>YOUR WORKSPACE</Typography>
      <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>Welcome back</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Sign in to view your business reports.</Typography>
      <LoginForm />
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 4 }}>Use the credentials provided by your administrator.</Typography>
    </Paper>
  </Box>
 </Box>;
};
export default LoginPage;
