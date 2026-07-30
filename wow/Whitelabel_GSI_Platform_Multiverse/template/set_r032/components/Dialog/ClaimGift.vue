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
      class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[1200px]"
    >
      <canvas ref="coinCanvas" class="absolute top-0 left-0 w-full h-full pointer-events-none z-10"></canvas>
      <div class="gift-card-container">
        <q-btn class="gift-close-btn" icon="close" flat round dense v-close-popup @click="closeDialog" />
        <q-badge class="gift-length-circle" rounded :label="giftsList.length" />
        <span class="gift-title">{{ t("promotion.pick_and_win") }}</span>
        <q-img :src="claimGiftImg('giftBox.png')" class="gift-img" loading="lazy" />
        <q-btn
          class="gift-confirm-btn"
          unelevated
          rounded
          :label="t('promotion.pick_now')"
          @click="claimDialog = true"
        />
      </div>
    </q-card>
    <q-card v-else class="bg-transparent shadow-none flex justify-center items-center w-full relative !max-w-[800px]">
      <div class="gift-card-container">
        <q-btn class="gift-close-btn" icon="close" flat round dense v-close-popup @click="closeDialog" />
        <span class="no-bonus-title">{{ t("promotion.no_bonus") }}</span>
        <q-img width="200px" :src="claimGiftImg('giftBox_disabled.png')" loading="lazy" />
        <q-btn class="mt-10" unelevated rounded color="grey-13" disable :label="t('promotion.pick_now')" />
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="claimDialog" persistent transition-show="scale" transition-hide="scale" class="claim-gift-dialog">
    <q-card v-if="giftsList.length" class="claim-gift-card p-4 !rounded-xl" style="width: 600px">
      <q-card-section class="flex justify-space items-center">
        <div class="claim-gift-title">{{ t("promotion.congratulations") }}</div>
        <q-btn class="absolute top-0 right-0" icon="close" flat round dense v-close-popup @click="closeDialog" />
      </q-card-section>
      <q-card-section
        v-if="giftsList[0].options.length > 1"
        class="q-pa-none flex flex-row justify-center items-center gap-3"
      >
        <div class="claim-gift-title">
          {{ t("promotion.select_currency") }}
        </div>
        <div class="claim-select-wrapper">
          <q-select
            v-model="selectedIndex"
            :options="currencyOptions"
            dense
            borderless
            emit-value
            map-options
            class="claim-gift-select"
            popup-content-class="claim-gift-select-menu"
          />
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none flex justify-center items-center text-2xl mt-4">
        <div class="gift-amount-wrapper">
          <span>{{ t("promotion.you_get") }}</span>
          <span class="gift-amount">{{ moneyFormat(giftsList[0].options[selectedIndex].amount) }}</span>
          <span class="font-bold">{{ currencyIdMap?.[giftsList[0].options[selectedIndex].currency_id]?.code }}</span>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          class="claim-gift-btn"
          unelevated
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
import { useSiteImg } from "app/template/set_r032/hooks/useSiteImg"
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
const giftsList = computed(() => giftStore.giftState.list)
const { t } = useI18n()
const $q = useQuasar()
const { coinCanvas, startCoinAnimation, stopAnimation } = useCoinsAnimation()
const { ClaimGift } = useClaimGift()
const { getUserWalletList } = useUserInfo()
const { claimGiftImg } = useSiteImg()

const show = ref(false)
const claimDialog = ref(false)
const selectedIndex = ref(0)

// q-select 用 { label, value } 格式；value 沿用 index 與 selectedIndex 對齊，label 套用幣別代換規則
const currencyOptions = computed(() =>
  giftsList.value[0]?.options.map((option, index) => ({
    label:
      isCNYToUSDT && option.currency_code === "CNY"
        ? "USDT"
        : isIDRToEUR && option.currency_code === "IDR"
        ? "EUR"
        : option.currency_code,
    value: index
  })) ?? []
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
  $q.loading.show()
  const status = await ClaimGift({
    gift_id: id,
    amount,
    currency
  })
  $q.loading.hide()
  if (!status) return
  claimDialog.value = false
  $q.notify({
    type: "positive",
    message: t("common.alarm.successfullyClaimed"),
    position: "top",
    timeout: 1000
  })
  await getUserWalletList()

  selectedIndex.value = 0
  if (giftsList.value.length === 0) {
    closeDialog()
  }
}

onMounted(async () => {
  eventbus.on("openClaimGiftDialog", (value: boolean) => {
    show.value = value
  })
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

.claim-gift-dialog {
  .gift-amount-wrapper {
    color: var(--neutral-10);
    font-size: 1.75rem;

    @include pad-large-width() {
      font-size: 1rem;
    }
  }
  .gift-amount {
    color: var(--primary-01);
    margin: 1.5rem;
    font-size: 2.25rem;

    @include pad-large-width() {
      font-size: 1.5rem;
    }
  }
  .claim-gift-card {
    background: var(--neutral-01);
    @include dark {
      border-color: transparent;
      box-shadow: 0px 0px 12px 0px var(--neutral-03);
      border: 1px solid;
      border-radius: 10px;
    }

    // dark mode 漸層 border 用 ::before 覆蓋（border-image 不能跟 border-radius 並用，
    // 所以用 pseudo 蓋一層做漸層 border 視覺效果）
    &::before {
      @include dark {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        border: 1px solid;
        border-image-source: linear-gradient(180deg, #fedefa 0%, #ad2fff 26.44%, #ad2fff 97.6%, #4540ff 100%);
        border-image-slice: 1;
      }
    }
  }
  .claim-gift-title {
    @apply text-2xl font-bold;

    @include pad-large-width() {
      font-size: 1rem;
    }
  }
  .claim-select-wrapper {
    @apply rounded-full px-5 py-1 flex items-center justify-center;
    background: var(--neutral-04);
  }
  .claim-gift-select {
    @apply text-xl;
    color: var(--secondary-01);
    min-width: 5rem;

    // 讓 q-select 內部跟外層 wrapper 融為一體：背景透明、移除自帶內距
    :deep(.q-field__control),
    :deep(.q-field__native) {
      background: transparent;
      color: var(--secondary-01);
      min-height: unset;
      padding: 0;
    }

    :deep(.q-field__append) {
      color: var(--secondary-01);
      padding-left: 0.25rem;
    }
  }
  .claim-gift-btn {
    @apply my-4 text-xl;
    border-radius: 8px;
    width: 13.5625rem;
    min-height: 2.5rem;
    font-size: 1.25rem;
    background: var(--linear-gradient-primary-01);
    color: var(--text-01);

    @include pad-large-width() {
      width: 9.3125rem;
      font-size: 0.875rem;
    }
  }
}

// q-select 的下拉選單透過 teleport 渲染到 body 之外，scoped style 不會 reach 到，
// 所以用 popup-content-class 在全域命名空間下覆寫
.claim-gift-select-menu {
  .q-item {
    color: var(--secondary-01);
  }
  .q-item--active {
    color: var(--primary-01) !important;
  }
}
.gift-card-container {
  @apply relative flex flex-col items-center py-10 px-16;

  .gift-close-btn {
    @apply absolute top-0 right-0;
    color: #fff;
  }

  .gift-length-circle {
    @apply absolute top-24 right-8 text-lg rounded-full flex items-center justify-center;
    background: var(--primary-01);
    color: var(--text-01);
    width: 2.5rem;
    height: 2.5rem;

    @include pad-large-width() {
      width: 1.75rem;
      height: 1.75rem;
    }
  }

  .gift-title {
    @apply bg-gradient-to-r bg-clip-text text-3xl text-transparent font-bold;
    font-size: 2.5rem;
    margin-bottom: 0.8125rem;
    background-image: linear-gradient(to right, var(--emotional-warning-02), var(--emotional-warning-01));

    @include pad-large-width() {
      font-size: 1.5rem;
      margin-bottom: 2.0625rem;
    }
  }

  .gift-img {
    width: 18.75rem;

    @include pad-large-width() {
      width: 11.8125rem;
    }
  }

  .gift-confirm-btn {
    @apply mt-10 text-lg;
    min-width: 12.875rem;
    background: var(--linear-gradient-primary-01);
    color: var(--text-01);
  }

  .no-bonus-title {
    @apply text-3xl text-transparent font-bold;
    color: var(--neutral-01) !important;
  }
}
</style>
