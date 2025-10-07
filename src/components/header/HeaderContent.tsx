// components/Header/HeaderContent.tsx
"use client";

import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';

const HeaderContent: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ width: '100%' }}>
            {isMobile ? <MobileHeader /> : <DesktopHeader />}
        </Box>
    );
};

export default HeaderContent;