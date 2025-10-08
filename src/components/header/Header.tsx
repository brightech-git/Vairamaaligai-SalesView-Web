// components/Header/Header.tsx
"use client";
export const dynamic = "force-dynamic";

import React from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useThemeContext } from '@/context/ThemeContext';
import HeaderContent from './HeaderContent';

const Header: React.FC = () => {
    const { sidebarOpen } = useThemeContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const drawerWidth = sidebarOpen ? 240 : 72;

    const headerWidth = isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`;
    const headerMarginLeft = isMobile ? 0 : `${drawerWidth}px`;

    return (
        <AppBar
            position="fixed"
            sx={{
                width: headerWidth,
                ml: headerMarginLeft,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                zIndex: theme.zIndex.drawer + 1,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
        >
            <Toolbar sx={{ minHeight: '64px!important', py: 1 }}>
                <HeaderContent />
            </Toolbar>
        </AppBar>
    );
};

export default Header;