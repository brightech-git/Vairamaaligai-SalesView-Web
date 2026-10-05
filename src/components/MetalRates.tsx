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
                            <span style={{ fontFamily: "'Funnel Display', sans-serif" ,fontSize : "10px" }}>
                                Gold:
                            </span>
                            <span style={{
                                fontFamily: "'Delius', cursive",
                                fontWeight: 600 ,
                                fontSize : "8px"
                            }}>
                                ₹{metalRates.GOLDRATE}
                            </span>
                        </Box>
                    }
                    size="small"
                    sx={{
                        ...chipStyles.gold,
                        fontSize: '0.75rem',
                        height: '24px',
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
                                ₹{metalRates.SILVERRATE}
                            </span>
                        </Box>
                    }
                    size="small"
                    sx={{
                        ...chipStyles.silver,
                        fontSize: '0.75rem',
                        height: '24px',
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
                            fontSize: '12px'
                        }}>
                            Gold:
                        </span>
                        <span style={{
                            fontFamily: "'Delius', cursive",
                            fontWeight: 700,
                            fontSize: '13px'
                        }}>
                            ₹{metalRates.GOLDRATE}
                        </span>
                    </Box>
                }
                sx={{
                    ...chipStyles.gold,
                    height: '32px',
                    '& .MuiChip-label': {
                        padding: '0 8px',
                    }
                }}
            />

            {/* Silver Chip */}
            <Chip
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{
                            fontFamily: "'Funnel Display', sans-serif",
                            fontSize: '12px'
                        }}>
                            Silver:
                        </span>
                        <span style={{
                            fontFamily: "'Delius', cursive",
                            fontWeight: 700,
                            fontSize: '13px'
                        }}>
                            ₹{metalRates.SILVERRATE}
                        </span>
                    </Box>
                }
                sx={{
                    ...chipStyles.silver,
                    height: '32px',
                    '& .MuiChip-label': {
                        padding: '0 8px',
                    }
                }}
            />
        </Box>
    );
};

export default MetalRates;