import { useAppSelector } from "@/common/hooks"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const tasks = useAppSelector((state) => state.tasks[todolist.id] ?? [])

  // ✅ если массива нет — используем пустой
  const filteredTasks = tasks.filter((t) => {
    if (todolist.filter === "active") return !t.isDone
    if (todolist.filter === "completed") return t.isDone
    return true
  })

  // ✅ безопасный рендер с проверкой
  if (!filteredTasks?.length) {
    return <p>Тасок нет</p>
  }

  return (
    <List>
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} todolistId={todolist.id} />
      ))}
    </List>
  )
}
