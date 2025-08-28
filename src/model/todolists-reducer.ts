import {FilterValues, Todolist} from "../App.tsx";
import {v1} from "uuid";

export const deleteTodolistAC = (id: string) => {
    return {type: 'delete_todolist', payload: { id }} as const
}

// Исправляем: убираем id из параметров, генерируем его внутри
export const createTodolistAC = (title: string) => {
    return {type: 'create_todolist', payload: { title }} as const
}

// Исправляем: используем一致的 naming (id вместо todolistId)
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'change_todolist_title', payload: { id, title }} as const
}

export const changeTodolistFilterAC = (id: string, filter: FilterValues) => {
    return {type: 'change_todolist_filter', payload: { id, filter }} as const
}

export type DeleteTodolistAction = ReturnType<typeof deleteTodolistAC>
export type CreateTodolistAction = ReturnType<typeof createTodolistAC>
export type ChangeTodolistTitleAction = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterAction = ReturnType<typeof changeTodolistFilterAC>

type Actions = DeleteTodolistAction | CreateTodolistAction | ChangeTodolistTitleAction | ChangeTodolistFilterAction

const initialState: Todolist[] = []

export const todolistsReducer = (state: Todolist[] = initialState, action: Actions): Todolist[] => {
    switch (action.type) {
        case 'delete_todolist': {
            return state.filter(todolist => todolist.id !== action.payload.id)
        }
        case 'create_todolist': {
            // Генерируем id здесь или в компоненте - лучше в компоненте
            const newTodolist: Todolist = {
                id: v1(), // Нужно импортировать v1
                title: action.payload.title,
                filter: 'all'
            }
            return [newTodolist, ...state]
        }
        case 'change_todolist_title': {
            return state.map(todolist =>
                todolist.id === action.payload.id
                    ? {...todolist, title: action.payload.title}
                    : todolist
            )
        }
        case 'change_todolist_filter': {
            return state.map(todolist =>
                todolist.id === action.payload.id
                    ? {...todolist, filter: action.payload.filter}
                    : todolist
            )
        }
        default:
            return state;
    }
}