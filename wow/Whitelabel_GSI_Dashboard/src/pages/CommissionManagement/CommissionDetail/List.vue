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
            table-header-class="bg-success"
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <q-td key="period" :props="props">
                  {{ props.row.period_start_date }} ~ {{ props.row.period_end_date }}
                </q-td>
                <q-td key="settled_at" :props="props">
                  {{ props.row.settled_at }}
                </q-td>

                <q-td key="group_name" :props="props">
                  {{ getDynamicLangValue(props.row.group_name) }}
                </q-td>
                <q-td key="calculate_type" :props="props">
                  {{ $t(CALCULATE_TYPE.I18nKeys[props.row.calculate_type as CALCULATE_TYPE.Enums]) || "" }}
                </q-td>
                <!-- 派發人數 -->
                <q-td key="dispatch_count" :props="props">
                  {{ moneyFormat(props.row.dispatch_count) }}
                </q-td>

                <!-- 阻擋派發人數 -->
                <q-td key="block_count" :props="props">
                  {{ moneyFormat(props.row.block_count) }}
                </q-td>

                <!-- 派發方式 -->
                <q-td key="dispatch_type" :props="props">
                  {{ $t(SEND_TYPE.I18nKeys[props.row.dispatch_type as SEND_TYPE.Enums] || "common.unknow") }}
                </q-td>

                <!-- 獎金類型 -->
                <q-td v-if="walletSwitch" key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>

                <!-- 明細 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row)">
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
  import { ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type { CustomQTableProps } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import type { LANGUAGE_TYPE } from "@/utils/constants"
  import { SEND_TYPE, BONUS_WALLET_TYPE, CALCULATE_TYPE } from "@/utils/constants"
  import { useLanguageStore } from "@/stores/languageStore"
  import type * as Response from "@/api/response.type"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { getCommissionDetailList } from "@/api/commissionManagement"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  const { t, locale } = useI18n()
  const { walletSwitch } = useWalletBouns()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useCurrency: true,
      useDatePicker: true,
      useRewardType: true,
      useGroupName: true,
      useCalculateType: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    return baseConfig
  })
  const languageStore = useLanguageStore()
  let { search, tableData, totalSize } = useSearch(getCommissionDetailList)
  const { genTimeFormat, moneyFormat } = useCommon()
  const status = ref({
    currency: "",
    rewardType: 0
  })

  async function onSubmit(queryForm: any) {
    status.value = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "period",
      label: t("table_header.settle_cycle"),
      field: "period",
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
      name: "group_name",
      label: t("table_header.group_name"),
      field: "group_name",
      sortable: false,
      align: "center"
    },
    {
      name: "calculate_type",
      label: t("table_header.calculate_mode"),
      field: "calculate_type",
      sortable: false,
      align: "center"
    },
    {
      name: "dispatch_count",
      label: t("table_header.reward_count"),
      field: "dispatch_count",
      sortable: false,
      align: "center"
    },
    {
      name: "block_count",
      label: t("table_header.block_reward_count"),
      field: "block_count",
      sortable: false,
      align: "center"
    },
    {
      name: "dispatch_type",
      label: t("table_header.reward_type"),
      field: "dispatch_type",
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
      name: "actions",
      label: t("table_header.actions"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])

  const route = useRoute()
  const router = useRouter()
  const onAction = (row: any) => {
    const { start, end } = route.query
    const { currency, rewardType } = status.value
    //const currency = row.currency
    const dispatch_type = row.dispatch_type
    router.push({
      name: "CommissionDetail",
      params: {
        id: row.id
      },
      query: {
        currency,
        dispatch_type,
        start,
        end
      }
    })
  }
  function getDynamicLangValue(data: Response.PromotionLangTitle): string {
    if (!data) return ""
    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      // 没有 MYR 的值，则取第一个值
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return ""
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
