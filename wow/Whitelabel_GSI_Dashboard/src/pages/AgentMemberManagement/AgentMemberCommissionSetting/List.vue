<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start" v-if="permission.edit">
          <q-btn class="btns btn-blue" color="main-color" @click="onAdd">
            <q-icon class="q-mr-xs" size="xs" name="add" />
            {{ $t("btn.add") }}
          </q-btn>
        </div>

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
                <!--傭金名稱-->
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <!--會員數量-->
                <q-td key="zero_level_count" :props="props">
                  {{ props.row.zero_level_count }}
                </q-td>

                <!--結算週期-->
                <q-td key="billing_type" :props="props">
                  <span v-if="props.row.billing_type === 'daily'">{{ $t("settlement_cycle.daily") }}</span>
                  <span v-else-if="props.row.billing_type === 'monthly'">{{ $t("settlement_cycle.monthly") }}</span>
                  <span v-else>{{ $t("settlement_cycle.weekly") }}</span>
                </q-td>
                <q-td key="calculation_type" :props="props">
                  {{ getCalculationTypeLabel(props.row.calculation_type) }}
                </q-td>
                <!-- 啟/停用 -->
                <q-td key="enabled" :props="props">
                  <q-toggle
                    v-model="props.row.enabled"
                    class="toggle"
                    color="blue"
                    size="lg"
                    :false-value="false"
                    :true-value="true"
                    :disable="!permission.edit"
                    keep-color
                    @update:model-value="updateEnable(props.row)"
                  />
                </q-td>

                <!-- 獎金類型 -->
                <q-td v-if="walletSwitch" key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>

                <!-- 功能 -->
                <q-td key="actions" :props="props">
                  <q-btn flat fab-mini color="blue" v-if="permission.edit" @click="onAction(props.row)">
                    <q-icon class="q-mr-xs" size="xs" name="edit" />
                  </q-btn>
                  <q-btn flat fab-mini color="blue" v-if="props.row.zero_level_count > 0" @click="onDetail(props.row)">
                    <q-icon class="q-mr-xs" size="xs" name="visibility" />
                  </q-btn>

                  <!--<q-btn flat fab-mini icon="delete" color="grey" @click="onDelete(props.row)">
                  <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.remove") }}</q-tooltip>
                </q-btn>-->
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

  <!-- 刪除彈窗 -->
  <!-- mainContent -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_commission") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import type { QTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"

  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "src/hook/useDialog"
  import { BONUS_WALLET_TYPE } from "@/utils/constants"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { getAgentMemberCommissionSettingList, updateAgentMemberCommissionSetting } from "@/api/agentMemberManagements"
  import type { GetAgentMemberCommissionSetting } from "@/api/request.type"

  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useAgentCommissionStore } from "@/stores/agentCommissionStore"

  import { usePermission } from "@/hook/usePermission"
  import { useWalletBouns } from "@/hook/useWalletBouns"

  const { permission } = usePermission()
  const { walletSwitch } = useWalletBouns()

  const { t } = useI18n()
  const agentCommissioStore = useAgentCommissionStore()

  const $q = useQuasar()
  const router = useRouter()
  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      filterShowOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useCommissionName: true,
      useMemberAccount: true,
      useAgentCommissionCalculationType: true,
      useEnableStatus: true,
      customDateTimeLabelI18nKey: "query_params.date_time_range"
    }

    if (walletSwitch.value) {
      baseConfig.useWalletType = true
    }
    return baseConfig
  })

  let { search, tableData, totalSize } = useSearch(getAgentMemberCommissionSettingList)

  async function onSubmit(queryForm: GetAgentMemberCommissionSetting) {
    console.log(queryForm)
    if (!queryForm.memberAccount) {
      await search(queryForm)
    } else {
      router.push({
        name: "AgentMemberCommissionSettingDetail",
        params: {
          commission_id: queryForm.memberAccount
        },
        query: {
          commission_name: ""
        }
      })
    }
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "name",
      label: t("table_header.commission_name"),
      field: "name",
      sortable: false,
      align: "center"
    },
    {
      name: "zero_level_count",
      label: t("table_header.number_level_0_agents"),
      field: "zero_level_count",
      sortable: false,
      align: "center"
    },

    {
      name: "billing_type",
      label: t("table_header.settle_cycle"),
      field: "billing_type",
      sortable: false,
      align: "center"
    },
    {
      name: "calculation_type",
      label: t("table_header.calculate_type"),
      field: "calculation_type",
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
    ...(walletSwitch.value
      ? [
          {
            name: "wallet_type",
            label: t("table_header.wallet_type"),
            field: "wallet_type",
            sortable: false,
            align: "center" as const
          }
        ]
      : []),
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      sortable: false,
      align: "center"
    }
  ])
  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    loading: deleteLoading,
    openLoading: openDeleteLoading,
    closeLoading: closeDeleteLoading
  } = useDialog()
  const dialogConfigs = reactive<{
    [key: string]: IDialogConfig
  }>({
    delete: {
      dialogLabelI18nKey: "common.delete",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleDelete
    }
  })
  const dialogDataId = ref(0)
  function onDelete(row: GetAgentMemberCommissionSetting) {
    dialogDataId.value = row.id
    openDeleteDialog(row)
  }
  async function handleDelete() {
    $q.notify({
      type: "positive",
      message: t("message.delete_success"),
      position: "top",
      timeout: 300
    })
  }
  function onAction(row: GetAgentMemberCommissionSetting) {
    router.push({
      name: "AgentMemberCommissionSettingEdit",
      params: {
        id: row.id
      }
    })
  }

  async function onAdd() {
    await agentCommissioStore.initCommissionItem()
    router.push({
      name: "AgentMemberCommissionSettingAdd"
    })
  }

  function onDetail(row: { id: number; name: string }) {
    router.push({
      name: "AgentMemberCommissionSettingDetail",
      params: {
        commission_id: row.id
      },
      query: {
        commission_name: row.name
      }
    })
  }

  const updateEnable = async (row: { id: number; enabled: boolean }) => {
    let sendData = {
      id: row.id,
      enabled: row.enabled
    }
    const res = await updateAgentMemberCommissionSetting(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    }
  }

  function getCalculationTypeLabel(calculationType?: number | string | null) {
    const normalizedType = Number(calculationType)
    const mode = normalizedType === 2 ? 2 : 1
    return mode === 2 ? t("table_header.net_gaming_revenue") : t("table_header.winlose")
  }
</script>
