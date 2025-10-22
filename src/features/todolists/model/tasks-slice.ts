import { createSlice, nanoid } from "@reduxjs/toolkit"
import { createTodolistAC, deleteTodolistAC } from "./todolists-slice"

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>

const initialState: TasksState = {}

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: (create) => ({
    // 🗑️ Удалить задачу
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),

    // ➕ Создать новую задачу
    createTaskAC: create.preparedReducer(
      (todolistId: string, title: string) => ({
        payload: { todolistId, title, id: nanoid() },
      }),
      (state, action) => {
        const { todolistId, title, id } = action.payload
        const newTask: Task = { id, title, isDone: false }

        // ✅ Добавляем проверку
        if (!state[todolistId]) {
          state[todolistId] = []
        }

        state[todolistId].unshift(newTask)
      },
    ),

    // 🔄 Изменить статус задачи
    changeTaskStatusAC: create.reducer<{
      todolistId: string
      taskId: string
      isDone: boolean
    }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.isDone = action.payload.isDone
      }
    }),

    // ✏️ Изменить заголовок задачи
    changeTaskTitleAC: create.reducer<{
      todolistId: string
      taskId: string
      title: string
    }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
  }),

  // ⚡ Внешние редьюсеры (обработка действий из других слайсов)
  extraReducers: (builder) => {
    builder
      // При создании нового тудулиста — добавляем пустой массив задач
      .addCase(createTodolistAC, (state, action) => {
        state[action.payload.id] = []
      })
      // При удалении тудулиста — удаляем его задачи
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

// Экспорт action creators
export const { deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC } = tasksSlice.actions

// Экспорт reducer
export const tasksReducer = tasksSlice.reducer
