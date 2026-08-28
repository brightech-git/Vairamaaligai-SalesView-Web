// components/Header/MobileHeader.tsx
"use client";
export const dynamic = "force-dynamic";

import React,{useState} from 'react';
import {
    Box,
    IconButton,
    Typography,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useThemeContext } from '@/context/ThemeContext';
import DateRangePicker from '../DateRangePicker';
import MetalRates from '../MetalRates';
import logoImg from '@/app/logo.png';
import { branchOptions } from './constant';
import MultiSelectComboBox from '../ui/MultiSelect';
import { useDashBoardContext } from '@/context/DashBoardContext';
import { type OptionType } from '../ui/MultiSelect';
import ThemeToggle from './ThemeToggle';
import MaterialGroupSelect from './MaterialGroupSelect';

interface MobileHeaderProps {
    logo: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({logo}) => {
    const { toggleSidebar } = useThemeContext();
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
                gap: 1,
                p: 0
            }}>
                {/* Left - Menu & Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0 }}>
                    <IconButton
                        onClick={toggleSidebar}
                        size="small"
                        sx={{ color: 'inherit', flexShrink: 0 }}
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
                            minWidth: 0,
                        }}
                    >
                        <img
                            src={logoImg.src} // your image path
                            alt="Logo"
                           style={{
                            height:'25px',
                            flexShrink: 0,
                           }}
                        />
                        <Typography
                            fontSize='14px'
                            variant='h2'
                            noWrap
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                ml: 0.5,
                            }}
                        >
                            Jaiguru Jewellers
                        </Typography>
                    </Box>
                </Box>

                {/* Right - Theme Toggle */}
                <ThemeToggle size="small" />
            </Box>

            {/* Second Row - Material/Category & Branch Selector */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                width: '100%',
                gap: 1,
                mb: 1,
            }}>
                <MaterialGroupSelect minWidth={'110px'} />
                <Box sx={{ flex: 1, minWidth: '120px' }}>
                    <MultiSelectComboBox
                        options={branchOptions}
                        fieldName="selectBranch"
                        onChange={handleBranchChange}
                        value={selectedBranches}
                        minWidth={'120px'}
                    />
                </Box>
            </Box>

            {/* Third Row - Date Picker and Metal Rates */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
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