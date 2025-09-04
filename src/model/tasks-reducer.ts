import type { TasksState } from '../App'
import { v1 } from "uuid";

const initialState: TasksState = {}

export const deleteTaskAC = (payload: { todolistId: string; taskId: string }) => {
    return { type: 'delete_task', payload } as const
}

export const createTaskAC = (payload: { todolistId: string; title: string }) => {
    return { type: 'create_task', payload } as const
}

export type DeleteTaskAction = ReturnType<typeof deleteTaskAC>
export type CreateTaskAction = ReturnType<typeof createTaskAC>

type Actions = DeleteTaskAction | CreateTaskAction

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
        default:
            return state
    }
}