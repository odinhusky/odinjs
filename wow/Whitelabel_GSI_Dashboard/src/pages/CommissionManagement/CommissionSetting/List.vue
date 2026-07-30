<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start" v-if="permission.edit">
          <q-btn @click="onAdd" v-if="permission.edit" class="btns btn-blue">
            <q-icon class="q-mr-xs" size="xs" name="add" />
            {{ $t("btn.add") }}
          </q-btn>
        </div>
        <div class="table-white-bg">
          <q-table
            square
            hide-pagination
            :rows-per-page-options="[0]"
            :rows="tableData"
            :columns="tableColumn"
            class="table_v2"
            row-key="id"
          >
            <template #body="props">
              <q-tr>
                <q-td key="name" :props="props">
                  {{ getDynamicLangValue(props.row.name) }}
                </q-td>
                <q-td key="period_type" :props="props">
                  {{
                    $t(SETTLEMENT_CYCLE.I18nKeys[props.row.period_type as SETTLEMENT_CYCLE.Enums] || "common.unknow")
                  }}
                </q-td>
                <q-td key="valid_time" :props="props">
                  {{ genTimeFormat(props.row.start_at, "yyyy-MM-dd", false) }} ~
                  {{ genTimeFormat(props.row.end_at, "yyyy-MM-dd", false) }}
                </q-td>
                <q-td key="calculate_type" :props="props">
                  {{ $t(CALCULATE_TYPE.I18nKeys[props.row.calculate_type as CALCULATE_TYPE.Enums]) || "" }}
                </q-td>
                <q-td key="dispatch_type" :props="props">
                  {{ $t(SEND_TYPE.I18nKeys[props.row.dispatch_type as SEND_TYPE.Enums] || "common.unknow") }}
                </q-td>
                <q-td key="wallet_type" :props="props">
                  {{
                    props.row.wallet_type
                      ? $t(BONUS_WALLET_TYPE.I18nKeys[props.row.wallet_type as BONUS_WALLET_TYPE.Enums])
                      : "-"
                  }}
                </q-td>
                <q-td key="level_ids" :props="props">
                  {{ handleLevelNames(props.row.level_ids) }}
                </q-td>
                <q-td key="member_count" :props="props">
                  {{ props.row.member_count }}
                </q-td>

                <q-td key="block_label_count" :props="props">
                  <div class="block_label_count">{{ props.row.block_label_count }}</div>
                </q-td>

                <q-td key="enable" :props="props">
                  <q-toggle
                    v-model="props.row.enable"
                    class="toggle"
                    color="blue"
                    size="lg"
                    :false-value="false"
                    :true-value="true"
                    keep-color
                    :disable="!permission.edit"
                    @update:model-value="updateStatus(props.row)"
                  />
                </q-td>

                <!-- 編輯 -->
                <q-td key="actions" :props="props" v-if="permission.edit">
                  <q-btn flat fab-mini icon="edit" class="edit_pen" @click="onAction(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.edit") }}</q-tooltip>
                  </q-btn>
                  <q-btn flat fab-mini icon="content_copy" class="copy" @click="onCopy(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.copy") }}</q-tooltip>
                  </q-btn>
                  <q-btn flat fab-mini icon="delete" class="del" @click="onDelete(props.row)">
                    <q-tooltip anchor="top middle" self="bottom middle">{{ $t("common.delete") }}</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>

            <!-- 查無資料 -->
            <template #no-data>
              <div class="full-width row flex-center q-gutter-sm column no_data">
                <img src="~assets/images/common/nodata.webp" class="q-pt-lg" />
                <p class="bold h5-bold q-mt-sm">{{ $t("common.no_data") }}</p>
              </div>
            </template>
          </q-table>
        </div>
      </template>
    </query>
  </div>

  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading" max-width="600px">
    <template #mainContent>
      <div class="text-red q-mb-lg">{{ $t("common.sure_to_delete_commission_settings") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import type { CustomQTableProps } from "quasar"
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import type { LANGUAGE_TYPE } from "@/utils/constants"
  import { SEND_TYPE, SETTLEMENT_CYCLE, BONUS_WALLET_TYPE, CALCULATE_TYPE } from "@/utils/constants"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { useCommissionStore } from "@/stores/commissionStore"
  import { useLanguageStore } from "@/stores/languageStore"
  import {
    getCommssionSettingList,
    deleteCommssionSetting,
    getCommssionSettingSingleList,
    updateCommssionSettingStatue
  } from "@/api/commissionManagement"
  import DialogComp from "@/components/dialogs/index.vue"
  import type { IDialogConfig } from "@/components/dialogs/types"
  import { DialogType } from "@/components/dialogs/types"
  import { useQueryStore } from "@/stores/queryStore"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const { t, locale } = useI18n()
  const $q = useQuasar()
  const store = useQueryStore()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useGroupName: true,
    useRewardType: true,
    useWalletType: true,
    useCalculateType: true,
    useEnableStatus: true,
    useDatePicker: true
  })
  const commissionStore = useCommissionStore()
  const languageStore = useLanguageStore()
  // 暫時用測試中 api
  let { search, tableData, totalSize } = useSearch(getCommssionSettingList)
  const { genTimeFormat, moneyFormat } = useCommon()
  let catchQueryForm: Request.GetCommissionSettingList

  async function onSubmit(queryForm: any) {
    catchQueryForm = queryForm
    await search(queryForm)
  }
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "name",
        label: t("table_header.group_name"),
        field: "name",
        sortable: false,
        align: "center"
      },
      {
        name: "period_type",
        label: t("table_header.settle_cycle"),
        field: "period_type",
        sortable: false,
        align: "center"
      },
      {
        name: "valid_time",
        label: t("table_header.valid_time"),
        field: "valid_time",
        sortable: false,
        align: "center"
      },
      {
        name: "calculate_type",
        label: t("table_header.calculate_mode"),
        field: "calculate_type",
        sortable: false,
        align: "center"
      },
      {
        name: "dispatch_type",
        label: t("table_header.reward_type"),
        field: "dispatch_type",
        sortable: false,
        align: "center"
      },
      {
        name: "wallet_type",
        label: t("table_header.wallet_type"),
        field: "wallet_type",
        sortable: false,
        align: "center"
      },
      {
        name: "level_ids",
        label: t("table_header.binding_level"),
        field: "level_ids",
        sortable: false,
        align: "center"
      },
      {
        name: "member_count",
        label: t("table_header.number_of_members"),
        field: "member_count",
        sortable: false,
        align: "center"
      },
      {
        name: "block_label_count",
        label: t("table_header.block_label"),
        field: "block_label_count",
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
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    // 如果無編輯權限 actions 移除
    return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
  })

  const router = useRouter()
  const onAction = (row: any) => {
    router.push({
      name: "CommissionSettingEdit",
      params: {
        id: row.id
      }
    })
  }

  function onAdd() {
    commissionStore.initCommissionItem()
    router.push({
      name: "CommissionSettingAdd"
    })
  }
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
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      showLabelCloseBtn: true,
      submitFunction: handleDelete
    }
  })
  const dialogData = reactive({
    delete: {
      id: 0
    }
  })
  const onDelete = (row: any) => {
    dialogData.delete.id = row.id
    openDeleteDialog(row)
  }
  async function handleDelete() {
    openDeleteLoading()
    let params = {
      id: dialogData.delete.id as number
    }
    const { code, msg } = await deleteCommssionSetting(params)
    if (code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.delete_success"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      $q.notify({
        type: "negative",
        message: msg,
        position: "top",
        timeout: 300
      })
    }

    closeDeleteLoading()
    closeDeleteDialog()
  }
  const handleLevelNames = (names: { [key: string]: number } | undefined) => {
    const levels = store.memberLevel
    const result: string[] = []

    if (levels && names) {
      levels.forEach((item) => {
        const formatValue = typeof item.value === "string" ? parseInt(item.value) : item.value
        if (Object.values(names).includes(formatValue)) {
          result.push(item.label)
        }
      })
    }
    return result.join(" ")
  }
  onMounted(() => {
    store.getMemberLevel()
  })

  async function onCopy(item: Request.GetCommissionSettingList) {
    $q.loading.show()
    try {
      const { code, data, msg } = await getCommssionSettingSingleList({ id: parseInt(item.id) })
      if (code === 0) {
        await commissionStore.copyCommissionItem(data)
        router.push({
          name: "CommissionSettingAdd"
        })
        $q.loading.hide()
      } else {
        $q.notify({
          type: "negative",
          message: msg,
          position: "top",
          timeout: 1000
        })
        $q.loading.hide()
      }
    } catch (error) {
      $q.loading.hide()
    }
  }
  function getDynamicLangValue(data: Response.PromotionLangTitle): string {
    if (!data) return ""
    const nowLang = languageStore.currentLanguageOption.backendKey as LANGUAGE_TYPE.Enums
    if (nowLang in data) {
      return data[nowLang]
    } else {
      // 没有 MYR 的值，则取第一个值
      for (const key in data) {
        return data[key as LANGUAGE_TYPE.Enums]
      }
    }
    return ""
  }

  const updateStatus = async (row: { id: number; enable: boolean }) => {
    let sendData = {
      id: row.id,
      enable: row.enable
    }

    const res = await updateCommssionSettingStatue(sendData)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top",
        timeout: 300
      })
    } else {
      onSubmit(catchQueryForm)
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }
</script>

<style lang="scss" scoped>
  // 調整disable樣式
  .drag-container {
    opacity: 1 !important;

    .drag-icon {
      font-size: 30px;
      cursor: pointer !important;
    }
  }

  ::v-deep([disabled]) * {
    cursor: default !important;
  }
</style>
