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
              <!-- 會員帳號 -->
              <q-td key="member_account" :props="props">
                {{ props.row.member_account }}
              </q-td>

              <!-- 會員名稱 -->
              <q-td key="member_name" :props="props">
                {{ props.row.member_name }}
              </q-td>

              <!-- 註冊時間 -->
              <q-td key="created_on" :props="props">
                {{ genTimeFormat(props.row.created_on) }}
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

  import { getDayReportRegistDetail } from "@/api/report"
  import { useSearch } from "@/hook/useSearch"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { genTimeFormat } = useCommon()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useDatePicker: true
  })

  function goBack() {
    router.back()
  }

  const { search, spinShow, isSuccess, tableData, totalSize } = useSearch(getDayReportRegistDetail)

  async function onSubmit(queryForm: any) {
    await search(queryForm)
  }

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.member_account"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    {
      name: "member_name",
      label: t("table_header.member_name"),
      field: "member_name",
      sortable: false,
      align: "center"
    },
    {
      name: "created_on",
      label: t("table_header.created_on"),
      field: "created_on",
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
