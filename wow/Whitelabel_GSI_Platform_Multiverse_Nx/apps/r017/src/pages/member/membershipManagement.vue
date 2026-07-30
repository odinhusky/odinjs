<script setup lang="ts">
import SharedMembershipManagementPage from "@shared-src/lib/components/membershipManagement/MembershipManagementPage.vue"
</script>

<template>
  <SharedMembershipManagementPage
    section-max-width="1200px"
    :class-obj="{
      dialogBody: 'bg-[url(/images/bg-dialog.png)]'
    }"
  />
</template>
