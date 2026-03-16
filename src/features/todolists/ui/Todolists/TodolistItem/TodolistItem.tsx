// features/todolists/ui/Todolists/TodolistItem/TodolistItem.tsx
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"

type Props = {
  todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const { id } = todolist
  const [addTask, { isLoading }] = useAddTaskMutation()

  const createTask = async (title: string) => {
    try {
      await addTask({
        todolistId: id,
        title,
        currentPage: 1,
      }).unwrap()
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }

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

      <Box sx={{ flex: 1 }}>
        <Tasks todolist={todolist} />
      </Box>

      <Box sx={{ mt: "auto", pt: 1 }}>
        <FilterButtons todolist={todolist} />
      </Box>
    </Box>
  )
}
