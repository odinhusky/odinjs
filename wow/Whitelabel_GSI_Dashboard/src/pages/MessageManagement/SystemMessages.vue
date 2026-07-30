<template>
  <div class="p-4">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <div class="row q-mb-md justify-start">
          <q-btn outline color="main-color" @click="onCreate">
            <q-icon class="q-mr-xs" size="xs" name="add_circle_outline" />
            {{ t("message_notification.create") }}
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
          <template #body-cell-status="props">
            <q-td :props="props">
              <div
                class="inline-flex items-center justify-center rounded-2xl px-3 py-1"
                :class="statusBadgeClassMap[props.row.status]"
              >
                {{ t(MessageNotificationStatusI18nKeys[props.row.status]) }}
              </div>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="flex flex-nowrap justify-center gap-2">
                <q-btn flat fab-mini color="primary" @click="onView(props.row)">
                  <Icon icon="mdi:eye" width="18" />
                </q-btn>
                <q-btn flat fab-mini color="negative" @click="onDelete(props.row)">
                  <Icon icon="solar:trash-bin-minimalistic-2-bold" width="18" />
                </q-btn>
              </div>
            </q-td>
          </template>
          <template #no-data>
            <div class="flex w-full items-center justify-center gap-2">{{ t("common.no_data") }}</div>
          </template>
        </q-table>
      </template>
    </query>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive } from "vue"
  import { storeToRefs } from "pinia"
  import { useQuasar } from "quasar"
  import type { QTableProps } from "quasar"
  import { Icon } from "@iconify/vue"
  import { useI18n } from "vue-i18n"

  import type { IQueryConfig } from "@/components/query/common.vue"
  import query from "@/components/query/common.vue"
  import SystemMessageDialog from "./components/SystemMessageDialog.vue"
  import { useConfirmDialog } from "@/composables/useConfirmDialog"
  import { useRfc3339 } from "@/composables/useRfc3339"
  import { useSearch } from "@/hook/useSearch"
  import { useSiteStore } from "@/stores/siteStore"
  import type { Request, Response } from "@/api/messageManagement"
  import {
    deleteSystemMessage,
    getSystemMessageDetail,
    getSystemMessages,
    MessageNotificationStatus,
    MessageNotificationStatusI18nKeys,
    MessageNotificationTargetTypeI18nKeys
  } from "@/api/messageManagement"

  const { t, locale } = useI18n()
  const $q = useQuasar()
  const { confirm } = useConfirmDialog()
  const { formatDateTime } = useRfc3339()
  const siteStore = useSiteStore()
  const { langList } = storeToRefs(siteStore)

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useDatePicker: true,
    useMemberAccount: true,
    customFields: [
      {
        type: "select",
        key: "status",
        label: "table_header.status",
        clearable: true,
        options: [
          {
            label: t("message_notification.status.sent"),
            value: MessageNotificationStatus.SENT
          },
          {
            label: t("message_notification.status.failed"),
            value: MessageNotificationStatus.FAILED
          }
        ]
      }
    ]
  })

  const { search, tableData, totalSize } = useSearch(getSystemMessages)
  let lastQueryForm: Request.GetMessageNotificationList = {}
  const statusBadgeClassMap: Record<number, string> = {
    [MessageNotificationStatus.SENT]: "bg-[#f0ffe9] text-[#49a21d]",
    [MessageNotificationStatus.FAILED]: "bg-[#fff0f0] text-[#c10015]"
  }

  type QueryForm = Request.GetMessageNotificationList

  const onSubmit = async (queryForm: QueryForm) => {
    const payload: Request.GetMessageNotificationList = { ...queryForm }
    lastQueryForm = payload
    await search(payload)
  }

  const onView = async (row: Response.MessageNotificationItem) => {
    const res = await getSystemMessageDetail(row.id)
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
      component: SystemMessageDialog,
      componentProps: {
        message: res.data,
        isReadonly: true
      }
    })
  }

  const onCreate = () => {
    const currentLang = (locale.value || "en").toLowerCase()
    const siteLanguages = (langList.value || []).map((item) => String(item.label || "").toLowerCase()).filter(Boolean)
    const translationLangs = siteLanguages.length ? siteLanguages : [currentLang]
    $q.dialog({
      component: SystemMessageDialog,
      componentProps: {
        message: {
          id: 0,
          target_type: 0,
          sender_account: "",
          published_at: "",
          status: 0,
          translations: translationLangs.map((lang) => ({ lang, subject: "", content: "", images: [] }))
        },
        isReadonly: false
      }
    }).onOk(async () => {
      await search(lastQueryForm)
    })
  }

  const onDelete = async (row: Response.MessageNotificationItem) => {
    const isConfirmed = await confirm({
      message: t("common.sure_to_delete_announcement")
    })

    if (!isConfirmed) return

    const res = await deleteSystemMessage(row.id)
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

  const tableColumn = computed<QTableProps["columns"]>(() => {
    const preferredLocale = (locale.value || "").toLowerCase()

    return [
      { name: "id", label: t("table_header.id"), field: "id", align: "center" },
      {
        name: "receiver",
        label: t("table_header.receiver"),
        field: "target_type",
        format: (val: number) => {
          const key = MessageNotificationTargetTypeI18nKeys[val]
          return key ? t(key) : "-"
        },
        align: "center"
      },
      {
        name: "sender_account",
        label: t("table_header.sender"),
        field: "sender_account",
        align: "center"
      },
      {
        name: "subject",
        label: t("table_header.subject"),
        field: (row: Response.MessageNotificationItem) => {
          const matched = (row.translations || []).find((item) => item.lang.toLowerCase() === preferredLocale)
          return matched?.subject ? String(matched.subject).trim() : ""
        },
        align: "center"
      },
      {
        name: "published_at",
        label: t("table_header.time"),
        field: "published_at",
        format: (val: string) => (val ? formatDateTime(val) : "-"),
        align: "center"
      },
      {
        name: "status",
        label: t("table_header.status"),
        field: "status",
        align: "center"
      },
      {
        name: "actions",
        label: t("table_header.actions"),
        field: "actions",
        align: "center"
      }
    ]
  })
</script>
