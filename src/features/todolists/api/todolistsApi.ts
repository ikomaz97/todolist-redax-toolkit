// features/todolists/api/todolistsApi.ts
import { baseApi } from "@/app/baseApi"
import type { BaseResponse } from "@/common/types"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import type { Todolist } from "./todolistsApi.types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
      providesTags: ["Todolist"],
    }),

    addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({
        url: "todo-lists",
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),

    removeTodolist: build.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `todo-lists/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id: string, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
            const index = state.findIndex((todolist) => todolist.id === id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ["Todolist"],
    }),

    updateTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `todo-lists/${id}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),

    // НОВОЕ: Добавляем мутацию для переупорядочивания тудулистов
    reorderTodolist: build.mutation<BaseResponse, { todolistId: string; putAfterItemId: string | null }>({
      query: ({ todolistId, putAfterItemId }) => ({
        url: `todo-lists/${todolistId}/reorder`,
        method: "PUT",
        body: { putAfterItemId },
      }),
      // Оптимистичное обновление (опционально)
      async onQueryStarted({ todolistId, putAfterItemId }, { dispatch, queryFulfilled, getState }) {
        // Сохраняем текущее состояние для возможного отката
        const state = getState()
        const todolists = (todolistsApi.endpoints.getTodolists.select()(state) as any).data

        if (!todolists) return

        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (draft) => {
            // Находим индекс перемещаемого тудулиста
            const activeIndex = draft.findIndex((t) => t.id === todolistId)
            if (activeIndex === -1) return

            // Удаляем элемент из текущей позиции
            const [movedTodolist] = draft.splice(activeIndex, 1)

            // Находим новую позицию
            if (putAfterItemId === null) {
              // Вставляем в начало
              draft.unshift(movedTodolist)
            } else {
              // Находим индекс элемента, после которого нужно вставить
              const targetIndex = draft.findIndex((t) => t.id === putAfterItemId)
              if (targetIndex !== -1) {
                // Вставляем после targetIndex
                draft.splice(targetIndex + 1, 0, movedTodolist)
              } else {
                // Если целевой элемент не найден, возвращаем на место
                draft.splice(activeIndex, 0, movedTodolist)
              }
            }
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useRemoveTodolistMutation,
  useUpdateTodolistTitleMutation,
  useReorderTodolistMutation, // Экспортируем новый хук
} = todolistsApi
