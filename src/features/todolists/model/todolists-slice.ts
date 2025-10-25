// Импортируем всё нужное
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import type { Todolist as ApiTodolist } from "@/features/todolists/api/todolistsApi.types"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

// 🔹 Тип фильтра
export type FilterValues = "all" | "active" | "completed"

// 🔹 Создаём тип для DomainTodolist (объединяем данные сервера + локальное поле filter)
export type DomainTodolist = ApiTodolist & {
  filter: FilterValues
}

// ✅ Теперь всё готово к созданию слайса
export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    // 🧩 setTodolistsAC — кладём тудулисты с сервера в state и добавляем каждому filter
    setTodolistsAC: create.reducer<{ todolists: ApiTodolist[] }>((_, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
      }))
    }),

    // 🗑️ deleteTodolistAC — удаляем тудулист по id
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),

    // ✏️ changeTodolistTitleAC — меняем заголовок тудулиста
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),

    // ⚙️ changeTodolistFilterAC — меняем фильтр тудулиста
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((tl) => tl.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),

    // ➕ createTodolistAC — добавляем новый тудулист
    // 🔥 Используем preparedReducer, чтобы задать payload вручную
    createTodolistAC: create.preparedReducer(
      (title: string) => ({ payload: { title, id: nanoid() } }),
      (state, action) => {
        state.push({
          ...action.payload,
          filter: "all",
          addedDate: "",
          order: 0,
        })
      },
    ),
  }),
})

export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, (_, thunkAPI) => {
  // в санке можно делать побочные эффекты (запросы на сервер)
  todolistsApi.getTodolists().then((res) => {
    // и диспатчить экшены (action) или другие санки (thunk)
    thunkAPI.dispatch(setTodolistsAC({ todolists: res.data }))
  })
})

// 🚀 Экспортируем action creators
export const { setTodolistsAC, deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, createTodolistAC } =
  todolistsSlice.actions

// 🎯 Экспортируем сам reducer
export const todolistsReducer = todolistsSlice.reducer
