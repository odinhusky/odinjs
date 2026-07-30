<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
              <q-td key="settlement_date" :props="props">
                {{ genTimeFormat(props.row.settled_at, "yyyy-MM-dd") }}
              </q-td>
              <q-td key="group_name" :props="props">
                {{ props.row.group_name }}
              </q-td>
              <q-td key="period_type" :props="props">
                {{ $t(COMMISSION_GROUP.Enums[props.row.period_type] || "common.unknow") }}
              </q-td>
              <q-td key="currency" :props="props">
                {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency] || "common.unknow") }}
              </q-td>

              <q-td key="game_type" :props="props">
                {{ $t(GAME_TYPE.I18nKeys[props.row.game_type] || "common.unknow") }}
              </q-td>
              <q-td key="valid_bat" :props="props">
                {{ moneyFormat(props.row.valid_bat) }}
              </q-td>
              <q-td key="rate" :props="props"> {{ props.row.rate }}% </q-td>
              <q-td key="amount" :props="props">
                {{ moneyFormat(props.row.amount) }}
              </q-td>
              <q-td key="dispatch_type" :props="props">
                {{ $t(REWARD_TYPE.I18nKeys[props.row.dispatch_type] || "common.unknow") }}
              </q-td>
              <q-td key="dispatch_at" :props="props">
                {{ genTimeFormat(props.row.dispatch_at, "yyyy-MM-dd HH:mm") }}
              </q-td>
              <q-td key="status" :props="props">
                {{ $t(REWARD_STATUS.I18nKeys[props.row.status] || "common.unknow") }}
              </q-td>

              <!-- 明細 -->
              <q-td key="detail" :props="props">
                <q-btn flat fab-mini icon="report" color="secondary" @click="onAction(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.details") }}</q-tooltip>
                </q-btn>
              </q-td>
              <q-td key="member_tag" :props="props">
                {{ props.row.member_tag }}
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
              :sub-total-data="tableSubTotal"
              :total-data="tableTotal"
            />
          </template>
        </q-table>
      </template>
    </query>
    <q-card-actions class="q-py-md" align="center">
      <q-btn outline color="main-color" class="btnCancel q-mr-md" @click="onCancel">
        {{ $t("btn.cancel") }}
      </q-btn>
      <q-btn color="main-color" class="btnSubmit" :loading="isLoading" @click="onSubmit">{{ $t("btn.check") }}</q-btn>
    </q-card-actions>
  </div>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from "vue-router"
  import { CustomQTableProps, QTableProps } from "quasar"
  import { reactive, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"

  import { getMemberCommissionReportList } from "@/api/member"
  import type { GetMemberCommisionReport } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { CURRENCY_TYPE, GAME_TYPE, REWARD_TYPE, REWARD_STATUS, COMMISSION_GROUP } from "@/utils/constants"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(false)
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useCommissionGroup: true,
    useCurrency: true,
    useDatePicker: true,
    // 暫時隱藏
    // useDateType: true,
    useDistributionStatus: true,
    useGameType: true,
    useRewardType: true
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getMemberCommissionReportList)
  const { moneyFormat, genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetMemberCommisionReport) {
    queryForm.id = Number(route.params.id as string)
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "settled_at",
      label: t("table_header.settlement_date"),
      field: "settled_at",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "group_name",
      label: t("table_header.commission_group"),
      field: "group_name",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "period_type",
      label: t("table_header.settle_cycle"),
      field: "period_type",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "game_type",
      label: t("table_header.product_type"),
      field: "game_type ",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "valid_bat",
      label: t("table_header.effective_sales_volume"),
      field: "valid_bat",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "rate",
      label: t("table_header.ratio"),
      field: "rate",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "rate",
      totalColumn: "rate",
      appendStringI18nKey: "%"
    },
    {
      name: "amount",
      label: t("table_header.commission_amount"),
      field: "amount",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "amount",
      totalColumn: "amount"
    },
    {
      name: "dispatch_type",
      label: t("table_header.reward_type"),
      field: "dispatch_type",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },
    {
      name: "dispatch_at",
      label: t("table_header.dispatch_date"),
      field: "dispatch_at",
      sortable: false,
      align: "center",
      useSubTotalColumn: false
    },

    {
      name: "status",
      label: t("table_header.status"),
      field: "status",
      sortable: false,
      align: "center"
    },

    {
      name: "detail",
      label: t("table_header.detail"),
      field: "detail",
      sortable: false,
      align: "center"
    }
    // {
    //   name: "member_tag",
    //   label: t("table_header.member_tag"),
    //   field: "member_tag",
    //   sortable: false,
    //   align: "center"
    // }
  ])

  function onCancel() {
    router.push({ name: "MemberList" })
  }
  function onAction(row: GetMemberCommisionReport) {
    const { start, end } = route.query
    router.push({
      name: "EditCommisionReportDetail",
      params: {
        id: row.id
      },
      query: {
        start,
        end
      }
    })
  }
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
</style>
