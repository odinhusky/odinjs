<template>
  <!-- 今日熱門供應商 -->
  <q-card class="full-height column">
    <q-card-section class="q-pb-none">
      <div class="text-grey-8 text-bold row items-center dash-title">
        <span>{{ datas && datas.label ? $t(datas.label) : $t("common.unknow") }}</span>
        <q-space />
        <q-btn outline color="success" @click="onDetails()" class="detail-btn">
          {{ $t("btn.view_details") }}
        </q-btn>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <div :style="{ height: tableHeight }" class="table-container">
        <q-table
          class="table_v2"
          flat
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="datas.list"
          :columns="tableColumn"
          row-key="id"
        >
          <template #body="props">
            <q-tr>
              <!-- 供應商 -->
              <q-td key="product_title" :props="props">
                {{ props.row.product_title || props.row.product_code }}
              </q-td>

              <!-- 投注人數 -->
              <q-td key="player_count" :props="props">
                {{ moneyFormat(props.row.player_count) }}
              </q-td>

              <!-- 有效投注 -->
              <q-td key="valid_bet_amount" :props="props">
                {{ moneyFormat(props.row.valid_bet_amount) }}
              </q-td>

              <!-- 盈虧 -->
              <q-td key="profit" :props="props">
                {{ moneyFormat(props.row.profit) }}
              </q-td>
            </q-tr>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm column no_data" style="margin-top: 1.875rem">
              <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
              <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
            </div>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { PropType, defineProps, reactive, computed, onMounted } from "vue"
  import { CustomQTableProps, CustomColumn } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { useCommon } from "@/hook/useCommon"
  import { CURRENCY_TYPE } from "@/utils/constants"
  import { startOfDay, endOfDay } from "date-fns"
  import { useUserInfo } from "@/hook/useUserInfo"
  import * as Response from "@/api/response.type"

  interface IDatas {
    label: string
    list: Response.ProductDataItem[]
  }

  const { moneyFormat } = useCommon()
  const { t } = useI18n()
  const { isAnibetAgent } = useUserInfo()

  const props = defineProps({
    datas: {
      type: Object as PropType<IDatas>,
      required: false,
      default: () => {
        return {
          label: "",
          list: []
        }
      }
    }
  })

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "product_title",
      label: t("table_header.supplier"),
      field: "product_title",
      sortable: false,
      align: "center"
    },
    {
      name: "player_count",
      label: t("table_header.betting_count"),
      field: "player_count",
      sortable: false,
      align: "center"
    },
    {
      name: "valid_bet_amount",
      label: t("table_header.validate_bet"),
      field: "valid_bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "profit",
      label: isAnibetAgent.value ? t("table_header.ggr_amount") : t("table_header.winlose"),
      field: "profit",
      sortable: false,
      align: "center"
    }
  ])

  onMounted(() => {})

  const route = useRoute()
  const router = useRouter()
  function onDetails() {
    const currencyId = Number(route.query.currency_id)
    const currency = isNaN(currencyId) ? CURRENCY_TYPE.Enums.IDR : currencyId

    const today = new Date()
    router.push({
      name: "ProductBetReportList",
      query: {
        currency,
        start: startOfDay(today).getTime(),
        end: endOfDay(today).getTime()
      }
    })
  }
  const tableHeight = computed(() => {
    const rowHeight = 37
    const headerHeight = 37
    const maxHeight = 326
    const rowCount = props.datas.list.length
    if (rowCount === 0 || rowCount <= 10) {
      return "auto"
    }

    const contentHeight = rowCount * rowHeight + headerHeight
    return `${Math.min(contentHeight, maxHeight)}px`
  })
</script>

<style lang="scss" scoped>
  .h-100 {
    height: 100%;
  }
</style>
