<script setup lang="ts">
import { MEMBER_ASIDE_KEYS } from "../../constants/memberAside"

const {
  memberLevel,
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
} = useMemberVip()

const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(MEMBER_ASIDE_KEYS.VIP)

const selectedVipId = ref<number | null>(null)

const selectedVipIndex = computed(() => {
  if (!memberVipList.value.length) return -1
  const index = memberVipList.value.findIndex((item) => item.id === selectedVipId.value)
  return index >= 0 ? index : 0
})

const selectedVip = computed(() => {
  if (selectedVipIndex.value < 0) return null
  return memberVipList.value[selectedVipIndex.value] || null
})

const selectedNextVip = computed(() => {
  if (selectedVipIndex.value < 0) return null
  return memberVipList.value[selectedVipIndex.value + 1] || null
})

const handleSelectVipCard = (vipId: number) => {
  selectedVipId.value = vipId
}

watch(
  [memberVipList, memberLevel],
  ([list, level]) => {
    if (!list?.length) {
      currentVipIndex.value = 0
      return
    }

    const currentLevel = typeof level === "number" ? level : 0
    const currentIndex = list.findIndex((item) => item.level === currentLevel)
    currentVipIndex.value = currentIndex >= 0 ? currentIndex : 0

    if (!selectedVipId.value) {
      selectedVipId.value = list[currentVipIndex.value]?.id || list[0]?.id || null
    }

    const hasSelected = list.some((item) => item.id === selectedVipId.value)
    if (!hasSelected) {
      selectedVipId.value = list[currentVipIndex.value]?.id || list[0]?.id || null
    }
  },
  { immediate: true }
)
</script>

<template>
  <MemberContainer
    header-title="會員中心"
    content-title="VIP 獎勵"
    :show-aside="true"
    :mobile-content-visible="mobileContentVisible"
    :disable-content-max-width="true"
    @back="handleBackToAside"
  >
    <template #aside>
      <MemberAsideInfo :active-key="MEMBER_ASIDE_KEYS.VIP" @select="handleAsideSelect" />
    </template>

    <div class="w-full h-full min-h-0 flex flex-col gap-6">
      <div v-if="isLoading" :class="cx(FLEX_CENTER, 'h-full text-[var(--text-text-primary)]')">Loading...</div>

      <div v-else-if="!memberVipList.length" :class="cx(FLEX_CENTER, 'h-full text-sm text-[var(--text-text-primary)]')">
        暫無 VIP 等級資料
      </div>

      <template v-else>
        <BaseSwiper
          v-model:page="currentVipIndex"
          :value="memberVipList"
          :item-width="424"
          :item-gap="16"
          :mobile-breakpoint="480"
          :circular="false"
          :show-indicators="false"
          :show-navigators="true"
          :class-obj="{
            wrapper: 'w-full',
            navigatorPrev: 'z-10',
            navigatorNext: 'z-10'
          }"
        >
          <template #default="{ item, index }">
            <VipCard
              :vip="item"
              :next-vip="memberVipList[index + 1] || null"
              :is-current="memberLevel === item.level"
              :is-active="selectedVipId === item.id"
              :selected-currency-id="selectedCurrencyId"
              :selected-currency-code="selectedCurrencyCode"
              :user-statistics-map="userStatisticsMap"
              :level-up-title="getLevelUpTitle(memberVipList[index + 1] || item)"
              @select="handleSelectVipCard"
            />
          </template>
        </BaseSwiper>

        <VipUpgradeRequirementsSection
          :current-vip="selectedVip || currentVip"
          :next-vip="selectedNextVip || nextVip"
          :user-statistics-map="userStatisticsMap"
          :get-currency-code="getCurrencyCode"
        />

        <section :class="cx(FLEX_COL, 'items-start gap-4 w-full pb-4')">
          <h3 class="text-2xl leading-7 font-bold text-[var(--text-text-primary)]">已啟用福利</h3>

          <div
            v-if="(selectedVip || currentVip)?.rewardBenefits?.length"
            class="grid grid-cols-2 phone:grid-cols-1 gap-3 w-full items-stretch"
          >
            <VipBenefitZone
              v-for="benefit in (selectedVip || currentVip)?.rewardBenefits || []"
              :key="benefit.currency_id"
              :reward-benefit="benefit"
              :currency-code="getCurrencyCode(benefit.currency_id)"
              theme="outside"
            />
          </div>

          <NoData v-else type="gift" title="目前等級暫無可領取獎勵" />
        </section>
      </template>
    </div>
  </MemberContainer>
</template>
