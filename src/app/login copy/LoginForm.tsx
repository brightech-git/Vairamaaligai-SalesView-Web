"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LoginForm: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    // ✅ Hardcoded credentials
    const VALID_USERNAME = "vmj";
    const VALID_PASSWORD = "vmj@123";

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier || !password) {
            setLocalError("Please fill in all fields");
            toast.error("Please fill in all fields");
            return;
        }

        if (identifier === VALID_USERNAME && password === VALID_PASSWORD) {
            toast.success("✅ Login successful!");
            localStorage.setItem("isAuthenticated", "true");
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
                gap: 2,
                width: "100%",
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

            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
            />

            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ py: 1.2, fontWeight: 600 }}
            >
                Login
            </Button>

            {/* <Typography
                variant="body2"
                align="center"
                sx={{ color: theme.palette.text.secondary }}
            >
                <strong>Demo Credentials:</strong> admin / admin123
            </Typography> */}
        </Box>
    );
};

export default LoginForm;
