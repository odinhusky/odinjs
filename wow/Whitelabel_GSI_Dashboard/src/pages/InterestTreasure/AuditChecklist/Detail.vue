<template>
  <div class="q-pa-md">
    <SubPage :action-label-i18n-key="'btn.detail'" :custom-back-func="onBackTo" :custom-title="activityName" />
    <q-card class="bg-white">
      <!-- <q-card-section>
        <div class="text-h6">{{ $t("menu.audit_checklist") }} - {{ activityName }}</div>
      </q-card-section> -->

      <q-card-section>
        <!-- 批量操作按鈕 -->
        <div class="row q-mb-md justify-start">
          <q-btn
            @click="handleBatchDispatch"
            class="btns btn-green q-mr-sm"
            :disable="isBatchDispatching"
            :loading="isBatchDispatching"
          >
            {{ selectedRows.length > 0 ? $t("btn.batch_distribute") : $t("btn.distribute_all") }}
            {{ selectedRows.length > 0 ? `(${selectedRows.length})` : "" }}
          </q-btn>
        </div>

        <onlyPagination :total="totalSize" :configs="queryConfigs" @query-update="onQueryUpdate">
          <template #mainContent>
            <div v-if="loading" class="text-center q-py-xl">
              <q-spinner color="primary" size="50px" />
            </div>

            <!-- 表格 -->
            <q-table
              v-else
              v-model:selected="selectedRows"
              :rows="tableData"
              :columns="tableColumn"
              class="table_v2"
              row-key="id"
              flat
              square
              hide-pagination
              :rows-per-page-options="[0]"
              selection="multiple"
            >
              <template #header="props">
                <q-tr :props="props">
                  <q-th auto-width>
                    <q-checkbox
                      v-model="selectAll"
                      @update:model-value="toggleSelectAll"
                      :disable="!hasSelectableRows"
                    />
                  </q-th>
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <template #body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-checkbox v-model="props.selected" :disable="isRowDisabled(props.row)" />
                  </q-td>
                  <q-td key="account" :props="props">
                    {{ props.row.account }}
                  </q-td>
                  <q-td key="principal" :props="props">
                    {{ props.row.principal ? Number(props.row.principal).toLocaleString() : "-" }}
                  </q-td>
                  <q-td key="stored_days" :props="props">
                    {{ props.row.stored_days ?? "-" }}
                  </q-td>
                  <q-td key="interest_rate" :props="props">
                    {{ props.row.interest_rate != null ? `${props.row.interest_rate}%` : "-" }}
                  </q-td>
                  <q-td key="current_expected_interest" :props="props">
                    {{
                      props.row.current_expected_interest != null
                        ? Number(props.row.current_expected_interest).toLocaleString()
                        : "-"
                    }}
                  </q-td>
                  <q-td key="complete_time" :props="props">
                    {{ props.row.complete_time ? genTimeFormat(props.row.complete_time) : "-" }}
                  </q-td>
                  <q-td key="dispatch_type" :props="props">
                    {{ getDispatchTypeText(props.row.dispatch_type) }}
                  </q-td>
                  <q-td key="status" :props="props">
                    {{ getStatusText(props.row.status) }}
                  </q-td>
                  <q-td key="actions" :props="props">
                    <q-btn
                      flat
                      dense
                      color="positive"
                      :disable="isRowDisabled(props.row)"
                      @click="handleSingleDispatch(props.row)"
                    >
                      {{ $t("btn.distribute") }}
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      color="negative"
                      :disable="isRowDisabled(props.row)"
                      @click="handleSingleReject(props.row)"
                    >
                      {{ $t("btn.reject") }}
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
          </template>
        </onlyPagination>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, reactive, watch } from "vue"
  import { useRouter, useRoute } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useQuasar, CustomQTableProps } from "quasar"
  import SubPage from "layouts/SubPage/Index.vue"
  import onlyPagination, { IQueryConfig } from "@/components/query/onlyPagination.vue"
  import {
    getInterestActivityApplicationAuditing,
    dispatchInterestApplication,
    rejectInterestApplication
  } from "@/api/interest"
  import type * as Request from "@/api/request.type"
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
  const selectedRows = ref<any[]>([])
  const isBatchDispatching = ref(false)
  const selectAll = ref(false)

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true
  })

  const onBackTo = () => {
    router.push({ name: "InterestTreasureAuditChecklistList" })
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
        name: "stored_days",
        label: t("interest_treasure.lock_period_days"),
        field: "stored_days",
        sortable: false,
        align: "center"
      },
      {
        name: "interest_rate",
        label: t("interest_treasure.interest_rate"),
        field: "interest_rate",
        sortable: false,
        align: "center"
      },
      {
        name: "current_expected_interest",
        label: t("interest_treasure.interest"),
        field: "current_expected_interest",
        sortable: false,
        align: "center"
      },
      {
        name: "complete_time",
        label: t("interest_treasure.complete_time"),
        field: "complete_time",
        sortable: false,
        align: "center"
      },
      {
        name: "dispatch_type",
        label: t("query_params.distribution_type"),
        field: "dispatch_type",
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
        name: "actions",
        label: t("table_header.actions"),
        field: "actions",
        sortable: false,
        align: "center"
      }
    ]
  })

  const isRowDisabled = (row: any): boolean => {
    if (row.dispatch_type === 2) return true
    if (row.status !== 1 && row.status !== 3) return true
    return false
  }

  const hasSelectableRows = computed(() => {
    return tableData.value.some((row) => !isRowDisabled(row))
  })

  const toggleSelectAll = (value: boolean) => {
    if (value) {
      selectedRows.value = tableData.value.filter((row) => !isRowDisabled(row))
    } else {
      selectedRows.value = []
    }
  }

  watch(
    selectedRows,
    (newSelected) => {
      const selectableRows = tableData.value.filter((row) => !isRowDisabled(row))
      if (selectableRows.length === 0) {
        selectAll.value = false
      } else {
        selectAll.value = selectableRows.every((row) => newSelected.some((selected) => selected.id === row.id))
      }
    },
    { deep: true }
  )

  const getDispatchTypeText = (type?: number): string => {
    if (type === 1) return t("reward_type.manual")
    if (type === 2) return t("reward_type.auto")
    return "-"
  }

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
        const mockResponse = mockData.getInterestActivityApplicationAuditing
        tableData.value = mockResponse.data.list
        totalSize.value = mockResponse.data.list.length
      } else {
        const response = await getInterestActivityApplicationAuditing(activityId, { offset, size })
        if (response.code === 0 && response.data) {
          const data = response.data as any
          tableData.value = data.list || []
          totalSize.value = data.pagination?.total ?? 0
        }
      }
      selectedRows.value = []
      selectAll.value = false
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

  // 單筆派發
  const handleSingleDispatch = async (row: any) => {
    $q.dialog({
      title: t("btn.confirm"),
      message: `確認派發給會員 ${row.account} ?`,
      cancel: true
    }).onOk(async () => {
      try {
        if (USE_MOCK_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          row.status = 5
          row.complete_time = new Date().toISOString()
          selectedRows.value = selectedRows.value.filter((r) => r.id !== row.id)
          selectAll.value = false
          $q.notify({ type: "positive", message: "派發成功", position: "top" })
        } else {
          const params: Request.DispatchInterestApplication = { application_ids: [row.id] }
          const response = await dispatchInterestApplication(params)
          if (response.code === 0) {
            $q.notify({ type: "positive", message: t("message.dispatch_success"), position: "top" })
            await loadDetail()
          } else {
            $q.notify({ type: "negative", message: response.msg || t("message.dispatch_failed"), position: "top" })
          }
        }
      } catch (error) {
        console.error("派發失敗:", error)
        $q.notify({ type: "negative", message: t("message.dispatch_failed"), position: "top" })
      }
    })
  }

  // 單筆拒絕
  const handleSingleReject = async (row: any) => {
    try {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        row.status = 4
        row.complete_time = new Date().toISOString()
        selectedRows.value = selectedRows.value.filter((r) => r.id !== row.id)
        selectAll.value = false
        $q.notify({ type: "positive", message: "已拒絕", position: "top" })
      } else {
        const params: Request.RejectInterestApplication = { remark: "" }
        const response = await rejectInterestApplication(params, row.id)
        if (response.code === 0) {
          $q.notify({ type: "positive", message: t("message.reject_success"), position: "top" })
          await loadDetail()
        } else {
          $q.notify({ type: "negative", message: response.msg || t("message.reject_failed"), position: "top" })
        }
      }
    } catch (error) {
      console.error("拒絕失敗:", error)
      $q.notify({ type: "negative", message: t("message.reject_failed"), position: "top" })
    }
  }

  // 批量派發
  const handleBatchDispatch = async () => {
    let applicationIds: number[] = []
    let confirmMessage = ""

    if (selectedRows.value.length === 0) {
      const dispatchableRows = tableData.value.filter((row) => !isRowDisabled(row))
      if (dispatchableRows.length === 0) {
        $q.notify({ type: "warning", message: "沒有可派發的申請", position: "top" })
        return
      }
      applicationIds = dispatchableRows.map((row) => row.id)
      confirmMessage = `確認派發所有可派發的申請 (共 ${applicationIds.length} 筆) ?`
    } else {
      applicationIds = selectedRows.value.map((row) => row.id)
      confirmMessage = `確認派發選中的 ${applicationIds.length} 筆申請？`
    }

    $q.dialog({
      title: t("btn.confirm"),
      message: confirmMessage,
      cancel: true
    }).onOk(async () => {
      isBatchDispatching.value = true
      try {
        if (USE_MOCK_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 800))
          const currentTime = new Date().toISOString()
          tableData.value.forEach((row) => {
            if (applicationIds.includes(row.id)) {
              row.status = 5
              row.complete_time = currentTime
            }
          })
          selectedRows.value = []
          selectAll.value = false
          $q.notify({ type: "positive", message: `成功派發 ${applicationIds.length} 筆申請`, position: "top" })
        } else {
          const params: Request.DispatchInterestApplication = { application_ids: applicationIds }
          const response = await dispatchInterestApplication(params)
          if (response.code === 0) {
            $q.notify({ type: "positive", message: `成功派發 ${applicationIds.length} 筆申請`, position: "top" })
            selectedRows.value = []
            selectAll.value = false
            await loadDetail()
          } else {
            $q.notify({ type: "negative", message: response.msg || t("message.dispatch_failed"), position: "top" })
          }
        }
      } catch (error) {
        console.error("批量派發失敗:", error)
        $q.notify({ type: "negative", message: t("message.dispatch_failed"), position: "top" })
      } finally {
        isBatchDispatching.value = false
      }
    })
  }
</script>

<style lang="scss" scoped>
  .no_data {
    padding: 40px 0;
  }

  :deep(.q-btn) {
    .disabled {
      opacity: 0.5;
    }
  }
</style>
