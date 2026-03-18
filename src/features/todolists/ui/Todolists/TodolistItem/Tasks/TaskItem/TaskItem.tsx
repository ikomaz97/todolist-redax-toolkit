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
import { useTheme } from "@mui/material/styles"
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
  const theme = useTheme()
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

  const borderColor = theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.23)"

  return (
    <>
      <motion.div ref={setNodeRef} style={{ ...style, width: "100%" }} layout="position" whileHover={{ scale: 1.01 }}>
        <ListItem
          {...attributes}
          {...listeners}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 48,
            px: 1,
            width: "100%", // 👈 На всю ширину
            border: "1px solid",
            borderColor: borderColor,
            borderBottom: isLast ? "1px solid" : "none",
            borderBottomColor: borderColor,
            borderRadius: 1,
            marginBottom: "-1px",
            ...(isLast && {
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            }),
            cursor: isDragging ? "grabbing" : "grab",
            backgroundColor: theme.palette.background.paper,
            opacity: isCompleted ? 0.5 : 1,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            m: 0,
            py: 0,
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
            <Checkbox
              checked={isCompleted}
              onChange={changeTaskStatus}
              size="small"
              sx={{
                p: 0.5,
                mr: 1,
                color: theme.palette.mode === "light" ? "#01579B" : "#B3E5FC",
                "&.Mui-checked": {
                  color: theme.palette.mode === "light" ? "#0288D1" : "#4EB5E5",
                },
              }}
            />
            <Box
              sx={{
                color: theme.palette.mode === "light" ? "#01579B" : "#B3E5FC",
                textDecoration: isCompleted ? "line-through" : "none",
                flex: 1,
              }}
            >
              <EditableSpan value={task.title} onChange={changeTaskTitle} maxDisplayLength={15} />
            </Box>
          </Box>
          <IconButton
            onClick={deleteTask}
            size="small"
            sx={{
              color: theme.palette.mode === "light" ? "#01579B" : "#B3E5FC",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "light" ? "rgba(1, 87, 155, 0.04)" : "rgba(179, 229, 252, 0.08)",
              },
            }}
          >
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
