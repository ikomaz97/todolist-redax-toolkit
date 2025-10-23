import { createSlice, nanoid } from "@reduxjs/toolkit"
import { createTodolistAC, deleteTodolistAC } from "@/features/todolists/model/todolists-slice.ts"

// 🔹 Тип одной задачи
export type Task = {
  id: string
  title: string
  isDone: boolean
}

// 🔹 Тип состояния: объект, где ключ — id тудулиста, а значение — массив задач
export type TasksState = {
  [todolistId: string]: Task[]
}

// 🔹 Начальное состояние (по умолчанию — пустое)
const initialState: TasksState = {}

// 🔹 Создаём slice
export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: (create) => ({
    // 🗑️ 1. Удаление задачи
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),

    // ➕ 2. Создание новой задачи
    createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
      const newTask: Task = { id: nanoid(), title: action.payload.title, isDone: false }
      // если у этого тудулиста ещё нет массива задач — создаём
      if (!state[action.payload.todolistId]) {
        state[action.payload.todolistId] = []
      }
      state[action.payload.todolistId].unshift(newTask)
    }),

    // ✅ 3. Изменение статуса задачи (выполнена/не выполнена)
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.isDone = action.payload.isDone
      }
    }),

    // ✏️ 4. Изменение названия задачи
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistAC, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.id]
      })
  },
})
// 🎯 Экспортируем actions (Redux Toolkit создаёт их автоматически)
export const { deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC } = tasksSlice.actions

// 🧠 Экспортируем reducer
export const tasksReducer = tasksSlice.reducer
