import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { useState } from "react"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { TasksPagination } from "./TasksPagination"
import { PAGE_SIZE } from "@/common/constants"
import { DndContextWrapper } from "@/common/components/Dnd/DndContext"
import { useTaskDragAndDrop } from "@/common/hooks/useTaskDragAndDrop"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@mui/material/styles"

type Props = {
  todolist: DomainTodolist
}

const TASKS_CONTAINER_HEIGHT = 200
const PAGINATION_HEIGHT = 40

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const [page, setPage] = useState(1)
  const theme = useTheme()
  const isLight = theme.palette.mode === "light"

  const { data, isLoading, error } = useGetTasksQuery({
    todolistId: id,
    params: { page, count: PAGE_SIZE },
  })

  const { filteredTasks, handleDragEnd, taskIds } = useTaskDragAndDrop({
    todolistId: id,
    items: data?.items || [],
    totalCount: data?.totalCount || 0,
    page,
    setPage,
    filter,
  })

  const showPagination = (data?.totalCount || 0) > PAGE_SIZE

  if (error) {
    console.warn("Error loading tasks:", error)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  // 👇 Цвета границ в зависимости от темы
  const borderColor = isLight ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)"

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Контейнер задач */}
      <Paper
        variant="outlined"
        sx={{
          height: TASKS_CONTAINER_HEIGHT,
          bgcolor: theme.palette.background.paper,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderColor: borderColor,
          // 👇 Убираем все внутренние отступы
          p: 0,
          m: 0,
          // 👡 Скругление углов
          borderRadius: 1,
        }}
      >
        {filteredTasks.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
              No tasks
            </Typography>
          </Box>
        ) : (
          <DndContextWrapper items={taskIds} onDragEnd={handleDragEnd}>
            <List
              sx={{
                p: 0,
                width: "100%",
                // 👇 Убираем отступы у списка
                "& .MuiListItem-root": {
                  py: 0,
                  px: 1,
                },
                // 👡 Первый элемент со скруглением сверху
                "& .MuiListItem-root:first-of-type": {
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                },
                // 👡 Последний элемент со скруглением снизу
                "& .MuiListItem-root:last-of-type": {
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                },
              }}
            >
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskItem task={task} todolist={todolist} isLast={index === filteredTasks.length - 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          </DndContextWrapper>
        )}
      </Paper>

      {/* Пагинация */}
      <Box sx={{ height: PAGINATION_HEIGHT, mt: 1 }}>
        {showPagination ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
          </motion.div>
        ) : (
          <Box sx={{ height: "100%" }} />
        )}
      </Box>
    </Box>
  )
}
