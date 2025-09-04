import type {TasksState} from '../App'

const initialState: TasksState = {}





export const tasksReducer = (state: TasksState = initialState, action: Actions): TasksState => {
    switch (action.type) {
        case '': {
            return state
        }
        default:
            return state
    }
}

type Actions = any