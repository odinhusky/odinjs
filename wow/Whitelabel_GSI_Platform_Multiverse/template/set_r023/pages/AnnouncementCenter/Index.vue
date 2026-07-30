<template>
  <section class="announcement-center-page custom-announcement-wrapper">
    <AllContentAnnouncement
      :announcements="[]"
      :enable-advanced-announcement-filters="true"
      display-mode="page"
      auto-fetch-on-mount
    />
  </section>
</template>

<script setup lang="ts">
import AllContentAnnouncement from "src/common/components/Announcement/components/module1/components/AllContent.vue"
</script>

<style scoped lang="scss">
.announcement-center-page {
  @apply flex h-full min-h-0 w-full flex-col;
}
</style>
