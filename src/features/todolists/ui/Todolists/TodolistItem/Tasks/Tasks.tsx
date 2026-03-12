import { TaskStatus } from "@/common/enums"
import { useTasksPagination } from "@/features/todolists/hooks/useTasksPagination"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import Box from "@mui/material/Box" // <-- ДОБАВИЛИ Box
import List from "@mui/material/List"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const { tasks, page, totalPages, next, prev, isLoading } = useTasksPagination(id)

  let filteredTasks = tasks
  if (filter === "active") {
    filteredTasks = filteredTasks.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
      <Box sx={{
        minHeight: {
          xs: '150px',  // мобильные
          sm: '200px',  // планшеты
          md: '250px'   // десктопы
        },
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {filteredTasks.length === 0 ? (
            <p>Тасок нет</p>
        ) : (
            <List>
              {filteredTasks.map((task) => (
                  <TaskItem key={task.id} task={task} todolist={todolist} />
              ))}
            </List>
        )}

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto', pt: 2 }}>
          <Button onClick={prev} disabled={page === 1} variant="outlined" size="small">
            ←
          </Button>
          <span>
          {page} / {totalPages}
        </span>
          <Button onClick={next} disabled={page === totalPages} variant="outlined" size="small">
            →
          </Button>
        </Stack>
      </Box>
  )
}