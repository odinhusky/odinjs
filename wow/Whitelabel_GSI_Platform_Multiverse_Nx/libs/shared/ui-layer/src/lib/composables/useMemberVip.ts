import type { VipRewardBenefit, MemberLevelItem } from "@shared-lib/api/apiFunctions/vip_getVipList"
import type { UserStatistics } from "@shared-lib/api/commonTypes/vipTypes"
import { LEVEL_UP_TYPE_ENUMS } from "@shared-lib/constants/enums/levelUpType"
import { useVIPList } from "@shared-lib/api/hooks/useVIPListQuery"

export interface MemberVipItem {
  id: number
  level: number
  title: string
  img: string
  conditions: MemberLevelItem["conditions"]
  rewardBenefits: VipRewardBenefit[]
  remark: string
  updated_time: string
  promotion_condition: MemberLevelItem["promotion_condition"]
  promotion_type: MemberLevelItem["promotion_type"]
}

export function useMemberVip() {
  const { locale } = useI18n()
  const { selectedWallet, selectedCurrencyCode, walletList } = useCurrencyInfo()

  const { accountInfo: memberLevel, isLoading: isAccountLoading } = useAccountInfo({
    options: {
      select: (data: GetAccountInfoResponseType) => {
        return data?.member_level ?? 0
      }
    }
  })

  const { vipList: memberLevelList, isLoading: isVipListLoading } = useVIPList()
  const { userStatisticsList, isLoading: isStatisticsLoading } = useMultiUserStatistics()

  // 目前頁面沒有使用單幣別統計，但先保留 hook 以便後續擴充。
  const { userStatistics } = useUserStatistics({
    currencyId: computed(() => selectedWallet.value?.currency_id || 0).value,
    options: { enabled: false }
  })

  const currentVipIndex = ref(0)

  const userStatisticsMap = computed<Record<number, UserStatistics>>(() => {
    return (userStatisticsList.value || []).reduce((acc, item) => {
      acc[item.currency_id] = item
      return acc
    }, {} as Record<number, UserStatistics>)
  })

  const resolveTitle = (memberLevel: MemberLevelItem) => {
    const localized = memberLevel.titles?.[locale.value as keyof typeof memberLevel.titles]
    if (localized) return localized
    const fallback = Object.values(memberLevel.titles || {}).find(Boolean)
    return fallback || `VIP ${memberLevel.level}`
  }

  const memberVipList = computed<MemberVipItem[]>(() => {
    const list = memberLevelList.value || []

    return list.map((memberLevel) => {
      const rewardBenefits = memberLevel.rewards.map((reward) => {
        const benefit = memberLevel.benefits.find((item) => item.currency_id === reward.currency_id)

        return {
          ...reward,
          ...(benefit?.withdraw || {
            daily_limit: 0,
            max_amount: "",
            fee: "",
            monthly_free_limit: 0
          })
        }
      })

      return {
        id: memberLevel.id,
        level: memberLevel.level,
        title: resolveTitle(memberLevel),
        img: memberLevel.img,
        conditions: memberLevel.conditions,
        rewardBenefits,
        remark: memberLevel.remark,
        updated_time: memberLevel.updated_time,
        promotion_condition: memberLevel.promotion_condition,
        promotion_type: memberLevel.promotion_type
      }
    })
  })

  const currentVip = computed(() => memberVipList.value[currentVipIndex.value] || null)
  const nextVip = computed(() => memberVipList.value[currentVipIndex.value + 1] || null)

  const selectedCurrencyId = computed(() => selectedWallet.value?.currency_id || 0)

  const getCurrencyCode = (currencyId: number) => {
    return walletList.value.find((item) => item.currency_id === currencyId)?.currency_code || ""
  }

  const getLevelUpTitle = (vip: MemberVipItem | null) => {
    if (!vip) return ""
    if (!vip.conditions.length) return ""
    if (vip.conditions.length === 1) return "Meeting The Requirement"
    if (vip.promotion_type === LEVEL_UP_TYPE_ENUMS.ALL) return "All Requirements"
    return "Meeting Any One"
  }

  const isLoading = computed(
    () => isVipListLoading.value || isStatisticsLoading.value || isAccountLoading.value || !selectedCurrencyCode.value
  )

  return {
    memberLevel,
    userStatistics,
    selectedCurrencyCode,
    selectedCurrencyId,
    memberVipList,
    currentVip,
    nextVip,
    userStatisticsMap,
    currentVipIndex,
    getCurrencyCode,
    getLevelUpTitle,
    isLoading
  }
}
