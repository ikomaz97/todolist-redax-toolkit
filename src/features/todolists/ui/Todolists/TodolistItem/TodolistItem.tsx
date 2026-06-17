// features/todolists/ui/Todolists/TodolistItem/TodolistItem.tsx
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import { useCallback, memo } from "react"
import { Tasks } from "./Tasks/Tasks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"

type Props = {
  todolist: DomainTodolist
}

const TodolistItemComponent = ({ todolist }: Props) => {
  const { id } = todolist
  const [addTask, { isLoading }] = useAddTaskMutation()

  const createTask = useCallback(
    async (title: string) => {
      try {
        await addTask({
          todolistId: id,
          title,
        }).unwrap()
      } catch (error) {
        console.error("Failed to add task:", error)
      }
    },
    [id, addTask],
  )

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
    </Box>
  )
}

export const TodolistItem = memo(TodolistItemComponent)
