import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types"
import { createAppSlice } from "@/common/utils"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    // 🔹 1. fetchTodolistsTC
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkAPI) => {
        try {
          const res = await todolistsApi.getTodolists()
          return { todolists: res.data }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          action.payload?.todolists.forEach((tl) => {
            state.push({ ...tl, filter: "all" })
          })
        },
      },
    ),

    // 🔹 2. createTodolistTC
    createTodolistTC: create.asyncThunk(
      async (title: string, thunkAPI) => {
        try {
          const res = await todolistsApi.createTodolist(title)
          return { todolist: res.data.data.item }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state.unshift({ ...action.payload.todolist, filter: "all" })
        },
      },
    ),

    // 🔹 3. deleteTodolistTC
    deleteTodolistTC: create.asyncThunk(
      async (id: string, thunkAPI) => {
        try {
          await todolistsApi.deleteTodolist(id)
          return { id }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) state.splice(index, 1)
        },
      },
    ),

    // 🔹 4. changeTodolistTitleTC
    changeTodolistTitleTC: create.asyncThunk(
      async (payload: { id: string; title: string }, thunkAPI) => {
        try {
          await todolistsApi.changeTodolistTitle(payload)
          return payload
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),

    // 🔹 5. обычный reducer (filter)
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((tl) => tl.id === action.payload.id)
      if (todolist) todolist.filter = action.payload.filter
    }),
  }),
})

export const { fetchTodolistsTC, createTodolistTC, deleteTodolistTC, changeTodolistTitleTC, changeTodolistFilterAC } =
  todolistsSlice.actions

export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
