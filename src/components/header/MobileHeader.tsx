// components/Header/MobileHeader.tsx
"use client";
export const dynamic = "force-dynamic";

import React,{useState} from 'react';
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
import logoImg from '@/app/logo.png';
import { branchOptions } from './constant';
import MultiSelectComboBox from '../ui/MultiSelect';
import { useDashBoardContext } from '@/context/DashBoardContext';
import { type OptionType } from '../ui/MultiSelect';

interface MobileHeaderProps {
    logo: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({logo}) => {
    const { mode, toggleTheme, toggleSidebar } = useThemeContext();
    const theme = useTheme();

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
        <Box sx={{ width: '100% !important' }}>
            {/* First Row - Logo, Menu, Theme Toggle */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
                p :0
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
                            src={logoImg.src} // your image path
                            alt="Logo"
                           style={{
                            height:'25px'
                           }}
                        />
                         <Typography fontSize='14px' variant='h2'> Jaiguru Jewellers </Typography>
                    </Box>

                
                </Box>

                {/* Right - Theme Toggle */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* <BranchSelector branchOptions={branchOptions} /> */}
                    <MultiSelectComboBox
                        options={branchOptions}
                        fieldName="selectBranch"
                        onChange={handleBranchChange}
                        value={selectedBranches}
                        minWidth={'180px'}
                    />
                </Box>
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