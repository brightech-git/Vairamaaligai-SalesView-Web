// components/Header/DesktopHeader.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { use } from 'react';
import {
    Box,
    IconButton,
    Typography,
    useTheme,
    Avatar
} from '@mui/material';
import {
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useThemeContext } from '@/context/ThemeContext';
import DateRangePicker from '../DateRangePicker';
import MetalRates from '../MetalRates';

const DesktopHeader: React.FC = () => {
    const { mode, toggleTheme } = useThemeContext();
    const theme=useTheme();

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 2,
           
        }}>
            {/* Left Section - Company Logo & Name */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
            }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
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
                            width: 40,
                            height: 40,
                            mr: 1,
                        }}
                    />
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: "'Quintessential', cursive",
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        whiteSpace: 'nowrap',
                        fontSize:{md:'16px' ,lg:'20px'}
                    }}
                >
                    Jaiguru Jewellers
                </Typography>
            </Box>

            {/* Center Section - Date Range Picker */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flex: { xs: 1,sm:1,},
                justifyContent: 'center',
                maxWidth: 500,
            }}>
                <DateRangePicker />
            </Box>

            {/* Right Section - Metal Rates and Theme Toggle */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
                gap: 3,
                minWidth: 200,
            }}>
                {/* Metal Rates as Chips */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <MetalRates />
                </Box>

                {/* Theme Toggle */}
                <IconButton
                    onClick={toggleTheme}
                    sx={{ 
                        color: 'inherit',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        padding: '8px',
                    }}
                >
                    {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
            </Box>
        </Box>
    );
};

export default DesktopHeader;