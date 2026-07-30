import { useI18n, useRuntimeConfig } from "#imports"
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useCmsListQuery } from "@shared-lib/api/hooks/useCmsListQuery"
import { useSetting } from "@shared-lib/api/hooks/useSetting"
import { buildCmsImageUrl, rewriteCmsResourceUrl } from "@shared-lib/composables/cmsResourceHelpers"
import { useCustomBreakpoints } from "@shared-lib/composables/useCustomBreakpoints"
import { resolveCmsLang } from "@shared-lib/composables/useSideMenu/resolver"
import { CMS_DISPLAY_DEVICE_ENUMS } from "@shared-lib/constants/enums/cmsDisplayDevice"
import { CMS_DISPLAY_LOGIN_ENUMS } from "@shared-lib/constants/enums/cmsDisplayLogin"
import { CMS_TYPE_ENUMS } from "@shared-lib/constants/enums/cmsType"
import { useAuthStore } from "@shared-lib/stores/auth"
import { useCmsPopupStore } from "@shared-lib/stores/cmsPopupStore"
import type { CmsItem } from "@shared-lib/api/commonTypes/cmsTypes"

export interface CmsPopupAgreementItem {
  label: string
  value: number
}

export interface CmsPopupViewModel {
  title: string
  imgs: string[]
  confirmLabel: string
  rejectLabel: string
  agreementList: CmsPopupAgreementItem[]
  agreeAllText: string
}

const matchesDisplayLogin = (item: CmsItem, isLoggedIn: boolean): boolean => {
  const displayLogin = item.Setting?.payload?.display_login ?? CMS_DISPLAY_LOGIN_ENUMS.NO_RESTRICTIONS
  if (displayLogin === CMS_DISPLAY_LOGIN_ENUMS.NO_RESTRICTIONS) return true
  if (displayLogin === CMS_DISPLAY_LOGIN_ENUMS.AFTER_LOGIN) return isLoggedIn
  if (displayLogin === CMS_DISPLAY_LOGIN_ENUMS.BEFORE_LOGIN) return !isLoggedIn
  return true
}

const matchesDisplayDevice = (item: CmsItem, isMobile: boolean): boolean => {
  const displayDevice = item.Setting?.payload?.display_device ?? CMS_DISPLAY_DEVICE_ENUMS.NO_RESTRICTIONS
  if (displayDevice === CMS_DISPLAY_DEVICE_ENUMS.NO_RESTRICTIONS) return true
  if (displayDevice === CMS_DISPLAY_DEVICE_ENUMS.MOBILE) return isMobile
  if (displayDevice === CMS_DISPLAY_DEVICE_ENUMS.DESKTOP) return !isMobile
  return true
}

export function useCmsPopup() {
  const { data } = useCmsListQuery({ type: CMS_TYPE_ENUMS.POPUP })
  const { setting } = useSetting({ selector: (s) => Boolean(s?.age_confirmation) })
  const { locale } = useI18n()
  const runtimeConfig = useRuntimeConfig()
  const authStore = useAuthStore()
  const popupStore = useCmsPopupStore()
  const { alreadyShow } = storeToRefs(popupStore)
  const { isMobile } = useCustomBreakpoints()

  const cmsResourceConfig = computed(() => ({
    apiBase: String(runtimeConfig.public.apiBase || ""),
    resourceBase: String(runtimeConfig.public.imageBase || "")
  }))

  const cmsPopup = computed<CmsItem | null>(() => {
    const list = data.value ?? []
    const filtered = list.filter(
      (item) => matchesDisplayLogin(item, authStore.isLoggedIn) && matchesDisplayDevice(item, isMobile.value)
    )
    return filtered[0] ?? null
  })

  const popupData = computed<CmsPopupViewModel | null>(() => {
    const item = cmsPopup.value
    if (!item) return null
    const lang = String(locale.value)
    const setting = item.Setting
    const updatedTime = setting?.updated_time

    const imgs = (setting?.pop_up_img ?? []).map((path) => buildCmsImageUrl(path, updatedTime, cmsResourceConfig.value))

    const agreementList: CmsPopupAgreementItem[] = (item.Entrance ?? [])
      .filter((e) => e.sort !== 0)
      .map((e, index) => ({ label: rewriteCmsResourceUrl(resolveCmsLang(e.lang, lang), cmsResourceConfig.value), value: index }))

    const agreeAllEntry = (item.Entrance ?? []).find((e) => e.sort === 0)

    return {
      title: rewriteCmsResourceUrl(resolveCmsLang(setting?.lang, lang), cmsResourceConfig.value),
      imgs,
      confirmLabel: resolveCmsLang(setting?.comfirm_button_lang, lang),
      rejectLabel: resolveCmsLang(setting?.reject_button_lang, lang),
      agreementList,
      agreeAllText: agreeAllEntry ? rewriteCmsResourceUrl(resolveCmsLang(agreeAllEntry.lang, lang), cmsResourceConfig.value) : ""
    }
  })

  const shouldShowPopup = computed(() => !!setting.value && !!popupData.value && !alreadyShow.value)

  const markShown = () => popupStore.markShown()

  return { shouldShowPopup, popupData, markShown }
}
