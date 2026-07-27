// components/Header/HeaderContent.tsx
"use client";
export const dynamic = "force-dynamic";

import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import { useCompanyDetails } from '@/context/CompanyDetailsContext';


const HeaderContent: React.FC<{companyName:string}> = ({ companyName }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { companyDetails } =useCompanyDetails();
    const logo = `${companyDetails?.BASEURL.trim()}${companyDetails?.LOGO}`
    console.log(logo ,'companydetails');


    return (
        <Box sx={{ width: '100%' }}>
            {isMobile ? <MobileHeader logo={logo} companyName={companyName}/> : <DesktopHeader logo={logo} companyName={companyName}/>}
        </Box>
    );
};

export default HeaderContent;