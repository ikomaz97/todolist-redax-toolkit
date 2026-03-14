// src/app/baseApi.ts
import { AUTH_TOKEN } from "@/common/constants"
import { handleError } from "@/common/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi = createApi({
  reducerPath: "todolistsApi",
  tagTypes: ["Todolist", "Task"],
  keepUnusedDataFor: 5,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      credentials: "include",
      headers: {
        "API-KEY": import.meta.env.VITE_API_KEY,
      },

      prepareHeaders: (headers) => {
        const token = localStorage.getItem(AUTH_TOKEN)

        if (token) {
          headers.set("Authorization", `Bearer ${token}`)
        }

        return headers
      },
    })(args, api, extraOptions)

    handleError(api, result)

    return result
  },

  endpoints: () => ({}),
})