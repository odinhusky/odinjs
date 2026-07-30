<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
            <template #body="props">
              <q-tr>
                <!--帳號-->
                <q-td key="Username" :props="props">
                  {{ props.row.Username }}
                </q-td>
                <!--名稱-->
                <q-td key="DisplayName" :props="props">
                  {{ props.row.DisplayName }}
                </q-td>
                <!--頁  -->
                <q-td key="page_id" :props="props">
                  {{ $t(PAGE_LOG.I18nKeys[props.row.page_id as PAGE_LOG.Enums] || "common.unknow") }}
                </q-td>
                <!--紀錄-->
                <q-td key="content" :props="props">
                  {{ props.row.content }}
                </q-td>
                <!--建立時間-->
                <q-td key="created_at" :props="props">
                  {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm") }}
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
  import { reactive, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getUserActionLog } from "@/api/adminAccount"
  import type { GetUserActionLog } from "@/api/request.type"
  import { useEnv } from "src/hook/useEnv"
  import { PAGE_LOG } from "@/utils/constants"

  const { t } = useI18n()

  let { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useUsername: true,
    useName: true,
    usePageLog: true,
    useDatePicker: true,
    useKeyword: true,
    customDateTimeLabelI18nKey: "query_params.modify_time"
  })

  let { search, tableData, totalSize } = useSearch(getUserActionLog)
  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetUserActionLog) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "Username",
      label: t("table_header.account"),
      field: "Username",
      sortable: false,
      align: "center"
    },
    {
      name: "DisplayName",
      label: t("table_header.name"),
      field: "DisplayName",
      sortable: false,
      align: "center"
    },
    {
      name: "page_id",
      label: t("table_header.page"),
      field: "page_id",
      sortable: false,
      align: "center"
    },
    {
      name: "content",
      label: t("table_header.record"),
      field: "content",
      sortable: false,
      align: "center"
    },
    {
      name: "created_at",
      label: t("table_header.modify_time"),
      field: "created_at",
      sortable: false,
      align: "center"
    }
  ])
</script>
