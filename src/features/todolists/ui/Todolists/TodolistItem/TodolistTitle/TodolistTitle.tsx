// features/todolists/ui/Todolists/TodolistTitle/TodolistTitle.tsx
import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { useRemoveTodolistMutation, useUpdateTodolistTitleMutation } from "@/features/todolists/api/todolistsApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title } = todolist
  const [removeTodolist] = useRemoveTodolistMutation()
  const [updateTodolistTitle] = useUpdateTodolistTitleMutation()

  const removeTodolistHandler = () => {
    removeTodolist(id)
  }

  const updateTodolistTitleHandler = (title: string) => {
    const trimmedTitle = title.trim()
    if (trimmedTitle) {
      updateTodolistTitle({ id, title: trimmedTitle }) // Сохраняем полный текст
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 1,
      }}
    >
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          mr: 1,
        }}
      >
        <EditableSpan
          value={title}
          onChange={updateTodolistTitleHandler}
          maxDisplayLength={15} // 👈 Только для отображения
        />
      </Box>
      <IconButton onClick={removeTodolistHandler} size="small" sx={{ flexShrink: 0 }}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
