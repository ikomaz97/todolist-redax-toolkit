import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectTodolists } from "@/features/todolists/model/todolists-selectors"
import { setTodolistsAC } from "@/features/todolists/model/todolists-slice"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { useEffect } from "react"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import type { Todolist as ApiTodolist } from "@/features/todolists/api/todolistsApi.types"
import type { Todolist as ModelTodolist } from "@/features/todolists/model/todolists-slice"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)
  const dispatch = useAppDispatch()

  useEffect(() => {
    todolistsApi.getTodolists().then((res) => {
      // 🧩 Преобразуем тип с сервера в тип модели Redux
      const todolistsFromServer: ApiTodolist[] = res.data
      const todolistsForState: ModelTodolist[] = todolistsFromServer.map((t) => ({
        ...t,
        filter: "all", // добавляем обязательное поле
      }))

      // ✅ теперь типы совпадают
      dispatch(setTodolistsAC({ todolists: todolistsForState }))
    })
  }, [dispatch])

  return (
    <>
      {todolists.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
