// features/todolists/ui/Todolists/Todolists.tsx
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import { Alert } from "@mui/material"
import { DndContextWrapper } from "@/common/components/Dnd/DndContext"
import { SortableItem } from "@/common/components/Dnd/SortableItem"
import { useTodolistDragAndDrop } from "@/common/hooks/useTodolistDragAndDrop.ts"
 // Добавили импорт

export const Todolists = () => {
  const { data: todolists, isLoading, error } = useGetTodolistsQuery()
  const { handleDragEnd, todolistIds } = useTodolistDragAndDrop({ todolists: todolists || [] })

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={{ p: 2 }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <Grid key={id} {...{ xs: 12, sm: 6, md: 4 }}>
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
            <Grid {...{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: "0 20px 20px 20px", height: "100%" }}>
                <TodolistItem todolist={todolist} />
              </Paper>
            </Grid>
          </SortableItem>
        ))}
      </DndContextWrapper>
    </Grid>
  )
}
