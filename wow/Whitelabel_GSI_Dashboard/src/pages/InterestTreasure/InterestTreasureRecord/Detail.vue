<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="'btn.detail'" :custom-back-func="onBackTo" :custom-title="activityName" />
    <q-card class="bg-white">
      <!-- <q-card-section>
        <div class="text-h6">{{ $t("menu.Interest_treasure_record") }} - {{ activityName }}</div>
      </q-card-section> -->

      <q-card-section>
        <onlyPagination :total="totalSize" :configs="queryConfigs" @query-update="onQueryUpdate">
          <template #mainContent>
            <div v-if="loading" class="text-center q-py-xl">
              <q-spinner color="primary" size="50px" />
            </div>

            <!-- 表格 -->
            <q-table
              v-else
              :rows="tableData"
              :columns="tableColumn"
              class="table_v2"
              row-key="id"
              flat
              square
              hide-pagination
              :rows-per-page-options="[0]"
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td key="account" :props="props">
                    {{ props.row.account }}
                  </q-td>
                  <q-td key="principal" :props="props">
                    {{ props.row.principal ? Number(props.row.principal).toLocaleString() : "-" }}
                  </q-td>
                  <q-td key="refunded_time" :props="props">
                    {{ props.row.refunded_time ? genTimeFormat(props.row.refunded_time) : "-" }}
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ getStatusText(props.row.status) }}
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
          </template>
        </onlyPagination>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive } from "vue"
  import { useRouter, useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar, CustomQTableProps } from "quasar"
  import SubPage from "layouts/SubPage/Index.vue"
  import onlyPagination, { IQueryConfig } from "@/components/query/onlyPagination.vue"
  import { getInterestActivityApplicationRefunded } from "@/api/interest"
  import mockData from "@/../mock-data-interest-application.json"
  import { useCommon } from "@/hook/useCommon"

  const { genTimeFormat } = useCommon()

  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
  const $q = useQuasar()

  // 開發模式：設為 true 使用假資料，false 使用真實 API
  const USE_MOCK_DATA = false

  const loading = ref(false)
  const tableData = ref<any[]>([])
  const totalSize = ref(0)
  const activityName = ref((route.query.name as string) || "")

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  const onBackTo = () => {
    router.push({ name: "InterestTreasureInterestTreasureRecordList" })
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    return [
      {
        name: "account",
        label: t("table_header.member_account"),
        field: "account",
        sortable: false,
        align: "center"
      },
      {
        name: "principal",
        label: t("interest_treasure.principal"),
        field: "principal",
        sortable: false,
        align: "center"
      },
      {
        name: "refunded_time",
        label: t("interest_treasure.refund_time"),
        field: "refunded_time",
        sortable: false,
        align: "center"
      },
      {
        name: "status",
        label: t("table_header.status"),
        field: "status",
        sortable: false,
        align: "center"
      }
    ]
  })

  const getStatusText = (status?: number): string => {
    const statusMap: Record<number, string> = {
      1: t("interest_treasure.status_in_progress"),
      2: t("interest_treasure.status_refunded"),
      3: t("interest_treasure.status_not_dispatched"),
      4: t("interest_treasure.status_rejected"),
      5: t("interest_treasure.status_dispatched"),
      6: t("interest_treasure.status_system_dispatched"),
      7: t("interest_treasure.status_expires")
    }
    return status ? statusMap[status] || "-" : "-"
  }

  const loadDetail = async (offset = 0, size = 20) => {
    loading.value = true
    try {
      const activityId = Number(route.params.id)

      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        const mockResponse = mockData.getInterestActivityApplicationRefunded
        tableData.value = mockResponse.data.list
        activityName.value = `活動 ID: ${activityId} - 退還記錄`
        totalSize.value = mockResponse.data.list.length
      } else {
        const response = await getInterestActivityApplicationRefunded(activityId, { offset, size })
        if (response.code === 0 && response.data) {
          const data = response.data as any
          tableData.value = data.list || []
          totalSize.value = data.pagination?.total ?? 0
        }
      }
    } catch (error) {
      console.error("加載明細失敗:", error)
      $q.notify({
        type: "negative",
        message: t("message.load_failed"),
        position: "top"
      })
    } finally {
      loading.value = false
    }
  }

  const onQueryUpdate = async (queryForm: any) => {
    await loadDetail(queryForm.offset ?? 0, queryForm.size ?? 20)
  }
</script>

<style lang="scss" scoped>
  .no_data {
    padding: 40px 0;
  }
</style>
