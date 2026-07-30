<script setup lang="ts">
import { computed, ref, watch } from "vue"
import type {
  AnnouncementCenterFilters,
  AnnouncementCenterPagination,
  NormalizedAnnouncement
} from "../../composables/useAnnouncementCenterFlow"

interface SelectOption {
  label: string
  value: string | number
}

interface AnnouncementCenterPanelClassObj {
  root?: string
  header?: string
  filterGrid?: string
  content?: string
  list?: string
  listItem?: string
  activeListItem?: string
  mobileExpandedItem?: string
  detail?: string
  imageContainer?: string
  image?: string
}

const props = withDefaults(
  defineProps<{
    announcements: NormalizedAnnouncement[]
    selectedAnnouncement?: NormalizedAnnouncement | null
    filters: AnnouncementCenterFilters
    pagination: AnnouncementCenterPagination
    typeOptions: SelectOption[]
    dontShowToday?: boolean
    showDontShowToday?: boolean
    isLoading?: boolean
    isFetching?: boolean
    classObj?: AnnouncementCenterPanelClassObj
  }>(),
  {
    selectedAnnouncement: null,
    dontShowToday: false,
    showDontShowToday: true,
    isLoading: false,
    isFetching: false,
    classObj: () => ({})
  }
)

const emit = defineEmits<{
  search: []
  clearFilters: []
  selectAnnouncement: [id: number]
  updateFilter: [filters: Partial<AnnouncementCenterFilters>]
  updatePage: [page: number]
  updateDontShowToday: [value: boolean]
}>()

const { t } = useI18n()
const mobileExpandedAnnouncementId = ref<number | null>(null)

const typeLabel = computed(() => t("announce_type"))
const dateRangeLabel = computed(() => t("announce_date_range"))
const announcementDateText = computed(() => t("announcement_date"))
const keywordLabel = computed(() => t("announce_keyword"))
const searchText = computed(() => t("common.btn.search"))
const noDataText = computed(() => t("announcement.empty"))
const dontShowText = computed(() => t("announcement.dontShowToday"))

const hasAnnouncements = computed(() => props.announcements.length > 0)
const selectedImage = computed(() => props.selectedAnnouncement?.langDetail.image_path || "")

const updateDateRange = (value: string | string[] | null) => {
  emit("updateFilter", {
    dateRange: Array.isArray(value) ? value : null
  })
}

const updateKeyword = (value: string | number) => {
  emit("updateFilter", {
    keyword: String(value ?? "")
  })
}

const updateType = (value: string | number) => {
  emit("updateFilter", {
    type: Number(value) as AnnouncementCenterFilters["type"]
  })
}

const handleMobileSelect = (id: number) => {
  mobileExpandedAnnouncementId.value = mobileExpandedAnnouncementId.value === id ? null : id
  emit("selectAnnouncement", id)
}

watch(
  () => props.selectedAnnouncement?.id,
  (id) => {
    if (id != null && mobileExpandedAnnouncementId.value === null) {
      mobileExpandedAnnouncementId.value = id
    }
  },
  { immediate: true }
)
</script>

