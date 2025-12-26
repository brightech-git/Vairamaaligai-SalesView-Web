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
import BranchSelector from '../BranchSelector';

interface DesktopHeaderProps {
    logo: string;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({logo}) => {

    console.log(logo,'logossss')
    const { mode, toggleTheme } = useThemeContext();
    const theme=useTheme();
    const branchOptions = [
        { branchId: 1, branchName: "Headoffice" },
        { branchId: 2, branchName: "Periyar" },
        // { branchId: 3, branchName: "THIRUTTANI" },
    ];

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
                        width: 'auto',
                        height: 30,
                    }}
                >
                    <img
                        src={logo}// your image path
                        alt="Logo"
                        style={{
                            height:'40px'
                        }}
                      
                    />
                </Box>
               
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: { xs: 1, sm: 1, },
                    justifyContent: 'center',
                    maxWidth: 500,
                    ml: 2,
                }}>
                    <DateRangePicker />
                </Box>
            </Box>

            {/* Center Section - Date Range Picker */}
           

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

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <BranchSelector branchOptions={branchOptions} />
                </Box>

              {/*   Theme Toggle */}
                {/* <IconButton
                    onClick={toggleTheme}
                    sx={{ 
                        color: 'inherit',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        padding: '8px',
                    }}
                >
                    {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton> */}
            </Box>
        </Box>
    );
};

export default DesktopHeader;