// features/todolists/ui/Todolists/TodolistItem/TodolistItem.tsx
import type { DomainTodolist } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import { memo } from "react"
import { AddTaskForm } from "./AddTaskForm/AddTaskForm"
import { Tasks } from "./Tasks/Tasks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"

type Props = {
  todolist: DomainTodolist
}

// Компонент не содержит useAddTaskMutation — isLoading изолирован в AddTaskForm,
// поэтому ререндер при добавлении задачи не затрагивает TodolistItem и его дочерние компоненты
const TodolistItemComponent = ({ todolist }: Props) => {
  const { id } = todolist

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

      <AddTaskForm todolistId={id} />

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
