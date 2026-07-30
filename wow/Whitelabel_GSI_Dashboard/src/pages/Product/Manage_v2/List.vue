<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-select
            v-if="isAgentMode"
            v-model="selectedLanguage"
            :options="langOption"
            outlined
            dense
            emit-value
            map-options
            color="primary"
            style="min-width: 4.6875rem"
            :option-label="(item) => LANGUAGE_TYPE.Labels[item.label as LANGUAGE_TYPE.Enums]"
            @update:model-value="updateLanguage"
          />

          <q-select
            v-else
            v-model="selectedLanguage"
            :options="availableLanguages"
            outlined
            dense
            emit-value
            map-options
            color="primary"
            style="min-width: 4.6875rem"
            :option-label="(item) => LANGUAGE_TYPE.Labels[item as LANGUAGE_TYPE.Enums]"
            @update:model-value="updateLanguage"
          />
        </div>
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
            <template #header="props">
              <q-tr :props="props">
                <q-th v-for="col in primaryHeaderColumns" :key="col.name" :props="props" :rowspan="isAgentMode ? 2 : 1">
                  {{ col.label }}
                </q-th>
                <template v-if="isAgentMode">
                  <q-th colspan="1" class="wallet-group-header">{{ $t("common.cash_wallet") }}</q-th>
                  <q-th v-if="showBonusWalletColumns" colspan="2" class="wallet-group-header">
                    {{ $t("common.gift_wallet") }}
                  </q-th>
                  <q-th v-for="col in trailingHeaderColumns" :key="col.name" :props="props" rowspan="2">
                    {{ col.label }}
                  </q-th>
                </template>
              </q-tr>
              <q-tr v-if="isAgentMode" :props="props">
                <q-th class="wallet-limit-header">
                  <span>{{ $t("website_settings.max_bet_limit") }}</span>
                  <q-icon name="error_outline" size="1rem" class="q-ml-sm cursor-pointer">
                    <q-tooltip anchor="top middle" self="bottom middle">
                      {{ $t("website_settings.max_bet_limit_hint") }}
                    </q-tooltip>
                  </q-icon>
                </q-th>
                <template v-if="showBonusWalletColumns">
                  <q-th>{{ $t("table_header.reward_wallet_bet_enabled") }}</q-th>
                  <q-th class="wallet-limit-header">
                    <span>{{ $t("website_settings.max_bet_limit") }}</span>
                    <q-icon name="error_outline" size="1rem" class="q-ml-sm cursor-pointer">
                      <q-tooltip anchor="top middle" self="bottom middle">
                        {{ $t("website_settings.max_bet_limit_hint") }}
                      </q-tooltip>
                    </q-icon>
                  </q-th>
                </template>
              </q-tr>
            </template>

            <template #body="props">
              <q-tr>
                <!--集成名稱-->
                <q-td key="integration_name" :props="props">
                  {{ props.row.integration_name }}
                </q-td>
                <!--產品代碼-->
                <q-td key="product_code" :props="props">
                  {{ props.row.product_code }}
                </q-td>
                <!--產品-->
                <q-td key="product_name" :props="props"> {{ props.row.product_name }} </q-td>
                <!--產品類別-->
                <q-td key="game_type" :props="props">
                  {{ getGameLabel(props.row.game_type) }}
                </q-td>
                <!--幣別-->
                <q-td key="currency_id" :props="props">
                  {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums]) || "" }}
                </q-td>
                <!--集成開關-->
                <q-td key="integration_status" :props="props">
                  <template v-if="props.row.integration_status">
                    {{ $t("common.is_open") }}
                  </template>

                  <template v-else>
                    {{ $t("common.is_close") }}
                  </template>
                </q-td>
                <!--產品開關-->
                <q-td key="status" :props="props"
                  ><q-toggle
                    v-model="props.row.status"
                    color="blue"
                    class="toggle"
                    size="lg"
                    :false-value="false"
                    :true-value="true"
                    keep-color
                    :disable="!permission.edit"
                    @update:model-value="updateStatus(props.row)"
                  />
                </q-td>
                <!--有效投注計入比例-->
                <q-td key="turnover_rate" :props="props" v-if="isAgentMode">
                  <div class="row items-center justify-center no-wrap">
                    <q-input
                      v-model.number="props.row.turnover_rate"
                      type="number"
                      dense
                      outlined
                      :disable="!permission.edit"
                      style="max-width: 5rem"
                      input-class="text-center"
                      :min="0"
                      step="1"
                      :rules="[
                        (v: any) =>
                          v === null ||
                          v === '' ||
                          (Number.isInteger(Number(v)) && Number(v) >= 0) ||
                          '請輸入 ≥ 0 的整數'
                      ]"
                      @change="onTurnoverRateChange(props.row)"
                    />
                    <span class="q-ml-xs">%</span>
                  </div>
                </q-td>
                <!--現金錢包單注最高投注限制-->
                <q-td key="cash_max_bet" :props="props" v-if="isAgentMode">
                  <div class="row items-center justify-center no-wrap">
                    <q-input
                      :model-value="props.row.cash_max_bet"
                      type="text"
                      inputmode="decimal"
                      dense
                      outlined
                      :disable="!permission.edit"
                      class="max-bet-input"
                      input-class="text-center"
                      @update:model-value="(value) => updateMaxBetInput(props.row, 'cash_max_bet', value)"
                      @blur="onMaxBetBlur(props.row, 'cash_max_bet')"
                    />
                  </div>
                </q-td>
                <!--贈金錢包投注開關-->
                <q-td key="bonus_support" :props="props" v-if="isAgentMode && showBonusWalletColumns">
                  <q-toggle
                    v-model="props.row.bonus_support"
                    color="blue"
                    class="toggle"
                    size="lg"
                    :false-value="false"
                    :true-value="true"
                    keep-color
                    :disable="!permission.edit"
                    @update:model-value="updateBonusSupportStatus(props.row)"
                  />
                </q-td>
                <!--贈金錢包單注最高投注限制-->
                <q-td key="bonus_max_bet" :props="props" v-if="isAgentMode && showBonusWalletColumns">
                  <div class="row items-center justify-center no-wrap">
                    <q-input
                      :model-value="props.row.bonus_max_bet"
                      type="text"
                      inputmode="decimal"
                      dense
                      outlined
                      :disable="!permission.edit || !props.row.bonus_support"
                      class="max-bet-input"
                      input-class="text-center"
                      @update:model-value="(value) => updateMaxBetInput(props.row, 'bonus_max_bet', value)"
                      @blur="onMaxBetBlur(props.row, 'bonus_max_bet')"
                    />
                  </div>
                </q-td>
                <!--開啟方式-->
                <q-td key="entrance_type" :props="props" v-if="isAgentMode">
                  <q-btn
                    flat
                    fab-mini
                    color="blue"
                    @click="onEdit(props.row)"
                    :disable="!permission.edit"
                    v-if="props.row.allow_entrance_type !== 0"
                  >
                    <q-icon class="q-mr-xs" size="xs" name="edit"></q-icon>
                  </q-btn>
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props" v-if="isAgentMode">
                  <q-btn
                    flat
                    fab-mini
                    color="blue"
                    :to="{
                      name: 'ProductManageSetting_v2',
                      query: {
                        integration_id: props.row.integration_id,
                        product_code: props.row.product_code,
                        game_type: props.row.game_type
                      }
                    }"
                  >
                    {{ $t("btn.settings") }}
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
    <dialog-comp v-model="editDialog" :configs="dialogConfigs.edit" :loading="editLoading" max-width="20rem">
      <template #mainContent>
        <div class="custom-image-form">
          <div class="custom-image-content">
            <div class="custom-image-row">
              <div
                class="custom-image-col"
                v-if="
                  dialogData.customImageForm.allow_entrance_type === 1 ||
                  dialogData.customImageForm.allow_entrance_type === 3
                "
              >
                <q-radio
                  v-model="dialogData.customImageForm.entrance_type"
                  :val="1"
                  :label="$t('common.single_entry')"
                />
              </div>
              <div
                class="custom-image-col"
                v-if="
                  dialogData.customImageForm.allow_entrance_type === 2 ||
                  dialogData.customImageForm.allow_entrance_type === 3
                "
              >
                <q-radio v-model="dialogData.customImageForm.entrance_type" :val="2" :label="$t('common.game_list')" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </dialog-comp>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { useQueryStore } from "src/stores/queryStore"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useEnv } from "src/hook/useEnv"
  import { useSiteStore } from "src/stores/siteStore"
  import { getGameTypes, updateGameType } from "@/api/gameType"
  import {
    getGameList,
    updateBonusMaxBet,
    updateBonusSupport,
    updateCashMaxBet,
    updateProductState,
    updateTurnoverRate,
    uploadEntranceType
  } from "@/api/productV2"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"
  import { BONUS_WALLET_TYPE, GAME_TYPE, CURRENCY_TYPE, LANGUAGE_TYPE } from "@/utils/constants"
  import PreviewImage from "@/components/forms/PreviewImage.vue"
  import { useDialog } from "src/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useLanguage } from "src/composables/useLanguage"
  import { useLanguageStore } from "src/stores/languageStore"
  import { storeToRefs } from "pinia"

  const { permission } = usePermission()
  const { t } = useI18n()

  const { envData, isAgentMode } = useEnv()
  const { VITE_APP_BASE_API } = envData()
  const $q = useQuasar()
  const languageStore = useLanguageStore()
  const { availableLanguages } = useLanguage()

  const siteStore = useSiteStore()
  const { langList, boLangList, wallet_type_list, walletTypeListReady } = storeToRefs(siteStore)
  const showBonusWalletColumns = computed(
    () => walletTypeListReady.value && wallet_type_list.value.includes(BONUS_WALLET_TYPE.Enums.REWARD)
  )
  const langOption = computed(() => {
    const source = isAgentMode ? langList.value : boLangList.value
    return source.map((item) => ({
      label: item.label,
      value: item.label
    }))
  })
  const selectedLanguage = ref<string>("")

  watch(
    [langOption, availableLanguages],
    () => {
      if (selectedLanguage.value) return
      if (isAgentMode) {
        if (langOption.value.length > 0) {
          selectedLanguage.value = langOption.value[0].value
        }
      } else if (availableLanguages.value.length > 0) {
        selectedLanguage.value = availableLanguages.value[0]
      }
    },
    { immediate: true }
  )

  const updateLanguage = (newLanguage: any) => {
    selectedLanguage.value = newLanguage
    onSubmit(catchQueryForm)
  }
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useIntegration: true,
    useProductCode: true,
    useProductNames: true,
    useGameTypeV2: true,
    useCurrency: true,
    useIntegrationStatus: true,
    useProductStatus: true
  })

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const baseColumn: QTableProps["columns"] = [
      {
        name: "integration_name",
        label: t("query_params.gsc_name"),
        field: "integration_name",
        sortable: false,
        align: "center"
      },
      {
        name: "product_code",
        label: t("table_header.product_code"),
        field: "product_code",
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
        name: "game_type",
        label: t("table_header.product_type"),
        field: "game_type",
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
        name: "integration_status",
        label: t("table_header.route_switch"),
        field: "integration_status",
        sortable: false,
        align: "center"
      },
      {
        name: "status",
        label: t("menu.product_switch"),
        field: "status",
        sortable: false,
        align: "center"
      }
    ]

    if (isAgentMode) {
      baseColumn.push({
        name: "turnover_rate",
        label: t("product.turnover_rate_percent"),
        field: "turnover_rate",
        sortable: false,
        align: "center"
      })
      baseColumn.push({
        name: "cash_max_bet",
        label: `${t("common.cash_wallet")} ${t("website_settings.max_bet_limit")}`,
        field: "cash_max_bet",
        sortable: false,
        align: "center"
      })
      if (showBonusWalletColumns.value) {
        baseColumn.push(
          {
            name: "bonus_support",
            label: `${t("common.gift_wallet")} ${t("table_header.reward_wallet_bet_enabled")}`,
            field: "bonus_support",
            sortable: false,
            align: "center"
          },
          {
            name: "bonus_max_bet",
            label: `${t("common.gift_wallet")} ${t("website_settings.max_bet_limit")}`,
            field: "bonus_max_bet",
            sortable: false,
            align: "center"
          }
        )
      }
      baseColumn.push({
        name: "entrance_type",
        label: t("common.redirect_method"),
        field: "entrance_type",
        sortable: false,
        align: "center"
      })
      baseColumn.push({
        name: "actions",
        label: t("table_header.function"),
        field: "actions",
        sortable: false,
        align: "center"
      })
    }

    return baseColumn
  })

  const primaryHeaderColumns = computed(() =>
    (tableColumn.value ?? []).filter((col) =>
      [
        "integration_name",
        "product_code",
        "product_name",
        "game_type",
        "currency_id",
        "integration_status",
        "status",
        "turnover_rate"
      ].includes(col.name)
    )
  )
  const trailingHeaderColumns = computed(() =>
    (tableColumn.value ?? []).filter((col) => ["entrance_type", "actions"].includes(col.name))
  )

  const tableList = ref<Response.GameTypes>([])

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getGameList)

  // Store original turnover_rate for each row when data is loaded
  const originalTurnoverRates = ref<Record<number, number>>({})
  const originalMaxBets = ref<Record<number, Record<"cash_max_bet" | "bonus_max_bet", number>>>({})

  const getGameLabel = computed(() => (gameType: GAME_TYPE.Enums) => {
    return t(GAME_TYPE.I18nKeys[gameType as keyof typeof GAME_TYPE.I18nKeys] || "common.unknow")
  })

  async function getGameTypeList() {
    if (!isAgentMode) return

    await search()
    const searchResult = tableData.value as Response.GameTypes
    tableList.value = searchResult.map((e) => {
      e.origin_position = e.position
      return e
    })
  }

  const dialogConfigs = reactive<{
    edit: IDialogConfig
  }>({
    edit: {
      dialogLabelI18nKey: "dialog.opening_method",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleEdit,
      showLabelCloseBtn: true
    }
  })

  const dialogData = reactive<{
    customImageForm: {
      entrance_type: number
      allow_entrance_type: number
      integration_id: number
      product_code: number
      game_type: number
    }
  }>({
    customImageForm: {
      entrance_type: 1,
      allow_entrance_type: 1,
      integration_id: 0,
      product_code: 0,
      game_type: 0
    }
  })

  const {
    dialog: editDialog,
    openDialog: openEditDialog,
    loading: editLoading,
    openLoading: openEditLoading,
    closeLoading: closeEditLoading,
    closeDialog: closeEdit
  } = useDialog()

  function onEdit(row: {
    agent_product_id: number
    entrance_type: number
    allow_entrance_type: number
    integration_id: number
    product_code: number
    game_type: number
  }) {
    dialogData.customImageForm.entrance_type = row.entrance_type
    dialogData.customImageForm.allow_entrance_type = row.allow_entrance_type
    dialogData.customImageForm.integration_id = row.integration_id
    dialogData.customImageForm.product_code = row.product_code
    dialogData.customImageForm.game_type = row.game_type

    openEditDialog()
  }

  async function handleEdit() {
    openEditLoading()
    const payload: { entrance_type: number; integration_id: number; product_code: number; game_type: number } = {
      entrance_type: dialogData.customImageForm.entrance_type,
      integration_id: dialogData.customImageForm.integration_id,
      product_code: dialogData.customImageForm.product_code,
      game_type: dialogData.customImageForm.game_type
    }
    const { search, status } = useSearch(uploadEntranceType)
    await search(payload)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }

    closeEdit()
    closeEditLoading()
  }
  let catchQueryForm: Request.GetGameListV2
  async function onSubmit(queryForm: Request.GetGameListV2) {
    catchQueryForm = queryForm
    const fallbackLan = isAgentMode ? langOption.value[0]?.value : availableLanguages.value[0]
    catchQueryForm.lan = selectedLanguage.value || fallbackLan || ""

    await search(queryForm)

    // Cache original editable values for confirmation dialogs and rollback
    if (tableData.value) {
      ;(tableData.value as Response.AgentProductList).forEach((row) => {
        const id = isAgentMode ? row.agent_product_id : row.id
        originalTurnoverRates.value[id] = row.turnover_rate ?? 100
        originalMaxBets.value[id] = {
          cash_max_bet: Number(row.cash_max_bet ?? 0),
          bonus_max_bet: Number(row.bonus_max_bet ?? 0)
        }
      })
    }
  }
  /*async function onSubmit(queryForm: Request.ProductManage) {
     const { game_type, product_code, keyword } = queryForm
    if (queryForm.keyword) {
      router.push({
        name: "ProductManageGameSetting",
        query: {
          game_type,
          product_code,
          keyword
        }
      })
      return
    }

    if (queryForm.product_code) {
      router.push({
        name: "ProductManageSetting",
        query: {
          game_type,
          code: product_code
        }
      })
      return
    }
  }*/
  const updateStatus = async (row: { agent_product_id: number; id: number; status: boolean }) => {
    const id = isAgentMode ? row.agent_product_id : row.id

    const sendData = {
      ids: [id],
      status: row.status
    }

    const { search, status } = useSearch(updateProductState)
    await search(sendData)

    if (status.value) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    }
  }
  const onTurnoverRateChange = (row: any) => {
    const id = isAgentMode ? row.agent_product_id : row.id
    const oldValue = originalTurnoverRates.value[id] ?? 100
    // 未填寫時預設 100%，並確保為整數且 ≥ 0
    const raw = row.turnover_rate
    const newValue = raw === null || raw === undefined || raw === "" ? 100 : Math.max(0, Math.floor(Number(raw)))
    row.turnover_rate = newValue

    if (newValue === oldValue) return

    $q.dialog({
      message: t("product.turnover_rate_confirm", { old: oldValue, new: newValue }),
      ok: { label: t("btn.confirm"), color: "primary", unelevated: true },
      cancel: { label: t("btn.cancel"), flat: true, color: "primary" }
    })
      .onOk(async () => {
        const { search: updateSearch, status } = useSearch(updateTurnoverRate)
        await updateSearch({ ids: [id], turnover_rate: newValue })

        if (status.value) {
          $q.notify({
            type: "positive",
            message: t("message.edit_success"),
            position: "top",
            timeout: 300
          })
          onSubmit(catchQueryForm)
        }
      })
      .onCancel(() => {
        row.turnover_rate = oldValue
      })
  }

  type MaxBetField = "cash_max_bet" | "bonus_max_bet"

  const updateMaxBetInput = (row: Response.AgentProductItem, field: MaxBetField, value: string | number | null) => {
    const rawValue = String(value ?? "")

    if (rawValue === "") {
      row[field] = ""
      return
    }

    if (rawValue.includes("-")) return

    const sanitizedValue = rawValue.replace(/[^\d.]/g, "")
    const [integerPart = "", ...decimalParts] = sanitizedValue.split(".")
    const hasDecimalPoint = sanitizedValue.includes(".")
    const decimalPart = decimalParts.join("").slice(0, 4)
    const normalizedIntegerPart = integerPart || (hasDecimalPoint ? "0" : "")

    row[field] = hasDecimalPoint ? `${normalizedIntegerPart}.${decimalPart}` : normalizedIntegerPart
  }

  const onMaxBetBlur = (row: Response.AgentProductItem, field: MaxBetField) => {
    const id = isAgentMode ? row.agent_product_id : row.id
    const oldValue = originalMaxBets.value[id]?.[field] ?? 0
    const rawValue = row[field]
    const newValue = Number(rawValue)

    if (rawValue === null || rawValue === undefined || rawValue === "" || !Number.isFinite(newValue) || newValue < 0) {
      row[field] = oldValue
      return
    }

    if (newValue === oldValue) return

    row[field] = newValue
    const walletLabel = field === "cash_max_bet" ? t("common.cash_wallet") : t("common.gift_wallet")
    const fieldLabel = `${walletLabel} ${t("website_settings.max_bet_limit")}`

    $q.dialog({
      message: `確定將 [${fieldLabel}] 由 ${oldValue} 元修改為 ${newValue} 元？`,
      ok: { label: t("btn.confirm"), color: "primary", unelevated: true },
      cancel: { label: t("btn.cancel"), flat: true, color: "primary" }
    })
      .onOk(async () => {
        const updateFunction = field === "cash_max_bet" ? updateCashMaxBet : updateBonusMaxBet
        const payload =
          field === "cash_max_bet" ? { ids: [id], cash_max_bet: newValue } : { ids: [id], bonus_max_bet: newValue }
        const { search: updateSearch, status } = useSearch(updateFunction)
        await updateSearch(payload)

        if (!status.value) {
          row[field] = oldValue
          return
        }

        originalMaxBets.value[id][field] = newValue
        $q.notify({
          type: "positive",
          message: t("message.edit_success"),
          position: "top",
          timeout: 300
        })
        onSubmit(catchQueryForm)
      })
      .onCancel(() => {
        row[field] = oldValue
      })
  }

  const updateBonusSupportStatus = async (row: Response.AgentProductItem) => {
    const id = isAgentMode ? row.agent_product_id : row.id
    const previousValue = !row.bonus_support
    const { search: updateSearch, status } = useSearch(updateBonusSupport)

    await updateSearch({
      ids: [id],
      bonus_support: row.bonus_support
    })

    if (!status.value) {
      row.bonus_support = previousValue
      return
    }

    $q.notify({
      type: "positive",
      message: t("message.edit_success"),
      position: "top",
      timeout: 300
    })
    onSubmit(catchQueryForm)
  }

  onMounted(async () => {
    //selectedLanguage.value = isAgentMode ? langOption.value[0].value : availableLanguages.value[0]
  })
</script>

<style lang="scss" scoped>
  @import "../../../css/_variable.sass";
  @import "../../../css/custom.scss";

  .language-select > div {
    box-shadow: none;
  }
  .custom-q-select {
    background: #edefff !important;
    color: #553b85 !important;
  }
  .max-bet-input {
    max-width: 6rem;
    margin: 0 auto;
  }
  .wallet-group-header,
  .wallet-limit-header {
    border-right: 0.15vw solid rgb(255 255 255 / 71%) !important;
  }
  .wallet-limit-header {
    white-space: nowrap;
  }
</style>
