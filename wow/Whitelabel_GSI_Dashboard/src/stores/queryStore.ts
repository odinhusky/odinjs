import { useQuasar } from "quasar"
import * as Constants from "@/utils/constants"
import type * as CURRENCY_TYPE from "@/utils/constants/currency"
import { defineStore } from "pinia"
import type * as Response from "@/api/response.type"
import { getProductDropdown, getProductGameType } from "@/api/product"
import { getMemberAnnouncementType } from "@/api/announcement"
import { getGameNameDropdown } from "@/api/game"
import { getCurrencyList, getCustomerServiceList } from "@/api/common"
import { getMemberLevelList } from "@/api/memberLevel"
import { useLanguageStore } from "@/stores/languageStore"
import { getAdminAccountPermissionList } from "@/api/adminAccount"
import { getAccountFlowType } from "@/api/report"
import { getMemberTags, getGameSiteList } from "@/api/member"
import { getCmsList, getCmsCustomPages, getCmsInternalList, getCmsWebIntroductionList } from "@/api/cms"
import { getIntegrationList, getProductGameTypeV2, getProductV2Dropdown } from "@/api/productV2"
import { getVoiceBotList } from "@/api/AIVoiceBot"
/**
 * 暫時用來產假 enum 資料
 * @param enums
 * @returns <enums>[]
 */
export function genEnumToArray(enums: Record<string, number | string>): (number | string)[] {
  return Object.values(enums).filter((v) => !isNaN(Number(v)))
}

export function genEnumToDropdown(enums: Record<string, number | string>, i18nKeys: typeof enums) {
  return genEnumToArray(enums).map((e) => {
    const value = e
    const label = i18nKeys[value]
    return {
      label,
      value
    }
  })
}

export type DropdownType = {
  label: string
  value: string | number
}

export type ProductV2DropdownType = {
  label: string
  value: number
  gameTypeId: number
  integrationId: number
}

export type GameDropdownType = {
  label: string
  value: number
  product_code: number
  game_code: string
}

export type ProductDropdownMap = {
  [key: number]: Response.ProductDropdown
}

export type GameTypeIdMap = {
  [key: number]: string
}

interface SubPermission {
  id: number
  name: string
  layer: number
  actions: {
    edit?: boolean
    view?: boolean
    export?: boolean
  }
}

interface Permission {
  id: number
  name: string
  layer: number
  sub_permission: SubPermission[]
}

type PermissionActions = {
  label: string
  edit: boolean
  view: boolean
  export: boolean
}

type PermissionList = {
  [key: string]: PermissionActions[]
}

