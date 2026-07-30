<template>
  <div class="email-config">
    <q-form @submit="handleSmtpSubmit">
      <q-card class="q-pa-md bg-transparent" flat>
        <q-card-section class="email-config-title">Email{{ $t("btn.settings") }}</q-card-section>
        <q-card-section class="email-config-panel">
          <div class="field-block">
            <div class="field-label">{{ $t("emailType") }}</div>
            <q-btn-toggle
              v-model="smtpForm.type"
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              class="email-type-toggle"
              :options="smtpTypeOptions"
            />
          </div>

          <div class="field-block">
            <div class="field-label">
              Email
              <q-icon name="error" color="grey" size="1rem" class="cursor-pointer">
                <q-tooltip class="smtp-tooltip">{{ $t("smtpHint") }}</q-tooltip>
              </q-icon>
            </div>
            <q-input
              v-model="smtpForm.username"
              dense
              outlined
              class="email-input"
              :placeholder="$t('common.please_enter_email')"
            />
          </div>

          <div class="field-block">
            <div class="field-label row items-center no-wrap">
              <span>App Key</span>
              <q-btn
                flat
                dense
                no-caps
                color="primary"
                class="access-method-btn"
                @click="isAccessMethodVisible = !isAccessMethodVisible"
              >
                {{ $t("viewAccessMethod") }}
                <q-icon :name="isAccessMethodVisible ? 'expand_less' : 'expand_more'" size="1rem" />
              </q-btn>
            </div>
            <q-input
              v-model="appKeyDisplay"
              dense
              outlined
              class="email-input"
              :placeholder="$t('common.please_enter_content')"
              @focus="handleAppKeyFocus"
              @blur="handleAppKeyBlur"
              @update:model-value="handleAppKeyUpdate"
            />
          </div>

          <div v-if="isAccessMethodVisible" class="access-method-panel">
            <template v-if="smtpForm.type === EMAIL_SMTP_TYPE.Enums.Gmail">
              <div>{{ $t("gmail.one") }}</div>
              <div>{{ $t("gmail.two") }}</div>
              <div>{{ $t("gmail.three") }}</div>
              <div>{{ $t("gmail.four") }}</div>
              <div>{{ $t("gmail.five") }}</div>
              <ul>
                <li>{{ $t("gmail.six") }}</li>
                <li>{{ $t("gmail.seven") }}</li>
              </ul>
              <div>{{ $t("gmail.eight") }}</div>
              <div>{{ $t("gmail.nine") }}</div>
            </template>

            <template v-if="smtpForm.type === EMAIL_SMTP_TYPE.Enums.Outlook">
              <div>{{ $t("outlook.one") }}</div>
              <div>{{ $t("outlook.two") }}</div>
              <div>{{ $t("outlook.three") }}</div>
              <div>{{ $t("outlook.four") }}</div>
              <div>{{ $t("outlook.five") }}</div>
              <div>{{ $t("outlook.six") }}</div>
              <div>{{ $t("outlook.seven") }}</div>
              <div>{{ $t("outlook.eight") }}</div>
            </template>

            <template v-if="smtpForm.type === EMAIL_SMTP_TYPE.Enums.iCloud">
              <div>{{ $t("icloud.one") }}</div>
              <div>{{ $t("icloud.two") }}</div>
              <div>{{ $t("icloud.three") }}</div>
              <div>{{ $t("icloud.four") }}</div>
              <div>{{ $t("icloud.five") }}</div>
              <div>{{ $t("icloud.six") }}</div>
              <div>{{ $t("icloud.seven") }}</div>
              <div>{{ $t("icloud.eight") }}</div>
            </template>

            <div class="security-warning">
              <q-icon name="warning" color="warning" size="1rem" />
              <div>
                <div>{{ $t("doNotUsePersonalPassword") }}</div>
                <div>{{ $t("securityRecommendation") }}</div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="flex items-center justify-center">
          <q-btn color="primary" class="submit-btn" type="submit" :loading="isSmtpLoading" :disable="!permission.edit">
            {{ $t("btn.save") }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-form>

    <q-separator class="section-separator" />

    <q-form @submit="handleTemplateSubmit">
      <q-card class="q-pa-md bg-transparent" flat>
        <q-card-section class="email-config-title">{{ $t("resetPasswordTemplate") }}</q-card-section>
        <q-card-section class="email-config-panel">
          <div class="field-block">
            <div class="field-label">{{ $t("resetPasswordTitle") }}</div>
            <q-input
              v-model="templateForm.subject"
              dense
              outlined
              lazy-rules
              class="email-input"
              :maxlength="RESET_PASSWORD_SUBJECT_MAX_LENGTH"
              :placeholder="$t('common.please_enter_content')"
              :rules="[validateResetPasswordSubject]"
            />
          </div>

          <div class="field-block">
            <div class="field-label">{{ $t("resetPasswordContent") }}</div>
            <Editor v-model="templateForm.content" />
          </div>

          <div class="template-note">
            <q-icon name="warning" color="warning" size="1rem" />
            <span>{{ $t("resetPasswordNote", { reset_password_url: RESET_PASSWORD_URL_TOKEN }) }}</span>
          </div>
        </q-card-section>

        <q-card-section class="flex items-center justify-center">
          <q-btn
            color="primary"
            class="submit-btn"
            type="submit"
            :loading="isTemplateLoading"
            :disable="!permission.edit"
          >
            {{ $t("btn.save") }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-form>
    <q-separator class="section-separator" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { useSearch } from "@/hook/useSearch"
  import { usePermission } from "@/hook/usePermission"
  import Editor from "@/components/editor/Editor.vue"
  import { getEmailSmtpConfig, getEmailTemplate, putEmailSmtpConfig, putEmailTemplate } from "src/api/email"
  import type * as Request from "src/api/request.type"
  import type * as Response from "src/api/response.type"
  import { EMAIL_SMTP_TYPE, EMAIL_TEMPLATE_TYPE } from "src/utils/constants"

  const DEFAULT_APP_KEY = "qnqf newk sqbx fsoe"
  const APP_KEY_MASK = "**** **** **** ****"
  const DEFAULT_RESET_PASSWORD_SUBJECT =
    "Dear player, please click on the link within five minutes to reset your password!"
  const RESET_PASSWORD_URL_TOKEN: string = "{{reset_password_url}}"
  const RESET_PASSWORD_SUBJECT_MAX_LENGTH = 250
  const RESET_PASSWORD_SUBJECT_PATTERN = /^[A-Za-z0-9\u4e00-\u9fff\p{P}\p{Zs}]+$/u

  const $q = useQuasar()
  const { t } = useI18n()
  const { permission } = usePermission()
  const isSmtpLoading = ref(false)
  const isTemplateLoading = ref(false)
  const isAccessMethodVisible = ref(true)
  const appKeyDisplay = ref(APP_KEY_MASK)

  const smtpForm = reactive<Request.PutEmailSmtpConfig>({
    type: EMAIL_SMTP_TYPE.Enums.Gmail,
    username: "",
    password: DEFAULT_APP_KEY,
    host: "",
    port: 0
  })

  const templateForm = reactive<Request.PutEmailTemplate>({
    type: EMAIL_TEMPLATE_TYPE.Enums.ForgotPassword,
    subject: DEFAULT_RESET_PASSWORD_SUBJECT,
    content: ""
  })

  const smtpTypeOptions = computed(() =>
    Object.values(EMAIL_SMTP_TYPE.Enums)
      .filter((value): value is EMAIL_SMTP_TYPE.Enums => typeof value === "number")
      .map((value) => ({
        label: t(EMAIL_SMTP_TYPE.I18nKeys[value]),
        value
      }))
  )

  function getSmtpPayload(): Request.PutEmailSmtpConfig {
    ensureAppKeyValue()
    return {
      type: smtpForm.type,
      username: smtpForm.username,
      password: smtpForm.password,
      host: smtpForm.host,
      port: smtpForm.port
    }
  }

  function ensureAppKeyValue(): void {
    if (!smtpForm.password) {
      smtpForm.password = DEFAULT_APP_KEY
    }
  }

  function showAppKeyMask(): void {
    appKeyDisplay.value = APP_KEY_MASK
  }

  function handleAppKeyFocus(): void {
    if (appKeyDisplay.value === APP_KEY_MASK) {
      appKeyDisplay.value = ""
    }
  }

  function handleAppKeyBlur(): void {
    ensureAppKeyValue()
    showAppKeyMask()
  }

  function handleAppKeyUpdate(value: string | number | null): void {
    const appKeyValue = value === null ? "" : String(value)
    if (appKeyValue === APP_KEY_MASK) return

    smtpForm.password = appKeyValue
  }

  function validateResetPasswordSubject(value: string): true | string {
    if (value.length > RESET_PASSWORD_SUBJECT_MAX_LENGTH) {
      return `${t("resetPasswordTitle")} <= ${RESET_PASSWORD_SUBJECT_MAX_LENGTH}`
    }

    return RESET_PASSWORD_SUBJECT_PATTERN.test(value) || t("common.please_enter_content")
  }

  function notifyEditSuccess() {
    $q.notify({
      type: "positive",
      message: t("message.edit_success"),
      position: "top",
      timeout: 300
    })
  }

  async function handleGetSmtpConfig() {
    const { search, tableData, status } = useSearch(getEmailSmtpConfig)
    isSmtpLoading.value = true
    await search()
    isSmtpLoading.value = false

    if (status.value && tableData.value && !Array.isArray(tableData.value)) {
      const data = tableData.value as Response.EmailSmtpConfig
      smtpForm.type = data.type
      smtpForm.username = data.username
      smtpForm.password = data.password || DEFAULT_APP_KEY
      smtpForm.host = data.host
      smtpForm.port = data.port
      showAppKeyMask()
    }
  }

  async function handleGetTemplate() {
    const { search, tableData, status } = useSearch(getEmailTemplate)
    isTemplateLoading.value = true
    await search({ type: EMAIL_TEMPLATE_TYPE.Enums.ForgotPassword })
    isTemplateLoading.value = false

    if (status.value && tableData.value && !Array.isArray(tableData.value)) {
      const data = tableData.value as Response.EmailTemplateData
      templateForm.subject = data?.subject || DEFAULT_RESET_PASSWORD_SUBJECT
      templateForm.content = data?.content ?? ""
    }
  }

  async function handleSmtpSubmit() {
    const { search, status } = useSearch(putEmailSmtpConfig)
    isSmtpLoading.value = true
    await search(getSmtpPayload())
    isSmtpLoading.value = false

    if (status.value) {
      notifyEditSuccess()
      showAppKeyMask()
    }
  }

  async function handleTemplateSubmit() {
    const { search, status } = useSearch(putEmailTemplate)
    isTemplateLoading.value = true
    await search({
      type: EMAIL_TEMPLATE_TYPE.Enums.ForgotPassword,
      subject: templateForm.subject,
      content: templateForm.content
    })
    isTemplateLoading.value = false

    if (status.value) {
      notifyEditSuccess()
    }
  }

  onMounted(async () => {
    await Promise.all([handleGetSmtpConfig(), handleGetTemplate()])
  })
</script>

<style scoped lang="scss">
  .email-config {
    .email-config-title {
      @apply p-0 text-xl font-bold;
    }

    .email-config-panel {
      @apply mt-2 px-3 py-3;
      background-color: #fbf7ff;
      border-radius: 0.5rem;
    }

    .field-block {
      @apply mb-4;
    }

    .field-label {
      @apply mb-2 text-base flex items-center gap-1;
    }

    .email-type-toggle {
      @apply bg-white;
      --primary05: var(--primary-05, #086eff);
      border-radius: 100px;
      overflow: visible;

      :deep(.q-btn) {
        min-height: 2rem;
        padding: 0 1.25rem;
        border-radius: 100px;
        color: var(--neutral-07, #858585);
      }

      :deep(.q-btn.bg-primary) {
        background: var(--primary-05, #086eff) !important;
        box-shadow: 0px 0px 4px 0px var(--primary05) !important;
        color: #ffffff;
        position: relative;
        z-index: 1;
      }

      :deep(.q-btn.bg-primary .q-btn__content) {
        color: #ffffff;
      }
    }

    .access-method-btn {
      min-height: 1.5rem;
      padding: 0 0.25rem;
    }

    .email-input {
      width: 100%;
      :deep(.q-field__control) {
        border-radius: 0.25rem;
        min-height: 2.25rem;
        height: 2.25rem;
      }
      :deep(.q-field__native) {
        min-height: 2.25rem;
      }
      :deep(.q-field__append) {
        min-height: 2.25rem;
        height: 2.25rem;
      }
    }

    .access-method-panel {
      @apply text-base p-3;
      background-color: #edf8ff;
      border: 1px solid #5da9ff;
      border-radius: 0.25rem;
      color: #4a4a4a;

      ul {
        margin: 0;
        padding-left: 1.25rem;
      }
    }

    .security-warning,
    .template-note {
      @apply mt-4 flex items-start gap-2;
      width: fit-content;
      max-width: 100%;
      padding: 0.5rem 0.75rem;
      color: #f59e0b;
      background-color: #fff8ed;
      border: 1px solid #f5b041;
      border-radius: 0.25rem;
    }

    .template-note {
      @apply mt-2;
    }

    .submit-btn {
      width: 12rem;
      height: 2.875rem;
      font-size: 1rem;
      border-radius: 6px;
    }

    .section-separator {
      @apply my-4;
    }
  }

  :global(.smtp-tooltip) {
    background: #000000cc;
    max-width: 9rem;
    white-space: normal;
  }
</style>
