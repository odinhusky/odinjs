<script setup lang="ts">
import { computed } from "vue"
import type {
  AnnouncementCenterFilters,
  AnnouncementCenterPagination,
  NormalizedAnnouncement
} from "../../composables/useAnnouncementCenterFlow"

interface SelectOption {
  label: string
  value: string | number
}

interface AnnouncementDialogClassObj {
  dialogRoot?: string
  body?: string
  root?: string
  filterGrid?: string
  content?: string
  list?: string
  listItem?: string
  activeListItem?: string
  detail?: string
  image?: string
}

const props = withDefaults(
  defineProps<{
    visible: boolean
    announcements: NormalizedAnnouncement[]
    selectedAnnouncement?: NormalizedAnnouncement | null
    filters: AnnouncementCenterFilters
    pagination: AnnouncementCenterPagination
    typeOptions: SelectOption[]
    dontShowToday: boolean
    isLoading?: boolean
    isFetching?: boolean
    classObj?: AnnouncementDialogClassObj
  }>(),
  {
    selectedAnnouncement: null,
    isLoading: false,
    isFetching: false,
    classObj: () => ({})
  }
)

const emit = defineEmits<{
  close: []
  search: []
  clearFilters: []
  selectAnnouncement: [id: number]
  updateFilter: [filters: Partial<AnnouncementCenterFilters>]
  updatePage: [page: number]
  updateDontShowToday: [value: boolean]
}>()

const { t } = useI18n()

const titleText = computed(() => t("announcement_center"))
</script>

<template>
  <BaseDialog
    :visible="visible"
    :class-obj="{
      root: cx(
        'announcement-center-dialog !max-w-[930px] !w-[min(930px,calc(100vw-24px))] !rounded-xl',
        'phone:!w-[calc(100vw-12px)] phone:!max-w-[calc(100vw-12px)] phone:!h-auto phone:!max-h-[92dvh] phone:!rounded-xl phone:!m-0',
        props.classObj?.dialogRoot
      ),
      header: '!h-[54px] !py-0 !px-[18px] !justify-start !bg-[var(--dialog-dialog-bg-header)] phone:!h-9 phone:!px-3',
      title: '!text-left !text-[21px] !leading-[30px] phone:!text-sm phone:!leading-5',
      closeBtn: '!top-3 !right-[18px] phone:!top-2 phone:!right-3',
      body: cx('!p-0 !gap-0 !overflow-hidden !bg-[var(--dialog-dialog-bg-content)]', props.classObj?.body),
      footer: '!p-0 !bg-[var(--dialog-dialog-bg-footer)]'
    }"
    @close="emit('close')"
  >
    <template #header>{{ titleText }}</template>

    <AnnouncementCenterPanel
      :announcements="announcements"
      :selected-announcement="selectedAnnouncement"
      :filters="filters"
      :pagination="pagination"
      :type-options="typeOptions"
      :dont-show-today="dontShowToday"
      :is-loading="isLoading"
      :is-fetching="isFetching"
      :class-obj="props.classObj"
      @search="emit('search')"
      @clear-filters="emit('clearFilters')"
      @select-announcement="emit('selectAnnouncement', $event)"
      @update-filter="emit('updateFilter', $event)"
      @update-page="emit('updatePage', $event)"
      @update-dont-show-today="emit('updateDontShowToday', $event)"
    />
  </BaseDialog>
</template>

<style>
@media (max-width: 768px) {
  .announcement-center-dialog {
    width: calc(100vw - 12px) !important;
    max-width: calc(100vw - 12px) !important;
    height: auto !important;
    max-height: 92dvh !important;
    margin: 0 !important;
    border-radius: 12px !important;
  }
}
</style>
