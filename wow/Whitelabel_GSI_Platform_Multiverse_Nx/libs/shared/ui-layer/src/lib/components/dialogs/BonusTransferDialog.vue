<script setup lang="ts">
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { TOAST_SEVERITY_ENUMS } from "@shared-lib/constants/enums/toast"
import { WALLET_TYPE_ENUMS } from "@shared-lib/constants/enums/walletType"
import { formatMoney } from "@shared-lib/utils/formatMoney"
import {
  getConditionMetric,
  getVisibleConditions,
  normalizeConditionCode,
  type VisibleBonusTransferConditionCode
} from "@shared-lib/utils/bonusWalletTransferRule"

const { state, closeBonusTransferDialog, submitTransfer, computeTransferAmount } = useBonusTransferDialog()
const { walletList } = useCurrencyInfo()
const { pushToast } = useToastQueue()
const router = useRouter()
const { t, te } = useI18n()

const safeT = (key: string, fallback: string, params?: Record<string, unknown>) => {
  if (!te(key)) return fallback
  return params ? t(key, params) : t(key)
}

const visible = computed({
  get: () => state.value.visible,
  set: (value) => {
    if (!value) closeBonusTransferDialog()
  }
})

const statusCurrencyCode = computed(() => {
  const matched = walletList.value.find(
    (wallet) =>
      wallet.currency_id === state.value.status?.currency_id &&
      wallet.wallet_type === WALLET_TYPE_ENUMS.REWARD
  )
  if (matched) return matched.currency_code
  return walletList.value.find((wallet) => wallet.currency_id === state.value.status?.currency_id)?.currency_code || ""
})

const rewardBalanceLabel = computed(() => formatMoney(state.value.status?.reward_wallet_balance || 0))
const maxTransferLabel = computed(() => formatMoney(state.value.status?.max_transfer_amount || 0))

const transferAmount = computed(() => computeTransferAmount(state.value.status))

const canTransferAll = computed(() => {
  const status = state.value.status
  if (!status || state.value.isTransferring) return false
  return status.enabled && status.eligible && transferAmount.value > 0
})

const visibleConditions = computed(() => getVisibleConditions(state.value.status, state.value.rule))

const totalConditionCount = computed(() => visibleConditions.value.length)
const passedConditionCount = computed(() => visibleConditions.value.filter((c) => c.passed).length)

const overallProgress = computed(() => {
  if (totalConditionCount.value <= 0) return 0
  return Math.min((passedConditionCount.value / totalConditionCount.value) * 100, 100)
})

const CONDITION_CONFIG: Record<
  VisibleBonusTransferConditionCode,
  { labelKey: string; labelFallback: string; route: string; icon: string }
> = {
  turnover_or_balance: {
    labelKey: "cash.remainingTurnover",
    labelFallback: "剩餘流水",
    route: ROUTE_PATH.HOME,
    icon: "/images/wallet/cond-turnover.svg"
  },
  first_deposit: {
    labelKey: "cash.first_deposit",
    labelFallback: "首存",
    route: ROUTE_PATH.DEPOSIT,
    icon: "/images/wallet/cond-deposit.svg"
  },
  history_deposit: {
    labelKey: "cash.totalDeposits",
    labelFallback: "總存款",
    route: ROUTE_PATH.DEPOSIT,
    icon: "/images/wallet/cond-history.svg"
  },
  vip: {
    labelKey: "menu.vip",
    labelFallback: "VIP",
    route: ROUTE_PATH.MEMBER.VIP,
    icon: "/images/wallet/cond-vip.svg"
  },
  kyc: {
    labelKey: "menu.getVerify",
    labelFallback: "KYC驗證",
    route: ROUTE_PATH.MEMBER.PROFILE,
    icon: "/images/wallet/cond-kyc.svg"
  },
  active_downline: {
    labelKey: "cash.referralCount",
    labelFallback: "下線人數",
    route: ROUTE_PATH.REFERRAL_REBATE,
    icon: "/images/wallet/cond-downline.svg"
  }
}

interface ConditionRow {
  key: string
  code: VisibleBonusTransferConditionCode
  labelKey: string
  labelFallback: string
  passed: boolean
  progress: number
  currentLabel: string | number
  requiredLabel: string | number
  remainingLabel: string | number
  route: string
  icon: string
}

