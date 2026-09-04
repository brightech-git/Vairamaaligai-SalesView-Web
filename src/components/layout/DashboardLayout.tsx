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
    
} from "@mui/material";
import {
    DashboardOutlined,
    Inventory2Outlined,
    PaymentOutlined,
    AccountBalanceOutlined,
    AssessmentOutlined,
    CancelOutlined,
    PersonOutline as PersonOutlineIcon,
    ChevronLeft as ChevronLeftIcon,
    
} from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
import Header from "../header/Header";

// ✅ Import your page components here
import Dashboard from "@/app/dashboard/DashboardPage";
import BillCancelledPage from "@/app/BillCancelledTable/BillCancelledPage";
import SchemePayment from "@/app/SchemePaymentSummary/SchemePayment";
import PaymentSummary from "@/app/PaymentSummary/PaymentSummary";
import MaterialSummaryTable from "@/app/MeterialTableData/MaterialTableData";
import EstimationSummary from "@/app/estimationSummary/EstimationSummary";
import BranchTables from "../ui/table/BranchTables";
import PersonalInfoReport from "@/app/PersonalInfoReport/PersonalInfoReport";

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
    { text: "Cancelled Bills", icon: <CancelOutlined fontSize="small" />, id: "cancelled" },
    { text: "Personal Info Report", icon: <PersonOutlineIcon fontSize="small" />, id: "personal-info" },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
    const { sidebarOpen, toggleSidebar } = useThemeContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [activeItem, setActiveItem] = useState("dashboard");
    
    const { branchesData, loading, error } = useDashBoardContext(); // ✅ get context
    const drawerWidth = sidebarOpen ? 240 : 72;

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

            case "personal-info":
                return <PersonalInfoReport />;

            default:
                return <Dashboard />;
        }
    };



    const drawerContent = (
        <Box sx={{ overflow: "hidden", zIndex: 1 }}>
            {/* Drawer Header */}
            <Box
                sx={{
                    p: sidebarOpen ? 1.5 : 0.5, // smaller padding
                    display: "flex",
                    alignItems: "center",
                    justifyContent: sidebarOpen ? "space-between" : "center",
                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    minHeight: "56px", // slightly smaller height
                }}
            >
                {sidebarOpen && (
                    <Typography
                        variant="subtitle1" // smaller font
                        noWrap
                        component="div"
                        className="font-quintessential"
                        sx={{ color: theme.palette.text.primary ,textTransform: 'capitalize'}}
                    >
                        {activeItem}
                    </Typography>
                )}
                {!isMobile && (
                    <IconButton
                        onClick={toggleSidebar}
                        size="small"
                        sx={{
                            color: theme.palette.text.primary,
                            ...(!sidebarOpen && { mx: "auto" }),
                        }}
                    >
                        <ChevronLeftIcon
                            sx={{
                                transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
                                transition: "transform 0.3s ease",
                            }}
                        />
                    </IconButton>
                )}
            </Box>

            {/* Navigation Menu */}
            <List sx={{ px: 0.5 }}> {/* reduced horizontal padding */}
                {menuItems.map((item) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton
                            selected={activeItem === item.id}
                            onClick={() => handleMenuClick(item.id)}
                            sx={{
                                justifyContent: sidebarOpen ? "initial" : "center",
                                px: sidebarOpen ? 1.5 : 0.5, // reduced padding
                                py: 0.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: sidebarOpen ? 1.5 : "auto", // reduced margin
                                    justifyContent: "center",
                                    color:
                                        activeItem === item.id
                                            ? theme.palette.primary.main
                                            : theme.palette.text.primary,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            {sidebarOpen && (
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontFamily: "'Funnel Display', sans-serif",
                                        fontWeight: 500,
                                        fontSize: "0.875rem", // smaller text
                                        color:
                                            activeItem === item.id
                                                ? theme.palette.primary.main
                                                : theme.palette.text.primary,
                                        textTransform: "capitalize",
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
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
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        transition: theme.transitions.create("width", {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        ...(isMobile && {
                            top: "100px",
                            height: "calc(100% - 64px)",
                            background:theme.palette.background.paper
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
                    p: {lg:1,sm:1,xs:1 ,md:0},
                    width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
                    backgroundColor: theme.palette.background.default,
                    transition: theme.transitions.create(["width", "margin"], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Box sx={{ height: { xs: "100px", md: "74px", lg: "65px"  }  }} /> {/* Spacer for Header */}

                {/* ✅ Render the selected page here */}
                {renderPage()}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
