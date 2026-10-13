"use client";
import { useState } from "react";
import { Box, IconButton, Tooltip, Popover, Typography, ToggleButtonGroup, ToggleButton, Switch, FormControlLabel, Divider } from "@mui/material";
import { TuneRounded, LightModeOutlined, DarkModeOutlined } from "@mui/icons-material";
import { useThemeContext } from "@/context/ThemeContext";
export default function ThemeSettings() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { mode, setThemeMode, glass, setGlass } = useThemeContext();
  return <>
    <Tooltip title="Theme settings"><IconButton size="small" aria-label="Theme settings" aria-expanded={Boolean(anchor)} onClick={event => setAnchor(event.currentTarget)}><TuneRounded fontSize="small" /></IconButton></Tooltip>
    <Popover open={Boolean(anchor)} anchorEl={anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { className: "glass-surface", sx: { width: 270, p: 2, mt: 1, border: "1px solid", borderColor: "divider", borderRadius: 2 } } }}>
      <Typography variant="h6" sx={{ mb: .5 }}>Theme settings</Typography><Typography variant="caption" color="text.secondary">Personalize your workspace.</Typography>
      <Typography variant="body2" fontWeight={700} sx={{ mt: 2, mb: 1 }}>Appearance</Typography>
      <ToggleButtonGroup exclusive value={mode} onChange={(_, value) => { if (value) setThemeMode(value); }} size="small" fullWidth aria-label="Appearance"><ToggleButton value="light" sx={{ gap: 1, textTransform: "none", "&.Mui-selected, &.Mui-selected:hover": { bgcolor: "primary.main", color: "primary.contrastText" } }}><LightModeOutlined fontSize="small" />Light</ToggleButton><ToggleButton value="dark" sx={{ gap: 1, textTransform: "none", "&.Mui-selected, &.Mui-selected:hover": { bgcolor: "primary.main", color: "primary.contrastText" } }}><DarkModeOutlined fontSize="small" />Dark</ToggleButton></ToggleButtonGroup>
      <Divider sx={{ my: 2 }} /><Typography variant="body2" fontWeight={700}>Maroon palette</Typography><Box sx={{ display: "flex", gap: 1, my: 1 }}>{["#681c32", "#a75e78", "#e8bdca", "#f8f3f4"].map(color => <Box key={color} sx={{ bgcolor: color, height: 24, flex: 1, borderRadius: 1, border: "1px solid #681c3218" }} />)}</Box>
      <FormControlLabel sx={{ m: 0, width: "100%", justifyContent: "space-between" }} labelPlacement="start" control={<Switch size="small" checked={glass} onChange={event => setGlass(event.target.checked)} />} label={<Typography variant="body2">Glass effects</Typography>} />
    </Popover>
  </>;
}
