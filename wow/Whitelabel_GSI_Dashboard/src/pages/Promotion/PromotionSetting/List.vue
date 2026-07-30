<template>
  <div class="q-pa-md">
    <query
      ref="queryComponent"
      v-model:total="totalSize"
      :configs="queryConfigs"
      @query-update="onSubmit"
      @query-field-change="onQueryFieldChange"
    >
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn class="btns btn-blue" @click="onAdd" v-if="permission.edit">
            <q-icon class="q-mr-xs" size="xs" name="add" />
            {{ $t("btn.add") }}
          </q-btn>
        </div>
        <q-markup-table square class="!overflow-x-auto">
          <thead class="bg-success">
            <tr>
              <th v-for="item in tableColumn">{{ item.label }}</th>
            </tr>
          </thead>
          <!-- disabled => 讓整行不能拉取 -->
          <VueDraggableNext
            class="drag-container"
            :list="tableData"
            tag="tbody"
            :disabled="disabledDrag"
            @end="onDragEnd"
          >
            <tr v-for="item in tableData">
              <!-- NO. -->
              <td>
                <q-number
                  v-model="item.sorts"
                  :options="{
                    min: 1,
                    minimumFractionDigits: '0',
                    precision: '0',
                    nullValue: '',
                    separator: ''
                  }"
                  dense
                  outlined
                  class="sort-input"
                  @blur="handlePositionInput(item)"
                  placeholder=""
                />
              </td>
              <td>{{ getDynamicLangValue(item.title) }}</td>
              <td>{{ $t(EVENT_TYPE.I18nKeys[item.type as EVENT_TYPE.Enums]) }}</td>
              <td>{{ $t(REWARD_TYPE.I18nKeys[convertRewardType(item.auto_payout)]) }}</td>
              <td>{{ item.prize_type ? $t(PRIZE_TYPE.I18nKeys[item.prize_type as PRIZE_TYPE.Enums]) : "-" }}</td>
              <td>
                {{ genTimeFormat(new Date(item.start_date), "yyyy-MM-dd") }} -
                {{ genTimeFormat(new Date(item.end_date), "yyyy-MM-dd") }}
              </td>
              <td>{{ item.currencies ? item.currencies.join("、") : "-" }}</td>
              <q-td v-if="walletSwitch">
                {{
                  item.wallet_type ? $t(BONUS_WALLET_TYPE.I18nKeys[item.wallet_type as BONUS_WALLET_TYPE.Enums]) : "-"
                }}
              </q-td>
              <td>
                <q-toggle
                  v-model="item.enabled"
                  class="toggle"
                  color="blue"
                  size="lg"
                  @update:model-value="updatePromotionStatus($event, item.id)"
                  :disable="!permission.edit"
                />
              </td>
              <td v-if="permission.edit">
                <q-btn flat round fab-mini color="blue" icon="edit" @click="onAction(item)"></q-btn>
                <q-btn flat round fab-mini color="red" icon="delete" @click="onDelete(item)"></q-btn>
              </td>
            </tr>
          </VueDraggableNext>
        </q-markup-table>
      </template>
    </query>
  </div>
  <!-- 刪除彈窗 -->
  <dialog-comp v-model="deleteDialog" :configs="dialogConfigs.delete" :loading="deleteLoading">
    <template #mainContent>
      <div>{{ $t("common.sure_to_delete_event") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, onMounted, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { useCommon } from "@/hook/useCommon"
  import { VueDraggableNext } from "vue-draggable-next"
  import { usePromotionStore } from "@/stores/promotionStore"
  import { useLanguageStore } from "@/stores/languageStore"
  import { useWalletBouns } from "@/hook/useWalletBouns"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "@/hook/useDialog"
  import { getPromotionList, updatePromotionItemStatus, deletePromotionItem, promotionSort } from "@/api/promotion"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import { EVENT_TYPE, REWARD_TYPE, LANGUAGE_TYPE, BONUS_WALLET_TYPE, PRIZE_TYPE } from "@/utils/constants"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useSiteStore } from "@/stores/siteStore"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const siteStore = useSiteStore()
  const { walletSwitch } = useWalletBouns()
  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const promotionStore = usePromotionStore()
  const languageStore = useLanguageStore()
  const {
    dialog: deleteDialog,
    openDialog: openDeleteDialog,
    closeDialog: closDeleteDialog,
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
  const disabledDrag = ref(true)
  const { genTimeFormat } = useCommon()
  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    const columns: CustomQTableProps["columns"] = [
      {
        name: "sorts",
        label: t("table_header.order"),
        field: "sorts",
        sortable: false,
        align: "center"
      },
      {
        name: "title",
        label: t("query_params.event_name"),
        field: "title",
        sortable: false,
        align: "center"
      },
      {
        name: "type",
        label: t("query_params.event_type"),
        field: "type",
        sortable: false,
        align: "center"
      },
      {
        name: "distribution_type",
        label: t("query_params.distribution_type"),
        field: "distribution_type",
        sortable: false,
        align: "center"
      },
      {
        name: "prize_type",
        label: t("table_header.prize_distribution_type"),
        field: "prize_type",
        sortable: false,
        align: "center"
      },
      {
        name: "event_time",
        label: t("query_params.event_time"),
        field: "event_time",
        sortable: false,
        align: "center"
      },
      {
        name: "currencies",
        label: t("table_header.currency"),
        field: "currencies",
        sortable: false,
        align: "center"
      },
      ...(walletSwitch.value
        ? [
            {
              name: "wallet_type",
              label: t("query_params.wallet_type"),
              field: "wallet_type",
              sortable: false,
              align: "center" as const
            }
          ]
        : []),
      {
        name: "enabled",
        label: t("table_header.active_disabled"),
        field: "enabled",
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

  // 跟踪当前的 PrizeType 值
  const currentPrizeType = ref<number | undefined>(undefined)

  // 引用 query 组件
  const queryComponent = ref()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useEventName: true,
    useEventType: true,
    useEnableStatus: true,
    customDateTimeLabelI18nKey: "query_params.event_time",
    dateTimeIsUnnecessary: true,
    usePrizeType: true,
    currentPrizeType: currentPrizeType.value,
    useCurrency: true,
    useWalletType: false,
    useDatePicker: true
  })

  watch([currentPrizeType, walletSwitch], ([prizeType, wallet]) => {
    queryConfigs.currentPrizeType = prizeType
    queryConfigs.useWalletType = !!(wallet && prizeType === 1)
  })

  let { search, tableData, totalSize } = useSearch(getPromotionList)
  let catchQueryForm: Request.GetPromotionList
  async function onSubmit(queryForm: Request.GetPromotionList) {
    catchQueryForm = queryForm
    await search(queryForm)
    tableData.value = tableData.value.map((e) => {
      e.origin_sort = e.sorts
      return e
    })
  }

  // 监听查询字段变化事件
  function onQueryFieldChange(eventData: { queryForm: Record<string, any>; rawQueryForm: any }) {
    // 检查 PrizeType 是否发生变化
    const newPrizeType = eventData.queryForm.prizeType
    if (newPrizeType === currentPrizeType.value) return

    // 更新当前的 PrizeType 值
    currentPrizeType.value = newPrizeType

    // 当 PrizeType 的值发生变化时，初始化 WalletType 的值
    queryComponent.value.queryForm.wallet_type = null
  }
  function onAction(row: Response.generalPromotionListItem) {
    router.push({
      name: "PromotionSettingEdit",
      params: {
        id: row.id
      }
    })
  }
  function convertRewardType(isAutoPayout: boolean): REWARD_TYPE.Enums {
    if (isAutoPayout) {
      return REWARD_TYPE.Enums.Auto
    } else {
      return REWARD_TYPE.Enums.Manual
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

  async function updatePromotionStatus(enabled: boolean, promotion_id: number) {
    const payload: Request.UpdatePromotionItemStatus = {
      id: promotion_id,
      enabled
    }
    $q.loading.show()
    try {
      const { search, status } = useSearch(updatePromotionItemStatus)
      await search(payload)
      if (status.value) {
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      }
    } catch (error) {
      $q.loading.hide()
    }
    $q.loading.hide()
  }

  async function onAdd() {
    await promotionStore.initPromotionItem()
    promotionStore.promotionItem.info = siteStore.langList.map((lang) => {
      return {
        lang: lang.label,
        title: "",
        content: "",
        image: ""
      }
    })
    router.push({
      name: "PromotionSettingAdd"
    })
  }
  async function onDragEnd() {
    // TODO: call api
    // onSubmit(catchQueryForm)
  }

  function onDelete(item: Response.generalPromotionListItem) {
    dialogDataId.value = item.id
    openDeleteDialog(item)
  }
  async function handleDelete() {
    openDeleteLoading()
    try {
      const { search, status } = useSearch(deletePromotionItem)
      await search(dialogDataId.value)

      if (status.value) {
        onSubmit(catchQueryForm)
        $q.notify({
          type: "positive",
          message: t("message.delete_success"),
          position: "top",
          timeout: 300
        })
      }
    } catch (error) {
      closeDeleteLoading()
    }
    closeDeleteLoading()
    closDeleteDialog()
  }

  const handlePositionInput = async (item: { sorts: number; id: number; origin_sort: number }) => {
    const position = item.sorts * 1
    if (position === item.origin_sort) return

    $q.loading.show()
    try {
      const { search, status } = useSearch(promotionSort)
      const payload: { sort_number: number; id: number } = {
        sort_number: Number(item.sorts),
        id: item.id
      }
      await search(payload)
      if (status.value) {
        onSubmit(catchQueryForm)
        $q.notify({
          color: "green",
          message: t("message.edit_success"),
          position: "top",
          timeout: 1000
        })
      }
    } catch (error) {
      $q.loading.hide()
    }

    $q.loading.hide()
  }
</script>

<style lang="scss" scoped>
  @import "@/css/dragTable.scss";
  .sort-input {
    width: 4.6875rem;
    margin: 0 auto;

    :deep(.q-field__native) {
      .q-field__input {
        text-align: center;
        cursor: text !important;
      }
    }
  }
</style>
