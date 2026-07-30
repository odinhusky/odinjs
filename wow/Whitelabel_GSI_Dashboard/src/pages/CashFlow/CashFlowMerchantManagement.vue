<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div v-if="isAgentMode && permission.permission.value.edit" class="row q-mb-md justify-start">
          <q-btn outline color="main-color" @click="onAdd">
            {{ $t("btn.add") }}
            <q-icon class="q-ml-xs" size="xs" name="add_circle_outline" />
          </q-btn>
        </div>
        <q-table
          :rows="tableData"
          :columns="columns"
          :loading="false"
          row-key="payment_gateway_channel_code"
          square
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              {{ $t(FUND_METHOD_TYPE.I18nKeys[props.row.type as FUND_METHOD_TYPE.Enums]) }}
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                color="primary"
                icon="edit"
                :disable="!permission.permission.value.edit"
                @click="onEdit(props.row)"
              />
              <q-btn
                flat
                dense
                color="negative"
                icon="delete"
                :disable="!permission.permission.value.edit"
                @click="onDelete(props.row)"
              />
            </q-td>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
    <!-- 刪除確認彈窗 -->
    <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { useSearch } from "@/hook/useSearch"
  import { getGatewayConnection, deleteGatewayConnection } from "@/api/paymentGateway"
  import type * as Response from "@/api/response.type"
  import type * as Request from "@/api/request.type"
  import type { QTableProps } from "quasar"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useEnv } from "@/hook/useEnv"
  import { usePermission } from "@/hook/usePermission"
  import { FUND_METHOD_TYPE } from "@/utils/constants"
  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"

  const { t } = useI18n()
  const $q = useQuasar()
  const router = useRouter()
  const { isAgentMode } = useEnv()
  const permission = usePermission()

  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    closeDialog: closeDeleteDialog,
    loading: deleteLoading,
    openLoading: openDeleteLoading,
    closeLoading: closeDeleteLoading
  } = useDialog()

  const queryConfigs = computed<IQueryConfig>(() => ({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useCashFlowType: true,
    useGatewayMerchant: true
  }))

  const { search, spinShow, isSuccess, tableData, totalSize } = useSearch(getGatewayConnection)

  const columns = computed<QTableProps["columns"]>(() => [
    {
      name: "name",
      label: t("table_header.name"),
      field: "name",
      align: "center"
    },
    {
      name: "payment_gateway_name",
      label: t("table_header.payment_provider"),
      field: "payment_gateway_name",
      align: "center"
    },
    {
      name: "type",
      label: t("edit_form.fund_method"),
      field: "type",
      align: "center"
    },
    {
      name: "actions",
      label: t("table_header.function"),
      field: "actions",
      align: "center"
    }
  ])

  const dialogConfigs = reactive<{ delete: IDialogConfig }>({
    delete: {
      dialogLabelI18nKey: "common.sure_to_delete_payment_gateway",
      type: DialogType.CONFIRM,
      useActions: true,
      submitFunction: handleDelete
    }
  })

  const dialogData = reactive({
    delete: {
      payment_gateway_name: "",
      payment_gateway_channel_code: ""
    }
  })

  const onSubmit = (queryForm: Request.GetGatewayConnection) => {
    search(queryForm)
  }

  const onAdd = () => {
    router.push({ name: "CashFlowMerchantManagementAdd" })
  }

  const onEdit = (row: Response.GatewayConnectionItem) => {
    console.log(row)
    router.push({
      name: "CashFlowMerchantManagementEdit",
      params: { payment_gateway_name: row.payment_gateway_name },
      query: { payment_gateway_channel_code: row.payment_gateway_channel_code }
    })
  }

  const onDelete = (row: Response.GatewayConnectionItem) => {
    dialogData.delete.payment_gateway_name = row.payment_gateway_name
    dialogData.delete.payment_gateway_channel_code = row.payment_gateway_channel_code
    openDeleteDialog(row)
  }

  async function handleDelete() {
    openDeleteLoading()
    try {
      const response = await deleteGatewayConnection({
        payment_gateway_name: dialogData.delete.payment_gateway_name,
        payment_gateway_channel_code: dialogData.delete.payment_gateway_channel_code
      })

      if (response.code === 334006) {
        $q.notify({
          type: "negative",
          message: t("error_msg.error_code_334006"),
          position: "top"
        })
        return
      }

      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 1000
      })

      // 重新查询列表
      const currentQuery: Request.GetGatewayConnection = {
        offset: 0,
        size: 10,
        type: undefined,
        payment_gateway_name: undefined
      }
      search(currentQuery)
    } catch (error) {
      console.error(error)
    } finally {
      closeDeleteLoading()
      closeDeleteDialog()
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  @import "@/css/form.scss";
</style>
