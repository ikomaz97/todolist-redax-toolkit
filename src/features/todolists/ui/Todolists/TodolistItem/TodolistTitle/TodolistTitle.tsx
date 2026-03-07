import { EditableSpan } from "@/common/components"
import {
    todolistsApi,
    useRemoveTodolistMutation,
    useUpdateTodolistTitleMutation
} from "@/features/todolists/api/todolistsApi"
import { type DomainTodolist } from "@/features/todolists/model/todolists-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {useAppDispatch} from "@/common/hooks";
import {RequestStatus} from "@/common/types";

type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
    const { id, title, entityStatus } = todolist

    const [removeTodolist] = useRemoveTodolistMutation()
    const [updateTodolistTitle] = useUpdateTodolistTitleMutation() // ← Добавлено!

    const dispatch = useAppDispatch()

    const changeTodolistStatus = (entityStatus: RequestStatus) => {
        dispatch(
            todolistsApi.util.updateQueryData('getTodolists', undefined, state => {
                const todolist = state.find(todolist => todolist.id === id)
                if (todolist) {
                    todolist.entityStatus = entityStatus
                }
            })
        )
    }

    const changeTodolistTitle = (title: string) => { // ← Добавлена функция!
        updateTodolistTitle({ id, title })
            .unwrap()
            .catch(() => {
                // можно добавить обработку ошибки при необходимости
                changeTodolistStatus('idle')
            })
    }

    const deleteTodolist = () => {
        changeTodolistStatus('loading')
        removeTodolist(id)
            .unwrap()
            .catch(() => {
                changeTodolistStatus('idle')
            })
    }

    return (
        <div className={styles.container}>
            <h3>
                <EditableSpan value={title} onChange={changeTodolistTitle} />
            </h3>
            <IconButton onClick={deleteTodolist} disabled={entityStatus === "loading"}>
                <DeleteIcon />
            </IconButton>
        </div>
    )
}