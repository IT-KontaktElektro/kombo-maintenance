import { createTheme, darken, lighten, PaletteOptions, Theme } from "@mui/material/styles";

export const defaultDark: Theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#1b1d29",
            paper: lighten("#1b1d29", 0.1)
        },
        text: {
            primary: "#FFFFFF",
            secondary: "#f0f0f0",
            disabled: "#b8b8b8"
        },
        divider: "#54565e",
        primary: {
            light: lighten("#4171F2", 0.2),
            main: "#4171F2",
            dark: darken("#4171F2", 0.2),
            contrastText: "#fff"
        },
        secondary: {
            light: lighten("#C69749", 0.2),
            main: "#C69749",
            dark: darken("#C69749", 0.2),
            contrastText: "#000"
        }
    } as PaletteOptions & { header: { background: string, text: string } },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: "1px"
                }
            }
        },
        MuiButtonGroup: {
            styleOverrides: {
                grouped: {
                    minWidth: "1px"
                }
            }
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    fontSize: "0.8rem"
                }
            }
        }
    }
});