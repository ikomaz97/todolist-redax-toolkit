import {Todolist} from "../App.tsx";



const initialState: Todolist[] = []



export const todolistsReducer = (state: Todolist[] = initialState, action: Actions): Todolist[] => {
    switch (action.type) {
        case 'delete_todolist': {
            return state // логика удаления тудулиста
        }
        default:
            return state
    }
}

type Actions = {
    type: string
    payload: any
}