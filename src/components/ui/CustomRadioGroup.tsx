import React, { forwardRef } from "react";
import {
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
} from "@mui/material";
import { handleEnterFocus } from "@/lib/useEnterNavigation";

type OptionType = {
    label: string;
    value: string;
};

type Props = {
    name: string;
    label?: string;
    value: string;
    options: OptionType[];
    onChange: (name: string, value: string) => void;
    row?: boolean;
    nextRef?: React.RefObject<HTMLElement | null>;
};

const CustomRadioGroup = forwardRef<HTMLDivElement, Props>(
    ({ name, label, value, options, onChange, row = true, nextRef }, ref) => {
        return (
            <div ref={ref}>
                {label && <FormLabel>{label}</FormLabel>}

                <RadioGroup
                    row={row}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    onKeyDown={(e) => handleEnterFocus(e, nextRef)}
                    
                >
                    {options.map((opt) => (
                        <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio  color="info"/>}
                            label={opt.label}
                           
                        />
                    ))}
                </RadioGroup>
            </div>
        );
    }
);

export default CustomRadioGroup;