// features/todolists/ui/Todolists/TodolistItem/FilterButtons/FilterButtons.tsx
import { useAppDispatch } from "@/common/hooks"
import { todolistsApi } from "@/features/todolists/api/todolistsApi"
import type { DomainTodolist, FilterValues } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

type Props = {
  todolist: DomainTodolist
}

export const FilterButtons = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const dispatch = useAppDispatch()

  const changeFilter = (filter: FilterValues) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
        const todolist = state.find((todolist) => todolist.id === id)
        if (todolist) {
          todolist.filter = filter
        }
      }),
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        width: "100%",
        mt: 2,
      }}
    >
      <Button
        variant={filter === "all" ? "contained" : "outlined"}
        color={"inherit"}
        onClick={() => changeFilter("all")}
        sx={{
          flex: 1,
          fontSize: "0.75rem",
          py: 0.5,
          textTransform: "uppercase",
        }}
      >
        All
      </Button>

      <Button
        variant={filter === "active" ? "contained" : "outlined"}
        color={"primary"}
        onClick={() => changeFilter("active")}
        sx={{
          flex: 1,
          fontSize: "0.75rem",
          py: 0.5,
          textTransform: "uppercase",
        }}
      >
        Active
      </Button>

      <Button
        variant={filter === "completed" ? "contained" : "outlined"}
        color={"secondary"}
        onClick={() => changeFilter("completed")}
        sx={{
          flex: 1,
          fontSize: "0.75rem",
          py: 0.5,
          textTransform: "uppercase",
        }}
      >
        Completed
      </Button>
    </Box>
  )
}
