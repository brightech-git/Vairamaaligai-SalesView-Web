"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, CircularProgress, useTheme } from "@mui/material";
import { fetchSchemeList, SchemeListItem } from "@/service/SchemeReportService";

interface SchemeAutocompleteProps {
    value: SchemeListItem | null;
    onChange: (scheme: SchemeListItem | null) => void;
    size?: "small" | "medium";
    label?: string;
}

const SchemeAutocomplete: React.FC<SchemeAutocompleteProps> = ({
    value,
    onChange,
    size = "small",
    label = "Scheme",
}) => {
    const theme = useTheme();
    const [options, setOptions] = useState<SchemeListItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        fetchSchemeList()
            .then((list) => {
                if (active) setOptions(list);
            })
            .catch(() => {
                if (active) setOptions([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    return (
        <Autocomplete
            options={options}
            loading={loading}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            getOptionLabel={(option) => option.schemeName || ""}
            isOptionEqualToValue={(option, val) => option.schemeId === val.schemeId}
            size={size}
            sx={{
                width: "100%",
                minWidth: 220,
                "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.paper,
                },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="All Schemes"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default SchemeAutocomplete;
