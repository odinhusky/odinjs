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
              <q-td key="agent_code" :props="props"> {{ props.row.agent_code }}</q-td>
              <q-td key="display_name" :props="props">
                <q-btn flat fab-mini color="blue" @click="onAction(props.row)">
                  {{ props.row.display_name }}
                </q-btn>
              </q-td>
              <q-td key="title" :props="props">
                {{ props.row.title }}
              </q-td>
              <q-td key="contact" :props="props">
                {{ props.row.contact }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ props.row.created_at }}
              </q-td>
              <!-- <q-td key="frontend_URL" :props="props">
                <q-btn flat fab-mini color="blue">
                  {{ props.row.frontend_URL }}
                </q-btn>
              </q-td> -->
              <q-td key="is_running" :props="props">
                <q-toggle
                  v-model="props.row.is_running"
                  color="green"
                  @click="updateSiteOperation(props.row)"
                  :disable="!permission.edit"
                />
              </q-td>
              <q-td key="enabled" :props="props">
                <q-toggle
                  v-model="props.row.enabled"
                  color="green"
                  @click="updateStatus(props.row)"
                  :disable="!permission.edit"
                />
              </q-td>

              <q-td key="is_ban" :props="props">
                <q-btn v-if="props.row.is_ban === true" color="primary" :label="$t('common.frozen')" size="12px" />
                <q-btn v-else size="12px" color="grey" glossy :label="$t('common.un_frozen')" />
              </q-td>
              <!-- 佔成 -->
              <q-td key="commission_setting" :props="props" v-if="permission.edit">
                <q-btn flat fab-mini color="main-color" @click="onCommissionSetting(props.row)">
                  {{ $t("btn.settings") }}
                </q-btn>
              </q-td>
              <!-- 編輯 -->
              <q-td key="actions" :props="props" v-if="permission.edit">
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
  import { QTableProps, useQuasar } from "quasar"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useRouter } from "vue-router"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import {
    getAgencyManagementList,
    UpdateAgencyManagementStatue,
    UpdateAgencyManagementSiteOperation
  } from "@/api/agencyManagement"
  import type { GetAgencyManagementList } from "@/api/request.type"
  import type { agencyManagementListItem } from "@/api/response.type"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()

  const { t } = useI18n()
  const router = useRouter()
  const $q = useQuasar()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useAgent: true,
    useSiteOperationType: true,
    useEnableStatus: true,
    useAccountStatus: true,
    useAgentName: true,
    usePhone: true,
    useEmail: true
  })

  let { search, tableData, totalSize } = useSearch(getAgencyManagementList)
  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetAgencyManagementList) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "agent_code",
        label: t("table_header.agent_ID"),
        field: "agent_code",
        sortable: false,
        align: "center"
      },
      {
        name: "display_name",
        label: t("table_header.agent_account"),
        field: "display_name",
        sortable: false,
        align: "center"
      },
      {
        name: "title",
        label: t("table_header.agent_name"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "contact",
        label: t("common.contact_person"),
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
      // {
      //   name: "frontend_URL",
      //   label: t("table_header.frontend_URL"),
      //   field: "frontend_URL",
      //   sortable: false,
      //   align: "center"
      // },
      {
        name: "is_running",
        label: t("table_header.site_operation"),
        field: "is_running",
        sortable: false,
        align: "center"
      },
      {
        name: "enabled",
        label: t("table_header.enable_or_disable"),
        field: "enabled",
        sortable: false,
        align: "center"
      },
      {
        name: "is_ban",
        label: t("table_header.account_status"),
        field: "is_ban",
        sortable: false,
        align: "center"
      },
      {
        name: "commission_setting",
        label: t("menu.commission_rate_setting"),
        field: "commission_setting",
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

  function onAdd() {
    router.push({
      name: "AgencyOperationManagementListAdd"
    })
  }

  const onAction = (row: agencyManagementListItem) => {
    router.push({
      name: "AgencyOperationManagementListEdit",
      params: {
        id: row.id
      }
    })
  }
  /*更新狀態*/
  const updateStatus = async (row: agencyManagementListItem) => {
    let sendData = {
      id: row.id,
      enabled: row.enabled
    }
    const res = await UpdateAgencyManagementStatue(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }
  /*更新站點*/
  const updateSiteOperation = async (row: agencyManagementListItem) => {
    let sendData = {
      id: row.id,
      is_running: row.is_running
    }
    const res = await UpdateAgencyManagementSiteOperation(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  /*佔成*/
  const onCommissionSetting = (row: agencyManagementListItem) => {
    router.push({
      name: "AgencyOperationManagementCommissionEdit",
      params: {
        id: row.id
      }
    })
  }
</script>
