import { TaskStatus } from "@/common/enums"
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import TextField from "@mui/material/TextField"
import { useState, ChangeEvent } from "react"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"

type Props = {
    task: DomainTask
    todolist: DomainTodolist
}

export const TaskItem = ({ task, todolist }: Props) => {
    const [updateTask] = useUpdateTaskMutation()
    const [deleteTask] = useDeleteTaskMutation()

    const [editTitle, setEditTitle] = useState(task.title)
    const [isEditing, setIsEditing] = useState(false)

    const onDelete = () => {
        deleteTask({ todolistId: todolist.id, taskId: task.id })
    }

    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
        updateTask({
            todolistId: todolist.id,
            taskId: task.id,
            model: { ...task, status },
        })
    }

    const onTitleBlur = () => {
        setIsEditing(false)
        if (editTitle !== task.title) {
            updateTask({
                todolistId: todolist.id,
                taskId: task.id,
                model: { ...task, title: editTitle },
            })
        }
    }

    return (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <Checkbox checked={task.status === TaskStatus.Completed} onChange={onStatusChange} />
            {isEditing ? (
                <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={onTitleBlur}
                    size="small"
                />
            ) : (
                <span onDoubleClick={() => setIsEditing(true)} style={{ flex: 1 }}>
          {task.title}
        </span>
            )}
            <IconButton onClick={onDelete}>
                <DeleteIcon />
            </IconButton>
        </div>
    )
}
