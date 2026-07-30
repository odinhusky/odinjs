import { useI18n, useRuntimeConfig } from "#imports"
import { computed, toValue, type MaybeRefOrGetter } from "vue"
import { useCmsListQuery } from "@shared-lib/api/hooks/useCmsListQuery"
import { rewriteCmsResourceUrl } from "@shared-lib/composables/cmsResourceHelpers"
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import { toWebInformationCmsRoute } from "@shared-lib/constants/routePath"
import type { CmsItem, CmsPageItem } from "@shared-lib/api/commonTypes/cmsTypes"

export interface CmsWebInformationTab {
  urlId: number | string
  label: string
  to: string
  isActive: boolean
}

const resolveLocalizedPage = (pages: CmsPageItem[] | undefined, locale: string): CmsPageItem | null => {
  if (!pages?.length) return null
  const normalized = locale.toLowerCase().replace("_", "-")
  const exact = pages.find((p) => String(p.lang).toLowerCase() === normalized)
  if (exact) return exact
  const prefix = normalized.split("-")[0]
  const partial = pages.find((p) => String(p.lang).toLowerCase().startsWith(prefix))
  if (partial) return partial
  return pages.find((p) => p.content) ?? pages[0] ?? null
}

const findItemByUrlIdOrId = (list: CmsItem[], urlId: number | string): CmsItem | null => {
  const target = String(urlId)
  if (!target) return null
  const byUrlId = list.find((item) => String(item.url_id) === target)
  if (byUrlId) return byUrlId
  const byId = list.find((item) => String(item.id) === target)
  return byId ?? null
}

export function useCmsWebInformationPage(urlId: MaybeRefOrGetter<number | string>) {
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const { data, isLoading, isError } = useCmsListQuery({ type: CMS_TYPE_ENUMS.WEBSITE_INFORMATION })

  const cmsResourceConfig = computed(() => ({
    apiBase: String(runtimeConfig.public.apiBase || ""),
    resourceBase: String(runtimeConfig.public.imageBase || "")
  }))

  const matchedItem = computed(() => {
    const list = data.value ?? []
    return findItemByUrlIdOrId(list, toValue(urlId))
  })

  const tabs = computed<CmsWebInformationTab[]>(() => {
    const list = data.value ?? []
    const activeItemId = String(matchedItem.value?.url_id ?? matchedItem.value?.id ?? "")
    return list
      .map((item) => {
        const page = resolveLocalizedPage(item.Page, String(locale.value))
        const label = page?.title || ""
        return {
          urlId: item.url_id,
          label,
          to: toWebInformationCmsRoute(item.url_id),
          isActive: String(item.url_id) === activeItemId
        }
      })
      .filter((tab) => Boolean(tab.label))
  })

  const localizedPage = computed(() => resolveLocalizedPage(matchedItem.value?.Page, String(locale.value)))

  const title = computed(() => localizedPage.value?.title || "")
  const content = computed(() => {
    const raw = localizedPage.value?.content || ""
    return raw ? rewriteCmsResourceUrl(raw, cmsResourceConfig.value) : ""
  })
  const hasContent = computed(() => Boolean(title.value || content.value))

  return {
    title,
    content,
    hasContent,
    isLoading,
    isError,
    tabs
  }
}
