<template>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <LogoTable />
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import LogoTable from "./component/LogoTable.vue"
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
