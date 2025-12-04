export { createAppSlice } from "./createAppSlice"
export { handleServerAppError } from "./handleServerAppError"
export { handleServerNetworkError } from "./handleServerNetworkError"

// Compare this snippet from src/common/utils/validateEmail.ts:
// export const validateEmail = (email: string): boolean => {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   return re.test(String(email).toLowerCase())
// }
