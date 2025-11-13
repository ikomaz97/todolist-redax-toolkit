import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { tasksApi } from "@/features/todolists/api/tasksApi"

import { nanoid } from "@reduxjs/toolkit"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { createAppSlice } from "@/common/utils"
import { TaskPriority, TaskStatus } from "@/common/enums"

export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,

  selectors: {
    selectTasks: (state) => state,
  },

  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },

  reducers: (create) => ({
    // 🚀 Санка для получения задач по тудулисту
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

    // 🗑 Удаление задачи
    deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    }),

    // ➕ Создание новой задачи
    createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
      const newTask: DomainTask = {
        title: action.payload.title,
        todoListId: action.payload.todolistId,
        startDate: "",
        priority: TaskPriority.Low,
        description: "",
        deadline: "",
        status: TaskStatus.New,
        addedDate: "",
        order: 0,
        id: nanoid(),
      }
      state[action.payload.todolistId].unshift(newTask)
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
      if (task) {
        task.title = action.payload.title
      }
    }),
  }),
})

export const { selectTasks } = tasksSlice.selectors
export const { fetchTasksTC, deleteTaskAC, createTaskAC, changeTaskStatusAC, changeTaskTitleAC } = tasksSlice.actions

export const tasksReducer = tasksSlice.reducer
