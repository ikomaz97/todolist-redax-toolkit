import { z } from "zod"
import { TaskPriority, TaskStatus } from "@/common/enums"

export const domainTaskSchema = z.object({
  description: z.string(),
  deadline: z.string(),
  startDate: z.string(),
  title: z.string(),
  id: z.string(),
  todoListId: z.string(),
  order: z.int(),
  addedDate: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
})

export type DomainTask = z.infer<typeof domainTaskSchema>
