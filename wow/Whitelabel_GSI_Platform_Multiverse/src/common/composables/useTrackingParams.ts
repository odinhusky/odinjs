type QueryLike = Record<string, unknown>

const TRACKING_MAPPINGS = [
  { queryKey: "t360", storageKey: "t360", apiKey: "t360" },
  { queryKey: "aff", storageKey: "t360_affiliate_id", apiKey: "t360_affiliate_id" }
] as const

type ApiTrackingKey = (typeof TRACKING_MAPPINGS)[number]["apiKey"]
type TrackingParams = Partial<Record<ApiTrackingKey, string>>

export function useTrackingParams() {
  function saveFromRouteQuery(query: QueryLike) {
    TRACKING_MAPPINGS.forEach(({ queryKey, storageKey }) => {
      const value = query[queryKey]
      if (typeof value === "string") {
        sessionStorage.setItem(storageKey, value)
      }
    })
  }

  function getTrackingParams() {
    const trackingParams: TrackingParams = {}

    TRACKING_MAPPINGS.forEach(({ storageKey, apiKey }) => {
      const value = sessionStorage.getItem(storageKey)
      if (value !== null) {
        trackingParams[apiKey] = value
      }
    })

    return trackingParams
  }

  return {
    saveFromRouteQuery,
    getTrackingParams
  }
}
