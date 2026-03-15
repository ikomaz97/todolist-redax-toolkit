// app/App.tsx
import "./App.css"
import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { ErrorSnackbar, Header } from "@/common/components"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { Routing } from "@/common/routing"
import { getTheme } from "@/common/theme"
import { useMeQuery } from "@/features/auth/api/authApi"
import { tasksApi } from "@/features/todolists/api/tasksApi"
import CircularProgress from "@mui/material/CircularProgress"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { useEffect, useState } from "react"
import styles from "./App.module.css"
import { useDispatch } from "react-redux"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const [isInitialized, setIsInitialized] = useState(false)

  const { data, isLoading } = useMeQuery()

  const dispatch = useAppDispatch()
  const reduxDispatch = useDispatch()

  const theme = getTheme(themeMode)

  // Очищаем кэш RTK Query при монтировании приложения
  useEffect(() => {
    // Сбрасываем состояние API (очищает все кэшированные запросы)
    reduxDispatch(tasksApi.util.resetApiState())
    console.log('RTK Query cache reset')
  }, [reduxDispatch])

  useEffect(() => {
    if (isLoading) return
    if (data?.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedInAC({ isLoggedIn: true }))
    }
    setIsInitialized(true)
  }, [data, isLoading, dispatch])

  if (!isInitialized) {
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