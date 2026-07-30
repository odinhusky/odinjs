<template>
  <OnlyTitle :backLabelI18nKey="route.params.memberAccount as string" :custom-back-func="onBack" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="user-data">
          <div class="team-data-title">{{ $t("menu.self_data") }}</div>

          <!-- 個人數據 q-table -->
          <q-table
            square
            flat
            hide-pagination
            hide-no-data
            :rows-per-page-options="[0]"
            :rows="personalTableRows"
            :columns="personalTableColumn"
            table-header-class="bg-success"
            row-key="__key"
          >
            <template #body="props">
              <q-tr>
                <q-td key="member_account" :props="props" class="expand-cell">
                  <q-icon
                    :name="personalExpanded ? 'arrow_drop_down' : 'arrow_right'"
                    color="blue"
                    size="sm"
                    class="cursor-pointer expand-icon"
                    @click="toggleSelfDataExpand"
                  />
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="currency" :props="props">{{ props.row.currency }}</q-td>
                <q-td key="bet_count" :props="props">{{ moneyFormat(props.row.bet_count) }}</q-td>
                <q-td key="deposit" :props="props">{{ moneyFormat(props.row.deposit) }}</q-td>
                <q-td key="withdraw" :props="props">{{ moneyFormat(props.row.withdraw) }}</q-td>
                <q-td key="bet_amount" :props="props">{{ moneyFormat(props.row.bet_amount) }}</q-td>
                <q-td key="valid_bet" :props="props">{{ moneyFormat(props.row.valid_bet) }}</q-td>
                <q-td key="prize" :props="props">{{ moneyFormat(props.row.prize) }}</q-td>
                <q-td key="profit" :props="props">{{ moneyFormat(props.row.profit) }}</q-td>
                <q-td key="rate" :props="props">{{ props.row.rate != null ? `${props.row.rate}%` : "-" }}</q-td>
                <q-td key="bonus" :props="props">{{ moneyFormat(props.row.bonus) }}</q-td>
              </q-tr>

              <!-- 展開：錢包類型子表頭 -->
              <q-tr v-if="personalExpanded" class="sub-header-row">
                <q-td class="sub-header-empty" />
                <q-td class="text-center text-bold">{{ $t("table_header.wallet_type") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.order_quantity") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.deposit_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.withdrawal_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.bet_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.valid_bet") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.payout") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.winlose") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.winrate_count") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.event_amount") }}</q-td>
              </q-tr>

              <!-- 展開：錢包類型子資料列 -->
              <template v-if="personalExpanded">
                <q-tr v-if="personalExpandedLoading" class="bg-grey-1">
                  <q-td :colspan="personalTableColumn?.length" class="text-center">
                    <q-spinner size="sm" />
                  </q-td>
                </q-tr>
                <q-tr v-else-if="!personalExpandedData.length" class="bg-grey-1">
                  <q-td :colspan="personalTableColumn?.length" class="text-center">
                    {{ $t("common.no_data") }}
                  </q-td>
                </q-tr>
                <q-tr v-for="(subRow, subIdx) in personalExpandedData" v-else :key="subIdx" class="bg-grey-1">
                  <q-td />
                  <q-td class="text-center">
                    {{ $t(BONUS_WALLET_TYPE.I18nKeys[subRow.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
                  </q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_count) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.deposit) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.withdraw) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_amount) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.valid_bet) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.prize) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.profit) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.rate) }}%</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bonus) }}</q-td>
                </q-tr>
              </template>

              <!-- 展開：團隊摘要表頭 -->
              <q-tr v-if="personalExpanded" class="sub-header-row">
                <q-td colspan="2" class="text-center text-bold">{{ $t("table_header.team_member_count") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_bet_count") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_deposit_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_withdrawal_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_betting_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_valid_bet_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_payout_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_profit_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_profit_rate") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_activity_bonus") }}</q-td>
              </q-tr>

              <!-- 展開：團隊摘要資料列 -->
              <q-tr v-if="personalExpanded" class="bg-grey-1">
                <q-td colspan="2" class="text-center">{{ moneyFormat(agentReportOwnData?.team?.member_count) }}</q-td>
                <q-td class="text-center">{{ moneyFormat(agentReportOwnData?.team?.bet_count) }}</q-td>
                <q-td class="text-center">{{ moneyFormat(agentReportOwnData?.team?.deposit) }}</q-td>
                <q-td class="text-center">{{ moneyFormat(agentReportOwnData?.team?.withdraw) }}</q-td>
                <q-td class="text-center">{{ moneyFormat(agentReportOwnData?.team?.bet_amount) }}</q-td>
                <q-td class="text-center">{{ moneyFormat(agentReportOwnData?.team?.valid_bet) }}</q-td>
                <q-td class="text-center">{{ moneyFormat(agentReportOwnData?.team?.prize) }}</q-td>
                <q-td class="text-center">{{ moneyFormat(agentReportOwnData?.team?.profit) }}</q-td>
                <q-td class="text-center">{{
                  agentReportOwnData?.team?.rate != null ? `${agentReportOwnData.team.rate}%` : "-"
                }}</q-td>
                <q-td class="text-center">{{ moneyFormat(agentReportOwnData?.team?.bonus) }}</q-td>
              </q-tr>

              <!-- 展開：團隊摘要錢包類型子表頭 -->
              <q-tr v-if="personalExpanded" class="sub-header-row">
                <q-td class="sub-header-empty" />
                <q-td class="text-center text-bold">{{ $t("table_header.wallet_type") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_bet_count") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_deposit_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_withdrawal_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_betting_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_valid_bet_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_payout_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_profit_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_profit_rate") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.team_activity_bonus") }}</q-td>
              </q-tr>

              <!-- 展開：團隊摘要錢包類型子資料列 -->
              <template v-if="personalExpanded">
                <q-tr v-if="teamSummaryExpandedLoading" class="bg-grey-1">
                  <q-td :colspan="personalTableColumn?.length" class="text-center">
                    <q-spinner size="sm" />
                  </q-td>
                </q-tr>
                <q-tr v-else-if="!teamSummaryExpandedData.length" class="bg-grey-1">
                  <q-td :colspan="personalTableColumn?.length" class="text-center">
                    {{ $t("common.no_data") }}
                  </q-td>
                </q-tr>
                <q-tr
                  v-for="(subRow, subIdx) in teamSummaryExpandedData"
                  v-else
                  :key="'team_' + subIdx"
                  class="bg-grey-1"
                >
                  <q-td />
                  <q-td class="text-center">
                    {{ $t(BONUS_WALLET_TYPE.I18nKeys[subRow.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
                  </q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_count) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.deposit) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.withdraw) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_amount) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.valid_bet) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.prize) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.profit) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.rate) }}%</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bonus) }}</q-td>
                </q-tr>
              </template>
            </template>
          </q-table>
        </div>

        <div class="bg-white p-5 rounded-[0.625rem]">
          <div class="team-data-title">{{ $t("menu.team_data") }}</div>

          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            table-header-class="bg-success"
            row-key="id"
          >
            <template #body="props">
              <!-- 主資料列 -->
              <q-tr>
                <q-td key="member_account" :props="props" class="expand-cell">
                  <q-icon
                    :name="teamExpandedRows[getTeamRowKey(props.row)] ? 'arrow_drop_down' : 'arrow_right'"
                    color="blue"
                    size="sm"
                    class="cursor-pointer expand-icon"
                    @click="toggleTeamExpand(props.row)"
                  />
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="member_count" :props="props">
                  {{ moneyFormat(props.row.member_count) }}
                </q-td>
                <q-td key="currency_id" :props="props">
                  {{ getCurrencyLabel(Number(props.row.currency_id)) }}
                </q-td>
                <q-td key="bet_count" :props="props">
                  {{ moneyFormat(props.row.bet_count) }}
                </q-td>
                <q-td key="deposit" :props="props">
                  {{ moneyFormat(props.row.deposit) }}
                </q-td>
                <q-td key="withdraw" :props="props">
                  {{ moneyFormat(props.row.withdraw) }}
                </q-td>
                <q-td key="bet_amount" :props="props">
                  {{ moneyFormat(props.row.bet_amount) }}
                </q-td>
                <q-td key="valid_bet" :props="props">
                  {{ moneyFormat(props.row.valid_bet) }}
                </q-td>
                <q-td key="prize" :props="props">
                  {{ moneyFormat(props.row.prize) }}
                </q-td>
                <q-td key="profit" :props="props">
                  {{ moneyFormat(props.row.profit) }}
                </q-td>
                <q-td key="rate" :props="props">
                  {{ `${props.row.rate}%` }}
                </q-td>
                <q-td key="bonus" :props="props">
                  {{ moneyFormat(props.row.bonus) }}
                </q-td>
              </q-tr>

              <!-- 展開：錢包類型子表頭 -->
              <q-tr v-if="teamExpandedRows[getTeamRowKey(props.row)]" class="sub-header-row">
                <q-td class="sub-header-empty" />
                <q-td class="sub-header-empty" />
                <q-td class="text-center text-bold">{{ $t("table_header.wallet_type") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.order_quantity") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.deposit_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.withdrawal_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.bet_amount") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.valid_bet") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.payout") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.winlose") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.winrate_count") }}</q-td>
                <q-td class="text-center text-bold">{{ $t("table_header.event_amount") }}</q-td>
              </q-tr>

              <!-- 展開：錢包類型子資料列 -->
              <template v-if="teamExpandedRows[getTeamRowKey(props.row)]">
                <q-tr v-if="teamExpandedLoading[getTeamRowKey(props.row)]" class="bg-grey-1">
                  <q-td :colspan="tableColumn?.length" class="text-center">
                    <q-spinner size="sm" />
                  </q-td>
                </q-tr>
                <q-tr v-else-if="!teamExpandedData[getTeamRowKey(props.row)]?.length" class="bg-grey-1">
                  <q-td :colspan="tableColumn?.length" class="text-center">
                    {{ $t("common.no_data") }}
                  </q-td>
                </q-tr>
                <q-tr
                  v-for="(subRow, subIdx) in teamExpandedData[getTeamRowKey(props.row)]"
                  v-else
                  :key="subIdx"
                  class="bg-grey-1"
                >
                  <q-td />
                  <q-td />
                  <q-td class="text-center">
                    {{ $t(BONUS_WALLET_TYPE.I18nKeys[subRow.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
                  </q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_count) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.deposit) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.withdraw) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bet_amount) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.valid_bet) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.prize) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.profit) }}</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.rate) }}%</q-td>
                  <q-td class="text-center">{{ moneyFormat(subRow.bonus) }}</q-td>
                </q-tr>
              </template>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
            </template>

            <!-- 本頁總計/搜尋結果總計 -->
            <template #bottom-row="props">
              <table-total-comp :columns="props.cols" :table-data="tableData" :total-data="tableTotal" />
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import type { CustomQTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { computed, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import {
    getMemberOverviewPersonal,
    getMemberOverviewList,
    getMemberOverviewDetail,
    getMemberOverviewTeamDetail
  } from "@/api/report"
  import type { GetMemberOverviewPersonalItem } from "@/api/response.type"
  import type * as Response from "@/api/response.type"
  import type { GetMemberOverviewList } from "@/api/request.type"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useQueryStore } from "@/stores/queryStore"
  import { useRouter, useRoute } from "vue-router"
  import OnlyTitle from "src/layouts/SubPage/OnlyTitle.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"

  const $q = useQuasar()
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const store = useQueryStore()
  const { moneyFormat } = useCommon()
  const { walletSwitch } = useWalletBouns()
  const { search, tableData, totalSize, tableTotal } = useSearch(getMemberOverviewList)

  const queryData = ref<GetMemberOverviewList>()
  const agentReportOwnData = ref<GetMemberOverviewPersonalItem>()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAgentAccountInput: true,
    useCurrency: true,
    useDatePicker: true
  })

  const currencyLabel = computed(() => {
    const label = store.currencyList.find((item) => item.value === Number(queryData.value?.currency))?.label ?? "-"
    return t(label)
  })

  const personalTableRows = computed(() => {
    if (!agentReportOwnData.value?.personal) return []
    return [
      {
        __key: "personal",
        member_account: queryData.value?.agentAccount ?? "-",
        currency: currencyLabel.value,
        ...agentReportOwnData.value.personal
      }
    ]
  })

  const personalTableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    { name: "currency", label: t("table_header.currency"), field: "currency", sortable: false, align: "center" },
    {
      name: "bet_count",
      label: t("table_header.order_quantity"),
      field: "bet_count",
      sortable: false,
      align: "center"
    },
    { name: "deposit", label: t("table_header.deposit_amount"), field: "deposit", sortable: false, align: "center" },
    {
      name: "withdraw",
      label: t("table_header.withdrawal_amount"),
      field: "withdraw",
      sortable: false,
      align: "center"
    },
    { name: "bet_amount", label: t("table_header.bet_amount"), field: "bet_amount", sortable: false, align: "center" },
    { name: "valid_bet", label: t("table_header.valid_bet"), field: "valid_bet", sortable: false, align: "center" },
    { name: "prize", label: t("table_header.payout"), field: "prize", sortable: false, align: "center" },
    { name: "profit", label: t("table_header.winlose"), field: "profit", sortable: false, align: "center" },
    { name: "rate", label: t("table_header.winrate_count"), field: "rate", sortable: false, align: "center" },
    { name: "bonus", label: t("table_header.event_amount"), field: "bonus", sortable: false, align: "center" }
  ])

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    {
      name: "member_count",
      label: t("table_header.team_member_count"),
      field: "member_count",
      sortable: false,
      align: "center"
    },
    {
      name: "currency_id",
      label: t("table_header.currency"),
      field: "currency_id",
      sortable: false,
      align: "center"
    },
    {
      name: "bet_count",
      label: t("table_header.team_bet_count"),
      field: "bet_count",
      sortable: false,
      align: "center"
    },
    {
      name: "deposit",
      label: t("table_header.team_deposit_amount"),
      field: "deposit",
      sortable: false,
      align: "center"
    },
    {
      name: "withdraw",
      label: t("table_header.team_withdrawal_amount"),
      field: "withdraw",
      sortable: false,
      align: "center"
    },
    {
      name: "bet_amount",
      label: t("table_header.team_betting_amount"),
      field: "bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "valid_bet",
      label: t("table_header.team_valid_bet_amount"),
      field: "valid_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "prize",
      label: t("table_header.team_payout_amount"),
      field: "prize",
      sortable: false,
      align: "center"
    },
    {
      name: "profit",
      label: t("table_header.team_profit_amount"),
      field: "profit",
      sortable: false,
      align: "center"
    },
    {
      name: "rate",
      label: t("table_header.team_profit_rate"),
      field: "rate",
      sortable: false,
      align: "center"
    },
    {
      name: "bonus",
      label: t("table_header.team_activity_bonus"),
      field: "bonus",
      sortable: false,
      align: "center"
    }
  ])

  const onSubmit = async (queryForm: GetMemberOverviewList) => {
    if (!queryForm.agentAccount) {
      return $q.notify({
        type: "negative",
        message: t("common.please_enter_agency_account_number"),
        position: "top",
        timeout: 2000
      })
    }

    if (!queryForm.currency) {
      return $q.notify({
        type: "negative",
        message: t("common.please_enter_currency_brand"),
        position: "top",
        timeout: 2000
      })
    }
    queryData.value = queryForm

    // 重置展開狀態
    personalExpanded.value = false
    personalExpandedData.value = []
    teamSummaryExpandedData.value = []
    Object.keys(teamExpandedRows).forEach((key) => {
      teamExpandedRows[key] = false
    })

    await Promise.all([search(queryForm), getMemberOverviewPersonalData(queryForm)])
  }

  const getMemberOverviewPersonalData = async (queryForm: GetMemberOverviewList) => {
    try {
      const res = await getMemberOverviewPersonal(queryForm)
      agentReportOwnData.value = res.data
    } catch (err) {
      console.error("Failed to fetch data:", err)
    }
  }

  const getCurrencyLabel = (currency: number) => {
    const label = store.currencyList.find((item) => item.value === currency)?.label ?? "-"
    return t(label)
  }

  const onBack = () => {
    router.push({
      name: "TeamAgentReportList",
      query: {
        ...route.query,
        agentAccount: route.params.memberAccount
      }
    })
  }

  // 展開：自身數據錢包類型明細
  const personalExpanded = ref(false)
  const personalExpandedData = ref<Response.MemberOverviewWalletDetailItem[]>([])
  const personalExpandedLoading = ref(false)

  const teamSummaryExpandedData = ref<Response.MemberOverviewTeamWalletDetailItem[]>([])
  const teamSummaryExpandedLoading = ref(false)

  async function toggleSelfDataExpand() {
    const newState = !personalExpanded.value
    personalExpanded.value = newState
    if (!newState) return

    personalExpandedLoading.value = true
    teamSummaryExpandedLoading.value = true
    try {
      const res = await getMemberOverviewDetail({
        ...queryData.value!,
        member_id: agentReportOwnData.value!.team.member_id
      })
      personalExpandedData.value = res.data?.personal || []
      teamSummaryExpandedData.value = res.data?.team || []
    } catch (err) {
      console.error(err)
    }
    personalExpandedLoading.value = false
    teamSummaryExpandedLoading.value = false
  }

  // 展開：團隊數據錢包類型明細
  const teamExpandedRows = reactive<Record<string, boolean>>({})
  const teamExpandedData = reactive<Record<string, Response.MemberOverviewTeamWalletDetailItem[]>>({})
  const teamExpandedLoading = reactive<Record<string, boolean>>({})

  function getTeamRowKey(row: Response.MemberOverviewItemDetail) {
    return `${row.member_id}_${row.currency_id}`
  }

  async function toggleTeamExpand(row: Response.MemberOverviewItemDetail) {
    const key = getTeamRowKey(row)
    if (teamExpandedRows[key]) {
      teamExpandedRows[key] = false
      return
    }
    teamExpandedRows[key] = true
    teamExpandedLoading[key] = true
    const { search: searchDetail, tableData: detailData, status } = useSearch(getMemberOverviewTeamDetail)
    await searchDetail({
      ...queryData.value!,
      member_id: row.member_id
    })
    if (status.value) {
      teamExpandedData[key] = detailData.value || []
    }
    teamExpandedLoading[key] = false
  }
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
  ::v-deep(.q-table__sort-icon) {
    opacity: 1;
  }
  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }

  :deep(.sub-header-row) {
    td {
      background-color: #dceeff !important;
    }

    td.sub-header-empty {
      background-color: transparent !important;
    }
  }

  .expand-cell {
    position: relative;
    text-align: center;
  }

  .expand-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
  }

  .team-data-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: #535252;
    margin-bottom: 0.625rem;
  }

  .user-data {
    width: 100%;
    background: white;
    border-radius: 0.625rem;
    padding: 1.25rem;
    margin: 0.25rem 0 1.25rem;
  }
</style>
