import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { PAGE_SIZE } from "@/common/constants"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { count: number; page: number } }>({
      query: ({ todolistId, params }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        params: { ...params, count: PAGE_SIZE },
      }),
      providesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),

    addTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),

    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),

    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: 'PUT',
        body: model,
      }),

      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        // Получаем все кэшированные аргументы для запроса getTasks
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(
          getState(),
          'getTasks'
        ) as { todolistId: string; params: { count: number; page: number } }[]

        // Применяем оптимистичное обновление ко всем страницам этого тудулиста
        const patchResults = cachedArgsForQuery
          .filter(args => args.todolistId === todolistId)
          .map(args =>
            dispatch(
              tasksApi.util.updateQueryData('getTasks', args, state => {
                const index = state.items.findIndex(task => task.id === taskId)
                if (index !== -1) {
                  state.items[index] = { ...state.items[index], ...model }
                }
              })
            )
          )

        try {
          await queryFulfilled
        } catch {
          // В случае ошибки откатываем все изменения
          patchResults.forEach(patchResult => patchResult.undo())
        }
      },

      invalidatesTags: (_res, _err, { todolistId }) => [{ type: 'Task', id: todolistId }],
    }),
  }),
})

export const { useGetTasksQuery, useAddTaskMutation, useRemoveTaskMutation, useUpdateTaskMutation } = tasksApi

