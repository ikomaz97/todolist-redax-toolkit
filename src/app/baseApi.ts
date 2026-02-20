// @/app/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants"

export const baseApi = createApi({
    reducerPath: "baseApi",

    // ✅ правильные теги
    tagTypes: ["Todolist", "Task", "Auth"],

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        credentials: "include",

        prepareHeaders: (headers) => {
            headers.set("API-KEY", import.meta.env.VITE_API_KEY)

            const token = localStorage.getItem(AUTH_TOKEN)

            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }

            return headers
        },
    }),

    endpoints: () => ({}),
})
