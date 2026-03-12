import { useEffect, useState } from "react"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"

export const useTasksPagination = (todolistId: string, pageSize = 4) => {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [todolistId, pageSize])

  const { data, isLoading, isFetching } = useGetTasksQuery({
    todolistId,
    page,
    count: pageSize,
  })

  const totalPages = Math.max(1, Math.ceil((data?.totalCount ?? 0) / pageSize))

  const next = () => {
    setPage((p) => (p < totalPages ? p + 1 : p))
  }

  const prev = () => {
    setPage((p) => (p > 1 ? p - 1 : p))
  }

  return {
    tasks: data?.items ?? [],
    page,
    totalPages,
    next,
    prev,
    isLoading,
    isFetching,
  }
}

