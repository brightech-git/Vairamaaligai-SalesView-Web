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
import BranchSelector from '../BranchSelector';

interface MobileHeaderProps {
    logo: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({logo}) => {
    const { mode, toggleTheme, toggleSidebar } = useThemeContext();
    const theme = useTheme();

    // const branchOptions = [
    //     { branchId: 1, branchName: "Headoffice" },
    //     { branchId: 2, branchName: "Periyar" },
    //     // { branchId: 3, branchName: "THIRUTTANI" },
    // ];
    return (
        <Box sx={{ width: '100% !important' }}>
            {/* First Row - Logo, Menu, Theme Toggle */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
            }}>
                {/* Left - Menu & Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap:0.25 }}>
                    <IconButton
                        onClick={toggleSidebar}
                        sx={{ color: 'inherit' }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Small Logo */}
                    <Box
                        sx={{
                            width: 'auto',
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src={logo} // your image path
                            alt="Logo"
                           style={{
                            height:'30px'
                           }}
                        />
                    </Box>

                
                </Box>

                {/* Right - Theme Toggle */}
                {/* <Box sx={{ display: 'flex', gap: 1 }}>
                    <BranchSelector branchOptions={branchOptions} />
                </Box> */}
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