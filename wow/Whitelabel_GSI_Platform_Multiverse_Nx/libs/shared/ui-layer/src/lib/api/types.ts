import type { Router } from "vue-router"

export interface ApiResponse<T = any> {
  data: T
  code: number
  msg?: string
  status: boolean
  excode?: string
  error?:
    | {
        code?: number
        message?: string
      }
    | any
}

export interface ErrorHandlerDependencies {
  resetAuth: () => void
  t: (key: string, ...args: any[]) => string
  te: (key: string, locale?: string) => boolean
  router: Router
  notify?: (message: string) => void
}
