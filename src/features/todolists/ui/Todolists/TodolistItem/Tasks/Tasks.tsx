import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"
import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton"
import { setAppErrorAC } from "@/app/app-slice"
import { useAppDispatch } from "@/common/hooks" // ← нужно добавить импорт
import { useEffect } from "react" // ← нужно добавить импорт

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
    const dispatch = useAppDispatch() // ← нужно объявить dispatch

    const { data, isLoading, error } = useGetTasksQuery(todolist.id) // ← isError можно не использовать, достаточно error

    // Правильная обработка ошибки с type guard
    useEffect(() => {
        if (!error) return

        // Проверяем тип ошибки через type guard
        if ('status' in error) {
            // Это FetchBaseQueryError
            const errMsg = 'error' in error
                ? error.error // строковая ошибка (например, "FETCH_ERROR")
                : JSON.stringify(error.data) // сериализуем данные ошибки с сервера
            dispatch(setAppErrorAC({ error: errMsg }))
        } else {
            // Это SerializedError
            dispatch(setAppErrorAC({ error: error.message || 'Some error occurred' }))
        }
    }, [error, dispatch]) // ← добавляем зависимости

    // Фильтрация задач (если нужна)
    let filteredTasks = data?.items

    // Показываем скелетон во время загрузки
    if (isLoading) {
        return <TasksSkeleton />
    }

    return (
        <>
            {!filteredTasks || filteredTasks.length === 0 ? (
                <p>Тасок нет</p>
            ) : (
                <List>
                    {filteredTasks.map((task) => (
                        <TaskItem key={task.id} task={task} todolist={todolist} />
                    ))}
                </List>
            )}
        </>
    )
}