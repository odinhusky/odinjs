<template>
  <div class="table-white-bg">
    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="props.tableData"
      :columns="tableColumn"
      row-key="id"
    >
      <template #body="props">
        <q-tr>
          <!-- 異動日期 -->
          <q-td key="modify_date" :props="props">
            {{ genTimeFormat(props.row.created_at, "yyyy-MM-dd HH:mm") }}
          </q-td>

          <!-- 操作人 -->
          <q-td key="operator" :props="props">
            {{ props.row.operator }}
          </q-td>

          <!-- 會員層級 -->
          <q-td key="member_level" :props="props"> VIP {{ props.row.member_level }} </q-td>

          <!-- 異動方式 -->
          <q-td key="modify_type" :props="props">
            {{
              $t(MEMBER_LEVEL_MODIFY_TYPE.I18nKeys[props.row.type as MEMBER_LEVEL_MODIFY_TYPE.Enums] || "common.unknow")
            }}
          </q-td>

          <!-- 生日 -->
          <q-td key="modify_reason" :props="props">
            {{ props.row.reason }}
          </q-td>

          <!-- 異動明細 -->
          <q-td key="actions" :props="props">
            <q-btn flat fab-mini icon="report" color="secondary" @click="onAction(props.row)">
              <q-tooltip anchor="top middle" self="bottom middle">{{ $t("btn.modify_detail") }}</q-tooltip>
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
</template>

<script lang="ts" setup>
  import { PropType, computed, defineProps, defineEmits } from "vue"
  import { useI18n } from "vue-i18n"
  import { QTableProps } from "quasar"

  import { useCommon } from "@/hook/useCommon"
  import { MEMBER_LEVEL_MODIFY_TYPE } from "@/utils/constants"
  import type { MemberLevelHistoryItem } from "@/api/response.type"
  import { getMemberLevelModifyHistory } from "@/api/memberLevel"

  const { t } = useI18n()
  const { genTimeFormat } = useCommon()

  const { search, tableData, totalSize } = useSearch(getMemberLevelModifyHistory)

  async function onSubmit(queryForm: MemberLevelHistoryItem) {
    await search(queryForm)
  }

  const emit = defineEmits(["changeId"])

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "modify_date",
      label: t("table_header.modify_date"),
      field: "modify_date",
      sortable: false,
      align: "center"
    },
    {
      name: "operator",
      label: t("table_header.operator"),
      field: "operator",
      sortable: false,
      align: "center"
    },
    {
      name: "member_level",
      label: t("table_header.member_level"),
      field: "member_level",
      sortable: false,
      align: "center"
    },
    {
      name: "modify_type",
      label: t("table_header.modify_type"),
      field: "modify_type",
      sortable: false,
      align: "center"
    },
    {
      name: "modify_reason",
      label: t("table_header.modify_reason"),
      field: "modify_reason",
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
  ])

  const onAction = (row: MemberLevelHistoryItem) => {
    emit("changeId", row.id)
  }
</script>