const conditionRows = computed<ConditionRow[]>(() => {
  return visibleConditions.value.map((condition, index) => {
    const normalizedCode = normalizeConditionCode(condition.code) as VisibleBonusTransferConditionCode
    const config = CONDITION_CONFIG[normalizedCode]
    const metric = getConditionMetric(condition, {
      statusCurrencyId: state.value.status?.currency_id
    })

    let labelKey = config?.labelKey || ""
    let labelFallback = config?.labelFallback || normalizedCode

    if (normalizedCode === "turnover_or_balance") {
      const isBalanceMode = state.value.rule?.eligibility_mode === "balance"
      labelKey = isBalanceMode ? "cash.balanceThreshold" : "cash.remainingTurnover"
      labelFallback = isBalanceMode ? "餘額目標" : "剩餘流水"
    }

    return {
      key: `${normalizedCode}-${index}`,
      code: normalizedCode,
      labelKey,
      labelFallback,
      passed: condition.passed,
      progress: metric.progress,
      currentLabel: metric.currentLabel,
      requiredLabel: metric.requiredLabel,
      remainingLabel: metric.remainingLabel,
      route: config?.route || ROUTE_PATH.HOME,
      icon: config?.icon || "/images/wallet/cond-turnover.svg"
    }
  })
})

const goTo = async (path: string) => {
  closeBonusTransferDialog()
  await router.push(path)
}

const handleTransferAll = async () => {
  if (!canTransferAll.value) return
  const result = await submitTransfer()
  if (result.ok) {
    pushToast({
      severity: TOAST_SEVERITY_ENUMS.SUCCESS,
      detail: safeT("cash.transferSuccessDescription", "轉出成功"),
      life: 2200
    })
    return
  }

  let detail = result.msg || ""
  if (result.reason === "blocked_label") {
    detail = safeT("cash.bonusBalanceReset", "有被註記該標籤的會員，無法轉出")
  } else if (result.reason === "not_eligible") {
    detail = safeT("cash.completeTasksToTransfer", "完成以下任務即可轉出")
  }
  pushToast({
    severity: TOAST_SEVERITY_ENUMS.ERROR,
    detail: detail || `Error code: ${String(result.code || "")}`,
    life: 2200
  })
}
</script>

