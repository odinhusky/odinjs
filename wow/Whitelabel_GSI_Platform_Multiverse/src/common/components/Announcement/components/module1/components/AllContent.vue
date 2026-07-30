<template>
  <div :class="rootClass" :role="rootRole" :aria-modal="rootAriaModal" @click.self="handleRootClick">
    <div :class="containerClass">
      <header class="dialog-header" :class="cx(getClass('header'))">
        <span class="dialog-title" :class="cx(getClass('dialogTitle'))">{{ t("menu.announcement") }}</span>
        <q-icon
          v-if="!isPageMode"
          name="close"
          size="20px"
          class="cursor-pointer"
          :class="cx('text-[var(--dialog-text-02)]', getClass('closeIconBtn'))"
          @click="emitClose"
        />
        <!-- <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="cx('cursor-pointer', getClass('closeIconBtn'))"
          @click="emitClose"
        >
          <path
            d="M10 11.2776L5.52852 15.749C5.36122 15.9163 5.14829 16 4.88973 16sC4.63118 16 4.41825 15.9163 4.25095 15.749C4.08365 15.5817 4 15.3688 4 15.1103C4 14.8517 4.08365 14.6388 4.25095 14.4715L8.72243 10L4.25095 5.52852C4.08365 5.36122 4 5.14829 4 4.88973C4 4.63118 4.08365 4.41825 4.25095 4.25095C4.41825 4.08365 4.63118 4 4.88973 4C5.14829 4 5.36122 4.08365 5.52852 4.25095L10 8.72243L14.4715 4.25095C14.6388 4.08365 14.8517 4 15.1103 4C15.3688 4 15.5817 4.08365 15.749 4.25095C15.9163 4.41825 16 4.63118 16 4.88973C16 5.14829 15.9163 5.36122 15.749 5.52852L11.2776 10L15.749 14.4715C15.9163 14.6388 16 14.8517 16 15.1103C16 15.3688 15.9163 15.5817 15.749 15.749C15.5817 15.9163 15.3688 16 15.1103 16C14.8517 16 14.6388 15.9163 14.4715 15.749L10 11.2776Z"
            :class="cx('fill-[var(--dialog-text-02)]', getClass('closeIconBtn'))"
          />
        </svg> -->
      </header>

      <div
        :class="
          cx('dialog-body', getClass('body'), {
            'dialog-body--advanced': isAdvancedFiltersEnabled,
          })
        "
      >
        <div v-if="isAdvancedFiltersEnabled" class="announcement-filter-bar">
          <div class="announcement-filter-bar__inner">
            <div class="filter-group filter-group--type">
              <span class="filter-label">{{ t("announce_type") }}</span>
              <q-select
                v-model="announcementType"
                :options="announcementTypes"
                emit-value
                map-options
                outlined
                dense
                :class="cx('select-announcement-type-toolbar', getClass('selectAnnouncementType'))"
                behavior="menu"
                popup-content-class="announcement-type-menu-popup"
                @update:model-value="onAnnouncementTypeChange"
              >
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="nav-filter-panel">
              <div class="filter-group">
                <span class="filter-label">{{ t("announce_date_range") }}</span>
                <div class="filter-date-row">
                  <q-input
                    :model-value="dateRangeDisplayString"
                    readonly
                    dense
                    outlined
                    class="filter-date-range-input"
                    @click="openDateRangePopup"
                  >
                    <template #append>
                      <q-icon
                        v-if="hasDateRangeSelection"
                        name="close"
                        class="cursor-pointer"
                        @click.stop="clearDateRange"
                      />
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          ref="dateRangePopupRef"
                          transition-show="jump-down"
                          transition-hide="jump-up"
                          anchor="bottom right"
                          self="top right"
                          class="announcement-date-popup"
                          :offset="[0, 8]"
                        >
                          <q-card class="announcement-date-pop">
                            <div class="announcement-date-shortcuts" role="tablist" :aria-busy="isLoading">
                              <q-btn
                                v-for="filter in announcementQuickFilters"
                                :key="filter.value"
                                type="button"
                                unelevated
                                no-caps
                                dense
                                :ripple="false"
                                role="tab"
                                class="quick-filter-tab"
                                :class="{ 'quick-filter-tab--active': announcementQuickFilter === filter.value }"
                                :aria-selected="announcementQuickFilter === filter.value"
                                @click="handleQuickFilterClick(filter.value)"
                              >
                                {{ filter.label }}
                              </q-btn>
                            </div>
                            <q-date
                              v-model="dateRangeQModel"
                              range
                              mask="YYYY-MM-DD"
                              class="announcement-date-picker"
                            />
                          </q-card>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="filter-group filter-group--keyword">
                <span class="filter-label">{{ t("announce_keyword") }}</span>
                <q-input
                  v-model="keywordModel"
                  dense
                  outlined
                  class="keyword-input"
                  @keyup.enter="handleSearchClick"
                  :placeholder="t('interest.placeholder')"
                />
              </div>

              <div class="filter-group filter-group--search">
                <q-btn
                  unelevated
                  dense
                  class="filter-search-btn"
                  :disable="isSearchDisabled"
                  @click="handleSearchClick"
                >
                  {{ t("common.btn.search") }}
                </q-btn>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-body-columns">
          <div v-if="shouldShowSidebar" :class="cx('body-nav', getClass('bodyNav'))">
            <div v-if="!isAdvancedFiltersEnabled" :class="cx('nav-type-wrapper', getClass('navTypeWrapper'))">
              <div class="nav-type-content">
                <span class="nav-type-value">{{ $t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[announcementType]) }}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2.40039C12.4418 2.40039 12.8 2.75856 12.8 3.20039V12.8004C12.8 13.2422 12.4418 13.6004 12 13.6004H4.00001C3.55818 13.6004 3.20001 13.2422 3.20001 12.8004V3.20039C3.20001 2.75856 3.55818 2.40039 4.00001 2.40039H12ZM4.80001 11.2004V12.1605H11.2V11.2004H4.80001ZM4.80001 9.84024H11.2V8.88008H4.80001V9.84024ZM4.80001 7.44023H11.2V6.48008H4.80001V7.44023ZM4.80001 5.04023H8.80001V4.08008H4.80001V5.04023Z"
                    :class="cx('fill-[var(--icon-02)]', getClass('allIcon'))"
                  />
                </svg>
                <q-menu
                  v-if="announcementTypes.length"
                  :class="
                    cx(
                      'min-w-[6.25rem] rounded-[.25rem] bg-[var(--bg-08)] border-2 border-[var(--bg-line-02)] shadow-[0_0_4px_0_#ffffff40]',
                      getClass('qMenu')
                    )
                  "
                  anchor="bottom left"
                  self="top left"
                  :offset="[8, 6]"
                >
                  <div
                    v-for="type in announcementTypes"
                    :key="`nav-type-${type.value}`"
                    :class="
                      cx(
                        'nav-type-item py-2 px-[.625rem] text-[var(--btn-text-05)] cursor-pointer',
                        getClass('menuItem'),
                        {
                          [`bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)] ${getClass(
                            'menuItemActive'
                          )}`]: announcementType === type.value,
                        }
                      )
                    "
                    @click="
                      () => {
                        announcementType = type.value
                        currentIndex = 0
                      }
                    "
                  >
                    <div class="text-[.875rem] leading-[1.1875rem] text-center">
                      {{ type.label }}
                    </div>
                  </div>
                </q-menu>
              </div>
            </div>

            <div :class="cx('sidebar-wrapper', getClass('sidebarWrapper'))">
              <div class="sidebar-list">
                <button
                  v-for="(item, idx) in announcementsFiltered"
                  :key="item.id"
                  type="button"
                  :class="
                    cx('sidebar-item', {
                      'sidebar-item--advanced': isAdvancedFiltersEnabled,
                      [`active ${getClass('sidebarActiveTab')}`]: idx === currentIndex,
                    })
                  "
                  @click="select(idx)"
                >
                  <div class="sidebar-item-content">
                    <div class="sidebar-item-header">
                      <span class="sidebar-type-tag">{{ $t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[item.type]) }}</span>
                      <span v-if="isAdvancedFiltersEnabled" class="sidebar-date">{{
                        formatAnnouncementDate(item.start_time)
                      }}</span>
                    </div>
                    <span :class="cx('sidebar-text', getClass('sidebarTabText'))">{{
                      item.langDetail?.title || ""
                    }}</span>
                  </div>
                </button>
              </div>

              <div v-if="shouldShowPagination" class="sidebar-pagination">
                <q-pagination
                  :model-value="announcementPage"
                  :max="paginationMax"
                  max-pages="5"
                  :boundary-numbers="false"
                  direction-links
                  flat
                  active-design="flat"
                  color="deep-grey"
                  active-color="blue-8"
                  icon-prev="arrow_left"
                  icon-next="arrow_right"
                  @update:model-value="handlePageClick"
                />
              </div>
            </div>
          </div>

          <div :class="cx('body-content', getClass('bodyContent'))">
            <template v-if="currentAnnouncement">
              <div class="announcement-detail-pc">
                <div class="sidebar-item-header sidebar-item-header--detail">
                  <span class="sidebar-type-tag">{{
                    $t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[currentAnnouncement.type])
                  }}</span>
                  <span v-if="isAdvancedFiltersEnabled" class="sidebar-date">{{ t("announcement_date") }}</span>
                  <span v-if="isAdvancedFiltersEnabled" class="sidebar-date">{{
                    formatAnnouncementDate(currentAnnouncement.start_time)
                  }}</span>
                </div>
                <h3 :class="cx('detail-title', '!text-[var(--text-02)]', getClass('detailTitle'))">
                  {{ currentAnnouncement.langDetail?.title }}
                </h3>
                <div
                  :class="cx('detail-body', getClass('detailBody'))"
                  v-html="currentAnnouncement.langDetail?.content"
                ></div>
              </div>

              <div class="announcement-list-h5">
                <div
                  v-for="(item, idx) in announcementsFiltered"
                  :key="`announcement-h5-${item.id ?? idx}`"
                  class="mobile-announcement-item"
                  :class="{ active: isMobileExpanded(item, idx) }"
                >
                  <button
                    type="button"
                    class="flex w-full items-center justify-between gap-[.625rem] text-left transition-colors duration-300"
                    :class="isMobileExpanded(item, idx) ? '' : ''"
                    :aria-expanded="isMobileExpanded(item, idx)"
                    :aria-controls="`announcement-panel-${item.id ?? idx}`"
                    @click="toggleMobile(item, idx)"
                  >
                    <div class="mobile-announcement-header">
                      <div class="mobile-announcement-meta">
                        <span class="sidebar-type-tag">{{ $t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[item.type]) }}</span>
                        <span v-if="isAdvancedFiltersEnabled" class="mobile-announcement-date">
                          {{ formatAnnouncementDate(item.start_time) }}
                        </span>
                      </div>
                      <span class="mobile-announcement-title">
                        {{ item.langDetail?.title || "" }}
                      </span>
                    </div>
                  </button>
                  <transition name="collapse">
                    <div
                      v-if="isMobileExpanded(item, idx)"
                      :id="`announcement-panel-${item.id ?? idx}`"
                      class="flex flex-col gap-3 pt-3"
                    >
                      <div
                        v-html="item.langDetail?.content"
                        class="text-sm font-normal text-[var(--text-01)]"
                        :class="cx(getClass('detailBody'))"
                      ></div>
                    </div>
                  </transition>
                </div>

                <div v-if="shouldShowPagination" class="mobile-pagination">
                  <q-pagination
                    :model-value="announcementPage"
                    :max="paginationMax"
                    max-pages="5"
                    :boundary-numbers="false"
                    direction-links
                    flat
                    active-design="flat"
                    color="deep-grey"
                    active-color="blue-8"
                    icon-prev="arrow_left"
                    icon-next="arrow_right"
                    @update:model-value="handlePageClick"
                  />
                </div>
              </div>
            </template>

            <div
              v-else-if="shouldShowEmptyAnnouncement"
              :class="cx('announcement-empty', getClass('emptyAnnouncement'))"
            >
              {{ t("announcement.empty") }}
            </div>

            <div
              v-if="showDontShowTodayCheckbox"
              :class="cx('announcement-checkbox-wrapper', getClass('checkboxWrapper'))"
            >
              <q-checkbox
                v-model="dontShowToday"
                :label="t('announcement.dontShowToday')"
                :class="getClass('qCheckbox')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useAnnouncement, type AnnouncementQuickFilterValue } from "src/common/composables/useAnnonucement"
