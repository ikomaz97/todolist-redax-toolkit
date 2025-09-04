import type {TasksState} from '../App'


const initialState: TasksState = {}

export const deleteTaskAC = (payload: { todolistId: string; taskId: string }) => {
    return  {type: 'delete_task', payload} as const}





export type DeleteTaskAction = ReturnType<typeof deleteTaskAC>

type Actions = DeleteTaskAction


export const tasksReducer = (task: TasksState = initialState, action: Actions): TasksState => {
    switch (action.type) {
        case 'delete_task': {
            const { todolistId, taskId } = action.payload
            return {
                ...task,
                [todolistId]: task[todolistId].filter(t => t.id !== taskId)
            }
        }
        case 'delete_task': {
            const { todolistId, taskId } = action.payload
            return {
                ...task,
                [todolistId]: task[todolistId].filter(t => t.id !== taskId)
            }
        }

        default:
            return task
    }
}