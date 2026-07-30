<script setup lang="ts">
import { TOAST_SEVERITY_ENUMS } from "../../constants/enums/toast"
import { useAvailableCurrencyList } from "../../api/hooks/useAvailableCurrencyList"
import { useReferralInfoQuery } from "../../api/hooks/useReferralInfoQuery"
import { useReferralSummaryQuery } from "../../api/hooks/useReferralSummaryQuery"

interface CurrencyOption {
  label: string
  value: string
}

interface SummaryCard {
  key: string
  label: string
  value: string
  theme: "purple" | "pink"
}

const { t } = useI18n()
const { fetchAvailableCurrencyList } = useAvailableCurrencyList()
const { pushToast } = useToastQueue()

const selectedCurrencyId = ref<string | undefined>()
const currencyOptions = ref<CurrencyOption[]>([])

const referralInfoQuery = useReferralInfoQuery()
const referralSummaryQuery = useReferralSummaryQuery(selectedCurrencyId)

const referralCode = computed(() => referralInfoQuery.data.value?.code || "-")
const referralUrl = computed(() => referralInfoQuery.data.value?.url || "")

const copyToClipboard = async (text: string) => {
  if (!text || text === "-") return false

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall back to legacy execCommand
  }

  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "absolute"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
    return true
  } catch {
    return false
  }
}

const handleCopyCode = async () => {
  const code = referralInfoQuery.data.value?.code
  if (!code) return
  const ok = await copyToClipboard(code)
  if (!ok) return

  pushToast({
    severity: TOAST_SEVERITY_ENUMS.SUCCESS,
    summary: t("common.alarm.copySuccess")
  })
}

const handleShareUrl = async () => {
  const url = referralUrl.value
  if (!url) return
  const ok = await copyToClipboard(url)
  if (!ok) return

  pushToast({
    severity: TOAST_SEVERITY_ENUMS.SUCCESS,
    summary: t("common.alarm.copySuccess")
  })
}

const formatMetric = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") return "0"

  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return String(value)

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(numericValue)
}

const cards = computed<SummaryCard[]>(() => {
  const summary = referralSummaryQuery.data.value

  return [
    {
      key: "referral-code",
      label: t("collaboration.exclusive_referral_code"),
      value: referralCode.value,
      theme: "purple"
    },
    {
      key: "number",
      label: t("menu.players"),
      value: formatMetric(summary?.member_count),
      theme: "pink"
    },
    {
      key: "bet",
      label: t("menu.validBet"),
      value: formatMetric(summary?.total_valid_betted_amount),
      theme: "pink"
    },
    {
      key: "win",
      label: t("menu.winLoss"),
      value: formatMetric(summary?.total_profit),
      theme: "pink"
    }
  ]
})

const getCardClass = (theme: SummaryCard["theme"]) =>
  theme === "purple"
    ? "border-[var(--color-abyss-600)] bg-[var(--card-card-bg-purple)]"
    : "border-[var(--card-card-border-pink)] bg-[var(--card-card-bg-pink)]"

const loadCurrencyOptions = async () => {
  const response = await fetchAvailableCurrencyList()
  if (!response.status) return

  const options = (response.data?.currencies ?? []).map<CurrencyOption>((currency) => ({
    label: currency.code,
    value: String(currency.id)
  }))

  currencyOptions.value = options
  selectedCurrencyId.value = options[0]?.value
}

onMounted(() => {
  loadCurrencyOptions()
})
</script>

<template>
  <section class="flex w-full flex-col gap-3">
    <BaseSelect
      v-model="selectedCurrencyId"
      :options="currencyOptions"
      option-label="label"
      option-value="value"
      :label="$t('common.btn.currency')"
      :placeholder="$t('placeholder.pleaseSelect')"
      :class-obj="{
        wrapper: '!w-fit min-w-[120px] phone:!w-full',
        select: '!w-auto !min-w-[120px]'
      }"
    />

    <div class="grid w-full grid-cols-4 gap-3 pad:grid-cols-2 phone:grid-cols-3">
      <article
        v-for="card in cards"
        :key="card.key"
        :class="
          cx(
            'flex h-20 min-w-0 flex-col justify-center gap-2 rounded-lg border px-4 py-3 text-[var(--card-card-title-primary-enabled)]',
            card.key === 'referral-code' && 'phone:col-span-3',
            getCardClass(card.theme)
          )
        "
      >
        <div class="truncate text-sm leading-5 text-[var(--card-card-subtitle-secondary-enabled)]">
          {{ card.label }}
        </div>

        <div class="flex min-w-0 items-center gap-2">
          <span class="min-w-0 truncate text-xl leading-7 font-bold">
            {{ card.value }}
          </span>

          <template v-if="card.key === 'referral-code'">
            <BasePlainBtn
              :disabled="!referralUrl"
              :class-obj="{ button: 'shrink-0 disabled:opacity-50' }"
              @click="handleShareUrl"
            >
              <BaseIcon name="mdi:share-variant" size="18px" class="text-[var(--icon-icon-primary-enabled)]" />
            </BasePlainBtn>
            <BasePlainBtn
              :disabled="referralCode === '-'"
              :class-obj="{ button: 'shrink-0 disabled:opacity-50' }"
              @click="handleCopyCode"
            >
              <BaseIcon name="mdi:content-copy" size="18px" class="text-[var(--icon-icon-primary-enabled)]" />
            </BasePlainBtn>
          </template>
        </div>
      </article>
    </div>
  </section>
</template>
