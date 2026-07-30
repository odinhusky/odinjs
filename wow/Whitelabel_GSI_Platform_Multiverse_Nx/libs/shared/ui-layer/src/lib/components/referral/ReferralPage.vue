<script setup lang="ts">
import ReferralSummaryCards from "./ReferralSummaryCards.vue"
import ReferralSettingTable from "./ReferralSettingTable.vue"
import ReferralDetailsTable from "./ReferralDetailsTable.vue"
import ReferralDetailsSubDetail from "./ReferralDetailsSubDetail.vue"

interface ReferralPageClassObj {
  page?: string
  pageInner?: string
}

withDefaults(
  defineProps<{
    classObj?: ReferralPageClassObj
  }>(),
  {
    classObj: () => ({})
  }
)

const activeTab = ref<"setting" | "detail">("setting")

const tabOptions = [
  { key: "setting", labelKey: "menu.referralSettings" },
  { key: "detail", labelKey: "menu.referralDetails" }
] as const

// 子明細狀態(由本層父容器持有,沿用舊版 v-if 切換模式,不走 nested route)
const subDetailContext = ref<{
  statementId: number
  range: { start: string; end: string }
} | null>(null)

const showingSubDetail = computed(() => subDetailContext.value !== null)

const handleShowSubDetails = (payload: { statementId: number; range: { start: string; end: string } }) => {
  subDetailContext.value = payload
}

const handleBackFromSubDetail = () => {
  subDetailContext.value = null
}

// 切回 setting 時 reset 子明細狀態(沿用舊版規則)
watch(activeTab, (val) => {
  if (val === "setting") subDetailContext.value = null
})
</script>

<template>
  <main :class="cx('min-h-full py-4 px-5 phone:px-4 text-[var(--text-text-primary)]', classObj.page)">
    <div :class="cx('mx-auto flex w-full flex-col gap-4', classObj.pageInner)">
      <header class="flex flex-col gap-2">
        <h1 class="text-2xl leading-8 font-bold">{{ $t("menu.memberAgent") }}</h1>

        <ReferralSummaryCards />

        <div :class="cx(FLEX_ITEMS_CENTER, 'flex-nowrap w-max pt-1 phone:!w-full')">
          <BaseTab
            v-for="tab in tabOptions"
            :key="tab.key"
            category="default"
            :active="activeTab === tab.key"
            :class-obj="{
              root: 'phone:!flex phone:!flex-1',
              item: 'shrink-0 min-w-[80px] px-5 py-2 whitespace-nowrap phone:!min-w-0 phone:!w-full'
            }"
            @click="activeTab = tab.key"
          >
            {{ $t(tab.labelKey) }}
          </BaseTab>
        </div>
      </header>

      <ReferralSettingTable v-if="activeTab === 'setting'" />

      <template v-else>
        <ReferralDetailsTable v-if="!showingSubDetail" @show-sub-details="handleShowSubDetails" />
        <ReferralDetailsSubDetail
          v-else-if="subDetailContext"
          :statement-id="subDetailContext.statementId"
          :statement-range="subDetailContext.range"
          @back="handleBackFromSubDetail"
        />
      </template>
    </div>
  </main>
</template>