<template>
  <BaseDialog
    v-model:visible="visible"
    :class-obj="{
      root: cx(
        'max-w-[600px] !rounded-xl',
        'phone:!w-[calc(100%-32px)] phone:!max-w-[480px] phone:!h-[85dvh] phone:!max-h-[85dvh] phone:!rounded-xl phone:!m-0'
      ),
      header: cx('py-4 px-5 bg-[#301d8a]'),
      title: cx('text-xl'),
      body: cx('px-6 py-5 bg-[#1d125d] min-h-0'),
      closeBtn: cx('top-5 right-5'),
      footer: cx('bg-[#1d125d] !px-6 !pb-5 !pt-0')
    }"
    @close="closeBonusTransferDialog"
  >
    <template #header>
      <h3 class="text-xl text-white font-bold leading-7 text-center">
        {{ safeT("cash.transferOutBonusWallet", "轉出贈金錢包") }}
      </h3>
    </template>

    <div v-if="state.isLoading" :class="cx(FLEX_COL, 'items-center justify-center min-h-[200px]')">
      <BaseIcon name="line-md:loading-loop" size="32px" />
    </div>

    <template v-else-if="state.status">
      <!-- Summary card: 贈金錢包餘額 + 最高可轉出額度 (with divider) -->
      <div :class="cx(FLEX_COL, 'gap-4 w-full')">
        <div
          :class="
            cx(
              'rounded-lg px-4 py-3 bg-[#000025] border border-white/[0.09]',
              FLEX_ITEMS_CENTER,
              'gap-2'
            )
          "
        >
          <!-- 贈金錢包餘額 -->
          <div :class="cx('flex-1 min-w-0', FLEX_ITEMS_CENTER, 'gap-2')">
            <span
              class="bg-[rgba(26,26,26,0.6)] p-2 rounded-full inline-flex items-center justify-center shrink-0"
            >
              <img src="/images/wallet/summary-wallet-v2.svg" alt="" class="w-6 h-6" />
            </span>
            <div :class="cx(FLEX_COL, 'gap-1 items-start min-w-0')">
              <span class="text-[10px] text-white/[0.48] leading-normal">
                {{ safeT("cash.bonusWalletBalance", "贈金錢包餘額") }}
              </span>
              <div :class="cx(FLEX_ITEMS_CENTER, 'gap-1')">
                <span
                  class="h-6 px-2 py-1 rounded-full bg-white/20 inline-flex items-center justify-center text-xs font-bold leading-[18px] text-white"
                >
                  {{ statusCurrencyCode }}
                </span>
                <span class="text-xl font-bold text-white leading-7 truncate">{{ rewardBalanceLabel }}</span>
              </div>
            </div>
          </div>

          <!-- divider -->
          <div class="h-[30px] w-px bg-white/20 shrink-0" />

          <!-- 最高可轉出額度 -->
          <div :class="cx('flex-1 min-w-0', FLEX_ITEMS_CENTER, 'gap-2')">
            <span
              class="bg-[rgba(26,26,26,0.6)] p-2 rounded-full inline-flex items-center justify-center shrink-0"
            >
              <img src="/images/wallet/summary-chest-icon.svg" alt="" class="w-6 h-6" />
            </span>
            <div :class="cx(FLEX_COL, 'gap-1 items-start min-w-0')">
              <span class="text-[10px] text-white/[0.48] leading-normal">
                {{ safeT("cash.maxTransferableAmount", "最高可轉出額度") }}
              </span>
              <div :class="cx(FLEX_ITEMS_CENTER, 'gap-1')">
                <span
                  class="h-6 px-2 py-1 rounded-full bg-white/20 inline-flex items-center justify-center text-xs font-bold leading-[18px] text-white"
                >
                  {{ statusCurrencyCode }}
                </span>
                <span class="text-xl font-bold text-white leading-7 truncate">{{ maxTransferLabel }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mission progress card with big chest illustration -->
        <div
          :class="
            cx(
              'relative rounded-lg p-4 bg-[#000025] border border-[#00035b]',
              'shadow-[inset_2px_2px_4px_0_rgba(129,57,255,0.2)]',
              FLEX_COL,
              'gap-2'
            )
          "
        >
          <p class="text-sm font-bold text-white leading-5 text-center">
            {{ safeT("cash.completeTasksToTransfer", "完成以下任務即可轉出") }}
          </p>
          <div :class="cx(FLEX_ITEMS_CENTER, 'gap-4 h-[63px]')">
            <!-- chest illustration (glow + chest + scattered coins + gold sparkles) -->
            <div class="relative w-[84px] h-[80px] shrink-0">
              <!-- purple glow behind chest -->
              <img
                src="/images/wallet/chest-glow.svg"
                alt=""
                class="absolute"
                style="left: 0px; top: -3px; width: 85px; height: 85px"
              />
              <!-- chest body -->
              <img
                src="/images/wallet/chest-illustration.png"
                alt=""
                class="absolute"
                style="left: 0; top: 0; width: 84px; height: 80px; object-fit: cover; object-position: -18px 0"
              />
              <!-- scattered coin sprites -->
              <img
                src="/images/wallet/chest-coin.png"
                alt=""
                class="absolute object-cover pointer-events-none"
                style="left: 2px; top: 11px; width: 18px; height: 22px"
              />
              <img
                src="/images/wallet/chest-coin.png"
                alt=""
                class="absolute object-cover pointer-events-none"
                style="left: 16px; top: 6px; width: 11px; height: 13px"
              />
              <img
                src="/images/wallet/chest-coin.png"
                alt=""
                class="absolute object-cover pointer-events-none"
                style="left: 67px; top: 35px; width: 15px; height: 18px"
              />
              <img
                src="/images/wallet/chest-coin.png"
                alt=""
                class="absolute object-cover pointer-events-none"
                style="left: 66px; top: 6px; width: 11px; height: 13px"
              />
              <img
                src="/images/wallet/chest-coin.png"
                alt=""
                class="absolute object-cover pointer-events-none"
                style="left: 7px; top: 54px; width: 9px; height: 11px"
              />
              <!-- gold sparkles (tiny gradient particles) -->
              <span
                class="absolute bg-gradient-to-l from-[#ffdd87] to-[#f2b519] rotate-[-53.37deg]"
                style="left: 7px; top: 41px; width: 1.065px; height: 1.598px"
              />
              <span
                class="absolute bg-gradient-to-l from-[#ffdd87] to-[#f2b519] rotate-[-53.37deg]"
                style="left: 75px; top: 31px; width: 1.065px; height: 1.598px"
              />
              <span
                class="absolute bg-gradient-to-l from-[#ffdd87] to-[#f2b519]"
                style="left: 70px; top: 34.3px; width: 1.065px; height: 1.083px; transform: rotate(-120deg); filter: blur(0.25px)"
              />
              <span
                class="absolute bg-gradient-to-l from-[#ffdd87] to-[#f2b519]"
                style="left: 67px; top: 62px; width: 1.065px; height: 1.598px; transform: rotate(-120deg)"
              />
              <span
                class="absolute bg-gradient-to-l from-[#ffdd87] to-[#f2b519]"
                style="left: 64px; top: 14px; width: 1.065px; height: 1.598px; transform: rotate(-120deg)"
              />
              <span
                class="absolute bg-gradient-to-l from-[#ffdd87] to-[#f2b519]"
                style="left: 14.1px; top: 29.95px; width: 1.065px; height: 1.598px; transform: rotate(30.24deg); filter: blur(0.5px)"
              />
            </div>

            <!-- progress text -->
            <div :class="cx(FLEX_COL, 'items-center justify-center p-2 shrink-0 gap-2')">
              <span class="text-xs text-white/[0.48] leading-[18px]">{{
                safeT("cash.overallProgress", "整體進度")
              }}</span>
              <div :class="cx(FLEX_ITEMS_CENTER, 'gap-2')">
                <span class="text-2xl font-bold leading-7 text-[#f26319]">{{ passedConditionCount }}</span>
                <span class="text-2xl font-bold leading-7 text-white/[0.48]">/ {{ totalConditionCount }}</span>
              </div>
            </div>

            <!-- progress bar -->
            <div class="flex-1 h-3 rounded-full bg-white/[0.06] border border-[#573edc] overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-b from-[#fefce8] to-[#eab308]"
                :style="{ width: `${overallProgress}%` }"
              />
            </div>
          </div>

          <!-- Transfer all button -->
          <button
            type="button"
            :disabled="!canTransferAll"
            :class="
              cx(
                'w-full h-10 rounded-lg font-bold text-base transition',
                canTransferAll
                  ? 'bg-gradient-to-r from-[#f97316] to-[#dc2626] text-white shadow-[0_4px_10px_rgba(249,115,22,0.35)]'
                  : 'bg-[#d4d4d4] text-[#737373] cursor-not-allowed'
              )
            "
            @click="handleTransferAll"
          >
            <BaseIcon
              v-if="state.isTransferring"
              name="line-md:loading-loop"
              size="16px"
              class="mr-1 inline-block"
            />
            <span v-else>{{ safeT("cash.transferAllToCashWallet", "全部轉進現金錢包") }}</span>
          </button>
        </div>

        <!-- Condition list -->
        <div :class="cx(FLEX_COL, 'gap-2')">
          <div
            v-for="row in conditionRows"
            :key="row.key"
            :class="cx('rounded-lg px-4 py-2 bg-[#1d125d]', FLEX_ITEMS_CENTER, 'gap-4')"
          >
            <span
              class="bg-[rgba(26,26,26,0.6)] p-1 rounded-lg inline-flex items-center justify-center shrink-0 w-8 h-8"
            >
              <img :src="row.icon" alt="" class="w-5 h-5" />
            </span>

            <div class="flex-1 min-w-0">
              <div :class="cx(FLEX_ITEMS_CENTER, 'justify-between gap-2')">
                <span class="text-sm font-bold text-white leading-5">
                  {{ row.labelKey ? safeT(row.labelKey, row.labelFallback) : row.labelFallback }}
                </span>
                <span class="text-xs leading-[18px] whitespace-nowrap">
                  <span class="font-bold" :class="row.passed ? 'text-[#22c55e]' : 'text-[#f97316]'">{{ row.currentLabel }}</span>
                  <span class="text-white"> / {{ row.requiredLabel }}</span>
                </span>
              </div>
              <div
                class="mt-1 h-[7px] w-full rounded-full bg-white/[0.06] border border-[#573edc] overflow-hidden"
              >
                <div
                  class="h-full rounded-full bg-gradient-to-b from-[#fefce8] to-[#eab308]"
                  :style="{ width: `${row.progress}%` }"
                />
              </div>
              <div
                class="mt-1 text-xs leading-[18px]"
                :class="row.passed ? 'text-[#22c55e]' : 'text-white'"
              >
                <template v-if="row.passed">
                  <span>{{ safeT("cash.achieved", "已完成") }}</span>
                </template>
                <i18n-t
                  v-else-if="te('cash.completeMoreToAchieve')"
                  keypath="cash.completeMoreToAchieve"
                  tag="span"
                >
                  <template #amount>
                    <span class="text-[#f97316]">{{ row.remainingLabel }}</span>
                  </template>
                </i18n-t>
                <template v-else>
                  <span>再完成 </span>
                  <span class="text-[#f97316]">{{ row.remainingLabel }}</span>
                  <span> 即可達成</span>
                </template>
              </div>
            </div>

            <div v-if="row.passed" class="shrink-0 w-14 flex justify-center">
              <img src="/images/wallet/check-done.svg" alt="" class="w-6 h-6" />
            </div>
            <button
              v-else
              type="button"
              class="h-9 w-14 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#f97316] to-[#dc2626] shrink-0"
              @click="goTo(row.route)"
            >
              {{ safeT("cash.goTo", "前往") }}
            </button>
          </div>
        </div>

        <!-- 任務說明 -->
        <div
          :class="
            cx(
              'rounded-lg px-4 py-3 bg-white/20',
              'flex items-start gap-2'
            )
          "
        >
          <img src="/images/wallet/cond-icon-info.svg" alt="" class="w-5 h-5 shrink-0" />
          <div :class="cx(FLEX_COL, 'gap-2 flex-1 min-w-0')">
            <p class="text-sm leading-5 text-white">
              {{ safeT("cash.taskDescription", "任務說明") }}
            </p>
            <div class="text-sm leading-5 text-white/75 whitespace-pre-line">{{
              safeT(
                "cash.taskDescriptionBullets",
                "•轉出金額不超過『最高可轉出額度』\n•轉出成功後，贈金將會全數轉入您的現金錢包\n•轉出後贈金餘額歸0"
              )
            }}</div>
          </div>
        </div>

        <!-- 底部說明（所有條件達成後...） -->
        <div :class="cx(FLEX_ITEMS_CENTER, 'justify-center gap-2 w-full')">
          <img src="/images/wallet/footer-info.svg" alt="" class="w-4 h-4 shrink-0" />
          <i18n-t
            v-if="te('cash.maxTransferAvailableMessage')"
            keypath="cash.maxTransferAvailableMessage"
            tag="p"
            class="text-sm leading-normal text-white"
          >
            <template #amount>
              <span class="font-bold text-[#f97316]">{{ maxTransferLabel }}</span>
            </template>
            <template #currency>
              <span class="font-bold text-white"> {{ statusCurrencyCode }}</span>
            </template>
          </i18n-t>
          <p v-else class="text-sm leading-normal text-white">
            <span>所有條件達成後，將可轉出最高 </span>
            <span class="font-bold text-[#f97316]">{{ maxTransferLabel }}</span>
            <span class="font-bold text-white"> {{ statusCurrencyCode }}</span>
            <span> 至現金錢包</span>
          </p>
        </div>
      </div>
    </template>

    <div v-else :class="cx(FLEX_COL, 'items-center justify-center min-h-[200px] text-white/40')">
      {{ safeT("common.noData", "無資料") }}
    </div>

    <template #footer>
      <div class="py-2" />
    </template>
  </BaseDialog>
</template>
