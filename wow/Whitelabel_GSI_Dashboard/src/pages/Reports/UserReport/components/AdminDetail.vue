<template>
  <SubPage :action-label-i18n-key="reportTime" :custom-back-func="onBackTo" class="q-mt-xl" />
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
              <q-td key="master_id" :props="props">
                {{ props.row.master_id }}
              </q-td>
              <q-td key="master_code" :props="props">
                {{ props.row.master_code }}
              </q-td>
              <q-td key="view_count" :props="props">
                {{ props.row.view_count }}
              </q-td>
              <q-td key="register_count" :props="props">
                {{ props.row.register_count }}
              </q-td>
              <q-td key="login_count" :props="props">
                {{ props.row.login_count }}
              </q-td>
              <q-td key="pc_login_count" :props="props">
                {{ props.row.pc_login_count }}
              </q-td>
              <q-td key="android_login_count" :props="props">
                {{ props.row.android_login_count }}
              </q-td>
              <q-td key="ios_login_count" :props="props">
                {{ props.row.ios_login_count }}
              </q-td>
              <q-td key="h5_login_count" :props="props">
                {{ props.row.h5_login_count }}
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
              :total-data="tableTotal"
              :sub-total-data="tableSubTotal"
            />
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps } from "quasar"
  import { computed, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"
  import { getUserReportAdminList, getGeneralAgentCashReportAgentExport } from "@/api/report"
  import type { GetUserReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useSearch } from "@/hook/useSearch"
  import SubPage from "layouts/SubPage/Index.vue"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    // 目前沒有功能暫時隱藏
    // useExport: Boolean(route.query.export)
    useExport: false
  })
  const { search, tableData, totalSize, tableTotal, tableSubTotal, isSuccess } = useSearch(getUserReportAdminList)

  const reportTime = computed(() => route.params.date as string)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "master_id",
      label: t("table_header.master_agent_ID"),
      field: "master_id",
      sortable: false,
      align: "center"
    },
    {
      name: "master_code",
      label: t("table_header.master_agent_name"),
      field: "master_code",
      sortable: false,
      align: "center"
    },
    {
      name: "view_count",
      label: t("table_header.browse_quantity"),
      field: "view_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "view_count",
      totalColumn: "view_count"
    },
    {
      name: "register_count",
      label: t("table_header.register_quantity"),
      field: "register_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "register_count",
      totalColumn: "register_count"
    },
    {
      name: "login_count",
      label: t("table_header.login_quantity"),
      field: "login_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "login_count",
      totalColumn: "login_count"
    },
    {
      name: "pc_login_count",
      label: t("table_header.pc_login"),
      field: "pc_login_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "pc_login_count",
      totalColumn: "pc_login_count"
    },
    {
      name: "android_login_count",
      label: t("table_header.android_login"),
      field: "android_login_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "android_login_count",
      totalColumn: "android_login_count"
    },
    {
      name: "ios_login_count",
      label: t("table_header.ios_login"),
      field: "ios_login_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "ios_login_count",
      totalColumn: "ios_login_count"
    },
    {
      name: "h5_login_count",
      label: t("table_header.h5_login"),
      field: "h5_login_count",
      sortable: false,
      align: "center",
      useSubTotalColumn: true,
      subTotalColumn: "h5_login_count",
      totalColumn: "h5_login_count"
    }
  ])

  async function onSubmit(queryForm: GetUserReportList) {
    const params = route.params
    const payload = { ...queryForm, ...params }
    await search(payload)
  }

  // 匯出
  const onExport = async (params: GetUserReportList) => {
    try {
      // const response = getGeneralAgentCashReportAgentExport(params)
      // const url = window.URL.createObjectURL(response as any)
      // const link = document.createElement("a")
      // link.href = url
      // link.download = "export_user_report.xlsx"
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
      console.log("Export !!")
    } catch (error) {
      console.error("Export request error:", error)
    }
  }
  function onBackTo() {
    const { start, end, export: isExport } = route.query
    router.push({
      name: "UserReportList",
      query: {
        start,
        end,
        export: isExport
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
  ::v-deep(.q-table__sort-icon) {
    opacity: 1;
  }
  ::v-deep(.custom-hide) {
    display: none;
  }
</style>
