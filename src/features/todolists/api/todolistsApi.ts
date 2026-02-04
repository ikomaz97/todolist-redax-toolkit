// src/features/todolists/api/todolistsApi.ts

import { baseApi } from '@/app/baseApi'
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

export const todolistsApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getTodolists: build.query<DomainTodolist[], void>({
            query: () => 'todo-lists',

            transformResponse: (todolists: Todolist[]) =>
                todolists.map(tl => ({
                    ...tl,
                    filter: 'all',
                    entityStatus: 'idle',
                })),

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

        addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
            query: title => ({
                url: 'todo-lists',
                method: 'POST',
                body: { title },
            }),

            invalidatesTags: [{ type: 'Todolist', id: 'LIST' }],
        }),

        removeTodolist: build.mutation<BaseResponse, string>({
            query: id => ({
                url: `todo-lists/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_, __, id) => [
                { type: 'Todolist', id },
                { type: 'Todolist', id: 'LIST' },
            ],
        }),

        updateTodolistTitle: build.mutation<
            BaseResponse,
            { id: string; title: string }
        >({
            query: ({ id, title }) => ({
                url: `todo-lists/${id}`,
                method: 'PUT',
                body: { title },
            }),

            invalidatesTags: (_, __, { id }) => [{ type: 'Todolist', id }],
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
