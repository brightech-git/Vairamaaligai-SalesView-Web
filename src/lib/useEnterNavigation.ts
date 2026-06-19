export const handleEnterFocus = (
    e: React.KeyboardEvent,
    nextRef?: React.RefObject<HTMLElement | null>
) => {
    if (e.key === "Enter") {
        e.preventDefault();
        nextRef?.current?.focus();
    }
};