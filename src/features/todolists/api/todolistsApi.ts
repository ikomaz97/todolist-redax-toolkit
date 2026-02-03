// Во избежание ошибок импорт должен быть из `@reduxjs/toolkit/query/react`
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTH_TOKEN } from '@/common/constants'
import { BaseResponse } from '@/common/types'

/* ===================== TYPES ===================== */

// То, что приходит с сервера
export type Todolist = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type FilterValues = 'all' | 'active' | 'completed'
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

// То, что используется на клиенте
export type DomainTodolist = Todolist & {
    filter: FilterValues
    entityStatus: RequestStatus
}

/* ===================== API ===================== */

export const todolistsApi = createApi({
    reducerPath: 'todolistsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        headers: {
            'API-KEY': import.meta.env.VITE_API_KEY,
        },
        prepareHeaders: headers => {
            const token = localStorage.getItem(AUTH_TOKEN)
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: build => ({
        // ---------- GET ----------
        getTodolists: build.query<DomainTodolist[], void>({
            query: () => 'todo-lists',
            transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
                todolists.map(todolist => ({
                    ...todolist,
                    filter: 'all',
                    entityStatus: 'idle',
                })),
        }),

        removeTodolist: build.mutation<BaseResponse, string>({
            query: (id) => ({
                url: `todo-lists/${id}`,
                method: "DELETE",
            }),
        }),

        // ---------- POST ----------
        addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
            query: title => ({
                url: 'todo-lists',
                method: 'POST',
                body: { title },
            }),
        }),
        updateTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
            query: ({ id, title }) => ({
                url: `todo-lists/${id}`,
                method: "PUT",
                body: { title },
            }),
        }),
    }),
})

export const {
    useGetTodolistsQuery,
    useAddTodolistMutation,
    useRemoveTodolistMutation,
    useUpdateTodolistTitleMutation,
} = todolistsApi