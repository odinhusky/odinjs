<script setup lang="ts">
import { MEMBER_ASIDE_KEYS } from "../../constants/memberAside"

const pendingOrder = usePendingOrder()
providePendingOrderContext(pendingOrder)

const { activeTab, tabOptions, handleTabChange } = pendingOrder

const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(
  MEMBER_ASIDE_KEYS.PENDING_ORDER
)
</script>

<template>
  <MemberContainer
    header-title="會員中心"
    content-title="處理中訂單"
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
      <MemberAsideInfo :active-key="MEMBER_ASIDE_KEYS.PENDING_ORDER" @select="handleAsideSelect" />
    </template>

    <PendingOrderContent />
  </MemberContainer>
</template>
