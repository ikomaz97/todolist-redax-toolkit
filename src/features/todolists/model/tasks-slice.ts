import { createAppSlice } from "@/common/utils"
import { tasksApi } from "@/features/todolists/api/tasksApi"
import { TaskStatus } from "@/common/enums"
import { RootState } from "@/app/store"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types"
import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"

export type TasksState = Record<string, DomainTask[]>

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,

  selectors: {
    selectTasks: (state) => state,
  },

  reducers: (create) => ({
    // Получение задач по тудулисту
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

    // Создание новой задачи через API
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

    // Удаление задачи через API
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask(payload)
          return payload
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((t) => t.id === action.payload.taskId)
          if (index !== -1) tasks.splice(index, 1)
        },
      },
    ),

    // Изменение статуса задачи через API
    changeTaskStatusTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string; status: TaskStatus }, thunkAPI) => {
        const { todolistId, taskId, status } = payload
        const allTodolistTasks = (thunkAPI.getState() as RootState).tasks[todolistId]
        const task = allTodolistTasks?.find((t) => t.id === taskId)

        if (!task) return thunkAPI.rejectWithValue(null)

        const model: UpdateTaskModel = {
          description: task.description,
          title: task.title,
          priority: task.priority,
          startDate: task.startDate,
          deadline: task.deadline,
          status,
        }

        try {
          const res = await tasksApi.updateTask({ todolistId, taskId, model })
          return { task: res.data.data.item }
        } catch (error) {
          return thunkAPI.rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const updatedTask = action.payload.task
          const taskToUpdate = state[updatedTask.todoListId].find((t) => t.id === updatedTask.id)
          if (taskToUpdate) {
            taskToUpdate.status = updatedTask.status
          }
        },
      },
    ),

    // Изменение названия задачи через API
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
export const { fetchTasksTC, createTaskTC, deleteTaskTC, changeTaskTitleAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
