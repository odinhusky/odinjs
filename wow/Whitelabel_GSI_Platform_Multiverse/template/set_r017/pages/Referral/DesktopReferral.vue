<template>
  <div class="desktop-referral-wrapper">
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
        <span>{{ $t("menu.statistics") }}</span>
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
      <!-- Summary -->
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
        <p class="referral-code-title">{{ $t("menu.referralCode") }}</p>
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
      <!-- Table -->
      <div class="referral-table">
        <template v-if="activeTab === 'setting'">
          <SettingTable />
        </template>
        <template v-else>
          <template v-if="showingSubDetails">
            <SubDetailsTable :statement-id="selectedStatementId" />
          </template>
          <template v-else>
            <DetailsTable @show-sub-details="handleShowSubDetails" />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useQuasar } from "quasar"
import { useReferral } from "src/common/composables/useReferral"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { WALLET_TYPE } from "src/common/utils/constants"
import SettingTable from "./Components/DesktopSettingTable.vue"
import DetailsTable from "./Components/DesktopDetailsTable.vue"
import SubDetailsTable from "./Components/DesktopSubDetailsTable.vue"
import { useSiteImg } from "app/template/set_r017/hooks/useSiteImg"
import { useI18n } from "vue-i18n"

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

.desktop-referral-wrapper {
  @apply block w-[61.25rem];
  margin: 1.25rem auto 2.5rem auto;

  @include phone-width {
    display: none;
  }

  .referral-banner {
    @apply flex justify-center items-center w-full;

    .referral-banner-image {
      @apply rounded-[12px];
    }
  }

  .referral-content {
    @apply my-[2.5rem];

    .content-title {
      @apply font-extrabold mb-[1.25rem];
    }

    .agent-details {
      @apply text-[1.75rem];
      color: var(--neutral-01);
    }

    .details {
      @apply font-semibold;
      color: var(--neutral-01);
    }
  }

  .currency-select {
    @apply flex flex-col;
    color: var(--neutral-01);

    .form-input {
      @apply w-[12.5rem] mt-[1.125rem];
    }
  }

  .referral-summary {
    @apply flex justify-between;

    .summary-item {
      @apply flex flex-col items-center justify-center w-[19rem] h-[5rem] mt-[2.5rem];
      background: $secondary14;
      color: $text-light-color;
      border-radius: 50em;

      .summary-item-title {
        color: var(--neutral-04);
        font-size: 1rem;
        font-weight: bold;
      }

      .summary-item-value {
        color: var(--neutral-01);
        font-size: 2rem;
        font-weight: 700;
        line-height: 2rem;
      }
    }
  }

  .summary-tips {
    @apply flex mt-[1.25rem] text-[.875rem];
    color: var(--neutral-01);

    :deep(.text-interval) {
      @apply font-semibold;
      font-weight: bold;
    }
  }

  .referral-code-wrapper {
    @apply flex flex-col mt-[2.5rem];

    .referral-code-title {
      @apply text-[1.25rem] font-semibold;
      color: var(--neutral-01);
    }

    .referral-code-row {
      @apply flex flex-none justify-between items-center mt-[0.75rem];
      width: 100%;
      max-width: 18.75rem;
      padding: 0.75rem;
      border-radius: 0.25rem;
      background-color: $secondary06;
      border: 2px solid $neutral04;

      @include phone-width {
        max-width: none;
      }

      .referral-code {
        font-family: NotoSans;
        font-weight: 700;
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
    @apply flex justify-between items-center mt-[1.75rem];

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
      @apply rounded-[0.25rem] text-[0.75rem] px-[0.75rem] pr-[1.875rem] py-[0.5rem];
      background: linear-gradient(90deg, var(--primany-01) 0%, var(--primany-02) 100%);
      color: var(--neutral-01);

      .back-btn-img {
        @apply w-[1.5rem] h-[1.3125rem] mr-6 text-[1.125rem];
      }
    }
  }
}
</style>
