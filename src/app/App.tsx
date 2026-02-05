import "./App.css"

import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { CircularProgress } from "@mui/material"

import styles from "./App.module.css"

import { selectThemeMode } from "@/app/app-slice"
import { useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"

import { Header, ErrorSnackbar } from "@/common/components"
import { Routing } from "@/common/routing"

import { useMeQuery } from "@/features/auth/api/authApi.ts"

export const App = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const theme = getTheme(themeMode)

    // ✅ просто проверяем авторизацию
    const { isLoading } = useMeQuery()

    // ✅ пока идет запрос — показываем loader
    if (isLoading) {
        return (
            <div className={styles.circularProgressContainer}>
                <CircularProgress size={150} thickness={3} />
            </div>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.app}>
                <CssBaseline />
                <Header />
                <Routing />
                <ErrorSnackbar />
            </div>
        </ThemeProvider>
    )
}
