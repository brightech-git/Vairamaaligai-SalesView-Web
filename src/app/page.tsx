"use client";


import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useRouter } from "next/navigation";
import { Box, Typography, useTheme } from "@mui/material";


const DashboardPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

 const getAuthSession = (): boolean => {
    const itemStr = sessionStorage.getItem("isAuthenticated");
    if (!itemStr) return false;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
        sessionStorage.removeItem("isAuthenticated");
        return false;
    }

    return item.value;
};


  useEffect(() => {
    const auth = getAuthSession();
    if (auth === true) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/login"); // redirect to login if not authenticated
    }
  }, [router]);

  if (isAuthenticated === null) return null; // wait until check is done
  if (!isAuthenticated) return null; // prevent flash of content

  return (
    <DashboardLayout>
      <Box
        sx={{
          p: 3,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* <Typography variant="h5" fontWeight={600}>
          Welcome to the Dashboard
        </Typography>

        <Typography variant="body1" mt={2} >
          This content is only visible to logged-in users.
        </Typography> */}
      </Box>
    </DashboardLayout>
  );
};

export default DashboardPage;
