import React from "react";
import { Box, Typography } from "@mui/material";

type Props = {
    label: string;
    children: React.ReactNode;
    labelWidth?: number; // optional fixed width
    fieldWidth?: number;
};

const FormRow = ({ label, children, labelWidth = 100 , fieldWidth = 200 }: Props) => {
    return (
        <Box display="flex" alignItems="center" gap={2} mb={1.5}>
            {/* Label */}
            <Typography
                sx={{
                    minWidth: labelWidth, // 🔥 important
                    fontSize: {
                        xs: "12px", // mobile
                        sm: "13px", // small tablet
                        md: "14px", // tablet
                        lg: "15px", // desktop
                        xl: "16px", // large desktop
                    }
                }}
            >
                {label}
            </Typography>

            {/* Field */}
            <Box sx={{minWidth : fieldWidth ,fontSize :"12px" }}>{children}</Box>
        </Box>
    );
};

export default FormRow;