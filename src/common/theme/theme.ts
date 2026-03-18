import type { ThemeMode } from "@/app/app-slice.ts"
import { createTheme } from "@mui/material/styles"

export const getTheme = (themeMode: ThemeMode) => {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#0288D1", // Глубокий синий
        light: "#4EB5E5",
        dark: "#01579B",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#26A69A", // Бирюзовый
        light: "#64D8CB",
        dark: "#00766C",
        contrastText: "#FFFFFF",
      },
      background: {
        default: themeMode === "light" ? "#E1F5FE" : "#0A2A3A",
        paper: themeMode === "light" ? "#FFFFFF" : "#12455F",
      },
      text: {
        primary: themeMode === "light" ? "#01579B" : "#B3E5FC",
        secondary: themeMode === "light" ? "#00766C" : "#80CBC4",
      },
    },
    typography: {
      fontFamily: '"Raleway", "Roboto", sans-serif',
      h4: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
          contained: {
            background: "linear-gradient(135deg, #0288D1 0%, #26A69A 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #01579B 0%, #00766C 100%)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#0288D1",
              },
            },
          },
        },
      },
    },
  })
}