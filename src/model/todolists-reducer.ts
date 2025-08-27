import {FilterValues, Todolist} from "../App.tsx";



export const deleteTodolistAC = (id: string) => {
    return {type: 'delete_todolist', payload: { id }} as const
}

export const createTodolistAC = (id: string, title: string) => {
    return {type: 'create_todolist', payload: { id, title }} as const
}

export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return {type: 'New title', payload: { todolistId, title }} as const
}

export const changeTodolistFilterAC = (todolistId: string, filter: FilterValues) => {
    return {type: 'completed', payload: { todolistId, filter }} as const
}

export type DeleteTodolistAction = ReturnType<typeof deleteTodolistAC>

export type CreateTodolistAC = ReturnType<typeof createTodolistAC>

export type ChangeTodolistTitleAC = ReturnType<typeof changeTodolistTitleAC>

export type ChangeTodolistFilterAC = ReturnType<typeof changeTodolistFilterAC>



type Actions = DeleteTodolistAction | CreateTodolistAC | ChangeTodolistTitleAC |ChangeTodolistFilterAC

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

        case 'New title': {
              return state.map(todolist => todolist.id === action.payload.todolistId ? {...todolist, title: action.payload.title} : todolist)
        }
           // (todolists.map(todolist => todolist.id === todolistId ? {...todolist, filter} : todolist))
        case 'completed'        : {
            return state.map(todolist => todolist.id === action.payload.todolistId ? {...todolist, filter: action.payload.filter} : todolist)
        }


        default:
            return state;
        /*...*/
    }
}



