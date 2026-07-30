<script setup lang="ts">
import { computed } from "vue"
import { useAnnouncementCenterFlow } from "../../composables/useAnnouncementCenterFlow"

interface AnnouncementCenterPageClassObj {
  page?: string
  hero?: string
  title?: string
  block?: string
  panelContainer?: string
  panelRoot?: string
  panelHeader?: string
  panelFilterGrid?: string
  panelContent?: string
  panelMobileExpandedItem?: string
  panelDetail?: string
  panelImageContainer?: string
  panelImage?: string
}

const props = withDefaults(
  defineProps<{
    pageSize?: number
    classObj?: AnnouncementCenterPageClassObj
  }>(),
  {
    pageSize: 20,
    classObj: () => ({})
  }
)

const { t } = useI18n()

const pageTitle = computed(() => t("announcement_center"))

const {
  filters,
  pagination,
  announcementTypeOptions,
  announcements,
  selectedAnnouncement,
  isLoading,
  isFetching,
  updateFilters,
  clearFilters,
  search,
  selectAnnouncement,
  updatePage
} = useAnnouncementCenterFlow({
  autoOpen: false,
  pageSize: props.pageSize
})
</script>

<template>
  <section :class="cx('min-h-full text-white', props.classObj?.page)">
    <div
      :class="
        cx(
          'mx-auto flex h-[118px] w-full max-w-[1280px] items-center overflow-hidden px-10 phone:h-[92px] phone:px-4',
          props.classObj?.hero
        )
      "
    >
      <h1 :class="cx('text-[36px] font-bold leading-[44px] phone:text-2xl phone:leading-8', props.classObj?.title)">
        {{ pageTitle }}
      </h1>
    </div>

    <div :class="cx('mx-auto w-full max-w-[1280px] px-6 py-8 phone:px-3 phone:py-3', props.classObj?.block)">
      <div :class="cx('mx-auto w-full max-w-[930px]', props.classObj?.panelContainer)">
        <AnnouncementCenterPanel
          :announcements="announcements"
          :selected-announcement="selectedAnnouncement"
          :filters="filters"
          :pagination="pagination"
          :type-options="announcementTypeOptions"
          :show-dont-show-today="false"
          :is-loading="isLoading"
          :is-fetching="isFetching"
          :class-obj="{
            root: cx('rounded-lg !bg-[var(--color-navy-950)]', props.classObj?.panelRoot),
            header: cx('!bg-[var(--color-navy-950)]', props.classObj?.panelHeader),
            filterGrid: cx('grid-cols-[123px_minmax(0,303px)_minmax(0,213px)_102px]', props.classObj?.panelFilterGrid),
            content: cx('!h-[428px] !bg-[var(--color-navy-950)] phone:!max-h-none phone:!h-auto', props.classObj?.panelContent),
            mobileExpandedItem: cx('!bg-[var(--color-navy-950)]', props.classObj?.panelMobileExpandedItem),
            detail: cx('!bg-[var(--color-navy-950)]', props.classObj?.panelDetail),
            imageContainer: cx('!bg-[var(--color-navy-950)]', props.classObj?.panelImageContainer),
            image: props.classObj?.panelImage
          }"
          @search="search"
          @clear-filters="clearFilters"
          @select-announcement="selectAnnouncement"
          @update-filter="updateFilters"
          @update-page="updatePage"
        />
      </div>
    </div>
  </section>
</template>
