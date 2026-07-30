<template>
  <q-page class="q-pa-sm">
    <table-actions class="q-mt-lg" />

    <table-dark-mode class="q-mt-lg" />

    <table-progress class="q-mt-lg" />
  </q-page>
</template>

<script>
  import { defineComponent, defineAsyncComponent } from "vue"

  export default defineComponent({
    name: "TablesPage",
    components: {
      TableProgress: defineAsyncComponent(() => import("components/tables/TableProgress.vue")),
      TableDarkMode: defineAsyncComponent(() => import("components/tables/TableDarkMode.vue")),
      TableActions: defineAsyncComponent(() => import("components/tables/TableActions.vue"))
    }
  })
</script>

<style></style>
