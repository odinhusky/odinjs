import { toWebInformationCmsRoute } from "@shared-lib/constants/routePath"
import { CMS_WEB_INFORMATION_URL_ID_ENUMS } from "@shared-lib/constants/enums/cmsWebInformation"

export interface StaticPageLinkItem {
  key: string
  label: string
  to: string
}

const STATIC_PAGE_LINKS: StaticPageLinkItem[] = [
  { key: "about", label: "About Us", to: toWebInformationCmsRoute(CMS_WEB_INFORMATION_URL_ID_ENUMS.ABOUT_US) },
  { key: "privacy", label: "Privacy Policy", to: toWebInformationCmsRoute(CMS_WEB_INFORMATION_URL_ID_ENUMS.PRIVACY_POLICY) },
  { key: "terms", label: "Terms &Conditions", to: toWebInformationCmsRoute(CMS_WEB_INFORMATION_URL_ID_ENUMS.TERMS_AND_CONDITIONS) },
  { key: "responsible", label: "Responsible Gaming", to: toWebInformationCmsRoute(CMS_WEB_INFORMATION_URL_ID_ENUMS.RESPONSIBLE_GAMING) }
]

export const useStaticPageDirection = () => {
  const links = computed(() => STATIC_PAGE_LINKS)

  const handleStaticPageAction = async (key: string) => {
    const target = STATIC_PAGE_LINKS.find((item) => item.key === key)
    if (!target) return

    handleGlobalClick({
      target: `handleStaticPage${target.key}Click`,
      debounceTimer: 250,
      callback: async () => {
        await navigateTo(target.to)
      }
    })
  }

  return {
    links,
    handleStaticPageAction
  }
}
