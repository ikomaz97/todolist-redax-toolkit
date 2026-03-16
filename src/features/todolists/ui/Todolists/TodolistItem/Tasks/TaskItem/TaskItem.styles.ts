// features/todolists/ui/Todolists/TodolistItem/Tasks/TaskItem/TaskItem.styles.ts
import type { SxProps, Theme } from "@mui/material"

export const getListItemSx = (isTaskCompleted: boolean): SxProps<Theme> => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  opacity: isTaskCompleted ? 0.5 : 1,
  px: 2,
  py: 0,
  height: 48,
  backgroundColor: "#fff",
  transition: "background-color 0.2s, opacity 0.2s",

  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
})
