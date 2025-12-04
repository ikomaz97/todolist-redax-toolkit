import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "./store"
import type { RequestStatus } from "@/common/types"

export type ThemeMode = "dark" | "light"

const initialState = {
  themeMode: "light" as ThemeMode,
  status: "idle" as RequestStatus,
  error: null as string | null,
}

export type AppState = typeof initialState

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    changeThemeModeAC(state, action: PayloadAction<{ themeMode: ThemeMode }>) {
      state.themeMode = action.payload.themeMode
    },
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatus }>) {
      state.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
  },
})

export const appReducer = appSlice.reducer
export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC } = appSlice.actions

// Селекторы должны принимать RootState (корневой state), а не AppState
export const selectThemeMode = (state: RootState) => state.app.themeMode
export const selectAppStatus = (state: RootState) => state.app.status
export const selectAppError = (state: RootState) => state.app.error
