<template>
  <!-- 今日投注排行 -->
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

              <!-- 投注金額 -->
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
  import { useRouter, useRoute } from "vue-router"
  import { startOfDay, endOfDay } from "date-fns"
  import { useCommon } from "@/hook/useCommon"
  import { useEnv, ENV_MODE_ENUM } from "src/hook/useEnv"
  import * as Response from "@/api/response.type"

  interface IDatas {
    label: string
    list: Response.BetRankItem[]
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
      name: "valid_bet_amount",
      label: t("table_header.bet_amount"),
      field: "valid_bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "profit",
      label: t("table_header.winlose"),
      field: "profit",
      sortable: false,
      align: "center"
    }
  ])

  onMounted(() => {})

  const { envData } = useEnv()
  const envMode = computed(() => envData().VITE_APP_MODE)

  const router = useRouter()
  const route = useRoute()
  function onDetails() {
    let currentRouterName = "MasterAgentBetReport"
    const today = new Date()
    const { currency_id: currency } = route.query

    switch (envMode.value) {
      case ENV_MODE_ENUM.ADMIN:
        currentRouterName = "MasterAgentBetReport"
        break
      case ENV_MODE_ENUM.GENERAL_AGENT:
        currentRouterName = "AgentBetReport"
        break
    }

    router.push({
      name: currentRouterName,
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
