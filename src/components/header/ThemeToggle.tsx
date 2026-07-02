// components/Header/ThemeToggle.tsx
"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { Box, Tooltip, Switch, useTheme } from "@mui/material";
import {
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";

interface ThemeToggleProps {
    size?: "small" | "medium";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = "medium" }) => {
    const { mode, toggleTheme } = useThemeContext();
    const theme = useTheme();
    const isDark = mode === "dark";
    const iconSize = size === "small" ? 16 : 18;

    return (
        <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            <Box
                onClick={toggleTheme}
                role="button"
                aria-label="Toggle dark mode"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    height: size === "small" ? 32 : 36,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    cursor: "pointer",
                    backgroundColor: theme.palette.background.paper,
                    transition: "border-color 0.2s ease, background-color 0.2s ease",
                    "&:hover": {
                        borderColor: theme.palette.primary.main,
                    },
                }}
            >
                <LightModeIcon
                    sx={{
                        fontSize: iconSize,
                        color: isDark ? theme.palette.text.disabled : theme.palette.warning.main,
                    }}
                />
                <Switch
                    checked={isDark}
                    onChange={toggleTheme}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    inputProps={{ "aria-label": "Toggle dark mode" }}
                />
                <DarkModeIcon
                    sx={{
                        fontSize: iconSize,
                        color: isDark ? theme.palette.primary.main : theme.palette.text.disabled,
                    }}
                />
            </Box>
        </Tooltip>
    );
};

export default ThemeToggle;
