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
              <q-td key="master_agent_name" :props="props">
                {{ props.row.master_agent_name }}
              </q-td>
              <q-td key="agent_account" :props="props">
                {{ props.row.agent_account }}
              </q-td>
              <q-td key="agent_name" :props="props">
                {{ props.row.agent_name }}
              </q-td>
              <q-td key="website_name" :props="props">
                {{ props.row.website_name }}
              </q-td>
              <q-td key="frontend_URL" :props="props">
                <q-btn flat fab-mini color="blue">
                  {{ props.row.frontend_URL }}
                </q-btn>
              </q-td>
              <q-td key="frontend_active_disable" :props="props">
                <q-toggle v-model="props.row.frontend_active_disable" color="green" />
              </q-td>
              <q-td key="bo_active_disable" :props="props">
                <q-toggle v-model="props.row.bo_active_disable" color="green" />
              </q-td>
              <q-td key="action" :props="props">
                <div
                  class="q-gutter-sm transition-button"
                  @mouseover="hoverStates[props.row.id] = true"
                  @mouseleave="hoverStates[props.row.id] = false"
                >
                  <q-btn v-if="hoverStates[props.row.id]" color="green">
                    {{ $t("table_header.access_agent_site") }}
                  </q-btn>
                  <q-btn v-else color="green" icon="forward" />
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"

  import { SORT_BY } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getAgencyOperationsManagement } from "@/api/agencyOperationsManagement"
  import type { GetAgencyOperationsManagementList } from "@/api/request.type"
  import type { agencyOperationsManagementListItem } from "@/api/response.type"

  const { t } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,

    useGeneralAgent: true,
    useAgent: true,
    useFrontendStatus: true,
    useAgentStatus: true,
    useKeyword: true
  })

  let { search, tableData, totalSize } = useSearch(getAgencyOperationsManagement)
  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetAgencyOperationsManagementList) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "master_agent_name",
      align: "center",
      label: t("table_header.master_agent_name"),
      field: "master_agent_name",
      sortable: false
    },
    {
      name: "agent_account",
      align: "center",
      label: t("table_header.agent_account"),
      field: "agent_account",
      sortable: false
    },
    { name: "agent_name", align: "center", label: t("table_header.agent_name"), field: "agent_name", sortable: false },
    {
      name: "website_name",
      align: "center",
      label: t("table_header.website_name"),
      field: "website_name",
      sortable: false
    },
    {
      name: "frontend_URL",
      align: "center",
      label: t("table_header.frontend_URL"),
      field: "frontend_URL",
      sortable: false
    },
    {
      name: "frontend_active_disable",
      align: "center",
      label: t("table_header.frontend_active_disable"),
      field: "frontend_active_disable",
      sortable: false
    },
    {
      name: "bo_active_disable",
      align: "center",
      label: t("table_header.bo_active_disable"),
      field: "bo_active_disable",
      sortable: false
    },
    {
      name: "action",
      align: "left",
      label: t("table_header.action"),
      field: "action",
      sortable: false
    }
  ])

  // Then use the interface to define hoverStates
  const hoverStates = ref<{ [key: number]: boolean }>({})

  // Inside the init function or where you fetch the table data
  const initHoverStates = (rows: any[]) => {
    hoverStates.value = rows.reduce((acc: { [x: string]: boolean }, row: { id: string | number }) => {
      acc[row.id] = false
      return acc
    }, {} as { [key: number]: boolean })
  }

  const onAction = (row: agencyOperationsManagementListItem) => {
    console.log(row)
  }

  function onExport() {
    console.log("onExport")
  }
  function onTagSetting() {
    console.log("onTagSetting")
  }
</script>

<style>
  .label {
    margin-right: 1vw;
  }

  .q-card.q-card--bordered.no-shadow {
    background: unset;
    border: unset;
  }

  .date-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .justify-end {
    justify-content: flex-end !important;
  }

  .btn {
    margin: 0px 4px !important;
  }
</style>
