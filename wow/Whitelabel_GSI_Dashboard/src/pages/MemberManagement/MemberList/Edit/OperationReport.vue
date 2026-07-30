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
              <q-td key="project" :props="props">
                {{ props.row.project }}
              </q-td>
              <q-td key="motion" :props="props">
                {{ props.row.motion }}
              </q-td>
              <q-td key="content" :props="props">
                {{ props.row.content }}
              </q-td>

              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
              </q-td>
              <q-td key="ip" :props="props">
                {{ props.row.ip }}
              </q-td>
              <q-td key="device" :props="props">
                {{ props.row.device }}
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
  import { useRouter } from "vue-router"
  import { CustomQTableProps, QTableProps } from "quasar"
  import { reactive, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"

  import { getMemberOperationReportList } from "@/api/member"
  import type { GetMemberOperationReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  const { t } = useI18n()
  const router = useRouter()
  const isLoading = ref(false)
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    /*useCurrency: true,
    useBetNumber: true,*/
    useDatePicker: true
    //useDateType: true
  })

  const { search, tableData, totalSize, tableTotal } = useSearch(getMemberOperationReportList)
  console.log(tableTotal, "tableTotal")

  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetMemberOperationReportList) {
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "project",
      label: t("table_header.project"),
      field: "project",
      sortable: false,
      align: "center"
    },
    {
      name: "motion",
      label: t("table_header.motion"),
      field: "motion",
      sortable: false,
      align: "center"
    },
    {
      name: "content",
      label: t("table_header.content"),
      field: "content",
      sortable: false,
      align: "center"
    },
    {
      name: "created_at",
      label: t("table_header.time"),
      field: "created_at",
      sortable: false,
      align: "center"
    },
    {
      name: "ip",
      label: "IP",
      field: "ip",
      sortable: false,
      align: "center"
    },
    {
      name: "device",
      label: t("table_header.device"),
      field: "device",
      sortable: false,
      align: "center"
    }
  ])
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }
</style>
