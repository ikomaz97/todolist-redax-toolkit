// common/components/Dnd/SortableItem.tsx
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { memo, type ReactNode } from "react"

type SortableItemProps = {
  id: string
  children: ReactNode
  data?: Record<string, unknown>
  disabled?: boolean
}

const SortableItemComponent = ({ id, children, data, disabled = false }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data,
    disabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export const SortableItem = memo(SortableItemComponent)
