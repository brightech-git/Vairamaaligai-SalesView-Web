// components/Header/HeaderContent.tsx
"use client";
export const dynamic = "force-dynamic";

import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import { useCompanyDetails } from '@/context/CompanyDetailsContext';


const HeaderContent: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { companyDetails } =useCompanyDetails();

    const baseUrl = 'https://app.bmgjewellers.com'
    const logo = `${baseUrl.trim()}${companyDetails?.LOGO}`
    console.log(logo ,'companydetails');


    return (
        <Box sx={{ width: '100%' }}>
            {isMobile ? <MobileHeader logo={logo}/> : <DesktopHeader logo={logo}/>}
        </Box>
    );
};

export default HeaderContent;