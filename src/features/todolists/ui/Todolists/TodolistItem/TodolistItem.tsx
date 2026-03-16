// features/todolists/ui/Todolists/TodolistItem/TodolistItem.tsx
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import { useState } from "react"
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

const TITLE_HEIGHT = 40
const FORM_HEIGHT = 40
const DIVIDER_HEIGHT = 2
const TASKS_CONTAINER_HEIGHT = 200
const FILTERS_HEIGHT = 40
const PAGINATION_HEIGHT = 40
const GAP = 16 // gap между элементами (2 * 8px)

// Общая высота тудулиста
const TOTAL_HEIGHT =
  TITLE_HEIGHT + FORM_HEIGHT + DIVIDER_HEIGHT + TASKS_CONTAINER_HEIGHT + FILTERS_HEIGHT + PAGINATION_HEIGHT + GAP * 4

export const TodolistItem = ({ todolist }: Props) => {
  const { id } = todolist
  const [addTask, { isLoading }] = useAddTaskMutation()
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const { data } = useGetTasksQuery({
    todolistId: id,
    params: { page: 1, count: PAGE_SIZE },
  })

  const currentTasksCount = data?.items.length || 0
  const isPageFull = currentTasksCount >= PAGE_SIZE

  const createTask = async (title: string) => {
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
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: TOTAL_HEIGHT, // Фиксированная общая высота
        gap: 2,
      }}
    >
      <Box sx={{ height: TITLE_HEIGHT }}>
        <TodolistTitle todolist={todolist} />
      </Box>

      <Box sx={{ height: FORM_HEIGHT }}>
        <CreateItemForm onCreateItem={createTask} disabled={isLoading} placeholder="Enter a task title" />
      </Box>

      <Divider sx={{ height: DIVIDER_HEIGHT }} />

      <Box sx={{ flex: 1 }}>
        <Tasks todolist={todolist} />
      </Box>

      <Box sx={{ height: FILTERS_HEIGHT }}>
        <FilterButtons todolist={todolist} />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" onClose={() => setSnackbarOpen(false)}>
          Page 1 is full. Task added to page 2.
        </Alert>
      </Snackbar>
    </Box>
  )
}
