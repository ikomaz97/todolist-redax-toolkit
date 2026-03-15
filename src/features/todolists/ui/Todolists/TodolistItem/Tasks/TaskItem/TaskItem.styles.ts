// features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.styles.ts
import type { SxProps, Theme } from "@mui/material"

export const getListItemSx = (isTaskCompleted: boolean): SxProps<Theme> => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  opacity: isTaskCompleted ? 0.5 : 1,
  p: 1,
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "#fff",
  transition: "background-color 0.2s, opacity 0.2s",

  // Исправлено: используем строковый ключ для псевдо-селектора
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
})