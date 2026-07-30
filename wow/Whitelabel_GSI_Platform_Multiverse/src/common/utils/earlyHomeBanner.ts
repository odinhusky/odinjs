import type * as Response from "src/api/response.type"

type EarlyHomeBannerState = {
  promise: Promise<Response.BannerList | null>
  result?: Response.BannerList | null
}

let earlyHomeBannerState: EarlyHomeBannerState | null = null

export function hasEarlyHomeBannerPrefetch(): boolean {
  return Boolean(earlyHomeBannerState?.promise)
}

export function setEarlyHomeBannerPrefetch(promise: Promise<Response.BannerList | null>) {
  earlyHomeBannerState = { promise, result: undefined }
  void promise.then(
    (list) => {
      if (earlyHomeBannerState) earlyHomeBannerState.result = list
    },
    () => {
      if (earlyHomeBannerState) earlyHomeBannerState.result = null
    }
  )
}

/** 同步讀取（prefetch 已 resolve 時可立刻 hydrate store） */
export function peekEarlyHomeBannerList(): Response.BannerList | null {
  const list = earlyHomeBannerState?.result
  return list?.length ? list : null
}

/** 等待 prefetch；尚未啟動或失敗則回 null */
export async function getEarlyHomeBannerList(): Promise<Response.BannerList | null> {
  if (!earlyHomeBannerState?.promise) return null

  try {
    const list = await earlyHomeBannerState.promise
    return list?.length ? list : null
  } catch {
    return null
  }
}
