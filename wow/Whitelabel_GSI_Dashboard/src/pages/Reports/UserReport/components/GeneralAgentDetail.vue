<template>
  <SubPage :action-label-i18n-key="reportTime" :custom-back-func="onBackTo" class="q-mt-xl" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn v-if="Boolean(route.query.export)" class="btns q-ml-xs btn-export" @click="() => onExport()">
            <q-icon size="xs" name="archive" />
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
              <q-td key="agent_id" :props="props">
                {{ props.row.agent_id }}
              </q-td>
              <q-td key="agent_code" :props="props">
                {{ props.row.agent_code }}
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
  import { CustomQTableProps, Notify } from "quasar"
  import { computed, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter, useRoute } from "vue-router"
  import { getUserReportGeneralAgentList, getUserReportGeneralAgentExport } from "@/api/report"
  import type { GetUserReportList, GetUserReportGeneralAgentExport } from "@/api/request.type"
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
    usePagination: true
  })

  const { search, tableData, totalSize, tableTotal, tableSubTotal, isSuccess } =
    useSearch(getUserReportGeneralAgentList)

  const reportTime = computed(() => route.params.date as string)

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "agent_id",
      label: t("table_header.agent_ID"),
      field: "agent_id",
      sortable: false,
      align: "center"
    },
    {
      name: "agent_code",
      label: t("table_header.agent_name"),
      field: "agent_code",
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
  const onExport = async () => {
    const payload: GetUserReportGeneralAgentExport = {
      date: route.params.date as string
    }
    const { search } = useSearch(getUserReportGeneralAgentExport)
    await search(payload)
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
