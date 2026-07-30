<template>
  <div class="member-messenger-panel flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-x-clip">
    <div
      class="member-messenger-panel-card flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-x-clip"
      :class="isMobile ? 'border-0 p-0' : 'rounded-lg border border-solid p-5'"
    >
      <section class="member-messenger-panel__filters w-full min-w-0 shrink-0">
        <div :class="isMobile ? 'flex w-full min-w-0 flex-col gap-4' : 'flex w-full flex-nowrap items-end gap-5'">
          <div
            class="flex"
            :class="isMobile ? 'w-full min-w-0 flex-col gap-4' : 'flex-nowrap shrink-0 items-end gap-5'"
          >
            <div class="flex w-full min-w-0 flex-col gap-1.5" :class="isMobile ? '' : 'min-w-[300px] max-w-[480px]'">
              <span class="member-messenger-filter-label text-sm font-normal">{{ t("member.messenger.date") }}</span>
              <date-picker
                :value="filterDateTimeRange"
                range
                type="datetime"
                value-type="timestamp"
                format="YYYY-MM-DD HH:mm"
                :editable="false"
                clearable
                class="member-messenger-dtpicker block w-full max-w-full text-sm font-normal"
                popup-class="member-messenger-dtpicker-popup"
                @update:value="onFilterDateTimeRangeUpdate"
              />
            </div>

            <div
              class="flex w-full min-w-0 flex-col gap-1.5"
              :class="isMobile ? '' : 'w-[180px] shrink-0 sm:w-[220px]'"
            >
              <span class="member-messenger-filter-label text-sm font-normal">{{ t("member.messenger.status") }}</span>
              <q-select
                v-model="statusFilter"
                class="member-messenger-filter-select text-sm font-normal"
                input-class="text-sm font-normal"
                popup-content-class="member-messenger-filter-select-popup"
                outlined
                dense
                emit-value
                map-options
                hide-bottom-space
                :options="statusSelectOptions"
              />
            </div>
          </div>

          <div :class="isMobile ? 'w-full min-w-0' : 'ml-auto shrink-0 self-end'">
            <q-btn
              color="primary"
              :dense="isMobile"
              no-caps
              :label="t('member.messenger.search')"
              class="member-messenger-search-btn !rounded-lg"
              :class="isMobile ? 'w-full min-h-10' : '!px-[32px] !py-[10px]'"
              @click="handleSearchClick"
            />
          </div>
        </div>
      </section>

      <div class="member-messenger-toolbar-divider my-5 w-full min-w-0 shrink-0 border-t"></div>

      <div v-if="$slots['toolbar-extra']" class="member-messenger-panel__toolbar mb-2.5 w-full min-w-0 shrink-0">
        <slot name="toolbar-extra" />
      </div>

      <div v-if="!isMobile" class="member-messenger-table-wrap min-h-80 flex-1 overflow-auto">
        <q-table
          flat
          row-key="id"
          :rows="rows"
          :columns="columns"
          hide-pagination
          :rows-per-page-options="[MEMBER_MESSENGER_ROWS_PER_PAGE]"
          table-header-class="member-messenger-table-cell text-sm font-semibold"
          :class="isMobile ? 'inbox-table' : 'inbox-table inbox-table--pc'"
        >
          <template #body-cell-time="props">
            <q-td :props="props" :class="getTableCellClasses(props)">
              {{ props.row.time }}
            </q-td>
          </template>
          <template #body-cell-title="props">
            <q-td :props="props" :class="[getTableCellClasses(props), 'member-messenger-title-cell']">
              <span class="member-messenger-row-title block truncate" :title="props.row.title">{{
                props.row.title
              }}</span>
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props" :class="getTableCellClasses(props)">
              <span :class="[getMessengerListStatusTagClasses(props.row.statusType)]">
                {{ props.row.status }}
              </span>
            </q-td>
          </template>
          <template #body-cell-action="props">
            <q-td :props="props" :class="getTableCellClasses(props)">
              <div class="flex items-center justify-center gap-2">
                <q-btn
                  class="view-btn-desktop"
                  flat
                  dense
                  no-caps
                  padding="4px 12px"
                  :label="t('member.messenger.view')"
                  @click="emit('view', props.row)"
                />
                <slot name="row-actions-extra" :row="props.row" />
              </div>
            </q-td>
          </template>
          <template #no-data>
            <div class="q-pa-md text-center text-sm text-grey-6">
              {{ t("tableHeader.no_data") }}
            </div>
          </template>
        </q-table>
      </div>

      <div
        v-else
        class="member-messenger-panel__body member-messenger-mobile-list min-h-0 min-w-0 w-full flex-1 overflow-y-auto overflow-x-hidden pb-3"
      >
        <div v-if="rows.length > 0" class="flex flex-col gap-3 pb-1">
          <section v-for="row in rows" :key="row.id" class="min-w-0 w-full max-w-full rounded-lg">
            <div
              class="member-messenger-mobile-card box-border w-full min-w-0 max-w-full overflow-hidden rounded-2xl border"
            >
              <div class="p-2.5">
                <div class="flex items-center justify-between gap-2">
                  <div class="member-messenger-mobile-card-time min-w-0 flex-1 text-left text-xs leading-4">
                    {{ row.time }}
                  </div>
                  <span :class="[getMessengerListStatusTagClasses(row.statusType), 'shrink-0']">{{ row.status }}</span>
                </div>
                <div class="member-messenger-mobile-card-title mt-2 truncate text-base leading-6" :title="row.title">
                  {{ row.title }}
                </div>
              </div>
              <div class="member-messenger-mobile-card-actions mt-5 box-border max-w-full p-2.5">
                <div class="member-messenger-mobile-card-actions__row grid w-full min-w-0 max-w-full gap-2">
                  <slot name="row-actions-extra-mobile" :row="row" />
                  <q-btn
                    class="view-btn-mobile w-full min-h-10 min-w-0"
                    unelevated
                    no-caps
                    padding="4px 12px"
                    :label="t('member.messenger.view')"
                    @click="emit('view', row)"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
        <div v-else class="q-pa-md text-center text-sm text-grey-6">沒有資料</div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex shrink-0 justify-end pt-6">
      <q-pagination
        v-model="page"
        :max="totalPages"
        :max-pages="7"
        direction-links
        boundary-links
        color="grey-7"
        active-color="primary"
        active-design="flat"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "vue-datepicker-next/index.css"

