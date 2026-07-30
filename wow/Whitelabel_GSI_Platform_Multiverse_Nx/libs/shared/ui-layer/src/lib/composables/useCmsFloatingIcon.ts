import { useI18n, useRuntimeConfig } from "#imports"
import { computed, ref } from "vue"
import { useApiQuery } from "@shared-lib/api/useApiQuery"
import { useCmsListQuery } from "@shared-lib/api/hooks/useCmsListQuery"
import { getFloatIcon, type GetCmsFloatIconResponseType } from "@shared-lib/api/apiFunctions/cms_getFloatIcon"
import { buildCmsImageUrl } from "@shared-lib/composables/cmsResourceHelpers"
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import { CMS_DISPLAY_DEVICE_ENUMS } from "@shared-lib/constants/enums/cmsDisplayDevice"
import { FIVE_MINUTES } from "@shared-lib/constants/durationTime"
import { resolveCmsEntranceNavigationTarget, resolveCmsLang } from "./useSideMenu/resolver"
import { useOpenGame } from "./useOpenGame"
import type { ApiResponse } from "@shared-lib/api/types"
import type { CmsEntranceItem, CmsItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"

export interface CmsFloatingIconItem {
  id: number
  label: string
  iconUrl: string
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

export function useCmsFloatingIcon() {
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const { isDown } = useCustomBreakpoints()
  const { openGame } = useOpenGame()
  const isExpanded = ref(false)

  const cmsResourceConfig = computed(() => ({
    apiBase: String(runtimeConfig.public.apiBase || ""),
    resourceBase: String(runtimeConfig.public.imageBase || "")
  }))

  const { data: listData } = useCmsListQuery({ type: CMS_TYPE_ENUMS.FLOATING_ICON })

  const { data: mainIconData } = useApiQuery<typeof getFloatIcon, GetCmsFloatIconResponseType, GetCmsFloatIconResponseType>(
    ["cms-floating-icon-main"],
    getFloatIcon,
    "main",
    {
      staleTime: FIVE_MINUTES,
      select: (response: ApiResponse<GetCmsFloatIconResponseType>): GetCmsFloatIconResponseType =>
        response.data ?? { list: [] }
    }
  )

  const mainIconUrl = computed(() => {
    const list = mainIconData.value?.list ?? []
    if (!list.length) return ""
    const normalized = String(locale.value).toLowerCase().replace("_", "-")
    const exact = list.find((item) => String(item.language).toLowerCase() === normalized)
    if (exact?.storage_key) return buildCmsImageUrl(exact.storage_key, undefined, cmsResourceConfig.value)
    const prefix = normalized.split("-")[0]
    const partial = list.find((item) => String(item.language).toLowerCase().startsWith(prefix))
    if (partial?.storage_key) return buildCmsImageUrl(partial.storage_key, undefined, cmsResourceConfig.value)
    const fallback = list.find((item) => item.storage_key)
    return fallback ? buildCmsImageUrl(fallback.storage_key, undefined, cmsResourceConfig.value) : ""
  })

  const visibleList = computed<CmsFloatingIconItem[]>(() => {
    const list = listData.value ?? []
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
        const iconPath = resolveLocaleValue(setting?.icon_lang, String(locale.value))
        const label = resolveCmsLang(setting?.lang, String(locale.value))
        const entrance = item.Entrance?.[0]
        return {
          id: item.id,
          label,
          iconUrl: buildCmsImageUrl(iconPath, setting?.updated_time, cmsResourceConfig.value),
          hasEntrance: Boolean(entrance),
          raw: item
        }
      })
  })

  const hasContent = computed(() => visibleList.value.length > 0 || Boolean(mainIconUrl.value))

  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
  }

  const collapse = () => {
    isExpanded.value = false
  }

  const handleItemClick = (item: CmsFloatingIconItem) => {
    const entrance = item.raw.Entrance?.[0] as CmsEntranceItem | undefined
    if (!entrance) return

    handleGlobalClick({
      target: `handleCmsFloatingIcon${item.id}Click`,
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
            collapse()
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
        collapse()
      }
    })
  }

  return {
    mainIconUrl,
    visibleList,
    hasContent,
    isExpanded,
    toggleExpand,
    collapse,
    handleItemClick
  }
}
