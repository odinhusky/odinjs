<script setup lang="ts">
import SharedAgentCollaborationPage from "@shared-src/lib/components/agentCollaboration/AgentCollaborationPage.vue"
</script>

<template>
  <SharedAgentCollaborationPage
    :page-size="10"
    :class-obj="{
      page:
        'bg-[radial-gradient(circle_at_88%_26%,var(--color-fuchsia-950)_0%,var(--brand-brand-secondary-strong)_28%,var(--color-transparent)_52%),linear-gradient(90deg,var(--color-abyss-950)_0%,var(--color-navy-950)_50%,var(--color-fuchsia-950)_100%),url(/images/bg-img-pc.webp)] bg-cover bg-center phone:bg-[linear-gradient(90deg,var(--sidebar-sidebar-sub-bg-left)_0%,var(--brand-brand-secondary-strong)_100%),url(/images/bg-img-mobile.webp)]',
      content: '!max-w-none'
    }"
  />
</template>
