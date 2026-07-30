<template>
  <div class="p-4">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <q-table
          square
          hide-pagination
          :rows-per-page-options="[0]"
          :rows="tableData"
          :columns="tableColumn"
          table-header-class="bg-success"
          row-key="id"
        >
          <template #body-cell-index="props">
            <q-td :props="props">
              {{ currentOffset + props.rowIndex + 1 }}
            </q-td>
          </template>
          <template #body-cell-agent_view_status="props">
            <q-td :props="props">
              <div
                class="inline-flex items-center justify-center rounded-2xl px-3 py-1"
                :class="statusBadgeClassMap[Number(props.row.agent_view_status)] || ''"
              >
                {{ t(MemberInquiryStatusI18nKeys[Number(props.row.agent_view_status)]) }}
              </div>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="flex flex-nowrap justify-center gap-2">
                <q-btn flat fab-mini color="primary" @click="onView(props.row)">
                  <Icon icon="mdi:eye" width="18" />
                </q-btn>
                <q-btn
                  v-if="Number(props.row.agent_view_status) !== MemberInquiryStatus.CLOSED"
                  flat
                  fab-mini
                  color="negative"
                  @click="onClose(props.row)"
                >
                  <Icon icon="ri:chat-off-fill" width="18" />
                </q-btn>
              </div>
            </q-td>
          </template>
          <template #no-data>
            <div class="flex w-full items-center justify-center gap-2">{{ $t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from "vue"
  import { useQuasar } from "quasar"
  import type { QTableProps } from "quasar"
  import { Icon } from "@iconify/vue"
  import { useI18n } from "vue-i18n"

  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import { useConfirmDialog } from "@/composables/useConfirmDialog"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import { useSearch } from "@/hook/useSearch"
  import type { Request, Response } from "@/api/messageManagement"
  import {
    closeMemberInquiry,
    getMemberInquiries,
    getMemberInquiryDetail,
    MemberInquiryStatus,
    MemberInquiryStatusI18nKeys
  } from "@/api/messageManagement"
  import MemberInquiryDialog from "./components/MemberInquiryDialog.vue"

  const { t } = useI18n()
  const $q = useQuasar()
  const { confirmAction } = useConfirmDialog()
  const { formatDateTime } = useRfc3339()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useDatePicker: true,
    useMemberAccount: true,
    customFields: [
      {
        key: "status",
        type: "select",
        label: "table_header.status",
        defaultValue: MemberInquiryStatus.ALL,
        options: Object.entries(MemberInquiryStatusI18nKeys).map(([value, label]) => ({
          label,
          value: Number(value)
        }))
      }
    ]
  })

  const { search, tableData, totalSize } = useSearch(getMemberInquiries)
  const currentOffset = ref(0)
  let lastQueryForm: Request.GetMemberInquiryList = {}
  const statusBadgeClassMap: Record<number, string> = {
    [MemberInquiryStatus.UNREAD]: "bg-[#f0f2f5] text-[#6b6b6b]",
    [MemberInquiryStatus.READ]: "bg-[#f0ffe9] text-[#49a21d]",
    [MemberInquiryStatus.REPLIED]: "bg-[#f0ffe9] text-[#49a21d]",
    [MemberInquiryStatus.CLOSED]: "bg-[#fff9e8] text-[#6b6b6b]"
  }

  const onSubmit = async (queryForm: Request.GetMemberInquiryList) => {
    currentOffset.value = Number(queryForm.offset || 0)
    const { start, end, ...restQueryForm } = queryForm as Request.GetMemberInquiryList & {
      start?: string | number
      end?: string | number
    }
    const payload: Request.GetMemberInquiryList = {
      ...restQueryForm,
      start_date: start,
      end_date: end,
      status: Number(queryForm.status ?? MemberInquiryStatus.ALL)
    }
    lastQueryForm = payload
    await search(payload)
  }

  const onClose = async (row: Response.MemberInquiryItem) => {
    const ok = await confirmAction("close")
    if (!ok) {
      return
    }

    const res = await closeMemberInquiry(row.id)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.success"),
        position: "top",
        timeout: 300
      })
      await search(lastQueryForm)
      return
    }
    $q.notify({
      type: "negative",
      message: res.msg || t("message.error"),
      position: "top",
      timeout: 1000
    })
  }

  const onView = async (row: Response.MemberInquiryItem) => {
    const res = await getMemberInquiryDetail(row.id)
    if (res.code !== 0 || !res.data) {
      $q.notify({
        type: "negative",
        message: res.msg || t("message.error"),
        position: "top",
        timeout: 1000
      })
      return
    }

    $q.dialog({
      component: MemberInquiryDialog,
      componentProps: {
        inquiry: res.data,
        summary: {
          member_account: row.member_account,
          last_msg_at: row.last_msg_at,
          status: Number(row.agent_view_status)
        }
      }
    })
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "index",
      label: "No.",
      field: "index",
      align: "center"
    },
    {
      name: "member_account",
      label: t("table_header.sender"),
      field: "member_account",
      align: "center"
    },
    {
      name: "subject",
      label: t("table_header.subject"),
      field: "subject",
      align: "center"
    },
    {
      name: "last_msg_at",
      label: t("table_header.time"),
      field: "last_msg_at",
      format: (val: string) => (val ? formatDateTime(val) : "-"),
      align: "center"
    },
    {
      name: "agent_view_status",
      label: t("table_header.status"),
      field: "agent_view_status",
      format: (val: number) => {
        const i18nKey = MemberInquiryStatusI18nKeys[val]
        return i18nKey ? t(i18nKey) : "-"
      },
      align: "center"
    },
    {
      name: "actions",
      label: t("table_header.actions"),
      field: "actions",
      align: "center"
    }
  ])
</script>
