import { useI18n, useRuntimeConfig } from "#imports"
import { computed } from "vue"
import { useCmsListQuery } from "@shared-lib/api/hooks/useCmsListQuery"
import { buildCmsImageUrl } from "@shared-lib/composables/cmsResourceHelpers"
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import { CMS_ENTRANCE_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsEntranceType"
import type { CmsEntranceItem, CmsItem } from "@shared-lib/api/commonTypes/cmsTypes"
import { resolveCmsEntranceNavigationTarget, resolveCmsLang } from "./useSideMenu/resolver"
import { useOpenGame } from "./useOpenGame"

export interface CmsContactUsItem {
  id: number
  title: string
  contactImageUrl: string
  contactText: string
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

export function useCmsContactUs() {
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const { data, isLoading, isError } = useCmsListQuery({ type: CMS_TYPE_ENUMS.CONTACT_US })
  const { openGame } = useOpenGame()

  const cmsResourceConfig = computed(() => ({
    apiBase: String(runtimeConfig.public.apiBase || ""),
    resourceBase: String(runtimeConfig.public.imageBase || "")
  }))

  const contactList = computed<CmsContactUsItem[]>(() => {
    const list = data.value ?? []
    return list.map((item) => {
      const setting = item.Setting
      const localeStr = String(locale.value)
      const title = resolveCmsLang(setting?.lang, localeStr)
      const contactImagePath = resolveLocaleValue(setting?.contact_img_lang, localeStr)
      const contactText = resolveLocaleValue(setting?.contact_lang, localeStr)
      const entrance = item.Entrance?.[0]
      return {
        id: item.id,
        title,
        contactImageUrl: buildCmsImageUrl(contactImagePath, setting?.updated_time, cmsResourceConfig.value),
        contactText,
        hasEntrance: Boolean(entrance),
        raw: item
      }
    })
  })

  const handleItemClick = (item: CmsContactUsItem) => {
    const entrance = item.raw.Entrance?.[0] as CmsEntranceItem | undefined
    if (!entrance) return

    handleGlobalClick({
      target: `handleCmsContactUs${item.id}Click`,
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
          if (!process.client) return
          window.location.href = target.to
          return
        }

        await navigateTo(target.to)
      }
    })
  }

  return {
    contactList,
    isLoading,
    isError,
    handleItemClick
  }
}
