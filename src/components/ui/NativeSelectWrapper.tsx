"use client";

import React, { forwardRef } from "react";
import { NativeSelect } from "@chakra-ui/react";
import { For } from "@chakra-ui/react";

export type SelectItem = {
    label: string;
    value: string;
};

type NativeSelectWrapperProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    items: SelectItem[];
    placeholder?: string;
    size?: "xs" | "sm" | "md" | "lg";
    maxW?: string;
    fontSize?: string;
    disabled?: boolean;
    onEnter?: () => void; // <-- add this
    className?: string;
    css?: any;
    onBlur?:()=>void;
    onFocus?:()=>void
    minW?:string
    defalutValue ?:string
};

export const NativeSelectWrapper = forwardRef<HTMLSelectElement, NativeSelectWrapperProps>(({
    value,
    onChange,
    items,
    placeholder = "Select",
    size = "xs",
    maxW = "120px",
    fontSize = "10px",
    disabled = false,
    onEnter,
    className,
    css,
    onBlur,
    minW = "50px",
    defalutValue
    
}, ref) => {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // prevent opening dropdown
            e.stopPropagation();
            onEnter?.(); // call your navigation function
        }
    };

    return (
       <NativeSelect.Root style={{ color: "var(--theme-input-text)" }} size={size} maxW={maxW} minW={minW} fontSize={fontSize} disabled={disabled} onBlur={onBlur} defaultValue={defalutValue}>
            <NativeSelect.Field
                ref={ref}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown} // use custom handler
                className={className}
                css={{
                    backgroundColor: "#eee",
                    color: "#111827",
                    border: "1px solid #e5e7eb",
                    borderRadius: "20px",
                    height: "30px",
                    fontSize: fontSize,
                    ...css,
                }}
                
            >
                {/* Placeholder — only rendered while nothing is selected yet, so
                    "" stays distinct from any real option and the browser doesn't
                    silently default-display the first item in `items`. Once a real
                    value is set, this is omitted so it never shows up as a stray
                    extra choice in selects that always carry a real value (e.g.
                    page-size pickers). */}
                {!value && <option value="">{placeholder}</option>}
                <For each={items}>
                    {(item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    )}
                </For>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
        </NativeSelect.Root>
    );
});

NativeSelectWrapper.displayName = 'NativeSelectWrapper';