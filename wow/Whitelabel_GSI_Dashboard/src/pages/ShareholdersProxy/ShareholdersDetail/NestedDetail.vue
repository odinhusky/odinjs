<template>
  <SubPage :action-label-i18n-key="'common.detail'" class="q-pt-xs" :custom-back-func="onBackTo" />
  <div class="q-pa-md q-pt-none">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start q-gutter-xs" v-if="permission.export">
          <q-space />
          <q-btn @click="onExport" class="q-ml-md btns btn-export">
            <q-icon class="q-mr-xs" size="xs" name="archive" />
            {{ $t("btn.export") }}
          </q-btn>
        </div>
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

              <!-- 有效投注 -->
              <q-td key="valid_bet" :props="props">
                {{ moneyFormat(props.row.valid_bet) }}
              </q-td>

              <!-- 佣金 -->
              <q-td key="commission" :props="props">
                {{ moneyFormat(props.row.commission) }}
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
  import { getShareholdersNestedDetail, shareholdersNestedDetailExport } from "@/api/shareholdersSetting"
  import type { GetShareholderNested } from "@/api/request.type"
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

  let { search, tableData, totalSize } = useSearch(getShareholdersNestedDetail)
  const { genTimeFormat, moneyFormat } = useCommon()

  let catchQueryForm: GetShareholderNested

  async function onSubmit(queryForm: GetShareholderNested) {
    queryForm.event_id = Number(route.params.event_id as string)
    queryForm.entry_id = Number(route.params.entry_id as string)
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
        name: "valid_bet",
        label: t("table_header.validate_bet"),
        field: "valid_bet",
        sortable: false,
        align: "center"
      },

      {
        name: "commission",
        label: t("table_header.commission_amount"),
        field: "commission",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  function onBackTo() {
    const { start, end, currency, rate_base, status, version } = route.query
    router.push({
      name: "ShareholdersDetail",
      params: {
        id: route.params.event_id as string
      },
      query: {
        currency,
        rate_base,
        status,
        version,
        start,
        end
      }
    })
  }

  // 匯出
  const { getExportPath } = useExport()
  const onExport = async () => {
    const { search, status, tableData } = useSearch(shareholdersNestedDetailExport)
    await search(catchQueryForm)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
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
