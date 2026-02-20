import { TaskStatus } from "@/common/enums"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"

import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
    const { id, filter } = todolist

    // ✅ RTK Query сам загружает таски
    const { data, isLoading } = useGetTasksQuery(id)

    // если ещё грузится
    if (isLoading) {
        return <p>Загрузка...</p>
    }

    // таски из ответа
    let filteredTasks = data?.items ?? []

    // фильтрация
    if (filter === "active") {
        filteredTasks = filteredTasks.filter((task) => task.status === TaskStatus.New)
    }

    if (filter === "completed") {
        filteredTasks = filteredTasks.filter((task) => task.status === TaskStatus.Completed)
    }

    return (
        <>
            {filteredTasks.length === 0 ? (
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
