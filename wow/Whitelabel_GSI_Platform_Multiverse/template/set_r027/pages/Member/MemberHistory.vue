<template>
  <MemberHistory id="member-history" class="w-full padXl:!max-w-[44.5rem] pad:!max-w-[31.5rem] phone:!max-w-full" />
</template>

<script lang="ts" setup>
import MemberHistory from "src/common/components/MemberHistory/Index.vue"
</script>

<style lang="scss" scoped>
#member-history {
  max-width: calc(100% - 12.625rem);
  // --neutral-02: green;
}
</style>
