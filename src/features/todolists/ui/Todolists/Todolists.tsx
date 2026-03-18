import { useGetTodolistsQuery, useAddTodolistMutation } from "@/features/todolists/api/todolistsApi"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import { Alert } from "@mui/material"
import { DndContextWrapper } from "@/common/components/Dnd/DndContext"
import { SortableItem } from "@/common/components/Dnd/SortableItem"
import { useTodolistDragAndDrop } from "@/common/hooks/useTodolistDragAndDrop"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@mui/material/styles"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { useRef } from "react"

export const Todolists = () => {
  const theme = useTheme()
  const isLight = theme.palette.mode === "light"

  const { data: todolists, isLoading, error } = useGetTodolistsQuery()
  const { handleDragEnd, todolistIds } = useTodolistDragAndDrop({ todolists: todolists || [] })
  const [addTodolist] = useAddTodolistMutation()

  // 👇 Сохраняем ref для каждого тудулиста
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const addTodolistHandler = async (title: string) => {
    try {
      await addTodolist(title).unwrap()
    } catch (error) {
      console.error("Failed to add todolist:", error)
      throw error
    }
  }

  // 👇 Функция для рендера оверлея при перетаскивании
  const renderOverlay = (activeId: string) => {
    const activeTodolist = todolists?.find((t) => t.id === activeId)
    if (!activeTodolist) return null

    // 👇 Получаем размеры исходного элемента
    const activeElement = itemRefs.current[activeId]
    const rect = activeElement?.getBoundingClientRect()

    return (
      <Paper
        sx={{
          p: "0 20px 20px 20px",
          boxShadow: 4,
          borderRadius: 1,
          backgroundColor: isLight ? "#FFFFFF" : "#12455F",
          border: "2px solid",
          borderColor: "primary.main",
          width: rect ? `${rect.width}px` : "auto",
          height: rect ? `${rect.height}px` : "auto",
          boxSizing: "border-box",
          overflow: "hidden",
          opacity: 0.9,
        }}
      >
        <TodolistItem todolist={activeTodolist} />
      </Paper>
    )
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {Array(3)
              .fill(null)
              .map((_, id) => (
                <Grid key={id} size={{ xs: 12, sm: 12, md: 8, lg: 6 }}>
                  <TodolistSkeleton />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 3 }}>
          <Alert severity="warning">Ошибка загрузки тудулистов, но вы можете продолжать работу</Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      {/* Форма создания тудулиста */}
      <Box
        sx={{
          mt: 3,
          mb: 3,
          width: "100%",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <CreateItemForm onCreateItem={addTodolistHandler} placeholder="Enter todolist title" disabled={isLoading} />
      </Box>

      {/* Список тудулистов */}
      <Grid container spacing={3}>
        <DndContextWrapper
          items={todolistIds}
          onDragEnd={handleDragEnd}
          renderOverlay={renderOverlay} // 👈 Передаем функцию для оверлея
        >
          <AnimatePresence>
            {todolists?.map((todolist) => (
              <SortableItem
                key={todolist.id}
                id={todolist.id}
                data={{
                  type: "todolist",
                  todolist,
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
                      backgroundColor: isLight ? "#FFFFFF" : "#12455F",
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                    ref={(el) => {
                      itemRefs.current[todolist.id] = el
                    }} // 👈 Сохраняем ref
                  >
                    <TodolistItem todolist={todolist} />
                  </Paper>
                </Grid>
              </SortableItem>
            ))}
          </AnimatePresence>
        </DndContextWrapper>
      </Grid>
    </Container>
  )
}
