// src/features/auth/api/authApi.types.ts
export type LoginArgs = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
}