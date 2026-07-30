<template>
  <div class="q-pa-md">
    <div class="row q-mb-md justify-between">
      <q-btn class="btns btn-blue">
        <q-icon class="q-mr-xs" size="xs" name="add" />
        {{ $t("btn.add_schedule") }}
      </q-btn>
    </div>
    <div class="table-white-bg">
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
            <q-td key="platform" :props="props">
              {{ props.row.platform }}
            </q-td>
            <q-td key="account" :props="props">
              {{ props.row.account }}
            </q-td>
            <q-td key="status" :props="props">
              <template v-if="props.row.status === 0">
                {{ $t("common.scheduling") }}
              </template>
              <template v-else>
                {{ $t("common.published") }}
              </template>
            </q-td>
            <q-td key="post_type" :props="props">
              {{ $t("table_header.posts") }}
            </q-td>
            <q-td key="language" :props="props">
              {{ props.row.language }}
            </q-td>
            <q-td key="repeat_schedule" :props="props">
              <template v-if="props.row.repeat_schedule === 0">
                {{ $t("first_deposit_type.yes") }}
              </template>
              <template v-else>
                {{ $t("first_deposit_type.no") }}
              </template>
            </q-td>
            <q-td key="publish_date" :props="props">
              {{ props.row.publish_date }}
            </q-td>
            <q-td key="created_by" :props="props">
              {{ props.row.created_by }}
            </q-td>
            <q-td key="created_on" :props="props">
              {{ props.row.created_on }}
            </q-td>
            <q-td key="actions" :props="props">
              <q-btn flat fab-mini color="blue">
                {{ $t("btn.edit") }}
              </q-btn>
              <q-btn flat fab-mini color="blue" v-if="props.row.status === 0">
                {{ $t("btn.details") }}
              </q-btn>
              <q-btn flat fab-mini color="blue" v-else>
                {{ $t("btn.preview") }}
              </q-btn>
              <q-btn flat fab-mini color="red">
                {{ $t("btn.remove") }}
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
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"

  import { CMS_TYPE } from "@/utils/constants"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"
  import DialogComp from "@/components/dialogs/index.vue"
  import { IDialogConfig, DialogType } from "@/components/dialogs/types"
  import { useDialog } from "@/hook/useDialog"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()

  //const { permission } = usePermission()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberAccount: true,
    useCommissionName: true,
    useCurrency: true,
    useDatePicker: true
  })
  const tableData = [
    {
      platform: "Instagram",
      account: "diana_todd330",
      status: 0,
      post_type: 0,
      language: "English",
      repeat_schedule: 0,
      publish_date: "2025-05-20 15:00:00",
      created_by: "abbie01",
      created_on: "2025-01-01 00:00:00"
    },
    {
      platform: "Instagram",
      account: "diana_todd330",
      status: 1,
      post_type: 0,
      language: "English",
      repeat_schedule: 1,
      publish_date: "2025-05-21 15:00:00",
      created_by: "abbie01",
      created_on: "2025-02-01 00:00:00"
    },
    {
      platform: "Instagram",
      account: "diana_todd330",
      status: 1,
      post_type: 0,
      language: "English",
      repeat_schedule: 1,
      publish_date: "2025-05-21 15:00:00",
      created_by: "abbie01",
      created_on: "2025-03-01 00:00:00"
    },
    {
      platform: "Instagram",
      account: "diana_todd330",
      status: 1,
      post_type: 0,
      language: "English",
      repeat_schedule: 1,
      publish_date: "2025-05-21 15:00:00",
      created_by: "abbie01",
      created_on: "2025-04-01 00:00:00"
    }
  ]

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const columns: QTableProps["columns"] = [
      {
        name: "platform",
        label: t("table_header.platform_selection"),
        field: "platform",
        sortable: false,
        align: "center"
      },
      {
        name: "account",
        label: t("table_header.account"),
        field: "account",
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
        name: "post_type",
        label: t("table_header.post_type"),
        field: "post_type",
        sortable: false,
        align: "center"
      },

      {
        name: "language",
        label: t("table_header.language"),
        field: "language",
        sortable: false,
        align: "center"
      },

      {
        name: "repeat_schedule",
        label: t("table_header.repeat_schedule"),
        field: "repeat_schedule",
        sortable: false,
        align: "center"
      },
      {
        name: "publish_date",
        label: t("table_header.publish_date"),
        field: "publish_date",
        sortable: false,
        align: "center"
      },
      {
        name: "created_by",
        label: t("table_header.created_by"),
        field: "created_by",
        sortable: false,
        align: "center"
      },
      {
        name: "created_on",
        label: t("table_header.created_on"),
        field: "created_on",
        sortable: false,
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.function"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]

    //return permission.value.edit ? columns : columns.filter((column) => column.name !== "actions")
    return columns
  })

  onMounted(() => {})
</script>

<style scoped>
  @import "@/css/ai.scss";
  .schedule_title {
    font-size: 1.25rem;
    color: #616161;
  }
</style>
