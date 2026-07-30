<template>
  <div class="q-pa-md">
    <query ref="queryRef" v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div v-if="permission.export" class="row q-mb-md justify-between q-gutter-md">
          <q-btn color="main-color" :loading="spinShow">
            {{ $t("table_header.field_settings") }}
            <q-menu persistent @show="backupMenuValues">
              <q-card style="min-width: 350px">
                <q-card-section class="row items-center">
                  <div class="text-subtitle1">{{ $t("table_header.value_multiplier") }}：</div>
                  <q-btn flat round dense icon="remove" class="q-ml-sm" @click="multiplier--" />
                  <q-number
                    v-model="multiplier"
                    dense
                    style="width: 80px"
                    class="q-mx-sm input-multiplier"
                    :loading="spinShow"
                  />
                  <div>%</div>
                  <q-btn flat round dense icon="add" class="q-ml-sm" @click="multiplier++" />
                  <q-btn
                    flat
                    color="grey"
                    :label="$t('btn.cancel')"
                    class="q-mx-sm"
                    @click="restoreMenuValues"
                    v-close-popup
                    :loading="spinShow"
                  />
                  <q-btn
                    color="primary"
                    :label="$t('btn.confirm')"
                    v-close-popup
                    :loading="spinShow"
                    @click="saveExportSetting"
                  />
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input v-model="searchText" dense outlined class="q-mb-md">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>

                  <div class="row q-mb-sm">
                    <q-checkbox v-model="selectAll" :label="$t('btn.select_all2')" class="col-6" />
                    <q-checkbox v-model="deselectAll" :label="$t('btn.cancel_all2')" class="col-6" />
                  </div>

                  <div class="column">
                    <q-option-group
                      v-model="exportColumnGroup"
                      :options="exportColumnoptions"
                      color="primary"
                      type="checkbox"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-menu>
          </q-btn>
          <q-btn outline color="main-color" @click="onExport" :loading="spinShow">
            {{ $t("btn.export") }}
            <q-icon class="q-ml-xs" size="xs" name="archive" />
          </q-btn>
        </div>
        <div class="table-container">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            table-header-class="bg-success"
            row-key="date"
          >
            <template #body="props">
              <q-tr>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <span v-if="col.name === 'date'">
                    {{ genTimeFormat(col.value, "yyyy-MM-dd") }}
                  </span>
                  <span v-else-if="col.name === 'gaming_site'">
                    {{ getGameSite(props.row.gaming_site) }}
                  </span>
                  <span v-else-if="integerColumns.includes(col.name)"> {{ moneyFormat(roundTo(col.value, 0)) }} </span>
                  <span v-else-if="percentColumn.includes(col.name)"> {{ preciseMultiply(col.value, 100) }}% </span>
                  <span v-else> {{ moneyFormat(col.value, 2) }} </span>
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
  import { CustomQTableProps, Notify, useQuasar } from "quasar"
  import { computed, ref, watch, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { storeToRefs } from "pinia"
  import {
    getDailyOverviewtReportList,
    getDailyOverviewtReportExport,
    getDailyOverviewtFieldsAvailable,
    getDailyOverviewtSetting,
    updateDailyOverviewtSetting
  } from "@/api/report"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useQueryStore } from "@/stores/queryStore"
  import { useCommon } from "@/hook/useCommon"
  import { useDecimal } from "@/hook/useDecimal"
  import { useSearch } from "@/hook/useSearch"
  import { usePermission } from "@/hook/usePermission"
  import { useExport } from "@/hook/useExport"
  const { permission } = usePermission()

  const $q = useQuasar()
  const queryRef = ref()
  const queryStore = useQueryStore()
  const { spinShow } = storeToRefs(queryStore)
  const { toggleSpinner } = queryStore
  const { t } = useI18n()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useCurrency: true,
      useDatePicker: true,
      useGamingSiteAll: true,
      initialDateRange: 7
    }
    return baseConfig
  })

  const { search, tableData, totalSize } = useSearch(getDailyOverviewtReportList)

  const { genTimeFormat, moneyFormat, roundTo } = useCommon()
  const { preciseMultiply } = useDecimal()

  async function onSubmit(queryForm: Request.GetDailyOverviewtReportList) {
    await search(queryForm)
  }

  const multiplier = ref(0)
  const searchText = ref("")
  const selectAll = ref(false)
  const deselectAll = ref(false)
  const exportColumnGroup = ref<string[]>([])
  const exportColumns = ref<string[]>([])

  const exportColumnoptions = computed(() => {
    const result = exportColumns.value.map((e) => {
      return {
        label: t(`table_header.${e}`),
        value: e
      }
    })

    if (!searchText.value) {
      return result
    }

    return result.filter((option) => option.label.toLowerCase().includes(searchText.value.toLowerCase()))
  })

  const backupValues = ref({
    multiplier: 100,
    searchText: "",
    selectAll: false,
    deselectAll: false,
    exportColumnGroup: [] as string[]
  })

  const backupMenuValues = () => {
    backupValues.value = {
      multiplier: multiplier.value,
      searchText: searchText.value,
      selectAll: selectAll.value,
      deselectAll: deselectAll.value,
      exportColumnGroup: [...exportColumnGroup.value]
    }
  }

  const restoreMenuValues = () => {
    multiplier.value = backupValues.value.multiplier
    searchText.value = backupValues.value.searchText
    selectAll.value = backupValues.value.selectAll
    deselectAll.value = backupValues.value.deselectAll
    exportColumnGroup.value = [...backupValues.value.exportColumnGroup]
  }

  const integerColumns = [
    "new_users",
    "register_from_google",
    "register_from_telegram",
    "first_depositors_count",
    "retained_deposit_users",
    "depositors_count",
    "deposit_count",
    "withdrawers_count",
    "withdrawal_count",
    "bettors_amount",
    "bet_count",
    "unique_logins",
    "login_from_google",
    "login_from_telegram",
    "unique_bets"
  ]
  const percentColumn = ["d_ggr"]

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "date",
      label: t("table_header.date"),
      field: "date",
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
      name: "new_users",
      label: t("table_header.new_users"),
      field: "new_users",
      sortable: false,
      align: "center"
    },
    {
      name: "register_from_google",
      label: t("table_header.register_from_google"),
      field: "register_from_google",
      sortable: false,
      align: "center"
    },
    {
      name: "register_from_telegram",
      label: t("table_header.register_from_telegram"),
      field: "register_from_telegram",
      sortable: false,
      align: "center"
    },
    {
      name: "first_depositors_count",
      label: t("table_header.first_depositors_count"),
      field: "first_depositors_count",
      sortable: false,
      align: "center"
    },
    {
      name: "first_deposit_amount",
      label: t("table_header.first_deposit_amount"),
      field: "first_deposit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "avg_first_deposit_amount",
      label: t("table_header.avg_first_deposit_amount"),
      field: "avg_first_deposit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "retained_deposit_users",
      label: t("table_header.retained_deposit_users"),
      field: "retained_deposit_users",
      sortable: false,
      align: "center"
    },
    {
      name: "depositors_count",
      label: t("table_header.depositors_count"),
      field: "depositors_count",
      sortable: false,
      align: "center"
    },
    {
      name: "deposit_count",
      label: t("table_header.deposit_count"),
      field: "deposit_count",
      sortable: false,
      align: "center"
    },
    {
      name: "deposit_amount",
      label: t("table_header.deposit_amount"),
      field: "deposit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "avg_deposit_amount",
      label: t("table_header.avg_deposit_amount"),
      field: "avg_deposit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "avg_deposit_count",
      label: t("table_header.avg_deposit_count"),
      field: "avg_deposit_count",
      sortable: false,
      align: "center"
    },
    {
      name: "withdrawers_count",
      label: t("table_header.withdrawers_count"),
      field: "withdrawers_count",
      sortable: false,
      align: "center"
    },
    {
      name: "withdrawal_count",
      label: t("table_header.withdrawal_count"),
      field: "withdrawal_count",
      sortable: false,
      align: "center"
    },
    {
      name: "withdrawal_amount",
      label: t("table_header.withdrawal_amount"),
      field: "withdrawal_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "avg_withdrawal_amount",
      label: t("table_header.avg_withdrawal_amount"),
      field: "avg_withdrawal_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "avg_withdrawal_count",
      label: t("table_header.avg_withdrawal_count"),
      field: "avg_withdrawal_count",
      sortable: false,
      align: "center"
    },
    {
      name: "bettors_amount",
      label: t("table_header.bettors_amount"),
      field: "bettors_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "bet_count",
      label: t("table_header.bet_count"),
      field: "bet_count",
      sortable: false,
      align: "center"
    },
    {
      name: "bet_amount",
      label: t("table_header.bet_amount"),
      field: "bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "avg_betting_amount",
      label: t("table_header.avg_betting_amount"),
      field: "avg_betting_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "avg_betting_count",
      label: t("table_header.avg_betting_count"),
      field: "avg_betting_count",
      sortable: false,
      align: "center"
    },
    {
      name: "payout_amount",
      label: t("table_header.payout_amount"),
      field: "payout_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "ggr",
      label: t("table_header.ggr"),
      field: "ggr",
      sortable: false,
      align: "center"
    },
    {
      name: "reward_wallet_bettors_amount",
      label: t("table_header.reward_wallet_bettors_amount"),
      field: "reward_wallet_bettors_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "reward_wallet_bet_count",
      label: t("table_header.reward_wallet_bet_count"),
      field: "reward_wallet_bet_count",
      sortable: false,
      align: "center"
    },
    {
      name: "reward_wallet_bet_amount",
      label: t("table_header.reward_wallet_bet_amount"),
      field: "reward_wallet_bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "reward_wallet_average_betting_amount",
      label: t("table_header.reward_wallet_average_betting_amount"),
      field: "reward_wallet_average_betting_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "reward_wallet_average_betting_count",
      label: t("table_header.reward_wallet_average_betting_count"),
      field: "reward_wallet_average_betting_count",
      sortable: false,
      align: "center"
    },
    {
      name: "reward_wallet_payout_amount",
      label: t("table_header.reward_wallet_payout_amount"),
      field: "reward_wallet_payout_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "reward_wallet_ggr",
      label: t("table_header.reward_wallet_ggr"),
      field: "reward_wallet_ggr",
      sortable: false,
      align: "center"
    },
    {
      name: "promo_spend",
      label: t("table_header.promo_spend"),
      field: "promo_spend",
      sortable: false,
      align: "center"
    },
    {
      name: "net_ggr",
      label: t("table_header.net_ggr"),
      field: "net_ggr",
      sortable: false,
      align: "center"
    },
    {
      name: "d_ggr",
      label: t("table_header.d_ggr"),
      field: "d_ggr",
      sortable: false,
      align: "center"
    },
    {
      name: "unique_logins",
      label: t("table_header.unique_logins"),
      field: "unique_logins",
      sortable: false,
      align: "center"
    },
    {
      name: "login_from_google",
      label: t("table_header.login_from_google"),
      field: "login_from_google",
      sortable: false,
      align: "center"
    },
    {
      name: "login_from_telegram",
      label: t("table_header.login_from_telegram"),
      field: "login_from_telegram",
      sortable: false,
      align: "center"
    },
    {
      name: "unique_bets",
      label: t("table_header.unique_bets"),
      field: "unique_bets",
      sortable: false,
      align: "center"
    }
  ])

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async () => {
    const queryForm = queryRef.value?.queryForm
    const params: Request.GetDailyOverviewtReportExport = {
      ...queryForm
    }
    toggleSpinner()
    const { search, status, tableData } = useSearch(getDailyOverviewtReportExport)
    await search(params)
    toggleSpinner()
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }

  const getExportColumns = async () => {
    if (exportColumns.value.length) return

    const { search, tableData, status } = useSearch(getDailyOverviewtFieldsAvailable)
    await search()
    if (status.value) {
      exportColumns.value = tableData.value || []
    }
  }

  const getExportSetting = async () => {
    const { search, tableData, status } = useSearch(getDailyOverviewtSetting)
    await search()

    if (status.value) {
      multiplier.value = Number(tableData.value.multiplier) || 0
      exportColumnGroup.value = tableData.value.fields || []
    }
  }

  const saveExportSetting = async () => {
    const paylaod: Response.DailyOverviewtSetting = {
      multiplier: parseFloat(Number(multiplier.value).toFixed(2)),
      fields: exportColumnGroup.value
    }
    const { search, status } = useSearch(updateDailyOverviewtSetting)
    await search(paylaod)

    if (status.value) {
      $q.notify({
        color: "green",
        message: t("message.edit_success"),
        position: "top",
        timeout: 1000
      })
    }
  }

  watch(selectAll, (newVal) => {
    if (newVal) {
      exportColumnGroup.value = exportColumns.value
      deselectAll.value = false
    }
  })

  watch(deselectAll, (newVal) => {
    if (newVal) {
      exportColumnGroup.value = []
      selectAll.value = false
    }
  })

  watch(exportColumnGroup, (newVal) => {
    selectAll.value = newVal.length === exportColumns.value.length
    deselectAll.value = newVal.length === 0
  })

  onMounted(async () => {
    await getExportColumns()
    await getExportSetting()
    await queryStore.getGameSiteDropdown()
  })

  function getGameSite(gameSiteId: string) {
    if (gameSiteId === "-1") {
      return t(`member_customize_column.all`)
    }
    for (const item of queryStore.gameSiteDropdown) {
      if (item.value === parseInt(gameSiteId)) {
        return t(`member_customize_column.${item.label}`)
      }
    }
    return "-"
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
  .input-multiplier {
    :deep(.q-field__native) {
      input {
        text-align: center;
      }
    }
  }
  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }
</style>
