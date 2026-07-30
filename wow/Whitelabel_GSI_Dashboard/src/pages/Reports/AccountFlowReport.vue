<template>
  <div class="q-pa-md" v-if="isShow">
    <query
      ref="queryRef"
      v-model:total="totalSize"
      :configs="queryConfigs"
      @query-update="onSubmit"
      @query-field-change="onQueryFieldChange"
    >
      <template #mainContent>
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
                <q-td key="id" :props="props"> {{ formatId(props.row) }} </q-td>
                <q-td key="member_account" :props="props">
                  <q-btn
                    @click="onAction('member_account', props.row)"
                    flat
                    text
                    :ripple="false"
                    color="blue"
                    :label="props.row.member_account"
                  />
                </q-td>
                <q-td key="updated_at" :props="props">
                  {{ genTimeFormat(props.row.updated_at) }}
                </q-td>
                <q-td key="currency" :props="props">
                  {{ $t(currencyFormat(props.row.currency_id)) }}
                </q-td>
                <q-td key="wallet_type" :props="props">
                  {{ $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums]) }}
                </q-td>
                <q-td key="wallet_trans_type_id" :props="props">
                  {{ accountFlowTypeFormat(props.row.wallet_trans_type_id) }}
                </q-td>
                <!-- 1/2/3/4/6: type + trans_code 5: product name +  + game code + wager_code 7: promotion name 8/9: type -->
                <q-td key="member_name" :props="props">
                  <div v-if="props.row.wallet_trans_type_id === ACCOUNT_FLOW_TYPE.Enums.BETTING_RECORDS">
                    <div>
                      {{ store.productCodeMap[props.row.product_code]?.product_name }}
                      {{ gameNameFormat(props.row.product_code, props.row.game_code) }}
                    </div>
                    [
                    <span @click="onAction('member_name', props.row)" class="text-blue cursor-pointer">{{
                      props.row.wager_code
                    }}</span>
                    ]
                  </div>
                  <div v-if="props.row.wallet_trans_type_id === ACCOUNT_FLOW_TYPE.Enums.PROMOTON_BONUS">
                    {{ promotionTitleFormat(props.row.promotion_id) }}
                  </div>
                  <div v-if="transactionTypes.includes(props.row.wallet_trans_type_id)">
                    <div v-if="props.row.wallet_trans_type_id !== ACCOUNT_FLOW_TYPE.Enums.FREE_ROUND_BETTING_RECORDS">
                      {{ accountFlowTypeFormat(props.row.wallet_trans_type_id) }}
                    </div>
                    <div v-else>
                      {{ store.productCodeMap[props.row.product_code]?.product_name
                      }}{{ gameNameFormat(props.row.product_code, props.row.game_code) }}
                    </div>
                    <div v-if="transCodeTypes.includes(props.row.wallet_trans_type_id)">
                      [
                      <span class="text-blue cursor-pointer" @click="onAction('member_trans_type', props.row)">{{
                        props.row.trans_code
                      }}</span>
                      ]
                    </div>
                    <div v-if="transCodeShow.includes(props.row.wallet_trans_type_id)">
                      [
                      <span>{{ props.row.trans_code }}</span>
                      ]
                    </div>
                  </div>
                  <div v-if="getSimpleWalletText(props.row)">
                    {{ getSimpleWalletText(props.row) }}
                  </div>
                  <div
                    v-if="
                      [
                        ACCOUNT_FLOW_TYPE.Enums.INTEREST_DEDUCTION,
                        ACCOUNT_FLOW_TYPE.Enums.INTEREST_PRINCIPAL,
                        ACCOUNT_FLOW_TYPE.Enums.INTEREST_BONUS
                      ].includes(props.row.wallet_trans_type_id)
                    "
                  >
                    {{ accountFlowTypeFormat(props.row.wallet_trans_type_id) }}
                    <br />
                    [<span class="mx-1">{{ interestTitleFormat(props.row.promotion_id) }}</span
                    >]
                  </div>
                </q-td>
                <q-td key="amount" :props="props">
                  {{ moneyFormat(props.row.amount, 2) }}
                </q-td>
                <q-td key="before_balance" :props="props">
                  {{ moneyFormat(props.row.before_balance, 2) }}
                </q-td>
                <q-td key="after_balance" :props="props">
                  {{ moneyFormat(props.row.after_balance, 2) }}
                </q-td>
                <q-td key="audit_balance" :props="props">
                  {{ moneyFormat(props.row.audit_balance, 2) }}
                </q-td>
                <q-td key="before_audit_balance" :props="props">
                  {{ moneyFormat(props.row.before_audit_balance, 2) }}
                </q-td>
                <q-td key="after_audit_balance" :props="props">
                  {{ moneyFormat(props.row.after_audit_balance, 2) }}
                </q-td>
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
  import type { CustomQTableProps } from "quasar"
  import { computed, reactive, onMounted, ref, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { format } from "date-fns"
  import { getAccountFlowList } from "@/api/report"
  import { getPromotionList } from "@/api/promotion"
  import { getInterestActivityDetail } from "@/api/interest"
  import type { GetInterestActivityDetailInfo, GetInterestActivityDetailData } from "@/api/response.type"
  import type { GetAccountFlowList } from "@/api/request.type"
  import type { accountFlowItem } from "@/api/response.type"
  import query from "@/components/query/common.vue"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useRoute, useRouter } from "vue-router"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { useLanguageStore } from "@/stores/languageStore"
  import { ACCOUNT_FLOW_TYPE, QUOTA_TYPE } from "@/utils/constants"
  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useSiteStore } from "src/stores/siteStore"

  const { permission } = usePermission()
  const { walletSwitch } = useWalletBouns()

  const { t } = useI18n()
  const store = useQueryStore()
  const languageStore = useLanguageStore()
  const isShow = ref(false)
  const siteStore = useSiteStore()
  const queryRef = ref<{ queryForm: Partial<GetAccountFlowList> } | null>(null)

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useMemberAccount: true,
      useCurrency: true,
      useDatePicker: true,
      useTimePicker: true,
      initialDateRange: 0,
      dateRangeLimit: 31,
      customFields: [
        {
          key: "auditRelatedTypes",
          type: "checkbox",
          label: "audit_related_types",
          width: "col-12 col-sm-3 col-md-3 account-flow-audit-checkbox-field"
        }
      ]
    }

    if (siteStore.is_bulk_data === 1) {
      baseConfig.useMemberAccountRules = [(val: string) => !!val || "required"]
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    baseConfig.useAccountFlowType = true

    return baseConfig
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getAccountFlowList)

  const { genTimeFormat, moneyFormat } = useCommon()
  let catchQueryForm: GetAccountFlowList
  const getAccountFlowSearchParams = (queryForm: GetAccountFlowList): GetAccountFlowList => {
    const { auditRelatedTypes, ...params } = queryForm

    if (!auditRelatedTypes) {
      return params
    }

    return {
      ...params,
      accountFlowType: [...ACCOUNT_FLOW_TYPE.AUDIT_RELATED_ACCOUNT_FLOW_TYPES]
    }
  }
  async function onSubmit(queryForm: GetAccountFlowList) {
    catchQueryForm = getAccountFlowSearchParams(queryForm)
    await search(catchQueryForm)
  }
  function onQueryFieldChange(eventData: { rawQueryForm: Partial<GetAccountFlowList> }) {
    const currentQueryForm = queryRef.value?.queryForm

    if (!currentQueryForm || eventData.rawQueryForm.auditRelatedTypes === undefined) {
      return
    }

    if (currentQueryForm.accountFlowType?.length) {
      currentQueryForm.accountFlowType = []
    }

    if (eventData.rawQueryForm.auditRelatedTypes === false && currentQueryForm.auditRelatedTypes !== undefined) {
      currentQueryForm.auditRelatedTypes = undefined
    }
  }
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "id",
        label: t("table_header.account_flow_number"),
        field: "id",
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
        name: "updated_at",
        label: t("table_header.account_flow_time"),
        field: "updated_at",
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
        name: "wallet_trans_type_id",
        label: t("table_header.account_flow_type"),
        field: "wallet_trans_type_id",
        sortable: false,
        align: "center"
      },
      {
        name: "member_name",
        label: t("table_header.account_flow_object"),
        field: "member_name",
        sortable: false,
        align: "center"
      },
      {
        name: "amount",
        label: t("table_header.amount"),
        field: "amount",
        sortable: false,
        align: "center",
        useSubTotalColumn: true,
        subTotalColumn: "amount",
        totalColumn: "amount"
      },
      {
        name: "before_balance",
        label: t("table_header.account_flow_before_amount"),
        field: "before_balance",
        sortable: false,
        align: "center"
      },
      {
        name: "after_balance",
        label: t("table_header.account_flow_after_amount"),
        field: "after_balance",
        sortable: false,
        align: "center"
      },
      {
        name: "audit_balance",
        label: t("table_audit_quota"),
        field: "audit_balance",
        sortable: false,
        align: "center"
      },
      {
        name: "before_audit_balance",
        label: t("table_before_audit_quota"),
        field: "before_audit_balance",
        sortable: false,
        align: "center"
      },
      {
        name: "after_audit_balance",
        label: t("table_after_audit_quota"),
        field: "after_audit_balance",
        sortable: false,
        align: "center"
      }
    ]

    return walletSwitch.value ? baseColumns : baseColumns.filter((column) => column.name !== "wallet_type")
  })

  const router = useRouter()
  const route = useRoute()
  const promotionList = ref()
  const transactionTypes = [
    ACCOUNT_FLOW_TYPE.Enums.DEPOSIT,
    ACCOUNT_FLOW_TYPE.Enums.WITHDRAWAL,
    ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_DEPOSIT,
    ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_WITHDRAWAL,
    ACCOUNT_FLOW_TYPE.Enums.WITHDRAWAL_REJECTED,
    ACCOUNT_FLOW_TYPE.Enums.REBATE,
    ACCOUNT_FLOW_TYPE.Enums.COMMISSION,
    ACCOUNT_FLOW_TYPE.Enums.BONUS_WALLET_TRANSFER,
    ACCOUNT_FLOW_TYPE.Enums.VIP_BONUS,
    ACCOUNT_FLOW_TYPE.Enums.BIRTHDAY_BONUS,
    ACCOUNT_FLOW_TYPE.Enums.FREE_ROUND_BETTING_RECORDS,
    ACCOUNT_FLOW_TYPE.Enums.MANUAL_AUDIT_ADJUSTMENT
  ]
  const transCodeTypes = [
    ACCOUNT_FLOW_TYPE.Enums.DEPOSIT,
    ACCOUNT_FLOW_TYPE.Enums.WITHDRAWAL,
    ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_DEPOSIT,
    ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_WITHDRAWAL,
    ACCOUNT_FLOW_TYPE.Enums.WITHDRAWAL_REJECTED,
    ACCOUNT_FLOW_TYPE.Enums.FREE_ROUND_BETTING_RECORDS
  ]
  //顯示trans_code
  const transCodeShow = [
    ACCOUNT_FLOW_TYPE.Enums.BONUS_WALLET_TRANSFER,
    ACCOUNT_FLOW_TYPE.Enums.VIP_BONUS,
    ACCOUNT_FLOW_TYPE.Enums.BIRTHDAY_BONUS,
    ACCOUNT_FLOW_TYPE.Enums.MANUAL_AUDIT_ADJUSTMENT
  ]

  const getSimpleWalletText = (row: { wallet_trans_type_id: number; metadata: any }) => {
    const type = row.wallet_trans_type_id

    switch (type) {
      case ACCOUNT_FLOW_TYPE.Enums.AFFILIATE_AGENT_REBATE:
        return t("menu.collaboration_management")
      case ACCOUNT_FLOW_TYPE.Enums.REFERRAL_REBATE:
        return t("account_flow_type.referral_rebate")
      case ACCOUNT_FLOW_TYPE.Enums.BONUS_GIFT:
        return row.metadata?.gift_event_name ?? ""
      case ACCOUNT_FLOW_TYPE.Enums.SHAREHOLDERS_SETTING:
        return t("account_flow_type.profit_sharing_commission")
      default:
        return ""
    }
  }

  const selectedLanguage = ref(languageStore.currentLanguage)
  const onAction = (column: string, row: accountFlowItem) => {
    switch (column) {
      case "member_name":
        router.push({
          name: "BetRecord",
          query: {
            betNumber: row.wager_code
          }
        })
        break
      case "member_account":
        router.push({
          name: "MemberListEdit",
          params: {
            id: row.member_id
          }
        })
        break
      case "member_trans_type":
        console.log(row, "row")
        if (row.wallet_trans_type_id === ACCOUNT_FLOW_TYPE.Enums.DEPOSIT) {
          router.push({
            name: "DepositAndwithdrawalManagementDepositList",
            query: {
              depositNumber: row.trans_code
            }
          })
          break
        }
        if (row.wallet_trans_type_id === ACCOUNT_FLOW_TYPE.Enums.WITHDRAWAL) {
          router.push({
            name: "DepositAndwithdrawalManagementList",
            query: {
              withdrawalNumber: row.trans_code
            }
          })
          break
        }
        if (row.wallet_trans_type_id === ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_DEPOSIT) {
          router.push({
            name: "MemberQuota",
            query: {
              orderNumber: row.trans_code,
              quotaType: QUOTA_TYPE.Enums.ManualDeposit
            }
          })
          break
        }
        if (row.wallet_trans_type_id === ACCOUNT_FLOW_TYPE.Enums.ADJUSMENT_WITHDRAWAL) {
          router.push({
            name: "MemberQuota",
            query: {
              orderNumber: row.trans_code,
              quotaType: QUOTA_TYPE.Enums.ManualWithdraw
            }
          })
          break
        }
        if (row.wallet_trans_type_id === ACCOUNT_FLOW_TYPE.Enums.FREE_ROUND_BETTING_RECORDS) {
          router.push({
            name: "FreeGameReport",
            query: {
              memberAccount: row.member_account
            }
          })
          break
        }
    }
  }

  function onExport() {
    console.log("onExport")
  }
  interface columnFormat {
    value: number
    label: string
  }
  const currencyFormat = (id: number) => {
    const currencyFormat: columnFormat | undefined = store.currencyList.find((currency) => currency.value === id)
    return currencyFormat ? currencyFormat.label : ""
  }
  const accountFlowTypeFormat = (id: number) => {
    return ACCOUNT_FLOW_TYPE.I18nKeys[id as ACCOUNT_FLOW_TYPE.Enums]
      ? t(ACCOUNT_FLOW_TYPE.I18nKeys[id as ACCOUNT_FLOW_TYPE.Enums])
      : ""
  }

  interface Promotion {
    id: number
    title: Record<string, string>
  }
  const promotionTitleFormat = (id: number) => {
    let promotionTitleFormat: Record<string, string> = {}
    if (promotionList.value) {
      const foundPromotion = promotionList.value.find((promotion: Promotion) => promotion.id === id)
      if (foundPromotion) {
        promotionTitleFormat = foundPromotion.title
      }
    }
    if (promotionTitleFormat) {
      // 如果 selectedLanguage.value 對應語言不在，默認返回第一筆
      return promotionTitleFormat[selectedLanguage.value] ?? Object.values(promotionTitleFormat)[0] ?? ""
    }

    return ""
  }
  const interestTypes = [
    ACCOUNT_FLOW_TYPE.Enums.INTEREST_DEDUCTION,
    ACCOUNT_FLOW_TYPE.Enums.INTEREST_PRINCIPAL,
    ACCOUNT_FLOW_TYPE.Enums.INTEREST_BONUS
  ]

  const interestActivityMap = ref(new Map<number, GetInterestActivityDetailInfo[]>())

  const fetchInterestActivities = async (rows: accountFlowItem[]) => {
    const ids = [
      ...new Set(
        rows
          .filter((r: accountFlowItem) => interestTypes.includes(r.wallet_trans_type_id) && r.promotion_id)
          .map((r: accountFlowItem) => r.promotion_id)
          .filter((id: number) => !interestActivityMap.value.has(id))
      )
    ]
    await Promise.all(
      ids.map(async (id: number) => {
        const res = await getInterestActivityDetail(id)
        if (res.code === 0 && res.data) {
          const detail = res.data as unknown as GetInterestActivityDetailData
          if (detail.info) interestActivityMap.value.set(id, detail.info)
        }
      })
    )
  }

  const interestTitleFormat = (promotionId: number) => {
    const info = interestActivityMap.value.get(promotionId)
    if (!info?.length) return ""
    const match = info.find((i) => i.lang === selectedLanguage.value)
    return match?.title ?? info[0]?.title ?? ""
  }

  watch(tableData, (rows) => {
    if (rows?.length) fetchInterestActivities(rows)
  })

  const gameNameFormat = (productCode: number, gameCode: string) => {
    const gameNameFormat = store.gameDropdown.find(
      (game) => game.game_code === gameCode && game.product_code === productCode
    )
    return gameNameFormat ? gameNameFormat.label : ""
  }

  const formatId = (row: accountFlowItem) => {
    const year = format(row.updated_at, "yy")
    const mounth = format(row.updated_at, "MM")
    const day = format(row.updated_at, "dd")
    return `${year}${mounth}${day}${row.id}`
  }

  onMounted(async () => {
    isShow.value = true
    await store.getProductDropdownList()
    await store.getGameDropdownList()
    const { code, data } = await getPromotionList({ size: -1 })
    if (code === 0) {
      promotionList.value = [...data.list]
    }
  })

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
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }
</style>
