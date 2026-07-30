import { useI18n, useRuntimeConfig } from "#imports"
import { computed } from "vue"
import { useCmsListQuery } from "@shared-lib/api/hooks/useCmsListQuery"
import { buildCmsImageUrl } from "@shared-lib/composables/cmsResourceHelpers"
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import { CMS_DISPLAY_DEVICE_ENUMS } from "@shared-lib/constants/enums/cmsDisplayDevice"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"
import { resolveCmsEntranceNavigationTarget } from "./useSideMenu/resolver"
import { useOpenGame } from "./useOpenGame"
import type { CmsEntranceItem, CmsItem } from "@shared-lib/api/commonTypes/cmsTypes"

export interface CmsHomeInformationImageItem {
  id: number
  imageUrl: string
  hasEntrance: boolean
  raw: CmsItem
}

const resolveLocaleValue = (record: Record<string, string> | undefined, locale: string): string => {
  if (!record) return ""
  const normalized = locale.toLowerCase().replace("_", "-")
  const exact = Object.entries(record).find(([key]) => key.toLowerCase() === normalized)?.[1]
  if (exact) return exact
  const prefix = normalized.split("-")[0]
  const partial = Object.entries(record).find(([key]) => key.toLowerCase().startsWith(prefix))?.[1]
  if (partial) return partial
  return Object.values(record).find(Boolean) || ""
}

export function useCmsHomeInformationImage() {
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const { isDown } = useCustomBreakpoints()
  const { openGame } = useOpenGame()
  const { data, isLoading, isError } = useCmsListQuery({ type: CMS_TYPE_ENUMS.HOME_INFORMATION_IMAGE })

  const cmsResourceConfig = computed(() => ({
    apiBase: String(runtimeConfig.public.apiBase || ""),
    resourceBase: String(runtimeConfig.public.imageBase || "")
  }))

  const visibleList = computed<CmsHomeInformationImageItem[]>(() => {
    const list = data.value ?? []
    const isPhone = isDown.phone

    return list
      .filter((item) => {
        const displayDevice = item.Setting?.payload?.display_device ?? CMS_DISPLAY_DEVICE_ENUMS.NO_RESTRICTIONS
        if (displayDevice === CMS_DISPLAY_DEVICE_ENUMS.NO_RESTRICTIONS) return true
        if (displayDevice === CMS_DISPLAY_DEVICE_ENUMS.DESKTOP) return !isPhone
        if (displayDevice === CMS_DISPLAY_DEVICE_ENUMS.MOBILE) return isPhone
        return true
      })
      .map((item) => {
        const setting = item.Setting
        const imagePath = resolveLocaleValue(setting?.img_lang, String(locale.value))
        const entrance = item.Entrance?.[0]
        return {
          id: item.id,
          imageUrl: buildCmsImageUrl(imagePath, setting?.updated_time, cmsResourceConfig.value),
          hasEntrance: Boolean(entrance),
          raw: item
        }
      })
      .filter((item) => Boolean(item.imageUrl))
  })

  const handleImageClick = (item: CmsHomeInformationImageItem) => {
    const entrance = item.raw.Entrance?.[0] as CmsEntranceItem | undefined
    if (!entrance) return

    handleGlobalClick({
      target: `handleCmsHomeInformationImage${item.id}Click`,
      debounceTimer: 250,
      callback: async () => {
        if (entrance.type === CMS_ENTRANCE_TYPE_ENUMS.GAME_LINK) {
          const payload = entrance.payload || {}
          if (
            payload.integration_id !== undefined &&
            payload.product_code !== undefined &&
            payload.game_type !== undefined
          ) {
            await openGame(
              Number(payload.integration_id),
              Number(payload.product_code),
              String(payload.game_code || ""),
              Number(payload.game_type)
            )
            return
          }
        }

        const target = resolveCmsEntranceNavigationTarget(entrance)
        if (!target.to) return

        if (target.isExternal) {
          if (process.client) window.location.href = target.to
          return
        }

        await navigateTo(target.to)
      }
    })
  }

  return {
    visibleList,
    isLoading,
    isError,
    handleImageClick
  }
}