import { ANNOUNCEMENT_MEMBER_TYPE } from "src/common/utils/constants"
import { formatUTCDateTimeWithOffset } from "src/common/utils/dayjsUtils"
import { useEnvInfoStore } from "src/stores/envStore"
import type * as Response from "src/api/response.type"
import type { NestedStyle } from "src/common/components/Announcement/types/announcementTypes"
import { cx } from "app/src/common/utils/cx"
import get from "lodash/get"

type Props = {
  announcements: Response.AnnouncementList
  showDontShowTodayCheckbox?: boolean
  allContentStyleClass?: NestedStyle
  enableAdvancedAnnouncementFilters?: boolean
  displayMode?: "dialog" | "page"
  autoFetchOnMount?: boolean
}

type EmitPayload = {
  dontShowToday?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  announcements: () => [],
  showDontShowTodayCheckbox: false,
  enableAdvancedAnnouncementFilters: false,
  displayMode: "dialog",
  autoFetchOnMount: false,
  allContentStyleClass: () => ({
    header: "",
    body: "",
    nav: {},
    content: {},
  }),
})

const emit = defineEmits<{
  (event: "close", payload?: EmitPayload): void
}>()

const ANNOUNCEMENT_DATE_TIME_FORMAT = "YYYY-MM-DD"
const { t } = useI18n()
const { envInfo } = useEnvInfoStore()
const {
  announcementType,
  announcementTypes,
  allContentAnnouncements,
  announcementQuickFilter,
  announcementStartTimeFrom,
  announcementStartTimeTo,
  announcementKeyword,
  announcementPage,
  announcementPagination,
  announcementTotalPages,
  isAnnouncementDateRangeInvalid,
  isAdvancedFiltersEnabled,
  isLoading,
  hasFetchedAdvancedAnnouncements,
  setAnnouncementDateRange,
  setAnnouncementKeyword,
  applyAnnouncementQuickFilter,
  handleAnnouncementSearch,
  handleAnnouncementPageChange,
  handleAnnouncementTypeChange,
} = useAnnouncement({ enableAdvancedFilters: props.enableAdvancedAnnouncementFilters })
const currentIndex = ref(0)
const dontShowToday = ref(false)
const expandedMobileKey = ref<string | number | null>(null)
const isPageMode = computed(() => props.displayMode === "page")
const rootRole = computed(() => (isPageMode.value ? undefined : "dialog"))
const rootAriaModal = computed(() => (isPageMode.value ? undefined : "true"))
const rootClass = computed(() => cx(isPageMode.value ? "announcement-page" : "dialog-overlay"))
const containerClass = computed(() => cx("dialog-container", { "dialog-container--page": isPageMode.value }))

