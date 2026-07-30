<script setup lang="ts">
import { TOAST_SEVERITY_ENUMS } from "../../constants/enums/toast"
import { useAccountInfo } from "../../api/hooks/useAccountInfo"
import { useAvailableCurrencyList } from "../../api/hooks/useAvailableCurrencyList"
import { useReferralSettingDetailQuery } from "../../api/hooks/useReferralSettingDetailQuery"
import { useUpdateReferralSettingMutation } from "../../api/hooks/useUpdateReferralSettingMutation"

interface CurrencyRow {
  id: string
  code: string
  upperLimit: number
  originLimit: number
  disabled: boolean
}

const props = defineProps<{
  visible: boolean
  memberId: number
  memberAccount: string
}>()

const emit = defineEmits<{
  (event: "update:visible", value: boolean): void
}>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value)
})

const nuxtApp = useNuxtApp()
const appToast = (nuxtApp as any).$appToast
const { accountInfo } = useAccountInfo()
const { fetchAvailableCurrencyList } = useAvailableCurrencyList()
const { updateReferralSetting, isPending } = useUpdateReferralSettingMutation()

const currencyCodeById = ref<Record<string, string>>({})
const formValues = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})
const submitted = ref(false)

const memberIdRef = computed(() => props.memberId)
const upperMemberId = computed(() => {
  const uid = accountInfo.value?.uid
  if (uid === undefined || uid === null || uid === "") return null
  return Number(uid)
})

const memberDetailQuery = useReferralSettingDetailQuery(memberIdRef)
const upperLimitQuery = useReferralSettingDetailQuery(upperMemberId)

const memberCurrencyLimit = computed(() => memberDetailQuery.data.value?.currency_limit ?? {})
const upperCurrencyLimit = computed(() => upperLimitQuery.data.value?.currency_limit ?? {})

const currencyRows = computed<CurrencyRow[]>(() => {
  const ids = new Set<string>([
    ...Object.keys(currencyCodeById.value),
    ...Object.keys(memberCurrencyLimit.value),
    ...Object.keys(upperCurrencyLimit.value)
  ])

  return Array.from(ids)
    .sort((a, b) => Number(a) - Number(b))
    .map((id) => {
      const rawUpperLimit = upperCurrencyLimit.value[id] ?? 100
      const upperLimit = Math.min(Number(rawUpperLimit), 100)
      const originLimit = Number(memberCurrencyLimit.value[id] ?? 0)

      return {
        id,
        code: currencyCodeById.value[id] ?? id,
        upperLimit,
        originLimit,
        disabled: originLimit > 0
      }
    })
})

const isLoading = computed(() => memberDetailQuery.isLoading.value || upperLimitQuery.isLoading.value)

const closeDialog = () => {
  if (isPending.value) return
  dialogVisible.value = false
}

const getErrorMessage = (currency: CurrencyRow) => {
  if (currency.disabled) return ""

  const value = formValues.value[currency.id]?.trim() ?? ""
  if (value === "") return ""

  const rate = Number(value)
  if (!Number.isFinite(rate)) return "請輸入數字"
  if (rate < 0) return "不可小於 0"
  if (rate > currency.upperLimit) return `不可超過 ${currency.upperLimit}%`

  return ""
}

const shouldShowError = (currency: CurrencyRow) => Boolean(touched.value[currency.id] || submitted.value)
const hasError = (currency: CurrencyRow) => shouldShowError(currency) && Boolean(getErrorMessage(currency))

const markTouched = (currencyId: string) => {
  touched.value = {
    ...touched.value,
    [currencyId]: true
  }
}

const syncFormValues = () => {
  const nextValues: Record<string, string> = {}

  currencyRows.value.forEach((currency) => {
    const value = memberCurrencyLimit.value[currency.id]
    nextValues[currency.id] = value === undefined || value === null ? "" : String(value)
  })

  formValues.value = nextValues
  touched.value = {}
  submitted.value = false
}

