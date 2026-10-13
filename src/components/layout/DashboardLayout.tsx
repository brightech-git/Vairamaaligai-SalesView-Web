"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Typography,
    Box,
    useTheme,
    useMediaQuery,
    Tooltip,
    Divider,
} from "@mui/material";
import {
    LogoutRounded,
    DashboardOutlined,
    Inventory2Outlined,
    PaymentOutlined,
    AccountBalanceOutlined,
    AssessmentOutlined,
    CancelOutlined,
    ReceiptLongOutlined,
    ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import Header from "../header/Header";
import ThemeSettings from "../ThemeSettings";
import CompanyLogo from "../CompanyLogo";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/redux/slices/authSlice";

// ✅ Import your page components here
import Dashboard from "@/app/dashboard/DashboardPage";
import BillCancelledPage from "@/app/BillCancelledTable/BillCancelledPage";
import SchemePayment from "@/app/SchemePaymentSummary/SchemePayment";
import PaymentSummary from "@/app/PaymentSummary/PaymentSummary";
import MaterialSummaryTable from "@/app/MeterialTableData/MaterialTableData";
import EstimationSummary from "@/app/estimationSummary/EstimationSummary";
import SchemeReport from "@/app/SchemeReport/SchemeReport";


import { useDashBoardContext } from "@/context/DashBoardContext";

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

const menuItems = [
    { text: "Dashboard", icon: <DashboardOutlined fontSize="small" />, id: "dashboard" },
    { text: "Material Summary", icon: <Inventory2Outlined fontSize="small" />, id: "material" },
    { text: "Payment Summary", icon: <PaymentOutlined fontSize="small" />, id: "payment" },
    { text: "Scheme Payment", icon: <AccountBalanceOutlined fontSize="small" />, id: "scheme" },
    { text: "Estimation Summary", icon: <AssessmentOutlined fontSize="small" />, id: "estimation" },
    { text: "Scheme Report", icon: <ReceiptLongOutlined fontSize="small" />, id: "schemeReport" },
    { text: "Cancelled Bills", icon: <CancelOutlined fontSize="small" />, id: "cancelled" },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
    const { sidebarOpen, toggleSidebar } = useThemeContext();
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const handleLogout = () => {
        sessionStorage.removeItem("isAuthenticated");
        dispatch(logout());
        void queryClient.cancelQueries();
        queryClient.clear();
        router.replace("/login");
    };
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [activeItem, setActiveItem] = useState("dashboard");
    
    const { branchesData, loading, error } = useDashBoardContext(); // ✅ get context
    const drawerWidth = sidebarOpen ? 220 : 64;

    const handleMenuClick = (itemId: string) => {
        setActiveItem(itemId);
        if (isMobile) toggleSidebar();
    };

    // ✅ Render selected page content dynamically
    const renderPage = () => {
        switch (activeItem) {
            case "dashboard":
                return <Dashboard />;

            case "material":
                return (
                    <MaterialSummaryTable
                        data={branchesData.map(branch => ({
                            branchName: branch.branchName,
                            materialSummary: branch.materialSummary
                        }))}
                        loading={loading}
                        error={error}
                    />

                );

            case "payment":
                return (
                    <PaymentSummary
                        data={branchesData.map(branch => ({
                            branchName: branch.branchName,
                            paymentSummary: branch.paymentSummary
                        }))}
                        loading={loading}
                        error={error}
                    />
                );

            case "scheme":
                return (
                    <SchemePayment
                        data={branchesData.map(branch => ({
                            branchName: branch.branchName,
                            SchemePayment: branch.schemePayment
                        }))}
                        loading={loading}
                        error={error}
                    />
                );

            case "estimation":
                return (
                    <EstimationSummary
                        data={branchesData.map(branch => ({
                            branchName: branch.branchName,
                            estimationSummary: branch.estimationSummary
                        }))}
                        loading={loading}
                        error={error}
                    />
                );

            case "schemeReport":
                return <SchemeReport />;

            case "cancelled":
                return (
                    <BillCancelledPage
                        data={branchesData.map(branch => ({
                            branchName: branch.branchName,
                            cancelledBills: branch.cancelledBills
                        }))}
                        loading={loading}
                        error={error}
                    />
                );

            default:
                return <Dashboard />;
        }
    };



    const activeMenu = menuItems.find(item => item.id === activeItem)!;
    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: .5, height: 48, mb: 2 }}>
                <CompanyLogo size="20px"/>
                {sidebarOpen && <Box><Typography variant="body2" fontWeight={700}>Sales View</Typography><Typography variant="caption" color="text.secondary">Business intelligence</Typography></Box>}
            </Box>
            {sidebarOpen && <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, mb: 1, letterSpacing: 1.4, fontWeight: 700 }}>WORKSPACE</Typography>}
            <List sx={{ p: 0 }}>
                {menuItems.map(item => <ListItem key={item.id} disablePadding sx={{ mb: .5 }}>
                    <Tooltip title={sidebarOpen ? "" : item.text} placement="right"><ListItemButton selected={activeItem === item.id} onClick={() => handleMenuClick(item.id)} aria-label={item.text} sx={{ px: sidebarOpen ? 1.5 : 1, justifyContent: sidebarOpen ? "initial" : "center", color: activeItem === item.id ? "primary.main" : "text.secondary" }}>
                        <ListItemIcon sx={{ color: "inherit", minWidth: sidebarOpen ? 30 : 0 }}>{item.icon}</ListItemIcon>
                        {sidebarOpen && <ListItemText primary={item.text} slotProps={{ primary: { fontSize: 13, fontWeight: activeItem === item.id ? 700 : 400 } }} />}
                    </ListItemButton></Tooltip>
                </ListItem>)}
            </List>
            <Box sx={{ mt: "auto", pt: 1.5 }}>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: sidebarOpen ? "space-between" : "center", px: sidebarOpen ? 1 : 0, mb: 1 }}>{sidebarOpen && <Typography variant="caption" color="text.secondary">Appearance</Typography>}<ThemeSettings /></Box>
                <Tooltip title={sidebarOpen ? "" : "Log out"} placement="right"><ListItemButton aria-label="Log out" onClick={handleLogout} sx={{ px: sidebarOpen ? 1.5 : 1, justifyContent: sidebarOpen ? "initial" : "center", color: "primary.main", mb: 1 }}><ListItemIcon sx={{ color: "inherit", minWidth: sidebarOpen ? 30 : 0 }}><LogoutRounded fontSize="small" /></ListItemIcon>{sidebarOpen && <ListItemText primary="Log out" slotProps={{ primary: { fontSize: 13, fontWeight: 700 } }} />}</ListItemButton></Tooltip>
                {!isMobile && <Tooltip title={sidebarOpen ? "Collapse navigation" : "Expand navigation"}><IconButton aria-label={sidebarOpen ? "Collapse navigation" : "Expand navigation"} onClick={toggleSidebar} size="small" sx={{ width: "100%", borderRadius: 2 }}><ChevronLeftIcon sx={{ transform: sidebarOpen ? "none" : "rotate(180deg)", transition: "transform 200ms" }} /></IconButton></Tooltip>}
            </Box>
        </Box>
    );
    return (
        <Box sx={{ display: "flex", backgroundColor: theme.palette.background.default }}>
            {/* Header */}
            <Header />

            {/* Sidebar Drawer */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={sidebarOpen}
                onClose={toggleSidebar}
                sx={{
                    width: isMobile ? 0 : drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: isMobile ? 220 : drawerWidth,
                        boxSizing: "border-box",
                        background: "var(--glass-surface)",
                        backdropFilter: "var(--glass-blur)",
                        transition: theme.transitions.create("width", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        ...(isMobile && {
                            top: "96px",
                            height: "calc(100% - 96px)",
                            background: "var(--glass-surface)"
                        }),
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1.25, md: 1.5, xl: 2 },
                    minWidth: 0,
                    minHeight: "100vh",
                    width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: "radial-gradient(ellipse at 90% 0%, #a75e7814, transparent 50%)",
                    transition: theme.transitions.create(["width", "margin"], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Box sx={{ height: { xs: 96, md: 56 } }} /> {/* Spacer for Header */}

                {/* ✅ Render the selected page here */}
                <Box sx={{ maxWidth: 1600, mx: "auto" }}>
                  <Box sx={{ mb: 1.5 }}><Typography variant="caption" color="text.secondary">Workspace / Reports</Typography><Typography variant="h4" sx={{ mt: .5 }}>{activeMenu.text === "Dashboard" ? "Business overview" : activeMenu.text}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Explore your branch reports for the selected period.</Typography></Box>
                  <Box key={activeItem} className="page-enter">{renderPage()}</Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
