// common/components/EditableSpan/EditableSpan.tsx
import { useState } from "react"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import Tooltip from "@mui/material/Tooltip"

type Props = {
  value: string
  onChange: (newValue: string) => void
  maxDisplayLength?: number // 👈 Переименовал для ясности
}

export const EditableSpan = ({ value, onChange, maxDisplayLength = 10 }: Props) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(value)

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(value) // В режиме редактирования показываем полный текст
  }

  const activateViewMode = () => {
    setEditMode(false)
    const trimmedTitle = title.trim()
    if (trimmedTitle && trimmedTitle !== value) {
      onChange(trimmedTitle) // Сохраняем полный текст
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      activateViewMode()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value
    setTitle(newValue) // Нет ограничения на ввод!
  }

  // Только для отображения обрезаем текст
  const displayValue = value.length > maxDisplayLength ? `${value.slice(0, maxDisplayLength)}...` : value

  return editMode ? (
    <Box sx={{ width: "100%" }}>
      <TextField
        value={title}
        onChange={handleChange}
        onBlur={activateViewMode}
        onKeyDown={onKeyDown}
        autoFocus
        size="small"
        variant="standard"
        fullWidth
        inputProps={{
          style: { fontSize: "0.875rem" },
        }}
        // Убрали helperText с счетчиком
      />
    </Box>
  ) : (
    <Tooltip title={value} arrow disableHoverListener={value.length <= maxDisplayLength}>
      <Typography
        variant="body2"
        onDoubleClick={activateEditMode}
        sx={{
          cursor: "pointer",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          display: "block",
          fontSize: "0.875rem",
          py: 0.5,
        }}
      >
        {displayValue}
      </Typography>
    </Tooltip>
  )
}
