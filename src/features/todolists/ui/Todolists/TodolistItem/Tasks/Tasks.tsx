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
import { useTaskDragAndDrop } from "@/common/hooks/useTaskDragAndDrop.ts"


type Props = {
  todolist: DomainTodolist
}

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
    <>
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <DndContextWrapper items={taskIds} onDragEnd={handleDragEnd}>
          <List>
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} todolist={todolist} />
            ))}
          </List>
        </DndContextWrapper>
      )}

      {showPagination && <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />}
    </>
  )
}
