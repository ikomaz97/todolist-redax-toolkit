// @/app/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_TOKEN } from "@/common/constants";

export const baseApi = createApi({
    reducerPath: 'baseApi', // ✅ Измените на 'baseApi' (а не 'todolistsApi')
    tagTypes: ['Todolists', 'Tasks', 'Auth'], // ✅ Добавьте все теги
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL || 'https://social-network.samuraijs.com/api/1.1/',
        credentials: 'include', // ✅ Добавьте это для работы с cookies
        prepareHeaders: (headers) => {
            // Добавляем API-KEY в заголовки
            if (import.meta.env.VITE_API_KEY) {
                headers.set('API-KEY', import.meta.env.VITE_API_KEY);
            }

            // Добавляем токен авторизации если он есть
            const token = localStorage.getItem(AUTH_TOKEN);
            console.log('Token from localStorage:', token); // для отладки

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers; // ✅ ВАЖНО: не забыть вернуть headers
        },
    }),
    endpoints: () => ({}),
});