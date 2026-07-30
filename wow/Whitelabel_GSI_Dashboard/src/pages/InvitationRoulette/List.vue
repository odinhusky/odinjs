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
            table-header-class="bg-success"
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <q-td key="start_time" :props="props">
                  {{ genTimeFormat(props.row.start_time, "yyyy-MM-dd HH:mm:ss") }} ~
                  {{ genTimeFormat(props.row.end_time, "yyyy-MM-dd HH:mm:ss") }}
                </q-td>
                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="download"
                    :loading="exportLoading"
                    @click="onExport(props.row.id)"
                  />
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
  import { reactive, computed, onMounted, ref } from "vue"
  import { CustomQTableProps, useQuasar, Notify } from "quasar"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useEnv } from "@/hook/useEnv"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { getReferralWheel, exportReferralWheel } from "@/api/referralWheel"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"

  import { useExport } from "@/hook/useExport"
  import { usePermission } from "@/hook/usePermission"
  import { useSearch } from "@/hook/useSearch"
  const { genTimeFormat } = useCommon()

  const { permission } = usePermission()

  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useDatePickerSingle: true,
      useTimePicker: true
    }

    return baseConfig
  })

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    return [
      {
        name: "start_time",
        label: t("query_params.event_time"),
        field: "start_time",
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
  })

  const tableData = ref<Response.GetReferralWheel[]>([])
  const totalSize = ref(1)

  const onSubmit = async (queryForm: any) => {
    console.log(queryForm)
    tableData.value.length = 0
    totalSize.value = 0
    const res = await getReferralWheel(queryForm)
    if (res.data) {
      tableData.value.push(res.data)
      totalSize.value = 1
    }
  }
  // 匯出
  const { getExportPath } = useExport()
  const exportLoading = ref(false)
  const onExport = async (id: number) => {
    exportLoading.value = true
    const { search, status, tableData } = useSearch(exportReferralWheel)
    await search(id)

    if (status.value) {
      getExportPath(tableData.value.export_uuid)
    }

    exportLoading.value = false
  }
</script>
