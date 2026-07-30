<template>
  <div class="mobile-referral-wrapper">
    <div class="referral-banner">
      <q-img class="referral-banner-image" fit="fill" :src="referralBannerImg" />
    </div>
    <div class="referral-content">
      <div class="content-title">
        <div class="agent-details">
          <span class="agent">{{ $t("menu.memberAgent") }}</span>
        </div>
      </div>
      <div class="currency-select">
        <q-select
          standout
          v-model="selectedItem"
          :options="walletDropdown"
          class="form-input"
          dropdown-icon="expand_more"
          rounded
          outlined
          dense
          borderless
          no-error-icon
          hide-bottom-space
          @update:model-value="changeCurrency"
        />
      </div>
      <div class="referral-summary-wrapper">
        <div class="referral-summary">
          <div class="summary-item">
            <div class="summary-item-title">{{ $t("menu.players") }}</div>
            <div class="summary-item-value">{{ referralSummaryData?.member_count }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-item-title">{{ $t("menu.validBet") }}</div>
            <div class="summary-item-value">{{ referralSummaryData?.total_valid_betted_amount }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-item-title">{{ $t("menu.winLoss") }}</div>
            <div class="summary-item-value">{{ referralSummaryData?.total_profit }}</div>
          </div>
        </div>
        <div class="summary-tips">
          <div class="summary-tips-text" v-html="summaryTips"></div>
        </div>
      </div>
      <!-- Referral Code -->
      <div class="referral-code-wrapper">
        <span class="referral-code-title">{{ $t("menu.referralCode") }}</span>
        <div class="referral-code-row">
          <div class="referral-code">{{ referralInfoData?.code }}</div>
          <div class="referral-code-btn">
            <q-icon name="share" @click="copyMessage(inviteCodeUrl({ inviteCode: referralInfoData?.code || '' }))" />
            <q-icon name="content_copy" @click="copyMessage(referralInfoData?.code || '')" />
          </div>
        </div>
      </div>
      <!-- Referral Table Tabs -->
      <div class="referral-table-tabs">
        <div class="tabs-pill">
          <q-tabs v-model="activeTab" align="left">
            <q-tab name="setting" :label="$t('menu.referralSettings')" />
            <q-tab name="details" :label="$t('menu.referralDetails')" />
          </q-tabs>
        </div>
        <q-btn v-if="showingSubDetails" flat dense @click="handleBack" class="back-btn">
          <div class="row items-center">
            <span class="material-icons-outlined back-btn-img">reply</span>
            {{ t("common.btn.back") }}
          </div>
        </q-btn>
      </div>
      <!-- Referral List -->
      <div class="referral-list">
        <template v-if="activeTab === 'setting'">
          <MobileSettingList />
        </template>
        <template v-else>
          <template v-if="showingSubDetails">
            <MobileSubDetailsList :statement-id="selectedStatementId" @back="showingSubDetails = false" />
          </template>
          <template v-else>
            <MobileDetailsList @show-sub-details="handleShowSubDetails" />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"
import { useReferral } from "src/common/composables/useReferral"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import MobileSettingList from "app/template/set_r017/pages/Referral/Components/MobileSettingList.vue"
import MobileDetailsList from "app/template/set_r017/pages/Referral/Components/MobileDetailsList.vue"
import MobileSubDetailsList from "app/template/set_r017/pages/Referral/Components/MobileSubDetailsList.vue"

const $q = useQuasar()
const { userWalletMap, getWalletLabel, getUserWalletList, inviteCodeUrl } = useUserInfo()
const { fetchReferralInfo, referralInfoData, fetchReferralSummary, referralSummaryData } = useReferral()
const { copyMessage } = useCommon()
const { referralBannerImg } = useSiteImg()
const { t } = useI18n()
const activeCurrencyId = ref("")
const tabState = ref("setting")
const activeTab = computed({
  get: () => tabState.value,
  set: (val) => {
    tabState.value = val
    if (val === "setting") {
      showingSubDetails.value = false
      selectedStatementId.value = 0
    }
  },
})
const showingSubDetails = ref(false)
const selectedStatementId = ref<number>(0)

type WalletDropItem = {
  label: string
  value: string
}

const walletDropdown = computed<WalletDropItem[]>(() => {
  return Object.keys(userWalletMap.value).map((e) => {
    const cashWallet = userWalletMap.value[e][WALLET_TYPE.Enums.Cash]
    const label = `${getWalletLabel(cashWallet)}`
    const value = String(cashWallet.currency_id)
    return { label, value }
  })
})

const selectedItem = ref<WalletDropItem | null>(null)

const changeCurrency = async (item: WalletDropItem) => {
  selectedItem.value = item
  activeCurrencyId.value = item.value
  await fetchReferralSummary(item.value)
}

const summaryTips = computed(() => {
  return t("menu.summaryTips", { interval: `<span class="text-interval">10</span>` })
})

const handleShowSubDetails = (statementId: number) => {
  selectedStatementId.value = statementId
  showingSubDetails.value = true
}

const handleBack = () => {
  showingSubDetails.value = false
  selectedStatementId.value = 0
}

onMounted(async () => {
  $q.loading.show()
  await getUserWalletList()
  await fetchReferralInfo()
  if (walletDropdown.value.length > 0) {
    selectedItem.value = walletDropdown.value[0]
    activeCurrencyId.value = walletDropdown.value[0].value
    await fetchReferralSummary(walletDropdown.value[0].value)
  }
  $q.loading.hide()
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r017/assets/css/_variable.scss";
@import "app/template/set_r017/assets/css/form2.scss";

.mobile-referral-wrapper {
  @apply px-[0.75rem] pt-[0.75rem];

  .referral-banner {
    .referral-banner-image {
      border-radius: 0.75rem;
    }
  }

  .referral-content {
    @apply mt-[0.75rem];
  }

  .agent-details {
    @apply flex text-[1.25rem] font-bold gap-2;
    color: var(--neutral-01);
  }

  .currency-select {
    @apply flex flex-col gap-2 mt-[.625rem];

    .statistics {
      @apply text-base font-bold;
      color: $text-night-sky-color;
    }

    .form-input {
      @apply w-[7.9375rem] mt-[.5rem];

      @include iphone-width {
        @apply w-auto;
      }
    }
  }

  .referral-summary {
    @apply flex justify-evenly;

    .summary-item {
      @apply flex flex-col items-center justify-center mt-[1rem] py-[0.75rem];
      @apply w-[12rem] h-[4rem] rounded-[3rem];
      background: $secondary14;
      color: $text-light-color;

      .summary-item-title {
        color: var(--neutral-04);
        font-size: 1rem;
        font-weight: bold;
      }

      .summary-item-value {
        color: var(--neutral-01);
        font-size: 1rem;
        font-weight: 700;
        line-height: 1rem;
      }

      @include iphone-width {
        @apply w-[7rem] h-[3.375rem];
      }
    }
  }

  .summary-tips {
    @apply flex mt-[1.25rem] text-[.75rem] font-bold;
    color: var(--neutral-01);

    :deep(.text-interval) {
      @apply font-semibold;
      font-weight: bold;
    }
  }

  .referral-code-wrapper {
    @apply flex flex-col mt-[2rem];

    .referral-code-title {
      @apply flex text-[1rem] font-semibold;
      color: var(--neutral-01);
    }

    .referral-code-row {
      @apply flex flex-none justify-between items-center mt-[0.5rem];
      width: 100%;
      max-width: 18.75rem;
      padding: 0.75rem;
      border-radius: 0.25rem;
      background-color: $secondary06;
      border: 2px solid $neutral04;

      .referral-code {
        font-family: NotoSans;
        font-size: 1rem;
        line-height: 1.375rem;
        color: var(--neutral-01);
      }

      .referral-code-btn {
        @apply flex items-center;
        color: var(--neutral-01);
        gap: 0.625rem;

        .q-icon {
          font-size: 1.25rem;
          cursor: pointer;
        }
      }
    }
  }

  .referral-table-tabs {
    @apply flex justify-between items-center mt-[1rem];

    .tabs-pill {
      @apply inline-block;
      border-radius: 50em;
      padding: 0.375rem;
      background-color: var(--neutral-100);

      :deep(.q-tab) {
        border-radius: 50em;
        padding: 0 1.25rem;
        font-family: NotoSans;
        font-weight: bold;
        text-transform: capitalize;
        color: var(--neutral-01);
        min-height: auto !important;

        &.q-tab--active {
          background: var(--primany-01);

          .q-tab__indicator {
            @apply h-0;
          }
        }
      }
    }

    .back-btn {
      @apply rounded-[50em] text-[1rem] px-[1.25rem] py-[0.375rem];
      background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
      color: var(--neutral-01);

      .back-btn-img {
        @apply w-[1.25rem] h-[1.0625rem] mr-2;
      }
    }
  }
}
</style>
