import { useState } from "react"
import { useCreateTaskMutation } from "@/features/todolists/api/tasksApi"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

type Props = {
    todolistId: string
}

export const AddItemForm = ({ todolistId }: Props) => {
    const [title, setTitle] = useState("")
    const [createTask] = useCreateTaskMutation()

    const onAdd = () => {
        if (title.trim() === "") return
        createTask({ todolistId, title: title.trim() })
        setTitle("")
    }

    return (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                label="New task"
                size="small"
            />
            <Button variant="contained" onClick={onAdd}>
                Add
            </Button>
        </div>
    )
}
