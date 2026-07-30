<template>
  <SubPage :action-label-i18n-key="'common.detail'" class="q-pt-xs" :custom-back-func="onBackTo" />
  <div class="q-pa-md" style="padding-top: 0">
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
                <!-- 会员账号 -->
                <q-td key="member_name" :props="props">
                  {{ props.row.member_name }}
                </q-td>

                <!-- 币别 -->
                <q-td key="currency_id" :props="props">
                  {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums]) }}
                </q-td>

                <!-- 有效投注 -->
                <q-td key="valid_bet" :props="props">
                  {{ moneyFormat(props.row.valid_bet) }}
                </q-td>
                <!-- 盈虧 -->
                <q-td key="profit" :props="props">
                  {{ moneyFormat(props.row.profit) }}
                </q-td>
                <!-- 佣金金額 -->
                <q-td key="amount" :props="props">
                  {{ moneyFormat(props.row.amount) }}
                </q-td>
                <!--返佣層級 -->
                <q-td key="tier" :props="props">
                  {{ props.row.tier }}
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
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { CURRENCY_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getReferralCommssionNestedDetail } from "@/api/commissionManagement"
  import type { GetCommissionDetailDetail } from "@/api/request.type"
  import SubPage from "layouts/SubPage/Index.vue"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  let { search, tableData, totalSize } = useSearch(getReferralCommssionNestedDetail)
  const { genTimeFormat, moneyFormat } = useCommon()

  let catchQueryForm: GetCommissionDetailDetail

  async function onSubmit(queryForm: GetCommissionDetailDetail) {
    queryForm.event_id = Number(route.params.event_id as string)
    queryForm.entry_id = Number(route.params.entry_id as string)
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "member_name",
        label: t("query_params.member_account"),
        field: "member_name",
        sortable: false,
        align: "center"
      },
      {
        name: "currency_id",
        label: t("query_params.currency"),
        field: "currency_id",
        sortable: false,
        align: "center"
      },
      {
        name: "valid_bet",
        label: t("table_header.validate_bet"),
        field: "valid_bet",
        sortable: false,
        align: "center"
      },
      {
        name: "profit",
        label: t("table_header.winlose"),
        field: "profit",
        sortable: false,
        align: "center"
      },
      /*{
        name: "rebate_rate",
        label: t("table_header.ratio"),
        field: "rebate_rate",
        sortable: false,
        align: "center"
      },*/
      {
        name: "amount",
        label: t("table_header.commission_amount"),
        field: "amount",
        sortable: false,
        align: "center"
      },
      {
        name: "tier",
        label: t("table_header.rebate_levels"),
        field: "tier",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  function onBackTo() {
    const { start, end, id } = route.query
    router.push({
      name: "ReferralCommissionDetail",
      params: {
        id: id
      },
      query: {
        start,
        end
      }
    })
  }
</script>

<style scoped>
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

  ::v-deep(.custom-hide) {
    display: none;
  }
  .m-12-t {
    margin-top: -1rem;
  }
</style>
