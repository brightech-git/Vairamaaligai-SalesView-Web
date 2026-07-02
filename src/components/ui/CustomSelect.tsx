import React, { forwardRef, useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { handleEnterFocus } from "@/lib/useEnterNavigation";

type OptionType = {
    label: string;
    value: string;
};

type Props = {
    fieldName: string;
    label?: string;
    value?: string | number; // make optional
    onChange: (fieldName: string, value: string) => void;
    options: OptionType[];
    nextRef?: React.RefObject<HTMLElement | null>;
    optionHeight?: number;
    size?: "small" | "medium";
    defaultValue?: OptionType; // initial fallback only
    placeHolder?:string
    fontSize?:
    | string
    | {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
    };
};

const CustomSelect = forwardRef<HTMLInputElement, Props>(
    (
        {
            label,
            fieldName,
            value,
            onChange,
            options,
            nextRef,
            optionHeight = 200,
            size = "small",
            defaultValue,
            placeHolder,
            fontSize = "12px"
        },
        ref
    ) => {
        // ✅ Controlled value takes priority
        const selectedOption = useMemo(() => {
            if (value !== undefined && value !== null && value !== "") {
                return options.find((opt) => opt.value === value) || null;
            }

            // fallback to defaultValue ONLY if no value
            return defaultValue ?? null;
        }, [value, options, defaultValue]);

        return (
            <Autocomplete
                options={options}
                value={selectedOption}
                onChange={(_, newValue) => {
                    onChange(fieldName, newValue?.value || "");
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                slotProps={{
                    paper: {
                        sx: { maxHeight: optionHeight },
                    },
                }}
                size="small"
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        inputRef={ref}
                        onKeyDown={(e) => handleEnterFocus(e, nextRef)}
                        size={size}
                        placeholder={placeHolder}
                        fullWidth
                        sx={{
                            "& .MuiInputBase-input": {
                                fontSize,
                            },
                        }}
                    />
                )}
            />
        );
    }
);

export default CustomSelect;