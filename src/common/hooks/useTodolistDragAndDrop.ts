// features/todolists/hooks/useTodolistDragAndDrop.ts
import { useReorderTodolistMutation } from "@/features/todolists/api/todolistsApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { DragEndEvent } from "@dnd-kit/core"
import { useMemo } from "react"

type UseTodolistDragAndDropProps = {
  todolists: DomainTodolist[]
}

export const useTodolistDragAndDrop = ({ todolists }: UseTodolistDragAndDropProps) => {
  const [reorderTodolist] = useReorderTodolistMutation()

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!todolists || active.id === over?.id) return

    const activeIndex = todolists.findIndex((t) => t.id === active.id)
    const overIndex = over ? todolists.findIndex((t) => t.id === over.id) : -1

    if (activeIndex === -1) return

    let putAfterItemId: string | null // Убрали инициализацию = null

    if (overIndex === -1) {
      // В конец списка
      putAfterItemId = todolists[todolists.length - 1].id
    } else if (overIndex > activeIndex) {
      // Перемещаем вниз
      putAfterItemId = todolists[overIndex].id
    } else {
      // Перемещаем вверх
      putAfterItemId = overIndex > 0 ? todolists[overIndex - 1].id : null
    }

    try {
      await reorderTodolist({
        todolistId: active.id as string,
        putAfterItemId,
      }).unwrap()
    } catch (error) {
      console.error("Reorder todolist failed:", error)
    }
  }

  return {
    handleDragEnd,
    todolistIds: useMemo(() => todolists.map((t) => t.id), [todolists]),
  }
}
