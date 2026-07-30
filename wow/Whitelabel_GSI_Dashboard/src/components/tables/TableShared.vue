<!-- eslint-disable vue/no-unused-vars -->
<template>
  <q-card class="no-shadow no-border bg-unset">
    <q-card-section class="">
      <q-form>
        <div class="visible-area q-mb-md">
          <q-btn v-if="isAddbutton" color="secondary" @click="openActionDialog">{{ $t("btn.add") }}</q-btn>
          <div v-else></div>
          <div v-if="visible" @click="toggleVisibility">
            <q-icon class="icon" name="visibility" />
          </div>
          <div v-else @click="toggleVisibility">
            <q-icon class="icon" name="visibility_off" />
          </div>
        </div>
        <q-slide-transition>
          <div v-if="visible" class="search-area">
            <div class="first-item" :style="{ 'grid-template-columns': `repeat(${searchColumnLength}, 1fr)` }">
              <template v-for="column in props.searchColumn" :key="column.name">
                <!-- Render q-select if inputType is 'select' -->
                <q-select
                  v-if="column.inputType === 'select'"
                  :key="`${column.field}-select`"
                  v-model="searchFormInitData[column.field]"
                  :options="column.options"
                  :label="column.label"
                  dense
                  outlined
                  class="input"
                >
                  <template #before-options>
                    <q-item>
                      <!-- <q-item-section>
                                                <q-input></q-input>
                                            </q-item-section> -->
                      <q-item-section>
                        {{ $t("table_header.please_select") }}
                      </q-item-section>
                    </q-item>
                  </template>
                  <template #option="{ itemProps, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps" class="custom-select-options">
                      <q-item-section>
                        <!-- eslint-disable -->
                        <q-item-label v-html="opt" />
                        <!-- eslint-enable -->
                      </q-item-section>
                      <q-item-section side>
                        <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <date-range-selector
                  v-else-if="column.inputType === 'range'"
                  :key="`${column.field}-range`"
                  v-model="searchFormInitData[column.field]"
                  @input="handleDateRangeInput($event)"
                />
                <!-- Render q-input if inputType is 'text', 'number', or 'date' -->
                <q-input
                  v-else
                  :key="`${column.field}-input`"
                  v-model="searchFormInitData[column.field]"
                  :label="column.label"
                  :type="column.inputType"
                  dense
                  outlined
                  class="input"
                />
              </template>
              <q-btn class="button q-px-xl" color="purple">{{ $t("btn.search") }}</q-btn>
            </div>
          </div>
        </q-slide-transition>
      </q-form>
    </q-card-section>
    <q-card-section>
      <q-table
        v-model:pagination="initialPagination"
        v-model:selected="selectedRows"
        square
        hide-bottom
        :rows="tableData"
        :loading="loading"
        :columns="props.tableColumn"
        row-key="name"
        :filter="filter"
        :selection="isMultiselect ? 'multiple' : 'none'"
      >
        <template #loading>
          <q-inner-loading showing color="primary" />
        </template>

        <template v-for="(col, index) in props.tableColumn" #[`body-cell-${col.name}`]="props" :key="col.name">
          <q-td :style="{ width: col.width }">
            <template v-if="col.dataType === 'string'">
              <!-- Render for string dataType -->
              {{ props.row[col.field] }}
            </template>
            <template v-else-if="col.dataType === 'decimal'">
              <!-- Render for decimal dataType -->
              {{ new Intl.NumberFormat().format(props.row[col.field]) }}
            </template>
            <template v-else-if="col.dataType === 'date'">
              <!-- Render for date dataType -->
              {{ new Date(props.row[col.field]).toLocaleDateString() }}
            </template>
            <template v-else-if="col.dataType === 'switch'">
              <!-- Render for switch dataType -->
              <q-toggle v-model="props.row[col.field]" />
            </template>

            <slot v-else-if="col.dataType === 'custom'" :name="`body-cell-${col.name}`" v-bind="props"></slot>
            <template v-else>
              <!-- Default render if no dataType matched -->
              {{ props.row[col.field] }}
            </template>
          </q-td>
        </template>
        <template #bottom>
          <tr>
            <td :colspan="2">Total:</td>
            <td>{{ 0 }}</td>
          </tr>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions class="q-pa-md table-pagination">
      <div class="float-left-pagination">
        {{ $t("pagination.show") }} {{ `${showingStart} ` }} {{ $t("pagination.to") }} {{ `${showingEnd} ` }}
        {{ $t("pagination.of") }} {{ `${totalSize} ` }} {{ $t("pagination.items") }}

        <q-select
          dense
          outlined
          style="min-width: 100px"
          :model-value="pageSize"
          :options="pageSizeOption"
          :option-label="(opt) => opt + ' / ' + $t('pagination.page')"
          class="my-custom-select"
          @update:modelValue="updatePageSize"
        />
      </div>
      <div class="float-right-pagination">
        <q-pagination
          :model-value="page"
          :min="1"
          :max="maxPages"
          :max-pages="6"
          direction-links
          outline
          @update:modelValue="updatePage"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
  import { ref, defineProps, defineEmits, withDefaults, computed, watch, reactive, onMounted } from "vue"
  import { TableColumn, SearchColumn, SearchFormData } from "src/interface/common"
  import DateRangeSelector from "components/SharedComponents/DateRangeSelector.vue"

  const props = withDefaults(
    defineProps<{
      isAddbutton: boolean
      isMultiselect: boolean
      loading: boolean
      tableData: any[]
      tableColumn: TableColumn[]
      searchColumn: SearchColumn[]
      page: number
      pageSize: number
      totalSize: number
    }>(),
    {
      loading: false,
      isAddbutton: false,
      isMultiselect: false,
      tableData: () => [],
      tableColumn: () => [],
      searchColumn: () => [],
      page: 1,
      pageSize: 5,
      totalSize: 0
    }
  )

  const visible = ref(true)
  const toggleVisibility = () => {
    visible.value = !visible.value
  }
  const searchColumnLength = ref(Math.max(props.searchColumn.length, 9))

  // Watch the changes in searchColumn and update the length (up to a maximum of 6)
  watch(
    () => props.searchColumn,
    () => {
      searchColumnLength.value = Math.max(props.searchColumn.length, 9)
    },
    { deep: true }
  )

  const selectedRows = ref([])

  const openActionDialog = () => {
    emits("open:dialog")
  }

  const emits = defineEmits(["update:page", "update:page-size", "open:dialog", "update:selected"])

  const pageSizeOption = [5, 10, 20, 50, 100]
  const showingStart = ref(0)
  const showingEnd = ref(0)
  const filter = ref("")
  const initialPagination = ref({
    sortBy: "desc",
    descending: false,
    rowsPerPage: props.pageSize
  })

  const maxPages = computed(() => Math.ceil(props.totalSize / props.pageSize))

  const updatePageSize = (num: number) => {
    initialPagination.value.rowsPerPage = num
    emits("update:page-size", num)
    updateShowing(props.page, num, props.totalSize)
  }

  const updatePage = (num: number) => {
    emits("update:page", num)
    updateShowing(num, initialPagination.value.rowsPerPage, props.totalSize)
  }

  const updateShowing = (currentPage: number, itemsPerPage: number, totalItems: number) => {
    showingStart.value = (currentPage - 1) * itemsPerPage + 1
    showingEnd.value = currentPage * itemsPerPage

    if (totalItems > 0) {
      showingEnd.value = showingEnd.value > totalItems ? totalItems : showingEnd.value
    }
  }

  watch(selectedRows, (newSelectedRows) => {
    emits("update:selected", newSelectedRows)
  })

  const searchFormInitData: SearchFormData = reactive({})

  // Initialize searchFormInitData with default values based on searchColumn

  const handleDateRangeInput = (num: any) => {
    searchFormInitData.from = num.from
    searchFormInitData.to = num.to
  }

  // Watcher to log changes
  watch(
    searchFormInitData,
    (newValue) => {
      console.log(JSON.stringify(newValue, null, 2))
    },
    { deep: true }
  )

  onMounted(() => {
    updateShowing(1, 5, props.totalSize)
  })
</script>

<style lang="scss" scoped>
  ::v-deep .q-field__control {
    height: 40px;
    align-items: center;
  }

  ::v-deep .q-field__label {
    top: 0.7vw;
    font-size: 14px;
  }

  .label {
    margin-right: 1vw;
  }

  .table-pagination {
    &-wrap {
      .q-card-actions {
        padding-top: 0;
        padding-bottom: 0;
      }
    }

    ::v-deep .q-field__control {
      width: 100%;
    }

    span {
      margin: 0 1vw;
    }
  }

  .bg-unset,
  .q-card,
  .q-table__card {
    background: unset !important;
  }

  .float-left-pagination,
  .float-right-pagination {
    float: left;
    width: 50%;
    justify-content: flex-start;
    display: flex;
    align-items: center;
    gap: 10px;

    &.float-right-pagination {
      float: right;
      justify-content: flex-end;
    }
  }

  :deep(.q-field--dense.q-field--float .q-field__label) {
    transform: translateY(-20%) scale(0.75) !important;
  }
</style>
