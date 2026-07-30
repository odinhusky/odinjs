<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn outline color="main-color" @click="onExport">
            {{ $t("btn.export") }}
            <q-icon class="q-ml-xs" size="xs" name="archive" />
          </q-btn>
        </div>

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
              <q-td class="link-style" key="date" :props="props">
                <q-btn
                  @click="onAction(props.row, 'date')"
                  flat
                  text
                  :ripple="false"
                  color="blue"
                  :label="genTimeFormat(props.row.date)"
                />
              </q-td>
              <q-td key="active_player" :props="props">
                {{ props.row.active_player }}
              </q-td>
              <q-td class="link-style" key="new_rigister" :props="props" @click="onAction(props.row, 'regist')">
                <q-btn
                  @click="onAction(props.row, 'regist')"
                  flat
                  text
                  :ripple="false"
                  color="blue"
                  :label="props.row.new_rigister"
                />
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
  </div>
</template>

<script lang="ts" setup>
  import { QTableProps } from "quasar"
  import { computed, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRouter } from "vue-router"

  import { getDayReportList } from "@/api/report"
  import type { GetDayReportList } from "@/api/request.type"
  import type { dayReportItem } from "@/api/response.type"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  const { t } = useI18n()

  const router = useRouter()
  const onAction = (row: dayReportItem, type: string) => {
    let routerName = ref("")
    if (type === "date") routerName.value = "DayReportRegistDetail"
    else routerName.value = "DayReportDateDetail"
    router.push({
      name: routerName.value,
      params: {
        id: row.id
      }
    })
  }

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: false,
    allowSameSubmit: true,
    usePagination: true,
    useDatePicker: true
  })

  let { search, tableData, totalSize, tableTotal } = useSearch(getDayReportList)

  const { genTimeFormat } = useCommon()

  async function onSubmit(queryForm: GetDayReportList) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "date",
      label: t("table_header.date"),
      field: "date",
      sortable: false,
      align: "center"
    },
    {
      name: "active_player",
      label: t("table_header.active_player"),
      field: "active_player",
      sortable: false,
      align: "center"
    },
    {
      name: "new_rigister",
      label: t("table_header.new_rigister"),
      field: "new_rigister",
      sortable: false,
      align: "center"
    }
  ])

  function onExport() {}
</script>

<style lang="scss" scoped>
  :deep(.table-total) {
    &.q-tr {
      background-color: #FFF9E8 !important;
    }
  }
</style>