<template>
  <div :class="cx('announcement-center-panel overflow-hidden bg-[var(--dialog-dialog-bg-content)]', props.classObj?.root)">
    <section
      :class="
        cx(
          'border-b border-[var(--brand-brand-secondary-contrast)] bg-[var(--dialog-dialog-bg-header)] px-3 pb-3 pt-[9px] phone:px-2 phone:pb-2 phone:pt-1.5',
          props.classObj?.header
        )
      "
    >
      <div
        :class="
          cx(
            'grid grid-cols-[123px_minmax(0,303px)_minmax(0,213px)_102px] gap-3 phone:grid-cols-1',
            props.classObj?.filterGrid
          )
        "
      >
        <BaseSelect
          :model-value="filters.type"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          :label="typeLabel"
          :class-obj="{
            wrapper: '!gap-1',
            label: '!text-[15px] !leading-[18px] !text-white/80 phone:!text-[10px] phone:!leading-3',
            select: '!min-h-[39px] !h-[39px] !rounded-md !border !border-[var(--brand-brand-secondary-contrast)] !bg-[var(--container-container-field)] phone:!min-h-[26px] phone:!h-[26px]',
            selectLabel: '!py-0 !pl-3 !text-[15px] !leading-[37px] phone:!pl-2 phone:!text-[10px] phone:!leading-[24px]',
            dropdown: '!ml-0 !w-9 !text-white phone:!w-6',
            panel: '!z-[1205]',
            item: '!px-3 !py-1.5 !text-[15px]'
          }"
          @update:model-value="updateType"
        />

        <BaseDatePicker
          :model-value="filters.dateRange"
          selection-mode="range"
          :label="dateRangeLabel"
          placeholder="yyyy-mm-dd ~ yyyy-mm-dd"
          :class-obj="{
            root: '!gap-1 announcement-date-filter',
            label: '!text-[15px] !leading-[18px] !text-white/80 phone:!text-[10px] phone:!leading-3',
            input: '!h-[39px] !min-h-[39px] !border-0 !bg-transparent phone:!h-[26px] phone:!min-h-[26px]'
          }"
          @update:model-value="updateDateRange"
        />

        <BaseInput
          :model-value="filters.keyword"
          :label="keywordLabel"
          :placeholder="keywordLabel"
          :class-obj="{
            root: '!gap-1',
            label: '!text-[15px] !leading-[18px] !text-white/80 phone:!text-[10px] phone:!leading-3',
            input: '!min-h-[39px] !h-[39px] !rounded-md !border !border-[var(--brand-brand-secondary-contrast)] !bg-[var(--container-container-field)] !py-0 !text-[15px] !leading-[37px] phone:!min-h-[26px] phone:!h-[26px] phone:!text-[10px] phone:!leading-[24px]'
          }"
          @update:model-value="updateKeyword"
        />

        <div class="flex items-end">
          <BaseBtn
            size="sm"
            class="w-full"
            :class-obj="{
              button:
                '!min-h-[39px] !h-[39px] !rounded-md !px-3 !py-0 !text-[15px] !text-white !bg-[linear-gradient(90deg,var(--button-button-bg-primary-left-enabled)_0%,var(--button-button-bg-primary-right-enabled)_100%)] phone:!min-h-[26px] phone:!h-[26px] phone:!text-[10px]'
            }"
            @click="emit('search')"
          >
            {{ searchText }}
          </BaseBtn>
        </div>
      </div>
    </section>

    <section
      :class="
        cx(
          'announcement-center-content h-[428px] bg-[var(--dialog-dialog-bg-content)] p-3 phone:flex phone:h-auto phone:max-h-[62dvh] phone:flex-col phone:overflow-hidden',
          props.classObj?.content
        )
      "
    >
      <div v-if="isLoading || isFetching" class="flex h-full items-center justify-center text-xs text-white/80">
        <BaseIcon name="svg-spinners:ring-resize" size="2rem" />
      </div>

      <div v-else-if="!hasAnnouncements" class="flex h-full items-center justify-center text-xs text-white/70">
        {{ noDataText }}
      </div>

      <div v-else class="h-full phone:flex phone:min-h-0 phone:flex-1 phone:flex-col">
        <div class="announcement-desktop-layout grid h-full grid-cols-[237px_minmax(0,1fr)] gap-3 phone:hidden">
          <div :class="cx('flex min-h-0 flex-col', props.classObj?.list)">
            <div class="announcement-scroll min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1.5">
              <BasePlainBtn
                v-for="announcement in announcements"
                :key="announcement.id"
                :class-obj="{
                  button: cx(
                    '!block w-full rounded-md bg-[var(--color-navy-950)] px-3 py-[9px] text-left transition-colors hover:bg-[var(--color-abyss-950)]',
                    props.classObj?.listItem,
                    selectedAnnouncement?.id === announcement.id && props.classObj?.activeListItem
                  ),
                  label: '!block w-full min-w-0 text-left'
                }"
                @click="emit('selectAnnouncement', announcement.id)"
              >
                <div class="mb-1.5 flex items-center justify-between gap-3">
                  <span class="announcement-type-tag rounded-full px-[9px] py-1 text-[13px] font-bold leading-[18px] text-white">
                    {{ typeOptions.find((item) => item.value === announcement.type)?.label }}
                  </span>
                  <span class="shrink-0 text-[13px] leading-[18px] text-white/50">{{ announcement.start_time.slice(0, 10) }}</span>
                </div>
                <div class="line-clamp-2 whitespace-normal break-words text-[16px] font-bold leading-6 text-white">
                  {{ announcement.langDetail.title }}
                </div>
                <div class="line-clamp-2 whitespace-normal break-words text-[13px] leading-[18px] text-white/60">
                  {{ announcement.langDetail.content }}
                </div>
              </BasePlainBtn>
            </div>

            <BasePagination
              v-if="pagination.total > 0"
              :model-value="pagination.page"
              :rows="pagination.pageSize"
              :total-records="pagination.total"
              :class-obj="{ root: 'mt-1.5 justify-center !gap-1.5', pageButton: '!w-[30px] !h-[30px] !rounded !p-0 !text-[15px]', navButton: '!w-[30px] !h-[30px] !rounded !p-0' }"
              @update:model-value="emit('updatePage', $event)"
            />
          </div>

          <article :class="cx('flex min-h-0 flex-col overflow-hidden rounded-lg bg-[var(--brand-brand-secondary-strong)]', props.classObj?.detail)">
            <div v-if="selectedAnnouncement" class="announcement-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
              <div class="flex items-center gap-3">
                <span class="announcement-type-tag shrink-0 rounded-full px-[9px] py-1 text-[13px] font-bold leading-[18px] text-white">
                  {{ typeOptions.find((item) => item.value === selectedAnnouncement.type)?.label }}
                </span>
                <span class="min-w-0 truncate text-[13px] leading-[18px] text-white/55">
                  {{ announcementDateText }} {{ selectedAnnouncement.end_time.slice(0, 10) }}
                </span>
              </div>

              <h2 class="truncate text-[21px] font-bold leading-[30px] text-white">
                {{ selectedAnnouncement.langDetail.title }}
              </h2>

              <BaseImage
                v-if="selectedImage"
                :src="selectedImage"
                :alt="selectedAnnouncement.langDetail.title"
                :class-obj="{
                  container: cx('block w-full aspect-[336/116] overflow-hidden rounded-lg bg-black/20', props.classObj?.imageContainer),
                  image: cx('h-full w-full rounded-lg object-contain', props.classObj?.image),
                  placeholder: '!min-h-0 h-full'
                }"
              />

              <p class="whitespace-pre-line text-[15px] leading-6 text-white/85">
                {{ selectedAnnouncement.langDetail.content }}
              </p>
            </div>

            <div
              v-if="showDontShowToday"
              class="flex h-[42px] shrink-0 items-center justify-center rounded-b-lg bg-[var(--dialog-dialog-bg-footer)]"
            >
              <BaseCheckBox
                :model-value="dontShowToday"
                :label="dontShowText"
                :class-obj="{ label: '!text-[15px] !leading-[18px] !text-white', box: '!w-[21px] !h-[21px]' }"
                @update:model-value="emit('updateDontShowToday', Boolean($event))"
              />
            </div>
          </article>
        </div>

        <div class="announcement-mobile-layout hidden min-h-0 flex-1 flex-col phone:flex">
          <div class="announcement-scroll min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            <article
              v-for="announcement in announcements"
              :key="announcement.id"
              :class="
                cx(
                  'overflow-hidden rounded-lg',
                  mobileExpandedAnnouncementId === announcement.id ? 'bg-[var(--brand-brand-secondary-strong)]' : 'bg-[var(--color-navy-950)]',
                  mobileExpandedAnnouncementId === announcement.id && props.classObj?.mobileExpandedItem
                )
              "
            >
              <BasePlainBtn
                :class-obj="{ button: '!block w-full p-3 text-left', label: '!block w-full min-w-0 text-left' }"
                @click="handleMobileSelect(announcement.id)"
              >
                <div class="mb-1 flex items-center justify-between gap-2">
                  <span class="announcement-type-tag rounded-full px-2 py-0.5 text-[10px] font-bold leading-4 text-white">
                    {{ typeOptions.find((item) => item.value === announcement.type)?.label }}
                  </span>
                  <span class="shrink-0 text-[10px] leading-4 text-white/50">{{ announcement.start_time.slice(0, 10) }}</span>
                </div>
                <h2 class="line-clamp-2 text-sm font-bold leading-5 text-white">
                  {{ announcement.langDetail.title }}
                </h2>
                <p class="mt-1 line-clamp-2 text-[11px] leading-4 text-white/60">
                  {{ announcement.langDetail.content }}
                </p>
              </BasePlainBtn>

              <div v-if="mobileExpandedAnnouncementId === announcement.id" class="space-y-2 px-3 pb-3">
                <BaseImage
                  v-if="announcement.langDetail.image_path"
                  :src="announcement.langDetail.image_path"
                  :alt="announcement.langDetail.title"
                  :class-obj="{
                    container: cx('block w-full aspect-[168/66] overflow-hidden rounded-md bg-black/20', props.classObj?.imageContainer),
                    image: 'h-full w-full rounded-md object-contain',
                    placeholder: '!min-h-0 h-full'
                  }"
                />
                <p class="whitespace-pre-line text-xs leading-5 text-white/85">
                  {{ announcement.langDetail.content }}
                </p>
              </div>
            </article>
          </div>

          <BasePagination
            v-if="pagination.total > 0"
            :model-value="pagination.page"
            :rows="pagination.pageSize"
            :total-records="pagination.total"
            :class-obj="{ root: 'justify-center py-2', pageButton: '!w-6 !h-6 !text-xs', navButton: '!w-6 !h-6' }"
            @update:model-value="emit('updatePage', $event)"
          />

          <div v-if="showDontShowToday" class="flex h-8 shrink-0 items-center justify-center rounded-b-lg bg-[var(--dialog-dialog-bg-footer)]">
            <BaseCheckBox
              :model-value="dontShowToday"
              :label="dontShowText"
              :class-obj="{
                wrapper: '!items-center',
                root: 'translate-y-[3px]',
                label: '!text-[10px] !leading-3 !text-white',
                box: '!w-3.5 !h-3.5'
              }"
              @update:model-value="emit('updateDontShowToday', Boolean($event))"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.announcement-type-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  background: linear-gradient(
    90deg,
    var(--button-button-bg-primary-left-enabled) 0%,
    var(--button-button-bg-primary-right-enabled) 100%
  );
}

