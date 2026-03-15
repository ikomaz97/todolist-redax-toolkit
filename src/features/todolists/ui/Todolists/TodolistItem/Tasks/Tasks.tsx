// features/todolists/ui/Todolists/TodolistItem/Tasks/Tasks.tsx
import { TaskStatus } from "@/common/enums";
import List from "@mui/material/List";
import { TaskItem } from "./TaskItem/TaskItem";
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton";
import { useState, useEffect, useMemo } from "react";
import { useGetTasksQuery, useReorderTaskMutation } from "@/features/todolists/api/tasksApi";
import type { DomainTodolist } from "@/features/todolists/lib/types";
import { TasksPagination } from "./TasksPagination";
import { PAGE_SIZE } from "@/common/constants"
import { TasksDndContext } from "./TasksDndContext";
import { DragEndEvent } from '@dnd-kit/core';


type Props = {
  todolist: DomainTodolist;
};

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetTasksQuery({
    todolistId: id,
    params: { page, count: PAGE_SIZE },
  })

  const [reorderTask] = useReorderTaskMutation()

  // Эффект для сброса страницы
  useEffect(() => {
    if (page > 1 && data?.items?.length === 0 && data?.totalCount > 0) {
      const maxPage = Math.ceil(data.totalCount / PAGE_SIZE)
      if (page > maxPage) {
        setPage(maxPage)
      }
    }
    if (data?.totalCount === 0 && page !== 1) {
      setPage(1)
    }
  }, [data?.items, data?.totalCount, page])

  // Получаем ID задач для SortableContext
  const taskIds = useMemo(() => {
    if (!data?.items) return []
    return data.items.map(t => t.id)
  }, [data?.items])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    console.log('Drag ended:', { activeId: active.id, overId: over?.id })

    if (!data?.items) {
      console.log('No data items available')
      return
    }

    if (active.id === over?.id) {
      console.log('Same position, no change')
      return
    }

    // Находим индексы
    const activeIndex = data.items.findIndex(t => t.id === active.id)
    const overIndex = over ? data.items.findIndex(t => t.id === over.id) : -1

    console.log('Indices:', { activeIndex, overIndex, totalItems: data.items.length })

    if (activeIndex === -1) {
      console.log('Active task not found')
      return
    }

    // Определяем putAfterItemId для API
    let putAfterItemId: string | null = null

    if (overIndex === -1) {
      putAfterItemId = data.items[data.items.length - 1].id
    } else if (overIndex > activeIndex) {
      putAfterItemId = data.items[overIndex].id
    } else {
      putAfterItemId = overIndex > 0 ? data.items[overIndex - 1].id : null
    }

    console.log('Sending to API:', {
      todolistId: id,
      taskId: active.id,
      putAfterItemId
    })

    try {
      // Отправляем запрос на сервер - полагаемся на invalidatesTags для обновления
      const result = await reorderTask({
        todolistId: id,
        taskId: active.id as string,
        putAfterItemId,
      }).unwrap()

      console.log('Reorder successful:', result)

    } catch (error) {
      console.error('Reorder failed:', error)
    }
  }

  // Фильтруем задачи
  const filteredTasks = useMemo(() => {
    if (!data?.items) return []

    let tasks = data.items

    if (filter === "active") {
      tasks = tasks.filter((task) => task.status === TaskStatus.New)
    } else if (filter === "completed") {
      tasks = tasks.filter((task) => task.status === TaskStatus.Completed)
    }

    return tasks
  }, [data?.items, filter])

  const showPagination = (data?.totalCount || 0) > PAGE_SIZE

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <TasksDndContext
          items={taskIds}
          onDragEnd={handleDragEnd}
        >
          <List>
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                todolist={todolist}
              />
            ))}
          </List>
        </TasksDndContext>
      )}

      {showPagination && (
        <TasksPagination
          totalCount={data?.totalCount || 0}
          page={page}
          setPage={setPage}
        />
      )}
    </>
  )
}