import type { QTableProps } from "quasar"
import type { MemberMessengerInboxRequest } from "src/api/memberMessenger.type"
import {
  mapMemberMessengerListToView,
  MEMBER_MESSENGER_ROWS_PER_PAGE,
  type MemberMessengerPanelRow,
  useInboxMessages,
  useOutboxMessages,
} from "src/common/composables/useMemberMessenger"
import { useRfc3339 } from "src/common/composables/useRfc3339"
import {
  getMessengerListStatusTagClasses,
  MemberMessengerStatus,
  MemberMessengerTab,
  type MemberMessengerStatusFilterOptionDef,
} from "src/common/utils/constants/memberMessenger"
import type { Ref } from "vue"
import { computed, inject, ref } from "vue"
import DatePicker from "vue-datepicker-next"
import { useI18n } from "vue-i18n"

const props = defineProps<{
  /** 此面板對應的頁籤（收件匣 / 寄件匣）；父層應僅在該頁籤顯示時掛載本元件（例如 `v-if`） */
  tab: MemberMessengerTab
  statusOptionDefs: MemberMessengerStatusFilterOptionDef[]
}>()

const emit = defineEmits<{
  (e: "view", row: MemberMessengerPanelRow): void
}>()

const { t, locale } = useI18n()
const { formatDateTime } = useRfc3339()
const isMobile = inject<Ref<boolean>>("isMobile", ref(false))

