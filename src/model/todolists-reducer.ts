import {Todolist} from "../App.tsx";


export const deleteTodolistAC = (id: string, value: boolean): DeleteTodolistAction => {
    return {type: 'delete_todolist', payload: { id, value }} as const
}

export type DeleteTodolistAction = {
    type: 'delete_todolist'
    payload: {
        id: string
        value: boolean
    }
}

type Actions = DeleteTodolistAction

const initialState: Todolist[] = []



export const todolistsReducer = (state: Todolist[] = initialState, action: Actions): Todolist[] => {
    switch (action.type) {
        case 'delete_todolist': {
            return state.filter(todolist => todolist.id !== action.payload.id)
        }
        /*...*/
    }
}



