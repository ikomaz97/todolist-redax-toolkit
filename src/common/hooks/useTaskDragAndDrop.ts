// features/todolists/hooks/useTaskDragAndDrop.ts (обновленная версия)
import { PAGE_SIZE } from "@/common/constants"
import { useReorderTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { type DragEndEvent } from "@dnd-kit/core"
import { useEffect, useMemo, useCallback } from "react"
import { TaskStatus } from "@/common/enums"

type UseTaskDragAndDropProps = {
  todolistId: string
  items: DomainTask[]
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

  // Стабилизируем handleDragEnd через useCallback, чтобы
  // DndContextWrapper не получал новую ссылку при каждом рендере Tasks
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (!items || active.id === over?.id) return

      const activeIndex = items.findIndex((t) => t.id === active.id)
      const overIndex = over ? items.findIndex((t) => t.id === over.id) : -1
      if (activeIndex === -1) return

      let putAfterItemId: string | null
      if (overIndex === -1) {
        putAfterItemId = items[items.length - 1].id
      } else if (overIndex > activeIndex) {
        putAfterItemId = items[overIndex].id
      } else {
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
    },
    [items, todolistId, reorderTask],
  )

  const taskIds = useMemo(() => items?.map((t) => t.id) || [], [items])

  return {
    filteredTasks,
    handleDragEnd,
    taskIds,
  }
}
