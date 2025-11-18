import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { tasksApi } from "@/features/todolists/api/tasksApi"

import { createAppSlice } from "@/common/utils"
import { TaskStatus } from "@/common/enums"
import { DomainTask } from "@/features/todolists/api/tasksApi.types"

// Тип стейта
export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,

  selectors: {
    selectTasks: (state) => state,
  },

  reducers: (create) => ({
    // 🔄 Получить задачи для тудулиста
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),

    // ➕ Создание задачи через API
    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; title: string }, thunkAPI) => {
        try {
          const res = await tasksApi.createTask(payload)
          return { task: res.data.data.item }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const task = action.payload.task
          state[task.todoListId].unshift(task)
        },
      },
    ),

    // 🗑 Удаление задачи
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index !== -1) tasks.splice(index, 1)
    }),

    // 🔁 Изменение статуса задачи
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; isDone: boolean }>((state, action) => {
      const task = state[action.payload.todolistId].find((t) => t.id === action.payload.taskId)
      if (task) {
        task.status = action.payload.isDone ? TaskStatus.Completed : TaskStatus.New
      }
    }),

    // ✏️ Изменение названия задачи
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((t) => t.id === action.payload.taskId)
      if (task) task.title = action.payload.title
    }),
  }),

  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { selectTasks } = tasksSlice.selectors

export const { fetchTasksTC, createTaskTC, deleteTaskAC, changeTaskStatusAC, changeTaskTitleAC } = tasksSlice.actions

export const tasksReducer = tasksSlice.reducer
