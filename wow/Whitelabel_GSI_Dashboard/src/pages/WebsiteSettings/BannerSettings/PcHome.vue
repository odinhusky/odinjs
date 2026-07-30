<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <BannerTable :position="1" backgroundColor="bg-white" />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import BannerTable from "./component/BannerTable.vue"
  const splitterModel = ref(100)
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";
  .tabsMenu {
    .tabItem {
      border-radius: 1.5rem;
      margin-right: 0.5rem;
    }
  }
  .game-type-tabs {
    ::v-deep(.q-tabs__content) {
      justify-content: flex-start;
      padding-left: 0.5rem;
      .q-tab {
        padding-left: 0;
        padding-right: 0;
        margin-right: 1rem;
      }
      .q-tab--active {
        color: $mainColor;
      }
    }
  }
</style>
