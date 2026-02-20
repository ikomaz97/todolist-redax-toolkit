import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useCreateTaskMutation } from "@/features/todolists/api/tasksApi"

type Props = {
    todolist: DomainTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
    const [createTask] = useCreateTaskMutation()

    const handleCreateTask = async (title: string) => {
        await createTask({ todolistId: todolist.id, title })
        // RTK Query автоматически обновит список через invalidatesTags
    }

    return (
        <div>
            <TodolistTitle todolist={todolist} />
            <CreateItemForm
                onCreateItem={handleCreateTask}
                disabled={todolist.entityStatus === "loading"}
            />
            <Tasks todolist={todolist} />
            <FilterButtons todolist={todolist} />
        </div>
    )
}
