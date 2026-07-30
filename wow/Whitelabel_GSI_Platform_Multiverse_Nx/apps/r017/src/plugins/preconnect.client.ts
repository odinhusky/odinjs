const PRECONNECT_LINK_ATTR = "data-runtime-preconnect"

const toOrigin = (value: unknown): string => {
  if (!value) return ""

  try {
    return new URL(String(value)).origin
  } catch {
    return ""
  }
}

const ensureResourceHint = (rel: "dns-prefetch" | "preconnect", href: string) => {
  const selector = `link[rel="${rel}"][href="${href}"]`
  if (document.head.querySelector(selector)) return

  const link = document.createElement("link")
  link.rel = rel
  link.href = href
  link.setAttribute(PRECONNECT_LINK_ATTR, "true")

  if (rel === "preconnect") {
    link.setAttribute("crossorigin", "")
  }

  document.head.appendChild(link)
}

export default defineNuxtPlugin({
  name: "runtime-preconnect",
  setup() {
    const runtimeConfig = useRuntimeConfig()
    const imageBaseOrigin = toOrigin(runtimeConfig.public.imageBase)
    if (!imageBaseOrigin) return

    ensureResourceHint("dns-prefetch", imageBaseOrigin)
    ensureResourceHint("preconnect", imageBaseOrigin)
  }
})
