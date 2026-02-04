import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AUTH_TOKEN } from '@/common/constants'
import { BaseResponse } from '@/common/types'

/* ===================== TYPES ===================== */

export type Todolist = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type FilterValues = 'all' | 'active' | 'completed'
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type DomainTodolist = Todolist & {
    filter: FilterValues
    entityStatus: RequestStatus
}

/* ===================== API ===================== */

export const todolistsApi = createApi({
    reducerPath: 'todolistsApi',

    tagTypes: ['Todolist'],

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        prepareHeaders: headers => {
            headers.set('API-KEY', import.meta.env.VITE_API_KEY)

            const token = localStorage.getItem(AUTH_TOKEN)
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),

    endpoints: build => ({
        /* ========== GET TODOLISTS ========== */
        getTodolists: build.query<DomainTodolist[], void>({
            query: () => 'todo-lists',

            transformResponse: (todolists: Todolist[]) =>
                todolists.map(tl => ({
                    ...tl,
                    filter: 'all',
                    entityStatus: 'idle',
                })),

            // ✅ Теги: список + каждый todolist по id
            providesTags: result =>
                result
                    ? [
                        ...result.map(({ id }) => ({
                            type: 'Todolist' as const,
                            id,
                        })),
                        { type: 'Todolist', id: 'LIST' },
                    ]
                    : [{ type: 'Todolist', id: 'LIST' }],
        }),

        /* ========== DELETE ========== */
        removeTodolist: build.mutation<BaseResponse, string>({
            query: id => ({
                url: `todo-lists/${id}`,
                method: 'DELETE',
            }),

            // ✅ инвалидируем только удалённый
            invalidatesTags: (_, __, id) => [
                { type: 'Todolist', id },
                { type: 'Todolist', id: 'LIST' },
            ],
        }),

        /* ========== ADD ========== */
        addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
            query: title => ({
                url: 'todo-lists',
                method: 'POST',
                body: { title },
            }),

            // ✅ после добавления обновляем только LIST
            invalidatesTags: [{ type: 'Todolist', id: 'LIST' }],
        }),

        /* ========== UPDATE TITLE ========== */
        updateTodolistTitle: build.mutation<
            BaseResponse,
            { id: string; title: string }
        >({
            query: ({ id, title }) => ({
                url: `todo-lists/${id}`,
                method: 'PUT',
                body: { title },
            }),

            // ✅ обновляем только конкретный todolist
            invalidatesTags: (_, __, { id }) => [
                { type: 'Todolist', id },
            ],
        }),
    }),
})

/* ===================== HOOKS ===================== */

export const {
    useGetTodolistsQuery,
    useAddTodolistMutation,
    useRemoveTodolistMutation,
    useUpdateTodolistTitleMutation,
} = todolistsApi