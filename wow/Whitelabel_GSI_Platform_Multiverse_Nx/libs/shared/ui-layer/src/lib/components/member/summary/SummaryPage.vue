<script setup lang="ts">
import { MEMBER_ASIDE_KEYS } from "../../../constants/memberAside"

const {
  selectedCurrency,
  currencyOptions,
  selectedDateRange,
  isDateDialogVisible,
  tempDateRange,
  selectedDatePreset,
  onlineTimeText,
  summaryCards,
  depositAmount,
  withdrawAmount,
  doughnutData,
  doughnutOptions,
  lineData,
  lineOptions,
  isLoading,
  handleCurrencyChange,
  openDateDialog,
  closeDateDialog,
  applyDatePreset,
  confirmDateRange
} = useSummary()

const { mobileContentVisible, handleAsideSelect, handleBackToAside } = useMemberAsideNavigation(
  MEMBER_ASIDE_KEYS.MEMBER_CENTER
)

const { logout, isPending: isLogoutPending } = useLogout()

const handleLogoutClick = () => {
  if (isLogoutPending.value) return

  handleGlobalClick({
    target: "handleMemberSummaryLogoutClick",
    debounceTimer: 180,
    callback: async () => {
      await logout()
    }
  })
}
</script>

<template>
  <div>
    <MemberContainer
      header-title="會員中心"
      content-title="總覽"
      :show-aside="true"
      :show-content-title-on-mobile="true"
      :mobile-content-visible="mobileContentVisible"
      :disable-content-max-width="true"
      @back="handleBackToAside"
    >
      <template #contentTitleRight>
        <div class="hidden mob:block w-[110px]">
          <BaseSelect
            :model-value="selectedCurrency"
            :options="currencyOptions"
            option-label="label"
            option-value="value"
            :disabled="isLoading"
            :class-obj="{
              select:
                '!rounded-full !bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)] !border-transparent [&_.p-select-label]:!font-bold [&_.p-select-label]:!text-sm [&_.p-select-label]:!leading-5 !min-h-[30px]',
              selectLabel: '!pl-4 !pr-1 !py-1',
              dropdown: '!pr-2 !text-[var(--button-button-title-primary-enabled)]',
              panel: 'max-h-[220px]'
            }"
            @update:model-value="handleCurrencyChange(String($event || ''))"
          />
        </div>
      </template>

      <template #aside>
        <MemberAsideInfo :active-key="MEMBER_ASIDE_KEYS.MEMBER_CENTER" @select="handleAsideSelect" />
      </template>

      <div class="w-full h-full min-h-0 flex flex-col gap-3">
        <SummaryFilterSection
          :selected-date-range="selectedDateRange"
          :online-time-text="onlineTimeText"
          :selected-currency="selectedCurrency"
          :currency-options="currencyOptions"
          :is-loading="isLoading"
          @open-date-dialog="openDateDialog"
          @update-currency="handleCurrencyChange"
        />

        <SummayDisplayBlocks
          :summary-cards="summaryCards"
          :deposit-amount="depositAmount"
          :withdraw-amount="withdrawAmount"
          :doughnut-data="doughnutData"
          :doughnut-options="doughnutOptions"
        />

        <section
          class="w-full h-[250px] rounded-xl bg-[var(--card-card-bg-primary-enabled)] py-[14px] px-3 phone:hidden"
        >
          <BaseChart type="line" :data="lineData" :options="lineOptions" :class-obj="{ chart: '!h-full' }" />
        </section>

        <BaseBtn theme="primary" size="lg" class="w-full" :class-obj="{ button: 'w-full' }" @click="handleLogoutClick">
          登出
        </BaseBtn>
      </div>
    </MemberContainer>

    <SummaryDatePickDialog
      v-model:visible="isDateDialogVisible"
      v-model:date-range="tempDateRange"
      :selected-date-preset="selectedDatePreset"
      @close="closeDateDialog"
      @apply-preset="applyDatePreset($event as 'today' | 'days3' | 'days7')"
      @confirm="confirmDateRange"
    />
  </div>
</template>
