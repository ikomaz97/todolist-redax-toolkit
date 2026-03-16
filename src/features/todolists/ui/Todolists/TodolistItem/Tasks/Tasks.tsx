// features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks.tsx
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

type Props = {
  todolist: DomainTodolist
}

const TASKS_CONTAINER_HEIGHT = 200
const EMPTY_CONTAINER_HEIGHT = 200

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const [page, setPage] = useState(1)

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

  return (
    <Box
      sx={{
        minHeight: TASKS_CONTAINER_HEIGHT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Paper
            variant="outlined"
            sx={{
              height: EMPTY_CONTAINER_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "transparent",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No tasks
            </Typography>
          </Paper>
        </motion.div>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            bgcolor: "transparent",
            overflow: "hidden",
          }}
        >
          <DndContextWrapper items={taskIds} onDragEnd={handleDragEnd}>
            <List sx={{ p: 0 }}>
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    <TaskItem task={task} todolist={todolist} isLast={index === filteredTasks.length - 1} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          </DndContextWrapper>
        </Paper>
      )}

      {showPagination && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Box sx={{ mt: 1 }}>
            <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
          </Box>
        </motion.div>
      )}
    </Box>
  )
}
