// components/MetalRates.tsx
"use client";
export const dynamic = "force-dynamic";

import React from 'react';
import { Box, Chip, useTheme, useMediaQuery } from '@mui/material';
import { useAppContext } from '@/context/AppContext';

interface MetalRatesProps {
    compact?: boolean;
}

const MetalRates: React.FC<MetalRatesProps> = ({ compact = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { metalRates } = useAppContext();
    console.log(metalRates ,'metalRates')

    // Chip style configuration
    const chipStyles = {
        gold: {
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000 !important',
            border: `1px solid ${theme.palette.warning.main}`,
        },
        silver: {
            background: 'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)',
            color: '#000 !important',
            border: `1px solid ${theme.palette.grey[400]}`,
        }
    };

    if (compact || isMobile) {
        return (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {/* Gold Chip */}
                <Chip
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span style={{ fontFamily: "'Funnel Display', sans-serif" }}>
                                Gold:
                            </span>
                            <span style={{
                                fontFamily: "'Delius', cursive",
                                fontWeight: 600
                            }}>
                                ₹{metalRates.G}
                            </span>
                        </Box>
                    }
                    size="small"
                    sx={{
                        ...chipStyles.gold,
                        fontSize: '0.75rem',
                        height: '28px',
                        '& .MuiChip-label': {
                            padding: '0 8px',
                        },
                       
                    }}
                />

                {/* Silver Chip */}
                <Chip
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span style={{ fontFamily: "'Funnel Display', sans-serif" }}>
                                Silver:
                            </span>
                            <span style={{
                                fontFamily: "'Delius', cursive",
                                fontWeight: 600
                            }}>
                                ₹{metalRates.S}
                            </span>
                        </Box>
                    }
                    size="small"
                    sx={{
                        ...chipStyles.silver,
                        fontSize: '0.75rem',
                        height: '28px',
                        '& .MuiChip-label': {
                            padding: '0 8px',
                        }
                    }}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Gold Chip */}
            <Chip
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{
                            fontFamily: "'Funnel Display', sans-serif",
                            fontSize: '14px'
                        }}>
                            Gold:
                        </span>
                        <span style={{
                            fontFamily: "'Delius', cursive",
                            fontWeight: 700,
                            fontSize: '14px'
                        }}>
                            ₹{metalRates.G}
                        </span>
                    </Box>
                }
                sx={{
                    ...chipStyles.gold,
                    height: '36px',
                    '& .MuiChip-label': {
                        padding: '0 12px',
                    }
                }}
            />

            {/* Silver Chip */}
            <Chip
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{
                            fontFamily: "'Funnel Display', sans-serif",
                            fontSize: '14px'
                        }}>
                            Silver:
                        </span>
                        <span style={{
                            fontFamily: "'Delius', cursive",
                            fontWeight: 700,
                            fontSize: '14px'
                        }}>
                            ₹{metalRates.S}
                        </span>
                    </Box>
                }
                sx={{
                    ...chipStyles.silver,
                    height: '36px',
                    '& .MuiChip-label': {
                        padding: '0 12px',
                    }
                }}
            />
        </Box>
    );
};

export default MetalRates;