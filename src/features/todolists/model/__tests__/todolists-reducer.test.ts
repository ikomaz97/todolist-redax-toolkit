import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"

type TodolistState = Todolist & { filter: "all" | "active" | "completed" }

const initialState: TodolistState[] = []

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    createTodolistAC(state, action: PayloadAction<{ todolist: Todolist }>) {
      const newTodolist: TodolistState = { ...action.payload.todolist, filter: "all" }
      state.unshift(newTodolist)
    },
    deleteTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex((t) => t.id === action.payload.id)
      if (index > -1) state.splice(index, 1)
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string; title: string }>) {
      const todo = state.find((t) => t.id === action.payload.id)
      if (todo) todo.title = action.payload.title
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: "all" | "active" | "completed" }>) {
      const todo = state.find((t) => t.id === action.payload.id)
      if (todo) todo.filter = action.payload.filter
    },
  },
})

// Если у вас есть thunks, экспортируйте их отдельно, например:
// export const changeTodolistTitleTC = (id: string, title: string) => async (dispatch: AppDispatch) => { ... }

export const { createTodolistAC, deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC } =
  todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer
