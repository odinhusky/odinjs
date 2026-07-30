<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn v-if="permission.export" class="btns q-ml-xs btn-export" @click="() => onExport(catchQueryForm)">
            <q-icon size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
        <div :style="{ height: tableHeight }" class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            table-header-class="bg-success"
            row-key="id"
            class="sticky-header-table"
          >
            <template #body="props">
              <q-tr>
                <q-td key="code" :props="props">
                  {{ props.row.code }}
                </q-td>
                <q-td key="gaming_site" :props="props">
                  {{ getGameSite(props.row.gaming_site) }}
                </q-td>
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="created_at" :props="props">
                  {{ genTimeFormat(props.row.created_at) }}
                </q-td>
                <q-td key="settled_at" :props="props">
                  {{ genTimeFormat(props.row.settled_at) }}
                </q-td>
                <q-td key="status_title" :props="props">
                  <!-- {{ $t(SETTLEMENT_TYPE.I18nKeys[props.row.status]) }} -->
                  {{ props.row.status_title }}
                </q-td>
                <q-td key="currency_id" :props="props">
                  {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums] || "common.unknow") }}
                </q-td>
                <q-td key="wallet_type" :props="props">
                  {{ $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
                </q-td>
                <q-td key="product_title" :props="props">
                  {{ props.row.product_title }}
                </q-td>
                <!--產品類別-->
                <q-td key="game_type" :props="props">
                  {{ $t(getGameTypeI18nKey(props.row.game_type as Enums)) }}
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
                <q-td key="payout" :props="props">
                  <span class="text-blue-7 cursor-pointer" @click="handleDetails(props.row)">{{
                    moneyFormat(props.row.payout, 2)
                  }}</span>
                </q-td>
                <q-td key="profit" :props="props">
                  {{ moneyFormat(props.row.profit, 2) }}
                </q-td>
                <q-td key="event_amount" :props="props">
                  {{ moneyFormat(props.row.event_amount, 2) || "-" }}
                </q-td>
                <!-- <q-td key="detail" :props="props">
                <q-btn color="primary" @click="handleDetails()">
                  <span>{{ $t("common.detail") }}</span>
                </q-btn>
              </q-td> -->
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
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
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps, Notify } from "quasar"
  import { computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"

  import { getBetRecordList, getBetRecordListExport, getAgentWagerGameHistory } from "@/api/report"
  import type { GetBetRecordList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { CURRENCY_TYPE, SETTLEMENT_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"
  import { usePermission } from "@/hook/usePermission"
  import { useExport } from "@/hook/useExport"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { useSiteStore } from "src/stores/siteStore"
  import { useQueryStore } from "@/stores/queryStore"
  import { useUserInfo } from "@/hook/useUserInfo"
  import { useGameType } from "@/composables/useGameType"
  import { Enums } from "@/utils/constants/gameType"

  const { permission } = usePermission()
  const { walletSwitch } = useWalletBouns()
  const { t } = useI18n()
  const siteStore = useSiteStore()
  const queryStore = useQueryStore()
  const { isAnibetAgent } = useUserInfo()
  const { getGameTypeI18nKey } = useGameType()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      allowSameSubmit: true,
      submitOnLoaded: true,
      usePagination: true,
      useCurrency: true,
      useBetNumber: true,
      useMemberAccount: true,
      useGameType: true,
      useGameCode: true,
      useGamingSite: true,
      useDatePicker: true,
      useTimePicker: true,
      useMultiBetReportDateType: true,
      initialDateRange: 0,
      dateRangeLimit: 31
    }

    if (siteStore.is_bulk_data === 1) {
      baseConfig.useMemberAccountRules = [(val: string) => !!val || "required"]
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    return baseConfig
  })

  const { search, tableData, totalSize, tableSubTotal, tableTotal } = useSearch(getBetRecordList)

  const { genTimeFormat, moneyFormat } = useCommon()
  let catchQueryForm: GetBetRecordList
  async function onSubmit(queryForm: GetBetRecordList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }
  onMounted(async () => {
    await queryStore.getGameSiteDropdown()
  })

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
        name: "gaming_site",
        label: t("table_header.game_site"),
        field: "gaming_site",
        sortable: false,
        align: "center"
      },
      {
        name: "member_account",
        label: t("table_header.member_account"),
        field: "member_account",
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
        label: t("table_header.end_date"),
        field: "settled_at",
        sortable: false,
        align: "center"
      },
      {
        name: "status_title",
        label: t("table_header.status"),
        field: "status_title",
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
        name: "game_type",
        label: t("table_header.product_type"),
        field: "game_type",
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
        label: t("table_header.valid_bet"),
        field: "valid_bet_amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "valid_bet_amount",
        subTotalColumn: "valid_bet_amount"
      },
      {
        name: "payout",
        label: t("table_header.payout"),
        field: "payout",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        totalColumn: "payout",
        subTotalColumn: "payout"
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
        name: "event_amount",
        label: t("table_header.event_amount"),
        field: "event_amount",
        sortable: false,
        align: "center"
      }
    ]

    return walletSwitch.value ? baseColumns : baseColumns.filter((column) => column.name !== "wallet_type")
  })

  function getGameSite(gameSiteId: number) {
    for (const item of queryStore.gameSiteDropdown) {
      if (item.value === gameSiteId) {
        return t(`member_customize_column.${item.label}`)
      }
    }
    return "-"
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

      // 檢查是否為 HTTP、HTTPS 或協議相對 URL
      if (content && (content.startsWith("http://") || content.startsWith("https://") || content.startsWith("//"))) {
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

  const { getExportPath } = useExport()
  const onExport = async (params: GetBetRecordList) => {
    const { search, status, tableData } = useSearch(getBetRecordListExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
  const tableHeight = computed(() => {
    const rowHeight = 48
    const headerHeight = 40
    const maxHeight = 600
    const rowCount = tableData.value.length
    if (rowCount === 0 || rowCount <= 10) {
      return "auto"
    }

    const contentHeight = rowCount * rowHeight + headerHeight
    return `${Math.min(contentHeight, maxHeight)}px`
  })
</script>

<style lang="scss" scoped>
  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }
</style>
