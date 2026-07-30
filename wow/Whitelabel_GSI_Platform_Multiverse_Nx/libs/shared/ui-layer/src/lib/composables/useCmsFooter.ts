import { useI18n, useRuntimeConfig } from "#imports"
import { computed } from "vue"
import { useCmsListQuery } from "@shared-lib/api/hooks/useCmsListQuery"
import { buildCmsImageUrl, rewriteCmsResourceUrl } from "@shared-lib/composables/cmsResourceHelpers"
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import type { CmsPageItem } from "@shared-lib/api/commonTypes/cmsTypes"

export interface CmsFooterTextContent {
  title: string
  content: string
}

const resolveFooterPage = (pages: CmsPageItem[] | undefined, locale: string): CmsPageItem | null => {
  if (!pages?.length) return null
  const normalized = locale.toLowerCase().replace("_", "-")
  const exact = pages.find((p) => String(p.lang).toLowerCase() === normalized)
  if (exact) return exact
  const prefix = normalized.split("-")[0]
  const partial = pages.find((p) => String(p.lang).toLowerCase().startsWith(prefix))
  if (partial) return partial
  return pages.find((p) => p.content) ?? null
}

export function useCmsFooter() {
  const { data } = useCmsListQuery({ type: CMS_TYPE_ENUMS.FOOTER_SETTINGS })
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()

  const cmsResourceConfig = computed(() => ({
    apiBase: String(runtimeConfig.public.apiBase || ""),
    resourceBase: String(runtimeConfig.public.imageBase || "")
  }))

  const cmsFooter = computed(() => data.value?.[0] ?? null)

  const cmsFooterLogos = computed<string[]>(() => {
    const setting = cmsFooter.value?.Setting
    const list = setting?.logo_sort
    if (!list?.length) return []
    return list.map((path) => buildCmsImageUrl(path, setting?.updated_time, cmsResourceConfig.value))
  })

  const cmsFooterTextContent = computed<CmsFooterTextContent | null>(() => {
    const matched = resolveFooterPage(cmsFooter.value?.Page, String(locale.value))
    if (!matched?.content) return null
    return { title: matched.title ?? "", content: rewriteCmsResourceUrl(matched.content, cmsResourceConfig.value) }
  })

  const hasFooterContent = computed(() => cmsFooterLogos.value.length > 0 || !!cmsFooterTextContent.value)

  return { cmsFooterLogos, cmsFooterTextContent, hasFooterContent }
}
