// features/todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination.tsx
import { PAGE_SIZE } from "@/common/constants"
import Pagination from "@mui/material/Pagination"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { ChangeEvent } from "react"

type Props = {
  totalCount: number
  page: number
  setPage: (page: number) => void
}

export const TasksPagination = ({ totalCount, page, setPage }: Props) => {
  const pageCount = Math.ceil(totalCount / PAGE_SIZE)

  const changePage = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  if (pageCount <= 1) return null

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        mt: 2,
        width: "100%",
      }}
    >
      <Pagination
        count={pageCount}
        page={page}
        onChange={changePage}
        variant="outlined"
        color="primary"
        size="small"
        sx={{
          "& .MuiPagination-ul": {
            justifyContent: "center",
          },
        }}
      />

      <Typography variant="caption" color="text.secondary">
        Всего: {totalCount} {getTaskWord(totalCount)}
      </Typography>
    </Box>
  )
}

// Функция для правильного склонения слова "задача"
const getTaskWord = (count: number): string => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "задач"
  }

  if (lastDigit === 1) {
    return "задача"
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "задачи"
  }

  return "задач"
}
