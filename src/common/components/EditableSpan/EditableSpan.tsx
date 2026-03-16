// common/components/EditableSpan/EditableSpan.tsx
import { useState } from "react"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"


type Props = {
  value: string
  onChange: (newValue: string) => void
}

export const EditableSpan = ({ value, onChange }: Props) => {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(value)

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(value)
  }

  const activateViewMode = () => {
    setEditMode(false)
    if (title.trim() !== value) {
      onChange(title.trim())
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      activateViewMode()
    }
  }

  return editMode ? (
    <TextField
      value={title}
      onChange={(e) => setTitle(e.currentTarget.value)}
      onBlur={activateViewMode}
      onKeyDown={onKeyDown}
      autoFocus
      size="small"
      variant="standard"
      fullWidth
    />
  ) : (
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
      }}
    >
      {value}
    </Typography>
  )
}
