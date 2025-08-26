import {Todolist} from "../App.tsx";


export const deleteTodolistAC = (id: string) => {
    return {type: 'delete_todolist', payload: { id }} as const
}

export type DeleteTodolistAction = ReturnType<typeof deleteTodolistAC>

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



