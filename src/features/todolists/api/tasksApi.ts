// features/todolists/api/tasksApi.ts
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

      transformResponse: (response: GetTasksResponse) => ({
        ...response,
        items: [...response.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      }),

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

    addTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; title: string; currentPage?: number }
    >({
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),

      async onQueryStarted({ todolistId, title, currentPage = 1 }, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`
        const tempTask: DomainTask = {
          id: tempId,
          title,
          description: null,
          status: 0,
          priority: 0,
          startDate: null,
          deadline: null,
          todoListId: todolistId,
          order: 0,
          addedDate: new Date().toISOString(),
        }

        // Оптимистичное обновление для указанной страницы
        const patchResult = dispatch(
          tasksApi.util.updateQueryData(
            "getTasks",
            { todolistId, params: { page: currentPage, count: PAGE_SIZE } },
            (draft) => {
              draft.items.unshift(tempTask)
              draft.totalCount += 1
            },
          ),
        )

        try {
          const { data } = await queryFulfilled
          if (data.data?.item) {
            dispatch(
              tasksApi.util.updateQueryData(
                "getTasks",
                { todolistId, params: { page: currentPage, count: PAGE_SIZE } },
                (draft) => {
                  const index = draft.items.findIndex((t) => t.id === tempId)
                  if (index !== -1) {
                    draft.items[index] = data.data!.item
                  }
                },
              ),
            )
          }
        } catch (error) {
          console.error("Add task failed, rolling back", error)
          patchResult.undo()
        }
      },

      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
    }),

    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          console.error("Remove task failed", error)
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
        } catch (error) {
          console.error("Update task failed, rolling back", error)
          patchResult.undo()
        }
      },

      invalidatesTags: (_res, _err, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    reorderTask: build.mutation<BaseResponse, { todolistId: string; taskId: string; putAfterItemId: string | null }>({
      query: ({ todolistId, taskId, putAfterItemId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}/reorder`,
        method: "PUT",
        body: { putAfterItemId },
      }),

      async onQueryStarted({ todolistId, taskId, putAfterItemId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", { todolistId, params: { page: 1, count: PAGE_SIZE } }, (draft) => {
            const activeIndex = draft.items.findIndex((t) => t.id === taskId)
            if (activeIndex === -1) return

            const [movedTask] = draft.items.splice(activeIndex, 1)

            if (putAfterItemId === null) {
              draft.items.unshift(movedTask)
            } else {
              const targetIndex = draft.items.findIndex((t) => t.id === putAfterItemId)
              if (targetIndex !== -1) {
                draft.items.splice(targetIndex + 1, 0, movedTask)
              } else {
                draft.items.splice(activeIndex, 0, movedTask)
              }
            }
          }),
        )

        try {
          await queryFulfilled
        } catch (error) {
          console.error("Reorder task failed, rolling back", error)
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
