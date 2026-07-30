<template>
  <div class="table-container">
    <q-markup-table square class="!overflow-x-auto">
      <thead class="bg-success">
        <tr>
          <th v-for="item in tableColumn">{{ item.label }}</th>
        </tr>
      </thead>
      <!-- disabled => 讓整行不能拉取 -->
      <VueDraggableNext class="drag-container" :list="tableData" tag="tbody" :disabled="disabledDrag" @end="onDragEnd">
        <tr v-for="item in tableData">
          <td>
            {{ item.id }}
            <!-- TODO: 沒有api, 隱藏功能。事件判斷drag status -->
            <!-- <q-icon
            name="menu"
            class="drag-icon"
            @mouseenter="disabledDrag = false"
            @mouseleave="disabledDrag = true"
            @touchstart="disabledDrag = false"
            @touchend="disabledDrag = true"
          /> -->
          </td>
          <td>{{ item.name }}</td>
          <td>
            {{ $t(FUND_METHOD_TYPE.I18nKeys[item.type as FUND_METHOD_TYPE.Enums]) }}
          </td>
          <td>{{ $t(CURRENCY_TYPE.I18nKeys[item.currency as CURRENCY_TYPE.Enums]) }}</td>
          <td>
            {{ $t(transferServiceType(item)) }}
          </td>
          <!-- <td>
          <span
            v-if="
              [FUND_METHOD_TYPE.Enums.ThirdPartyPayment, FUND_METHOD_TYPE.Enums.CryptoWalletThird].includes(item.type)
            "
          >
            {{ $t(item.operational_status ? "table_header.active" : "table_header.inactive") }}
          </span>
          <span v-else>-</span>
        </td> -->
          <td>
            <q-toggle
              v-model="item.display"
              :disable="!permission.edit"
              color="green"
              @update:model-value="updateGatewayStatus($event, item.id)"
            />
          </td>
          <td v-if="permission.edit">
            <div class="row justify-center">
              <q-btn flat fab-mini color="blue cursor-pointer" @click="onEdit(item)">
                <q-icon name="edit" />
              </q-btn>
              <q-btn flat fab-mini color="red" @click="onDelete(item)">
                <q-icon name="delete" />
              </q-btn>
            </div>
          </td>
        </tr>
      </VueDraggableNext>
      <!-- 查無資料 -->
      <template v-if="!tableData.length">
        <tr>
          <td colspan="8" class="text-center">{{ $t("common.no_data") }}</td>
        </tr>
        <!-- <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div> -->
      </template>
    </q-markup-table>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading" />
</template>

<script lang="ts" setup>
  import { ref, computed, defineEmits, reactive, PropType } from "vue"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useDialog } from "@/hook/useDialog"
  import { deletePaymentGateway } from "@/api/paymentGateway"
  import type * as Response from "@/api/response.type"
  import type * as Request from "@/api/request.type"
  import { FUND_METHOD_TYPE, SERVICE_TYPE, CURRENCY_TYPE } from "@/utils/constants"
  import { VueDraggableNext } from "vue-draggable-next"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { table } from "console"
  import { usePermission } from "@/hook/usePermission"
  import { useSearch } from "@/hook/useSearch"

  const { permission } = usePermission()
  const props = defineProps({
    tableData: {
      type: Array<Response.GatewayItem>,
      required: true,
      default: () => []
    },
    catchQueryForm: {
      type: Object as PropType<Request.GetGatewayList>,
      required: true,
      default: () => ({})
    }
  })
  const emit = defineEmits(["update:gatewayStatue", "reSearch"])

  const $q = useQuasar()
  const router = useRouter()
  const { t } = useI18n()
  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
    loading: deleteLoading,
    openLoading: openDeleteLoading,
    closeLoading: closeDeleteLoading
  } = useDialog()
  const dialogConfigs = reactive<{ delete: IDialogConfig }>({
    delete: {
      dialogLabelI18nKey: "common.sure_to_delete_payment_gateway",
      type: DialogType.CONFIRM,
      useActions: true,
      submitFunction: handleDelete
    }
  })

  const disabledDrag = ref(true)
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
      },
      // {
      //   name: "operational_status",
      //   label: t("table_header.operating_status"),
      //   field: "operational_status",
      //   sortable: false,
      //   align: "center"
      // },
      {
        name: "display",
        label: t("edit_form.front_end_display"),
        field: "display",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.action"),
        field: "actions",
        sortable: false,
        align: "left"
      }
    ]
    return permission.value.edit ? column : column.filter((column) => column.name !== "actions")
  })
  const dialogData = reactive({
    delete: {
      id: 0
    }
  })

  const transferServiceType = (item: Response.GatewayItem) => {
    const { payment_method } = item
    if (payment_method === 1) {
      return SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.DepositFlow]
    }
    if (payment_method === 2) {
      return SERVICE_TYPE.I18nKeys[SERVICE_TYPE.Enums.WithdrawalFlow]
    }
    return ""
  }

  const updateGatewayStatus = async (enable: boolean, id: number) => {
    emit("update:gatewayStatue", enable, id)
  }

  const onEdit = (row: Response.GatewayItem) => {
    router.push({
      name: "CashFlowListEdit",
      params: {
        id: row.id
      }
    })
  }

  const onDelete = async (row: Response.GatewayItem) => {
    dialogData.delete.id = row.id
    openDeleteDialog(row)
  }

  const onDragEnd = () => {
    console.log("onDragEnd call api", props.tableData)
  }

  async function handleDelete() {
    openDeleteLoading()
    const { search, status } = useSearch(deletePaymentGateway)
    await search(dialogData.delete.id)
    if (status.value) {
      emit("reSearch", props.catchQueryForm)
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
    }

    closeDeleteLoading()
    closeDeleteDialog()
  }
</script>

<style lang="scss" scoped>
  @import "@/css/dragTable.scss";
</style>
