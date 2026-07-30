<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end">
          <q-btn v-if="permission.export" class="btns q-ml-xs btn-export" @click="() => onExport(catchQueryForm)">
            <q-icon size="xs" name="archive" />
            {{ $t("btn.export") }}
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
                <q-td key="date" :props="props">
                  {{ genTimeFormat(props.row.date, "yyyy-MM-dd", false) }}
                </q-td>
                <q-td key="view_count" :props="props">
                  {{ props.row.view_count }}
                </q-td>
                <q-td key="register_count" :props="props">
                  <div :class="isAgentMode ? 'text-blue cursor-pointer' : ''" @click="goMember(props.row)">
                    {{ props.row.register_count }}
                  </div>
                </q-td>
                <q-td key="register_from_google_count" :props="props">
                  {{ props.row.register_from_google_count }}
                </q-td>
                <q-td key="register_from_telegram_count" :props="props">
                  {{ props.row.register_from_telegram_count }}
                </q-td>
                <q-td key="login_count" :props="props">
                  {{ props.row.login_count }}
                </q-td>
                <q-td key="login_from_google_count" :props="props">
                  {{ props.row.login_from_google_count }}
                </q-td>
                <q-td key="login_from_telegram_count" :props="props">
                  {{ props.row.login_from_telegram_count }}
                </q-td>
                <q-td key="active_player_count" :props="props">
                  {{ props.row.active_player_count }}
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
        </div>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { CustomQTableProps, Notify } from "quasar"
  import { computed, reactive } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { startOfDay, endOfDay, addHours, addMinutes } from "date-fns"
  import { getUserReportList, getUserReportExport } from "@/api/report"
  import type { GetUserReportList } from "@/api/request.type"
  import type { userReportItemDetail } from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useQueryStore } from "@/stores/queryStore"
  import { useEnv } from "src/hook/useEnv"
  import { usePermission } from "@/hook/usePermission"
  import { useTimeZoneStore } from "@/stores/timezoneStore"
  import { useExport } from "@/hook/useExport"

  const { permission } = usePermission()
  const timezoneStore = useTimeZoneStore()

  const { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true
    }
    // 區分環境
    if (isGeneralAgentMode) {
      baseConfig.useAgentAccount = true
    }
    if (isAdminMode) {
      baseConfig.useAdminAgentAccount = true
    }
    baseConfig.useDatePicker = true
    return baseConfig
  })

  let { search, tableData, totalSize, tableTotal, tableSubTotal } = useSearch(getUserReportList)

  const { genTimeFormat, genStartByDay, convertToTimestamp } = useCommon()
  let catchQueryForm: GetUserReportList
  async function onSubmit(queryForm: GetUserReportList) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    if (isAdminMode || isGeneralAgentMode) {
      return [
        {
          name: "date",
          label: t("table_header.date"),
          field: "date",
          sortable: false,
          align: "center",
          useSubTotalColumn: false
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
          label: t("table_header.account_register_quantity"),
          field: "register_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "register_count",
          totalColumn: "register_count"
        },
        {
          name: "register_from_google_count",
          label: t("table_header.google_register_quantity"),
          field: "register_from_google_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "register_from_google_count",
          totalColumn: "register_from_google_count"
        },
        {
          name: "register_from_telegram_count",
          label: t("table_header.telegram_register_quantity"),
          field: "register_from_telegram_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "register_from_telegram_count",
          totalColumn: "register_from_telegram_count"
        },
        {
          name: "login_count",
          label: t("table_header.account_login_quantity"),
          field: "login_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "login_count",
          totalColumn: "login_count"
        },
        {
          name: "login_from_google_count",
          label: t("table_header.google_login_quantity"),
          field: "login_from_google_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "login_from_google_count",
          totalColumn: "login_from_google_count"
        },
        {
          name: "login_from_telegram_count",
          label: t("table_header.telegram_login_quantity"),
          field: "login_from_telegram_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "login_from_telegram_count",
          totalColumn: "login_from_telegram_count"
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
          name: "h5_login_count",
          label: t("table_header.h5_login"),
          field: "h5_login_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "h5_login_count",
          totalColumn: "h5_login_count"
        }
      ]
    }
    if (isAgentMode) {
      return [
        {
          name: "date",
          label: t("table_header.date"),
          field: "date",
          sortable: false,
          useSubTotalColumn: false,
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
          label: t("table_header.account_register_quantity"),
          field: "register_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "register_count",
          totalColumn: "register_count"
        },
        {
          name: "register_from_google_count",
          label: t("table_header.google_register_quantity"),
          field: "register_from_google_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "register_from_google_count",
          totalColumn: "register_from_google_count"
        },
        {
          name: "register_from_telegram_count",
          label: t("table_header.telegram_register_quantity"),
          field: "register_from_telegram_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "register_from_telegram_count",
          totalColumn: "register_from_telegram_count"
        },
        {
          name: "login_count",
          label: t("table_header.account_login_quantity"),
          field: "login_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "login_count",
          totalColumn: "login_count"
        },
        {
          name: "login_from_google_count",
          label: t("table_header.google_login_quantity"),
          field: "login_from_google_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "login_from_google_count",
          totalColumn: "login_from_google_count"
        },
        {
          name: "login_from_telegram_count",
          label: t("table_header.telegram_login_quantity"),
          field: "login_from_telegram_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "login_from_telegram_count",
          totalColumn: "login_from_telegram_count"
        },
        {
          name: "active_player_count",
          label: t("table_header.active_people"),
          field: "active_player_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "active_player_count",
          totalColumn: "active_player_count"
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
          name: "h5_login_count",
          label: t("table_header.h5_login"),
          field: "h5_login_count",
          sortable: false,
          align: "center",
          useSubTotalColumn: true,
          subTotalColumn: "h5_login_count",
          totalColumn: "h5_login_count"
        }
      ]
    }
  })

  const goDetail = async (item: userReportItemDetail) => {
    const { start, end } = route.query
    router.push({
      name: "UserReportDetail",
      params: {
        date: item.date
      },
      query: {
        start,
        end,
        export: permission.value.export === true ? "true" : "false"
      }
    })
  }

  // 匯出

  const { getExportPath } = useExport()
  const onExport = async (params: GetUserReportList) => {
    const { search, status, tableData } = useSearch(getUserReportExport)
    await search(params)
    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }
  }
  const goMember = async (item: userReportItemDetail) => {
    if (!isAgentMode) return

    // 跳轉會員列表時只需要date，故start、end都使用endOfDay即可
    const startDate = endOfDay(`${item.date}`)
    const endDate = endOfDay(`${item.date}`)

    const startTimestamp = timezoneStore.isClientTimezone
      ? startDate.getTime()
      : addMinutes(startDate, -new Date().getTimezoneOffset()).getTime()
    const endTimestamp = timezoneStore.isClientTimezone
      ? endDate.getTime()
      : addMinutes(endDate, -new Date().getTimezoneOffset()).getTime()

    router.push({
      name: "MemberList",
      query: {
        start: startTimestamp,
        end: endTimestamp
      }
    })
  }
</script>

<style lang="scss" scoped>
  :deep(.table-total) {
    &.q-tr {
      background-color: #fff9e8 !important;
    }
  }
</style>
