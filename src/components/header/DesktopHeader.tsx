// components/Header/DesktopHeader.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import {
    Box,
    Typography,
    useTheme,
    Divider,
} from '@mui/material';
import DateRangePicker from '../DateRangePicker';
import MetalRates from '../MetalRates';
import logoImg from '@/app/logo.png';
import { branchOptions } from './constant';
import MultiSelectComboBox from '../ui/MultiSelect';
import { useDashBoardContext } from '@/context/DashBoardContext';
import { OptionType } from '../ui/MultiSelect';
import ThemeToggle from './ThemeToggle';

interface DesktopHeaderProps {
    logo: string;
    companyName: string;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ logo, companyName}) => {
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
                        src={logo || logoImg.src}
                        alt="Logo"
                        style={{
                            height: '40px'
                        }}
                    />
                    <Typography fontSize='18px' variant='h2' mt={1}> {companyName} </Typography>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: theme.palette.divider }} />

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: { xs: 1, sm: 1, },
                    justifyContent: 'center',
                    maxWidth: 500,
                }}>
                    <DateRangePicker />
                </Box>
            </Box>

            {/* Right Section - Metal Rates, Branch Selector and Theme Toggle */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'flex-end',
                gap: 2.5,
                minWidth: 200,
            }}>
                {/* Metal Rates as Chips */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <MetalRates />
                </Box>

                {/* Branch Selector */}
                <Box sx={{ display: 'flex', gap: 1, minWidth: '200px' }}>
                    {/* <MultiSelectComboBox
                        options={branchOptions}
                        fieldName="selectBranch"
                        onChange={handleBranchChange}
                        value={selectedBranches}
                        label="Select Branch"
                    /> */}
                </Box>

                <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider }} />

                {/* Theme Toggle */}
                <ThemeToggle />
            </Box>
        </Box>
    );
};

export default DesktopHeader;