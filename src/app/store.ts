import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"

import { appReducer } from "@/app/app-slice"
import { todolistsReducer, todolistsSlice } from "@/features/todolists/model/todolists-slice"
import { baseApi } from "@/app/baseApi.ts"

export const store = configureStore({
    reducer: {
        app: appReducer,                  // ✅ app slice
        [todolistsSlice.name]: todolistsReducer,
        [baseApi.reducerPath]: baseApi.reducer, // ✅ RTK Query
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

// подключаем RTK Query слушатели
setupListeners(store.dispatch)

// Типы для useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// для консоли браузера
// @ts-ignore
window.store = store
