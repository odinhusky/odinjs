<template>
  <div class="w-full h-full">
    <div class="row items-center q-mb-md">
      <q-icon name="play_arrow" size="24px" class="q-mr-sm cursor-pointer rotate-180" @click="handleCancel" />
      <div class="text-h6">{{ $t("menu.dns_settings") }}</div>
    </div>
    <q-card>
      <q-card-section class="q-pt-md">
        <div class="row q-col-gutter-md">
          <div class="w-[500px] shrink-0">
            <q-card flat bordered>
              <q-card-section class="flex flex-col gap-[30px]">
                <div>
                  <div class="text-subtitle2 q-mb-xs">
                    {{ $t("dns_settings.domain_name") }}
                  </div>
                  <q-input
                    v-model="domainInput"
                    type="textarea"
                    :readonly="isApplying"
                    :disable="isApplying"
                    :rows="5"
                    outlined
                    :maxlength="500"
                    no-resize
                    :placeholder="$t('dns_settings.domain_input_placeholder')"
                  />
                  <div class="q-mt-md">
                    <q-btn
                      color="primary"
                      @click="handleApplyCert"
                      :loading="isApplying"
                      :disable="domains.length > 5 || isApplyCooling || isVerifying"
                    >
                      {{ $t("dns_settings.submit_apply") }}
                      <template v-if="isApplyCooling">({{ applySeconds }})</template>
                    </q-btn>
                  </div>
                </div>
                <ConfigSettingsInfo
                  :config-list="applyResult"
                  :has-content-changed="hasContentChanged"
                  :is-applying="isApplying"
                />
                <q-banner
                  v-if="applyResult.length > 0"
                  class="bg-[#FCF6EC] text-[#E6A23C] border border-[#E6A23C]"
                  rounded
                >
                  <div>{{ $t("dns_settings.warning_message_line1") }}</div>
                  <div>{{ $t("dns_settings.warning_message_line2") }}</div>
                </q-banner>
              </q-card-section>
            </q-card>
          </div>
          <div class="flex-1 min-w-0">
            <InstructionsPanel
              :cert-status="certStatus"
              :is-verifying="isVerifying"
              :is-applying="isApplying"
              :verify-cooldown-seconds="verifyCooldown.remainingSeconds.value"
              :has-content-changed="hasContentChanged"
              @verify="handleVerify"
            />
          </div>
        </div>
        <div class="row justify-center q-mt-md gap-[10px]">
          <q-btn outline color="grey-8" :label="$t('btn.cancel')" @click="handleCancel" class="w-[300px]" />
          <q-btn
            color="primary"
            :label="$t('btn.save')"
            @click="handleSave"
            :loading="isSaving"
            :disable="!isVerified"
            class="w-[300px]"
          >
            <q-tooltip v-if="!isVerified">
              {{ $t("dns_settings.verify_domain_first") }}
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { applyDnsCert, getCertStatus, saveDnsSettings } from "@/api/dns"
  import type * as Response from "@/api/response.type"
  import type * as Request from "@/api/request.type"
  import InstructionsPanel from "./components/InstructionsPanel.vue"
  import ConfigSettingsInfo from "./components/ConfigSettingsInfo.vue"
  import { useCooldown } from "@/composables/useCooldown"

  const props = defineProps<{
    initialValues?: Response.DnsDomainItem[]
  }>()

  const emit = defineEmits<{
    saved: []
    cancel: []
  }>()

  const { t } = useI18n()
  const $q = useQuasar()

  const domainInput = ref("")
  const applyResult = ref<Response.DnsDomainItem[]>([])
  const certStatus = ref<Response.GetCertStatusResponse | null>(null)

  const isApplying = ref(false)
  const isVerifying = ref(false)
  const isSaving = ref(false)
  const isVerified = ref(false)

  // 使用 cooldown composable
  const applyCooldown = useCooldown(30)
  const verifyCooldown = useCooldown(30)

  // 為模板使用創建簡潔的別名（解決 TypeScript 類型推斷問題）
  const isApplyCooling = computed(() => applyCooldown.isCoolingDown.value)
  const applySeconds = computed(() => applyCooldown.remainingSeconds.value)

  const domainRegex = /^(\*\.)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

  const domains = computed(() => {
    if (!domainInput.value) return []
    return domainInput.value
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0)
  })

  const invalidDomains = computed(() => {
    return domains.value.filter((domain) => !domainRegex.test(domain))
  })

  // 比較 textarea 內容和已申請結果是否一致
  // 如果不一致,代表使用者有修改過,尚未對新內容發送申請
  const hasContentChanged = computed(() => {
    // 從 applyResult 取得已申請的域名列表
    const appliedDomains = applyResult.value.map((item) => item.domain_name).sort()
    // 從 textarea 取得當前輸入的域名列表
    const currentDomains = domains.value.slice().sort()

    // 比較長度
    if (appliedDomains.length !== currentDomains.length) {
      return true
    }

    // 比較每個域名
    return !appliedDomains.every((domain, index) => domain === currentDomains[index])
  })

  const handleApplyCert = async () => {
    if (isVerifying.value) {
      return
    }

    if (domains.value.length > 5) {
      $q.notify({
        type: "negative",
        message: t("dns_settings.max_domains_warning"),
        position: "top",
        timeout: 2000
      })
      return
    }

    if (invalidDomains.value.length > 0) {
      $q.notify({
        type: "negative",
        message: t("dns_settings.invalid_domain_format"),
        position: "top",
        timeout: 2000
      })
      return
    }

    const requestData: Request.ApplyDnsCert = {
      domain_list: domains.value
    }

    applyResult.value = []
    isVerified.value = false
    certStatus.value = null

    isApplying.value = true
    try {
      const response = await applyDnsCert(requestData)
      applyResult.value = response.data

      $q.notify({
        type: "positive",
        message: t("dns_settings.apply_success"),
        position: "top",
        timeout: 3000
      })

      // 啟動 30 秒冷卻計時器
      applyCooldown.start()
    } catch {
      // 錯誤已由 API 攔截器處理
    } finally {
      isApplying.value = false
    }
  }

  const handleVerify = async () => {
    isVerifying.value = true
    try {
      const response = await getCertStatus()
      certStatus.value = response.data
      isVerified.value = certStatus.value.status === "ISSUED"

      // 驗證完成後啟動 30 秒冷卻計時器
      verifyCooldown.start()
    } catch {
      // 錯誤已由 API 攔截器處理
    } finally {
      isVerifying.value = false
    }
  }

  const handleSave = async () => {
    isSaving.value = true
    try {
      await saveDnsSettings({})
      emit("saved")
    } catch {
      // 錯誤已由 API 攔截器處理
    } finally {
      isSaving.value = false
    }
  }

  const handleCancel = () => {
    emit("cancel")
  }

  watch(
    () => certStatus.value,
    (newValue) => {
      if (newValue) {
        isVerified.value = newValue.status === "ISSUED"
      } else {
        isVerified.value = false
      }
    },
    { immediate: true }
  )

  watch(
    () => props.initialValues,
    (newValue) => {
      if (newValue && newValue.length > 0) {
        const domains = newValue.map((item) => item.domain_name)
        domainInput.value = domains.join("\n")
        applyResult.value = [...newValue]
      } else {
        domainInput.value = ""
        applyResult.value = []
        isVerified.value = false
        certStatus.value = null
      }
    },
    { immediate: true, deep: true }
  )
</script>
