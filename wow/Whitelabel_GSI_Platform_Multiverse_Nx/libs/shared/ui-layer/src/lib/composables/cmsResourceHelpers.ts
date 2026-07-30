export interface CmsResourceConfig {
  apiBase?: string
  resourceBase?: string
}

const removeTrailingSlash = (url: string): string => String(url || "").replace(/\/+$/, "")

const withBase = (base: string, path: string): string => {
  if (!path) return ""
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  if (!base) return path
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`
}

const withImageVersion = (url: string, updatedAt?: number | string): string => {
  const version = Number(updatedAt)
  if (!url || !Number.isFinite(version)) return url
  if (/^(data:|blob:)/i.test(url)) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}v=${version}`
}

export const rewriteCmsResourceUrl = (content: string | undefined, config: CmsResourceConfig): string => {
  const rawContent = String(content || "")
  const apiBase = removeTrailingSlash(config.apiBase || "")
  const resourceBase = removeTrailingSlash(config.resourceBase || "")

  if (!apiBase || !resourceBase) return rawContent
  return rawContent.replaceAll(apiBase, resourceBase)
}

export const buildCmsImageUrl = (
  path: string | undefined,
  updatedTime: number | string | undefined,
  config: CmsResourceConfig
): string => {
  const rawPath = String(path || "").trim()
  if (!rawPath) return ""

  return withImageVersion(withBase(removeTrailingSlash(config.resourceBase || ""), rawPath), Number(updatedTime))
}

