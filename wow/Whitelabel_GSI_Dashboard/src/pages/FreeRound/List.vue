<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn class="add-times-btn" unelevated color="green" @click="onAddTimes()">
            {{ t("btn.add_times") }}
          </q-btn>
          <q-btn class="add-times-btn q-ml-sm" unelevated color="primary" @click="onSettings()">
            {{ t("btn.settings") }}
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
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <q-td key="bonus_code" :props="props">
                  {{ props.row.bonus_code }}
                </q-td>
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="currency_id" :props="props">
                  {{ t(CURRENCY.I18nKeys[props.row.currency_id as CURRENCY.Enums] || "common.unknow") }}
                </q-td>
                <q-td key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>
                <q-td key="status" :props="props">
                  {{ t(FREE_ROUND_STATUS.I18nKeys[props.row.status as FREE_ROUND_STATUS.Enums] || "common.unknow") }}
                </q-td>
                <q-td key="product_name" :props="props">
                  {{ props.row.product_name }}
                </q-td>
                <q-td key="game_name" :props="props">
                  {{ props.row.game_name }}
                </q-td>
                <q-td key="rounds" :props="props">
                  {{ props.row.rounds }}
                </q-td>
                <q-td key="rounds_played" :props="props">
                  {{ props.row.rounds_played }}
                </q-td>
                <q-td key="remark" :props="props">
                  {{ props.row.remark }}
                </q-td>
                <q-td key="begin_date" :props="props">
                  {{ formatDateTime(props.row.begin_date) }} ~ <br />
                  {{ formatDateTime(props.row.end_date) }}
                </q-td>
                <q-td key="update_at" :props="props">
                  {{ props.row.update_at ? formatDateTime(props.row.update_at) : "-" }}
                </q-td>
                <q-td key="created_at" :props="props">
                  {{ props.row.created_at ? formatDateTime(props.row.created_at) : "-" }}
                </q-td>
                <q-td key="update_by" :props="props">
                  {{ props.row.update_by }}
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn
                    :disable="props.row.status !== FREE_ROUND_STATUS.Enums.Active"
                    color="negative"
                    flat
                    @click="handleDelete(props.row)"
                    >{{ t("btn.cancel") }}</q-btn
                  >
                </q-td>
              </q-tr>
            </template>
            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm">{{ t("common.no_data") }}</div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
    <AddFreeRoundTimes />

    <!-- 設定彈窗 -->
    <q-dialog v-model="settingsDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ t("btn.settings") }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- 派獎錢包 -->
            <div v-if="walletSwitch" class="col-6">
              <p class="q-mb-sm text-weight-bold">{{ t("table_header.prize_distribution_wallet_type") }}</p>
              <q-select
                v-model="settingsForm.freeround_wallet_type"
                :options="settingsWalletOptions"
                dense
                outlined
                emit-value
                map-options
              />
            </div>
            <!-- 稽核倍數 -->
            <div class="col-6">
              <p class="q-mb-sm text-weight-bold">{{ t("edit_form.audit_multiple") }}</p>
              <div class="row items-center no-wrap audit-multiple-container">
                <q-btn size="md" square flat class="q-left" :disable="isTurnoverDisabled" @click="onAuditRateSub"
                  >-</q-btn
                >
                <q-number
                  v-model="settingsForm.freeround_turnover_rate"
                  :options="auditRateOptions"
                  borderless
                  class="default-input audit-multiple"
                  :disable="isTurnoverDisabled"
                />
                <q-btn size="md" square flat class="q-right" :disable="isTurnoverDisabled" @click="onAuditRateAdd"
                  >+</q-btn
                >
              </div>
            </div>
          </div>

          <!-- 提醒文案 -->
          <div class="q-mt-md text-orange-8 bg-orange-1 q-pa-sm" style="border-radius: 4px">
            <div class="row items-start q-mb-xs">
              <q-icon name="warning" class="q-mr-xs" style="margin-top: 2px" />
              <span class="text-weight-bold">{{ t("free_round.system_logic_tip") }}</span>
            </div>
            <div class="q-pl-md">
              <p class="q-mb-xs">{{ t("free_round.settings_tip_1") }}</p>
              <p class="q-mb-none">{{ t("free_round.settings_tip_2") }}</p>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat :label="t('btn.cancel')" color="grey" v-close-popup />
          <q-btn unelevated :label="t('btn.confirm')" color="primary" @click="onSettingsSave" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted, ref } from "vue"
  import type { CustomQTableProps } from "quasar"
  import { Notify } from "quasar"
  import { useI18n } from "vue-i18n"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { getFreeRound, deleteFreeRound } from "@/api/freeRound"
  import { putSettings } from "@/api/common"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"

  import { useSearch } from "@/hook/useSearch"
  import * as CURRENCY from "@/utils/constants/currency"
  import * as FREE_ROUND_STATUS from "@/utils/constants/freeRoundStatus"
  import * as BONUS_WALLET_TYPE from "@/utils/constants/walletType"
  import {
    getFreeRoundWalletTypeOptions,
    normalizeFreeRoundWalletType,
    normalizeSelectableFreeRoundWalletType
  } from "@/utils/freeRoundWalletType"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { useSiteStore } from "@/stores/siteStore"
  import { useDecimal } from "@/hook/useDecimal"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import AddFreeRoundTimes from "@/components/dialogs/AddFreeRoundTimes.vue"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"
  const { formatDateTime } = useRfc3339()
  const { walletSwitch } = useWalletBouns()
  const siteStore = useSiteStore()
  const { preciseAdd, preciseSubtract } = useDecimal()
  const eventbus = injectStrict(EventBusKey)

  const { search, tableData, totalSize } = useSearch(getFreeRound)

  const { t } = useI18n()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useMemberAccount: true,
      useFreeRoundStatus: true,
      useCurrency: true,
      useFreeRoundProduct: true,
      useFreeRoundGame: true,
      useDatePicker: true,
      useTimePicker: true,
      customDateTimeLabelI18nKey: "table_header.valid_time"
    }

    return baseConfig
  })

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    return [
      {
        name: "bonus_code",
        label: t("table_header.number"),
        field: "bonus_code",
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
        name: "status",
        label: t("table_header.status"),
        field: "status",
        sortable: false,
        align: "center"
      },
      {
        name: "product_name",
        label: t("table_header.product"),
        field: "product_name",
        sortable: false,
        align: "center"
      },
      {
        name: "game_name",
        label: t("table_header.game"),
        field: "game_name",
        sortable: false,
        align: "center"
      },
      {
        name: "rounds",
        label: t("table_header.given_time"),
        field: "rounds",
        sortable: false,
        align: "center"
      },
      {
        name: "rounds_played",
        label: t("table_header.used"),
        field: "rounds_played",
        sortable: false,
        align: "center"
      },
      {
        name: "remark",
        label: t("table_header.remark"),
        field: "remark",
        sortable: false,
        align: "center"
      },
      {
        name: "begin_date",
        label: t("table_header.valid_time"),
        field: "begin_date",
        sortable: false,
        align: "center"
      },
      {
        name: "update_at",
        label: t("table_header.modify_time"),
        field: "update_at",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.created_on"),
        field: "created_at",
        sortable: false,
        align: "center"
      },
      {
        name: "update_by",
        label: t("table_header.operator"),
        field: "update_by",
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
    ]
  })

  let catchQueryForm: Request.GetFreeRound
  async function onSubmit(queryForm: any) {
    const params = {
      begin_date: queryForm.start,
      currency_id: queryForm.currency,
      end_date: queryForm.end,
      game_code: queryForm.freeRoundGame,
      member_account: queryForm.memberAccount,
      offset: queryForm.offset,
      product_code: queryForm.freeRoundProduct,
      size: queryForm.size,
      status: queryForm.freeRoundStatus
    }

    catchQueryForm = params
    await search(params)
  }

  onMounted(() => {
    eventbus.on("handleAddFreeRoundTimesFinish", () => {
      search(catchQueryForm)
    })
  })

  const handleDelete = async (row: Response.GetFreeRoundItem) => {
    if (!row.bonus_code) {
      return
    }

    const res = await deleteFreeRound({
      bonus_code: row.bonus_code,
      wallet_type: normalizeFreeRoundWalletType(row.wallet_type)
    })
    if (res.msg === "success") {
      Notify.create({
        message: t("message.cancellation_successful"),
        color: "positive"
      })
      // 重新加载数据
      await search(catchQueryForm)
    }
  }

  const onAddTimes = () => {
    eventbus.emit("handleAddFreeRoundTimesShow", true)
  }

  // 設定彈窗
  const settingsDialog = ref(false)

  function onSettings() {
    settingsForm.freeround_wallet_type = normalizeSelectableFreeRoundWalletType(
      siteStore.freeround_wallet_type,
      siteStore.wallet_type_list
    )
    settingsForm.freeround_turnover_rate = siteStore.freeround_turnover_rate
    settingsDialog.value = true
  }

  const isTurnoverDisabled = computed(() => false)
  const settingsForm = reactive({
    freeround_wallet_type: normalizeSelectableFreeRoundWalletType(
      siteStore.freeround_wallet_type,
      siteStore.wallet_type_list
    ),
    freeround_turnover_rate: siteStore.freeround_turnover_rate ?? 0
  })

  const settingsWalletOptions = computed(() => getFreeRoundWalletTypeOptions(siteStore.wallet_type_list, t))

  // 稽核倍數
  const auditRateStep = 0.5
  const auditRateOptions = {
    min: 0,
    precision: "2",
    nullValue: 0
  }
  function onAuditRateAdd() {
    settingsForm.freeround_turnover_rate = preciseAdd(settingsForm.freeround_turnover_rate, auditRateStep)
  }
  function onAuditRateSub() {
    if (settingsForm.freeround_turnover_rate) {
      settingsForm.freeround_turnover_rate = preciseSubtract(settingsForm.freeround_turnover_rate, auditRateStep)
    }
  }

  async function onSettingsSave() {
    const { search: save, status } = useSearch(putSettings)
    settingsForm.freeround_wallet_type = normalizeSelectableFreeRoundWalletType(
      settingsForm.freeround_wallet_type,
      siteStore.wallet_type_list
    )
    settingsForm.freeround_turnover_rate = Number(settingsForm.freeround_turnover_rate)
    const payload = {
      freeround_wallet_type: settingsForm.freeround_wallet_type,
      freeround_turnover_rate: Number(settingsForm.freeround_turnover_rate)
    } as Request.PutSettings
    await save(payload)

    if (status.value) {
      for (const key of Object.keys(siteStore.$state)) {
        if (key in settingsForm) {
          ;(siteStore as any)[key] = JSON.parse(JSON.stringify((settingsForm as any)[key]))
        }
      }
      Notify.create({
        color: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      settingsDialog.value = false
    }
  }
</script>

<style lang="scss" scoped>
  .add-times-btn {
    font-size: 14px;
  }

  .table-container {
    padding: 1rem;
    border-radius: 10px 10px 0 0;
    background-color: #fff;
  }
</style>
