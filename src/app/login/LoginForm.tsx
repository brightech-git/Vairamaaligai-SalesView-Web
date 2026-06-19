"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCompanyDetails } from "@/context/CompanyDetailsContext";

const LoginForm: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

  
    // ✅ Hardcoded credentials
    const VALID_USERNAME = "admin";
    const VALID_PASSWORD = "dj@123";

    const setAuthSession = (value:boolean, ttlInMinutes :number=30) => {
        const now = new Date().getTime(); // current time in milliseconds
        const item = {
            value,                        // the actual value you want to store (true/false)
            expiry: now + ttlInMinutes * 60 * 1000, // future timestamp in ms
        };
        sessionStorage.setItem("isAuthenticated", JSON.stringify(item));
    };



    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier || !password) {
            setLocalError("Please fill in all fields");
            toast.error("Please fill in all fields");
            return;
        }

        if (identifier === VALID_USERNAME && password === VALID_PASSWORD) {
            toast.success("✅ Login successful!");
            setAuthSession(true ,60);
            setIdentifier("");
            setPassword("");
         

            setTimeout(() => {
                router.push("/"); // redirect to main page
            }, 800);
        } else {
            setLocalError("Invalid username or password");
            toast.error("❌ Invalid username or password");
        }
    };

    useEffect(() => {
        if (localError) {
            const timer = setTimeout(() => setLocalError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [localError]);

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
                maxWidth: 400, // optional, limits form width
                mx: "auto",    // center horizontally
                px: 1,         // small padding for mobile
            }}
        >
            {localError && (
                <Typography
                    variant="body2"
                    sx={{ color: theme.palette.error.main, textAlign: "center" }}
                >
                    {localError}
                </Typography>
            )}

            {/* Name Label */}
            <Typography
                variant="subtitle2" // Use variant, not fontFamily
                sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
            >
                Name
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter UserName"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                InputProps={{
                    sx: { fontSize: "1rem", color: theme.palette.text.primary },
                }}
            />

            {/* Password Label */}
            <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
            >
                Password
            </Typography>
            <TextField
                fullWidth
                type="password"
                placeholder="Enter Your Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    sx: { fontSize: "1rem", color: theme.palette.text.primary },
                }}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ py: 1.5, fontWeight: 600, fontSize: "1rem" }}
            >
                Login
            </Button>
        </Box>

    );
};

export default LoginForm;