// 取得外部傳來的樣式 class
const getClass = (key: string) => get(props.allContentStyleClass, key, "")

const sourceAnnouncements = computed(() => {
  return isAdvancedFiltersEnabled.value ? allContentAnnouncements.value : props.announcements
})

const announcementQuickFilters = computed(() => [
  { label: t("announce_all_time"), value: "all" as AnnouncementQuickFilterValue },
  { label: t("common.btn.withinSevenDays"), value: "7d" as AnnouncementQuickFilterValue },
  { label: t("common.btn.one_month"), value: "1m" as AnnouncementQuickFilterValue },
  { label: t("announce_three_months"), value: "3m" as AnnouncementQuickFilterValue },
])

type DateRangeQValue = { from: string; to: string } | string | null
type PopupProxyRef = {
  show: () => void
}

const dateRangeQModel = computed<DateRangeQValue>({
  get: () => {
    const from = announcementStartTimeFrom.value
    const to = announcementStartTimeTo.value
    if (!from && !to) return null
    if (from && to && from === to) return from
    return { from, to }
  },
  set: (val) => {
    if (val == null) {
      setAnnouncementDateRange({ from: "", to: "" })
      return
    }
    if (typeof val === "string") {
      setAnnouncementDateRange({ from: val, to: val })
      return
    }
    setAnnouncementDateRange({ from: val.from ?? "", to: val.to ?? "" })
  },
})

