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
            status: response.status,
          }
        }
        return response
      },

      // Сортируем задачи по полю order
      transformResponse: (response: GetTasksResponse) => {
        return {
          ...response,
          items: [...response.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        }
      },

      providesTags: (result, _err, { todolistId }) => {
        const tags = [{ type: "Task" as const, id: todolistId }]

        if (result) {
          const taskTags = result.items.map(({ id }) => ({
            type: "Task" as const,
            id,
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
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),

    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),

      async onQueryStarted({ todolistId, taskId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", { todolistId, params: { page: 1, count: PAGE_SIZE } }, (draft) => {
            const index = draft.items.findIndex((t) => t.id === taskId)
            if (index !== -1) {
              draft.items.splice(index, 1)
            }
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },

      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),

    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),

      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", { todolistId, params: { page: 1, count: PAGE_SIZE } }, (draft) => {
            const task = draft.items.find((t) => t.id === taskId)
            if (task) {
              Object.assign(task, model)
            }
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },

      invalidatesTags: (_res, _err, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    reorderTask: build.mutation<BaseResponse, { todolistId: string; taskId: string; putAfterItemId: string | null }>({
      query: ({ todolistId, taskId, putAfterItemId }) => {
        return {
          url: `todo-lists/${todolistId}/tasks/${taskId}/reorder`,
          method: "PUT",
          body: { putAfterItemId },
        }
      },

      // Оптимистичное обновление - убрали неиспользуемый getState
      async onQueryStarted(
        { todolistId, taskId, putAfterItemId },
        { dispatch, queryFulfilled }, // Убрали getState
      ) {
        // Явно указываем тип для patchResult
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", { todolistId, params: { page: 1, count: PAGE_SIZE } }, (draft) => {
            // Находим индекс перемещаемой задачи
            const activeIndex = draft.items.findIndex((t) => t.id === taskId)
            if (activeIndex === -1) return

            // Удаляем задачу из текущей позиции
            const [movedTask] = draft.items.splice(activeIndex, 1)

            // Находим новую позицию
            if (putAfterItemId === null) {
              // Вставляем в начало
              draft.items.unshift(movedTask)
            } else {
              // Находим индекс элемента, после которого нужно вставить
              const targetIndex = draft.items.findIndex((t) => t.id === putAfterItemId)
              if (targetIndex !== -1) {
                // Вставляем после targetIndex
                draft.items.splice(targetIndex + 1, 0, movedTask)
              } else {
                // Если целевой элемент не найден, возвращаем на место
                draft.items.splice(activeIndex, 0, movedTask)
              }
            }
          }),
        )

        try {
          await queryFulfilled
        } catch (error) {
          console.error("Reorder task failed, rolling back", error)
          // Откатываем изменения при ошибке
          patchResult.undo()
        }
      },

      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
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
