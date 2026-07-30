<template>
  <div class="q-pa-md">
    <div class="row q-mb-md justify-start">
      <q-btn outline color="main-color" @click="onAdd" v-if="permission.edit">
        {{ $t("btn.add") }}
        <q-icon class="q-ml-xs" size="xs" name="add_circle_outline" />
      </q-btn>
    </div>
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
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>
              <q-td key="agent_code" :props="props" @click="onAction(props.row)">
                <q-btn flat fab-mini color="blue">
                  {{ props.row.agent_code }}
                </q-btn>
              </q-td>
              <q-td key="display_name" :props="props">
                {{ props.row.display_name }}
              </q-td>
              <q-td key="contact" :props="props">
                {{ props.row.contact }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
              </q-td>
              <q-td key="enabled" :props="props">
                <q-toggle v-model="props.row.enabled" color="green" disable />
              </q-td>
              <q-td key="is_ban" :props="props">
                <q-btn v-if="props.row.is_ban" color="primary" :label="t('common.un_frozen')" size="12px" />
                <q-btn v-else size="12px" color="grey" glossy :label="t('common.un_frozen')" />
              </q-td>
              <!-- 編輯 -->
              <q-td key="actions" :props="props" v-if="permission.edit">
                <!-- <q-btn v-if="props.row.is_ban" flat fab-mini color="red">
                  {{ $t("common.unbind") }}
                </q-btn> -->
                <q-btn flat fab-mini icon="settings" color="secondary" @click="onAction(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
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
  import { useRouter } from "vue-router"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import type { GetGeneralAgencyManagementList } from "@/api/request.type"
  import type { generalAgencyManagementListItem } from "@/api/response.type"
  import { getGeneralAgencyManagement } from "@/api/generalAgencyManagement"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const { t } = useI18n()
  const router = useRouter()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useGeneralAgentAccount: true,
    useEnableStatus: true,
    useAccountStatus: true,
    useMasterAgentName: true,
    usePhone: true,
    useEmail: true
  })

  let { search, tableData, totalSize } = useSearch(getGeneralAgencyManagement)
  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetGeneralAgencyManagementList) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "id",
        label: t("table_header.master_agent_ID"),
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "agent_code",
        label: t("table_header.master_agent_account"),
        field: "agent_code",
        sortable: false,
        align: "center"
      },
      {
        name: "display_name",
        label: t("table_header.master_agent_name"),
        field: "display_name",
        sortable: false,
        align: "center"
      },
      {
        name: "contact",
        label: t("table_header.contact"),
        field: "contact",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.created_on"),
        field: "created_at",
        sortable: false,
        align: "center"
      },
      {
        name: "enabled",
        label: t("table_header.active"),
        field: "enabled",
        sortable: false,
        align: "center"
      },
      {
        name: "is_ban",
        label: t("table_header.status"),
        field: "is_ban",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  function onExport() {
    console.log("onExport")
  }
  const onAction = (row: generalAgencyManagementListItem) => {
    router.push({
      name: "GeneralAgencyManagementListEdit",
      params: {
        id: row.id
      }
    })
  }
  const onAdd = () => {
    router.push({
      name: "GeneralAgencyManagementListAdd"
    })
  }
</script>
