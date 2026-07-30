<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useAgentCollaborationFlow, type AgentCollaborationTab } from "../../composables/useAgentCollaborationFlow"

interface AgentCollaborationPageClassObj {
  page?: string
  hero?: string
  title?: string
  content?: string
  panel?: string
}

const props = withDefaults(
  defineProps<{
    pageSize?: number
    classObj?: AgentCollaborationPageClassObj
  }>(),
  {
    pageSize: 10,
    classObj: () => ({})
  }
)

const { t } = useI18n()

const stripHtmlTags = (value: string | undefined) => (value ?? "").replace(/<[^>]*>/g, "")

const pageTitle = computed(() => t("collaboration.title"))
const currencyLabel = computed(() => t("collaboration.currency"))
const memberAccountLabel = computed(() => t("collaboration.member_account"))
const memberAccountPlaceholder = computed(() => t("placeholder.pleaseEnter2"))
const statusLabel = computed(() => t("collaboration.status"))
const searchText = computed(() => t("common.btn.search"))
const invitationTabText = computed(() => t("collaboration.invitation_details"))
const rebateTabText = computed(() => t("collaboration.commission_details"))
const emptyText = computed(() => t("tableHeader.noData"))
const referralCodeText = computed(() => t("collaboration.exclusive_referral_code"))
const activeMemberText = computed(() => t("collaboration.active_members_this_period"))
const validBetText = computed(() => t("collaboration.total_valid_bet_amount_this_period"))
const depositCountText = computed(() => t("collaboration.deposit_count"))
const depositAmountText = computed(() => t("collaboration.deposit_amount"))
const invitationValidBetText = computed(() => t("collaboration.valid_bet_amount"))
const rebateSettlementTimeText = computed(() => t("collaboration.settlement_time"))
const rebateAchievedActiveMembersText = computed(() => t("collaboration.achieved_active_member_count"))
const rebateAchievedValidBetText = computed(() => t("collaboration.achieved_valid_bet_amount"))
const rebateLevelText = computed(() => t("collaboration.commission_level"))
const rebateAmountText = computed(() => t("collaboration.commission_amount"))
const dateRangeText = computed(() => t("common.btn.searchDate"))
const copiedText = computed(() => t("common.btn.copied"))
const descriptionTitleText = computed(() => t("collaboration.title"))

const {
  activeTab,
  activePagination,
  bannerPath,
  copiedReferralCode,
  currencyOptions,
  invitations,
  invitationFilters,
  invitationStatusOptions,
  isInitialized,
  isInvitationLoading,
  isPageLoading,
  isRebateLoading,
  isStatisticsLoading,
  isVisible,
  rebates,
  rebateFilters,
  selectedCurrencyCode,
  selectedCurrencyId,
  statistics,
  changeCurrency,
  changeTab,
  copyReferralCode,
  formatDateTime,
  formatNumber,
  getInvitationStatusLabel,
  searchInvitations,
  searchRebates,
  updateActivePage
} = useAgentCollaborationFlow({
  pageSize: props.pageSize
})

const statisticDetailText = computed(() => stripHtmlTags(statistics.value?.detail))
const statisticDescriptionTitle = computed(() => statistics.value?.title || descriptionTitleText.value)
const isActiveListLoading = computed(() => (activeTab.value === "rebate" ? isRebateLoading.value : isInvitationLoading.value))
const isDescriptionDialogVisible = ref(false)
const expandedInvitationKey = ref<string | null>(null)
const expandedRebateKey = ref<string | null>(null)

const tabButtonClass = (tab: AgentCollaborationTab) =>
  cx(
    "h-10 rounded-t-md px-4 text-sm font-bold leading-5 transition-colors phone:h-9 phone:min-w-[110px]",
    activeTab.value === tab
      ? "bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)] text-[var(--button-button-title-primary-enabled)]"
      : "bg-[var(--color-light-100)] text-[var(--text-text-primary)]"
  )

const statusBadgeClass = (status: number) =>
  cx(
    "inline-flex min-w-[64px] items-center justify-center rounded-full px-2 py-1 text-xs font-bold",
    status === 1
      ? "bg-[var(--tag-tag-bg-default)] text-[var(--tag-tag-title-success)]"
      : "bg-[var(--tag-tag-bg-default)] text-[var(--tag-tag-title-negative)]"
  )

