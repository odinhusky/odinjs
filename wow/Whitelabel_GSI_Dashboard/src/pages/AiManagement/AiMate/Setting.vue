<template>
  <div class="q-pa-md ai-mate-wrapper">
    <div class="msk" v-if="!permission.edit"></div>

    <q-form @submit.prevent="onSubmit" class="ai-mate-form">
      <div class="row items-center field-row">
        <div class="col-3 col-md-2 field-label">{{ $t("ai_mate_connection.account_status") }}</div>
        <div class="col">
          <q-chip
            :color="isEnabled ? 'green' : 'red'"
            text-color="white"
            :label="isEnabled ? $t('ai_mate_connection.enabled') : $t('ai_mate_connection.disabled')"
            square
            class="status-chip"
          />
        </div>
      </div>

      <template v-if="!isConfigured">
        <div class="row items-center field-row">
          <div class="col-3 col-md-2 field-label">{{ $t("ai_mate_connection.email") }}：</div>
          <div class="col-9 col-md-6">
            <q-input
              v-model.trim="form.email"
              outlined
              dense
              bg-color="white"
              type="email"
              :rules="[
                (val) => !!val || $t('validation.required'),
                (val) => /.+@.+\..+/.test(val) || $t('validation.email')
              ]"
            />
          </div>
        </div>

        <div class="row items-center field-row">
          <div class="col-3 col-md-2 field-label">{{ $t("ai_mate_connection.distributor_code") }}：</div>
          <div class="col-9 col-md-6">
            <q-input
              v-model.trim="form.reseller_code"
              outlined
              dense
              bg-color="white"
              :rules="[(val) => !!val || $t('validation.required')]"
            />
          </div>
        </div>

        <div class="row justify-center q-mt-xl">
          <q-btn
            class="btns btn-blue confirm-btn"
            type="submit"
            :loading="spinShow"
            :disable="!permission.edit"
            :label="$t('btn.confirm')"
          />
        </div>
      </template>

      <template v-else>
        <div class="row items-center field-row">
          <div class="col-3 col-md-2 field-label">{{ $t("ai_mate_connection.user_id") }}</div>
          <div class="col-9 col-md-6">
            <q-input v-model="info.ai_mate_user_id" readonly outlined dense bg-color="grey-4">
              <template v-slot:append>
                <q-icon name="content_copy" class="cursor-pointer" @click="onCopy(info.ai_mate_user_id)" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row items-center field-row">
          <div class="col-3 col-md-2 field-label">{{ $t("ai_mate_connection.api_key") }}</div>
          <div class="col-9 col-md-6">
            <q-input v-model="info.api_key" readonly outlined dense bg-color="grey-4">
              <template v-slot:append>
                <q-icon name="content_copy" class="cursor-pointer" @click="onCopy(info.api_key)" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row items-start field-row">
          <div class="col-3 col-md-2 field-label q-pt-xs">{{ $t("ai_mate_connection.api_secret") }}</div>
          <div class="col-9 col-md-6">
            <q-input
              :model-value="apiSecretDisplay"
              readonly
              outlined
              dense
              bg-color="grey-4"
              :input-class="{ 'secret-dots': !info.api_secret }"
            >
              <template v-slot:append v-if="!info.is_secret_revealed && info.api_secret">
                <q-icon name="content_copy" class="cursor-pointer" @click="onCopy(info.api_secret)" />
              </template>
            </q-input>
            <div class="secret-hint q-mt-xs">＊{{ $t("ai_mate_connection.secret_hint") }}</div>
          </div>
        </div>
      </template>
    </q-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from "vue"
  import { useQuasar } from "quasar"
  import { useI18n } from "vue-i18n"
  import { usePermission } from "@/hook/usePermission"
  import { getAiMateInfo, bindAiMate } from "@/api/ai"
  import type { AiMateSetting } from "@/api/response.type"
  import { ERROR_CODE } from "@/utils/constants"

  const { permission } = usePermission()
  const { t, te } = useI18n()
  const $q = useQuasar()

  const spinShow = ref(false)
  const loading = ref(false)

  const info = reactive<AiMateSetting>({
    is_bound: false,
    ai_mate_user_id: "",
    api_key: "",
    api_secret: "",
    is_secret_revealed: false
  })

  const form = reactive({
    email: "",
    reseller_code: ""
  })

  const isConfigured = computed(() => info.is_bound)
  const isEnabled = computed(() => info.is_bound)
  const apiSecretDisplay = computed(() => info.api_secret || "．".repeat(12))

  async function fetchInfo() {
    loading.value = true
    try {
      const res = await getAiMateInfo()
      if (res?.code === 0 && res.data) {
        Object.assign(info, res.data)
      }
    } finally {
      loading.value = false
    }
  }

  async function onSubmit() {
    spinShow.value = true
    try {
      const res = await bindAiMate({
        email: form.email,
        reseller_code: form.reseller_code
      })

      if (res?.code === 0 && res.data) {
        Object.assign(info, res.data)
        $q.notify({
          type: "positive",
          message: t("ai_mate_connection.register_success"),
          position: "top",
          timeout: 1500
        })
        return
      }

      const excode = (res?.data as any)?.excode as string | undefined
      const excodeKey = excode ? `ai_mate_connection.error.${excode}` : ""
      const codeKey = ERROR_CODE.I18nKeys[res?.code as ERROR_CODE.Enums] as string | undefined
      const message =
        excodeKey && te(excodeKey)
          ? t(excodeKey)
          : codeKey && te(codeKey)
            ? t(codeKey)
            : res?.msg || t("message.edit_fail")
      $q.notify({ type: "negative", message, position: "top", timeout: 2500 })
    } finally {
      spinShow.value = false
    }
  }

  async function onCopy(value: string) {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      $q.notify({ type: "positive", message: t("message.copy_completed"), position: "top", timeout: 1000 })
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(() => {
    fetchInfo()
  })
</script>

<style scoped lang="scss">
  .ai-mate-wrapper {
    position: relative;
    min-height: 400px;
  }
  .msk {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: not-allowed;
  }
  .ai-mate-form {
    padding: 8px 16px;
  }
  .field-row {
    margin-bottom: 20px;
  }
  .field-label {
    font-weight: 600;
    color: #333;
  }
  .status-chip {
    font-weight: 600;
    :deep(.q-chip__content) {
      min-width: 56px;
      justify-content: center;
    }
  }
  :deep(.secret-dots) {
    letter-spacing: 4px;
  }
  .secret-hint {
    color: #d50000;
    font-size: 12px;
    font-weight: 600;
  }
  .confirm-btn {
    min-width: 96px;
  }
</style>
