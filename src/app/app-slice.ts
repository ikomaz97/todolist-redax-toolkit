import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// Типы
export type ThemeMode = "light" | "dark"
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"

export interface AppState {
    themeMode: ThemeMode
    status: RequestStatus
    error: string | null
    isLoggedIn: boolean
}

// Начальное состояние
const initialState: AppState = {
    themeMode: "light",
    status: "idle",
    error: null,
    isLoggedIn: false,
}

// Слайс
export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        changeThemeModeAC: (state, action: PayloadAction<{ themeMode: ThemeMode }>) => {
            state.themeMode = action.payload.themeMode
        },
        setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatus }>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setIsLoggedInAC: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        },
    },
})

// Экшены
export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC, setIsLoggedInAC } =
    appSlice.actions

// Селекторы
export const selectThemeMode = (state: { app: AppState }) => state.app.themeMode
export const selectAppStatus = (state: { app: AppState }) => state.app.status
export const selectAppError = (state: { app: AppState }) => state.app.error
export const selectIsLoggedIn = (state: { app: AppState }) => state.app.isLoggedIn

// Экспорт reducer
export const appReducer = appSlice.reducer