const dateRangeDisplayString = computed(() => {
  const from = announcementStartTimeFrom.value
  const to = announcementStartTimeTo.value
  if (!from && !to) return ""
  if (from && to) return `${from} ~ ${to}`
  return from || to || ""
})

const hasDateRangeSelection = computed(() => !!(announcementStartTimeFrom.value || announcementStartTimeTo.value))
const dateRangePopupRef = ref<PopupProxyRef | null>(null)

function openDateRangePopup() {
  dateRangePopupRef.value?.show()
}

function clearDateRange() {
  setAnnouncementDateRange({ from: "", to: "" })
}

const keywordModel = computed({
  get: () => announcementKeyword.value,
  set: (value: string) => setAnnouncementKeyword(value),
})

const isSearchDisabled = computed(() => isLoading.value || isAnnouncementDateRangeInvalid.value)
const shouldShowPagination = computed(() => isAdvancedFiltersEnabled.value && announcementPagination.value.total > 0)
const paginationMax = computed(() => Math.max(1, announcementTotalPages.value))

onMounted(async () => {
  if (!props.autoFetchOnMount && !isAdvancedFiltersEnabled.value) return
  await handleAnnouncementSearch()
})

watch(
  sourceAnnouncements,
  (list) => {
    if (!list.length) {
      currentIndex.value = 0
    } else if (currentIndex.value >= list.length) {
      currentIndex.value = 0
    }
  },
  { immediate: true }
)

watch(
  () => props.showDontShowTodayCheckbox,
  (flag) => {
    if (!flag) {
      dontShowToday.value = false
    }
  },
  { immediate: true }
)

const announcementsFiltered = computed(() => {
  if (announcementType.value === ANNOUNCEMENT_MEMBER_TYPE.Enums.All) {
    return sourceAnnouncements.value
  }
  return sourceAnnouncements.value.filter((item) => item.type === announcementType.value)
})
const shouldShowSidebar = computed(() => !isAdvancedFiltersEnabled.value || announcementsFiltered.value.length > 0)
const currentAnnouncement = computed(() => announcementsFiltered.value[currentIndex.value] || null)
const shouldShowEmptyAnnouncement = computed(
  () => !currentAnnouncement.value && (!isAdvancedFiltersEnabled.value || hasFetchedAdvancedAnnouncements.value)
)

watch(
  announcementsFiltered,
  (list) => {
    if (!list.length) {
      expandedMobileKey.value = null
      currentIndex.value = 0
      return
    }
    if (expandedMobileKey.value === null) {
      expandedMobileKey.value = getMobileKey(list[0], 0)
      select(0)
      return
    }
    const expandedIndex = list.findIndex((item, index) => getMobileKey(item, index) === expandedMobileKey.value)
    if (expandedIndex === -1) {
      expandedMobileKey.value = getMobileKey(list[0], 0)
      select(0)
      return
    }
    select(expandedIndex)
  },
  { immediate: true }
)

