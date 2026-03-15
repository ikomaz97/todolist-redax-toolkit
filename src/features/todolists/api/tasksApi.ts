// features/todolists/api/tasksApi.ts
import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { PAGE_SIZE } from "@/common/constants"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Получение задач с пагинацией
    getTasks: build.query<GetTasksResponse, { todolistId: string; params: { count: number; page: number } }>({
      query: ({ todolistId, params }) => {
        console.log('Fetching tasks:', { todolistId, params })
        return {
          url: `todo-lists/${todolistId}/tasks`,
          params: { ...params, count: PAGE_SIZE },
        }
      },

      // Сортируем задачи по полю order перед возвратом
      transformResponse: (response: GetTasksResponse) => {
        return {
          ...response,
          items: [...response.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        }
      },

      providesTags: (result, _err, { todolistId }) => {
        const tags = [{ type: "Task" as const, id: todolistId }]

        if (result) {
          // Добавляем теги для каждой отдельной задачи
          const taskTags = result.items.map(({ id }) => ({
            type: "Task" as const,
            id
          }))
          return [...tags, ...taskTags]
        }

        return tags
      },
    }),

    // Создание новой задачи
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

    // Удаление задачи
    removeTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_res, _err, { todolistId }) => [
        { type: "Task", id: todolistId }
      ],
    }),

    // Обновление задачи (статус, заголовок и т.д.)
    updateTask: build.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `todo-lists/${todolistId}/tasks/${taskId}`,
        method: 'PUT',
        body: model,
      }),

      // Оптимистичное обновление
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        // Получаем все кэшированные запросы для этого тудулиста
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(
          getState(),
          'getTasks'
        ) as { todolistId: string; params: { count: number; page: number } }[]

        // Обновляем кэш для всех страниц этого тудулиста
        const patchResults = cachedArgsForQuery
          .filter(args => args.todolistId === todolistId)
          .map(args =>
            dispatch(
              tasksApi.util.updateQueryData('getTasks', args, draft => {
                const index = draft.items.findIndex(task => task.id === taskId)
                if (index !== -1) {
                  draft.items[index] = { ...draft.items[index], ...model }
                  // После обновления сортируем
                  draft.items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                }
              })
            )
          )

        try {
          await queryFulfilled
        } catch {
          // Откатываем изменения при ошибке
          patchResults.forEach(patchResult => patchResult.undo())
        }
      },

      invalidatesTags: (_res, _err, { taskId }) => [
        { type: "Task", id: taskId }
      ],
    }),

    // Переупорядочивание задач (drag and drop)
    reorderTask: build.mutation<
      BaseResponse,
      { todolistId: string; taskId: string; putAfterItemId: string | null }
    >({
      query: ({ todolistId, taskId, putAfterItemId }) => {
        console.log('API Request - reorderTask:', { todolistId, taskId, putAfterItemId })
        return {
          url: `todo-lists/${todolistId}/tasks/${taskId}/reorder`,
          method: "PUT",
          body: { putAfterItemId },
        }
      },

      // Оптимистичное обновление для мгновенного UI отклика
      async onQueryStarted({ todolistId, taskId, putAfterItemId }, { dispatch, queryFulfilled, getState }) {
        // Получаем текущие данные для оптимистичного обновления
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(
          getState(),
          'getTasks'
        ) as { todolistId: string; params: { count: number; page: number } }[]

        // Находим аргументы для текущей страницы
        const currentPageArgs = cachedArgsForQuery.find(
          args => args.todolistId === todolistId
        )

        if (!currentPageArgs) return

        // Сохраняем результат для возможного отката
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', currentPageArgs, draft => {
            // Находим индекс перемещаемой задачи
            const activeIndex = draft.items.findIndex(t => t.id === taskId)
            if (activeIndex === -1) return

            // Создаем копию массива
            const newItems = [...draft.items]

            // Удаляем задачу с текущей позиции
            const [movedTask] = newItems.splice(activeIndex, 1)

            // Находим новую позицию для вставки
            let insertIndex = -1

            if (putAfterItemId === null) {
              // Вставляем в начало
              insertIndex = 0
            } else {
              // Ищем задачу, после которой нужно вставить
              const afterIndex = newItems.findIndex(t => t.id === putAfterItemId)
              if (afterIndex !== -1) {
                insertIndex = afterIndex + 1
              } else {
                // Если не нашли, вставляем в конец
                insertIndex = newItems.length
              }
            }

            // Вставляем задачу на новую позицию
            newItems.splice(insertIndex, 0, movedTask)

            // Обновляем поле order у всех задач
            newItems.forEach((task, index) => {
              task.order = index
            })

            // Обновляем состояние
            draft.items = newItems
          })
        )

        try {
          const result = await queryFulfilled
          console.log('Reorder successful:', result)
        } catch (error) {
          console.error('Reorder failed:', error)
          // Откатываем изменения при ошибке
          patchResult.undo()
        }
      },

      // Инвалидируем кэш после успешного запроса
      invalidatesTags: (_res, _err, { todolistId }) => [
        { type: "Task", id: todolistId },
        { type: "Task", id: "LIST" }
      ],
    }),
  }),
})

// Экспортируем все хуки
export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useRemoveTaskMutation,
  useUpdateTaskMutation,
  useReorderTaskMutation,
} = tasksApi