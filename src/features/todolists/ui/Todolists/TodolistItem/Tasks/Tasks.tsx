import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { useState, useRef } from "react"
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
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { TaskStatus } from "@/common/enums"

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

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})

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

  const renderTaskOverlay = (activeId: string) => {
    const activeTask = data?.items.find((t) => t.id === activeId)
    if (!activeTask) return null

    const activeElement = itemRefs.current[activeId]
    const rect = activeElement?.getBoundingClientRect()
    const isCompleted = activeTask.status === TaskStatus.Completed
    const borderColor = theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.23)"

    return (
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: rect ? `${rect.height}px` : 48,
          width: rect ? `${rect.width}px` : "100%", // 👈 На всю ширину
          px: 1,
          border: "1px solid",
          borderColor: borderColor,
          backgroundColor: theme.palette.background.paper,
          opacity: 0.9,
          boxShadow: 4,
          borderRadius: 1,
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
          <Checkbox
            checked={isCompleted}
            size="small"
            sx={{
              p: 0.5,
              mr: 1,
              color: theme.palette.mode === "light" ? "#01579B" : "#B3E5FC",
              "&.Mui-checked": {
                color: theme.palette.mode === "light" ? "#0288D1" : "#4EB5E5",
              },
            }}
          />
          <Box
            sx={{
              color: theme.palette.mode === "light" ? "#01579B" : "#B3E5FC",
              textDecoration: isCompleted ? "line-through" : "none",
              flex: 1,
            }}
          >
            {activeTask.title}
          </Box>
        </Box>
        <IconButton size="small" sx={{ visibility: "hidden" }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Paper>
    )
  }

  const showPagination = (data?.totalCount || 0) > PAGE_SIZE

  if (error) {
    console.warn("Error loading tasks:", error)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  const borderColor = isLight ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)"

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {" "}
      {/* 👈 На всю ширину */}
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
          p: 0,
          m: 0,
          borderRadius: 1,
          width: "100%", // 👈 На всю ширину
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
              width: "100%", // 👈 На всю ширину
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
              No tasks
            </Typography>
          </Box>
        ) : (
          <DndContextWrapper items={taskIds} onDragEnd={handleDragEnd} renderOverlay={renderTaskOverlay}>
            <List
              sx={{
                p: 0,
                width: "100%", // 👈 На всю ширину
                "& .MuiListItem-root": {
                  py: 0,
                  px: 1,
                  width: "100%", // 👈 На всю ширину
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
                    ref={(el) => {
                      itemRefs.current[task.id] = el
                    }}
                    style={{ width: "100%" }} // 👈 На всю ширину
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
      <Box sx={{ height: PAGINATION_HEIGHT, mt: 1, width: "100%" }}>
        {" "}
        {/* 👈 На всю ширину */}
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
