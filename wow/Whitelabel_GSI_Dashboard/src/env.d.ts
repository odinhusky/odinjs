/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: "hash" | "history" | "abstract" | undefined
    VUE_ROUTER_BASE: string | undefined
  }
}

interface ImportMeta {
  glob<T = unknown>(
    pattern: string,
    options?: {
      eager?: boolean
      import?: string
      as?: string
      query?: string
    }
  ): Record<string, T>
}
