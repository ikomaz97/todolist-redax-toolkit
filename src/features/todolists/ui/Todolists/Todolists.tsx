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
import { motion, AnimatePresence } from "framer-motion"

export const Todolists = () => {
  const { data: todolists, isLoading, error } = useGetTodolistsQuery()
  const { handleDragEnd, todolistIds } = useTodolistDragAndDrop({ todolists: todolists || [] })

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={{ p: 2 }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <Grid key={id} size={{ xs: 12, sm: 12, md: 8, lg: 6 }}>
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
    <Grid container spacing={3} sx={{ p: 3 }}>
      <DndContextWrapper items={todolistIds} onDragEnd={handleDragEnd}>
        <AnimatePresence>
          {todolists?.map((todolist) => (
            <SortableItem
              key={todolist.id}
              id={todolist.id}
              data={{
                type: "todolist",
                todolist: {
                  id: todolist.id,
                  title: todolist.title,
                },
              }}
            >
              <Grid size={{ xs: 12, sm: 12, md: 7, lg: 12 }}>
                <Paper
                  component={motion.div}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.2,
                    layout: { duration: 0.3 },
                  }}
                  sx={{
                    p: "0 20px 20px 20px",
                    height: "100%",
                    boxShadow: 2,
                    "&:hover": {
                      boxShadow: 4,
                    },
                  }}
                >
                  <TodolistItem todolist={todolist} />
                </Paper>
              </Grid>
            </SortableItem>
          ))}
        </AnimatePresence>
      </DndContextWrapper>
    </Grid>
  )
}
