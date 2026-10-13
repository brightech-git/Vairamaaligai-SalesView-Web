"use client";
import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import { MenuRounded } from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import { useCompanyDetails } from "@/context/CompanyDetailsContext";
import DateRangePicker from "../DateRangePicker";
import MetalRates from "../MetalRates";
import CompanyLogo from "../CompanyLogo";
import ThemeSettings from "../ThemeSettings";
const Header = () => {
  const theme = useTheme();
  const { sidebarOpen, toggleSidebar, isLargeScreen } = useThemeContext();
  const { companyDetails } = useCompanyDetails();
  const drawerWidth = sidebarOpen ? 220 : 64;
  return <AppBar className="glass-surface" position="fixed" elevation={0} sx={{ width: isLargeScreen ? `calc(100% - ${drawerWidth}px)` : "100%", ml: isLargeScreen ? `${drawerWidth}px` : 0, color: "text.primary", borderBottom: "1px solid", borderColor: "divider", transition: "width 240ms, margin 240ms", zIndex: theme.zIndex.drawer + 1 }}>
    <Toolbar sx={{ minHeight: "56px !important", gap: 1, px: 1.5 }}>
      {!isLargeScreen && <IconButton size="small" aria-label="Open navigation" onClick={toggleSidebar}><MenuRounded fontSize="small" /></IconButton>}
      <Box sx={{ flex: 1, minWidth: 0 }} maxHeight={"40px"}>   <CompanyLogo size="40px"/></Box>
      {/*<Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" fontWeight={700} noWrap>{companyDetails?.COMPANYNAME || "Vairamaaligai"}</Typography></Box> */}
      {isLargeScreen && <><DateRangePicker compact /><MetalRates compact /></>}
      <ThemeSettings />
    </Toolbar>
    {!isLargeScreen && <Box sx={{ display: "flex", gap: 1, alignItems: "center", justifyContent: "space-between", px: 1.5, pb: .75, overflowX: "auto" }}><DateRangePicker compact /><MetalRates compact /></Box>}
  </AppBar>;
};
export default Header;
