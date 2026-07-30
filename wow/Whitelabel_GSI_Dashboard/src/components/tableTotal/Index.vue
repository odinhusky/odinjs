<template>
  <!-- 本頁總計(小計資料由前端自行計算的版本) -->
  <q-tr v-if="showSubTotal && !subTotalFromApi" class="bg-main-light-color-2 text-bold table-total">
    <q-td class="text-center">{{ $t("common.total_for_this_page") }}</q-td>
    <q-td v-for="(column, key) in genColumns" :key="key" :class="column.align ? 'text-' + column.align : ''">
      <div v-if="column.useSubTotalColumn" :class="column.align ? 'text-' + column.align : ''">
        <!-- 前綴 -->
        <span v-if="column.prependStringI18nKey">{{ column.prependStringI18nKey }}</span>

        <!-- 數值 -->
        <span class="">
          {{ moneyFormat(column.subTotal) }}
        </span>

        <!-- 後綴 -->
        <span v-if="column.appendStringI18nKey">{{ column.appendStringI18nKey }}</span>
      </div>
      <div v-else :class="column.align ? 'text-' + column.align : ''">-</div>
    </q-td>
  </q-tr>

  <!-- 本頁總計(小計資料從API來的版本) -->
  <q-tr v-if="subTotalFromApi" class="bg-main-light-color-2 text-bold table-total">
    <q-td class="text-center">{{ $t("common.total_for_this_page") }}</q-td>
    <q-td v-for="(column, key) in genColumns" :key="key" :class="column.align ? 'text-' + column.align : ''">
      <div
        v-if="
          column.subTotalColumn &&
          subTotalData &&
          (!!subTotalData[column.subTotalColumn] || subTotalData[column.subTotalColumn] === 0)
        "
        :class="column.align ? 'text-' + column.align : ''"
      >
        <!-- 前綴 -->
        <span v-if="column.prependStringI18nKey" :class="column.align ? 'text-' + column.align : ''">{{
          column.prependStringI18nKey
        }}</span>

        <!-- 數值 -->
        <span :class="column.align ? 'text-' + column.align : ''">
          {{ moneyFormat(subTotalData[column.subTotalColumn]) }}
        </span>

        <!-- 後綴 -->
        <span :class="column.align ? 'text-' + column.align : ''" v-if="column.appendStringI18nKey">{{
          column.appendStringI18nKey
        }}</span>
      </div>
      <div v-else :class="column.align ? 'text-' + column.align : ''">-</div>
    </q-td>
  </q-tr>

  <!-- 搜尋結果總計 -->
  <q-tr v-if="showTotal" class="bg-main-light-color-2 text-bold table-total">
    <q-td class="text-center">{{ $t("common.total_for_search_results") }}</q-td>
    <q-td v-for="(column, key) in genColumns" :key="key" :class="column.align ? 'text-' + column.align : ''">
      <div
        v-if="
          column.totalColumn && totalData && (!!totalData[column.totalColumn] || totalData[column.totalColumn] === 0)
        "
        :class="column.align ? 'text-' + column.align : ''"
      >
        <!-- 前綴 -->
        <span v-if="column.prependStringI18nKey" :class="column.align ? 'text-' + column.align : ''">{{
          column.prependStringI18nKey
        }}</span>

        <!-- 數值 -->
        <span :class="column.align ? 'text-' + column.align : ''">
          {{ moneyFormat(totalData[column.totalColumn]) }}</span
        >

        <!-- 後綴 -->
        <span v-if="column.appendStringI18nKey" :class="column.align ? 'text-' + column.align : ''">{{
          column.appendStringI18nKey
        }}</span>
      </div>
      <div v-else :class="column.align ? 'text-' + column.align : ''">-</div>
    </q-td>
  </q-tr>
</template>

<script lang="ts" setup>
  import { CustomQTableProps, CustomColumn } from "quasar"
  import { PropType, defineProps, computed } from "vue"
  import { useCommon } from "@/hook/useCommon"

  const props = defineProps({
    columns: {
      type: Object as PropType<CustomQTableProps["columns"]>,
      required: true,
      default: () => {}
    },

    /** 表格資料 */
    tableData: {
      type: Array,
      required: false,
      default: () => []
    },

    /** 小計資料 */
    subTotalData: {
      type: Object as PropType<{
        [key: string]: number
      }>,
      required: false,
      default: () => {}
    },

    /** 總計資料 */
    totalData: {
      type: Object as PropType<{
        [key: string]: number
      }>,
      required: false,
      default: () => {}
    }
  })

  const { moneyFormat } = useCommon()

  const genColumns = computed<(CustomColumn & Partial<{ subTotal: number }>)[]>(() => {
    if (!props.columns || !props.columns.length) {
      return []
    }

    const columnData: (CustomColumn & Partial<{ subTotal: number }>)[] = props.columns.slice(1)

    // 若帶入小計資料，則小計資料不由前端自行計算
    if (props.subTotalData) {
      return columnData
    }

    columnData.forEach((item) => {
      if (item.useSubTotalColumn && props.tableData && props.tableData.length) {
        const countValue = props.tableData.reduce((sum: number, obj: any) => {
          if (!obj[item.field]) {
            return 0
          }

          if (typeof obj[item.field] !== "number") {
            try {
              return NaN
            } catch (e: any) {
              console.warn(`${item.field} is not a number`)
            }
          }

          return sum + obj[item.field]
        }, 0)
        item.subTotal = parseFloat(countValue.toFixed(2))
      }
    })

    return columnData
  })

  const showSubTotal = computed(
    () =>
      genColumns.value.length &&
      genColumns.value.some((item) => item.useSubTotalColumn) &&
      props.tableData &&
      props.tableData.length
  )
  const subTotalFromApi = computed(
    () => genColumns.value.length && genColumns.value.some((item) => item.subTotalColumn)
  )

  const showTotal = computed(() => genColumns.value.length && genColumns.value.some((item) => item.totalColumn))
</script>
