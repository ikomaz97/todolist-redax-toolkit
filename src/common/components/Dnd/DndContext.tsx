import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { memo, type ReactNode, useState } from "react"

type Props = {
  items: string[]
  onDragEnd: (event: DragEndEvent) => void
  children: ReactNode
  renderOverlay?: (activeId: string) => ReactNode
}

const DndContextWrapperComponent = ({ items, onDragEnd, children, renderOverlay }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEndWrapper = (event: DragEndEvent) => {
    setActiveId(null)
    onDragEnd(event)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndWrapper}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>

      <DragOverlay>{activeId && renderOverlay ? renderOverlay(activeId) : null}</DragOverlay>
    </DndContext>
  )
}

export const DndContextWrapper = memo(DndContextWrapperComponent)
