<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
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
                <q-td key="period" :props="props">
                  {{ props.row.period }}
                </q-td>

                <q-td key="currency_id" :props="props">
                  {{ $t(CURRENCY_TYPE.I18nKeys[props.row.currency_id as CURRENCY_TYPE.Enums]) || "" }}
                </q-td>
                <q-td key="status" :props="props">
                  <template v-if="props.row.status === PROCESS_STATUS.Enums.PROCESS_STATUS_RELEASED">
                    {{ $t("common.published") }}
                  </template>
                  <template v-else>
                    {{ $t("common.unpublished") }}
                  </template>
                </q-td>
                <!-- 明細 -->
                <q-td key="actions" :props="props">
                  <q-btn color="light-blue" class="q-mr-xs btns" @click="onAction(props.row)">{{
                    $t("common.detail")
                  }}</q-btn>
                  <q-btn
                    color="green"
                    v-if="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_RELEASED"
                    class="q-mr-xs btns"
                    @click="onPost(props.row)"
                    :disable="props.row.status !== PROCESS_STATUS.Enums.PROCESS_STATUS_SETTLED"
                    >{{ $t("btn.publish") }}</q-btn
                  >
                  <q-btn color="red" v-else class="q-mr-xs btns" @click="onCancelPost(props.row)">{{
                    $t("btn.unpublish")
                  }}</q-btn>
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
  import { reactive, ref, computed } from "vue"
  import { useI18n } from "vue-i18n"
  import { CustomQTableProps, useQuasar } from "quasar"
  import { useRoute, useRouter } from "vue-router"
  import { PROCESS_STATUS, CURRENCY_TYPE } from "@/utils/constants"

  import { useCommon } from "@/hook/useCommon"
  import { useSearch } from "@/hook/useSearch"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import {
    getShareholdersDetailList,
    ShareholdersDetailPost,
    ShareholdersDetailCancelPost
  } from "@/api/shareholdersSetting"
  import type { GetShareholdersDetailList } from "@/api/request.type"

  const { t, locale } = useI18n()

  const queryConfigs = reactive<IQueryConfig>({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: true,
    useMemberAccount: true,
    useCurrency: true,
    /*useRewardType: true,*/
    useDatePicker: true
  })
  let { search, tableData, totalSize } = useSearch(getShareholdersDetailList)
  const { parseDate, moneyFormat } = useCommon()

  let catchQueryForm: GetShareholdersDetailList

  async function onSubmit(queryForm: any) {
    catchQueryForm = queryForm
    await search(queryForm)
  }

  const tableColumn = computed<CustomQTableProps["columns"]>(() => [
    {
      name: "period",
      label: t("table_header.settle_cycle"),
      field: "period",
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
      name: "status",
      label: t("table_header.publication_status"),
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
  ])
  const $q = useQuasar()

  const route = useRoute()
  const router = useRouter()
  const onAction = (row: any) => {
    const { start, end } = route.query
    const { currency } = catchQueryForm
    //const currency = row.currency
    //const payout_method = row.payout_method

    const { rate_base, status, version } = row

    router.push({
      name: "ShareholdersDetail",
      params: {
        id: row.id
      },
      query: {
        currency,
        start,
        end
      }
    })
  }
  const onPost = async (row: any) => {
    const res = await ShareholdersDetailPost(row.id)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.published_successfully"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }
  const onCancelPost = async (row: any) => {
    const res = await ShareholdersDetailCancelPost(row.id)
    if (res.code === 0) {
      $q.notify({
        type: "positive",
        message: t("message.cancellation_successful"),
        position: "top",
        timeout: 300
      })
      onSubmit(catchQueryForm)
    } else {
      $q.notify({
        type: "negative",
        message: res.msg,
        position: "top",
        timeout: 1000
      })
    }
  }
</script>

<style lang="scss" scoped>
  // 調整disable樣式
  .drag-container {
    opacity: 1 !important;

    .drag-icon {
      font-size: 30px;
      cursor: pointer !important;
    }
  }

  ::v-deep([disabled]) * {
    cursor: default !important;
  }
</style>
