import {Todolist} from "../App.tsx";

export type DeleteTodolistAction = {
    type: 'delete_todolist'
    payload: {
        id: string
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



