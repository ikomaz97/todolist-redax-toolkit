// src/features/auth/lib/schemas.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Incorrect email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(3, "Password must be at least 3 characters long"),

  rememberMe: z.boolean().optional(),

  captcha: z.string().optional(),
})

export type LoginInputs = z.infer<typeof loginSchema>