.announcement-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--brand-brand-secondary-contrast) transparent;
}

.announcement-scroll::-webkit-scrollbar {
  width: 6px;
}

.announcement-scroll::-webkit-scrollbar-thumb {
  background: var(--brand-brand-secondary-contrast);
  border-radius: 999px;
}

:deep(.announcement-date-filter .p-inputtext) {
  height: 39px !important;
  min-height: 39px !important;
  padding: 0 42px 0 12px !important;
  border-width: 1px !important;
  border-color: var(--brand-brand-secondary-contrast) !important;
  border-radius: 6px !important;
  background: var(--container-container-field) !important;
  color: var(--brand-brand-text) !important;
  font-size: 15px !important;
  line-height: 37px !important;
}

:deep(.announcement-date-filter .p-datepicker-dropdown) {
  width: 36px !important;
  height: 36px !important;
}

@media (max-width: 768px) {
  :deep(.announcement-date-filter .p-inputtext) {
    height: 26px !important;
    min-height: 26px !important;
    padding: 0 28px 0 8px !important;
    border-radius: 4px !important;
    font-size: 10px !important;
    line-height: 24px !important;
  }

  :deep(.announcement-date-filter .p-datepicker-dropdown) {
    width: 24px !important;
    height: 24px !important;
  }
}
</style>
