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
              <q-td key="user_account" :props="props">
                <q-btn flat fab-mini color="blue" @click="onAction(props.row)">
                  {{ props.row.user_account }}
                </q-btn>
              </q-td>
              <q-td key="display_name" :props="props">
                {{ props.row.display_name }}
              </q-td>
              <q-td key="created_at" :props="props">
                {{ genTimeFormat(props.row.created_at) }}
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
                <q-toggle
                  v-model="props.row.is_ban"
                  color="green"
                  @click="updateIsband(props.row)"
                  :disable="!permission.edit"
                />
              </q-td>
              <q-td key="external_cdn" :props="props">
                <q-toggle
                  :model-value="props.row.external_cdn"
                  color="green"
                  @update:model-value="(val) => updateExternalCdn(props.row, val)"
                  :disable="!permission.edit"
                />
              </q-td>
              <!-- 佔成 -->
              <q-td key="commission_setting" :props="props" v-if="permission.edit">
                <q-btn flat fab-mini color="main-color" @click="onCommissionSetting(props.row)">
                  {{ $t("btn.settings") }}
                </q-btn>
              </q-td>
              <!-- 站台幣別 -->
              <q-td key="actions" :props="props" v-if="permission.edit">
                <q-btn flat fab-mini icon="attach_money" color="secondary" @click="onCurrencyAction(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                </q-btn>
              </q-td>
              <!-- 編輯 -->
              <q-td key="actions" :props="props" v-if="permission.edit">
                <q-btn flat fab-mini icon="settings" color="secondary" @click="onProductAction(props.row)">
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
  import { reactive, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps, useQuasar } from "quasar"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useRouter } from "vue-router"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import {
    getAgencyManagementList,
    UpdateAgencyManagementStatue,
    UpdateAgencyManagementSiteOperation,
    UpdateAgencyManagementIsBand,
    UpdateAgencyManagementExternalCdn
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
    useAgentId: true,
    useAgentAccountInput: true,
    useAgentName: true,
    //useSiteOperationType: true,
    useEnableStatus: true,
    useAccountStatus: true

    //usePhone: true,
    //useEmail: true
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
        name: "user_account",
        label: t("table_header.agent_account"),
        field: "user_account",
        sortable: false,
        align: "center"
      },
      {
        name: "display_name",
        label: t("table_header.agent_name"),
        field: "display_name",
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
        label: t("table_header.enable_or_disable"),
        field: "enabled",
        sortable: false,
        align: "center"
      },
      {
        name: "is_ban",
        label: t("table_header.freeze"),
        field: "is_ban",
        sortable: false,
        align: "center"
      },
      {
        name: "external_cdn",
        label: t("table_header.external_cdn"),
        field: "external_cdn",
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
        label: t("table_header.platform_currency"),
        field: "actions",
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
      name: "AgencyOperationManagementListAdd_v2"
    })
  }

  const onAction = (row: agencyManagementListItem) => {
    router.push({
      name: "AgencyOperationManagementListEdit_v2",
      params: {
        id: row.id
      }
    })
  }
  const onCurrencyAction = (row: agencyManagementListItem) => {
    router.push({
      name: "AgencyOperationManagementCurrencyEdit",
      params: {
        id: row.id
      }
    })
  }
  const onProductAction = (row: agencyManagementListItem) => {
    router.push({
      name: "AgencyOperationManagementProductEdit",
      params: {
        id: row.id,
        agent_code: row.agent_code
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

  /*更新狀態*/
  const updateIsband = async (row: agencyManagementListItem) => {
    let sendData = {
      id: row.id,
      is_ban: row.is_ban
    }
    const res = await UpdateAgencyManagementIsBand(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  /*更新外部CDN*/
  const updateExternalCdn = async (row: agencyManagementListItem, newValue: boolean) => {
    // 保存原始值（因為使用 :model-value，row.external_cdn 還沒有更新）
    const originalValue = row.external_cdn

    // 更新 row 的值
    row.external_cdn = newValue

    // 如果從 false 切換到 true，需要顯示確認對話框
    if (originalValue === false && newValue === true) {
      const confirmed = await new Promise<boolean>((resolve) => {
        $q.dialog({
          title: t("btn.confirm"),
          message: t("message.external_cdn_confirm_message"),
          cancel: true,
          persistent: true
        })
          .onOk(() => resolve(true))
          .onCancel(() => resolve(false))
      })

      if (!confirmed) {
        // 用戶取消，恢復原值
        row.external_cdn = originalValue
        return
      }
    }

    let sendData = {
      id: row.id,
      external_cdn: row.external_cdn
    }
    const res = await UpdateAgencyManagementExternalCdn(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    } else {
      // 如果更新失敗，恢復原值
      row.external_cdn = originalValue
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