async function onAnnouncementTypeChange() {
  currentIndex.value = 0
  expandedMobileKey.value = announcementsFiltered.value.length ? getMobileKey(announcementsFiltered.value[0], 0) : null
  await handleAnnouncementTypeChange()
}

function select(index: number) {
  if (index < 0 || index >= announcementsFiltered.value.length) {
    return
  }
  currentIndex.value = index
}

function getMobileKey(item: Response.AnnouncementList[number], index: number) {
  return item.id ?? index
}

function isMobileExpanded(item: Response.AnnouncementList[number], index: number) {
  return expandedMobileKey.value === getMobileKey(item, index)
}

function toggleMobile(item: Response.AnnouncementList[number], index: number) {
  const nextKey = getMobileKey(item, index)
  if (expandedMobileKey.value === nextKey) {
    expandedMobileKey.value = null
    return
  }
  expandedMobileKey.value = nextKey
  select(index)
}

async function handleQuickFilterClick(filter: AnnouncementQuickFilterValue) {
  currentIndex.value = 0
  expandedMobileKey.value = null
  await applyAnnouncementQuickFilter(filter)
}

async function handleSearchClick() {
  if (isSearchDisabled.value) return
  currentIndex.value = 0
  expandedMobileKey.value = null
  await handleAnnouncementSearch()
}

async function handlePageClick(page: number) {
  currentIndex.value = 0
  expandedMobileKey.value = null
  await handleAnnouncementPageChange(page)
}

function formatAnnouncementDate(value?: string) {
  if (!value) return ""
  return formatUTCDateTimeWithOffset(value, envInfo.utc_offset, ANNOUNCEMENT_DATE_TIME_FORMAT)
}

function emitClose() {
  const payload = props.showDontShowTodayCheckbox ? { dontShowToday: dontShowToday.value } : undefined
  emit("close", payload)
}

function handleRootClick() {
  if (isPageMode.value) return
  emitClose()
}
</script>

<style scoped lang="scss">
@mixin hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.dialog-overlay {
  @apply fixed inset-0 flex items-center justify-center px-[1rem] py-[3.125rem] z-[5001] bg-[var(--bg-17)];
}

.dialog-container {
  @apply flex flex-col w-full max-w-[71rem] overflow-hidden rounded-[12px] h-[36.25rem] phone:h-full;
  @apply h-[36.25rem] phone:h-[80%];
  min-height: 0;
  max-height: calc(100vh - 6.25rem);
  max-height: calc(100dvh - 6.25rem);
}

.announcement-page {
  @apply flex h-full min-h-0 w-full items-stretch justify-center px-4 py-4;
}

.dialog-container--page {
  @apply h-full max-w-none rounded-[12px];
  min-height: min(42rem, calc(100vh - 8rem));
  max-height: none;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.35);
}

.dialog-header {
  @apply flex items-center justify-between py-4 px-5 bg-[var(--dialog-bg)];

  .dialog-title {
    @apply text-[1.25rem] leading-[1.6875rem] font-bold font-[NotoSans] text-[var(--dialog-text-02)];
  }
}

.dialog-body {
  @apply w-full min-h-0 flex flex-1 flex-row phone:flex-col;
}

