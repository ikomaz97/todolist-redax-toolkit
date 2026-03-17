import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { useRemoveTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { createTaskModel } from "@/features/todolists/lib/utils"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import Box from "@mui/material/Box"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { useState } from "react"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
  isLast?: boolean
}

export const TaskItem = ({ task, todolist, isLast }: Props) => {
  const [removeTask] = useRemoveTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task: {
        id: task.id,
        title: task.title,
        status: task.status,
      },
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const deleteTask = async () => {
    try {
      await removeTask({
        todolistId: todolist.id,
        taskId: task.id,
      }).unwrap()
    } catch {
      setSnackbarOpen(true)
    }
  }

  const changeTaskStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createTaskModel(task, { status })
    updateTask({
      taskId: task.id,
      todolistId: todolist.id,
      model,
    })
  }

  const changeTaskTitle = (title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    const model = createTaskModel(task, { title: trimmed })
    updateTask({
      taskId: task.id,
      todolistId: todolist.id,
      model,
    })
  }

  const isCompleted = task.status === TaskStatus.Completed

  return (
    <>
      <motion.div ref={setNodeRef} style={style} layout="position" whileHover={{ scale: 1.01 }}>
        <ListItem
          {...attributes}
          {...listeners}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 48,
            px: 1,
            borderBottom: isLast ? "none" : "1px solid",
            borderColor: "divider",
            cursor: isDragging ? "grabbing" : "grab",
            backgroundColor: "#fff",
            opacity: isCompleted ? 0.5 : 1,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Checkbox checked={isCompleted} onChange={changeTaskStatus} size="small" sx={{ p: 0.5, mr: 1 }} />
            <EditableSpan value={task.title} onChange={changeTaskTitle} maxDisplayLength={15} />
          </Box>
          <IconButton onClick={deleteTask} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      </motion.div>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="error">Failed to delete task</Alert>
      </Snackbar>
    </>
  )
}
