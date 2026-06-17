// features/todolists/ui/Todolists/TodolistItem/AddTaskForm/AddTaskForm.tsx
// Вынесен в отдельный компонент, чтобы isLoading от мутации
// не вызывал ререндер всего TodolistItem и его дочерних компонентов (Tasks, FilterButtons и т.д.)
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTaskMutation } from "@/features/todolists/api/tasksApi"
import { useCallback } from "react"

type Props = {
  todolistId: string
}

export const AddTaskForm = ({ todolistId }: Props) => {
  const [addTask, { isLoading }] = useAddTaskMutation()

  const createTask = useCallback(
    async (title: string) => {
      try {
        await addTask({
          todolistId,
          title,
        }).unwrap()
      } catch (error) {
        console.error("Failed to add task:", error)
      }
    },
    [todolistId, addTask],
  )

  return <CreateItemForm onCreateItem={createTask} disabled={isLoading} placeholder="Enter a task title" />
}

