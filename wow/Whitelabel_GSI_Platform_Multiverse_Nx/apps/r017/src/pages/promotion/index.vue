<script setup lang="ts">
import SharedPromotionPage from "@shared-src/lib/components/promotion/PromotionPage.vue"

definePageMeta({
  layout: "default"
})
</script>

<template>
  <SharedPromotionPage
    :class-obj="{
      page: 'bg-[var(--color-navy-950)]',
      hero:
        '!max-w-none bg-[linear-gradient(90deg,var(--color-navy-950)_0%,var(--brand-brand-secondary-strong)_45%,var(--color-fuchsia-950)_100%),url(/images/bg-img-pc.webp)] bg-cover bg-center phone:bg-[linear-gradient(90deg,var(--sidebar-sidebar-sub-bg-left)_0%,var(--brand-brand-secondary-strong)_100%),url(/images/bg-img-mobile.webp)]',
      content:
        '!max-w-none bg-[radial-gradient(circle_at_100%_42%,var(--color-fuchsia-950)_0%,var(--color-transparent)_34%),var(--color-navy-950)]'
    }"
  />
</template>
