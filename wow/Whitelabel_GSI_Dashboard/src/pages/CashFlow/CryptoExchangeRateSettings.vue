<template>
  <div class="q-pa-md">
    <query v-model:total="totalSize" :configs="queryConfigs" @query-update="onSubmit">
      <template #mainContent>
        <q-table
          :rows="tableData"
          :columns="columns"
          :loading="false"
          row-key="crypto_id"
          flat
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template v-slot:body-cell-rate="props">
            <q-td :props="props">
              <q-number
                v-model="props.row.rate"
                :options="rateOptions"
                :readonly="!permission.permission.value.edit"
                dense
                square
                borderless
                class="edit-input"
                @focus="onRateFocus(props.row)"
                @blur="onRateBlur(props.row)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-enabled="props">
            <q-td :props="props">
              <q-toggle
                v-model="props.row.enabled"
                :color="props.row.enabled ? 'positive' : 'negative'"
                :disable="!permission.permission.value.edit"
                @update:model-value="onEnabledChange(props.row)"
              />
            </q-td>
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
  import { computed, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import { getCryptoExchangeRateList, setCryptoExchangeRate } from "@/api/paymentGateway"
  import type * as Response from "@/api/response.type"
  import type { QTableProps } from "quasar"
  import query, { IQueryConfig } from "@/components/query/common.vue"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()
  const $q = useQuasar()
  const permission = usePermission()

  const queryConfigs = computed<IQueryConfig>(() => ({
    submitOnLoaded: true,
    allowSameSubmit: true,
    usePagination: false
  }))

  const { search, spinShow, isSuccess, tableData, totalSize } = useSearch(getCryptoExchangeRateList)

  // 保存原始汇率值
  const originalRates = ref<Map<string, string | number>>(new Map())

  const rateOptions = {
    min: 0,
    precision: 8,
    minimumFractionDigits: 8,
    maximumFractionDigits: 8
  }

  const columns = computed<QTableProps["columns"]>(() => [
    {
      name: "currency_name",
      label: t("table_header.currency"),
      field: "currency_name",
      align: "center"
    },
    {
      name: "crypto_name",
      label: t("table_header.crypto"),
      field: "crypto_name",
      align: "center"
    },
    {
      name: "rate",
      label: t("table_header.exchange_rate"),
      field: "rate",
      align: "center"
    },
    {
      name: "enabled",
      label: t("table_header.status"),
      field: "enabled",
      align: "center"
    }
  ])

  const onRateFocus = (row: Response.CryptoExchangeRateItem) => {
    // 在编辑前保存当前值
    const key = `${row.crypto_id}_${row.currency_id}`
    if (!originalRates.value.has(key)) {
      originalRates.value.set(key, row.rate)
    }
  }

  const onRateBlur = async (row: Response.CryptoExchangeRateItem) => {
    // 检查汇率是否为 0（支持字符串和数字类型）
    const rateValue = typeof row.rate === "string" ? parseFloat(row.rate) : row.rate

    if (rateValue === 0 || isNaN(rateValue) || row.rate === null || row.rate === undefined) {
      // 生成唯一键
      const key = `${row.crypto_id}_${row.currency_id}`
      const originalRate = originalRates.value.get(key)

      // 恢复原始值
      if (originalRate !== undefined) {
        row.rate = originalRate as any
      }

      // 显示错误提示
      $q.notify({
        type: "negative",
        message: t("error_msg.the_rate_greater_than_0"),
        position: "top"
      })
      return
    }

    await saveCryptoExchangeRate(row)
  }

  const onEnabledChange = async (row: Response.CryptoExchangeRateItem) => {
    await saveCryptoExchangeRate(row)
  }

  const saveCryptoExchangeRate = async (row: Response.CryptoExchangeRateItem) => {
    try {
      // 确保 rate 以字符串格式发送，并保持 8 位小数精度
      const rateValue = typeof row.rate === "string" ? parseFloat(row.rate) : row.rate
      const rateString = rateValue.toFixed(8)

      await setCryptoExchangeRate({
        crypto_id: row.crypto_id,
        currency_id: row.currency_id,
        rate: rateString,
        enabled: row.enabled
      })

      // 保存成功后更新原始值
      const key = `${row.crypto_id}_${row.currency_id}`
      originalRates.value.set(key, rateString)

      $q.notify({
        type: "positive",
        message: t("message.edit_success"),
        position: "top"
      })
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async () => {
    await search()

    // 数据加载后保存原始汇率值
    if (tableData.value && tableData.value.length > 0) {
      originalRates.value.clear()
      tableData.value.forEach((item: Response.CryptoExchangeRateItem) => {
        const key = `${item.crypto_id}_${item.currency_id}`
        originalRates.value.set(key, item.rate)
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  @import "@/css/form.scss";

  ::v-deep(.custom-hide) {
    display: none;
  }

  .q-table__card {
    border-radius: 0;
  }
</style>
