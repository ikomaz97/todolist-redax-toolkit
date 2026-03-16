// features/todolists/hooks/useTaskDragAndDrop.ts
import { PAGE_SIZE } from "@/common/constants"
import { useReorderTaskMutation } from "@/features/todolists/api/tasksApi"
import { DragEndEvent } from "@dnd-kit/core"
import {  useEffect, useMemo } from "react"
import { TaskStatus } from "@/common/enums"

type UseTaskDragAndDropProps = {
  todolistId: string
  items: any[] // Замените на правильный тип DomainTask[]
  totalCount: number
  page: number
  setPage: (page: number) => void
  filter: string
}

export const useTaskDragAndDrop = ({
  todolistId,
  items,
  totalCount,
  page,
  setPage,
  filter,
}: UseTaskDragAndDropProps) => {
  const [reorderTask] = useReorderTaskMutation()

  // Эффект для сброса страницы
  useEffect(() => {
    if (page > 1 && items?.length === 0 && totalCount > 0) {
      const maxPage = Math.ceil(totalCount / PAGE_SIZE)
      if (page > maxPage) {
        setPage(maxPage)
      }
    }
    if (totalCount === 0 && page !== 1) {
      setPage(1)
    }
  }, [items, totalCount, page, setPage])

  // Фильтрация задач
  const filteredTasks = useMemo(() => {
    if (!items) return []

    if (filter === "active") {
      return items.filter((task) => task.status === TaskStatus.New)
    } else if (filter === "completed") {
      return items.filter((task) => task.status === TaskStatus.Completed)
    }

    return items
  }, [items, filter])

  // Обработчик перетаскивания
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!items || active.id === over?.id) return

    // Находим индексы
    const activeIndex = items.findIndex((t) => t.id === active.id)
    const overIndex = over ? items.findIndex((t) => t.id === over.id) : -1

    if (activeIndex === -1) return

    // Определяем putAfterItemId для API
    let putAfterItemId: string | null = null

    if (overIndex === -1) {
      // Перемещаем в конец
      putAfterItemId = items[items.length - 1].id
    } else if (overIndex > activeIndex) {
      // Перемещаем вниз
      putAfterItemId = items[overIndex].id
    } else {
      // Перемещаем вверх
      putAfterItemId = overIndex > 0 ? items[overIndex - 1].id : null
    }

    try {
      await reorderTask({
        todolistId,
        taskId: active.id as string,
        putAfterItemId,
      }).unwrap()
    } catch (error) {
      console.error("Reorder failed:", error)
    }
  }

  return {
    filteredTasks,
    handleDragEnd,
    taskIds: useMemo(() => items?.map((t) => t.id) || [], [items]),
  }
}
