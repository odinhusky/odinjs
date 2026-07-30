<template>
  <div class="dialog-overlay" role="dialog" aria-modal="true" @click.self="emitClose">
    <div class="dialog-container">
      <header class="dialog-header">
        <span class="dialog-title">{{ t("menu.announcement") }}</span>
        <q-icon name="close" class="header-close" @click="emitClose"></q-icon>
      </header>

      <div class="dialog-body" :class="{ 'dialog-body--advanced': isAdvancedFiltersEnabled }">
        <div v-if="isAdvancedFiltersEnabled" class="announcement-filter-bar">
          <div class="announcement-filter-bar__inner">
            <div class="filter-toolbar filter-toolbar--full">
              <div class="filter-group filter-group--type">
                <span class="advanced-filter-label">{{ t("announce_type") }}</span>
                <q-select
                  v-model="announcementType"
                  :options="announcementTypes"
                  emit-value
                  map-options
                  outlined
                  dense
                  class="select-announcement-type"
                  popup-content-class="select-announcement-type-popup"
                  behavior="menu"
                  @update:model-value="onAnnouncementTypeChange"
                >
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps" class="select-announcement-type-option">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="advanced-filter-panel advanced-filter-panel--inline">
                <div class="advanced-filter-row">
                  <span class="advanced-filter-label">{{ t("announce_date_range") }}</span>
                  <div class="advanced-date-row">
                    <q-input
                      :model-value="dateRangeDisplayString"
                      readonly
                      dense
                      outlined
                      class="advanced-date-range-input"
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
                            class="announcement-dialog-date-popup"
                            :offset="[0, 8]"
                          >
                            <q-card class="announcement-dialog-date-pop">
                              <div class="announcement-dialog-date-shortcuts" role="tablist" :aria-busy="isLoading">
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
                                class="announcement-dialog-date-picker"
                              />
                            </q-card>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="advanced-filter-row advanced-filter-row--keyword">
                  <span class="advanced-filter-label">{{ t("announce_keyword") }}</span>
                  <q-input
                    v-model="keywordModel"
                    dense
                    outlined
                    :placeholder="t('interest.placeholder')"
                    class="advanced-keyword-input"
                    @keyup.enter="handleSearchClick"
                  />
                </div>

                <div class="advanced-filter-row advanced-filter-row--search">
                  <q-btn
                    unelevated
                    dense
                    class="advanced-search-button"
                    :disable="isSearchDisabled"
                    @click="handleSearchClick"
                  >
                    <span class="advanced-search-label">{{ t("common.btn.search") }}</span>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-body-columns">
          <div v-if="shouldShowSidebar" class="body-left">
            <div v-if="!isAdvancedFiltersEnabled" class="filter-toolbar">
              <q-select
                v-model="announcementType"
                :options="announcementTypes"
                emit-value
                map-options
                outlined
                dense
                class="select-announcement-type"
                popup-content-class="select-announcement-type-popup"
                behavior="menu"
                @update:model-value="onAnnouncementTypeChange"
              >
                <template #option="scope">
                  <q-item v-bind="scope.itemProps" class="select-announcement-type-option">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="sidebar">
              <div class="sidebar-list-pc">
                <button
                  v-for="(item, idx) in announcementsFiltered"
                  :key="item.id"
                  type="button"
                  class="sidebar-item"
                  :class="{ active: idx === currentIndex, 'sidebar-item--advanced': isAdvancedFiltersEnabled }"
                  @click="select(idx)"
                >
                  <div class="sidebar-item-content">
                    <div class="sidebar-item-header">
                      <span class="sidebar-type-tag">{{ $t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[item.type]) }}</span>
                      <span v-if="isAdvancedFiltersEnabled" class="sidebar-date">
                        {{ formatAnnouncementDate(item.start_time) }}
                      </span>
                    </div>
                    <span class="sidebar-text">{{ item.langDetail?.title || "" }}</span>
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

              <div class="sidebar-list-h5">
                <q-icon
                  name="arrow_back_ios"
                  class="nav-arrow"
                  :class="{ disabled: isPreviousDisabled }"
                  @click="goPrevious"
                ></q-icon>
                <div class="nav-tab">
                  <div v-if="currentAnnouncement" class="nav-tab-header">
                    <span class="sidebar-type-tag">{{
                      $t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[currentAnnouncement.type])
                    }}</span>
                    <span v-if="isAdvancedFiltersEnabled" class="nav-tab-date">
                      {{ formatAnnouncementDate(currentAnnouncement.start_time) }}
                    </span>
                  </div>
                  <span class="nav-tab-text">{{ currentAnnouncement?.langDetail?.title || "" }}</span>
                </div>
                <q-icon
                  name="arrow_forward_ios"
                  class="nav-arrow"
                  :class="{ disabled: isNextDisabled }"
                  @click="goNext"
                ></q-icon>
              </div>
            </div>
          </div>

          <div class="body-right">
            <div v-if="isAdvancedFiltersEnabled" class="announcement-list-h5">
              <div
                v-for="(item, idx) in announcementsFiltered"
                :key="`announcement-dialog-h5-${item.id ?? idx}`"
                class="mobile-announcement-item"
                :class="{ active: idx === currentIndex }"
              >
                <button
                  type="button"
                  class="mobile-announcement-trigger"
                  :aria-expanded="isMobileExpanded(item, idx)"
                  :aria-controls="`announcement-dialog-panel-${item.id ?? idx}`"
                  @click="toggleMobile(item, idx)"
                >
                  <div class="mobile-announcement-header">
                    <div class="mobile-announcement-meta">
                      <span class="sidebar-type-tag">{{ $t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[item.type]) }}</span>
                      <span class="mobile-announcement-date">{{ formatAnnouncementDate(item.start_time) }}</span>
                    </div>
                    <span class="mobile-announcement-title">{{ item.langDetail?.title || "" }}</span>
                    <span class="mobile-announcement-preview">{{
                      getAnnouncementPreview(item.langDetail?.content)
                    }}</span>
                  </div>
                </button>
                <transition name="collapse">
                  <div
                    v-if="isMobileExpanded(item, idx)"
                    :id="`announcement-dialog-panel-${item.id ?? idx}`"
                    class="mobile-announcement-panel"
                  >
                    <div v-html="item.langDetail?.content" class="mobile-announcement-detail-body"></div>
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

            <div
              v-if="currentAnnouncement"
              class="announcement-detail"
              :class="{ 'announcement-detail--advanced': isAdvancedFiltersEnabled }"
            >
              <div class="sidebar-item-header sidebar-item-header--detail">
                <span class="sidebar-type-tag">{{
                  $t(ANNOUNCEMENT_MEMBER_TYPE.I18nKeys[currentAnnouncement.type])
                }}</span>
                <span v-if="isAdvancedFiltersEnabled" class="sidebar-date">{{ t("announcement_date") }}</span>
                <span v-if="isAdvancedFiltersEnabled" class="sidebar-date">{{
                  formatAnnouncementDate(currentAnnouncement.start_time)
                }}</span>
              </div>
              <h3 class="detail-title !text-[var(--text-02)]">{{ currentAnnouncement.langDetail?.title }}</h3>
              <div class="detail-body" v-html="currentAnnouncement.langDetail?.content"></div>
            </div>
            <div v-else-if="shouldShowEmptyAnnouncement" class="announcement-empty">
              {{ t("announcement.empty") }}
            </div>
            <div v-if="showDontShowTodayCheckbox" class="announcement-checkbox-wrapper">
              <q-checkbox v-model="dontShowToday" :label="t('announcement.dontShowToday')" />
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

