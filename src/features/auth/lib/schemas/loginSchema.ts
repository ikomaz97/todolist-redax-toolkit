import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен") // сообщение для пустого поля
    .email("Неверный формат email"), // сообщение для невалидного email
  password: z.string().min(1, "Пароль обязателен"),
  rememberMe: z.boolean(),
})

export type LoginInputs = z.infer<typeof loginSchema>
