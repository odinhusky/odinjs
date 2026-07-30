<template>
  <q-card class="no-shadow">
    <q-card-section class="">
      <q-form>
        <slot></slot>
      </q-form>
    </q-card-section>
    <!-- <q-separator></q-separator> -->
    <q-card-section>
      <q-table
        square
        hide-bottom
        :pagination="initialPagination"
        :rows="props.tableData"
        :loading="loading"
        :columns="props.tableColumn"
        row-key="name"
        :filter="filter"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>
        <!-- <template v-slot:top-right>
          <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter = !show_filter" flat />
        </template> -->
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { ref } from "vue"

  interface Props {
    loading: boolean
    tableData: Array<any>
    tableColumn: Array<any>
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: () => false,
    tableData: () => [],
    tableColumn: () => []
  })

  const initialPagination = {
    sortBy: "desc",
    descending: false,
    rowsPerPage: 10
    // rowsNumber: xx if getting data from a server
  }

  const show_filter = ref(false)
  const filter = ref("")
</script>

<style lang="scss" scoped>
  // .header-table {
  //   thead tr:first-child th {
  //     color: #fff;
  //     background-color: #0d0df8;
  //   }
  // }

  .q-card,
  .q-table__card {
    background: unset !important;
  }
</style>
