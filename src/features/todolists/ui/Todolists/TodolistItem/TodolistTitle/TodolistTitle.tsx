import { EditableSpan } from "@/common/components"
import { DomainTodolist } from "@/features/todolists/api/todolistsApi"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {
    useRemoveTodolistMutation,
    useUpdateTodolistTitleMutation,
} from "@/features/todolists/api/todolistsApi"

type Props = {
    todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
    const { id, title, entityStatus } = todolist

    const [removeTodolist] = useRemoveTodolistMutation()
    const [updateTodolistTitle] = useUpdateTodolistTitleMutation()

    const deleteTodolistHandler = () => {
        removeTodolist(id)
    }

    const changeTodolistTitleHandler = (title: string) => {
        updateTodolistTitle({ id, title })
    }

    return (
        <div className={styles.container}>
            <h3>
                <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
            </h3>

            <IconButton
                onClick={deleteTodolistHandler}
                disabled={entityStatus === "loading"}
            >
                <DeleteIcon />
            </IconButton>
        </div>
    )
}
