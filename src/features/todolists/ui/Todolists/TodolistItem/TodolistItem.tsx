// features/todolists/ui/Todolists/TodolistItem/TodolistItem.tsx
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import { useState, useCallback, memo } from "react"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import { PAGE_SIZE } from "@/common/constants"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { Tasks } from "./Tasks/Tasks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"

type Props = {
  todolist: DomainTodolist
}

const TodolistItemComponent = ({ todolist }: Props) => {
  const { id } = todolist
  const [addTask, { isLoading }] = useAddTaskMutation()
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const { data } = useGetTasksQuery({
    todolistId: id,
    params: { page: 1, count: PAGE_SIZE },
  })

  const currentTasksCount = data?.items.length || 0
  const isPageFull = currentTasksCount >= PAGE_SIZE

  const createTask = useCallback(
    async (title: string) => {
      try {
        const targetPage = isPageFull ? 2 : 1

        await addTask({
          todolistId: id,
          title,
          currentPage: targetPage,
        }).unwrap()

        if (targetPage === 2) {
          setSnackbarOpen(true)
        }
      } catch (error) {
        console.error("Failed to add task:", error)
      }
    },
    [id, isPageFull, addTask],
  )

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false)
  }, [])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 2,
      }}
    >
      <TodolistTitle todolist={todolist} />

      <CreateItemForm onCreateItem={createTask} disabled={isLoading} placeholder="Enter a task title" />

      <Divider />

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Tasks todolist={todolist} />
      </Box>

      <Box sx={{ mt: "auto" }}>
        <FilterButtons todolist={todolist} />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" onClose={handleSnackbarClose}>
          Page 1 is full. Task added to page 2.
        </Alert>
      </Snackbar>
    </Box>
  )
}

export const TodolistItem = memo(TodolistItemComponent)
