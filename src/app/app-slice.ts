import { createSlice } from "@reduxjs/toolkit"

export type ThemeMode = "light" | "dark"

export type AppState = {
  themeMode: ThemeMode
}

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
  },
  reducers: (create) => ({
    // 🌗 Переключение темы (light/dark)
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
  }),
})

// Экспорт action creator
export const { changeThemeModeAC } = appSlice.actions

// Экспорт reducer
export const appReducer = appSlice.reducer
