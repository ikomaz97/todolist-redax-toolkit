import { setAppErrorAC } from "@/app/app-slice"
import { ResultCode } from "@/common/enums"
import { isErrorWithMessage } from "./isErrorWithMessage"
import { BaseQueryApi, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query/react"

// Type guard для проверки структуры ответа API
const isApiErrorResponse = (data: unknown): data is { resultCode: ResultCode; messages: string[] } => {
  return typeof data === "object" &&
    data !== null &&
    "resultCode" in data &&
    "messages" in data &&
    Array.isArray((data as any).messages)
}

export const handleError = (
  api: BaseQueryApi,
  result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
) => {
  let error = "Some error occurred"

  if (result.error) {
    switch (result.error.status) {
      case "FETCH_ERROR":
      case "PARSING_ERROR":
      case "CUSTOM_ERROR":
        error = result.error.error
        break
      case 403:
        error = "403 Forbidden Error. Check API-KEY"
        break
      case 400:
        if (isErrorWithMessage(result.error.data)) {
          error = result.error.data.message
        } else {
          error = JSON.stringify(result.error.data)
        }
        break
      default: {
        const status = result.error.status
        if (typeof status === "number" && status >= 500 && status < 600) {
          error = "Server error occurred. Please try again later."
        } else {
          error = JSON.stringify(result.error)
        }
        break
      }
    }

    api.dispatch(setAppErrorAC({ error }))
  }

  // Проверка на ошибки приложения (когда HTTP статус 200, но resultCode = 1)
  if (isApiErrorResponse(result.data) && result.data.resultCode === ResultCode.Error) {
    error = result.data.messages.length ? result.data.messages[0] : error
    api.dispatch(setAppErrorAC({ error }))
  }
}