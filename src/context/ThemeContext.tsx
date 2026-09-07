"use client";
export const dynamic = "force-dynamic";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
    ThemeOptions
} from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";

// Types
interface ThemeContextProps {
    mode: "light" | "dark";
    toggleTheme: () => void;
    isLargeScreen: boolean;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

interface ThemeProviderProps {
    children: ReactNode;
}

// Constants
const THEME_STORAGE_KEY = "app-theme";
const SIDEBAR_STORAGE_KEY = "sidebar-state";
const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

// Theme Context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        // Return default values during SSR instead of throwing
        if (typeof window === 'undefined') {
            return {
                mode: "light",
                toggleTheme: () => { },
                isLargeScreen: true,
                sidebarOpen: true,
                toggleSidebar: () => { },
            };
        }
        throw new Error("useThemeContext must be used within a ThemeContextProvider");
    }
    return context;
};
export const useSafeThemeContext = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        return {
            mode: "light",
            toggleTheme: () => { },
            isLargeScreen: true,
            sidebarOpen: true,
            toggleSidebar: () => { },
        };
    }
    return context;
};

const getInitialTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";

    const saved = localStorage.getItem(THEME_STORAGE_KEY) as "light" | "dark" | null;
    if (saved) return saved;

    return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light";
};

const getInitialSidebarState = (): boolean => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return saved ? JSON.parse(saved) : true;
};

export const ThemeContextProvider = ({ children }: ThemeProviderProps) => {
    const [mode, setMode] = useState<"light" | "dark">("light");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Initialize theme and sidebar
    useEffect(() => {
        const initialTheme = getInitialTheme();
        const initialSidebar = getInitialSidebarState();
        setMode(initialTheme);
        setSidebarOpen(initialSidebar);
    }, []);

    const toggleTheme = (): void => {
        setMode((currentMode) => {
            const newMode = currentMode === "light" ? "dark" : "light";
            localStorage.setItem(THEME_STORAGE_KEY, newMode);
            return newMode;
        });
    };

    const toggleSidebar = (): void => {
        setSidebarOpen((current) => {
            const newState = !current;
            localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newState));
            return newState;
        });
    };

    // Enhanced color palettes
    const lightPalette = {
        background: {
            default: "#FFFFFF",
            paper: "#FFFFFF",

        },
        text: {
            primary: "#1A1A1A",
            secondary: "#FFFFFF",
            disabled: "#8a8a8a",
        },
        primary: {
            main: "#80004D",
            light: "#A64C7C",
            dark: "#56002F",
        },
        secondary: {
            main: "#D4AF37",
            light: "#E0C670",
            dark: "#A8862B",
        },
        success: {
            main: "#10b981",
        },
        warning: {
            main: "#f59e0b",
        },
        error: {
            main: "#ef4444",
        },
        grey: {
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
        },
    };

    const darkPalette = {
        background: {
            default: "#0f0346ff",
            paper: "#0C0C0C",
        },
        text: {
            primary: "#f1f5f9",
            secondary: "#222",
        },
        primary: {
            main: "#D4599A",
            light: "#E58BB8",
            dark: "#80004D",
        },
        secondary: {
            main: "#D4AF37",
            light: "#E0C670",
            dark: "#A8862B",
        },
        success: {
            main: "#34d399",
        },
        warning: {
            main: "#fbbf24",
        },
        error: {
            main: "#f87171",
        },
        grey: {
            100: "#1e293b",
            200: "#334155",
            300: "#475569",
            400: "#64748b",
        },
    };

    // MUI Theme configuration
    const muiTheme = useMemo(() => {
        const palette = mode === "light" ? lightPalette : darkPalette;
        // Warm gold-tinted surface for the header & sidebar so they read as distinct from the page background
        const surfaceBg = mode === "light" ? "#FBF3E3" : palette.background.paper;

        const themeOptions: ThemeOptions = {
            palette: {
                mode,
                ...palette,
            },
            typography: {
                fontFamily: "Lato",
                h1: {
                    fontFamily: "Lato",
                    fontWeight: 700,
                    color: palette.text.primary,
                },
                h2: {
                    fontFamily: "Lato",
                    fontWeight: 600,
                    color: palette.text.primary,
                },
                h3: {
                    fontFamily: "Lato",
                    fontWeight: 600,
                    color: palette.text.primary,
                },
                h4: {
                    fontFamily: "Lato",
                    color: palette.text.secondary,
                    fontWeight: 600,
                    fontSize: '16px'
                    
                },
                h5: {
                    fontFamily: "Lato",
                    color: palette.text.primary,
                    fontWeight: 600,
                    fontSize: '14px'

                },
                h6: {
                    fontFamily: "Lato",
                    color: palette.text.primary,
                    fontWeight: 600,
                    fontSize: '14px'

                },
                body1: {
                    fontFamily: "Lato",
                    lineHeight: 1.6,
                    color: palette.text.primary,
                    fontWeight: 400,
                    fontSize:'10px'
                },
                body2: {
                    fontFamily: "Lato",
                    lineHeight: 1.5,
                    color: palette.text.primary,
                    fontSize: '12px'
                },
            },
            shape: {
                borderRadius: 12,
            },
            components: {

                MuiCssBaseline: {
                    styleOverrides: {
                        html: {
                            transition: "background-color 0.3s ease, color 0.3s ease",
                        },
                        body: {
                            transition: "background-color 0.3s ease, color 0.3s ease",
                            fontFamily: "'Funnel Display', sans-serif",
                            margin: 0,
                            padding: 0,
                            minHeight: "100vh",
                            backgroundColor: palette.background.default,
                            color: palette.text.primary,
                        },
                    },
                },
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundColor: surfaceBg,
                            color: palette.text.primary,
                            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        },
                    },
                },
                MuiDrawer: {
                    styleOverrides: {
                        paper: {
                            backgroundColor: surfaceBg,
                            borderRight: `1px solid ${palette.grey[200]}`,
                            transition: "width 0.3s ease",
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 8,
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            borderColor: palette.primary.main,
                            color: palette.text.primary,
                            backgroundColor: palette.background.paper,
                            '&:hover': {
                                backgroundColor: palette.primary.light,
                                color: palette.background.paper,
                            },
                        },
                    },
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            margin: "4px 8px",
                            '&:hover': {
                                backgroundColor: palette.primary.light + "20",
                            },
                            '&.Mui-selected': {
                                backgroundColor: palette.primary.main + "20",
                                color: palette.primary.main,
                            },
                        },
                    },
                },
              
            },
            
        };

        return createTheme(themeOptions);
    }, [mode]);

    const isLargeScreen = useMediaQuery(muiTheme.breakpoints.up("md"));

    const contextValue = useMemo(() => ({
        mode,
        toggleTheme,
        isLargeScreen,
        sidebarOpen,
        toggleSidebar,
    }), [mode, isLargeScreen, sidebarOpen]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};