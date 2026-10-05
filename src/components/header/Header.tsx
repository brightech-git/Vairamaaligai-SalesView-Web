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

    const drawerWidth = sidebarOpen ? 200 : 62;

    const headerWidth ='100%'
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
                marginBottom: sidebarOpen? '1rem':'0.5rem'
            }}
        >
            <Toolbar>
                <HeaderContent />
            </Toolbar>
        </AppBar>
    );
};

export default Header;