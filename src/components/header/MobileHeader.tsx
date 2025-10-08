// components/Header/MobileHeader.tsx
"use client";
export const dynamic = "force-dynamic";

import React from 'react';
import {
    Box,
    IconButton,
    Typography,
    useTheme,
    Avatar
} from '@mui/material';
import {
    Menu as MenuIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useThemeContext } from '@/context/ThemeContext';
import DateRangePicker from '../DateRangePicker';
import MetalRates from '../MetalRates';

const MobileHeader: React.FC = () => {
    const { mode, toggleTheme, toggleSidebar } = useThemeContext();
    const theme = useTheme();
    return (
        <Box sx={{ width: '100%' }}>
            {/* First Row - Logo, Menu, Theme Toggle */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
            }}>
                {/* Left - Menu & Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        onClick={toggleSidebar}
                        sx={{ color: 'inherit' }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Small Logo */}
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                           
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Avatar
                            src="/images/logo/icon.png" // your image path
                            alt="Logo"
                            sx={{
                                width: 32,
                                height: 32,
                                mr: 2,
                            }}
                        />
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: "'Quintessential', cursive",
                            fontWeight: 700,
                            color: 'inherit',
                            fontSize: '16px'
                        }}
                    >
                        Vairamaaligai
                    </Typography>
                </Box>

                {/* Right - Theme Toggle */}
                <IconButton
                    onClick={toggleTheme}
                    sx={{ color: 'inherit' }}
                >
                    {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
            </Box>

            {/* Second Row - Date Picker and Metal Rates */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 1,
            }}>
                {/* Date Picker */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <DateRangePicker />
                </Box>

                {/* Metal Rates */}
                <Box sx={{ flexShrink: 0 }}>
                    <MetalRates compact />
                </Box>
            </Box>
        </Box>
    );
};

export default MobileHeader;