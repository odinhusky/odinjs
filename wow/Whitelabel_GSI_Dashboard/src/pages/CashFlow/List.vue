<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div v-if="isAgentMode && permission.edit" class="row q-mb-md justify-start">
          <q-btn class="btns btn-blue" color="main-color" @click="onAdd">
            <q-icon class="q-mr-xs" size="xs" name="add" />
            {{ $t("btn.add") }}
          </q-btn>
        </div>
        <CashFlowTableAgent
          v-if="isAgentMode"
          :tableData="tableData"
          :catchQueryForm="catchQueryForm"
          @update:gateway-statue="updateAgentGatewayStatus"
          @re-search="onSubmit"
        />
        <CashFlowTableAdminMaster
          v-else
          :tableData="tableData"
          @update:gateway-statue="updateGatewayStatus"
          @open-dialog="onDialogOpen"
        />
      </template>
    </query>
  </div>
  <!-- 彈窗 -->
  <dialog-comp
    v-model="gatewayAgentDialog"
    :configs="dialogConfigs.list"
    :loading="gatewayAgentLoading"
    @hide="onDialogClose"
  >
    <template #mainContent>
      <q-table
        square
        hide-pagination
        :rows-per-page-options="[0]"
        :rows="showAgentList"
        :columns="agentTableColumn"
        row-key="id"
        table-header-class="bg-success"
      >
        <template #body="props">
          <q-tr>
            <!-- NO. -->
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>
            <q-td key="agent_code" :props="props">
              {{ props.row.agent_code }}
            </q-td>
            <q-td key="title" :props="props">
              {{ props.row.title }}
            </q-td>
            <q-td key="display_name" :props="props">
              {{ props.row.display_name }}
            </q-td>
            <q-td key="contact" :props="props">
              {{ props.row.contact }}
            </q-td>
          </q-tr>
        </template>

        <!-- 查無資料 -->
        <template #no-data>
          <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
        </template>
      </q-table>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted, ref } from "vue"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useCashFlowStore } from "@/stores/cashflowStore"
  import { useEnv } from "@/hook/useEnv"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import CashFlowTableAdminMaster from "./components/CashFlowTableAdminMaster.vue"
  import CashFlowTableAgent from "./components/CashFlowTableAgent.vue"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { getAdminAgentList, getGeneralAgentList } from "@/api/common"
  import { getGatewayList, setGatewayInfo, getGatewayDetail, setAgentGatewayInfo } from "@/api/paymentGateway"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"

  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()

  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()
  const cashFlowStore = useCashFlowStore()

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      usePayerName: true,
      useFundMethod: true,
      useCurrency: true,
      useService: true
    }
    if (isAdminMode) {
      baseConfig.useAdminAgentAccount = true
    }
    if (isGeneralAgentMode) {
      baseConfig.useAgentAccount = true
    }
    baseConfig.useEnableStatus = true

    return baseConfig
  })

  const tableHeaderAgentTitle = computed(() => {
    if (isAdminMode) {
      return t("table_header.activate_master_agent")
    }
    if (isGeneralAgentMode) {
      return t("common.open_proxy")
    }
    return ""
  })

  const agentTableColumn = computed<CustomQTableProps["columns"]>(() => {
    const headerAgentCode = isAdminMode ? t("table_header.master_agent_ID") : t("table_header.agent_ID")
    const headerDisplayName = isAdminMode ? t("table_header.master_agent_account") : t("table_header.agent_account")
    const headerTitle = isAdminMode ? t("table_header.master_agent_name") : t("table_header.agent_name")
    return [
      {
        name: "id",
        label: t("table_header.id"),
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "agent_code",
        label: headerAgentCode,
        field: "agent_code",
        sortable: false,
        align: "center"
      },
      {
        name: "display_name",
        label: headerDisplayName,
        field: "display_name",
        sortable: false,
        align: "center"
      },
      {
        name: "title",
        label: headerTitle,
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
      }
    ]
  })

  const agentList = ref<Response.GetAdminAgentList>([])
  const showAgentList = ref<Response.GetAdminAgentList>([])

  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    list: {
      dialogLabelI18nKey: tableHeaderAgentTitle.value,
      showLabelCloseBtn: true,
      type: DialogType.VIEW
    }
  })

  const { dialog: gatewayAgentDialog, openDialog: openGatewayAgentDialog, loading: gatewayAgentLoading } = useDialog()

  let { search, tableData, totalSize } = useSearch(getGatewayList)

  let catchQueryForm: Request.GetGatewayList
  const onSubmit = async (queryForm: Request.GetGatewayList) => {
    catchQueryForm = queryForm
    console.log("queryForm", queryForm)
    await search(queryForm)
  }

  const updateGatewayStatus = async (enable: boolean, id: number) => {
    const payload: Request.SetGatewayInfo = {
      id,
      enable
    }
    $q.loading.show()
    try {
      const { search, status } = useSearch(setGatewayInfo)
      await search(payload)
      if (status.value) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
        console.log("d")
        onSubmit(catchQueryForm)
      }
    } catch (error) {
      $q.loading.hide()
    }
    $q.loading.hide()
  }
  const updateAgentGatewayStatus = async (display: boolean, id: number) => {
    const payload: Request.SetAgentGatewayInfo = {
      id,
      display
    }
    $q.loading.show()
    try {
      const { search, status } = useSearch(setAgentGatewayInfo)
      await search(payload)
      if (status.value) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
        onSubmit(catchQueryForm)
      }
    } catch (error) {
      $q.loading.hide()
    }
    $q.loading.hide()
  }

  const onAdd = () => {
    cashFlowStore.initGatewayItem()
    router.push({
      name: "CashFlowListAdd"
    })
  }

  const onDialogOpen = async (item: Response.GatewayItem) => {
    if (isAdminMode && item.master_count <= 0) {
      return
    }
    if (isGeneralAgentMode && item.agent_count <= 0) {
      return
    }
    $q.loading.show()
    try {
      const payload: Request.GetGatewayDetail = {
        id: item.id
      }
      const { code, data } = await getGatewayDetail(payload)
      console.log("getGatewayDetail", data)
      if (code === 0) {
        const { master_ids, agent_ids } = data
        let ids: number[] = []
        if (isAdminMode) {
          ids = master_ids
        }
        if (isGeneralAgentMode) {
          ids = agent_ids
        }
        showAgentList.value = agentList.value.filter((e) => ids.includes(e.id as number))
        showAgentList.value.length > 0 && openGatewayAgentDialog(item)
      }
    } catch (error) {
      $q.loading.hide()
    }
    $q.loading.hide()
  }

  const onDialogClose = () => {
    showAgentList.value = []
  }

  const getAgentList = async () => {
    const getListApi = isAdminMode ? getAdminAgentList : getGeneralAgentList
    const { code, data } = await getListApi()
    if (code === 0) {
      agentList.value = data.list
    }
  }

  onMounted(() => {
    if (!isAgentMode) {
      getAgentList()
    }
  })
</script>
