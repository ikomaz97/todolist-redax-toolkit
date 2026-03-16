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

  const getTaskWord = (count: number): string => {
    if (count === 1) return "task"
    return "tasks"
  }

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
        Total: {totalCount} {getTaskWord(totalCount)}
      </Typography>
    </Box>
  )
}
