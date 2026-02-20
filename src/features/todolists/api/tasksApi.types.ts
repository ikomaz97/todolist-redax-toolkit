import { TaskPriority, TaskStatus } from "@/common/enums"

/* 📌 Таска */
export type DomainTask = {
    description: string | null
    deadline: string | null
    startDate: string | null

    title: string
    status: TaskStatus
    priority: TaskPriority

    id: string
    todoListId: string
    order: number
    addedDate: string
}

/* 📌 Ответ от сервера */
export type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: DomainTask[]
}

/* 📌 Модель обновления */
export type UpdateTaskModel = {
    title: string
    description: string | null
    status: TaskStatus
    priority: TaskPriority
    startDate: string | null
    deadline: string | null
}
