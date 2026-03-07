import type { RequestStatus } from "@/common/types"
import { createSlice, type AnyAction } from "@reduxjs/toolkit"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import { tasksApi } from "@/features/todolists/api/tasksApi"

// Тип для экшенов с ошибками от RTK Query
interface RejectedAction extends AnyAction {
    payload?: {
        data?: {
            message?: string
        }
    }
    error?: {
        message?: string
    }
}

export const appSlice = createSlice({
    name: "app",
    initialState: {
        themeMode: "light" as ThemeMode,
        status: "idle" as RequestStatus,
        error: null as string | null,
        isLoggedIn: false,
    },
    selectors: {
        selectThemeMode: (state) => state.themeMode,
        selectAppStatus: (state) => state.status,
        selectAppError: (state) => state.error,
        selectIsLoggedIn: (state) => state.isLoggedIn,
    },
    reducers: (create) => ({
        changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
            state.themeMode = action.payload.themeMode
        }),
        setAppStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
            state.status = action.payload.status
        }),
        setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
            state.error = action.payload.error
        }),
        setIsLoggedInAC: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }),
    }),
    extraReducers: (builder) => {
        builder
            // Обработка pending экшенов
            .addMatcher(
                (action): action is AnyAction => action.type.endsWith('/pending'),
                (state, action) => {
                    // Проверяем, от какого API пришел экшен
                    if (
                        todolistsApi.endpoints.getTodolists.matchPending(action) ||
                        tasksApi.endpoints.getTasks.matchPending(action)
                    ) {
                        // Если это запрос тудулистов или задач - не показываем глобальный лоадер,
                        // так как для них есть скелетоны
                        return
                    }
                    // Для всех остальных запросов показываем глобальный лоадер
                    state.status = 'loading'
                }
            )
            // Обработка fulfilled экшенов
            .addMatcher(
                (action): action is AnyAction => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.status = 'succeeded'
                }
            )
            // Обработка rejected экшенов
            .addMatcher(
                (action): action is RejectedAction => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed'
                    // Сохраняем ошибку
                    if (action.payload) {
                        state.error = action.payload.data?.message || 'Some error occurred'
                    } else {
                        state.error = action.error?.message || 'Some error occurred'
                    }
                }
            )
    },
})

export const {
    selectThemeMode,
    selectAppStatus,
    selectAppError,
    selectIsLoggedIn
} = appSlice.selectors

export const {
    changeThemeModeAC,
    setAppStatusAC,
    setAppErrorAC,
    setIsLoggedInAC
} = appSlice.actions

export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"