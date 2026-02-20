import { baseApi } from "@/app/baseApi"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"

export const tasksApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getTasks: build.query<GetTasksResponse, string>({
            query: (todolistId) => `todo-lists/${todolistId}/tasks`,
            providesTags: (result, _, todolistId) =>
                result
                    ? [
                        ...result.items.map((task) => ({ type: "Task" as const, id: task.id })),
                        { type: "Task" as const, id: `LIST-${todolistId}` },
                    ]
                    : [{ type: "Task" as const, id: `LIST-${todolistId}` }],
        }),

        createTask: build.mutation<{ item: DomainTask }, { todolistId: string; title: string }>({
            query: ({ todolistId, title }) => ({
                url: `todo-lists/${todolistId}/tasks`,
                method: "POST",
                body: { title },
            }),
            invalidatesTags: (_result, _, { todolistId }) => [{ type: "Task" as const, id: `LIST-${todolistId}` }],
        }),

        updateTask: build.mutation<{ item: DomainTask }, { todolistId: string; taskId: string; model: UpdateTaskModel }>({
            query: ({ todolistId, taskId, model }) => ({
                url: `todo-lists/${todolistId}/tasks/${taskId}`,
                method: "PUT",
                body: model,
            }),
            invalidatesTags: (_result, _, { taskId }) => [{ type: "Task" as const, id: taskId }],
        }),

        deleteTask: build.mutation<{ item: DomainTask }, { todolistId: string; taskId: string }>({
            query: ({ todolistId, taskId }) => ({
                url: `todo-lists/${todolistId}/tasks/${taskId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _, { taskId, todolistId }) => [
                { type: "Task" as const, id: taskId },
                { type: "Task" as const, id: `LIST-${todolistId}` },
            ],
        }),
    }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
