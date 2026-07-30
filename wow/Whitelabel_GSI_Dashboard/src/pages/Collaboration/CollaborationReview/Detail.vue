<template>
  <SubPage :action-label-i18n-key="'common.detail'" :custom-back-func="onBackTo" />
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs">
      <template #mainContent>
        <div class="table-container">
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
                <!-- 帳號 -->
                <q-td key="member_account" :props="props">
                  {{ props.row.member_account }}
                </q-td>

                <!-- 註冊時間 -->
                <q-td key="registered_at" :props="props">
                  {{ genTimeFormat(props.row.registered_at, "yyyy-MM-dd HH:mm") }}
                </q-td>

                <!-- currency -->
                <q-td key="currency_id" :props="props">
                  {{ props.row.currency_code }}
                </q-td>
                <!-- 累計存款金額 -->
                <q-td key="deposit_amount" :props="props">
                  {{ moneyFormat(props.row.deposit_amount, 2) }}
                </q-td>
                <!-- 有效投注金額 -->
                <q-td key="valid_bet_amount" :props="props">
                  {{ moneyFormat(props.row.valid_bet_amount, 2) }} {{ props.row.currency_code }}
                </q-td>
                <!-- 獲得返水 -->
                <q-td key="rebate_amount" :props="props">
                  {{ moneyFormat(props.row.rebate_amount, 2) }}
                </q-td>
                <!-- 獲得優惠贈金 -->
                <q-td key="promotion_amount" :props="props">
                  {{ moneyFormat(props.row.promotion_amount, 2) }}
                </q-td>
                <!-- 金流手續費 -->
                <q-td key="payment_fee_amount" :props="props">
                  {{ moneyFormat(props.row.payment_fee_amount, 2) }}
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
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { useCommon } from "@/hook/useCommon"
  import { QTableProps } from "quasar"
  import { computed, onMounted, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { CollaborationReviewDetail } from "@/api/collaboration"
  import { useSearch } from "@/hook/useSearch"
  import SubPage from "layouts/SubPage/Index.vue"

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const { genTimeFormat, moneyFormat } = useCommon()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: false,
    usePagination: true
  })

  function goBack() {
    router.back()
  }
  const id = route.params.id as string
  const { search, spinShow, isSuccess, tableData, totalSize } = useSearch(CollaborationReviewDetail)

  const tableColumn = computed<QTableProps["columns"]>(() => [
    {
      name: "member_account",
      label: t("table_header.active_member_accounts"),
      field: "member_account",
      sortable: false,
      align: "center"
    },
    {
      name: "registered_at",
      label: t("table_header.registration_time"),
      field: "registered_at",
      sortable: false,
      align: "center"
    },
    {
      name: "currency_id",
      label: t("table_header.currency"),
      field: "currency_id",
      sortable: false,
      align: "center"
    },
    {
      name: "deposit_amount",
      label: t("table_header.total_deposit_amounts"),
      field: "deposit_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "valid_bet_amount",
      label: t("table_header.valid_bet_amount"),
      field: "valid_bet_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "rebate_amount",
      label: t("table_header.rebate_amount"),
      field: "rebate_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "promotion_amount",
      label: t("table_header.promotion_amount"),
      field: "promotion_amount",
      sortable: false,
      align: "center"
    },
    {
      name: "payment_fee_amount",
      label: t("table_header.payment_fee_amount"),
      field: "payment_fee_amount",
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

  function onBackTo() {
    router.back()
  }
</script>

<style lang="scss" scoped>
  ::v-deep(.custom-hide) {
    display: none;
  }
</style>
