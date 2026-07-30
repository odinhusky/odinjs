<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn class="q-mr-sm btns btn-green" @click="onAdd()" v-if="permission.edit">
            <q-icon class="q-mr-xs" size="xs" name="savings" />
            {{ $t("btn.add_gift_money") }}
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
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="currency_ids" :props="props">
                  <template v-if="props.row.currency_ids.length">
                    <div v-for="(id, index) in props.row.currency_ids" :key="id">
                      {{ $t(CURRENCY_TYPE.I18nKeys[id as CURRENCY_TYPE.Enums]) || "" }}
                    </div>
                  </template>
                  <template v-else>-</template>
                </q-td>

                <q-td key="amounts" :props="props">
                  <template v-if="props.row.amounts.length">
                    <div v-for="(amt, index) in props.row.amounts" :key="index">
                      {{ moneyFormat(amt) }}
                    </div>
                  </template>
                  <template v-else>-</template>
                </q-td>
                <!--
              <q-td key="status" :props="props">
                {{ $t(GIFT_RECEIVE_STATUS.I18nKeys[props.row.status as GIFT_RECEIVE_STATUS.Enums] || "common.unknow") }}
              </q-td>-->

                <!-- 錢包類型 -->
                <q-td v-if="walletSwitch" key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>

                <q-td key="created_at" :props="props">
                  {{ genTimeFormat(props.row.created_at) }}
                </q-td>

                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini color="blue" @click="onAction(props.row)">
                    <q-icon class="q-mr-xs" size="xs" name="visibility" />
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
  import { CustomQTableProps } from "quasar"
  import { onMounted, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"

  import { getGiftEventlList } from "@/api/giftDetail"
  import type { GetGiftDetailList } from "@/api/request.type"
  import { CURRENCY_TYPE, BONUS_WALLET_TYPE, AI_HELPER_EVENT_ROUTES } from "@/utils/constants"
  import { useAIHelperEvent } from "@/hook/useAIHelperEvent"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useMemberAccount: true,
      useCurrency: true,
      useGiftName: true,
      useReceiveStatus: true,
      useDatePicker: true,
      useTimePicker: true,
      useReceiveDateType: true
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    return baseConfig
  })

  const { handleAIHelperRouteEvent } = useAIHelperEvent()
  const { permission } = usePermission()
  const { t } = useI18n()
  const { walletSwitch } = useWalletBouns()
  const eventbus = injectStrict(EventBusKey)

  const { genTimeFormat, moneyFormat } = useCommon()

  let { search, tableData, totalSize, tableTotal } = useSearch(getGiftEventlList)
  let catchQueryForm: GetGiftDetailList

  async function onSubmit(queryForm: GetGiftDetailList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const baseColumns: CustomQTableProps["columns"] = [
      {
        name: "name",
        label: t("table_header.gift_type_name"),
        field: "name",
        sortable: false,
        align: "center"
      },
      {
        name: "currency_ids",
        label: t("table_header.currency_distribution"),
        field: "currency_ids",
        sortable: false,
        align: "center"
      },
      {
        name: "amounts",
        label: t("table_header.distribution_amount"),
        field: "amounts",
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
        name: "created_at",
        label: t("table_header.created_on"),
        field: "created_at",
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

    return baseColumns
  })

  function onAdd() {
    eventbus.emit("handleAddGiftDetailShow", true)
  }

  const router = useRouter()
  const route = useRoute()
  const onAction = (row: any) => {
    const { memberAccount, start, end, dateType, receiveStatus, currency, wallet_type } = route.query
    router.push({
      name: "GiftDdetails",
      params: {
        id: row.id
      },
      query: {
        memberAccount,
        start,
        end,
        dateType,
        receiveStatus,
        currency,
        wallet_type
      }
    })
  }

  onMounted(async () => {
    handleAIHelperRouteEvent(AI_HELPER_EVENT_ROUTES.Enums.GIFT_DDETAILS_LIST)

    eventbus.on("handleAddGiftDetailFinish", () => {
      onSubmit(catchQueryForm)
    })
  })
</script>
