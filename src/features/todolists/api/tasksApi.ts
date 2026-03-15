// features/todolists/api/tasksApi.ts
import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { PAGE_SIZE } from "@/common/constants"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { count: number; page: number } }>({
      query: ({ todolistId, params }) => {
        return {
          url: `todo-lists/${todolistId}/tasks`,
          params: { ...params, count: PAGE_SIZE },
        }
      },

      // Обрабатываем ошибки
      transformErrorResponse: (response) => {
        if (response.status === 500) {
          console.warn(`Server error for todolist, but we'll ignore it`)
          return {
            error: "Todolist might not exist",
            status: response.status
          }
        }
        return response
      },

      // Сортируем задачи по полю order
      transformResponse: (response: GetTasksResponse) => {
        return {
          ...response,
          items: [...response.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        }
      },

      providesTags: (result, _err, { todolistId }) => {
        const tags = [{ type: "Task" as const, id: todolistId }]

        if (result) {
          const taskTags = result.items.map(({ id }) => ({
            type: "Task" as const,
            id
          }))
          return [...tags, ...taskTags]
        }

        return tags
      },
    }),

    addTask: build.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_res, _err, { todolistId }) => [
        { type: "Task", id: todolistId }
      ],
    }),

    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { todolistId }) => [
        { type: "Task", id: todolistId }
      ],
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
      invalidatesTags: (_res, _err, { taskId }) => [
        { type: "Task", id: taskId }
      ],
    }),

    reorderTask: build.mutation<
      BaseResponse,
      { todolistId: string; taskId: string; putAfterItemId: string | null }
    >({
      query: ({ todolistId, taskId, putAfterItemId }) => {
        return {
          url: `todo-lists/${todolistId}/tasks/${taskId}/reorder`,
          method: "PUT",
          body: { putAfterItemId },
        }
      },
      invalidatesTags: (_res, _err, { todolistId }) => [
        { type: "Task", id: todolistId }
      ],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useRemoveTaskMutation,
  useUpdateTaskMutation,
  useReorderTaskMutation,
} = tasksApi