const loadCurrencyMap = async () => {
  const response = await fetchAvailableCurrencyList()
  if (!response.status) return

  currencyCodeById.value = (response.data?.currencies ?? []).reduce<Record<string, string>>((acc, currency) => {
    acc[String(currency.id)] = currency.code
    return acc
  }, {})
}

const notifySuccess = () => {
  appToast?.("設定成功", {
    severity: TOAST_SEVERITY_ENUMS.SUCCESS,
    summary: "成功",
    life: 2000
  })
}

const handleSubmit = async () => {
  submitted.value = true

  if (currencyRows.value.some((currency) => Boolean(getErrorMessage(currency)))) return

  const currencyLimit = currencyRows.value.reduce<Record<string, number>>((acc, currency) => {
    if (currency.disabled) return acc

    const value = formValues.value[currency.id]?.trim() ?? ""
    if (value === "") return acc

    acc[currency.id] = Number(value)
    return acc
  }, {})

  await updateReferralSetting({
    member_id: props.memberId,
    currency_limit: currencyLimit
  })

  notifySuccess()
  closeDialog()
}

watch(
  () => [memberCurrencyLimit.value, currencyRows.value.length],
  () => {
    syncFormValues()
  },
  { immediate: true }
)

onMounted(() => {
  loadCurrencyMap()
})
</script>

<template>
  <BaseDialog
    v-model:visible="dialogVisible"
    :class-obj="{
      root: '!w-[550px] !max-w-[calc(100vw-32px)] phone:!w-[343px] phone:!h-auto phone:!max-h-[90vh] phone:!m-auto phone:!rounded-xl',
      body: '!gap-4 !px-5 !py-6 phone:!px-5 phone:!py-6',
      header: '!py-4',
      title: '!text-xl !leading-7'
    }"
    @close="closeDialog"
  >
    <template #header>
      <span>編輯</span>
    </template>

    <div class="flex flex-col gap-4">
      <div
        class="flex min-h-9 items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-sm leading-5 text-[var(--dialog-dialog-title-content)]"
      >
        <BaseIcon name="mdi:information" size="20px" class="shrink-0 text-[var(--dialog-dialog-title-content)]" />
        <span class="min-w-0">
          返水比例設定，最高可設定
          <span class="font-bold text-[var(--dialog-dialog-accent-content)]">100%</span>
        </span>
      </div>

      <div class="flex items-center gap-3 text-sm leading-5">
        <span class="font-normal text-[var(--text-text-primary)]">
          {{ $t("menu.userAccount") }}
        </span>
        <span class="font-bold text-[var(--dialog-dialog-accent-content)]">
          {{ props.memberAccount }}
        </span>
      </div>

      <div v-if="isLoading" class="flex min-h-[160px] items-center justify-center text-[var(--text-text-primary)]">
        Loading...
      </div>

      <div v-else class="flex flex-col gap-4">
        <div v-for="currency in currencyRows" :key="currency.id" class="relative" @focusout="markTouched(currency.id)">
          <BaseInput
            v-model="formValues[currency.id]"
            type="number"
            :label="currency.code"
            :placeholder="$t('placeholder.pleaseEnter')"
            :disabled="currency.disabled"
            :invalid="hasError(currency)"
            :error-message="getErrorMessage(currency)"
            :class-obj="{
              input: '!pr-9',
              errorMessage: '!mt-1'
            }"
          />
          <span
            class="pointer-events-none absolute right-3 top-[38px] text-sm leading-5 text-[var(--input-input-title-primary-enabled)]"
          >
            %
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-center gap-4 phone:gap-3">
        <BaseBtn
          theme="primary"
          category="outline"
          size="lg"
          class="h-12 min-w-0 flex-1"
          :disabled="isPending"
          @click="closeDialog"
        >
          {{ $t("common.btn.cancel") }}
        </BaseBtn>
        <BaseBtn
          theme="primary"
          size="lg"
          class="h-12 min-w-0 flex-1"
          :loading="isPending"
          :disabled="isLoading"
          @click="handleSubmit"
        >
          {{ $t("common.btn.confirm") }}
        </BaseBtn>
      </div>
    </template>
  </BaseDialog>
</template>
