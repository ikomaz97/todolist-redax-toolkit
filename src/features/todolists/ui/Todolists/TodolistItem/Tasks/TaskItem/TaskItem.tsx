import { ListItem, Checkbox } from "@mui/material"
import { EditableSpan } from "@/common/components/EditableSpan"
import { useAppDispatch } from "@/common/hooks"
import { deleteTaskAC, changeTaskStatusAC, changeTaskTitleAC } from "@/features/todolists/model/tasks-slice"
import { DomainTask, TaskStatus } from "@/features/todolists/api/DomainTasksApi"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = ({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch()

  const isTaskCompleted = task.status === TaskStatus.Completed

  const changeTaskStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeTaskStatusAC({ todolistId, taskId: task.id, isDone: e.currentTarget.checked }))
  }

  const changeTaskTitle = (title: string) => {
    dispatch(changeTaskTitleAC({ todolistId, taskId: task.id, title }))
  }

  const deleteTask = () => {
    dispatch(deleteTaskAC({ todolistId, taskId: task.id }))
  }

  return (
    <ListItem
      sx={{
        display: "flex",
        justifyContent: "space-between",
        textDecoration: isTaskCompleted ? "line-through" : "none",
        opacity: isTaskCompleted ? 0.6 : 1,
      }}
    >
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <button onClick={deleteTask}>🗑</button>
    </ListItem>
  )
}