.dialog-body--advanced {
  @apply h-full min-h-0 overflow-hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  @include hide-scrollbar;

  .sidebar-list .sidebar-item .sidebar-text {
    display: block;
    width: 100%;
    max-width: 100%;
    line-height: 1.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.dialog-body-columns {
  @apply flex flex-1 min-h-0 min-w-0 w-full overflow-hidden;
  @apply flex-row phone:flex-col;
}

.dialog-body--advanced .dialog-body-columns {
  @apply h-full flex-1 min-h-0 overflow-hidden;
}

.announcement-filter-bar {
  @apply w-full shrink-0 border-b border-[var(--bg-line-01)] bg-[var(--tab-bg-03)];
}

.announcement-filter-bar__inner {
  @apply flex items-end gap-x-4 gap-y-2 px-4 py-3;
  @apply phone:flex-col phone:items-stretch phone:gap-3;
}

.filter-group--type {
  @apply shrink-0;
  @apply phone:w-full;
  width: 15rem;
  flex: 0 0 15rem;
}

@media (max-width: 768px) {
  .filter-group--type {
    flex: 0 0 auto;
  }
}

.select-announcement-type-toolbar {
  @apply w-full min-w-0 max-w-none;
  @apply phone:min-w-0 phone:max-w-none phone:w-full;

  :deep(.q-field__control::before),
  :deep(.q-field__control::after) {
    border: 0;
  }

  :deep(.q-field__control) {
    @apply h-10 min-h-10 rounded-[.375rem] px-3;
    background: var(--bg-08);
    border: 1px solid var(--bg-line-02, transparent);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    color: var(--tab-text-01);
  }

  :deep(.q-field__native) {
    @apply h-10 min-w-0 min-h-0 text-sm font-bold;
    color: var(--tab-text-01);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.q-field__append) {
    @apply h-10 min-h-10;
  }

  :deep(.q-select__dropdown-icon) {
    color: var(--icon-01);
  }
}

.body-nav {
  @apply flex flex-col min-h-0 shrink-0;
  @apply phone:w-full phone:basis-auto;
  @apply h-full phone:h-auto;
}

.dialog-body--advanced .body-nav {
  @apply h-full min-h-0 overflow-hidden phone:hidden;
  width: 270px;
}

.nav-type-wrapper {
  @apply flex items-center gap-[.625rem] px-4 py-[.625rem] bg-[var(--tab-bg-03)] phone:justify-end;

  .nav-type-content {
    @apply flex items-center gap-[.625rem];

    .nav-type-label {
      @apply text-[.875rem] leading-[1rem] font-normal text-[var(--tab-text-01)];
    }

    .nav-type-value {
      @apply text-[1rem] leading-[1.125rem] font-bold  text-[var(--tab-text-01)];
    }
  }
}

.nav-filter-panel {
  @apply flex w-full gap-2;
  @apply phone:flex-col phone:gap-3;
}

.announcement-filter-bar .nav-filter-panel {
  @apply flex items-end gap-x-4 gap-y-3 min-w-0;
  @apply phone:items-stretch phone:gap-3;
}

.filter-group {
  @apply flex w-full items-center gap-3 phone:flex-col phone:items-stretch;
}

.announcement-filter-bar .filter-group {
  @apply w-auto min-w-0 flex-col items-stretch gap-1 phone:flex-col;
  @apply phone:w-full;
}

.announcement-filter-bar .filter-group .filter-label {
  @apply w-full;
}

.announcement-filter-bar .filter-group--keyword {
  @apply min-w-[min(100%,16.5rem)];
  @apply phone:min-w-0;
}

.announcement-filter-bar .filter-group--search {
  @apply flex-none justify-end phone:w-full;
}

.filter-label {
  @apply shrink-0 text-xs text-[var(--tab-text-01)];
}

.announcement-date-shortcuts {
  @apply flex items-center gap-2 rounded-[.375rem] p-1;
  width: max-content;
  max-width: 100%;
  background: var(--bg-08);
  border: 1px solid var(--bg-line-02, transparent);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  flex-wrap: nowrap;
  overflow-x: auto;
}

.quick-filter-tab.q-btn {
  @apply relative z-[1] min-h-9 flex-none rounded-full px-3 text-[.75rem] leading-[1rem] font-bold whitespace-nowrap transition-colors duration-200;
  @apply phone:min-h-8 phone:text-[.625rem];
  min-width: max-content;
  color: var(--tab-text-01);
  background: var(--tab-bg-04, transparent);

  &:disabled {
    opacity: 0.5;
  }

  :deep(.q-btn__content) {
    @apply whitespace-nowrap;
    flex-wrap: nowrap;
    overflow: visible;
    text-overflow: clip;
  }
}

.quick-filter-tab.q-btn.quick-filter-tab--active {
  background: var(--btn-bg-01);
  color: var(--btn-text-05);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.filter-date-row {
  @apply flex items-center gap-2;
  @apply phone:w-full;
}

.filter-date-range-input {
  @apply min-w-[16.5rem] w-[16.5rem] max-w-full flex-none;
  @apply phone:min-w-0 phone:w-auto phone:flex-1;

  :deep(.q-field__control::before),
  :deep(.q-field__control::after) {
    border: 0;
  }

  :deep(.q-field__control) {
    @apply h-10 min-h-10 rounded-[.375rem] px-3;
    background: var(--bg-08);
    border: 1px solid var(--bg-line-02, transparent);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    color: var(--tab-text-01);
  }

  :deep(.q-field__native) {
    @apply h-10 min-h-0 text-sm font-bold leading-10;
    color: var(--tab-text-01);
  }

  :deep(.q-field__append) {
    @apply h-10 min-h-10;
    color: var(--icon-01);
  }
}

.keyword-input {
  @apply flex-1 min-w-[16.5rem];
  @apply phone:min-w-0 phone:w-full;

  :deep(.q-field__control::before),
  :deep(.q-field__control::after) {
    border: 0;
  }

  :deep(.q-field__control) {
    @apply h-10 min-h-10 rounded-[.375rem] px-3;
    background: var(--bg-08);
    border: 1px solid var(--bg-line-02, transparent);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    color: var(--tab-text-01);
  }

  :deep(.q-field__native) {
    @apply h-10 min-h-0 text-sm font-bold leading-10;
    color: var(--tab-text-01);
  }

  :deep(.q-field__prepend) {
    @apply h-10 min-h-10 pr-2;
    color: var(--icon-01);
  }
}

.filter-search-btn {
  @apply h-10 min-h-10 min-w-[6rem] rounded-[.375rem] px-4 text-sm font-bold text-[var(--btn-text-05)];
  @apply phone:w-full;
  background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.sidebar-wrapper {
  @apply flex flex-col flex-1 min-h-0 pt-3 px-1 overflow-hidden bg-[var(--bg-04)];
}

.sidebar-list {
  @apply flex flex-col w-full flex-1 min-h-0 overflow-y-auto rounded-[12px];
  @apply phone:hidden;
  border: 1px solid var(--bg-line-01);
  @include hide-scrollbar;

  .sidebar-item {
    @apply flex items-start py-[.5rem] px-4 h-auto;

    &.sidebar-item--advanced {
      background: var(--card-bg-01);
      border-bottom: 1px solid var(--bg-line-01);
    }

    .sidebar-item-content {
      @apply flex w-full min-w-0 flex-col gap-2;
    }

    .sidebar-text {
      @apply w-full min-w-0 text-[1rem] leading-[1.125rem] text-left font-bold text-ellipsis text-[var(--text-01)];
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .sidebar-date {
      @apply shrink-0 text-[.75rem] leading-[1rem] text-[var(--text-03)];
    }

    &.active {
      background: linear-gradient(90deg, var(--tab-bg-01) 0%, var(--tab-bg-02) 100%);
    }

    &.sidebar-item--advanced.active {
      background: var(--card-bg-02);
    }
  }
}

.sidebar-type-tag {
  @apply shrink-0 px-2.5 py-1 text-[.75rem] font-bold leading-4 whitespace-nowrap;
  border-radius: 100px;
  background: var(--btn-bg-01, #ce4388);
  color: var(--tag-text-01, #ffffff);
}

.sidebar-item-header {
  @apply flex w-full min-w-0 items-center justify-between gap-2;
}

.sidebar-item-header--detail {
  @apply justify-start;
}

.sidebar-item-header .sidebar-date {
  @apply shrink-0 text-[.75rem] leading-[1rem] text-[var(--text-03)];
}

.sidebar-pagination {
  @apply flex shrink-0 items-center justify-center py-3;
  @apply phone:hidden;

  :deep(.q-pagination__content) {
    gap: 0.5rem;
  }

  :deep(.q-btn) {
    @apply min-h-[2rem] min-w-[2rem] rounded-[.25rem] text-[.875rem] font-bold;
    background: var(--bg-pagination, transparent);
    color: var(--text-pagination-enabled, var(--tab-text-01)) !important;
    font-family: Inter, NotoSans, sans-serif;
    line-height: 1.25rem;
    margin: 0;

    &::before {
      box-shadow: none !important;
    }
  }

  :deep(.q-pagination__middle) {
    gap: 0.5rem;
  }

  :deep(.q-pagination__middle button[aria-current="true"]) {
    background: var(--announcement-pagination-active-bg, var(--bg-pagination-active, transparent)) !important;
    color: var(--text-pagination-focused, var(--btn-bg-01, var(--tab-bg-01))) !important;
  }
}

.mobile-pagination {
  @apply flex shrink-0 items-center justify-center pt-1;
}

.body-content {
  @apply flex flex-col flex-1 min-h-0  min-w-0;
  @apply phone:w-full;
  @apply h-full overflow-hidden;
}

.announcement-detail-pc {
  @apply flex-1 p-5 flex flex-col gap-5 min-h-0 overflow-y-auto bg-[var(--bg-04)] phone:hidden;
  @include hide-scrollbar;

  .detail-title {
    @apply text-[1rem] leading-[1.125rem] font-bold text-center;
  }

  .detail-body {
    @apply text-sm text-[var(--text-01)];
  }
}

.announcement-list-h5 {
  @apply hidden phone:flex flex-col flex-1 min-h-0 overflow-y-auto bg-[var(--bg-04)] text-white;
  @apply phone:gap-1 phone:px-3 phone:py-3;
  @apply h-full w-full;
  -webkit-overflow-scrolling: touch;
  @include hide-scrollbar;
}

@media (max-width: 768px) {
  .dialog-body--advanced {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: touch;
  }

  .dialog-body--advanced .dialog-body-columns,
  .dialog-body--advanced .body-content,
  .dialog-body--advanced .announcement-list-h5 {
    flex: 0 0 auto;
    height: auto;
    overflow: visible;
  }
}

.mobile-announcement-item {
  @apply rounded-[12px] overflow-hidden bg-[var(--card-bg-01)] shrink-0 px-4 py-2;
}

.mobile-announcement-header {
  @apply flex min-w-0 flex-1 flex-col gap-2;
}

.mobile-announcement-meta {
  @apply flex w-full min-w-0 items-center justify-between gap-2;
}

.mobile-announcement-title {
  @apply flex-1 text-[1rem] leading-[1.125rem] font-bold text-[var(--text-01)] text-ellipsis overflow-hidden whitespace-nowrap;
}

.mobile-announcement-date {
  @apply shrink-0 text-[.75rem] leading-[1rem] text-[var(--text-03)];
}

.announcement-empty {
  @apply flex flex-1 items-center justify-center p-5 text-base leading-[1.125rem] font-bold bg-[var(--bg-04)] text-[var(--text-01)];
}

.announcement-checkbox-wrapper {
  @apply py-[.2813rem] flex items-center justify-center bg-[var(--bg-11)];
  .q-checkbox {
    :deep(.q-checkbox__inner) {
      @apply text-[1.75rem];
      color: var(--ann-checkbox-bg, #dcdfe6);

      .q-checkbox__bg {
        border: 1px solid rgba(255, 255, 255, 0.75);
      }

      .q-checkbox__svg {
        background: var(--ann-checkbox-svg-bg, var(--ann-checkbox-bg, #ffffff));
        color: var(--ann-checkbox-icon, #ffffff);
      }

      &.q-checkbox__inner--truthy {
        color: var(--ann-checkbox-bg-active, var(--primany-01));

        .q-checkbox__bg {
          border: 1px solid var(--ann-checkbox-bg-active, var(--primany-01));
        }

        .q-checkbox__svg {
          background: var(--ann-checkbox-bg-active, var(--primany-01));
        }
      }
    }

    :deep(.q-checkbox__label) {
      @apply text-[.875rem] leading-[1.0625rem] font-bold font-[NotoSansTC] text-[var(--text-03)];
    }
  }
}

.collapse-enter-active,
.collapse-leave-active {
  @apply overflow-hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 50rem;
  opacity: 1;
}
</style>

<style lang="scss">
.announcement-type-menu-popup {
  @apply rounded-[.5rem];
  background: var(--bg-08);
  border: 1px solid var(--bg-line-02, #e0e0e0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

  .q-item {
    color: var(--tab-text-01);
  }

  .q-item.q-item--active {
    color: var(--btn-text-05);
  }
}

.announcement-date-pop {
  @apply flex flex-col gap-3 p-3;
  width: fit-content;
  max-width: calc(100vw - 1rem);
  background: var(--bg-08);
  color: var(--tab-text-01);
  overflow: hidden;
}

.announcement-date-picker.q-date {
  --q-primary: var(--btn-bg-01, var(--primary-01));
  --announcement-date-selected-text: var(--btn-text-05, #ffffff);
  --announcement-date-range-bg: color-mix(in srgb, var(--q-primary) 18%, transparent);
  --announcement-date-range-edge-bg: var(--q-primary);

  align-self: stretch;
  min-width: 0;
  max-width: 100%;
  border-radius: 0.5rem;
  background: var(--bg-08) !important;
  color: var(--tab-text-01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  overflow: hidden;

  .q-date__header {
    background: var(--q-primary) !important;
    color: var(--announcement-date-selected-text) !important;
    border-top-left-radius: 0;
  }

  &.q-date--portrait-standard .q-date__header {
    border-top-right-radius: 0;
  }

  .q-date__main,
  .q-date__content {
    background: var(--bg-08) !important;
    color: var(--tab-text-01) !important;
  }

  .q-date__navigation,
  .q-date__calendar-weekdays,
  .q-date__calendar-item .q-btn,
  .q-date__arrow,
  .q-date__view {
    color: var(--tab-text-01);
  }

  .q-date__today .q-btn {
    border-color: var(--q-primary);
  }

  .bg-primary {
    background: var(--q-primary) !important;
    color: var(--announcement-date-selected-text) !important;
  }

  .q-date__range,
  .q-date__range-from,
  .q-date__range-to {
    &::before {
      background: var(--announcement-date-range-bg) !important;
    }
  }

  .q-date__edit-range {
    color: var(--q-primary) !important;

    &::before {
      background: var(--announcement-date-range-bg);
      border-top: 1px dashed var(--q-primary);
      border-bottom: 1px dashed var(--q-primary);
    }
  }

  .q-date__range-from .q-btn,
  .q-date__range-to .q-btn,
  .q-date__edit-range-from .q-btn,
  .q-date__edit-range-to .q-btn,
  .q-date__edit-range-from-to .q-btn {
    background: var(--announcement-date-range-edge-bg) !important;
    color: var(--announcement-date-selected-text) !important;
  }

  .q-date__edit-range::after,
  .q-date__edit-range-from::after,
  .q-date__edit-range-to::after,
  .q-date__edit-range-from-to::after {
    border-color: var(--q-primary) !important;
  }
}
</style>
