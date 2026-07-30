<script setup lang="ts">
import DataTable from "primevue/datatable"
import Column from "primevue/column"

export interface BaseTableColumn<T = Record<string, any>> {
  field: keyof T | string
  header: string
  key?: string
  width?: string
  headerClass?: string
  bodyClass?: string
}

export interface BaseTableHeaderGroupCell {
  header: string
  rowspan?: number
  colspan?: number
  headerClass?: string
}

export interface BaseTableHeaderGroupRow {
  cells: BaseTableHeaderGroupCell[]
}

interface Props<T = Record<string, any>> {
  rows?: T[]
  columns?: BaseTableColumn<T>[]
  rowKey?: keyof T | string
  loading?: boolean

  pagination?: boolean
  page?: number
  rowsPerPage?: number
  totalRecords?: number
  maxVisiblePages?: number
  serverPagination?: boolean

  scrollHeight?: string
  virtualScrollerOptions?: Record<string, any>
  dataTableProps?: Record<string, any>

  /**
   * 雙層(或多層)表頭。傳入後會以自訂 table 渲染,
   * 避免 PrimeVue ColumnGroup 子欄位污染 body 欄位。
   */
  headerGroup?: BaseTableHeaderGroupRow[]

  isShowMobileCard?: boolean
  emptyText?: string

  classObj?: {
    root?: string
    filterWrap?: string
    tableWrap?: string
    tableHead?: string
    tableHeadRow?: string
    tableHeadCell?: string
    tableBody?: string
    tableBodyRow?: string
    tableBodyCell?: string
    mobileCardWrap?: string
    mobileCard?: string
    mobileToggleRow?: string | ((payload: { row: T; index: number; expanded: boolean }) => string)
    mobileRowListWrap?: string | ((payload: { row: T; index: number; expanded: boolean }) => string)
  }
}

const props = withDefaults(defineProps<Props>(), {
  rows: () => [],
  columns: () => [],
  rowKey: "id",
  loading: false,
  pagination: true,
  page: 1,
  rowsPerPage: 10,
  totalRecords: 0,
  maxVisiblePages: 5,
  serverPagination: false,
  scrollHeight: "420px",
  virtualScrollerOptions: () => ({ itemSize: 52 }),
  dataTableProps: () => ({}),
  isShowMobileCard: true,
  emptyText: "無資料",
  classObj: () => ({})
})

const emit = defineEmits<{
  (e: "update:page", page: number): void
  (e: "update:rowsPerPage", rowsPerPage: number): void
  (e: "page-change", payload: { page: number; rowsPerPage: number }): void
  (e: "row-toggle", payload: { row: any; expanded: boolean }): void
}>()

const { isDown } = useCustomBreakpoints()

const internalPage = ref(props.page)
const internalRowsPerPage = ref(props.rowsPerPage)
const expandedRowKeySet = ref(new Set<string | number>())

watch(
  () => props.page,
  (value) => {
    internalPage.value = value
  }
)

watch(
  () => props.rowsPerPage,
  (value) => {
    internalRowsPerPage.value = value
  }
)

const hasFiltersSlot = computed(() => Boolean(useSlots().filters))

const totalRecordsResolved = computed(() => {
  if (props.serverPagination) {
    return props.totalRecords
  }

  return props.totalRecords > 0 ? props.totalRecords : props.rows.length
})

const displayedRows = computed(() => {
  if (!props.pagination) return props.rows
  if (props.serverPagination) return props.rows

  const start = (internalPage.value - 1) * internalRowsPerPage.value
  return props.rows.slice(start, start + internalRowsPerPage.value)
})

const shouldShowMobileCard = computed(() => props.isShowMobileCard && isDown.mob)
const hasRows = computed(() => displayedRows.value.length > 0)
const hasHeaderGroup = computed(() => Boolean(props.headerGroup && props.headerGroup.length))
const tableStyleResolved = computed(() => props.dataTableProps?.tableStyle ?? "min-width: 960px; width: 100%;")

