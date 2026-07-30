<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t("menu.payment_type_management") }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-mb-lg">
          <div class="text-subtitle1 q-mb-md">{{ $t("edit_form.deposit_type") }}</div>
          <div class="row q-gutter-md">
            <q-checkbox
              v-model="form.payment_deposit_allowed_type"
              :val="1"
              :label="$t('fund_method_type.money_transfer')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
            <q-checkbox
              v-model="form.payment_deposit_allowed_type"
              :val="2"
              :label="$t('fund_method_type.third_party_payment')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
            <q-checkbox
              v-model="form.payment_deposit_allowed_type"
              :val="3"
              :label="$t('fund_method_type.crypto_wallet_trans')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
            <q-checkbox
              v-model="form.payment_deposit_allowed_type"
              :val="7"
              :label="$t('fund_method_type.crypto_wallet_third')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
            <q-checkbox
              v-model="form.payment_deposit_allowed_type"
              :val="6"
              :label="$t('fund_method_type.external_channel_transfer')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
          </div>
        </div>

        <div>
          <div class="text-subtitle1 q-mb-md">{{ $t("edit_form.withdrawal_type") }}</div>
          <div class="row q-gutter-md">
            <q-checkbox
              v-model="form.payment_withdraw_allowed_type"
              :val="1"
              :label="$t('fund_method_type.money_transfer')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
            <q-checkbox
              v-model="form.payment_withdraw_allowed_type"
              :val="2"
              :label="$t('fund_method_type.third_party_payment')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
            <q-checkbox
              v-model="form.payment_withdraw_allowed_type"
              :val="3"
              :label="$t('fund_method_type.crypto_wallet_trans')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
            <q-checkbox
              v-model="form.payment_withdraw_allowed_type"
              :val="7"
              :label="$t('fund_method_type.crypto_wallet_third')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
            <q-checkbox
              v-model="form.payment_withdraw_allowed_type"
              :val="6"
              :label="$t('fund_method_type.external_channel_transfer')"
              :disable="!permission.permission.value.edit"
              color="primary"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section align="middle">
        <q-btn
          color="primary"
          :label="$t('btn.cancel')"
          :loading="loading"
          :disable="!permission.permission.value.edit"
          @click="onCancel"
          outline
          class="q-mr-md"
        />
        <q-btn
          color="primary"
          :label="$t('btn.check')"
          :loading="loading"
          :disable="!permission.permission.value.edit"
          @click="onSubmit"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { getAvailableTypeSettings, putAvailableTypeSettings } from "@/api/common"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()
  const $q = useQuasar()
  const permission = usePermission()

  const loading = ref(false)

  const form = reactive({
    payment_deposit_allowed_type: [] as number[],
    payment_withdraw_allowed_type: [] as number[]
  })

  // 保存原始数据用于取消操作
  const originalData = reactive({
    payment_deposit_allowed_type: [] as number[],
    payment_withdraw_allowed_type: [] as number[]
  })

  const loadSettings = async () => {
    try {
      loading.value = true
      const { code, data } = await getAvailableTypeSettings()

      if (code === 0 && data) {
        // 解析返回的数据
        if (data.payment_deposit_allowed_type) {
          try {
            const depositTypes =
              typeof data.payment_deposit_allowed_type === "string"
                ? JSON.parse(data.payment_deposit_allowed_type)
                : data.payment_deposit_allowed_type
            form.payment_deposit_allowed_type = depositTypes || []
            originalData.payment_deposit_allowed_type = [...(depositTypes || [])]
          } catch (e) {
            form.payment_deposit_allowed_type = []
            originalData.payment_deposit_allowed_type = []
          }
        }

        if (data.payment_withdraw_allowed_type) {
          try {
            const withdrawTypes =
              typeof data.payment_withdraw_allowed_type === "string"
                ? JSON.parse(data.payment_withdraw_allowed_type)
                : data.payment_withdraw_allowed_type
            form.payment_withdraw_allowed_type = withdrawTypes || []
            originalData.payment_withdraw_allowed_type = [...(withdrawTypes || [])]
          } catch (e) {
            form.payment_withdraw_allowed_type = []
            originalData.payment_withdraw_allowed_type = []
          }
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      loading.value = false
    }
  }

  const onCancel = () => {
    // 恢复原始数据
    form.payment_deposit_allowed_type = [...originalData.payment_deposit_allowed_type]
    form.payment_withdraw_allowed_type = [...originalData.payment_withdraw_allowed_type]
  }

  const onSubmit = async () => {
    try {
      loading.value = true

      // 验证数组不为空
      if (form.payment_deposit_allowed_type.length === 0) {
        $q.notify({
          type: "negative",
          message: `${t("edit_form.deposit_type")} ${t("common.validate.at_least_one")}`,
          position: "top"
        })
        return
      }

      if (form.payment_withdraw_allowed_type.length === 0) {
        $q.notify({
          type: "negative",
          message: `${t("edit_form.withdrawal_type")} ${t("common.validate.at_least_one")}`,
          position: "top"
        })
        return
      }

      const payload: Record<string, any> = {
        payment_deposit_allowed_type: form.payment_deposit_allowed_type,
        payment_withdraw_allowed_type: form.payment_withdraw_allowed_type
      }

      const { code, msg } = await putAvailableTypeSettings(payload as any)

      if (code === 0) {
        // 更新原始数据为当前保存的数据
        originalData.payment_deposit_allowed_type = [...form.payment_deposit_allowed_type]
        originalData.payment_withdraw_allowed_type = [...form.payment_withdraw_allowed_type]

        $q.notify({
          type: "positive",
          message: t("message.edit_success"),
          position: "top"
        })
      }
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadSettings()
  })
</script>

<style lang="scss" scoped>
  @import "@/css/subPage.scss";
  @import "@/css/form.scss";
</style>