const filterDateTimeRange = ref<number[] | null>(null)
const statusFilter = ref(MemberMessengerStatus.All)
const page = ref(1)

/** 與舊行為一致：僅「搜尋」或分頁時套用條件，不在日期／狀態每次變更就打 API */
function readListFilterBody(): Omit<MemberMessengerInboxRequest, "offset" | "size"> {
  const body: Omit<MemberMessengerInboxRequest, "offset" | "size"> = {}
  if (filterDateTimeRange.value?.length === 2) {
    body.start_date = filterDateTimeRange.value[0]
    body.end_date = filterDateTimeRange.value[1]
  }
  if (props.tab === MemberMessengerTab.Outbox) {
    body.status = statusFilter.value
  } else if (statusFilter.value !== MemberMessengerStatus.All) {
    body.status = statusFilter.value
  }
  return body
}

const listFilterBody = ref<Omit<MemberMessengerInboxRequest, "offset" | "size">>(readListFilterBody())

const listParams = computed<MemberMessengerInboxRequest>(() => ({
  ...listFilterBody.value,
  size: MEMBER_MESSENGER_ROWS_PER_PAGE,
  offset: (page.value - 1) * MEMBER_MESSENGER_ROWS_PER_PAGE,
}))

const inboxQueryEnabled = computed(() => props.tab === MemberMessengerTab.Inbox)
const outboxQueryEnabled = computed(() => props.tab === MemberMessengerTab.Outbox)

const inboxQuery = useInboxMessages(listParams, { enabled: inboxQueryEnabled })
const outboxQuery = useOutboxMessages(listParams, { enabled: outboxQueryEnabled })

const listData = computed(() =>
  props.tab === MemberMessengerTab.Inbox ? inboxQuery.data.value : outboxQuery.data.value
)

const messagesView = computed(() => mapMemberMessengerListToView(listData.value, locale.value, t, formatDateTime))

const rows = computed(() => messagesView.value?.rows ?? [])

const totalPages = computed(() => {
  const total = messagesView.value?.pagination?.total ?? 0
  return Math.max(1, Math.ceil(total / MEMBER_MESSENGER_ROWS_PER_PAGE))
})

const statusSelectOptions = computed(() =>
  props.statusOptionDefs.map((def) => ({
    label: t(def.labelKey),
    value: def.value,
  }))
)

const columns = computed<QTableProps["columns"]>(() => [
  { name: "title", label: t("member.messenger.subject"), field: "title", align: "left" },
  { name: "time", label: t("member.messenger.time"), field: "time", align: "center" },
  { name: "status", label: t("member.messenger.status"), field: "status", align: "center" },
  { name: "action", label: t("member.messenger.action"), field: "action", align: "center" },
])

function onFilterDateTimeRangeUpdate(val: number[] | null) {
  filterDateTimeRange.value = val
}

function handleSearchClick() {
  page.value = 1
  listFilterBody.value = readListFilterBody()
}

function getTableCellClasses(props: { rowIndex: number }) {
  const stripe = props.rowIndex % 2 === 0 ? "member-messenger-table-cell--odd" : "member-messenger-table-cell--even"
  return ["member-messenger-table-cell", stripe]
}
</script>

<style lang="scss" scoped>
.member-messenger-panel,
.member-messenger-panel-card,
.member-messenger-panel__filters,
.member-messenger-panel__toolbar,
.member-messenger-panel__body {
  @apply w-full min-w-0 max-w-full;
  box-sizing: border-box;
}

.member-messenger-panel__toolbar :deep(.member-messenger-compose-btn) {
  @apply w-auto max-w-full;
}

.member-messenger--mobile .member-messenger-panel__toolbar :deep(.member-messenger-compose-btn) {
  @apply w-full;
}

