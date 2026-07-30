<template>
  <div class="breadcrumb-bar">
    <q-breadcrumbs active-color="white" style="font-size: 13px">
      <q-breadcrumbs-el v-for="(item, index) in list" :key="index" :to="item.link" />
    </q-breadcrumbs>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from "vue"

  defineProps({
    list: {
      type: Array as PropType<Array<{ name: string; link: string }>>,
      default: () => [] // Default to an empty array if not provided
    }
  })
</script>

<style lang="scss" scoped>
  .breadcrumb-bar {
    width: 40vw;
  }
</style>