const getRowKey = (row: any, index: number) => {
  const key = row?.[props.rowKey as string]
  if (key === undefined || key === null || key === "") return `row-${index}`
  return key as string | number
}

const isRowExpanded = (row: any, index: number) => expandedRowKeySet.value.has(getRowKey(row, index))

const resolveMobileRowClass = (
  classValue: string | ((payload: { row: any; index: number; expanded: boolean }) => string) | undefined,
  payload: { row: any; index: number; expanded: boolean }
) => {
  if (!classValue) return undefined
  if (typeof classValue === "function") return classValue(payload)
  return classValue
}

const getMobileToggleRowClass = (row: any, index: number) => {
  return resolveMobileRowClass(props.classObj?.mobileToggleRow, {
    row,
    index,
    expanded: isRowExpanded(row, index)
  })
}

const getMobileRowListWrapClass = (row: any, index: number) => {
  return resolveMobileRowClass(props.classObj?.mobileRowListWrap, {
    row,
    index,
    expanded: isRowExpanded(row, index)
  })
}

const toggleRowExpand = (row: any, index: number) => {
  const key = getRowKey(row, index)
  const next = new Set(expandedRowKeySet.value)

  if (next.has(key)) {
    next.delete(key)
    expandedRowKeySet.value = next
    emit("row-toggle", { row, expanded: false })
    return
  }

  next.add(key)
  expandedRowKeySet.value = next
  emit("row-toggle", { row, expanded: true })
}

const handlePageChange = (page: number) => {
  internalPage.value = page
  emit("update:page", page)
  emit("page-change", { page, rowsPerPage: internalRowsPerPage.value })
}

const getColumnStyle = (column: BaseTableColumn) => {
  if (!column.width) return undefined
  return { width: column.width, minWidth: column.width }
}
</script>

