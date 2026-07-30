<template>
  <div class="p-4">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="flex gap-2 mb-4">
          <q-btn color="positive" @click="onMasterSwitch">
            JACKPOT
            {{ t("jackpotManagement.master_switch") }}
          </q-btn>
          <q-btn color="primary" :label="t('btn.add')" @click="onAdd" />
        </div>

        <div>
          <q-table
            bordered
            :rows="tableData"
            :columns="columns"
            row-key="id"
            :loading="loading"
            hide-pagination
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="flex items-center justify-center gap-x-2 flex-nowrap">
                <q-btn color="primary" :label="t('btn.edit')" size="sm" @click="onEdit(props.row)" />
                <q-btn color="negative" :label="t('btn.remove')" size="sm" @click="onDelete(props.row)" />
              </q-td>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from "vue"
  import { useQuasar, type QTableColumn } from "quasar"
  import { useI18n } from "vue-i18n"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import JackpotPoolDialog from "./components/JackpotPoolDialog.vue"
  import JackpotSwitchDialog from "./components/JackpotSwitchDialog.vue"
  import JackpotDeleteDialog from "./components/JackpotDeleteDialog.vue"
  import { Enums } from "@/utils/constants/currency"
  import { useCommon } from "@/hook/useCommon"
  import { useJackpot, type JackpotPool } from "./useJackpot"

  const $q = useQuasar()
  const { t } = useI18n()
  const { genTimeFormat, moneyFormat } = useCommon()

  const {
    loading,
    totalSize,
    tableData,
    queryForm,
    switchState,
    fetchJackpotList,
    handleCreate,
    handleUpdate,
    handleDelete,
    updateSwitchState
  } = useJackpot(20)

  const currencyOptions = Object.keys(Enums).filter((key) => isNaN(Number(key)))

  const queryConfigs: IQueryConfig = {
    submitOnLoaded: false,
    allowSameSubmit: true,
    usePagination: true,
    dateTimeIsUnnecessary: true,
    useCurrency: true,
    useEnableStatus: true
  }

  const columns = computed<QTableColumn[]>(() => [
    { name: "id", label: "ID", field: "id", align: "center" },
    { name: "currency", label: t("common.currency"), field: "currency", align: "center" },
    {
      name: "contribution_rate",
      label: t("jackpotManagement.contribution_rate"),
      field: "contribution_rate",
      align: "center",
      format: (val: number) => `${val} %`
    },
    {
      name: "payout_threshold",
      label: t("jackpotManagement.payout_threshold"),
      field: "payout_threshold",
      align: "center",
      format: (val: number) => String(moneyFormat(val, 4))
    },
    {
      name: "is_enabled",
      label: t("table_header.status"),
      field: "is_enabled",
      align: "center",
      format: (val: boolean) => (val ? t("common.enable") : t("common.disable")),
      classes: (row: JackpotPool) => (row.is_enabled ? "text-green" : "text-red")
    },
    {
      name: "current_amount",
      label: t("jackpotManagement.current_accumulated_amount"),
      field: "current_amount",
      align: "center",
      format: (val: number) => String(moneyFormat(val, 4))
    },
    {
      name: "updated_at",
      label: t("jackpotManagement.last_updated_time"),
      field: "updated_at",
      align: "center",
      format: (val: string) => (val ? genTimeFormat(parseInt(val), "yyyy-MM-dd HH:mm:ss") || "-" : "-")
    },
    { name: "remark", label: t("dialog.remark"), field: "remark", align: "center" },
    { name: "actions", label: t("common.actions"), field: "actions", align: "center" }
  ])

  const onSubmit = (params: any) => {
    if (params.size) {
      queryForm.limit = params.size
      queryForm.page = Math.floor(params.offset / params.size) + 1
    }

    queryForm.currency = params.currency || null

    if (params.enable !== undefined && params.enable !== null && params.enable !== "") {
      if (typeof params.enable === "string") {
        queryForm.status = params.enable === "true"
      } else {
        queryForm.status = !!params.enable
      }
    } else {
      queryForm.status = null
    }

    fetchJackpotList()
  }

  const onAdd = () => {
    $q.dialog({
      component: JackpotPoolDialog,
      componentProps: {
        mode: "add",
        currencyOptions: currencyOptions,
        data: {
          id: "",
          currency: "",
          contribution_rate: 0,
          payout_threshold: 0,
          is_enabled: false, // 新增項目預設為停用
          remark: ""
        }
      }
    }).onOk(async (data: any) => {
      await handleCreate(data)
    })
  }

  const onEdit = (row: JackpotPool) => {
    $q.dialog({
      component: JackpotPoolDialog,
      componentProps: {
        mode: "edit",
        currencyOptions: currencyOptions,
        data: {
          id: row.id,
          currency: row.currency,
          contribution_rate: row.contribution_rate,
          payout_threshold: row.payout_threshold,
          is_enabled: row.is_enabled,
          remark: row.remark || ""
        }
      }
    }).onOk(async (data: any) => {
      await handleUpdate(data)
    })
  }

  const onDelete = (row: JackpotPool) => {
    $q.dialog({
      component: JackpotDeleteDialog,
      componentProps: {
        data: row
      }
    }).onOk(async () => {
      await handleDelete(row)
    })
  }

  const onMasterSwitch = () => {
    $q.dialog({
      component: JackpotSwitchDialog,
      componentProps: {
        data: {
          master: switchState.master,
          payout: switchState.payout
        }
      }
    }).onOk(async (data: any) => {
      await updateSwitchState(data)

      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top"
      })
    })
  }
  onMounted(() => {
    fetchJackpotList()
  })
</script>

<style scoped></style>
