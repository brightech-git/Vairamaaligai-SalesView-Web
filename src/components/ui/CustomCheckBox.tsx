import React, { forwardRef } from "react";
import { FormControlLabel, Checkbox } from "@mui/material";
import { handleEnterFocus } from "@/lib/useEnterNavigation";

type Props = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    nextRef?: React.RefObject<HTMLElement | null>;
};

const CustomCheckbox = forwardRef<HTMLInputElement, Props>(
    ({ label, checked, onChange, nextRef }, ref) => {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        inputRef={ref}
                        onKeyDown={(e) => handleEnterFocus(e, nextRef)}
                    />
                }
                label={label}
            />
        );
    }
);

export default CustomCheckbox;