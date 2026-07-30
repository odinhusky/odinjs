<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-white-bg">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            class="table_v2"
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="valid_time" :props="props">
                  {{ genTimeFormat(props.row.start_time, "yyyy-MM-dd HH:mm") }} ~
                  {{ genTimeFormat(props.row.end_time, "yyyy-MM-dd HH:mm") }}
                </q-td>
                <q-td key="currency_code" :props="props">
                  {{ props.row.currency_code || getCurrencyCode(props.row.currency_id) }}
                </q-td>
                <q-td key="refunded_count" :props="props">
                  {{ props.row.refunded_count || 0 }}
                </q-td>

                <!-- 明細 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini icon="visibility" class="edit_pen" @click="onViewDetail(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.detail") }}</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm column no_data">
                <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
                <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
              </div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps } from "quasar"
  import { useRouter } from "vue-router"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import type * as Request from "@/api/request.type"
  import { getInterestApplicationRefunded } from "@/api/interest"
  import { CURRENCY_TYPE } from "@/utils/constants"
  import mockData from "@/../mock-data-interest-application.json"

  const { t } = useI18n()

  // 開發模式：設為 true 使用假資料，false 使用真實 API
  const USE_MOCK_DATA = false

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useEventName: true,
    useCurrency: true,
    useDatePicker: true,
    customDateTimeLabelI18nKey: "query_params.event_time",
    dateTimeIsUnnecessary: true
  })

  let { search, tableData, totalSize } = useSearch(getInterestApplicationRefunded)
  const { genTimeFormat } = useCommon()
  let catchQueryForm: Request.GetInterestApplicationRefunded

  // 使用假資料的模擬函數
  const mockSearch = async (queryForm: any) => {
    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 300))

    const mockResponse = mockData.getInterestApplicationRefunded
    tableData.value = mockResponse.data.list as any
    totalSize.value = mockResponse.data.pagination.total

    return mockResponse
  }

  async function onSubmit(queryForm: any) {
    catchQueryForm = queryForm

    if (USE_MOCK_DATA) {
      await mockSearch(queryForm)
    } else {
      await search(queryForm)
    }
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "name",
        label: t("query_params.event_name"),
        field: "name",
        sortable: false,
        align: "center"
      },
      {
        name: "valid_time",
        label: t("query_params.event_time"),
        field: "valid_time",
        sortable: false,
        align: "center"
      },
      {
        name: "currency_code",
        label: t("table_header.currency"),
        field: "currency_code",
        sortable: false,
        align: "center"
      },
      {
        name: "refunded_count",
        label: t("interest_treasure.refunded_peoeple_count"),
        field: "refunded_count",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    return columns
  })

  const router = useRouter()
  const onViewDetail = (row: any) => {
    router.push({
      name: "InterestTreasureInterestTreasureRecordDetail",
      params: { id: row.id },
      query: { name: row.name }
    })
  }

  const getCurrencyCode = (currencyId?: number): string => {
    if (!currencyId) return ""
    // 从 CURRENCY_TYPE.Enums 中查找对应的货币代码
    const currencyEntry = Object.entries(CURRENCY_TYPE.Enums).find(([_, value]) => value === currencyId)
    if (currencyEntry) {
      return currencyEntry[0] // 返回货币代码，如 USD, CNY 等
    }
    return String(currencyId) // 如果找不到，返回 ID 本身
  }
</script>

<style lang="scss" scoped>
  // 調整disable樣式
  .drag-container {
    opacity: 1 !important;

    .drag-icon {
      font-size: 30px;
      cursor: pointer !important;
    }
  }

  ::v-deep([disabled]) * {
    cursor: default !important;
  }
</style>
