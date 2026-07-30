<template>
  <SubPage :action-label-i18n-key="'common.detail'" class="q-mt-xl" :custom-back-func="onBackTo" />
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
              <!-- 会员账号 -->
              <q-td key="member_account" :props="props">
                {{ props.row.member_account }}
              </q-td>

              <!-- 币别 -->
              <q-td key="currency_id" :props="props">
                {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums]) }}
              </q-td>
              <!-- 註冊時間 -->
              <q-td key="registered_at" :props="props">
                {{ genTimeFormat(props.row.registered_at) }}
              </q-td>
              <!-- 存款金額 -->
              <q-td key="total_deposit" :props="props">
                {{ moneyFormat(props.row.total_deposit) }}
              </q-td>
              <!-- 有效投注 -->
              <q-td key="valid_bet" :props="props">
                {{ moneyFormat(props.row.valid_bet) }}
              </q-td>
            </q-tr>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar, Notify } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { CURRENCY_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useExport } from "@/hook/useExport"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getInvitationBounsNestedDetail } from "@/api/invitationBouns"
  import type * as Request from "@/api/request.type"
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

  let { search, tableData, totalSize } = useSearch(getInvitationBounsNestedDetail)
  const { genTimeFormat, moneyFormat } = useCommon()

  let catchQueryForm: Request.GetInvitationBonusDetail

  async function onSubmit(queryForm: Request.GetInvitationBonusDetail) {
    queryForm.campaign_id = Number(route.params.campaign_id)
    queryForm.parent_id = Number(route.params.parent_id)
    queryForm.active_member_count = Number(route.params.active_member_count)
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "member_account",
        label: t("query_params.member_account"),
        field: "member_account",
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
        name: "registered_at",
        label: t("table_header.registration_time"),
        field: "registered_at",
        sortable: false,
        align: "center"
      },
      {
        name: "total_deposit",
        label: t("table_header.deposit_amount"),
        field: "total_deposit",
        sortable: false,
        align: "center"
      },
      {
        name: "valid_bet",
        label: t("table_header.validate_bet"),
        field: "valid_bet",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  function onBackTo() {
    const { start, end, event_id } = route.query
    router.push({
      name: "InvitationBonusDetail",
      params: {
        campaign_id: Number(route.params.campaign_id),
        event_id: Number(event_id)
      },
      query: {
        start,
        end
      }
    })
  }
</script>

<style scoped>
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
