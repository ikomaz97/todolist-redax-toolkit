import {FilterValues, Todolist} from "../App.tsx";

// ✅ Action creators
export const deleteTodolistAC = (id: string) => {
    return {type: 'delete_todolist', payload: {id}} as const
}

export const createTodolistAC = (title: string, id: string) => {
    return {type: 'create_todolist', payload: {id, title}} as const
}

export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'change_todolist_title', payload: {id, title}} as const
}

export const changeTodolistFilterAC = (id: string, filter: FilterValues) => {
    return {type: 'change_todolist_filter', payload: {id, filter}} as const
}

// ✅ Types
export type DeleteTodolistAction = ReturnType<typeof deleteTodolistAC>
export type CreateTodolistAction = ReturnType<typeof createTodolistAC>
export type ChangeTodolistTitleAction = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterAction = ReturnType<typeof changeTodolistFilterAC>

type Actions =
    | DeleteTodolistAction
    | CreateTodolistAction
    | ChangeTodolistTitleAction
    | ChangeTodolistFilterAction

// ✅ initialState типизирован
const initialState: Todolist[] = []

// ✅ Reducer
export const todolistsReducer = (
    state: Todolist[] = initialState,
    action: Actions
): Todolist[] => {
    switch (action.type) {
        case 'delete_todolist': {
            return state.filter(tl => tl.id !== action.payload.id)
        }
        case 'create_todolist': {
            const newTodolist: Todolist = {
                id: action.payload.id,
                title: action.payload.title,
                filter: 'all'
            }
            return [newTodolist, ...state]
        }
        case 'change_todolist_title': {
            return state.map(tl =>
                tl.id === action.payload.id
                    ? {...tl, title: action.payload.title}
                    : tl
            )
        }
        case 'change_todolist_filter': {
            return state.map(tl =>
                tl.id === action.payload.id
                    ? {...tl, filter: action.payload.filter}
                    : tl
            )
        }
        default:
            return state
    }
}