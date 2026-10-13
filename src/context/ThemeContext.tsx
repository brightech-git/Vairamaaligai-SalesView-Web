"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react";
import { ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
interface ThemeContextProps { mode: "light" | "dark"; toggleTheme: () => void; setThemeMode: (mode: "light" | "dark") => void; glass: boolean; setGlass: (enabled: boolean) => void; isLargeScreen: boolean; sidebarOpen: boolean; toggleSidebar: () => void; }
const defaults: ThemeContextProps = { mode: "light", toggleTheme: () => {}, setThemeMode: () => {}, glass: true, setGlass: () => {}, isLargeScreen: true, sidebarOpen: true, toggleSidebar: () => {} };
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
export const useThemeContext = () => { const value = useContext(ThemeContext); if (!value) throw new Error("ThemeContextProvider is required"); return value; };
export const useSafeThemeContext = () => useContext(ThemeContext) ?? defaults;
export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [glass, updateGlass] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    updateGlass(localStorage.getItem("app-glass") !== "false");
    const saved = localStorage.getItem("app-theme");
    setMode(saved === "dark" || saved === "light" ? saved : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setSidebarOpen(window.innerWidth >= 900 && localStorage.getItem("sidebar-state") !== "false");
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = mode; }, [mode]);
  useEffect(() => { document.documentElement.dataset.glass = String(glass); }, [glass]);
  const setGlass = useCallback((enabled: boolean) => { updateGlass(enabled); localStorage.setItem("app-glass", String(enabled)); }, []);
  const setThemeMode = useCallback((next: "light" | "dark") => { setMode(next); localStorage.setItem("app-theme", next); }, []);
  const toggleTheme = useCallback(() => setMode(current => { const next = current === "light" ? "dark" : "light"; localStorage.setItem("app-theme", next); return next; }), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(current => { localStorage.setItem("sidebar-state", String(!current)); return !current; }), []);
  const theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: mode === "light" ? "#681c32" : "#eaa7b7" }, secondary: { main: "#8c6b40" },
      background: { default: mode === "light" ? "#f8f3f4" : "#1c141a", paper: mode === "light" ? "#ffffff" : "#2a1e26" },
      text: { primary: mode === "light" ? "#36232c" : "#f6e9ee", secondary: mode === "light" ? "#806975" : "#c4abb6" },
      divider: mode === "light" ? "#eadde2" : "#49343f" },
    typography: { fontFamily: 'Lato, "Segoe UI", Arial, sans-serif', fontSize: 14,
      h1: { fontSize: "2.5rem", fontWeight: 700 }, h2: { fontSize: "2rem", fontWeight: 700 }, h3: { fontSize: "1.75rem", fontWeight: 700 },
      h4: { fontSize: "1.25rem", fontWeight: 700 }, h5: { fontSize: "1.25rem", fontWeight: 700 }, h6: { fontSize: "1rem", fontWeight: 700 },
      body1: { fontSize: "0.9375rem", lineHeight: 1.65 }, body2: { fontSize: "0.875rem", lineHeight: 1.6 }, caption: { fontSize: "0.75rem" }, button: { fontSize: "0.875rem", fontWeight: 700 } },
    shape: { borderRadius: 10 },
    components: {
      MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: "none" } } },
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { textTransform: "none", minHeight: 32, paddingInline: 12, transition: "background-color 180ms, box-shadow 180ms, transform 180ms", "&:active": { transform: "translateY(1px)" } } } },
      MuiIconButton: { styleOverrides: { root: { transition: "background-color 180ms" } } },
      MuiOutlinedInput: { styleOverrides: { root: { fontSize: 14, "& fieldset": { borderColor: mode === "light" ? "#ddcbd3" : "#614652" } } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 7, fontSize: 13 } } },
      MuiListItemButton: { styleOverrides: { root: { borderRadius: 8, minHeight: 36, transition: "background-color 180ms", "&.Mui-selected": { backgroundColor: alpha(mode === "light" ? "#681c32" : "#eaa7b7", .1) } } } },
      MuiTooltip: { defaultProps: { arrow: true } },
      MuiCssBaseline: { styleOverrides: { body: { transition: "background-color 200ms, color 200ms" } } },
    }
  }), [mode]);
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const value = useMemo(() => ({ mode, toggleTheme, setThemeMode, glass, setGlass, sidebarOpen, toggleSidebar, isLargeScreen }), [mode, toggleTheme, setThemeMode, glass, setGlass, sidebarOpen, toggleSidebar, isLargeScreen]);
  return <ThemeContext.Provider value={value}><ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider></ThemeContext.Provider>;
};
