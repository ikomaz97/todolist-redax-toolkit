// features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx
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
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Box from "@mui/material/Box"
import { motion } from "framer-motion"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { useState } from "react"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
  isLast?: boolean
}

export const TaskItem = ({ task, todolist, isLast = false }: Props) => {
  const [removeTask] = useRemoveTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("error")

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: false,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const deleteTask = async () => {
    try {
      await removeTask({
        todolistId: todolist.id,
        taskId: task.id,
      }).unwrap()
    } catch (error: any) {
      console.error("Failed to delete task:", error)

      if (error?.status === 500) {
        setSnackbarMessage("Server error. Please try again later.")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } else if (error?.status === 400) {
        setSnackbarMessage("Task not found or already deleted.")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      } else {
        setSnackbarMessage("Failed to delete task. Please try again.")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    }
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createTaskModel(task, { status })
    updateTask({
      taskId: task.id,
      todolistId: todolist.id,
      model,
    })
  }

  const changeTaskTitle = (title: string) => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      const model = createTaskModel(task, { title: trimmedTitle })
      updateTask({
        taskId: task.id,
        todolistId: todolist.id,
        model,
      })
    }
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <>
      <motion.div ref={setNodeRef} style={style} whileHover={{ scale: 1.01 }} transition={{ duration: 0.1 }} layout>
        <ListItem
          sx={{
            ...getListItemSx(isTaskCompleted),
            borderBottom: isLast ? "none" : "1px solid",
            borderColor: "divider",
            px: 1,
            height: 48,
            cursor: isDragging ? "grabbing" : "grab", // Курор меняется на захват
          }}
          {...attributes} // Добавляем a11y атрибуты прямо на ListItem
          {...listeners} // Добавляем обработчики перетаскивания прямо на ListItem
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Стрелка DragIndicatorIcon ПОЛНОСТЬЮ УДАЛЕНА */}

            <Checkbox
              checked={isTaskCompleted}
              onChange={changeTaskStatus}
              size="small"
              sx={{
                flexShrink: 0,
                p: 0.5,
                mr: 0.5,
              }}
            />

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                ml: 0.5,
              }}
            >
              <EditableSpan value={task.title} onChange={changeTaskTitle} maxDisplayLength={15} />
            </Box>
          </Box>

          <IconButton
            onClick={deleteTask}
            size="small"
            sx={{
              flexShrink: 0,
              ml: 0.5,
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
