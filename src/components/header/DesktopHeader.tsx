// components/Header/DesktopHeader.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState } from 'react';
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
import logoImg from '@/app/logo.png';
import { branchOptions } from './constant';
import MultiSelectComboBox from '../ui/MultiSelect';
import { useDashBoardContext } from '@/context/DashBoardContext';
import { OptionType } from '../ui/MultiSelect';

interface DesktopHeaderProps {
    logo: string;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({logo}) => {

    console.log(logo,'logossss')
    const { mode, toggleTheme } = useThemeContext();
    const theme=useTheme();
 
 const { filters, setFilters } = useDashBoardContext();

    const [selectedBranches, setSelectedBranches] = useState<OptionType[]>([]);

    const handleBranchChange = (fieldName: string, selected: OptionType[]) => {
        setSelectedBranches(selected);
        const branchIds = selected
            .map((opt) => opt.value)
            .filter((v): v is number => typeof v === "number");
        setFilters({ ...filters, branchIds });
    };

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
                    display={'flex'}
                    alignItems={'center'}
                >
                    <img
                        src={logoImg.src}
                        alt="Logo"
                        style={{
                            height:'40px'
                        }}
                      
                    />
                    <Typography fontSize='18px' variant='h1'> Jaiguru Jewellers </Typography>
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

                {/* Right - Theme Toggle */}
                <Box sx={{ display: 'flex', gap: 1 ,minWidth:'200px' }}>
                    {/* <BranchSelector branchOptions={branchOptions} /> */}
                    <MultiSelectComboBox
                        options={branchOptions}
                        fieldName="selectBranch"
                        onChange={handleBranchChange}
                        value={selectedBranches}
                        label="Select Branch"
                    />
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