.member-messenger-mobile-card-actions__row {
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  overflow: hidden;

  > * {
    @apply min-w-0 overflow-hidden;
  }

  :deep(.q-btn) {
    @apply w-full max-w-full min-w-0 !important;
  }

  :deep(.q-btn__wrapper) {
    @apply flex min-h-10 w-full max-w-full min-w-0 items-center justify-center px-2;
  }

  :deep(.q-btn__content) {
    @apply flex min-w-0 items-center justify-center truncate leading-normal;
  }
}

.inbox-table {
  @apply rounded-[14px] border border-transparent;
}

.inbox-table :deep(thead) {
  background-image: linear-gradient(
    90deg,
    transparent 0,
    transparent 1rem,
    var(--member-messenger-thead-border-bottom, transparent) 1rem,
    var(--member-messenger-thead-border-bottom, transparent) calc(100% - 1rem),
    transparent calc(100% - 1rem),
    transparent 100%
  );
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: 100% 1px;
}

.inbox-table :deep(thead tr th) {
  @apply border-l-0 border-r-0 border-t-0 border-b-0 bg-transparent px-4 !important;
  color: var(--member-messenger-thead-color, inherit) !important;
}

.inbox-table :deep(tbody tr td) {
  @apply border-0 !important;
}

.view-btn-desktop,
.view-btn-mobile {
  &.q-btn--dense :deep(.q-btn__wrapper),
  :deep(.q-btn__wrapper) {
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
  }
}

.view-btn-mobile {
  @apply rounded-xl;
}

.status-tag {
  @apply inline-flex min-w-[52px] items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium leading-4;
}

.inbox-table--pc :deep(.q-table) {
  @apply w-full table-fixed;
}

.inbox-table--pc :deep(.q-table thead th),
.inbox-table--pc :deep(.q-table tbody td) {
  @apply w-1/4;
}

.inbox-table :deep(.member-messenger-title-cell) {
  @apply max-w-0 overflow-hidden;
}

.member-messenger-dtpicker {
  @apply block w-full max-w-full;

  :deep(.mx-datepicker) {
    @apply block w-full max-w-full;
  }

  :deep(.mx-input-wrapper) {
    @apply block w-full max-w-full;
  }

  :deep(.mx-input) {
    @apply box-border block h-12 w-full max-w-full rounded-2xl border border-solid pl-3 pr-10 py-0 text-sm leading-[3rem] outline-none;
    box-shadow: var(--member-messenger-filter-shadow, 0 0 6px 0 rgb(0 0 0 / 0.2));
  }

  :deep(.mx-icon-calendar),
  :deep(.mx-icon-clear) {
    color: var(--member-messenger-dtpicker-icon-color, rgba(0, 0, 0, 0.45));
  }

  :deep(.mx-icon-clear:hover) {
    color: var(--member-messenger-dtpicker-icon-hover-color, rgba(0, 0, 0, 0.75));
  }
}

.member-messenger-filter-select {
  :deep(.q-field__control) {
    @apply box-border h-12 min-h-12 rounded-2xl px-3 !important;
    overflow: visible !important;
    box-shadow: var(--member-messenger-filter-shadow, 0 0 6px 0 rgb(0 0 0 / 0.2));

    &::before {
      @apply rounded-2xl border border-solid;
    }

    &::after {
      @apply rounded-2xl border border-solid;
      border-color: transparent;
    }
  }

  // 與 date picker 一致：focus 只改 ::before 邊框，不用 Quasar 預設 2px ::after 外框
  :deep(.q-field--focused .q-field__control::after),
  :deep(.q-field--highlighted .q-field__control::after) {
    border-width: 1px !important;
    transform: none !important;
  }

  :deep(.q-field__control-container) {
    @apply h-full py-0 !important;
  }

  :deep(.q-field__native) {
    @apply min-h-0 py-4 leading-4 !important;
  }
}
</style>

<style lang="scss">
.member-messenger-dtpicker-popup {
  @apply z-[7001] !important;
}
</style>
