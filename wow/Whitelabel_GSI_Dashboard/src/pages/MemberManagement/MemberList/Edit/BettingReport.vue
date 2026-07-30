<template>
  <q-card class="q-pa-md no-shadow editWrapper_v2">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="tableData"
          :columns="tableColumn"
          row-key="id"
          class="table_v2"
        >
          <template #body="props">
            <q-tr>
              <q-td key="code" :props="props">
                {{ props.row.code }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
              </q-td>
              <q-td key="settled_at" :props="props">
                {{ genTimeFormat(props.row.settled_at) }}
              </q-td>
              <q-td key="status" :props="props">
                {{ $t(SETTLEMENT_TYPE.I18nKeys[props.row.status as SETTLEMENT_TYPE.Enums] || "common.unknow") }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums] || "common.unknow") }}
              </q-td>
              <q-td key="wallet_type" :props="props">
                {{
                  props.row.wallet_type
                    ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                    : "-"
                }}
              </q-td>
              <q-td key="product_title" :props="props">
                {{ props.row.product_title }}
              </q-td>
              <q-td key="game_title" :props="props">
                {{ props.row.game_title }}
              </q-td>
              <q-td key="bet_amount" :props="props">
                {{ moneyFormat(props.row.bet_amount, 2) }}
              </q-td>
              <q-td key="valid_bet_amount" :props="props">
                {{ moneyFormat(props.row.valid_bet_amount, 2) }}
              </q-td>
              <q-td key="prize_amount" :props="props">
                <span class="text-blue-7 cursor-pointer" @click="handleDetails(props.row)">
                  {{ moneyFormat(props.row.prize_amount, 2) }}
                </span>
              </q-td>
              <q-td key="profit" :props="props">
                {{ moneyFormat(props.row.profit, 2) }}
              </q-td>
              <q-td key="profit_rate" :props="props"> {{ moneyFormat(props.row.profit_rate, 2) }}% </q-td>
              <q-td key="bonus" :props="props">
                {{ moneyFormat(props.row.bonus, 2) }}
              </q-td>
              <!-- 明細 -->
              <!-- <q-td key="detail" :props="props">
                <q-btn flat fab-mini icon="report" color="secondary" @click="onAction(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.details") }}</q-tooltip>
                </q-btn>
              </q-td> -->
            </q-tr>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm column no_data">
              <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
              <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
            </div>
          </template>

          <!-- 本頁總計/搜尋結果總計 -->
          <template #bottom-row="props">
            <table-total-comp
              v-if="tableData.length"
              :columns="props.cols"
              :table-data="tableData"
              :total-data="tableTotal"
              :sub-total-data="tableSubTotal"
            />
          </template>
        </q-table>
      </template>
    </query>
  </q-card>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { reactive, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"

  import { getMemberBetReportDetail, getAgentWagerGameHistory } from "@/api/report"
  import type { GetMemberBettingReport } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { CURRENCY_TYPE, SETTLEMENT_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useRoute, useRouter } from "vue-router"
  import { useQueryStore } from "@/stores/queryStore"
  import { useUserInfo } from "@/hook/useUserInfo"
  import { Notify } from "quasar"

  const { t } = useI18n()
  const isLoading = ref(false)
  const { walletSwitch } = useWalletBouns()
  const { isAnibetAgent } = useUserInfo()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      filterShowOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useCurrency: true,
      useGameType: true,
      useGameCode: true,
      useBetNumber: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    baseConfig.useDatePicker = true
    baseConfig.useVisibleBtn = true
    baseConfig.useDateType = true
    baseConfig.useVisibleTitle = false

    return baseConfig
  })

  const route = useRoute()
  const router = useRouter()
  const { moneyFormat } = useCommon()
  const queryStore = useQueryStore()
  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getMemberBetReportDetail)

  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetMemberBettingReport) {
    queryForm.member_id = route.params.id as string
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "code",
        label: t("table_header.bet_number"),
        field: "code",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.bet_date"),
        field: "created_at",
        sortable: false,
        align: "center"
      },
      {
        name: "settled_at",
        label: t("table_header.settlement_date"),
        field: "settled_at",
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
        name: "currency",
        label: t("table_header.currency"),
        field: "currency",
        sortable: false,
        align: "center"
      },
      {
        name: "wallet_type",
        label: t("table_header.wallet_type"),
        field: "wallet_type",
        sortable: false,
        align: "center"
      },
      {
        name: "product_title",
        label: t("table_header.product"),
        field: "product_title",
        sortable: false,
        align: "center"
      },
      {
        name: "game_title",
        label: t("table_header.game"),
        field: "game_title",
        sortable: false,
        align: "center"
      },
      {
        name: "bet_amount",
        label: t("table_header.bet_amount"),
        field: "bet_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "bet_amount",
        subTotalColumn: "bet_amount"
      },
      {
        name: "valid_bet_amount",
        label: t("table_header.validate_bet"),
        field: "valid_bet_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "valid_bet_amount",
        subTotalColumn: "valid_bet_amount"
      },
      {
        name: "prize_amount",
        label: t("table_header.payout"),
        field: "prize_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "prize_amount",
        subTotalColumn: "prize_amount"
      },
      {
        name: "profit",
        label: isAnibetAgent.value ? t("table_header.ggr_amount") : t("table_header.winlose"),
        field: "profit",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "profit",
        subTotalColumn: "profit"
      },
      {
        name: "profit_rate",
        label: isAnibetAgent.value ? t("table_header.ggr_ratio") : t("table_header.winrate_count"),
        field: "profit_rate",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "profit_rate",
        subTotalColumn: "profit_rate"
      },
      {
        name: "bonus",
        label: t("table_header.event_amount"),
        field: "bonus",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "bonus",
        subTotalColumn: "bonus"
      }
    ]

    return walletSwitch.value ? baseColumns : baseColumns.filter((column) => column.name !== "wallet_type")
  })

  function onAction() {
    window.open("https://i.imgur.com/PEEY4jc.png", "_blank")
  }

  async function handleDetails(data: any) {
    console.log("details", data)
    const response = await getAgentWagerGameHistory({
      code: data.code,
      productCode: data.product_code
    })
    if (response?.code === 0) {
      console.log("Agent wager game history:", response)
      const content = (response.data as any).content

      // 檢查是否為 HTTP 或 HTTPS URL
      if ((content && (content.startsWith("http://") || content.startsWith("https://"))) || content.startsWith("//")) {
        // 如果是 URL，直接在新分頁開啟
        window.open(content, "_blank")
      } else {
        // 如果不是 URL，視為 HTML 內容，在新分頁渲染
        const newWindow = window.open("", "_blank")
        if (newWindow) {
          newWindow.document.write(content)
          newWindow.document.close()
        }
      }
    } else {
      Notify.create({
        type: "negative",
        position: "top",
        message:
          response.code !== 999
            ? t(`error_msg.error_code_${response.code}`)
            : `${response.msg}${response.code ? " (" + response.code + ")" : ""}`,
        icon: "warning",
        timeout: 3000
      })
    }
  }
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
</style>
