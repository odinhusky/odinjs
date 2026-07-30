<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            row-key="id"
            table-header-class="bg-success"
          >
            <template #body="props">
              <q-tr>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="billing_date" :props="props">
                  {{ props.row.billing_date }}
                </q-td>
                <q-td key="billing_cycle" :props="props">
                  {{ props.row.period_start_at }} ~ {{ props.row.period_end_at }}
                </q-td>
                <q-td key="billing_type" :props="props">
                  <span v-if="props.row.billing_type === 'daily'">{{ $t("settlement_cycle.daily") }}</span>
                  <span v-else>{{ $t("settlement_cycle.weekly") }}</span>
                </q-td>
                <!-- 錢包類型 -->
                <q-td v-if="walletSwitch" key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>

                <q-td key="dispatch_type" :props="props">
                  {{ getDispatchTypeLabel(props.row.payout_method) }}
                </q-td>
                <q-td key="calculation_type" :props="props">
                  {{ getCalculationTypeLabel(props.row.calculation_type) }}
                </q-td>
                <!-- 狀態 -->
                <q-td key="status" :props="props">
                  {{
                    $t(
                      AGENT_MEMBER_COMMISSION_REWARD_STATUS.I18nKeys[
                        props.row.status as AGENT_MEMBER_COMMISSION_REWARD_STATUS.Enums
                      ] || ""
                    )
                  }}
                </q-td>
                <q-td key="cashback_count" :props="props">
                  {{ props.row.cashback_count }}
                </q-td>

                <!-- 明細 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("common.detail") }}</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type { CustomQTableProps } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useSearch } from "@/hook/useSearch"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { GetAgentMemberCommissionDetailList } from "@/api/agentMemberManagements"
  import type { GetAgentMemberCommissionDetailDetail } from "@/api/request.type"
  import { useCommon } from "@/hook/useCommon"
  import { AGENT_MEMBER_COMMISSION_REWARD_STATUS, SEND_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  const { genTimeFormat } = useCommon()
  const { walletSwitch } = useWalletBouns()

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      filterShowOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useCommissionName: true,
      useAgentCommissionCalculationType: true,
      useSendType: true,
      useMemberAccount: true,
      useDatePicker: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    return baseConfig
  })

  let { search, tableData, totalSize } = useSearch(GetAgentMemberCommissionDetailList)

  async function onSubmit(queryForm: GetAgentMemberCommissionDetailDetail) {
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "name",
      label: t("table_header.commission_name"),
      field: "name",
      sortable: false,
      align: "center"
    },
    {
      name: "billing_date",
      label: t("table_header.settlement_date"),
      field: "billing_date",
      sortable: false,
      align: "center"
    },
    {
      name: "billing_cycle",
      label: t("table_header.settlement_scope"),
      field: "billing_cycle",
      sortable: false,
      align: "center"
    },
    {
      name: "billing_type",
      label: t("table_header.settle_cycle"),
      field: "billing_type",
      sortable: false,
      align: "center"
    },
    ...(walletSwitch.value
      ? [
          {
            name: "wallet_type",
            label: t("table_header.wallet_type"),
            field: "wallet_type",
            sortable: false,
            align: "center" as const
          }
        ]
      : []),
    {
      name: "dispatch_type",
      label: t("table_header.reward_type"),
      field: "dispatch_type",
      sortable: false,
      align: "center"
    },
    {
      name: "calculation_type",
      label: t("table_header.calculate_type"),
      field: "calculation_type",
      sortable: false,
      align: "center"
    },
    {
      name: "status",
      label: t("table_header.status"),
      field: "status",
      sortable: false,
      align: "center"
    },
    {
      name: "cashback_count",
      label: t("table_header.reward_count"),
      field: "cashback_count",
      sortable: false,
      align: "center"
    },
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])

  function onAction(row: { statement_id: number; commission_id: number; name: string }) {
    const { start, end } = route.query

    router.push({
      name: "AgentMemberCommissioDetailDetail",
      params: {
        statement_id: row.statement_id,
        commission_id: row.commission_id
      },
      query: {
        commission_name: row.name,
        account: "",
        start,
        end
      }
    })
  }

  function getCalculationTypeLabel(calculationType?: number | string | null) {
    const normalizedType = Number(calculationType)
    const mode = normalizedType === 2 ? 2 : 1
    return mode === 2 ? t("table_header.net_gaming_revenue") : t("table_header.winlose")
  }

  function getDispatchTypeLabel(dispatchType?: number | string | null) {
    const normalizedType = Number(dispatchType) || SEND_TYPE.Enums.Auto
    return t(SEND_TYPE.I18nKeys[normalizedType as SEND_TYPE.Enums] || "common.unknow")
  }
</script>
