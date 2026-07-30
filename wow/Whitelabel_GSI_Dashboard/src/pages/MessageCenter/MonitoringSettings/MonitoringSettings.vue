<template>
  <div class="q-pa-md">
    <div class="row q-mb-md justify-start">
      <q-btn color="main-color" @click="onAdd" v-if="permission.edit">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add") }}
      </q-btn>
    </div>
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="table-container">
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
                <q-td key="sequence" :props="props">
                  {{ props.row.id }}
                </q-td>
                <q-td key="monitoring_type" :props="props">
                  {{
                    $t(MONITORING_TYPE.I18nKeys[props.row.monitoring_type as MONITORING_TYPE.Enums] || "common.unknow")
                  }}
                </q-td>
                <q-td key="monitoring_cycle" :props="props">
                  {{
                    $t(
                      MONITORING_CYCLE.I18nKeys[props.row.monitoring_cycle as MONITORING_CYCLE.Enums] || "common.unknow"
                    )
                  }}
                </q-td>
                <q-td key="time" :props="props">
                  {{ genTimeFormat(props.row.time) }}
                </q-td>
                <q-td key="enable_disable" :props="props">
                  <q-toggle
                    v-model="props.row.enable_disable"
                    color="green"
                    disable
                    :false-value="0"
                    :true-value="1"
                    keep-color
                  />
                </q-td>
                <!-- 功能 -->
                <q-td key="function" :props="props">
                  <q-btn
                    flat
                    fab-mini
                    color="main-color"
                    @click="onAction(props.row)"
                    v-if="permission.edit"
                  >
                    <q-icon class="q-mr-xs" size="xs" name="edit" />
                  </q-btn>
                  <q-btn flat fab-mini color="red-4" @click="onRemove(props.row)" v-if="permission.edit">
                    <q-icon class="q-mr-xs" size="xs" name="delete" />
                  </q-btn>
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
  <!-- 編輯彈窗 -->
  <dialog-comp v-model="EditDialog" :configs="dialogConfigs.edit" :loading="editLoading">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">{{ $t("common.edit_monitoring_alerts") }}</div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div class="col-12">
          <q-select
            v-model="dialogData.edit.monitoring_type"
            :options="dropdownData.typeDropdownList"
            emit-value
            :label="`* ${$t('common.monitoring_type')}`"
            map-options
            outlined
            @update:modelValue="onMonitoringTypeChange"
          />
        </div>

        <span class="q-mt-md q-pl-lg title text-weight-bold">{{ $t("common.monitoring_cycle") }}</span>

        <div class="col-12 q-pt-xs">
          <!--即時-->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="dialogData.edit.monitoring_type !== 2 && dialogData.edit.monitoring_type !== 4"
          >
            <div style="width: 8em">
              <q-radio
                v-model="dialogData.edit.monitoring_cycle"
                :val="1"
                :label="$t('common.real_time_detection')"
                class="q-radio-w q-mr-md"
              />
            </div>
            <div
              class="col q-ml-sm q-flex item-center"
              style="width: 20em"
              v-if="dialogData.edit.monitoring_type !== 6"
            >
              {{ $t("common.every") }}

              <div class="q-mt-xs q-mr-md q-ml-md row items-center no-wrap audit-multiple-container">
                <q-btn size="md" square flat @click="dialogData.edit.minute -= 1">-</q-btn>
                <q-input v-model="dialogData.edit.minute" dense borderless square class="audit-multiple" />
                <q-btn size="md" square flat @click="dialogData.edit.minute += 1">+</q-btn>
              </div>
              {{ $t("common.minutes") }}
            </div>
          </div>
          <!--end-->
          <!--每日-->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="
              dialogData.edit.monitoring_type !== 2 &&
              dialogData.edit.monitoring_type !== 4 &&
              dialogData.edit.monitoring_type !== 6
            "
          >
            <div style="width: 8em">
              <q-radio
                v-model="dialogData.edit.monitoring_cycle"
                :val="2"
                :label="$t('common.daily_detection')"
                class="q-radio-w q-mr-md"
              />
            </div>
            <div class="col q-ml-sm q-flex item-center" style="width: 20em"></div>
          </div>
          <!--end-->
          <!--每周-->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="
              dialogData.edit.monitoring_type !== 2 &&
              dialogData.edit.monitoring_type !== 4 &&
              dialogData.edit.monitoring_type !== 6
            "
          >
            <div style="width: 8em">
              <q-radio
                v-model="dialogData.edit.monitoring_cycle"
                :val="3"
                :label="$t('common.weekly_detection')"
                class="q-radio-w q-mr-md"
              />
            </div>
            <div class="col q-ml-sm q-flex item-center" style="width: 20em">
              {{ $t("common.every_week") }}
              <q-select
                v-model="dialogData.edit.week"
                :options="dropdownData.weeks"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                class="q-ml-sm"
              >
                <template #selected>
                  {{
                    dropdownData.weeks.filter((item) => item.value === dialogData.edit.week)[0]
                      ? $t(dropdownData.weeks.filter((item) => item.value === dialogData.edit.week)[0].label)
                      : $t("common.unknow")
                  }}
                </template>
                <template #option="{ itemProps, opt, selected, toggleOption }">
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(opt.label) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <!--end-->
          <!--每月-->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="
              dialogData.edit.monitoring_type !== 2 &&
              dialogData.edit.monitoring_type !== 4 &&
              dialogData.edit.monitoring_type !== 6
            "
          >
            <div style="width: 8em">
              <q-radio
                v-model="dialogData.edit.monitoring_cycle"
                :val="4"
                :label="$t('common.weekly_detection')"
                class="q-radio-w q-mr-md"
              />
            </div>
            <div class="col q-ml-sm q-flex item-center" style="width: 20em">
              {{ $t("common.every_month") }}
              <q-select
                v-model="dialogData.edit.month"
                :options="dropdownData.months"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                class="q-mx-sm"
              />
              {{ $t("common.day") }}
            </div>
          </div>
          <!--end-->
          <!-- 會員歷史盈利異常|產品歷史虧損異常 -->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="dialogData.edit.monitoring_type === 2 || dialogData.edit.monitoring_type === 4"
          >
            <div class="q-flex item-center" style="width: 20em">
              <div class="q-mt-xs q-mr-md q-ml-md row items-center no-wrap audit-multiple-container">
                <q-btn size="md" square flat @click="dialogData.edit.few_days -= 1">-</q-btn>
                <q-input v-model="dialogData.edit.few_days" dense borderless square class="audit-multiple" />
                <q-btn size="md" square flat @click="dialogData.edit.few_days += 1">+</q-btn>
              </div>
              {{ $t("common.in_few_days") }}
            </div>
          </div>
          <!--end-->
        </div>
        <span class="q-mt-md q-pl-lg title text-weight-bold">{{ $t("common.condition_setting") }}</span>

        <div class="col-12 q-pt-xs q-pl-lg">
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="dialogData.edit.monitoring_type !== 5 && dialogData.edit.monitoring_type !== 6"
          >
            <div class="q-flex item-center" style="width: 20em">
              <span v-if="dialogData.edit.monitoring_type === 1 || dialogData.edit.monitoring_type === 2">{{
                $t("common.member_profit_reaches")
              }}</span>
              <span v-else-if="dialogData.edit.monitoring_type === 3 || dialogData.edit.monitoring_type === 4">{{
                $t("common.member_losses_amount")
              }}</span>
              <div class="q-mt-xs q-mr-md q-ml-md row items-center no-wrap audit-multiple-container">
                <q-btn size="md" square flat @click="dialogData.edit.percentage -= 1">-</q-btn>
                <q-input
                  v-model="dialogData.edit.percentage"
                  dense
                  borderless
                  square
                  :decimals="0"
                  class="audit-multiple"
                />
                <q-btn size="md" square flat @click="dialogData.edit.percentage += 1">+</q-btn>
              </div>
              %
            </div>
          </div>
          <div
            class="row items-center q-mt-md"
            v-if="dialogData.edit.monitoring_type === 5 || dialogData.edit.monitoring_type === 6"
          >
            <q-markup-table square separator="none" class="currency_table">
              <thead class="bg-success">
                <tr>
                  <th width="80px">{{ $t("common.currency") }}</th>
                  <th>{{ $t("common.warning_amount") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(currency, index) in store.currencyList" :key="index">
                  <td>{{ currency }}</td>
                  <td>
                    <q-number v-model="dialogData.edit.currency" dense borderless square />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 新增彈窗 -->
  <dialog-comp v-model="addDialog" :configs="dialogConfigs.add" :loading="addLoading">
    <template #mainContent>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-sm">
          <div class="q-pb-md q-pt-md">{{ $t("common.edit_monitoring_alerts") }}</div>
          <q-card-section style="padding: 0">
            <q-separator />
          </q-card-section>
        </div>
        <div class="col-12">
          <q-select
            v-model="dialogData.add.monitoring_type"
            :options="dropdownData.typeDropdownList"
            emit-value
            :label="`* ${$t('common.monitoring_type')}`"
            map-options
            outlined
            @update:modelValue="onMonitoringTypeChange"
          />
        </div>

        <span class="q-mt-md q-pl-lg title text-weight-bold">{{ $t("common.monitoring_cycle") }}</span>

        <div class="col-12 q-pt-xs">
          <!--即時-->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="dialogData.add.monitoring_type !== 2 && dialogData.add.monitoring_type !== 4"
          >
            <div style="width: 8em">
              <q-radio
                v-model="dialogData.add.monitoring_cycle"
                :val="1"
                :label="$t('common.real_time_detection')"
                class="q-radio-w q-mr-md"
              />
            </div>
            <div class="col q-ml-sm q-flex item-center" style="width: 20em" v-if="dialogData.add.monitoring_type !== 6">
              {{ $t("common.every") }}

              <div class="q-mt-xs q-mr-md q-ml-md row items-center no-wrap audit-multiple-container">
                <q-btn size="md" square flat @click="dialogData.add.minute -= 1">-</q-btn>
                <q-input v-model="dialogData.add.minute" dense borderless square class="audit-multiple" />
                <q-btn size="md" square flat @click="dialogData.add.minute += 1">+</q-btn>
              </div>
              {{ $t("common.minutes") }}
            </div>
          </div>
          <!--end-->
          <!--每日-->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="
              dialogData.add.monitoring_type !== 2 &&
              dialogData.add.monitoring_type !== 4 &&
              dialogData.add.monitoring_type !== 6
            "
          >
            <div style="width: 8em">
              <q-radio
                v-model="dialogData.add.monitoring_cycle"
                :val="2"
                :label="$t('common.daily_detection')"
                class="q-radio-w q-mr-md"
              />
            </div>
            <div class="col q-ml-sm q-flex item-center" style="width: 20em"></div>
          </div>
          <!--end-->
          <!--每周-->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="
              dialogData.add.monitoring_type !== 2 &&
              dialogData.add.monitoring_type !== 4 &&
              dialogData.add.monitoring_type !== 6
            "
          >
            <div style="width: 8em">
              <q-radio
                v-model="dialogData.add.monitoring_cycle"
                :val="3"
                :label="$t('common.weekly_detection')"
                class="q-radio-w q-mr-md"
              />
            </div>
            <div class="col q-ml-sm q-flex item-center" style="width: 20em">
              {{ $t("common.every_week") }}
              <q-select
                v-model="dialogData.add.week"
                :options="dropdownData.weeks"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                class="q-ml-sm"
              >
                <template #selected>
                  {{
                    dropdownData.weeks.filter((item) => item.value === dialogData.add.week)[0]
                      ? $t(dropdownData.weeks.filter((item) => item.value === dialogData.add.week)[0].label)
                      : $t("common.unknow")
                  }}
                </template>
                <template #option="{ itemProps, opt, selected, toggleOption }">
                  <q-item v-bind="itemProps">
                    <q-item-section>
                      <q-item-label>{{ $t(opt.label) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <!--end-->
          <!--每月-->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="
              dialogData.add.monitoring_type !== 2 &&
              dialogData.add.monitoring_type !== 4 &&
              dialogData.add.monitoring_type !== 6
            "
          >
            <div style="width: 8em">
              <q-radio
                v-model="dialogData.add.monitoring_cycle"
                :val="4"
                :label="$t('common.weekly_detection')"
                class="q-radio-w q-mr-md"
              />
            </div>
            <div class="col q-ml-sm q-flex item-center" style="width: 20em">
              {{ $t("common.every_month") }}
              <q-select
                v-model="dialogData.add.month"
                :options="dropdownData.months"
                outlined
                dense
                emit-value
                map-options
                color="primary"
                class="q-mx-sm"
              />
              {{ $t("common.day") }}
            </div>
          </div>
          <!--end-->
          <!-- 會員歷史盈利異常|產品歷史虧損異常 -->
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="dialogData.add.monitoring_type === 2 || dialogData.add.monitoring_type === 4"
          >
            <div class="q-flex item-center" style="width: 20em">
              <div class="q-mt-xs q-mr-md q-ml-md row items-center no-wrap audit-multiple-container">
                <q-btn size="md" square flat @click="dialogData.add.few_days -= 1">-</q-btn>
                <q-input v-model="dialogData.add.few_days" dense borderless square class="audit-multiple" />
                <q-btn size="md" square flat @click="dialogData.add.few_days += 1">+</q-btn>
              </div>
              {{ $t("common.in_few_days") }}
            </div>
          </div>
          <!--end-->
        </div>
        <span class="q-mt-md q-pl-lg title text-weight-bold">{{ $t("common.condition_setting") }}</span>

        <div class="col-12 q-pt-xs q-pl-lg">
          <div
            class="row items-center q-mt-md"
            style="min-width: 15rem"
            v-if="dialogData.add.monitoring_type !== 5 && dialogData.add.monitoring_type !== 6"
          >
            <div class="q-flex item-center" style="width: 20em">
              <span v-if="dialogData.add.monitoring_type === 1 || dialogData.add.monitoring_type === 2">{{
                $t("common.member_profit_reaches")
              }}</span>
              <span v-else-if="dialogData.add.monitoring_type === 3 || dialogData.add.monitoring_type === 4">{{
                $t("common.member_losses_amount")
              }}</span>
              <div class="q-mt-xs q-mr-md q-ml-md row items-center no-wrap audit-multiple-container">
                <q-btn size="md" square flat @click="dialogData.add.percentage -= 1">-</q-btn>
                <q-input
                  v-model="dialogData.add.percentage"
                  dense
                  borderless
                  square
                  :decimals="0"
                  class="audit-multiple"
                />
                <q-btn size="md" square flat @click="dialogData.add.percentage += 1">+</q-btn>
              </div>
              %
            </div>
          </div>
          <div
            class="row items-center q-mt-md"
            v-if="dialogData.add.monitoring_type === 5 || dialogData.add.monitoring_type === 6"
          >
            <q-markup-table square separator="none" class="currency_table">
              <thead class="bg-success">
                <tr>
                  <th width="80px">{{ $t("common.currency") }}</th>
                  <th>{{ $t("common.warning_amount") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(currency, index) in store.currencyList" :key="index">
                  <td>{{ currency.label }}</td>
                  <td>
                    <q-number v-model="dialogData.add.currency" dense borderless square />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </div>
    </template>
  </dialog-comp>

  <!-- 刪除彈窗 -->
  <dialog-comp v-model="removeDialog" :configs="dialogConfigs.remove" :loading="removeLoading">
    <template #mainContent>
      <div>{{ $t("table_header.delete_permission_content") }}</div>
    </template>
  </dialog-comp>
</template>

<script lang="ts" setup>
  import { QTableProps, useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { reactive, onMounted, computed } from "vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"

  import { getMonitoringSettingList } from "@/api/monitoringSettings"
  import type { GetMonitoringSettingList } from "@/api/request.type"
  import type { monitoringSettingItem } from "@/api/response.type"

  import { useDialog } from "@/hook/useDialog"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { MONITORING_TYPE, MONITORING_CYCLE } from "@/utils/constants"
  import { useQueryStore } from "@/stores/queryStore"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const { t } = useI18n()

  let { search, tableData, totalSize } = useSearch(getMonitoringSettingList)

  const { genTimeFormat } = useCommon()
  const store = useQueryStore()

  async function onSubmit(params: GetMonitoringSettingList) {
    await search(params)
  }
  interface IDropdownItem<T> {
    label: string
    value: T
  }
  const { genWeeks, genMonths } = useCommon()

  let dropdownData = reactive({
    typeDropdownList: [] as IDropdownItem<number>[],
    weeks: genWeeks(),
    months: genMonths()
  })

  onMounted(() => {
    store.getCurrencyList()
    console.log(store.currencyList)
    store.getMonitorTypeList()
    store.monitorTypeList.forEach((type, index) => {
      if (type !== 0) {
        dropdownData.typeDropdownList.push({
          label: t((MONITORING_TYPE.I18nKeys as any)[type] || "common.unknow"),
          value: type
        })
      }
    })
    dialogData.edit.week = dropdownData.weeks[0].value
    dialogData.edit.month = dropdownData.months[0].value

    dialogData.add.week = dropdownData.weeks[0].value
    dialogData.add.month = dropdownData.months[0].value
  })
  const onMonitoringTypeChange = (newVal: number) => {
    console.log(dialogData.edit.monitoring_type)
  }

  const queryConfigs = reactive<IQueryConfig>({
    usePagination: true,
    submitOnLoaded: true
  })

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "sequence",
        label: t("table_header.sequence"),
        field: "sequence",
        sortable: false,
        align: "center"
      },
      {
        name: "monitoring_type",
        label: t("table_header.monitoring_type"),
        field: "monitoring_type",
        sortable: false,
        align: "center"
      },
      {
        name: "monitoring_cycle",
        label: t("table_header.monitoring_cycle"),
        field: "monitoring_cycle",
        sortable: false,
        align: "center"
      },
      {
        name: "time",
        label: t("table_header.created_on"),
        field: "time",
        sortable: false,
        align: "center"
      },
      {
        name: "enable_disable",
        label: t("table_header.enable_or_disable"),
        field: "enable_disable",
        sortable: false,
        align: "center"
      },
      {
        name: "function",
        label: t("table_header.function"),
        field: "function",
        sortable: false,
        align: "center"
      }
    ]

    return permission.value.edit ? columns : columns.filter((column) => column.name !== "function")
  })

  const dialogConfigs = reactive<{ [key: string]: IDialogConfig }>({
    edit: {
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleedit
    },
    add: {
      type: DialogType.ADD,
      useActions: true,
      submitFunction: handleAdd
    },
    remove: {
      dialogLabelI18nKey: "btn.tip",
      type: DialogType.EDIT,
      useActions: true,
      submitFunction: handleRemove
    }
  })
  function onRemove(row: monitoringSettingItem) {
    dialogData.remove = row
    openRemoveDialog(row)
  }
  const dialogData = reactive<{
    edit: {
      id: number
      monitoring_type: number
      monitoring_cycle: number
      minute: number
      week: number
      month: number
      few_days: number
      percentage: number
      currency: number
    }
    add: {
      id: number
      monitoring_type: number
      monitoring_cycle: number
      minute: number
      week: number
      month: number
      few_days: number
      percentage: number
      currency: number
    }
    remove: {}
  }>({
    edit: {
      id: 0,
      monitoring_type: 1,
      monitoring_cycle: 1,
      minute: 1,
      week: 0,
      month: 0,
      few_days: 1,
      percentage: 1,
      currency: 0
    },
    add: {
      id: 0,
      monitoring_type: 1,
      monitoring_cycle: 1,
      minute: 1,
      week: 0,
      month: 0,
      few_days: 1,
      percentage: 1,
      currency: 0
    },
    remove: {}
  })

  const {
    dialog: removeDialog,
    openDialog: openRemoveDialog,
    loading: removeLoading,
    openLoading: openRemoveLoading,
    closeLoading: closeRemoveLoading
  } = useDialog()

  async function handleRemove() {
    openRemoveLoading()
    // call api
    //onSubmit(catchQueryForm)
    $q.notify({
      type: "positive",
      message: t("message.delete_success"),
      position: "top",
      timeout: 300
    })
    closeRemoveLoading()
  }

  const $q = useQuasar()

  const {
    dialog: EditDialog,
    openDialog: openEditDialog,
    closeDialog: closeEditDialog,
    loading: editLoading,
    openLoading: openeditLoading,
    closeLoading: closeeditLoading
  } = useDialog()

  const onAction = (row: monitoringSettingItem) => {
    dialogData.edit.id = row.id
    dialogData.edit.monitoring_type = row.monitoring_type
    dialogData.edit.monitoring_cycle = row.monitoring_cycle

    openEditDialog()
  }

  function handleedit() {
    openeditLoading()

    $q.notify({
      type: "positive",
      message: t("message.edit_success"),
      position: "top",
      timeout: 300
    })

    closeeditLoading()
  }

  const {
    dialog: addDialog,
    openDialog: openAddDialog,
    loading: addLoading,
    openLoading: openAddLoading,
    closeLoading: closeAddLoading
  } = useDialog()

  function onAdd() {
    openAddDialog()
  }
  function handleAdd() {
    openAddLoading()
    // call api
    $q.notify({
      type: "positive",
      message: t("message.add_success"),
      position: "top",
      timeout: 300
    })

    closeAddLoading()
  }
</script>

<style scoped>
  :deep(.row.q-mb-md:not(.justify-start)) {
    display: none;
  }
  :deep(.q-field__native, .q-field__input) {
    text-align: center;
  }

  .item-center {
    align-items: center;
  }
  .text-center {
    text-align: center;
  }
  .title {
    font-size: 16px;
  }
  .audit-multiple-container {
    width: 48%;
    border: 1px solid #999;
    .q-btn {
      height: 40px;
      background-color: #f3f4ff;
    }
    .audit-multiple {
      border-left: 1px solid #999;
      border-right: 1px solid #999;
      ::v-deep(input.q-field__input) {
        text-align: center;
      }
    }
  }
  .audit-multiple-bottom {
    width: 150px;
  }
  .currency_table {
    width: 100%;
    :deep(.q-table__container .q-table tbody tr td:not(:last-child)) {
      border-right: unset !important;
    }
    :deep(.q-field__native, .q-field__input) {
      border: 1px #c2c2ca solid;
    }
    :deep(.q-field__input) {
      text-align: right;
      padding-right: 10px;
    }
  }
</style>
