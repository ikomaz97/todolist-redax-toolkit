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
import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"

type Props = {
  items: string[]
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
}

export const DndContextWrapper = ({ items, children, onDragEnd }: Props) => {
  const [activeItem, setActiveItem] = useState<any>(null)
  const [activeSize, setActiveSize] = useState<{ width: number; height: number } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current
    if (data) {
      setActiveItem(data)
    }

    const initialRect = event.active.rect.current.initial
    if (initialRect) {
      setActiveSize({ width: initialRect.width, height: initialRect.height })
    } else {
      setActiveSize(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null)
    setActiveSize(null)
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
        {activeItem && (
          <Paper
            sx={{
              px: 2,
              py: 1,
              boxShadow: 4,
              borderRadius: 1,
              minWidth: 200,
              backgroundColor: "white",
              border: "2px solid",
              borderColor: "primary.main",
              ...(activeSize
                ? {
                    width: `${activeSize.width}px`,
                    height: `${activeSize.height}px`,
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }
                : null),
            }}
          >
            {activeItem.type === "task" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Checkbox checked={activeItem.task.status === 1} readOnly size="small" />
                <Typography>{activeItem.task.title}</Typography>
              </Box>
            )}
            {activeItem.type === "todolist" && <Typography variant="h6">{activeItem.todolist.title}</Typography>}
          </Paper>
        )}
      </DragOverlay>
    </DndContext>
  )
}
