// common/components/CreateItemForm/CreateItemForm.tsx
import { type ChangeEvent, type KeyboardEvent, useState } from "react"
import TextField from "@mui/material/TextField"
import AddBoxIcon from "@mui/icons-material/AddBox"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

type Props = {
  onCreateItem: (title: string) => Promise<void> | void
  disabled?: boolean
  placeholder?: string
}

export const CreateItemForm = ({ onCreateItem, disabled = false, placeholder = "Enter a title" }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const createItemHandler = async () => {
    const trimmedTitle = title.trim()

    if (trimmedTitle === "") {
      setError("Title is required")
      return
    }

    if (disabled || isAdding) {
      setError("Please wait, adding in progress...")
      return
    }

    setError(null)
    setIsAdding(true)

    try {
      await onCreateItem(trimmedTitle)
      setTitle("")
    } catch (error) {
      setError("Failed to create item. Try again.")
      console.error("Create item error:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
    if (error) setError(null)
  }

  const createItemOnEnterHandler = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await createItemHandler() // 👈 Добавили await
    }
  }

  const isButtonDisabled = disabled || isAdding || !title.trim()

  const getTooltipText = () => {
    if (disabled || isAdding) return "Adding in progress..."
    if (!title.trim()) return "Enter a title"
    return "Add item"
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <TextField
        size="small"
        variant="outlined"
        value={title}
        onChange={changeTitleHandler}
        onKeyDown={createItemOnEnterHandler}
        error={!!error}
        helperText={error}
        disabled={disabled || isAdding}
        placeholder={placeholder}
        fullWidth
        sx={{ flex: 1 }}
      />

      <Tooltip title={getTooltipText()} arrow>
        <span>
          <IconButton
            onClick={() => createItemHandler()} // 👈 Оборачиваем в функцию
            disabled={isButtonDisabled}
            color="primary"
            size="large"
            sx={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                transform: "scale(1.1)",
                transition: "transform 0.2s",
              },
            }}
          >
            {isAdding ? <CircularProgress size={24} /> : <AddBoxIcon />}
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}