const getInvitationMobileKey = (index: number) => `invitation-${index}`
const getRebateMobileKey = (index: number) => `rebate-${index}`

const toggleInvitationMobileCard = (index: number) => {
  const key = getInvitationMobileKey(index)
  expandedInvitationKey.value = expandedInvitationKey.value === key ? null : key
}

const toggleRebateMobileCard = (index: number) => {
  const key = getRebateMobileKey(index)
  expandedRebateKey.value = expandedRebateKey.value === key ? null : key
}

const openDescriptionDialog = () => {
  isDescriptionDialogVisible.value = true
}

watch(
  invitations,
  (items) => {
    expandedInvitationKey.value = items.length ? getInvitationMobileKey(0) : null
  },
  { immediate: true }
)

watch(
  rebates,
  (items) => {
    expandedRebateKey.value = items.length ? getRebateMobileKey(0) : null
  },
  { immediate: true }
)
</script>

<template>
  <section :class="cx('min-h-full text-[var(--text-text-primary)]', props.classObj?.page)">
    <div
      :class="
        cx(
          'mx-auto flex h-[84px] w-full max-w-[1200px] items-end overflow-hidden px-0 pb-5 phone:h-[60px] phone:px-4 phone:pb-3',
          props.classObj?.hero
        )
      "
    >
      <h1 :class="cx('text-[28px] font-bold leading-9 phone:text-2xl phone:leading-8', props.classObj?.title)">
        {{ pageTitle }}
      </h1>
    </div>

    <div :class="cx('mx-auto w-full max-w-[1280px] px-6 pb-8 pt-0 phone:px-4 phone:pb-4', props.classObj?.content)">
      <div v-if="isPageLoading && !isInitialized" class="flex min-h-[360px] items-center justify-center">
        <BaseIcon name="svg-spinners:ring-resize" size="2rem" class="text-[var(--icon-icon-primary-enabled)]" />
      </div>

      <div
        v-else-if="!isVisible"
        class="mx-auto flex min-h-[360px] w-full max-w-[920px] items-center justify-center rounded-lg bg-[var(--color-navy-950)] text-sm text-[var(--color-light-700)]"
      >
        {{ emptyText }}
      </div>

      <div v-else :class="cx('mx-auto w-full max-w-[1200px] space-y-5 phone:space-y-4', props.classObj?.panel)">
        <div class="overflow-hidden rounded-lg bg-[var(--brand-brand-secondary-strong)]">
          <BaseImage
            v-if="bannerPath"
            :src="bannerPath"
            :alt="pageTitle"
            :class-obj="{
              container: 'block h-[270px] w-full pad:h-[236px] phone:h-[110px]',
              image: 'h-full w-full object-contain',
              placeholder: 'h-full min-h-0 bg-[var(--container-container-bg-secondary)]'
            }"
          />
          <div v-else class="h-[270px] w-full bg-[var(--container-container-bg-secondary)] pad:h-[236px] phone:h-[110px]" />
        </div>

        <div class="w-[120px] phone:w-full">
          <BaseSelect
            :model-value="selectedCurrencyId"
            :options="currencyOptions"
            option-label="label"
            option-value="value"
            :label="currencyLabel"
            :class-obj="{
              wrapper: '!gap-1',
              label: '!text-xs !leading-4 !text-[var(--color-light-900)]',
              select: '!min-h-[34px] !h-[34px] !rounded-md !border !border-[var(--brand-brand-secondary-contrast)] !bg-[var(--container-container-field)]',
              selectLabel: '!py-0 !pl-3 !text-sm !leading-[32px]',
              dropdown: '!ml-0 !w-8 !text-[var(--text-text-primary)]',
              panel: '!z-[1100]'
            }"
            @update:model-value="changeCurrency(Number($event))"
          />
        </div>

        <section class="overflow-x-auto overflow-y-hidden [scrollbar-width:none] phone:overflow-visible [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div class="grid min-w-[720px] grid-cols-[minmax(220px,1.1fr)_minmax(180px,1fr)_minmax(236px,1.2fr)] gap-4 phone:min-w-0 phone:grid-cols-2 phone:gap-3">
            <div
              class="min-h-[82px] rounded-lg border border-[var(--brand-brand-secondary-contrast)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-navy-950)_54%,var(--button-button-bg-secondary-left-enabled)_46%)_0%,color-mix(in_srgb,var(--color-navy-950)_50%,var(--button-button-bg-secondary-right-enabled)_50%)_100%)] px-4 py-3 phone:col-span-2"
            >
              <div class="whitespace-nowrap text-xs leading-4 text-[var(--color-light-600)] phone:whitespace-normal">{{ referralCodeText }}</div>
              <div class="mt-1 flex items-center gap-2">
                <span class="min-w-0 truncate text-2xl font-bold leading-8 text-[var(--text-text-primary)] phone:text-[26px] phone:leading-9">
                  {{ statistics?.referral_code || "-" }}
                </span>
                <button
                  type="button"
                  class="shrink-0 text-[var(--color-light-700)] hover:text-[var(--text-text-primary)]"
                  :aria-label="descriptionTitleText"
                  @click="openDescriptionDialog"
                >
                  <BaseIcon name="mdi:share-variant" size="16px" />
                </button>
                <button type="button" class="shrink-0 text-[var(--color-light-700)] hover:text-[var(--text-text-primary)]" @click="copyReferralCode">
                  <BaseIcon name="mdi:content-copy" size="16px" />
                </button>
                <span v-if="copiedReferralCode" class="shrink-0 text-xs text-[var(--color-light-700)]">{{ copiedText }}</span>
              </div>
            </div>

            <div
              class="min-h-[82px] rounded-lg border border-[var(--card-card-border-pink)] bg-[var(--card-card-bg-pink)] px-4 py-3"
            >
              <div class="whitespace-nowrap text-xs leading-4 text-[var(--color-light-600)] phone:whitespace-normal">{{ activeMemberText }}</div>
              <div class="mt-1 text-2xl font-bold leading-8 text-[var(--text-text-primary)] phone:text-[26px] phone:leading-9">
                {{ isStatisticsLoading ? "-" : formatNumber(statistics?.active_member_count) }}
              </div>
            </div>

            <div
              class="min-h-[82px] rounded-lg border border-[var(--card-card-border-pink)] bg-[var(--card-card-bg-pink)] px-4 py-3"
            >
              <div class="whitespace-nowrap text-xs leading-4 text-[var(--color-light-600)] phone:whitespace-normal">{{ validBetText }}</div>
              <div class="mt-1 text-2xl font-bold leading-8 text-[var(--text-text-primary)] phone:text-[26px] phone:leading-9">
                {{ isStatisticsLoading ? "-" : formatNumber(statistics?.valid_bet_amount) }}
              </div>
            </div>
          </div>
        </section>

        <section class="overflow-hidden rounded-lg phone:rounded-md">
          <div class="flex items-end gap-1 px-0 pb-0 phone:gap-0">
            <button type="button" :class="tabButtonClass('invitation')" @click="changeTab('invitation')">
              {{ invitationTabText }}
            </button>
            <button type="button" :class="tabButtonClass('rebate')" @click="changeTab('rebate')">
              {{ rebateTabText }}
            </button>
          </div>

          <div class="overflow-hidden rounded-b-lg bg-[var(--color-navy-950)] phone:rounded-b-md">
            <div class="px-6 pb-5 pt-4 phone:px-2 phone:py-4">
              <div
                v-if="activeTab === 'invitation'"
                class="grid grid-cols-[minmax(0,260px)_minmax(0,260px)_104px] items-end gap-3 phone:grid-cols-1 phone:gap-3"
              >
                <BaseInput
                  v-model="invitationFilters.memberAccount"
                  :label="memberAccountLabel"
                  :placeholder="memberAccountPlaceholder"
                  :class-obj="{
                    root: '!gap-1',
                    label: '!text-xs !leading-4 !text-[var(--color-light-900)]',
                    input: '!min-h-[34px] !h-[34px] !rounded-md !border !border-[var(--brand-brand-secondary-contrast)] !bg-[var(--container-container-field)] !py-0 !text-sm !leading-[32px]'
                  }"
                />

                <BaseSelect
                  v-model="invitationFilters.status"
                  :options="invitationStatusOptions"
                  option-label="label"
                  option-value="value"
                  :label="statusLabel"
                  :class-obj="{
                    wrapper: '!gap-1',
                    label: '!text-xs !leading-4 !text-[var(--color-light-900)]',
                    select: '!min-h-[34px] !h-[34px] !rounded-md !border !border-[var(--brand-brand-secondary-contrast)] !bg-[var(--container-container-field)]',
                    selectLabel: '!py-0 !pl-3 !text-sm !leading-[32px]',
                    dropdown: '!ml-0 !w-8 !text-[var(--text-text-primary)]',
                    panel: '!z-[1100]'
                  }"
                />

                <BaseBtn
                  size="sm"
                  :class-obj="{
                    button:
                      '!h-[34px] !min-h-[34px] !rounded-md !px-3 !py-0 !text-sm !font-bold !text-[var(--button-button-title-secondary-enabled)] !bg-[linear-gradient(90deg,var(--button-button-bg-secondary-left-enabled)_0%,var(--button-button-bg-secondary-right-enabled)_100%)]'
                  }"
                  @click="searchInvitations"
                >
                  {{ searchText }}
                </BaseBtn>
              </div>

              <div v-else class="grid grid-cols-[minmax(0,260px)_104px] items-end gap-3 phone:grid-cols-1 phone:gap-3">
                <BaseDatePicker
                  v-model="rebateFilters.dateRange"
                  selection-mode="range"
                  :label="dateRangeText"
                  placeholder="yyyy-mm-dd ~ yyyy-mm-dd"
                  :class-obj="{
                    root: '!gap-1',
                    label: '!text-xs !leading-4 !text-[var(--color-light-900)]',
                    input: '!h-[34px] !min-h-[34px] !border-0 !bg-[var(--color-transparent)]'
                  }"
                />

                <BaseBtn
                  size="sm"
                  :class-obj="{
                    button:
                      '!h-[34px] !min-h-[34px] !rounded-md !px-3 !py-0 !text-sm !font-bold !text-[var(--button-button-title-secondary-enabled)] !bg-[linear-gradient(90deg,var(--button-button-bg-secondary-left-enabled)_0%,var(--button-button-bg-secondary-right-enabled)_100%)]'
                  }"
                  @click="searchRebates"
                >
                  {{ searchText }}
                </BaseBtn>
              </div>
            </div>

            <div class="min-h-[302px] px-6 pb-4 pt-0 phone:min-h-[432px] phone:px-2 phone:pb-4">
              <div v-if="isActiveListLoading" class="flex min-h-[240px] items-center justify-center text-[var(--color-light-900)]">
                <BaseIcon name="svg-spinners:ring-resize" size="2rem" />
              </div>

            <template v-else-if="activeTab === 'invitation'">
              <div v-if="!invitations.length" class="flex min-h-[360px] flex-col items-center justify-center gap-4 text-sm text-[var(--color-light-700)]">
                <BaseIcon name="mdi:folder-search-outline" size="92px" class="text-[var(--button-button-bg-secondary-left-enabled)]" />
                <span>{{ emptyText }}</span>
              </div>

              <div v-else>
                <div class="overflow-x-auto phone:hidden">
                  <table class="w-full min-w-[920px] table-fixed overflow-hidden rounded-md text-left">
                    <colgroup>
                      <col class="w-[180px]" />
                      <col class="w-[140px]" />
                      <col class="w-[120px]" />
                      <col class="w-[150px]" />
                      <col class="w-[170px]" />
                      <col class="w-[120px]" />
                    </colgroup>
                    <thead class="bg-[var(--table-table-header-bg)] text-sm font-bold text-[var(--table-table-header-title)]">
                      <tr>
                        <th class="whitespace-nowrap px-4 py-3">{{ memberAccountLabel }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-center">{{ depositCountText }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-center">{{ currencyLabel }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-right">{{ depositAmountText }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-right">{{ invitationValidBetText }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-center">{{ statusLabel }}</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm text-[var(--text-text-primary)]">
                      <tr
                        v-for="(item, index) in invitations"
                        :key="`${item.member_id}-${index}`"
                        class="odd:bg-[var(--table-table-content-bg-light)] even:bg-[var(--table-table-content-bg-dark)]"
                      >
                        <td class="whitespace-nowrap px-4 py-3 font-bold">{{ item.member_account }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-center">{{ formatNumber(item.deposit_count) }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-center">{{ item.currency_code || selectedCurrencyCode }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-right">{{ formatNumber(item.deposit_amount) }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-right">{{ formatNumber(item.valid_bet_amount) }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-center">
                          <span :class="statusBadgeClass(item.status)">
                            {{ getInvitationStatusLabel(item.status) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="hidden space-y-3 phone:block">
                  <article
                    v-for="(item, index) in invitations"
                    :key="`mobile-${item.member_id}-${index}`"
                    class="overflow-hidden rounded-xl bg-[var(--table-table-content-bg-light)] text-[var(--text-text-primary)]"
                  >
                    <button
                      type="button"
                      class="flex min-h-[64px] w-full items-center justify-between gap-3 bg-[var(--tag-tag-bg-default)] px-4 py-3 text-left"
                      @click="toggleInvitationMobileCard(index)"
                    >
                      <div class="flex min-w-0 items-center gap-3">
                        <span class="shrink-0 rounded-full bg-[var(--tag-tag-bg-default)] px-3 py-1 text-xs font-bold">
                          {{ item.currency_code || selectedCurrencyCode }}
                        </span>
                        <div class="min-w-0">
                          <div class="truncate text-sm font-bold">{{ item.member_account }}</div>
                          <div class="text-[10px] leading-4 text-[var(--color-light-600)]">{{ memberAccountLabel }}</div>
                        </div>
                      </div>

                      <div class="flex shrink-0 items-center gap-3">
                        <div class="text-right">
                          <div class="text-sm font-bold">{{ formatNumber(item.deposit_count) }}</div>
                          <div class="text-[10px] leading-4 text-[var(--color-light-600)]">{{ depositCountText }}</div>
                        </div>
                        <BaseIcon
                          :name="expandedInvitationKey === getInvitationMobileKey(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                          size="18px"
                        />
                      </div>
                    </button>

                    <div v-if="expandedInvitationKey === getInvitationMobileKey(index)" class="px-4 pb-3 text-xs">
                      <div class="flex items-center justify-between border-b border-[var(--color-light-100)] py-2">
                        <span class="text-[var(--color-light-800)]">{{ depositAmountText }}</span>
                        <span class="font-bold">{{ formatNumber(item.deposit_amount) }}</span>
                      </div>
                      <div class="flex items-center justify-between border-b border-[var(--color-light-100)] py-2">
                        <span class="text-[var(--color-light-800)]">{{ invitationValidBetText }}</span>
                        <span class="font-bold">{{ formatNumber(item.valid_bet_amount) }}</span>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-[var(--color-light-800)]">{{ statusLabel }}</span>
                        <span :class="statusBadgeClass(item.status)">
                          {{ getInvitationStatusLabel(item.status) }}
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </template>

            <template v-else>
              <div v-if="!rebates.length" class="flex min-h-[360px] flex-col items-center justify-center gap-4 text-sm text-[var(--color-light-700)]">
                <BaseIcon name="mdi:folder-search-outline" size="92px" class="text-[var(--button-button-bg-secondary-left-enabled)]" />
                <span>{{ emptyText }}</span>
              </div>

              <div v-else>
                <div class="overflow-x-auto phone:hidden">
                  <table class="w-full min-w-[980px] table-fixed overflow-hidden rounded-md text-left">
                    <colgroup>
                      <col class="w-[180px]" />
                      <col class="w-[220px]" />
                      <col class="w-[120px]" />
                      <col class="w-[210px]" />
                      <col class="w-[120px]" />
                      <col class="w-[160px]" />
                    </colgroup>
                    <thead class="bg-[var(--table-table-header-bg)] text-sm font-bold text-[var(--table-table-header-title)]">
                      <tr>
                        <th class="whitespace-nowrap px-4 py-3">{{ rebateSettlementTimeText }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-center">{{ rebateAchievedActiveMembersText }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-center">{{ currencyLabel }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-right">{{ rebateAchievedValidBetText }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-center">{{ rebateLevelText }}</th>
                        <th class="whitespace-nowrap px-4 py-3 text-right">{{ rebateAmountText }}</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm text-[var(--text-text-primary)]">
                      <tr
                        v-for="item in rebates"
                        :key="item.id"
                        class="odd:bg-[var(--table-table-content-bg-light)] even:bg-[var(--table-table-content-bg-dark)]"
                      >
                        <td class="whitespace-nowrap px-4 py-3">{{ formatDateTime(item.settled_time) }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-center">{{ formatNumber(item.active_member_count) }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-center">{{ item.currency_code || selectedCurrencyCode }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-right">{{ formatNumber(item.valid_bet_amount) }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-center">{{ item.level }}</td>
                        <td class="whitespace-nowrap px-4 py-3 text-right">{{ formatNumber(item.rebate_amount) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="hidden space-y-3 phone:block">
                  <article
                    v-for="(item, index) in rebates"
                    :key="`mobile-rebate-${item.id}`"
                    class="overflow-hidden rounded-xl bg-[var(--table-table-content-bg-light)] text-[var(--text-text-primary)]"
                  >
                    <button
                      type="button"
                      class="flex min-h-[64px] w-full items-center justify-between gap-3 bg-[var(--tag-tag-bg-default)] px-4 py-3 text-left"
                      @click="toggleRebateMobileCard(index)"
                    >
                      <div class="flex min-w-0 items-center gap-3">
                        <span class="shrink-0 rounded-full bg-[var(--tag-tag-bg-default)] px-3 py-1 text-xs font-bold">
                          {{ item.currency_code || selectedCurrencyCode }}
                        </span>
                        <div class="min-w-0">
                          <div class="truncate text-sm font-bold">{{ formatDateTime(item.settled_time) }}</div>
                          <div class="text-[10px] leading-4 text-[var(--color-light-600)]">{{ rebateSettlementTimeText }}</div>
                        </div>
                      </div>

                      <div class="flex shrink-0 items-center gap-3">
                        <div class="text-right">
                          <div class="text-sm font-bold">{{ item.level }}</div>
                          <div class="text-[10px] leading-4 text-[var(--color-light-600)]">{{ rebateLevelText }}</div>
                        </div>
                        <BaseIcon
                          :name="expandedRebateKey === getRebateMobileKey(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                          size="18px"
                        />
                      </div>
                    </button>

                    <div v-if="expandedRebateKey === getRebateMobileKey(index)" class="px-4 pb-3 text-xs">
                      <div class="flex items-center justify-between border-b border-[var(--color-light-100)] py-2">
                        <span class="text-[var(--color-light-800)]">{{ rebateAchievedActiveMembersText }}</span>
                        <span class="font-bold">{{ formatNumber(item.active_member_count) }}</span>
                      </div>
                      <div class="flex items-center justify-between border-b border-[var(--color-light-100)] py-2">
                        <span class="text-[var(--color-light-800)]">{{ rebateAchievedValidBetText }}</span>
                        <span class="font-bold">{{ formatNumber(item.valid_bet_amount) }}</span>
                      </div>
                      <div class="flex items-center justify-between py-2">
                        <span class="text-[var(--color-light-800)]">{{ rebateAmountText }}</span>
                        <span class="font-bold">{{ formatNumber(item.rebate_amount) }}</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </template>
          </div>

          <div class="flex justify-end px-4 pb-4 phone:justify-center">
            <BasePagination
              :model-value="activePagination.page"
              :rows="activePagination.pageSize"
              :total-records="activePagination.total"
              :class-obj="{ root: '!gap-1.5', pageButton: '!w-[30px] !h-[30px] !rounded !p-0', navButton: '!w-[30px] !h-[30px] !rounded !p-0' }"
              @update:model-value="updateActivePage"
            />
          </div>
          </div>
        </section>
      </div>
    </div>

    <BaseDialog
      v-model:visible="isDescriptionDialogVisible"
      :class-obj="{
        root:
          '!w-[550px] !max-w-[550px] !rounded-lg phone:!h-auto phone:!max-h-[80dvh] phone:!w-[calc(100vw-32px)] phone:!max-w-[calc(100vw-32px)] phone:!rounded-lg phone:!m-0',
        mask: '!backdrop-blur-0 !bg-[color-mix(in_srgb,var(--color-black)_85%,var(--color-transparent)_15%)]',
        header: '!h-[60px] !py-0 !px-5 phone:!h-[60px] phone:!px-5',
        title: '!text-[24px] !leading-8 phone:!text-xl phone:!leading-7',
        closeBtn: '!top-5 !right-5',
        body: '!gap-0 !px-5 !py-6 !text-base !leading-7 phone:!px-5 phone:!py-6',
        footer: '!hidden'
      }"
      @close="isDescriptionDialogVisible = false"
    >
      <template #header>{{ statisticDescriptionTitle }}</template>

      <p class="whitespace-pre-wrap break-words text-[var(--dialog-dialog-title-content)]">
        {{ statisticDetailText || "-" }}
      </p>
    </BaseDialog>
  </section>
</template>