<template>
  <section :class="cx('w-full h-full min-h-0 flex flex-col gap-3', props.classObj?.root)">
    <div v-if="hasFiltersSlot" :class="cx('w-full', props.classObj?.filterWrap)">
      <slot name="filters" />
    </div>

    <div v-if="hasFiltersSlot && isDown.mob" class="h-px w-full bg-[var(--border-line-02)]" />

    <div
      v-if="shouldShowMobileCard"
      :class="cx('w-full h-full min-h-0 flex flex-col gap-3', props.classObj?.mobileCardWrap)"
    >
      <template v-if="hasRows">
        <article
          v-for="(row, index) in displayedRows"
          :key="`mobile-${getRowKey(row, index)}`"
          :class="
            cx(
              'rounded-xl overflow-hidden bg-[var(--table-table-content-bg-light)] border border-[var(--border-border-primary)]',
              'group',
              props.classObj?.mobileCard
            )
          "
        >
          <BasePlainBtn
            :class-obj="{
              button: cx(
                'w-full text-left border-r border-transparent transition-colors duration-150',
                getMobileToggleRowClass(row, index)
              )
            }"
            @click="toggleRowExpand(row, index)"
          >
            <slot
              name="mobileCardToggleRow"
              :data="row"
              :index="index"
              :expanded="isRowExpanded(row, index)"
              :toggle="() => toggleRowExpand(row, index)"
            >
              <div
                :class="
                  cx('w-full', FLEX_ITEMS_CENTER, 'justify-between gap-3', 'bg-[var(--list-list-bg-enabled)]', 'p-4')
                "
              >
                <div class="text-sm font-bold text-[var(--table-table-content-title-enabled)]">
                  {{ row?.[props.columns[0]?.field as string] ?? "-" }}
                </div>

                <BaseIcon :name="isRowExpanded(row, index) ? 'mdi:chevron-up' : 'mdi:chevron-down'" size="20px" />
              </div>
            </slot>
          </BasePlainBtn>

          <div
            v-if="isRowExpanded(row, index)"
            :class="
              cx(
                'px-3 pb-2 border-r border-transparent transition-colors duration-150',
                getMobileRowListWrapClass(row, index)
              )
            "
          >
            <slot name="mobileCardRowList" :data="row" :index="index">
              <div
                v-for="column in props.columns"
                :key="`mobile-item-${String(column.field)}-${index}`"
                class="flex p-2 items-center border-b border-[var(--border-border-primary)]"
              >
                <div :class="cx('w-1/2 text-xs leading-[18px] text-[var(--table-table-content-title-enabled)]')">
                  {{ column.header }}
                </div>
                <div
                  :class="
                    cx(
                      'w-1/2 ml-auto text-right text-xs leading-[18px] font-bold text-[var(--table-table-content-title-enabled)] break-all'
                    )
                  "
                >
                  {{ row?.[column.field as string] ?? "-" }}
                </div>
              </div>
            </slot>
          </div>
        </article>
      </template>

      <div v-else class="h-full min-h-[220px]">
        <slot name="empty">
          <NoData type="empty" />
        </slot>
      </div>
    </div>

    <div
      v-else
      :class="
        cx(
          'w-full min-h-0 flex-1 overflow-x-auto rounded-lg border border-[var(--border-border-primary)]',
          '[scrollbar-color:var(--scrolling-bar-scrolling-active)_transparent]',
          '[&::-webkit-scrollbar]:h-2',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:bg-[var(--scrolling-bar-scrolling-active)]',
          props.classObj?.tableWrap
        )
      "
    >
      <template v-if="hasHeaderGroup">
        <table
          :style="tableStyleResolved"
          class="w-full border-collapse bg-transparent"
        >
          <colgroup>
            <col
              v-for="column in props.columns"
              :key="`custom-col-${column.key || String(column.field)}`"
              :style="getColumnStyle(column)"
            />
          </colgroup>
          <thead
            :class="
              cx(
                '[&>tr>th]:bg-[var(--table-table-header-bg)] [&>tr>th]:text-[var(--table-table-header-title)] [&>tr>th]:text-base [&>tr>th]:leading-6 [&>tr>th]:font-bold [&>tr>th]:px-8 [&>tr>th]:py-3 [&>tr>th]:whitespace-nowrap [&>tr>th]:border-0 [&>tr>th]:text-center [&>tr>th]:align-middle',
                props.classObj?.tableHead
              )
            "
          >
            <tr
              v-for="(row, rowIndex) in props.headerGroup"
              :key="`custom-hg-row-${rowIndex}`"
              :class="cx('!border-0', props.classObj?.tableHeadRow)"
            >
              <th
                v-for="(cell, cellIndex) in row.cells"
                :key="`custom-hg-cell-${rowIndex}-${cellIndex}`"
                :rowspan="cell.rowspan"
                :colspan="cell.colspan"
                :class="cx('!text-center !align-middle', props.classObj?.tableHeadCell, cell.headerClass)"
              >
                {{ cell.header }}
              </th>
            </tr>
          </thead>
          <tbody
            v-if="hasRows"
            :class="
              cx(
                '[&>tr:nth-child(odd)]:bg-[var(--table-table-content-bg-light)] [&>tr:nth-child(even)]:bg-[var(--table-table-content-bg-dark)] [&>tr>td]:text-[var(--table-table-content-title-enabled)] [&>tr>td]:text-sm [&>tr>td]:leading-5 [&>tr>td]:px-4 [&>tr>td]:py-4 [&>tr>td]:border-0 [&>tr>td]:whitespace-nowrap',
                props.classObj?.tableBody
              )
            "
          >
            <tr
              v-for="(row, rowIndex) in displayedRows"
              :key="`custom-row-${getRowKey(row, rowIndex)}`"
              :class="cx(props.classObj?.tableBodyRow)"
            >
              <td
                v-for="column in props.columns"
                :key="`custom-cell-${String(column.field)}-${getRowKey(row, rowIndex)}`"
                :class="cx('text-center align-middle', props.classObj?.tableBodyCell, column.bodyClass)"
              >
                <slot
                  :name="`cell-${String(column.field)}`"
                  :data="row"
                  :value="row?.[String(column.field)]"
                  :column="column"
                >
                  {{ row?.[String(column.field)] ?? "-" }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!hasRows" class="h-full min-h-[220px]">
          <slot name="empty">
            <NoData type="empty" />
          </slot>
        </div>
      </template>

      <DataTable
        v-else
        :value="displayedRows"
        :loading="props.loading"
        :scrollable="true"
        :scroll-height="props.pagination ? undefined : props.scrollHeight"
        :virtual-scroller-options="props.pagination ? undefined : props.virtualScrollerOptions"
        :table-style="tableStyleResolved"
        class="base-table w-full !bg-transparent"
        v-bind="props.dataTableProps"
        :pt="{
          root: { class: '!bg-transparent' },
          bodyRow: { class: cx('!bg-transparent', props.classObj?.tableBodyRow) },
          table: { class: '!w-full' },
          thead: {
            class: cx(
              '[&>tr>th]:!bg-[var(--table-table-header-bg)] [&>tr>th]:text-[var(--table-table-header-title)] [&>tr>th]:text-base [&>tr>th]:leading-6 [&>tr>th]:font-bold [&>tr>th]:px-8 [&>tr>th]:py-3 [&>tr>th]:whitespace-nowrap [&>tr>th]:border-0 [&>tr>th]:!text-center',
              '[&_.p-datatable-column-header-content]:!w-full [&_.p-datatable-column-header-content]:!flex [&_.p-datatable-column-header-content]:!items-center [&_.p-datatable-column-header-content]:!justify-center',
              props.classObj?.tableHead
            )
          },
          headerRow: {
            class: cx('!border-0', props.classObj?.tableHeadRow)
          },
          headerCell: {
            class: cx('!text-center !align-middle', props.classObj?.tableHeadCell)
          },
          tbody: {
            class: cx(
              '[&>tr:nth-child(odd)]:!bg-[var(--table-table-content-bg-light)] [&>tr:nth-child(even)]:!bg-[var(--table-table-content-bg-dark)] [&>tr>td]:text-[var(--table-table-content-title-enabled)] [&>tr>td]:text-sm [&>tr>td]:leading-5 [&>tr>td]:px-4 [&>tr>td]:py-4 [&>tr>td]:border-0 [&>tr>td]:whitespace-nowrap',
              props.classObj?.tableBody
            )
          },
          bodyCell: {
            class: cx('!align-middle', props.classObj?.tableBodyCell)
          },
          emptyMessageCell: { class: '!bg-transparent !border-0' },
          emptyMessage: { class: '!bg-transparent' }
        }"
      >
        <template v-for="column in props.columns" :key="column.key || String(column.field)">
          <Column
            :field="String(column.field)"
            :header="column.header"
            :header-class="cx('!text-center', column.headerClass)"
            :body-class="cx('!text-center', column.bodyClass)"
            :style="getColumnStyle(column)"
          >
            <template #body="slotProps">
              <slot
                :name="`cell-${String(column.field)}`"
                :data="slotProps.data"
                :value="slotProps.data?.[String(column.field)]"
                :column="column"
              >
                {{ slotProps.data?.[String(column.field)] ?? "-" }}
              </slot>
            </template>
          </Column>
        </template>

        <template #empty>
          <slot name="empty">
            <NoData type="empty" />
          </slot>
        </template>
      </DataTable>
    </div>

    <div v-if="props.pagination" class="flex justify-end pt-2">
      <BasePagination
        :model-value="internalPage"
        :rows="internalRowsPerPage"
        :total-records="totalRecordsResolved"
        :max-visible-pages="props.maxVisiblePages"
        @update:model-value="handlePageChange"
      />
    </div>
  </section>
</template>
