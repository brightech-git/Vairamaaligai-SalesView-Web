import React, { forwardRef } from "react";
import { Autocomplete, TextField, Checkbox } from "@mui/material";
import { handleEnterFocus } from "@/lib/useEnterNavigation";

export type OptionType = {
    label: string;
    value?: string | number;
};

type Props = {
    fieldName: string;
    label?: string;
    options: OptionType[];
    value: OptionType[];
    onChange: (fieldName: string, value: OptionType[]) => void;
    nextRef?: React.RefObject<HTMLElement | null>;
    minWidth?: string | number;

};

const MultiSelectComboBox = forwardRef<HTMLInputElement, Props>(
    ({ label, fieldName, options, value, onChange, nextRef ,minWidth }, ref) => {
        return (
            <Autocomplete<OptionType, true, false, false>
                multiple
                options={options}
                disableCloseOnSelect

                

                value={value}

                onChange={(_, newValue) => onChange(fieldName, newValue)}

                getOptionLabel={(option) => option.label}

                isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                }

                renderOption={(props, option, { selected }) => {
                    const { key, ...rest } = props;

                    return (
                        <li key={key} {...rest} style={{fontSize:"10px"}}>
                            <Checkbox checked={selected} size="small"  />
                            {option.label}
                        </li>
                    );
                }}

                renderTags={(selected) =>
                    selected.length > 0 ? (
                        <span style={{ paddingLeft: 4, whiteSpace: "nowrap" }}>
                            {selected.length} selected
                        </span>
                    ) : null
                }

                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        inputRef={ref}
                        onKeyDown={(e) => handleEnterFocus(e, nextRef)}
                        sx={{ width: "100%", minWidth: minWidth || "200px" }}
                        size="small"

                        
                    />
                )}
            />
        );
    }
);

export default MultiSelectComboBox;