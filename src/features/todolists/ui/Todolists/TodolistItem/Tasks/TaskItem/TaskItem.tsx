// features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.tsx
import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { useRemoveTaskMutation, useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"
import type { DomainTask } from "@/features/todolists/api/tasksApi.types"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import { createTaskModel } from "@/features/todolists/lib/utils"
import DeleteIcon from "@mui/icons-material/Delete"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Box from "@mui/material/Box"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
  isLast?: boolean
}

export const TaskItem = ({ task, todolist, isLast = false }: Props) => {
  const [removeTask] = useRemoveTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const deleteTask = () => {
    removeTask({ todolistId: todolist.id, taskId: task.id })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    const model = createTaskModel(task, { status })
    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const changeTaskTitle = (title: string) => {
    const model = createTaskModel(task, { title })
    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed

  return (
    <div ref={setNodeRef} style={style}>
      <ListItem
        sx={{
          ...getListItemSx(isTaskCompleted),
          borderBottom: isLast ? "none" : "1px solid",
          borderColor: "divider",
          px: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 0, // Важно для ограничения текста
          }}
        >
          <Box
            {...attributes}
            {...listeners}
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 0.5,
              cursor: "grab",
              flexShrink: 0,
              "&:active": { cursor: "grabbing" },
            }}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>

          <Checkbox
            checked={isTaskCompleted}
            onChange={changeTaskStatus}
            size="small"
            sx={{
              flexShrink: 0,
              p: 0.5,
            }}
          />

          <Box
            sx={{
              flex: 1,
              minWidth: 0, // Важно для ограничения текста
              ml: 0.5,
            }}
          >
            <EditableSpan value={task.title} onChange={changeTaskTitle} />
          </Box>
        </Box>

        <IconButton
          onClick={deleteTask}
          size="small"
          sx={{
            flexShrink: 0,
            ml: 0.5,
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItem>
    </div>
  )
}
