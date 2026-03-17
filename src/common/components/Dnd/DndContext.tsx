import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

import { ReactNode, useState } from "react"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

type Props = {
  items: string[]
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
}

export const DndContextWrapper = ({ items, children, onDragEnd }: Props) => {
  const [activeTitle, setActiveTitle] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const element = event.active.data.current as any

    if (element?.task?.title) {
      setActiveTitle(element.task.title)
    } else if (element?.todolist?.title) {
      setActiveTitle(element.todolist.title)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTitle(null)
    onDragEnd(event)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>

      <DragOverlay>
        {activeTitle ? (
          <Paper
            sx={{
              px: 2,
              py: 1,
              boxShadow: 4,
              borderRadius: 1,
            }}
          >
            <Typography>{activeTitle}</Typography>
          </Paper>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
