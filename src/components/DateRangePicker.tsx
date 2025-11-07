// components/DateRangePicker.tsx
"use client";
export const dynamic = "force-dynamic";

import React, { useState } from 'react';
import {
    Box,
    Chip,
    Popover,
    Typography,
    useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subDays, startOfDay, endOfDay, isToday, isSameDay } from 'date-fns';
import { useAppContext } from '@/context/AppContext';

interface DateRangePickerProps { }

const DateRangePicker: React.FC<DateRangePickerProps> = () => {
    const theme = useTheme();
    const { dateRange, fetchDataWithDates, selectedChip, setSelectedChip } = useAppContext();

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [tempStartDate, setTempStartDate] = useState<Date | null>(dateRange.startDate);
    const [tempEndDate, setTempEndDate] = useState<Date | null>(dateRange.endDate);

    const handleChipClick = (period: string) => {
        setSelectedChip(period);
        const today = new Date();
        let start: Date;
        let end: Date = endOfDay(today);

        switch (period) {
            case 'today':
                start = startOfDay(today);
                break;
            case 'last7days':
                start = startOfDay(subDays(today, 7));
                break;
            case 'last30days':
                start = startOfDay(subDays(today, 30));
                break;
            default:
                start = startOfDay(today);
                break;
        }

        setTempStartDate(start); // update local state
        setTempEndDate(end);     // update local state
        fetchDataWithDates(start, end);
        setAnchorEl(null);
    };


    const handleCustomRangeApply = () => {
        if (tempStartDate && tempEndDate) {
            setSelectedChip('custom');
            fetchDataWithDates(startOfDay(tempStartDate), endOfDay(tempEndDate));
            setAnchorEl(null);
        }
    };

    // Format date for display
    const formatDateForDisplay = (date: Date) => {
        if (isToday(date)) {
            return 'Today';
        }
        return format(date, 'dd/MM/yyyy');
    };

    const getDisplayText = () => {
        if (selectedChip === 'today' && isSameDay(dateRange.startDate, dateRange.endDate)) {
            return formatDateForDisplay(dateRange.startDate);
        }
        return `${formatDateForDisplay(dateRange.startDate)} - ${formatDateForDisplay(dateRange.endDate)}`;
    };

    const chips = [
        { label: 'Today', value: 'today' },
        { label: 'Last 7 Days', value: 'last7days' },
        { label: 'Last 30 Days', value: 'last30days' },
    ];

    const open = Boolean(anchorEl);
    // Helper to check if a date range matches a predefined range
    const getActiveChip = () => {
        const today = new Date();
        const { startDate, endDate } = dateRange;
        if (!startDate || !endDate) return null;

        if (isSameDay(startDate, today) && isSameDay(endDate, today)) return 'today';
        if (isSameDay(startDate, subDays(today, 7)) && isSameDay(endDate, today)) return 'last7days';
        if (isSameDay(startDate, subDays(today, 30)) && isSameDay(endDate, today)) return 'last30days';
        if (selectedChip === 'custom') return 'custom';
        return null;
    };

    const activeChip = getActiveChip();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
            }}>
                {/* Date Display Chip - Main Date Range */}
                <Chip
                    label={getDisplayText()}
                    variant="outlined"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                        backgroundColor: theme.palette.background.paper,
                        fontFamily: "'Funnel Display', sans-serif",
                        fontWeight: 600,
                        fontSize: '14px',
                        height: '36px',
                        '&:hover': {
                            opacity: 1,
                            color: '#000'

                        },
                    }}
                />

                {/* Quick Selection Chips */}
                <Box sx={{
                    display: {xs: 'none', sm: 'flex'},
                    gap: 1,
                    alignItems: 'center',
                }}>
                    {chips.map((chip) => (
                        <Chip
                            key={chip.value}
                            label={chip.label}
                            size="small"
                            variant={activeChip === chip.value ? "filled" : "outlined"}
                            onClick={() => handleChipClick(chip.value)}
                            sx={{
                                fontFamily: "'Funnel Display', sans-serif",
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                ...(activeChip === chip.value && {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    '&:hover': {
                                        opacity: 1,
                                        color: '#000'
                                    },
                                }),
                                ...(activeChip !== chip.value && {
                                    borderColor: theme.palette.grey[400],
                                    color: theme.palette.text.secondary,
                                    '&:hover': {
                                        opacity: 1,
                                        color: '#000'
                                    },
                                }),
                            }}
                        />

                    ))}
                </Box>

                {/* Custom Date Range Popover */}
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    sx={{
                        '& .MuiPopover-paper': {
                            p: 3,
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            minWidth: 320,
                        },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            fontFamily: "'Quintessential', cursive",
                            color: theme.palette.text.primary,
                            textAlign: 'center',
                        }}
                    >
                        Select Date Range
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 3,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}>
                        <DatePicker
                            label="Start Date"
                            value={tempStartDate}
                            onChange={(newValue) => setTempStartDate(newValue)}
                            maxDate={tempEndDate || new Date()}
                            format="dd/MM/yyyy" // <-- Add this
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    sx: {
                                        '& .MuiOutlinedInput-root': {
                                            color: theme.palette.text.primary,
                                            '& fieldset': { borderColor: theme.palette.divider },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                        },
                                        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                    },
                                },
                            }}
                        />

                        <DatePicker
                            label="End Date"
                            value={tempEndDate}
                            onChange={(newValue) => setTempEndDate(newValue)}
                            maxDate={new Date()}
                            format="dd/MM/yyyy" // <-- Add this
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    sx: {
                                        '& .MuiOutlinedInput-root': {
                                            color: theme.palette.text.primary,
                                            '& fieldset': { borderColor: theme.palette.divider },
                                            '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                        },
                                        '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                    },
                                },
                            }}
                        />

                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Chip
                            label="Cancel"
                            variant="outlined"
                            onClick={() => setAnchorEl(null)}
                            sx={{
                                borderColor: theme.palette.grey[400],
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }}
                        />
                        <Chip
                            label="Apply Dates"
                            onClick={handleCustomRangeApply}
                            disabled={!tempStartDate || !tempEndDate}
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: theme.palette.action.disabledBackground,
                                    color: theme.palette.action.disabled,
                                },
                            }}
                        />
                    </Box>

                    {/* Preview of selected dates */}
                    {tempStartDate && tempEndDate && (
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 2,
                                textAlign: 'center',
                                fontFamily: "'Funnel Display', sans-serif",
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {format(tempStartDate, 'dd/MM/yyyy')} - {format(tempEndDate, 'dd/MM/yyyy')}
                        </Typography>
                    )}
                </Popover>
            </Box>
        </LocalizationProvider>
    );
};

export default DateRangePicker;