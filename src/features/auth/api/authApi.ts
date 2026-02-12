import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi.ts"

// ✅ Тип для данных логина
export type LoginArgs = {
    email: string
    password: string
    rememberMe?: boolean
}

export const authApi = baseApi.injectEndpoints({
    endpoints: build => ({
        // Проверка авторизации "Кто я?"
        me: build.query<BaseResponse<{ id: number; email: string; login: string }>, void>({
            query: () => "auth/me",
        }),

        // Логин
        login: build.mutation<BaseResponse<{ userId: number; token: string }>, LoginArgs>({
            query: body => ({
                url: "auth/login",
                method: "POST",
                body,
            }),
        }),

        // Логаут
        logout: build.mutation<BaseResponse, void>({
            query: () => ({
                url: "auth/logout",
                method: "DELETE",
            }),
        }),
    }),
})

// ✅ Хуки для компонентов
export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi
