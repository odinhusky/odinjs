<script setup lang="ts">
import { MEMBER_ASIDE_KEYS } from "../../constants/memberAside"

const history = useHistory()

provideHistoryContext(history)

const { activeTab, tabOptions, handleTabChange } = history

const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(
  MEMBER_ASIDE_KEYS.HISTORY
)
</script>

<template>
  <MemberContainer
    header-title="會員中心"
    content-title="歷史紀錄"
    :show-aside="true"
    :mobile-content-visible="mobileContentVisible"
    :disable-content-max-width="true"
    @back="handleBackToAside"
  >
    <template #top>
      <div :class="cx(FLEX_ITEMS_CENTER, 'flex-nowrap w-max')">
        <BaseTab
          v-for="tab in tabOptions"
          :key="tab.key"
          category="default"
          :active="activeTab === tab.key"
          :class-obj="{ item: 'shrink-0 min-w-fit px-5 py-2 whitespace-nowrap' }"
          @click="handleTabChange(tab.key)"
        >
          {{ tab.label }}
        </BaseTab>
      </div>
    </template>

    <template #aside>
      <MemberAsideInfo :active-key="MEMBER_ASIDE_KEYS.HISTORY" @select="handleAsideSelect" />
    </template>

    <div class="w-full h-full min-h-0 flex flex-col gap-3">
      <HistoryDepositTable v-if="activeTab === 'deposit'" />

      <HistoryWithdrawTable v-else-if="activeTab === 'withdraw'" />

      <HistoryBetTable v-else-if="activeTab === 'bet'" />

      <HistoryBonusTable v-else-if="activeTab === 'promotion'" />

      <HistoryTradeTable v-else />
    </div>
  </MemberContainer>
</template>
