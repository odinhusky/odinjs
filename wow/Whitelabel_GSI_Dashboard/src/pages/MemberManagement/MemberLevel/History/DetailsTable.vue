<template>
  <SubPage action-label-i18n-key="btn.modify_detail" :custom-back-func="onBack" />
  <div class="table-white-bg">
    <q-table
      square
      hide-pagination
      :rows-per-page-options="[0]"
      :rows="tableData"
      :columns="tableColumn"
      row-key="id"
      class="q-mt-md"
    >
      <template #body="props">
        <q-tr>
          <!-- 會員帳號 -->
          <q-td key="member_account" :props="props">
            {{ props.row.member_account }}
          </q-td>

          <!-- 推薦人 -->
          <q-td key="recommender" :props="props">
            {{ props.row.recommender }}
          </q-td>

          <!-- 會員層級 -->
          <q-td key="member_origin_level" :props="props">
            {{ $t(MEMBER_LEVEL.I18nKeys[props.row.member_origin_level] || "common.unknow") }}
          </q-td>

          <!-- 異動後層級 -->
          <q-td key="member_level" :props="props">
            {{ $t(MEMBER_LEVEL.I18nKeys[props.row.member_level] || "common.unknow") }}
          </q-td>

          <!-- 生日 -->
          <q-td key="birthday" :props="props">
            {{ genTimeFormat(props.row.birthday, "yyyy-MM-dd") }}
          </q-td>

          <!-- 會員標籤 -->
          <q-td key="member_tag" :props="props">
            {{ props.row.member_tag }}
          </q-td>

          <!-- 啟/停用 -->
          <q-td key="status" :props="props">
            <span v-if="props.row.status" class="text-blue">{{ $t("common.enable") }}</span>
            <span v-else class="text-negative">{{ $t("common.disable") }}</span>
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

  import SubPage from "layouts/SubPage/Index.vue"
  import { useCommon } from "@/hook/useCommon"
  import { MEMBER_LEVEL_MODIFY_TYPE, MEMBER_LEVEL } from "@/utils/constants"
  import type { MemberLevelHistoryDetailsItem } from "@/api/response.type"

  const { t } = useI18n()
  const { genTimeFormat } = useCommon()

  const props = defineProps({
    tableData: {
      type: Object as PropType<MemberLevelHistoryDetailsItem[]>,
      required: false,
      default: () => []
    }
  })

  const emit = defineEmits(["changeId"])

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    {
      name: "recommender",
      label: t("table_header.recommender"),
      field: "recommender",
      sortable: false,
      align: "center"
    },
    {
      name: "member_origin_level",
      label: t("table_header.member_level"),
      field: "member_origin_level",
      sortable: false,
      align: "center"
    },
    {
      name: "member_level",
      label: t("table_header.member_new_level"),
      field: "member_level",
      sortable: false,
      align: "center"
    },
    {
      name: "birthday",
      label: t("table_header.birthday"),
      field: "birthday",
      sortable: false,
      align: "center"
    },
    {
      name: "member_tag",
      label: t("table_header.member_tag"),
      field: "member_tag",
      sortable: false,
      align: "center"
    },
    {
      name: "status",
      label: t("table_header.enable_or_disable"),
      field: "status",
      sortable: false,
      align: "center"
    }
  ])

  const onBack = () => {
    emit("changeId", 0)
  }
</script>
