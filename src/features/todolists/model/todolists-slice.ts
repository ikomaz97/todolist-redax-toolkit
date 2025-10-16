import { createSlice, nanoid } from "@reduxjs/toolkit"

export type FilterValues = "all" | "active" | "completed"

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as Todolist[],
  reducers: (create) => ({
    // 🗑️ Удаление тудулиста
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),

    // ✏️ Изменение заголовка тудулиста
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),

    // 🔄 Изменение фильтра (all, active, completed)
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),

    // ➕ Создание нового тудулиста
    createTodolistAC: create.preparedReducer(
      (title: string) => ({ payload: { title, id: nanoid() } }),
      (state, action) => {
        state.push({ ...action.payload, filter: "all" })
      },
    ),
  }),
})

export const { deleteTodolistAC, createTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC } =
  todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer
