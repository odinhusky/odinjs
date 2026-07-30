<template>
  <q-dialog
    v-model="show"
    transition-show="fade"
    transition-hide="fade"
    :transition-duration="$q.platform.is.mobile ? '0' : '300'"
    :maximized="$q.platform.is.mobile"
    :no-backdrop-dismiss="true"
  >
    <q-card
      v-if="giftsList.length > 0"
      class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]"
    >
      <canvas ref="coinCanvas" class="absolute top-0 left-0 w-full h-full pointer-events-none z-10"></canvas>
      <div class="gift-card-container">
        <q-btn class="gift-close-btn" icon="close" flat round dense v-close-popup @click="closeDialog" />
        <q-badge
          class="absolute top-24 right-8 text-xl bg-red-500 line-height h-[30px] w-[30px] flex items-center justify-center"
          rounded
          :label="giftsList.length"
        />
        <span class="gift-title">{{ t("promotion.pick_and_win") }}</span>
        <q-img width="240px" :src="claimGiftImg('giftBox.png')" loading="lazy" />
        <q-btn
          class="gift-confirm-btn px-6 text-lg"
          unelevated
          rounded
          :label="t('promotion.pick_now')"
          @click="claimDialog = true"
        />
      </div>
    </q-card>
    <q-card
      v-else-if="!isClaimTransitioning"
      class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]"
    >
      <div class="gift-card-container">
        <q-btn class="gift-close-btn" icon="close" flat round dense v-close-popup @click="closeDialog" />
        <span class="no-bonus-title">{{ t("promotion.no_bonus") }}</span>
        <q-img width="200px" :src="claimGiftImg('giftBox_disabled.png')" loading="lazy" />
        <q-btn class="mt-10" unelevated rounded color="grey-13" disable :label="t('promotion.pick_now')" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="claimDialog"
    persistent
    transition-show="scale"
    transition-hide="scale"
    class="claim-gift-dialog font-bold text-white"
  >
    <q-card v-if="giftsList.length" class="claim-gift-card p-4 !rounded-xl" style="width: 600px">
      <q-card-section class="claim-gift-header flex justify-between items-center">
        <div v-if="giftsList[0].options.length > 1" class="claim-gift-title text-bold text-2xl">
          {{ t("promotion.select_currency") }}
        </div>
        <div v-else class="claim-gift-title claim-gift-title-center text-bold text-2xl">
          {{ t("promotion.congratulations") }}
        </div>
        <q-btn
          class="claim-gift-close-btn absolute top-0 right-0"
          icon="close"
          flat
          round
          dense
          v-close-popup
          @click="closeDialog"
        />
      </q-card-section>
      <q-card-section
        v-if="giftsList[0].options.length > 1"
        class="claim-select-section q-pa-none flex flex-col justify-center items-center"
      >
        <div class="claim-select-wrapper mb-2 flex items-center">
          <select v-model="selectedIndex" class="claim-gift-select w-fit border-none focus:outline-none">
            <option v-for="(option, index) in giftsList[0].options" :value="index" :key="option.currency_code">
              {{
                isCNYToUSDT && option.currency_code === "CNY"
                  ? "USDT"
                  : isIDRToEUR && option.currency_code === "IDR"
                  ? "EUR"
                  : option.currency_code
              }}
            </option>
          </select>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none flex justify-center items-center font-bold text-2xl mt-4">
        <span class="gift-amount-wrapper w-full text-center"
          >{{ t("promotion.you_get") }}
          <span class="gift-amount">{{ moneyFormat(giftsList[0].options[selectedIndex].amount) }}</span>
          {{ currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code }}</span
        >
      </q-card-section>
      <q-card-actions align="center" class="claim-gift-actions">
        <q-btn
          class="claim-confirm-btn !px-8"
          unelevated
          dense
          rounded
          :label="t('common.btn.confirm')"
          @click="
            claimGift(
              giftsList[0].id,
              parseFloat(giftsList[0].options[selectedIndex].amount),
              giftsList[0].options[selectedIndex].currency_id
            )
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { ref, computed, watch, nextTick, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useCoinsAnimation } from "src/common/composables/useClaimGift"
import { useGiftStore } from "src/stores/giftStore"
import { useBank } from "src/common/composables/useBank"
import { useClaimGift } from "src/common/hooks/useClaimGift"
import { useCommon } from "src/common/hooks/useCommon"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useAgentCode } from "src/common/hooks/useAgentCode"