export const useQueryStore = defineStore("queryStore", {
  state: () => {
    return {
      visible: false,
      spinShow: false,
      dateType: [] as Constants.DATE_TYPE.Enums[],
      depositStatus: [] as Constants.DEPOSIT_STATUS.Enums[],
      withdrawStatus: [] as Constants.WITHDRAW_STATUS.Enums[],
      memberTagType: [] as Constants.MEMBER_TAG_TYPE.Enums[],
      memberLevel: [] as DropdownType[],
      currencyList: [] as Array<{ label: string; value: number }>,
      actionTypeList: [] as Array<{ label: string; value: number }>,
      agentDropdownList: [] as string[],
      productNameList: [] as string[],
      gameTypeList: [] as DropdownType[],
      customerServiceLinkList: [] as DropdownType[],
      cmsHomeList: [] as DropdownType[],
      cmsCustomPageList: [] as DropdownType[],
      cmsInternalList: [] as DropdownType[],
      cmsWebIntroductionList: [] as DropdownType[],
      gameTypeIdMap: {
        1: "SLOT",
        2: "LIVE_CASINO",
        3: "SPORT_BOOK",
        4: "VIRTUAL_SPORT",
        5: "Lottery",
        6: "CARDBOARD",
        7: "P2P",
        8: "FISHING",
        9: "OTHER",
        10: "COCK_FIGHTING",
        11: "ESPORT",
        12: "POKER",
        13: "LIVE_CASINO_PREMIUM"
      } as GameTypeIdMap,
      quotaTypeList: [] as Constants.QUOTA_TYPE.Enums[],
      quotaModifyReasonList: [] as Constants.QUOTA_MODIFY_REASON.Enums[],
      permissionLevel: [] as any[],
      pageLog: [] as Array<{ label: string; value: number }>,
      productList: [] as string[],
      eventTypeList: [] as Constants.EVENT_TYPE.Enums[],
      distributionStatusList: [] as Constants.DISTRIBUTION_STATUS.Enums[],
      monitorTypeList: [] as Constants.MONITORING_TYPE.Enums[],
      productDropdown: [] as DropdownType[],
      productDropdownV2: [] as ProductV2DropdownType[],
      productCodeMap: {} as ProductDropdownMap,
      gameDropdown: [] as GameDropdownType[],
      gameSiteDropdown: [] as DropdownType[],
      permissionList: {} as PermissionList,
      accountFlowType: [] as Array<{ label: string; value: string }>,
      memberTags: [] as Response.MemberTags[],
      MemberAnnounceType: [] as Array<{ label: string; value: number }>,
      reloadIntervalDropdown: [
        {
          label: "no_reload",
          value: 0
        },
        {
          label: "x_second",
          value: 15
        },
        {
          label: "x_second",
          value: 30
        }
      ] as DropdownType[],
      integration: [] as DropdownType[],
      gameTypeListV2: [] as DropdownType[],
      cmsCategoryList: [] as DropdownType[],
      voiceBotList: [] as Array<{ voice_type: string; example_voice_url: string }>
    }
  },
  actions: {
    toggleVisible() {
      this.visible = !this.visible
    },
    setVisibleShow() {
      this.visible = true
    },
    setVisibleHide() {
      this.visible = false
    },
    toggleSpinner() {
      this.spinShow = !this.spinShow
    },
    async getMemberTag() {
      if (this.memberTags.length) {
        return
      }
      const { data } = await getMemberTags({ offset: 0, size: 100000, enable: true })
      if (!data || !data.list || !data.list.length) {
        this.memberTags.length = 0
        return
      }

      this.memberTags = [...data.list]
    },
    getMemberTagType() {
      // 先重置清單
      this.memberTagType.length = 0

      // 之後改成撈api取得會員標籤類型列表
      genEnumToArray(Constants.MEMBER_TAG_TYPE.Enums).forEach((i) => {
        this.memberTagType.push(i as Constants.MEMBER_TAG_TYPE.Enums)
      })
    },

    async getMemberLevel() {
      const { data } = await getMemberLevelList()

      if (!data || Object.keys(data).length === 0) {
        this.memberLevel.length = 0
        return
      }

      if (data) {
        this.memberLevel = []
      }
      this.memberLevel = data.map((e) => {
        const label = this.getDynamicLangValue(e.titles)
        const value = e.id
        return {
          label,
          value
        }
      })
    },

    getDynamicLangValue(data: Response.MemberLevelLangTitle): string {
      if (!data) return ""
      const languageStore = useLanguageStore()
      const nowLang = languageStore.currentLanguageOption.backendKey as Constants.LANGUAGE_TYPE.Enums
      if (nowLang in data) {
        return data[nowLang]
      } else {
        // 没有 MYR 的值，则取第一个值
        for (const key in data) {
          return data[key as Constants.LANGUAGE_TYPE.Enums]
        }
      }
      return ""
    },

    getDepositStatus() {
      // 先重置清單
      this.depositStatus.length = 0

      // 之後改成撈api取得存款方式列表
      genEnumToArray(Constants.DEPOSIT_STATUS.Enums).forEach((i) => {
        this.depositStatus.push(i as Constants.DEPOSIT_STATUS.Enums)
      })
    },
    getDateType() {
      // 先重置清單
      this.dateType.length = 0

      // 之後改成撈api取得存款方式列表
      genEnumToArray(Constants.DATE_TYPE.Enums).forEach((i) => {
        this.dateType.push(i as Constants.DATE_TYPE.Enums)
      })
    },
    getWithdrawStatus() {
      // 先重置清單
      this.withdrawStatus.length = 0

      // 之後改成撈api取得存款方式列表
      genEnumToArray(Constants.WITHDRAW_STATUS.Enums).forEach((i) => {
        this.withdrawStatus.push(i as Constants.WITHDRAW_STATUS.Enums)
      })
    },
    async getCurrencyList() {
      // 防止api 沒資料報錯 但開發時如果 api 更新要隱藏這段清緩存
      // if (this.currencyList.length) {
      //   return
      // }
      const { data } = await getCurrencyList()
      if (!data || Object.keys(data).length === 0) {
        this.currencyList.length = 0
        return
      }
      if (data) {
        this.currencyList = []
      }
      for (const [currency, value] of Object.entries(data)) {
        const newItem = {
          label: Constants.CURRENCY_TYPE.I18nKeys[value as CURRENCY_TYPE.Enums],
          value: value
        }
        this.currencyList.push(newItem as never)
      }
    },

    async getVoiceBotList() {
      const { data } = await getVoiceBotList()
      if (!data || Object.keys(data).length === 0) {
        this.voiceBotList.length = 0
        return
      }
      if (data) {
        this.voiceBotList = []
      }

      data.forEach((item) => {
        this.voiceBotList.push({
          label: item.voice_type,
          value: {
            voice_type: item.voice_type,
            example_voice_url: item.example_voice_url
          }
        })
      })
    },

    getActionTypeList() {
      // 先重置清單
      this.actionTypeList.length = 0

      this.actionTypeList = [
        { value: 1, label: Constants.ACTION_TYPE.I18nKeys[1] },
        { value: 2, label: Constants.ACTION_TYPE.I18nKeys[2] },
        { value: 3, label: Constants.ACTION_TYPE.I18nKeys[3] },
        { value: 4, label: Constants.ACTION_TYPE.I18nKeys[4] },
        { value: 5, label: Constants.ACTION_TYPE.I18nKeys[5] },
        { value: 6, label: Constants.ACTION_TYPE.I18nKeys[6] }
      ]
    },
    getAgentDropdownList() {
      // 先重置清單
      this.agentDropdownList.length = 0

      // 之後改成撈api取得幣別清單
      ;["a001", "a002", "a003", "agent999", "agent888"].forEach((i) => {
        this.agentDropdownList.push(i)
      })
    },
    async getGameTypeList() {
      if (this.gameTypeList.length) {
        return
      }
      const { data } = await getProductGameType({ only_actived: true })
      if (!data || !data.length) {
        this.gameTypeList.length = 0
        return
      }
      const sortedData = data.sort((a, b) => a.id - b.id)

      this.gameTypeList = sortedData.map((e) => {
        this.gameTypeIdMap[e.id] = e.game_type
        const label = e.game_type
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    async getCustomerServiceLinkList() {
      if (this.customerServiceLinkList.length) {
        return
      }
      const { data } = await getCustomerServiceList()
      if (!data || !data.length) {
        this.customerServiceLinkList.length = 0
        return
      }
      const sortedData = data.sort((a, b) => a.id - b.id)

      this.customerServiceLinkList = sortedData.map((e) => {
        const label = e.title
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    async getCmsHomeList() {
      if (this.cmsHomeList.length) {
        return
      }
      const { data } = await getCmsList({ type: Constants.CMS_TYPE.Enums.HOME })
      if (!data || !data.length) {
        this.cmsHomeList.length = 0
        return
      }
      const sortedData = data.sort((a, b) => a.id - b.id)

      this.cmsHomeList = sortedData.map((e) => {
        const label = e.title
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    async getCmsCustomPageList() {
      if (this.cmsCustomPageList.length) {
        return
      }
      const { data } = await getCmsCustomPages()
      if (!data || !data.length) {
        this.cmsCustomPageList.length = 0
        return
      }
      const sortedData = data.sort((a, b) => a.id - b.id)

      this.cmsCustomPageList = sortedData.map((e) => {
        const label = e.title
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    async getCmsInternaslList() {
      if (this.cmsInternalList.length) {
        return
      }
      const { data } = await getCmsInternalList()

      if (!data || !data.length) {
        this.cmsInternalList.length = 0
        return
      }
      const sortedData = data.sort((a, b) => a.id - b.id)

      this.cmsInternalList = sortedData.map((e) => {
        const label = e.did
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    async getCmsWebIntroductionsList() {
      if (this.cmsWebIntroductionList.length) {
        return
      }
      const { data } = await getCmsWebIntroductionList()

      if (!data || !data.length) {
        this.cmsWebIntroductionList.length = 0
        return
      }
      const sortedData = data.sort((a, b) => a.id - b.id)

      if (data) {
        this.cmsWebIntroductionList = []
      }

      this.cmsWebIntroductionList = sortedData.map((e) => {
        const label = e.title
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    getQuotaTypeList() {
      // 先重置清單
      this.quotaTypeList.length = 0

      // 之後改成撈api取得額度調整類型的清單
      genEnumToArray(Constants.QUOTA_TYPE.Enums).forEach((i) => {
        this.quotaTypeList.push(i as Constants.QUOTA_TYPE.Enums)
      })
    },
    getQuotaModifyReasonList() {
      // 先重置清單
      this.quotaModifyReasonList.length = 0

      // 之後改成撈api取得額度調整類型的清單
      genEnumToArray(Constants.QUOTA_MODIFY_REASON.Enums).forEach((i) => {
        this.quotaModifyReasonList.push(i as Constants.QUOTA_MODIFY_REASON.Enums)
      })
    },
    getPermissionLevel() {
      this.permissionLevel.length = 0

      // 之後改成撈api取得列表
      ;["All", 1, 2, 3, 4, 5, 6].forEach((i) => {
        this.permissionLevel.push(i)
      })
    },
    async getPageLog() {
      const sendData = { name: "", offset: 0, size: 100 }
      const { data } = await getAdminAccountPermissionList(sendData)

      if (!data || Object.keys(data).length === 0) {
        this.pageLog.length = 0
        return
      }

      if (data) {
        this.pageLog = []
      }
      this.pageLog = data.parent_permission.reduce((acc, e) => {
        const subPermissions = e.sub_permission.map((sub) => ({
          label: sub.name,
          value: sub.id
        }))
        return acc.concat(subPermissions)
      }, [])
    },
    getProduct() {
      // 先重置清單
      this.productList.length = 0
      ;["All", "SABA", "AG", "PT", "OB"].forEach((i) => {
        this.productList.push(i)
      })
    },
    getEventTypeList() {
      // 先重置清單
      this.eventTypeList.length = 0
      // 之後改成撈api取得額度調整類型的清單
      genEnumToArray(Constants.EVENT_TYPE.Enums).forEach((i) => {
        this.eventTypeList.push(i as Constants.EVENT_TYPE.Enums)
      })
    },
    getDistributionStatusList() {
      // 先重置清單
      this.distributionStatusList.length = 0

      // 之後改成撈api取得額度調整類型的清單
      genEnumToArray(Constants.DISTRIBUTION_STATUS.Enums).forEach((i) => {
        this.distributionStatusList.push(i as Constants.DISTRIBUTION_STATUS.Enums)
      })
    },
    getMonitorTypeList() {
      // 先重置清單
      this.monitorTypeList.length = 0

      // 之後改成撈api取得監控類別
      genEnumToArray(Constants.MONITORING_TYPE.Enums).forEach((i) => {
        this.monitorTypeList.push(i as Constants.MONITORING_TYPE.Enums)
      })
    },
    async getProductDropdownList() {
      // 防止api 沒資料報錯 但開發時如果 api 更新要隱藏這段清緩存
      // if (this.productDropdown.length) {
      //   return
      // }

      const { data } = await getProductDropdown({ only_actived: true })
      if (!data || !data.length) {
        this.productDropdown.length = 0
        return
      }
      if (data) {
        this.productDropdown = []
      }
      this.productDropdown = data.map((e) => {
        const label = e.product_name
        const value = e.product_code
        const gameType = e.game_type
        const gameTypeId = e.game_type_id
        return {
          label,
          value,
          gameType,
          gameTypeId
        }
      })

      data.map((e) => {
        this.productCodeMap[e.product_code] = e
      })
    },
    async getGameDropdownList() {
      try {
        const { data } = await getGameNameDropdown()
        if (!data || !data.length) {
          this.gameDropdown.length = 0
          return
        }

        this.gameDropdown = data.map((e) => {
          const label = e.game_name
          const value = e.id
          const product_code = e.product_code
          const game_code = e.game_code
          return {
            label,
            value,
            product_code,
            game_code
          }
        })
      } catch (error) {
        console.error(error)
      }
    },
    async getAccountFlowType() {
      if (this.accountFlowType.length) {
        return
      }
      const { data } = await getAccountFlowType()
      if (!data || !data.length) {
        this.accountFlowType.length = 0
        return
      }

      this.accountFlowType = data.map((e) => {
        const label = e.wallet_trans_type
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    async getMemberAnnounceType() {
      if (this.MemberAnnounceType.length) {
        return
      }
      const { data } = await getMemberAnnouncementType()
      if (!data || !data.length) {
        this.MemberAnnounceType.length = 0
        return
      }

      this.MemberAnnounceType = data.map((e) => {
        const label = String(e.name)
        const value = e.type
        return {
          label,
          value
        }
      })
    },
    async getGameSiteDropdown() {
      if (this.gameSiteDropdown.length) {
        return
      }
      const { data } = await getGameSiteList()
      if (!data || !data.length) {
        this.gameSiteDropdown.length = 0
        return
      }

      this.gameSiteDropdown = data.map((e) => {
        const label = e.title
        const value = e.value
        return {
          label,
          value
        }
      })
    },
    async getIntegration() {
      if (this.integration.length) {
        return
      }
      const { data } = await getIntegrationList()
      if (!data || !data.length) {
        this.integration.length = 0
        return
      }

      this.integration = data.map((e) => {
        const label = e.name
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    async getGameTypeListV2() {
      /*if (this.gameTypeListV2.length) {
        return
      }*/
      const { data } = await getProductGameTypeV2()
      if (!data || !data.length) {
        this.gameTypeListV2.length = 0
        return
      }
      if (data) {
        this.gameTypeListV2.length = 0
      }
      const sortedData = data.sort((a, b) => a.id - b.id)

      this.gameTypeListV2 = sortedData.map((e) => {
        const label = e.game_type
        const value = e.game_type
        return {
          label,
          value
        }
      })
    },
    async getCmsCategory(lan: string) {
      if (this.cmsCategoryList.length) {
        return
      }
      const { data } = await getCmsList({ type: Constants.CMS_TYPE.Enums.CATEGORYMANAGEMENT })
      if (!data || !data.length) {
        this.cmsCategoryList.length = 0
        return
      }
      const sortedData = data.sort((a, b) => a.id - b.id)

      this.cmsCategoryList = sortedData.map((e) => {
        const label = e.title
        const value = e.id
        return {
          label,
          value
        }
      })
    },
    async getProductV2DropdownList() {
      // 防止api 沒資料報錯 但開發時如果 api 更新要隱藏這段清緩存
      // if (this.productDropdown.length) {
      //   return
      // }

      const { data } = await getProductV2Dropdown()
      if (!data || !data.length) {
        this.productDropdownV2.length = 0
        return
      }
      if (data) {
        this.productDropdownV2 = []
      }
      this.productDropdownV2 = data.map((e) => {
        const label = e.product_name
        const value = e.product_code
        const gameTypeId = e.game_type_id
        const integrationId = e.integration_id
        return {
          label,
          value,
          gameTypeId,
          integrationId
        }
      })
    },
    async getVoiceBotList() {
      if (this.voiceBotList.length) {
        return
      }
      const { data } = await getVoiceBotList()
      if (!data || !data.length) {
        this.voiceBotList.length = 0
        return
      }
      this.voiceBotList = data.map((e) => ({
        voice_type: e.voice_type,
        example_voice_url: e.example_voice_url
      }))
    }
  },
  persist: false
})
