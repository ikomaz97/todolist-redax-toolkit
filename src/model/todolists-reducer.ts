import {Todolist} from "../App.tsx";



export const deleteTodolistAC = (id: string) => {
    return {type: 'delete_todolist', payload: { id }} as const
}

export const createTodolistAC = (id: string, title: string) => {
    return {type: 'create_todolist', payload: { id, title }} as const
}

export type DeleteTodolistAction = ReturnType<typeof deleteTodolistAC>

export type CreateTodolistAC = ReturnType<typeof createTodolistAC>

type Actions = DeleteTodolistAction | CreateTodolistAC

const initialState: Todolist[] = []



export const todolistsReducer = (state: Todolist[] = initialState, action: Actions): Todolist[] => {
    switch (action.type) {
        case 'delete_todolist': {
            return state.filter(todolist => todolist.id !== action.payload.id)
        }
        case 'create_todolist': {
            const newTodolist: Todolist = {id: action.payload.id, title: action.payload.title, filter: 'all'}
            return [...state, newTodolist]
        }
        default:
            return state;
        /*...*/
    }
}



