// features/todolists/ui/Todolists/Todolists.tsx
import { containerSx } from "@/common/styles"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import Grid from "@mui/material/Grid";
import { Alert } from "@mui/material";

export const Todolists = () => {
  const { data: todolists, isLoading, error } = useGetTodolistsQuery()

  if (isLoading) {
    return (
      <Box sx={containerSx} style={{ gap: "32px" }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
          ))}
      </Box>
    )
  }

  if (error) {
    console.warn('Error loading todolists:', error)
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Ошибка загрузки тудулистов, но вы можете продолжать работу
      </Alert>
    )
  }

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {todolists?.map((todolist) => (
        <Grid
          key={todolist.id}
          {...{ xs: 12, sm: 6, md: 4 }}
        >
          <Paper sx={{ p: "0 20px 20px 20px", height: '100%' }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}