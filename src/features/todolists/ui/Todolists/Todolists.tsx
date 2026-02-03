import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"

export const Todolists = () => {
    // Запрос выполняется автоматически при маунте компонента
    const { data: todolists, refetch } = useGetTodolistsQuery()

    return (
        <>
            <div>
                <button onClick={refetch}>Получить свежие данные</button>
            </div>
            {todolists?.map((todolist) => (
                <Grid key={todolist.id}>
                    <Paper sx={{ p: "0 20px 20px 20px" }}>
                        <TodolistItem todolist={todolist} />
                    </Paper>
                </Grid>
            ))}
        </>
    )
}