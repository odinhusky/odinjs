<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn color="light-green" @click="onEdit('add')" v-if="permission.edit">
            {{ $t("btn.add_times") }}
          </q-btn>
          <q-btn class="q-ml-md" color="red-4" @click="onEdit('remove')" v-if="permission.edit">
            {{ $t("btn.remove_times") }}
          </q-btn>
        </div>
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
                <q-td key="start_time" :props="props">
                  {{ genTimeFormat(props.row.start_time, "yyyy-MM-dd HH:mm:ss") }} ~
                  {{ genTimeFormat(props.row.end_time, "yyyy-MM-dd HH:mm:ss") }}
                </q-td>
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>
                <q-td key="action" :props="props">
                  {{ $t(`${SPIN_COUNT_TYPE.I18nKeys[props.row.action as SPIN_COUNT_TYPE.Enums]}`) }}
                </q-td>
                <q-td key="spin_count_before" :props="props">
                  {{ props.row.spin_count_before }}
                </q-td>
                <q-td key="spin_count" :props="props">
                  {{ props.row.spin_count }}
                </q-td>
                <q-td key="spin_count_after" :props="props">
                  {{ props.row.spin_count_after }}
                </q-td>
                <q-td key="remark" :props="props">
                  {{ props.row.remark }}
                </q-td>
                <q-td key="created_at" :props="props">
                  {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm:ss") }}
                </q-td>
                <q-td key="created_by" :props="props">
                  {{ props.row.created_by }}
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
</template>

<script lang="ts" setup>
  import { reactive, computed, onMounted, onUnmounted, ref } from "vue"
  import { CustomQTableProps, useQuasar, Notify } from "quasar"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useEnv } from "@/hook/useEnv"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { getReferralWheelSpinCountLog } from "@/api/referralWheel"
  import type * as Request from "@/api/request.type"
  import type * as Response from "@/api/response.type"

  import { useExport } from "@/hook/useExport"
  import { usePermission } from "@/hook/usePermission"
  import { SPIN_COUNT_TYPE } from "@/utils/constants"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"
  const { genTimeFormat } = useCommon()

  const { permission } = usePermission()

  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()
  const { isAdminMode, isGeneralAgentMode, isAgentMode } = useEnv()
  const eventbus = injectStrict(EventBusKey)

  const queryConfigs = computed<IQueryConfig>(() => {
    const baseConfig: IQueryConfig = {
      submitOnLoaded: true,
      allowSameSubmit: true,
      usePagination: true,
      useMemberAccount: true,
      useSpinCountType: true,
      useDatePicker: true,
      useTimePicker: true,
      useReferralWheelList: true,
      customDateTimeLabelI18nKey: "query_params.modify_time"
    }

    return baseConfig
  })

  const tableColumn = computed<CustomQTableProps["columns"]>(() => {
    return [
      {
        name: "start_time",
        label: t("query_params.issue"),
        field: "start_time",
        sortable: false,
        align: "center"
      },
      {
        name: "member_account",
        label: t("table_header.member_account"),
        field: "member_account",
        sortable: false,
        align: "center"
      },
      {
        name: "action",
        label: t("table_header.quota_type"),
        field: "action",
        sortable: false,
        align: "center"
      },
      {
        name: "spin_count_before",
        label: t("table_header.spin_count_before"),
        field: "spin_count_before",
        sortable: false,
        align: "center"
      },
      {
        name: "spin_count",
        label: t("table_header.spin_count"),
        field: "spin_count",
        sortable: false,
        align: "center"
      },
      {
        name: "spin_count_after",
        label: t("table_header.spin_count_after"),
        field: "spin_count_after",
        sortable: false,
        align: "center"
      },
      {
        name: "remark",
        label: t("table_header.remark"),
        field: "remark",
        sortable: false,
        align: "center"
      },
      {
        name: "created_at",
        label: t("table_header.change_at"),
        field: "created_at",
        sortable: false,
        align: "center"
      },
      {
        name: "created_by",
        label: t("table_header.created_by"),
        field: "created_by",
        sortable: false,
        align: "center"
      }
    ]
  })

  const tableData = ref<Response.GetReferralWheelSpinCountLog["list"]>([])
  const totalSize = ref(1)
  const currentQueryForm = ref<any>({})

  const onSubmit = async (queryForm: any) => {
    console.log(queryForm)
    // 保存当前查询条件
    currentQueryForm.value = { ...queryForm }
    tableData.value.length = 0
    totalSize.value = 0
    const params = {
      start_time: genTimeFormat(queryForm.start, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", false),
      end_time: genTimeFormat(queryForm.end, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", false),
      offset: queryForm.offset,
      size: queryForm.size,
      member_account: queryForm.memberAccount,
      action: queryForm.spinCountType,
      referral_wheel_id: queryForm.referralWheelList
    }
    console.log(params)
    const res = await getReferralWheelSpinCountLog(params)
    if (res.data) {
      tableData.value = res.data?.list || []
      totalSize.value = res.data?.pagination.total || 0
    }
  }

  const onEdit = (type: "add" | "remove") => {
    eventbus.emit("handleEditInvitationRouletteTimesShow", { show: true, type })
  }

  // 监听弹窗关闭事件
  onMounted(() => {
    eventbus.on("handleEditInvitationRouletteTimesClose", (data) => {
      if (data.closed) {
        // 弹窗关闭后重新查询列表，使用保存的查询条件
        onSubmit(currentQueryForm.value)
      }
    })
  })

  onUnmounted(() => {
    eventbus.off("handleEditInvitationRouletteTimesClose")
  })
</script>