type Props = {
  announcements: Response.AnnouncementList
  showDontShowTodayCheckbox?: boolean
  enableAdvancedAnnouncementFilters?: boolean
}

type EmitPayload = {
  dontShowToday?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  announcements: () => [],
  showDontShowTodayCheckbox: false,
  enableAdvancedAnnouncementFilters: false,
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
const expandedMobileKey = ref<number | string | null>(null)

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

async function onAnnouncementTypeChange() {
  currentIndex.value = 0
  expandedMobileKey.value = null
  await handleAnnouncementTypeChange()
}

const keywordModel = computed({
  get: () => announcementKeyword.value,
  set: (value: string) => setAnnouncementKeyword(value),
})

const isSearchDisabled = computed(() => isLoading.value || isAnnouncementDateRangeInvalid.value)
const shouldShowPagination = computed(() => isAdvancedFiltersEnabled.value && announcementPagination.value.total > 0)
const paginationMax = computed(() => Math.max(1, announcementTotalPages.value))

onMounted(async () => {
  if (!isAdvancedFiltersEnabled.value) return
  await handleAnnouncementSearch()
})

watch(
  sourceAnnouncements,
  (list) => {
    if (!list.length) {
      currentIndex.value = 0
      expandedMobileKey.value = null
    } else if (currentIndex.value >= list.length) {
      currentIndex.value = 0
      expandedMobileKey.value = null
    } else if (expandedMobileKey.value !== null) {
      const expandedIndex = list.findIndex((item, index) => getMobileKey(item, index) === expandedMobileKey.value)
      if (expandedIndex === -1) {
        expandedMobileKey.value = null
      }
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
const isPreviousDisabled = computed(() => currentIndex.value <= 0)
const isNextDisabled = computed(() => currentIndex.value >= announcementsFiltered.value.length - 1)

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

function getAnnouncementPreview(content: string | undefined): string {
  if (!content) {
    return ""
  }
  return content
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function goPrevious() {
  if (!isPreviousDisabled.value) {
    currentIndex.value -= 1
  }
}

function goNext() {
  if (!isNextDisabled.value) {
    currentIndex.value += 1
  }
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
</script>

<style lang="scss">
.q-menu {
  &.select-announcement-type-popup {
    // --ann-select-popup-bg: #ffffff;
    //  --ann-select-popup-sh
    // --ann-select-option-text: #ffffff;
    // --ann-select-option-text-active: #ffffff;adow: 0px 0px 10px 0px #ffffff99;
    @apply scale-95;
    background-color: var(--ann-select-popup-bg, #ffffff);
    box-shadow: var(--ann-select-popup-shadow, 0px 0px 10px 0px #0000001a);
  }
}

.announcement-dialog-date-pop {
  @apply flex flex-col gap-3 p-3;
  width: fit-content;
  max-width: calc(100vw - 1rem);
  background: var(--ann-date-bg, var(--ann-select-bg, #1a1a1a));
  color: var(--ann-date-text, var(--ann-select-text, #ffffff));
  overflow: hidden;
}

.announcement-dialog-date-picker.q-date {
  --q-primary: var(--ann-date-primary, #22c55e);
  --announcement-dialog-date-primary-end: var(--ann-date-primary-end, #4eed88);
  --announcement-dialog-date-selected-text: var(--ann-date-selected-text, #05312d);
  --announcement-dialog-date-bg: var(--ann-date-bg, var(--ann-select-bg, #1a1a1a));
  --announcement-dialog-date-text: var(--ann-date-text, var(--ann-select-text, #ffffff));
  --announcement-dialog-date-range-bg: color-mix(in srgb, var(--q-primary) 18%, transparent);

  align-self: stretch;
  min-width: 0;
  max-width: 100%;
  border-radius: 0.5rem;
  background: var(--announcement-dialog-date-bg) !important;
  color: var(--announcement-dialog-date-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  overflow: hidden;

  .q-date__header {
    background: linear-gradient(
      90deg,
      var(--q-primary) 0%,
      var(--announcement-dialog-date-primary-end) 100%
    ) !important;
    color: var(--announcement-dialog-date-selected-text) !important;
    border-top-left-radius: 0;
  }

  &.q-date--portrait-standard .q-date__header {
    border-top-right-radius: 0;
  }

  .q-date__main,
  .q-date__content {
    background: var(--announcement-dialog-date-bg) !important;
    color: var(--announcement-dialog-date-text) !important;
  }

  .q-date__navigation,
  .q-date__calendar-weekdays,
  .q-date__calendar-item .q-btn,
  .q-date__arrow,
  .q-date__view {
    color: var(--announcement-dialog-date-text);
  }

  .q-date__today .q-btn {
    border-color: var(--q-primary);
  }

  .bg-primary {
    background: var(--q-primary) !important;
    color: var(--announcement-dialog-date-selected-text) !important;
  }

  .q-date__range,
  .q-date__range-from,
  .q-date__range-to {
    &::before {
      background: var(--announcement-dialog-date-range-bg) !important;
    }
  }

  .q-date__edit-range {
    color: var(--q-primary) !important;

    &::before {
      background: var(--announcement-dialog-date-range-bg);
      border-top: 1px dashed var(--q-primary);
      border-bottom: 1px dashed var(--q-primary);
    }
  }

  .q-date__range-from .q-btn,
  .q-date__range-to .q-btn,
  .q-date__edit-range-from .q-btn,
  .q-date__edit-range-to .q-btn,
  .q-date__edit-range-from-to .q-btn {
    background: var(--q-primary) !important;
    color: var(--announcement-dialog-date-selected-text) !important;
  }

  .q-date__edit-range::after,
  .q-date__edit-range-from::after,
  .q-date__edit-range-to::after,
  .q-date__edit-range-from-to::after {
    border-color: var(--q-primary) !important;
  }
}

.dont-show-today {
  .q-checkbox__inner {
    color: var(--ann-checkbox-bg, var(--primany-01)) !important;

    .q-checkbox__svg {
      background: var(--ann-checkbox-bg, var(--primany-01)) !important;
      color: var(--ann-checkbox-icon, #ffffff) !important;
    }

    &.q-checkbox__inner--truthy {
      color: var(--ann-checkbox-bg-active, var(--primany-01)) !important;
      .q-checkbox__svg {
        background: var(--ann-checkbox-bg-active, var(--primany-01)) !important;
      }
    }
  }

  .q-checkbox__label {
    @apply text-sm font-normal;
    color: var(--ann-checkbox-text, #606266);
  }
}
</style>
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
  // --ann-overlay: #00000099;
  // --ann-header: #025be8;
  // --ann-header-text: #ffffff;
  // --ann-header-close: #ffffff;
  // --ann-sidebar-bg: #e6effd;
  // --ann-sidebar-text: #025be8;
  // --ann-sidebar-active-bg: #5c8cf0;
  // --ann-sidebar-active-text: #ffffff;
  // --ann-sidebar-nav-arrow: #025be8;
  // --ann-detail-bg: #ffffff;
  // --ann-detail-text: #1b2739;
  // --ann-checkbox-wrapper-bg: #1010d6;
  // --ann-checkbox-bg: #22ff0a;
  // --ann-checkbox-icon: #ff0a0a;
  // --ann-checkbox-text: #606266;
  // --ann-select-bg: #ffffff;
  // --ann-select-text: #ffffff;
  // --ann-select-icon: #ffffff;

  @apply fixed inset-0 flex items-center justify-center px-[1rem] py-[3.125rem] z-[5001];
  background: var(--ann-overlay, #00000099);
}

.dialog-container {
  @apply flex  flex-col w-full max-w-[71rem] overflow-hidden rounded-[12px];
  @apply h-[36.25rem] phone:h-full;
  min-height: 0;
  max-height: calc(100vh - 6.25rem);
  max-height: calc(100dvh - 6.25rem);
}

.dialog-header {
  @apply flex items-center justify-between p-[1.875rem];
  background-color: var(--ann-header, var(--primany-01));

  .dialog-title {
    @apply text-[1.5rem] leading-[1.75rem] font-bold;
    color: var(--ann-header-text, #ffffff);
  }

  .header-close {
    @apply h-6 w-6 text-[1.5rem] cursor-pointer;
    color: var(--ann-header-close, #ffffff);
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

  .sidebar-list-pc .sidebar-item .sidebar-text {
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
  @apply w-full shrink-0;
  border-bottom: 1px solid var(--ann-select-border, transparent);
  background: var(--ann-sidebar-bg, #e6effd);
}

.announcement-filter-bar__inner {
  @apply w-full min-w-0 px-4 py-3;
}

.filter-toolbar.filter-toolbar--full {
  @apply flex flex-row flex-wrap items-end gap-x-4 gap-y-3 w-full min-w-0;
  @apply phone:flex-col phone:items-stretch;
}

.filter-toolbar--full .select-announcement-type {
  @apply w-full max-w-none shrink-0;
  @apply phone:max-w-none;
}

.filter-group--type {
  @apply flex min-w-0 flex-col gap-2;
  @apply phone:w-full;
  width: 15rem;
  flex: 0 0 15rem;
}

@media (max-width: 768px) {
  .filter-group--type {
    flex: 0 0 auto;
  }
}

.body-left {
  @apply flex flex-col min-h-0 shrink-0;
  @apply phone:w-full phone:basis-auto;
  @apply h-full phone:h-auto;
}

.dialog-body--advanced .body-left {
  @apply h-full min-h-0 overflow-hidden phone:hidden;
  width: 270px;
}

.filter-toolbar {
  @apply flex flex-col gap-3 shrink-0;
}

.select-announcement-type {
  @apply w-full min-w-0 shrink-0;

  :deep(.q-field__control::before),
  :deep(.q-field__control::after) {
    border: 0;
  }

  :deep(.q-field__control) {
    @apply h-10 min-h-10 rounded-[.375rem] px-3;
    background: var(--ann-select-bg, #ffffff);
    border: 1px solid var(--ann-select-border, transparent);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  :deep(.q-field__native) {
    @apply h-10 min-w-0 min-h-0 text-sm font-bold leading-10;
    color: var(--ann-select-text, var(--primany-01));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.q-field__append) {
    @apply h-10 min-h-10;
  }

  :deep(.q-select__dropdown-icon) {
    color: var(--ann-select-icon, var(--primany-01));
  }
}

.advanced-filter-panel {
  @apply flex flex-col gap-3 px-3 pb-3;
  background: var(--ann-sidebar-bg, #e6effd);
}

.advanced-filter-panel.advanced-filter-panel--inline {
  @apply flex flex-1 flex-row flex-wrap items-end gap-x-4 gap-y-3 min-w-0;
  @apply px-0 pb-0;
  @apply phone:flex-col phone:items-stretch;
  background: transparent;
}

.advanced-filter-panel--inline .advanced-filter-row {
  @apply flex min-w-0 flex-col gap-2;
  @apply phone:w-full;
}

.advanced-filter-panel--inline .advanced-filter-row--keyword {
  @apply min-w-[min(100%,16.5rem)];
  @apply phone:min-w-0;
}

.advanced-filter-row {
  @apply flex flex-col gap-2;
}

.advanced-filter-label {
  @apply text-[.8125rem] leading-[1rem] font-bold;
  color: var(--ann-sidebar-text, var(--primany-01));
}

.announcement-dialog-date-shortcuts {
  @apply flex items-center gap-2 rounded-[.375rem] p-1;
  width: max-content;
  max-width: 100%;
  background: var(--ann-select-bg, #f5f5f7);
  border: 1px solid var(--ann-select-border, transparent);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  flex-wrap: nowrap;
  overflow-x: auto;
}

.quick-filter-tab.q-btn {
  @apply relative z-[1] min-h-9 flex-none rounded-full px-3 text-[.75rem] leading-[1rem] font-bold whitespace-nowrap transition-colors duration-200;
  @apply phone:min-h-8 phone:text-[.625rem];
  min-width: max-content;
  color: var(--ann-select-text, var(--primany-01));
  background: var(--ann-date-shortcut-bg, var(--ann-select-bg, #f5f5f7));

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
  background: var(--ann-sidebar-active-bg, #5c8cf0);
  color: var(--ann-sidebar-active-text, #ffffff);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.advanced-date-row {
  @apply flex flex-wrap items-center gap-2;
  @apply phone:flex-col phone:items-stretch;
}

.advanced-date-range-input {
  @apply min-w-[16.5rem] w-[16.5rem] max-w-full flex-none;
  @apply phone:min-w-0 phone:w-full;

  :deep(.q-field__control::before),
  :deep(.q-field__control::after) {
    border: 0;
  }

  :deep(.q-field__control) {
    @apply h-10 min-h-10 rounded-[.375rem] px-3;
    background: var(--ann-select-bg, #ffffff);
    border: 1px solid var(--ann-select-border, transparent);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    color: var(--ann-select-text, var(--primany-01));
  }

  :deep(.q-field__native) {
    @apply h-10 min-h-0 text-sm font-bold leading-10;
    color: var(--ann-select-text, var(--primany-01));
  }

  :deep(.q-field__append) {
    @apply h-10 min-h-10;
    color: var(--ann-select-icon, var(--primany-01));
  }
}

.advanced-keyword-input {
  @apply w-full;

  :deep(.q-field__control::before),
  :deep(.q-field__control::after) {
    border: 0;
  }

  :deep(.q-field__control) {
    @apply h-10 min-h-10 rounded-[.375rem] px-3;
    background: var(--ann-select-bg, #ffffff);
    border: 1px solid var(--ann-select-border, transparent);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    color: var(--ann-select-text, var(--primany-01));
  }

  :deep(.q-field__native) {
    @apply h-10 min-h-0 text-sm font-bold leading-10;
    color: var(--ann-select-text, var(--primany-01));
  }

  :deep(.q-field__prepend) {
    @apply h-10 min-h-10 pr-2;
    color: var(--ann-select-icon, var(--primany-01));
  }
}

.advanced-search-button {
  @apply h-10 min-h-10 min-w-[6rem] rounded-[.375rem] px-4;
  @apply phone:w-full;
  background: var(--ann-sidebar-active-bg, #5c8cf0);
  color: var(--ann-sidebar-active-text, #ffffff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.advanced-search-label {
  @apply block text-sm font-bold;
}

.select-announcement-type-option {
  color: var(--ann-select-option-text, #000000);

  &.q-item--active {
    background: var(--ann-select-option-bg-active);
    .q-item__label {
      color: var(--ann-select-option-text-active, var(--primany-01));
    }
  }
}

.sidebar {
  @apply flex flex-col flex-1 min-h-0 overflow-hidden;
  background-color: var(--ann-sidebar-bg, #e6effd);
}

.sidebar-list-pc {
  @apply flex flex-col w-full flex-1 min-h-0 overflow-y-auto;
  @apply phone:hidden;
  @include hide-scrollbar;

  .sidebar-item {
    @apply flex items-start justify-start py-[.5rem] px-4 h-auto;
    color: var(--ann-sidebar-text, var(--primany-01));

    &.sidebar-item--advanced {
      background: var(--card-bg-01, var(--ann-select-bg, #ffffff));
      border-bottom: 1px solid var(--bg-line-01);
    }

    .sidebar-item-content {
      @apply flex w-full min-w-0 flex-col gap-2;
    }

    .sidebar-item-header {
      @apply flex w-full min-w-0 items-center justify-between gap-2;
    }

    .sidebar-text {
      @apply w-full min-w-0 text-base leading-[1.125rem] font-bold max-h-9 text-ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .sidebar-date {
      @apply shrink-0 text-[.75rem] leading-[1rem];
      color: var(--ann-sidebar-text-muted, var(--ann-sidebar-text, var(--primany-01)));
    }

    &.active {
      background: var(--ann-sidebar-active-bg, #5c8cf0);
      color: var(--ann-sidebar-active-text, #ffffff);
    }

    &.sidebar-item--advanced.active {
      background: var(--card-bg-02, var(--ann-sidebar-bg, #e6effd));
    }
  }
}

.sidebar-type-tag {
  @apply shrink-0 px-2.5 py-0.5 text-[.75rem] font-bold leading-4 whitespace-nowrap;
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

.sidebar-list-h5 {
  @apply items-center justify-between gap-[.625rem] px-[1rem] py-[.625rem];
  @apply hidden phone:flex;
  background-color: var(--ann-sidebar-bg, #e6effd);

  .nav-tab {
    @apply flex min-w-0 flex-col gap-1 text-base leading-[1.125rem];
    color: var(--ann-sidebar-text, var(--primany-01));
  }

  .nav-tab-header {
    @apply flex w-full min-w-0 items-center justify-between gap-2;
  }

  .nav-tab-text {
    @apply min-w-0 truncate;
  }

  .nav-tab-date {
    @apply shrink-0 text-[.75rem] leading-[1rem];
    color: var(--ann-sidebar-text-muted, var(--ann-sidebar-text, var(--primany-01)));
  }

  .nav-arrow {
    @apply text-base font-bold;
    color: var(--ann-sidebar-nav-arrow, var(--primany-01));

    &.disabled {
      opacity: 0.3 !important;
      cursor: not-allowed;
    }
  }
}

.sidebar-pagination {
  @apply flex shrink-0 items-center justify-center py-3;

  :deep(.q-pagination__content) {
    border-radius: 0.375rem !important;
    gap: 0;
    overflow: hidden;
  }

  :deep(.q-btn) {
    @apply min-h-[2rem] min-w-[2rem] text-[.875rem];
    background: transparent !important;
    border: 0;
    border-radius: 0;
    color: var(--ann-pagination-text, var(--ann-sidebar-text, var(--primany-01))) !important;
    margin: 0;

    &::before {
      box-shadow: none !important;
    }
  }

  :deep(.q-pagination__middle button[aria-current="false"]:hover) {
    background: var(--ann-pagination-hover-bg, var(--ann-sidebar-active-bg, transparent)) !important;
    color: var(--ann-pagination-hover-text, var(--ann-sidebar-active-text, #ffffff)) !important;
  }

  :deep(.q-pagination__middle button[aria-current="true"]) {
    background: transparent !important;
    color: var(--ann-pagination-active-text, #ffe001) !important;
  }
}

.body-right {
  @apply flex flex-col flex-1 min-h-0  min-w-0;
  @apply phone:w-full;
  @apply h-full phone:h-auto;
}

.dialog-body--advanced .body-right {
  @apply overflow-hidden phone:flex-1 phone:min-h-0 phone:h-full;
}

.dialog-body--advanced .announcement-detail {
  @include hide-scrollbar;
}

.announcement-detail {
  @apply flex-1 p-5 flex flex-col gap-5 min-h-0 overflow-y-auto;
  background-color: var(--ann-detail-bg, #ffffff);
  color: var(--ann-detail-text, #000000);

  .sidebar-item-header .sidebar-date {
    @apply shrink-0 text-[.75rem] leading-[1rem];
    color: var(--ann-sidebar-text-muted, var(--ann-detail-text, #000000));
  }

  .detail-title {
    @apply text-base leading-[1.125rem] font-bold text-center;
  }

  .detail-image {
    @apply w-auto h-auto max-w-full min-w-0 object-contain;
    @apply self-start phone:self-auto;
  }

  .detail-body {
    @apply text-sm;
    color: var(--ann-detail-text, #000000);
  }
}

.announcement-detail--advanced {
  @apply phone:hidden;
}

.announcement-list-h5 {
  @apply hidden;
  @apply phone:flex phone:flex-col phone:flex-1 phone:min-h-0 phone:w-full phone:gap-1 phone:overflow-y-auto phone:px-3 phone:py-3;
  background: var(--ann-detail-bg, #ffffff);
  color: var(--ann-detail-text, #000000);
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
  .dialog-body--advanced .body-right,
  .dialog-body--advanced .announcement-list-h5 {
    flex: 0 0 auto;
    height: auto;
    overflow: visible;
  }
}

.mobile-announcement-item {
  @apply flex w-full shrink-0 flex-col rounded-[.75rem] px-4 py-2 text-left;
  background: var(--card-bg-01, var(--ann-select-bg, #ffffff));
  color: var(--ann-detail-text, #000000);

  &.active {
    background: var(--card-bg-02, var(--ann-sidebar-bg, #e6effd));
  }
}

.mobile-announcement-trigger {
  @apply flex w-full items-center justify-between gap-[.625rem] text-left;
}

.mobile-announcement-header {
  @apply flex w-full min-w-0 flex-col gap-2;
}

.mobile-announcement-meta {
  @apply flex w-full min-w-0 items-center justify-between gap-2;
}

.mobile-announcement-title {
  @apply min-w-0 truncate text-base font-bold leading-[1.125rem];
}

.mobile-announcement-preview {
  @apply min-w-0 truncate text-[.8125rem] leading-[1rem];
  color: var(--ann-sidebar-text-muted, var(--ann-detail-text, #000000));
}

.mobile-announcement-date {
  @apply shrink-0 text-[.75rem] leading-[1rem];
  color: var(--ann-sidebar-text-muted, var(--ann-detail-text, #000000));
}

.mobile-announcement-panel {
  @apply flex flex-col gap-3 pt-3;

  .mobile-announcement-detail-body {
    @apply text-sm;
    color: var(--ann-detail-text, #000000);
  }
}

.mobile-pagination {
  @apply flex shrink-0 items-center justify-center pt-1;
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

.announcement-empty {
  @apply flex flex-1 items-center justify-center p-5 text-base leading-[1.125rem] font-bold;
  background-color: var(--ann-detail-bg, #ffffff);
  color: var(--ann-detail-text, #000000);
}

.announcement-checkbox-wrapper {
  @apply py-[.375rem] flex items-center justify-center;
  background-color: var(--ann-checkbox-wrapper-bg, #f5f5f7);
  .q-checkbox {
    :deep(.q-checkbox__inner) {
      @apply text-[1.75rem];
      color: var(--ann-checkbox-bg, var(--primany-01));

      .q-checkbox__bg {
        border: 1px solid rgba(255, 255, 255, 0.75);
      }

      .q-checkbox__svg {
        background: var(--ann-checkbox-svg-bg, var(--ann-checkbox-bg, var(--primany-01)));
        color: var(--ann-checkbox-icon, #ffffff);
      }

      &.q-checkbox__inner--truthy {
        color: var(--ann-checkbox-bg-active, #025be8);

        .q-checkbox__bg {
          border: 1px solid var(--ann-checkbox-bg-active, var(--primany-01));
        }

        .q-checkbox__svg {
          background: var(--ann-checkbox-svg-bg-active, var(--ann-checkbox-bg-active, var(--primany-01)));
        }
      }
    }

    :deep(.q-checkbox__label) {
      @apply text-sm font-normal;
      color: var(--ann-checkbox-text, #606266);
    }
  }
}
</style>
