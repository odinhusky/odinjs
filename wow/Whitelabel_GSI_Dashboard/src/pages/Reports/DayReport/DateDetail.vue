<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
              <!-- 幣別 -->
              <q-td key="currency" :props="props">
                {{ props.row.currency }}
              </q-td>

              <!-- 存款金額 -->
              <q-td key="deposit_amount" :props="props">
                {{ props.row.deposit_amount }}
              </q-td>

              <!-- 取款金額 -->
              <q-td key="withdrawal_amount" :props="props">
                {{ props.row.withdrawal_amount }}
              </q-td>
              <!-- 投注金額 -->
              <q-td key="valid_bet" :props="props">
                {{ props.row.valid_bet }}
              </q-td>
              <!-- 有效投注金額 -->
              <q-td key="valid_bet" :props="props">
                {{ props.row.valid_bet }}
              </q-td>
              <!-- 盈虧 -->
              <q-td key="winlose_amount" :props="props">
                {{ props.row.winlose_amount }}
              </q-td>
              <!-- 活動金額 -->
              <q-td key="event_amount" :props="props">
                {{ props.row.event_amount }}
              </q-td>
              <!-- 淨出入 -->
              <q-td key="net_deposit" :props="props">
                {{ props.row.net_deposit }}
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
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { QTableProps } from "quasar"
  import { computed, onMounted, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"

  import { getDayReportDateDetail } from "@/api/report"
  import { useSearch } from "@/hook/useSearch"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { genTimeFormat } = useCommon()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useCurrency: true
  })

  function goBack() {
    router.back()
  }

  const { search, spinShow, isSuccess, tableData, totalSize } = useSearch(getDayReportDateDetail)

  async function onSubmit(queryForm: any) {
    await search(queryForm)
    console.log(tableData)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "currency",
      label: t("table_header.currency"),
      field: "currency",
      sortable: false,
      align: "center"
    },
    {
      name: "deposit_amount",
      label: t("table_header.total_deposit"),
      field: "deposit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "withdrawal_amount",
      label: t("table_header.withdrawal_amount"),
      field: "withdrawal_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "bet_amount",
      label: t("table_header.bet_amount"),
      field: "bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "valid_bet",
      label: t("table_header.valid_bet"),
      field: "valid_bet",
      sortable: false,
      align: "center"
    },
    {
      name: "winlose_amount",
      label: t("table_header.winlose_amount"),
      field: "winlose_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "event_amount",
      label: t("table_header.event_amount"),
      field: "event_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "net_deposit",
      label: t("table_header.net_deposit"),
      field: "net_deposit",
      sortable: false,
      align: "center"
    }
  ])

  onMounted(() => {
    const id = route.params.id as string

    Promise.all([search({ id: parseInt(id) })])
      .then(() => {
        // 查無資料則踢回上一頁
        if (!isSuccess.value) {
          goBack()
        }
      })
      .catch((e: any) => {
        // 取得資料失敗則踢回上一頁
        goBack()
      })
  })

  function onCancel() {
    router.push({ name: "DayReport" })
  }

  const isLoading = ref(false)
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
</style>
