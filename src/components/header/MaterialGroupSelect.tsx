// components/Header/MaterialGroupSelect.tsx
"use client";

import React from "react";
import { MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material";
import { useDashBoardContext, type MaterialGroupBy } from "@/context/DashBoardContext";

interface MaterialGroupSelectProps {
    minWidth?: string | number;
}

const groupOptions: { value: MaterialGroupBy; label: string }[] = [
    { value: "metal", label: "Metal" },
    { value: "category", label: "Category" },
];

const MaterialGroupSelect: React.FC<MaterialGroupSelectProps> = ({ minWidth = "140px" }) => {
    const theme = useTheme();
    const { filters, setFilters } = useDashBoardContext();

    const handleChange = (event: SelectChangeEvent) => {
        setFilters((prev) => ({...prev, "type" :event.target.value as MaterialGroupBy}));
    };

    return (
        <Select
            size="small"
            value={filters.type}
            onChange={handleChange}
            sx={{
                minWidth,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                },
            }}
        >
            {groupOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                </MenuItem>
            ))}
        </Select>
    );
};

export default MaterialGroupSelect;
