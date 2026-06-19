"use client";
export const dynamic = "force-dynamic";
import React from "react";
import {
    Box,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
    Container,
    Avatar
} from "@mui/material";
import LoginForm from "./LoginForm";
import { useCompanyDetails } from "@/context/CompanyDetailsContext";
import Image from "next/image";

const LoginPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const { companyDetails } =useCompanyDetails();
     const logo = `${companyDetails?.BASEURL.trim()}${companyDetails?.LOGO}`
     console.log(logo ,'companydetails');
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                minHeight: "100vh",
                width: "100%",
                backgroundColor: theme.palette.background.default,
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* Background Pattern */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: theme.palette.mode === 'dark'
                        ? `radial-gradient(circle at 20% 80%, ${theme.palette.primary.dark}20 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${theme.palette.secondary.dark}15 0%, transparent 50%)`
                        : `radial-gradient(circle at 20% 80%, ${theme.palette.primary.light}10 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${theme.palette.secondary.light}08 0%, transparent 50%)`,
                    zIndex: 0,
                }}
            />

            {/* ===== Left Side - Brand & Visual ===== */}
             {/* <Box
                sx={{
                    flex: { md: 1.2 },
                    position: "relative",
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`
                        : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.light} 100%)`,
                    padding: 1,
                    overflow: "hidden",
                }}
            >
           
                <Box
                    sx={{
                        position: "absolute",
                        top: -100,
                        right: -100,
                        width: 300,
                        height: 300,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        zIndex: 1,
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -50,
                        left: -50,
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)",
                        zIndex: 1,
                    }}
                />

            

                <Box
                    sx={{
                        position: "relative",
                        width: "100%",   // full width of parent
                        height: "100%", // full viewport height
                    }}
                >
                    <Image
                        src="/images/logo/login2.jpg"
                        alt="Logo"
                        fill
                        style={{ objectFit: "cover" }} // cover, contain, etc.
                    />
                </Box>
            </Box>  */}

            {/* ===== Right Side - Login Form ===== */}
            <Box
                sx={{
                    flex: { xs: 1, md: 1 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: { xs: "100vh", md: "auto" },
                    padding: { xs: 3, sm: 4, md: 6 },
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <Container maxWidth="sm" sx={{ padding: 0 }}>
                    <Paper
                        elevation={isMobile ? 0 : 8}
                        sx={{
                            p: { xs: 3, sm: 4, md: 5 },
                            width: "100%",
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                            border: theme.palette.mode === 'dark'
                                ? `1px solid ${theme.palette.divider}`
                                : "none",
                            boxShadow: theme.palette.mode === 'dark'
                                ? "0 8px 40px rgba(0,0,0,0.3)"
                                : "0 20px 60px rgba(0,0,0,0.1)",
                            backdropFilter: "blur(10px)",
                            background: theme.palette.mode === 'dark'
                                ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
                                : "white",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Decorative Accent */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            }}
                        />

                        {/* Mobile Header */}
                      
                         
                       
                        {/* Login Header */}
                        <Box sx={{ textAlign: "center", justifyContent:'center' ,mb:3 ,display:'flex' ,flexDirection:'row' ,gap:2}}>
                            {/* <Box
                                                    sx={{
                                                        width: 'auto',
                                                        height: 40,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                {/* <img
                                    src={logo} // your image path
                                    alt="Logo"
                                    style={{

                                        height: '30px',
                                        width:'auto'
                                    }}
                                /> 
                                </Box> */}
                                <Box>

                              
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    fontFamily: "'Quintessential', cursive",
                                    mb: 0.5,
                                    fontSize:"1.15rem"
                                }}
                            >
                                Welcome Back
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontFamily: "'Funnel Display', sans-serif",
                                    maxWidth: 300,
                                    margin: "0 auto",

                                }}
                            >
                                Sign in to access your dashboard
                            </Typography>
                            </Box>
                     </Box>
                        {/* Login Form */}
                        <LoginForm />

                        {/* Security Note */}
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontFamily: "'Delius', cursive",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 0.5,
                                }}
                            >
                                🔒 Your data is securely encrypted
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Footer */}
                    {/* <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.text.primary,
                                fontFamily: "'Delius', cursive",
                                opacity: 0.7,
                            }}
                        >
                            © 2024 Jaiguru jewellers. All rights reserved.
                        </Typography>
                    </Box> */}
                </Container>
            </Box>
        </Box>
    );
};

export default LoginPage;