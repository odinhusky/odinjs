<script setup lang="ts">
import { computed } from "vue"
import AnnouncementDialog from "./AnnouncementDialog.vue"
import { useAccountInfo } from "../../api/hooks/useAccountInfo"
import { useAnnouncementCenterFlow } from "../../composables/useAnnouncementCenterFlow"
import { ROUTE_PATH } from "../../constants/routePath"
import { useAuthStore } from "../../stores/auth"
import { useUserProfileStore } from "../../stores/userProfile"

const route = useRoute()
const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()
const { accountInfo } = useAccountInfo({
  options: {
    enabled: computed(() => authStore.isLoggedIn)
  }
})

const playerStorageScope = computed(() => {
  if (!authStore.isLoggedIn) return "guest"

  const profile = userProfileStore.profile ?? accountInfo.value
  const uid = profile?.uid
  const account = profile?.account

  if (uid !== undefined && uid !== null && uid !== "") return `uid:${String(uid)}`
  if (account) return `account:${encodeURIComponent(account)}`
  return null
})

const storageKey = computed(() => `announcementCenter.${playerStorageScope.value ?? "pending"}.dontShowUntilTs`)
const shouldAutoOpen = computed(() => route.path !== ROUTE_PATH.ANNOUNCEMENT && playerStorageScope.value !== null)

const {
  isDialogVisible,
  dontShowToday,
  filters,
  pagination,
  announcementTypeOptions,
  announcements,
  selectedAnnouncement,
  isLoading,
  isFetching,
  closeDialog,
  updateFilters,
  clearFilters,
  search,
  selectAnnouncement,
  updatePage
} = useAnnouncementCenterFlow({
  storageKey,
  autoOpen: shouldAutoOpen
})
</script>

<template>
  <AnnouncementDialog
    :visible="isDialogVisible"
    :announcements="announcements"
    :selected-announcement="selectedAnnouncement"
    :filters="filters"
    :pagination="pagination"
    :type-options="announcementTypeOptions"
    :dont-show-today="dontShowToday"
    :is-loading="isLoading"
    :is-fetching="isFetching"
    @close="closeDialog"
    @search="search"
    @clear-filters="clearFilters"
    @select-announcement="selectAnnouncement"
    @update-filter="updateFilters"
    @update-page="updatePage"
    @update-dont-show-today="dontShowToday = $event"
  />
</template>
