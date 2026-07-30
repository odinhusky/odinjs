<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="row">
          <div class="col-12" style="max-width: 600px">
            <!-- 名稱 -->
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-xs">{{ $t("table_header.name") }}</div>
              <q-input v-model="form.name" outlined dense :rules="[(val) => !!val || $t('common.required')]" />
            </div>

            <!-- 金流類型 -->
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-xs">{{ $t("edit_form.fund_method") }}</div>
              <q-select
                v-model="form.type"
                :options="cashFlowTypeOptions"
                emit-value
                map-options
                outlined
                dense
                :disable="isEditMode"
                :rules="[(val) => (val !== null && val !== undefined) || $t('common.required')]"
                @update:model-value="onTypeChange"
              />
            </div>

            <!-- 金流商 -->
            <div class="q-mb-md">
              <div class="text-subtitle2 q-mb-xs">{{ $t("table_header.payment_provider") }}</div>
              <q-select
                v-model="form.payment_gateway_name"
                :options="gatewayMerchantOptions"
                emit-value
                map-options
                outlined
                dense
                :disable="!form.type || isEditMode"
                :rules="[(val) => !!val || $t('common.required')]"
                @update:model-value="onPaymentGatewayChange"
              />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="showGatewayInfo">
        <div class="row">
          <div class="col-12" style="max-width: 600px">
            <div class="text-h6 q-mb-md">{{ $t("edit_form.gateway_info") }}</div>
            <template v-for="(field, key) in gatewayConfig" :key="key">
              <!-- 只显示 is_show && is_editable 的字段 -->
              <div v-if="field.is_show && field.is_editable" class="q-mb-md">
                <div class="text-subtitle2 q-mb-xs">{{ field.column_name }}</div>
                <!-- Payment Gateway Channel Code - 特殊处理为 select -->
                <q-select
                  v-if="key === 'payment_gateway_channel_code'"
                  v-model="form.payload[key]"
                  :options="gatewayChannelOptions"
                  emit-value
                  map-options
                  outlined
                  dense
                  :readonly="!field.is_editable || isEditMode"
                  :rules="[
                    (val) => {
                      if (field.is_required) {
                        return !!val || $t('common.required')
                      }
                      return true
                    }
                  ]"
                />

                <!-- String -->
                <q-input
                  v-else-if="field.is_show && (field.column_type === 'string' || field.column_type === 'string_array')"
                  v-model="form.payload[key]"
                  outlined
                  dense
                  :readonly="key === 'mch_id' && isEditMode && !field.is_editable"
                  :rules="[
                    (val) => {
                      if (field.is_required) {
                        return !!val || $t('common.required')
                      }
                      return true
                    }
                  ]"
                />

                <!-- Int -->
                <q-input
                  v-else-if="field.is_show && field.column_type === 'int'"
                  v-model.number="form.payload[key]"
                  type="number"
                  outlined
                  dense
                  :readonly="!field.is_editable"
                  :rules="[
                    (val) => {
                      if (field.is_required) {
                        return (val !== null && val !== undefined && val !== '') || $t('common.required')
                      }
                      return true
                    }
                  ]"
                />

                <!-- String Array -->
                <!-- <q-select
                  v-else-if="field.column_type === 'string_array'"
                  v-model="form.payload[key]"
                  outlined
                  dense
                  multiple
                  use-chips
                  use-input
                  new-value-mode="add-unique"
                  :rules="[
                    (val) => {
                      if (field.is_required) {
                        return (val && val.length > 0) || $t('common.required')
                      }
                      return true
                    }
                  ]"
                /> -->

                <!-- Int Array -->
                <q-select
                  v-else-if="field.is_show && field.column_type === 'int_array'"
                  v-model="form.payload[key]"
                  outlined
                  dense
                  multiple
                  use-chips
                  use-input
                  new-value-mode="add-unique"
                  :readonly="!field.is_editable"
                  :rules="[
                    (val) => {
                      if (field.is_required) {
                        return (val && val.length > 0) || $t('common.required')
                      }
                      return true
                    }
                  ]"
                />
              </div>
            </template>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 操作按鈕 -->
    <div class="row q-mt-md q-gutter-sm">
      <q-btn outline color="main-color" :label="$t('btn.cancel')" @click="onCancel" />
      <q-btn color="main-color" :label="$t('btn.check')" :loading="loading" @click="onSubmit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useRoute, useRouter } from "vue-router"
  import { useQuasar } from "quasar"
  import {
    getGatewayMerchant,
    getGatewayConfig,
    postGatewayConnection,
    putGatewayConnection,
    getGatewayConnectionByPaymentGatewayName,
    getGatewayChannel
  } from "@/api/paymentGateway"
  import type * as Response from "@/api/response.type"
  import { FUND_METHOD_TYPE } from "@/utils/constants"

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const $q = useQuasar()

  const loading = ref(false)
  const isEditMode = computed(() => route.name === "CashFlowMerchantManagementEdit")

  const cashFlowTypeOptions = computed(() => [
    { label: t("fund_method_type.third_party_payment"), value: 2 },
    { label: t("fund_method_type.crypto_wallet_third"), value: 7 }
  ])

  const gatewayMerchantOptions = ref<{ label: string; value: string }[]>([])
  const gatewayConfig = ref<Response.GetGatewayConfig>({})
  const gatewayChannelOptions = ref<{ label: string; value: string }[]>([])
  const showGatewayInfo = computed(() => form.payment_gateway_name && Object.keys(gatewayConfig.value).length > 0)

  const form = reactive<{
    name: string
    type: number | null
    payment_gateway_name: string
    payload: Record<string, any>
  }>({
    name: "",
    type: null,
    payment_gateway_name: "",
    payload: {}
  })

  const onTypeChange = async () => {
    form.payment_gateway_name = ""
    gatewayMerchantOptions.value = []
    gatewayConfig.value = {}
    form.payload = {}

    if (form.type !== null && form.type !== undefined) {
      try {
        const response = await getGatewayMerchant({ type: form.type })
        gatewayMerchantOptions.value = response.data.map((item) => ({
          label: item.name,
          value: item.name
        }))
      } catch (error) {
        console.error("Failed to load gateway merchants:", error)
      }
    }
  }

  const convertDefaultValue = (field: Response.GatewayConfigField, key: string) => {
    if (!field.default_value) {
      // 没有默认值时根据类型设置空值
      if (field.column_type === "string_array" || field.column_type === "int_array") {
        return []
      } else if (field.column_type === "int") {
        return null
      } else {
        return ""
      }
    }

    if (key === "payment_gateway_channel_code") {
      // 如果 default_value 是数组，取第一个元素；否则直接返回字符串
      return Array.isArray(field.default_value) ? field.default_value[0] : field.default_value
    }

    // 根据字段类型转换默认值
    if (field.column_type === "string_array") {
      return Array.isArray(field.default_value) ? field.default_value : [field.default_value]
    } else if (field.column_type === "int_array") {
      if (Array.isArray(field.default_value)) {
        return field.default_value.map((v) => (typeof v === "string" ? parseInt(v) : v))
      } else {
        const numValue = typeof field.default_value === "string" ? parseInt(field.default_value) : field.default_value
        return [numValue]
      }
    } else if (field.column_type === "int") {
      return typeof field.default_value === "string" ? parseInt(field.default_value) : field.default_value
    } else {
      return field.default_value
    }
  }

  const onPaymentGatewayChange = async () => {
    gatewayConfig.value = {}
    form.payload = {}
    gatewayChannelOptions.value = []

    if (form.payment_gateway_name) {
      try {
        const response = await getGatewayConfig({
          payment_gateway_name: [form.payment_gateway_name]
        })
        gatewayConfig.value = response.data

        // Create 模式：所有字段使用 default_value 初始化，不管 is_show
        for (const [key, field] of Object.entries(gatewayConfig.value)) {
          form.payload[key] = convertDefaultValue(field, key)
        }

        // 如果配置中包含 payment_gateway_channel_code 字段，获取渠道选项
        if (gatewayConfig.value.payment_gateway_channel_code) {
          try {
            const channelResponse = await getGatewayChannel({
              payment_gateway_name: form.payment_gateway_name
            })
            gatewayChannelOptions.value = channelResponse.data.map((item: any) => ({
              label: `${item.name} (${item.code})`,
              value: item.code
            }))
          } catch (error) {
            console.error("Failed to load gateway channels:", error)
          }
        }
      } catch (error) {
        console.error("Failed to load gateway config:", error)
      }
    }
  }

  const onCancel = () => {
    router.push({ name: "CashFlowMerchantManagement" })
  }

  const onSubmit = async () => {
    // 检查基本字段
    if (!form.name || form.type === null || !form.payment_gateway_name) {
      console.log(form.name, form.type, form.payment_gateway_name)
      $q.notify({
        type: "negative",
        message: t("common.required"),
        position: "top"
      })
      return
    }

    // 检查所有 is_required 为 true 的字段
    const missingRequiredFields: string[] = []

    for (const [key, field] of Object.entries(gatewayConfig.value)) {
      if (field.is_required && field.is_show) {
        const value = form.payload[key]

        // 根据字段类型检查是否为空
        if (field.column_type === "string" || field.column_type === "string_array") {
          if (!value || (Array.isArray(value) && value.length === 0) || value === "") {
            missingRequiredFields.push(field.column_name)
          }
        } else if (field.column_type === "int") {
          if (value === null || value === undefined || value === "") {
            missingRequiredFields.push(field.column_name)
          }
        } else if (field.column_type === "int_array") {
          if (!value || !Array.isArray(value) || value.length === 0) {
            missingRequiredFields.push(field.column_name)
          }
        }
      }
    }
    if (missingRequiredFields.length > 0) {
      console.log("missingRequiredFields", missingRequiredFields)
      // 如果有必填字段未填写，显示错误信息
      $q.notify({
        type: "negative",
        message: `${t("common.required")}: ${missingRequiredFields.join(", ")}`,
        position: "top",
        timeout: 5000
      })
      return
    }
    // if (form.payload.payment_gateway_channel_code === 'default') {
    //   form.payload.payment_gateway_channel_code = ''
    // }

    loading.value = true
    try {
      if (isEditMode.value) {
        const payment_gateway_channel_code = route.query.payment_gateway_channel_code as string
        const payload = {
          ...form.payload
        }
        if (form.payload.payment_gateway_channel_code) {
          payload.payment_gateway_channel_code = String(form.payload.payment_gateway_channel_code)
        }
        await putGatewayConnection({
          name: form.name,
          payment_gateway_name: form.payment_gateway_name,
          type: form.type,
          payload: payload
        })
      } else {
        const payload = {
          ...form.payload
        }
        if (form.payload.payment_gateway_channel_code) {
          payload.payment_gateway_channel_code = String(form.payload.payment_gateway_channel_code)
        }
        const response = await postGatewayConnection({
          name: form.name,
          payment_gateway_name: form.payment_gateway_name,
          type: form.type,
          payload: payload
        })
        console.log(response)
        if (response.code === 334002) {
          $q.notify({
            type: "negative",
            message: t("error_msg.error_code_334002"),
            position: "top"
          })
          return
        }
      }

      $q.notify({
        type: "positive",
        message: t("save_status_type.success"),
        position: "top"
      })

      router.push({ name: "CashFlowMerchantManagement" })
    } catch (error) {
      console.error("Failed to save gateway connection:", error)
      $q.notify({
        type: "negative",
        message: t("save_status_type.fail"),
        position: "top"
      })
    } finally {
      loading.value = false
    }
  }

  const loadEditData = async () => {
    const payment_gateway_name = route.params.payment_gateway_name as string
    const payment_gateway_channel_code = route.query.payment_gateway_channel_code as string

    if (!payment_gateway_name || !payment_gateway_channel_code) {
      router.push({ name: "CashFlowMerchantManagement" })
      return
    }

    try {
      loading.value = true
      // 加载金流商选项
      await onTypeChange()

      // 先获取配置
      const configResponse = await getGatewayConfig({
        payment_gateway_name: [payment_gateway_name]
      })
      gatewayConfig.value = configResponse.data

      // 获取详细数据
      const detailResponse = await getGatewayConnectionByPaymentGatewayName({
        payment_gateway_name,
        payment_gateway_channel_code
      })

      const data = detailResponse.data as Response.GatewayConnectionDetail
      console.log(data)

      form.name = data.name
      form.type = data.type
      form.payment_gateway_name = data.payment_gateway_name

      // Update 模式：使用返回的 payload 数据，确保所有字段都存在
      form.payload = {}
      for (const [key, field] of Object.entries(gatewayConfig.value)) {
        // 优先使用返回的数据，如果没有则使用默认值
        if (data.payload && key in data.payload) {
          form.payload[key] = data.payload[key]
        } else {
          form.payload[key] = convertDefaultValue(field, key)
        }
      }

      form.payload.payment_gateway_channel_code = data.payment_gateway_channel_code

      // 如果配置中包含 payment_gateway_channel_code 字段，获取渠道选项
      if (gatewayConfig.value.payment_gateway_channel_code) {
        try {
          const channelResponse = await getGatewayChannel({
            payment_gateway_name: payment_gateway_name
          })
          gatewayChannelOptions.value = channelResponse.data.map((item: any) => ({
            label: `${item.name} (${item.code})`,
            value: item.code
          }))
        } catch (error) {
          console.error("Failed to load gateway channels:", error)
        }
      }
    } catch (error) {
      console.error("Failed to load edit data:", error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (isEditMode.value) {
      loadEditData()
    }
  })
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  @import "@/css/form.scss";
</style>
