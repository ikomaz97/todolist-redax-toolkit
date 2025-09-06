import type { TasksState } from '../App'
import { v1 } from "uuid";

const initialState: TasksState = {}

export const deleteTaskAC = (payload: { todolistId: string; taskId: string }) => {
    return { type: 'delete_task', payload } as const
}

export const createTaskAC = (payload: { todolistId: string; title: string }) => {
    return { type: 'create_task', payload } as const
}

export const changeTaskStatusAC = (payload: { todolistId: string; taskId: string; isDone: boolean }) => {
    return { type: 'change_task_status', payload } as const
}

export const changeTaskTitleAC = (payload: { todolistId: string; taskId: string; title: string }) => {
    return { type: 'change_task_title', payload } as const
}

export const createTodolistAC = (payload: { todolistId: string }) => {
    return { type: 'create_todolist', payload } as const
}

export const deleteTodolistAC = (payload: { todolistId: string }) => {
    return { type: 'delete_todolist', payload } as const
}

export type DeleteTaskAction = ReturnType<typeof deleteTaskAC>
export type CreateTaskAction = ReturnType<typeof createTaskAC>
export type ChangeTaskStatusAction = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleAction = ReturnType<typeof changeTaskTitleAC>
export type CreateTodolistAction = ReturnType<typeof createTodolistAC>
export type DeleteTodolistAction = ReturnType<typeof deleteTodolistAC>

type Actions =
    | DeleteTaskAction
    | CreateTaskAction
    | ChangeTaskStatusAction
    | ChangeTaskTitleAction
    | CreateTodolistAction
    | DeleteTodolistAction

export const tasksReducer = (
    state: TasksState = initialState,
    action: Actions
): TasksState => {
    switch (action.type) {
        case 'delete_task': {
            const { todolistId, taskId } = action.payload
            return {
                ...state,
                [todolistId]: state[todolistId].filter(t => t.id !== taskId)
            }
        }
        case 'create_task': {
            const { todolistId, title } = action.payload
            const newTask = { id: v1(), title, isDone: false }
            return {
                ...state,
                [todolistId]: [newTask, ...state[todolistId]]
            }
        }
        case 'change_task_status': {
            const { todolistId, taskId, isDone } = action.payload
            return {
                ...state,
                [todolistId]: state[todolistId].map(t =>
                    t.id === taskId ? { ...t, isDone } : t
                )
            }
        }
        case 'change_task_title': {
            const { todolistId, taskId, title } = action.payload
            return {
                ...state,
                [todolistId]: state[todolistId].map(t =>
                    t.id === taskId ? { ...t, title } : t
                )
            }
        }
        case 'create_todolist': {
            const { todolistId } = action.payload
            return {
                ...state,
                [todolistId]: []
            }
        }
        case 'delete_todolist': {
            const { todolistId } = action.payload
            const newState = { ...state }
            delete newState[todolistId]
            return newState
        }
        default:
            return state
    }
}