const { isCNYToUSDT, isIDRToEUR } = useAgentCode()
const eventbus = injectStrict(EventBusKey)
const { currencyIdMap } = useBank()
const { moneyFormat } = useCommon()
const giftStore = useGiftStore()
const storeGiftsList = computed(() => giftStore.giftState.list)
const { t } = useI18n()
const $q = useQuasar()
const { coinCanvas, startCoinAnimation, stopAnimation } = useCoinsAnimation()
const { ClaimGift } = useClaimGift()
const { getUserWalletList } = useUserInfo()
const { claimGiftImg } = useSiteImg()

const show = ref(false)
const claimDialog = ref(false)
const selectedIndex = ref(0)
const isClaimTransitioning = ref(false)
const giftsList = ref<typeof giftStore.giftState.list>([])

function mergeLocalGifts(incoming: typeof giftStore.giftState.list) {
  const incomingMap = new Map(incoming.map((item) => [item.id, item]))

  giftsList.value = [...incoming, ...giftsList.value.filter((item) => !incomingMap.has(item.id))]
}

watch(
  storeGiftsList,
  (incoming) => {
    mergeLocalGifts(incoming)
  },
  { immediate: true, deep: true }
)

watch(show, async (newVal) => {
  if (newVal) {
    await nextTick()
    startCoinAnimation()
  } else {
    stopAnimation()
  }
})

function closeDialog() {
  claimDialog.value = false
  eventbus.emit("openClaimGiftDialog", false)
}

async function claimGift(id: number, amount: number, currency: number) {
  claimDialog.value = false
  isClaimTransitioning.value = true
  $q.loading.show()
  const status = await ClaimGift({
    gift_id: id,
    amount,
    currency
  })
  $q.loading.hide()
  if (!status) {
    isClaimTransitioning.value = false
    claimDialog.value = true
    return
  }

  giftsList.value = giftsList.value.filter((item) => item.id !== id)
  const noGiftLeft = giftsList.value.length === 0
  if (noGiftLeft) {
    closeDialog()
  }

  $q.notify({
    type: "positive",
    message: t("common.alarm.successfullyClaimed"),
    position: "top",
    timeout: 1000
  })
  await getUserWalletList()

  selectedIndex.value = 0
  isClaimTransitioning.value = false
}

onMounted(async () => {
  eventbus.on("openClaimGiftDialog", (value: boolean) => {
    show.value = value
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";

.claim-gift-dialog {
  .gift-amount-wrapper {
    color: var(--dialog-text-01);
  }
  .gift-amount {
    color: var(--dialog-text-01);
    font-size: 36px;
  }
  .claim-gift-card {
    background: var(--dialog-bg-02);
  }
  .claim-gift-header {
    padding-bottom: 0.75rem;
  }
  .claim-gift-title {
    color: var(--dialog-text-01);
    line-height: 1.875rem;
    margin: 0 auto;
    font-size: 20px;
    font-weight: 700;
  }
  .claim-gift-title-center {
    margin: 0 auto;
  }
  .claim-gift-close-btn {
    color: var(--icon-01);
  }
  .claim-select-section {
    margin-top: 0.25rem;
  }
  .claim-select-wrapper {
    width: 100%;
    border-radius: 0.625rem;
    background: var(--input-dropdown-bg-01);
    border: 1px solid var(--input-dropdown-border-01);
    box-shadow: $shadoe03;
    padding: 0.375rem 0.75rem;
  }
  .claim-gift-select {
    color: var(--input-dropdown-text-02);
    background: transparent;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.5rem;
    appearance: none;
  }
  .claim-gift-actions {
    padding: 0;
  }
  .claim-confirm-btn {
    width: 100%;
    min-height: 2.5rem;
    margin: 1rem 0 0.5rem;
    font-size: 12px;
    font-weight: 700;
    color: var(--btn-text-01);
    background: $gradient01;
    border-radius: 4px;
  }
}
.gift-card-container {
  @apply relative flex flex-col items-center py-10 px-16;

  .gift-close-btn {
    @apply absolute top-0 right-0;
    color: #fff;
  }

  .gift-title {
    @apply bg-white bg-clip-text text-4xl text-transparent font-bold mb-2;
  }

  .gift-confirm-btn {
    @apply font-bold text-[0.75rem] leading-[1rem] text-[var(--btn-text-01)] w-full
    bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)];
    border-radius: 4px !important;
    height: 36px !important;
  }

  .no-bonus-title {
    @apply text-3xl text-transparent font-bold;
    color: #f7d99d !important;
  }
}

.line-height {
  line-height: 1.25rem !important;
}
</style>
