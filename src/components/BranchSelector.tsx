"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Chip,
    OutlinedInput,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { useDashBoardContext } from "@/context/DashBoardContext";

interface BranchOption {
    branchId: string;
    branchName: string;
}

interface BranchSelectorProps {
    branchOptions: BranchOption[];
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ branchOptions }) => {
    const { filters, setFilters } = useDashBoardContext();
    const [selectedIds, setSelectedIds] = useState<string[]>(filters.branchIds || []);

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm")); // small screens

    useEffect(() => {
        setSelectedIds(filters.branchIds || []);
    }, [filters.branchIds]);

    const handleChange = (event: SelectChangeEvent<typeof selectedIds>) => {
        const value = event.target.value as string[];
        setSelectedIds(value);
        setFilters((prev) => ({ ...prev, branchIds: value }));
    };

    const handleDelete = (id: string) => {
        const newSelected = selectedIds.filter((item) => item !== id);
        setSelectedIds(newSelected);
        setFilters((prev) => ({ ...prev, branchIds: newSelected }));
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: isXs ? 0.5 : 1,
            }}
        >
            {/* Small Branch Select Box */}
            <FormControl
                size="small"
                sx={{
                    minWidth: isXs ? 0 : 120,
                    "& .MuiInputLabel-root": { fontSize: isXs ? "0.5rem" : "0.85rem" },
                    "& .MuiSelect-select": { fontSize: isXs ? "0.5rem" : "0.85rem" },
                }}
            >
                <InputLabel id="branch-select-label">Branches</InputLabel>
                <Select
                    labelId="branch-select-label"
                    multiple
                    value={selectedIds}
                    onChange={handleChange}
                    input={<OutlinedInput label="Branches" />}
                    renderValue={() => null} // hide value inside select
                >
                    {branchOptions.map((branch) => (
                        <MenuItem
                            key={branch.branchId}
                            value={branch.branchId}
                            sx={{ fontSize: isXs ? "0.5rem" : "0.85rem" }}
                        >
                            {branch.branchName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Selected Branch Chips Inline */}
            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: {xs:0.15,md:0.5},
                    py: 0.5,
                    "&::-webkit-scrollbar": { display: "none" }, // hide scrollbar
                }}
            >
                {selectedIds.map((id) => {
                    const branch = branchOptions.find((b) => b.branchId === id);
                    return (
                        <Chip
                            key={id}
                            label={branch?.branchName || id}
                            size="small"
                            onDelete={() => handleDelete(id)}
                            sx={{
                                fontSize: "0.45rem",
                                height: 20,
                                whiteSpace: "nowrap",
                            }}
                        />
                    );
                })}
            </Box>


        </Box>
    );
};

export default BranchSelector;
