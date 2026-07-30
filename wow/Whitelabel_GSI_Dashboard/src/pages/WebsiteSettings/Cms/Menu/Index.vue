<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <router-view></router-view>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  const splitterModel = ref(100)
</script>

<style lang="scss" scoped>
  @import "../../../../css/_variable.sass";
</style>
