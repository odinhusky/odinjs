<template>
  <!-- 今日存款排行 -->
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
          table-header-class="bg-success"
        >
          <template #body="props">
            <q-tr>
              <!-- 站點 -->
              <q-td key="agent_code" :props="props">
                {{ props.row.agent_title || props.row.agent_code }}
              </q-td>

              <!-- 存款 -->
              <q-td key="deposit" :props="props">
                {{ moneyFormat(props.row.deposit) }}
              </q-td>

              <!-- 淨出入 -->
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
  import { useRouter, useRoute } from "vue-router"
  import { startOfDay, endOfDay } from "date-fns"
  import { useCommon } from "@/hook/useCommon"
  import * as Response from "@/api/response.type"

  interface IDatas {
    label: string
    list: Response.CashRankItem[]
  }

  const { moneyFormat } = useCommon()
  const { t } = useI18n()

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
      name: "agent_code",
      label: t("table_header.site"),
      field: "agent_code",
      sortable: false,
      align: "center"
    },
    {
      name: "deposit",
      label: t("table_header.deposit"),
      field: "deposit",
      sortable: false,
      align: "center"
    },
    {
      name: "profit",
      label: t("table_header.net_deposit"),
      field: "profit",
      sortable: false,
      align: "center"
    }
  ])

  onMounted(() => {})

  const router = useRouter()
  const route = useRoute()
  function onDetails() {
    const today = new Date()
    const { currency_id: currency } = route.query
    router.push({
      name: "CashReportList",
      query: {
        start: startOfDay(today).getTime(),
        end: endOfDay(today).getTime(),
        currency
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
