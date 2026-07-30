<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-end q-gutter-xs" v-if="permission.edit">
          <div class="date-row">
            <div class="date">
              <DateRangeSelector />
            </div>
            <q-btn icon-right="save" outline class="btn-purple" :label="$t('btn.save')" />
          </div>
          <q-btn class="btn-yellow q-ml-sm q-mt-sm" text-color="white">{{ $t("btn.batch_maintenance") }}</q-btn>
          <q-btn class="btn-pink q-ml-sm q-mt-sm" text-color="white">{{ $t("btn.batch_withdrawal") }}</q-btn>
        </div>
        <q-table
          v-model:selected="selected"
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="tableData"
          :columns="tableColumn"
          row-key="id"
          table-header-class="bg-success"
          selection="multiple"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <span v-if="props.row.status == 1">{{ $t("common.normal") }}</span>
              <span v-else>{{ $t("common.maintenance") }}</span>
            </q-td>
          </template>
          <template #body-cell-maintainence_period="props">
            <q-td :props="props" width="33%">
              <div class="date-row">
                <div class="date">
                  <!-- <DateRangeSelector :value="props.row.maintainTime"
                                @input="handleDateRangeInput(props.row, $event)" /> -->
                  <DateRangeSelector :value="props.row.maintainence_period" />
                </div>
                <!-- <q-btn color="blue" @click="saveMaintainTime(props)">儲存</q-btn> -->
                <q-btn icon-right="save" outline class="btn-purple" :label="$t('btn.save')" />
              </div>
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props" v-if="permission.edit">
              <div class="q-gutter-sm">
                <q-btn class="btn-yellow" text-color="white">{{ $t("table_header.maintenance_now") }}</q-btn>
                <q-btn class="q-ml-md btn-pink" text-color="white">{{ $t("table_header.cancel") }}</q-btn>
              </div>
            </q-td>
          </template>
          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useDialog } from "src/hook/useDialog"

  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { getProductMaintenSetting } from "@/api/product"
  import type { GetProductMaintenSetting } from "@/api/request.type"
  import { useEnv } from "src/hook/useEnv"
  import DateRangeSelector from "components/SharedComponents/DateRangeSelector.vue"
  import { usePermission } from "@/hook/usePermission"

  const { permission } = usePermission()
  const { isOpen, openDialog } = useDialog()
  const { t } = useI18n()

  let { envData } = useEnv()
  const appMode = envData().VITE_APP_MODE
  const selected = ref([])
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useGameType: true,
    useGameCode: true,
    useKeyword: true
  })

  const { search, tableData, totalSize } = useSearch(getProductMaintenSetting)
  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetProductMaintenSetting) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => {
  const columns: QTableProps["columns"] = [
    {
      name: "product_type",
      label: t("table_header.product_type"),
      field: "product_type",
      sortable: false,
      align: "center"
    },
    {
      name: "product",
      label: t("table_header.product"),
      field: "product",
      sortable: false,
      align: "center"
    },
    {
      name: "activated_quantity",
      label: t("table_header.activated_quantity"),
      field: "activated_quantity",
      sortable: false,
      align: "center"
    },
    {
      name: "status",
      label: t("table_header.status"),
      field: "status",
      sortable: false,
      align: "center"
    },
    {
      name: "maintainence_period",
      label: t("table_header.maintenance_period"),
      field: "maintainence_period",
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
  ];

  // 根據 permission.value.edit 的值來決定是否移除 actions 列
  return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions");
});


  //判斷不同appMode哪些欄位顯示跟隱藏
  /*if (appMode != "admin") {
    queryConfigs.useStatus = false
    queryConfigs.useDatePicker = false
    tableColumn = tableColumn.filter((item) => item.name !== "enable_or_disable" && item.name !== "display_target")
  }*/
  function handleOpenDialog() {
    console.log("handleOpenDialog")
    isOpen.value = true
  }
</script>

<style lang="scss">
  .date-row {
    display: flex;
    align-items: center;
    justify-content: center;
    .q-btn {
      padding: 7px 5px 5px 7px;
    }
    .on-right {
      margin-left: 5px;
    }
    .date {
      padding: 5px 10px;
    }
  }
</style>
