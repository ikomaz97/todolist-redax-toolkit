// common/components/Dnd/DndContext.tsx
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ReactNode } from "react"

type DndContextProps = {
  items: string[]
  onDragEnd: (event: DragEndEvent) => void
  onDragStart?: (event: DragStartEvent) => void
  onDragOver?: (event: DragOverEvent) => void
  children: ReactNode
  strategy?: typeof verticalListSortingStrategy
  disabled?: boolean
}

export const DndContextWrapper = ({
  items,
  onDragEnd,
  onDragStart,
  onDragOver,
  children,
  strategy = verticalListSortingStrategy,
  disabled = false,
}: DndContextProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Минимальное расстояние для начала перетаскивания
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (disabled) {
    return <>{children}</>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items} strategy={strategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
