<template>
  <q-card class="q-pa-md no-shadow editWrapper_v2">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
              <q-td key="access_point" :props="props">
                {{ props.row.access_point }}
              </q-td>
              <q-td key="login_time" :props="props">
                {{ genTimeFormat(props.row.login_time) }}
              </q-td>
              <q-td key="ip_address" :props="props">
                {{ props.row.ip_address }}
              </q-td>
              <q-td key="location" :props="props">
                {{ props.row.location }}
              </q-td>

              <q-td key="device_info" :props="props">
                {{ props.row.device_info }}
              </q-td>
              <q-td key="is_successful" :props="props">
                <span v-if="!props.row.is_successful">{{ $t("save_status_type.fail") }}</span>
                <span v-else>{{ $t("save_status_type.success") }}</span>
              </q-td>
            </q-tr>
          </template>

          <!-- 查無資料 -->
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm">{{ $t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
  </q-card>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router"
  import { CustomQTableProps, QTableProps } from "quasar"
  import { reactive, computed, ref } from "vue"
  import { useI18n } from "vue-i18n"

  import { getMemberSessionLogtList } from "@/api/member"
  import type { GetMemberOperationReportList } from "@/api/request.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import tableTotalComp from "@/components/tableTotal/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import { useRoute } from "vue-router"

  const { t } = useI18n()
  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  const { search, tableData, totalSize, tableTotal } = useSearch(getMemberSessionLogtList)
  const route = useRoute()

  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetMemberOperationReportList) {
    queryForm.member_id = route.params.id as string
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    // {
    //   name: "access_point",
    //   label: t("table_header.access_point"),
    //   field: "access_point",
    //   sortable: false,
    //   align: "center"
    // },
    {
      name: "login_time",
      label: t("table_header.login_time"),
      field: "login_time",
      sortable: false,
      align: "center"
    },
    {
      name: "ip_address",
      label: "IP",
      field: "ip_address",
      sortable: false,
      align: "center"
    },
    {
      name: "location",
      label: t("table_header.location"),
      field: "location",
      sortable: false,
      align: "center"
    },
    {
      name: "device_info",
      label: t("table_header.device_browser"),
      field: "device_info",
      sortable: false,
      align: "center"
    },
    {
      name: "is_successful",
      label: t("table_header.login_status"),
      field: "is_successful",
      sortable: false,
      align: "center"
    }
  ])
</script>

<style lang="scss" scoped>
  .button-area {
    span {
      padding-top: 0.2rem;
    }
  }

  :deep(.custom-hide) {
    display: none !important;
  }
</style>
