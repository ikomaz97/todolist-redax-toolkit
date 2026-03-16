// features/todolists/ui/Todolists/Todolists.tsx
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import { Alert } from "@mui/material"
import { DndContextWrapper } from "@/common/components/Dnd/DndContext"
import { SortableItem } from "@/common/components/Dnd/SortableItem"
import { useTodolistDragAndDrop } from "@/common/hooks/useTodolistDragAndDrop"
import Box from "@mui/material/Box"

export const Todolists = () => {
  const { data: todolists, isLoading, error } = useGetTodolistsQuery()
  const { handleDragEnd, todolistIds } = useTodolistDragAndDrop({ todolists: todolists || [] })

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={{ p: 2 }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <Grid key={id} size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
              <TodolistSkeleton />
            </Grid>
          ))}
      </Grid>
    )
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Ошибка загрузки тудулистов, но вы можете продолжать работу
      </Alert>
    )
  }

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      <DndContextWrapper items={todolistIds} onDragEnd={handleDragEnd}>
        {todolists?.map((todolist) => (
          <SortableItem key={todolist.id} id={todolist.id}>
            <Grid
              size={{
                xs: 12, // телефоны: весь экран
                sm: 12, // планшеты: весь экран
                md: 10, // средние: 66% экрана (2/3)
                lg: 16, // большие: 50% экрана
                xl: 12, // очень большие: 33% экрана
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                <Box sx={{ p: 2, pb: 1 }}>
                  <TodolistItem todolist={todolist} />
                </Box>
              </Paper>
            </Grid>
          </SortableItem>
        ))}
      </DndContextWrapper>
    </Grid>
  )
}
