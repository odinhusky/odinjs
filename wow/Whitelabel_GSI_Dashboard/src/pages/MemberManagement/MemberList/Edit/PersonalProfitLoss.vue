<template>
  <q-card class="q-pa-md no-shadow editWrapper_v2">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row items-center q-mb-md q-gutter-sm">
          <!-- 錢包類型下拉選單 -->
          <q-select
            v-if="walletSwitch"
            v-model="selectedWalletType"
            :options="walletTypeOptions"
            dense
            outlined
            emit-value
            map-options
            style="min-width: 140px"
            @update:model-value="onWalletTypeChange"
          />
          <div class="tip bg-orange-1 q-px-sm text-orange-8 row items-center" style="height: 40px">
            {{ $t("common.summary_tip") }}
          </div>
        </div>
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
              <q-td key="currency_id" :props="props">
                {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums]) }}
              </q-td>
              <q-td key="total_deposit" :props="props">
                {{ moneyFormat(props.row.total_deposit) }}
              </q-td>
              <q-td key="total_withdraw" :props="props">
                {{ moneyFormat(props.row.total_withdraw) }}
              </q-td>
              <q-td key="total_bet" :props="props">
                {{ moneyFormat(props.row.total_bet) }}
              </q-td>
              <q-td key="total_valid_bet" :props="props">
                {{ moneyFormat(props.row.total_valid_bet) }}
              </q-td>
              <q-td key="total_profit" :props="props">
                {{ moneyFormat(props.row.total_profit) }}
              </q-td>
              <q-td key="updated_time" :props="props">
                {{ genTimeFormat(props.row.updated_time) }}
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
      </template>
    </query>
  </q-card>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router"
  import { CustomQTableProps, QTableProps } from "quasar"
  import { reactive, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"

  import { getMemberStatistics } from "@/api/member"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useRoute } from "vue-router"
  import { CURRENCY_TYPE, BONUS_WALLET_TYPE } from "@/utils/constants"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  const { t } = useI18n()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: false
  })

  const { search, tableData, totalSize, tableTotal } = useSearch(getMemberStatistics)
  const route = useRoute()

  const { genTimeFormat, moneyFormat, numberEnumToArray } = useCommon()
  const { walletSwitch } = useWalletBouns()

  const selectedWalletType = ref<BONUS_WALLET_TYPE.Enums>(BONUS_WALLET_TYPE.Enums.GENERALLY)

  const walletTypeOptions = computed(() =>
    numberEnumToArray(BONUS_WALLET_TYPE.Enums).map((item) => ({
      label: t(BONUS_WALLET_TYPE.I18nKeys[item as keyof typeof BONUS_WALLET_TYPE.I18nKeys]) || t("common.unknow"),
      value: item as number,
      disable: !walletSwitch.value && item !== BONUS_WALLET_TYPE.Enums.GENERALLY
    }))
  )

  function onWalletTypeChange() {
    onSubmit()
  }

  async function onSubmit() {
    const id = route.params.id as string
    await search({ id: parseInt(id), wallet_type: selectedWalletType.value })
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "currency_id",
      label: t("table_header.currency"),
      field: "currency_id",
      sortable: false,
      align: "center"
    },
    {
      name: "total_deposit",
      label: t("table_header.total_deposit"),
      field: "total_deposit",
      sortable: false,
      align: "center"
    },
    {
      name: "total_withdraw",
      label: t("table_header.total_withdraw"),
      field: "total_withdraw",
      sortable: false,
      align: "center"
    },
    {
      name: "total_bet",
      label: t("table_header.total_bet"),
      field: "total_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "total_valid_bet",
      label: t("table_header.total_effective_bet"),
      field: "total_valid_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "total_profit",
      label: t("table_header.total_profit"),
      field: "total_profit",
      sortable: false,
      align: "center"
    },
    {
      name: "updated_time",
      label: t("table_header.updated_time"),
      field: "updated_time",
      sortable: false,
      align: "center"
    }
  ])
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }

  :deep(.custom-hide) {
    display: none !important;
  }

  .tip {
    font-size: 12px;
    font-weight: 500;
    border: 1px solid $orange-8;
    border-radius: 4px;
    width: fit-content;
  }
</style>
