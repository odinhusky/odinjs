<script setup lang="ts">
import SharedAnnouncementCenterPage from "@shared-src/lib/components/announcementCenter/AnnouncementCenterPage.vue"
</script>

<template>
  <SharedAnnouncementCenterPage
    :page-size="20"
    :class-obj="{
      hero:
        '!max-w-none bg-[linear-gradient(90deg,var(--sidebar-sidebar-sub-bg-left)_0%,var(--brand-brand-secondary-strong)_45%,var(--color-fuchsia-950)_100%),url(/images/bg-img-pc.webp)] bg-cover bg-center phone:bg-[linear-gradient(90deg,var(--sidebar-sidebar-sub-bg-left)_0%,var(--brand-brand-secondary-strong)_100%),url(/images/bg-img-mobile.webp)]',
      block:
        '!max-w-none bg-[radial-gradient(circle_at_88%_26%,var(--color-fuchsia-950)_0%,var(--brand-brand-secondary-strong)_28%,transparent_52%),linear-gradient(90deg,var(--color-abyss-950)_0%,var(--color-navy-950)_50%,var(--color-fuchsia-950)_100%)]'
    }"
  />
</template>
