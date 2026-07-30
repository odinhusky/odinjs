<template>
  <div class="table-container">
    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="props.tableData"
      :columns="tableColumn"
      table-header-class="bg-success"
      row-key="id"
      class="!overflow-x-auto"
    >
      <template #body="props">
        <q-tr>
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="type" :props="props">
            <!-- {{ props.row.type }} -->
            {{ $t(FUND_METHOD_TYPE.I18nKeys[props.row.type as FUND_METHOD_TYPE.Enums]) }}
          </q-td>
          <q-td key="currency" :props="props">
            {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency as CURRENCY_TYPE.Enums]) }}
          </q-td>
          <q-td key="service" :props="props">
            {{ $t(transferServiceType(props.row)) }}
          </q-td>
          <q-td key="operational_status" :props="props">
            <span v-if="props.row.operational_status">{{ $t("table_header.active") }}</span>
            <span v-else>{{ $t("table_header.inactive") }}</span>
          </q-td>
          <q-td key="master_count" :props="props">
            <q-btn color="main-color" @click="onDialogOpen(props.row)">
              <span>{{ props.row.master_count }}</span>
            </q-btn>
          </q-td>
          <q-td key="agent_count" :props="props">
            <q-btn color="main-color" @click="onDialogOpen(props.row)">
              <span>{{ props.row.agent_count }}</span>
            </q-btn>
          </q-td>
          <q-td key="enable" :props="props">
            <q-toggle
              v-model="props.row.enable"
              color="green"
              :disable="!permission.edit"
              @update:model-value="updateGatewayStatus($event, props.row.id)"
            />
          </q-td>
          <q-td key="actions" :props="props" v-if="permission.edit">
            <q-btn flat fab-mini color="blue" @click="onEdit(props.row)">
              {{ $t("btn.edit") }}
            </q-btn>
          </q-td>
          <q-td key="remark" :props="props">
            {{ props.row.remark }}
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

<script lang="ts" setup>
  import { computed, defineEmits } from "vue"
  import { CustomQTableProps } from "quasar"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useEnv, ENV_MODE_ENUM } from "@/hook/useEnv"
  import type * as Response from "@/api/response.type"
  import { FUND_METHOD_TYPE, SERVICE_TYPE, CURRENCY_TYPE } from "@/utils/constants"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const props = defineProps({
    tableData: {
      type: Array<Response.GatewayItem>,
      required: true,
      default: () => []
    }
  })
  const emit = defineEmits(["update:gatewayStatue", "openDialog"])

  const router = useRouter()
  const { t } = useI18n()
  const { appMode, isAdminMode, isGeneralAgentMode } = useEnv()

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const column: CustomQTableProps["columns"] = [
      {
        name: "id",
        label: "NO.",
        field: "id",
        sortable: false,
        align: "center"
      },
      {
        name: "name",
        label: t("table_header.payer_name"),
        field: "name",
        sortable: false,
        align: "center"
      },
      {
        name: "type",
        label: t("table_header.fund_method"),
        field: "type",
        sortable: false,
        align: "center"
      },
      {
        name: "currency",
        label: t("common.supported_currencies"),
        field: "currency",
        sortable: false,
        align: "center"
      },
      {
        name: "service",
        label: t("table_header.services"),
        field: "service",
        sortable: false,
        align: "center"
      }
    ]
    let dynamicColumn: CustomQTableProps["columns"] = []
    if (isAdminMode) {
      dynamicColumn = [
        {
          name: "master_count",
          label: t("table_header.activate_master_agent"),
          field: "master_count",
          sortable: false,
          align: "center"
        },
        {
          name: "enable",
          label: t("table_header.active_disabled"),
          field: "enable",
          sortable: false,
          align: "center"
        },
        {
          name: "actions",
          label: t("table_header.action"),
          field: "actions",
          sortable: false,
          align: "center"
        },
        {
          name: "remark",
          label: t("table_header.remark"),
          field: "remark",
          sortable: false,
          align: "center"
        }
      ]
      // 移除 actions 列
      dynamicColumn = permission.value.edit
        ? dynamicColumn
        : dynamicColumn.filter((column) => column.name !== "actions")
    }
    if (isGeneralAgentMode) {
      dynamicColumn = [
        {
          name: "operational_status",
          label: t("table_header.operating_status"),
          field: "operational_status",
          sortable: false,
          align: "center"
        },
        {
          name: "agent_count",
          label: t("common.open_proxy"),
          field: "agent_count",
          sortable: false,
          align: "center"
        },
        {
          name: "enable",
          label: `${t("table_header.agent")}${t("table_header.active_disabled")}`,
          field: "enable",
          sortable: false,
          align: "center"
        },
        {
          name: "actions",
          label: t("table_header.action"),
          field: "actions",
          sortable: false,
          align: "center"
        }
      ]
      // 移除 actions 列
      dynamicColumn = permission.value.edit
        ? dynamicColumn
        : dynamicColumn.filter((column) => column.name !== "actions")
    }
    return column.concat(dynamicColumn)
  })

  const transferServiceType = (item: Response.GatewayItem) => {
    const { deposit, withdraw } = item
    if (deposit && withdraw) {
      return SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.DepositAndWithdrawalFlow]
    }
    if (deposit) {
      return SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.DepositFlow]
    }
    if (withdraw) {
      return SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.WithdrawalFlow]
    }
    return ""
  }

  const updateGatewayStatus = async (enable: boolean, id: number) => {
    emit("update:gatewayStatue", enable, id)
  }

  const onDialogOpen = (item: Response.GatewayItem) => {
    emit("openDialog", item)
  }

  const onEdit = (row: Response.GatewayItem) => {
    router.push({
      name: "CashFlowListEdit",
      params: {
        id: row.id
      }
    })
  }
</script>
