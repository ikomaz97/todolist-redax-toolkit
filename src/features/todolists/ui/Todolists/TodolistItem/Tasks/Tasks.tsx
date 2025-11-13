import { useEffect } from "react"
import List from "@mui/material/List"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { selectTasks, fetchTasksTC } from "@/features/todolists/model/tasks-slice"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"
import { TaskItem } from "./TaskItem/TaskItem"
import { TaskStatus } from "@/common/enums"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist
  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  // 📦 Загружаем задачи при монтировании
  useEffect(() => {
    dispatch(fetchTasksTC(id))
  }, [dispatch, id])

  const todolistTasks = tasks[id] ?? []

  // 🔍 Фильтрация задач по статусу
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.status === TaskStatus.Completed)
  }

  return (
    <>
      {filteredTasks.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} todolistId={id} />
          ))}
        </List>
      )}
    </>
  )
}
