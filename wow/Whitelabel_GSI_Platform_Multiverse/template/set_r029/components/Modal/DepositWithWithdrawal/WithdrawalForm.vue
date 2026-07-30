<template>
  <section class="withdraw-wrapper">
    <q-form @submit="handleWithdralSubmit()">
      <!-- 幣別選擇 -->
      <div v-if="showWithdrawCurrencyArea" class="pay-area">
        <div class="pay-area-title">{{ $t("member.bank.selectCurrency") }}</div>
        <div class="pay-btn-wrapper">
          <span
            v-for="(withdraw, key) in withdrawState.supportedCurrency"
            @click="handleWithdralCurrencyClick(withdraw)"
            :key="key"
            :class="{ active: `${withdraw}` === withdrawState.form.currency }"
            class="pay-btn"
          >
            {{ $t(withdraw) }}
          </span>
        </div>
      </div>
      <!-- 支付類型選擇 -->
      <div v-if="showWithdrawTypeArea" class="pay-area">
        <ul class="pay-btn-wrapper">
          <li
            v-for="fundType in withdrawState.fundTypeList"
            :key="fundType"
            :class="{ active: fundType === `${withdrawState.usingFundType}` }"
            class="pay-btn"
            @click="handleWithdralFundTypeClick(fundType)"
          >
            {{ $t(`member.bank.${fundType}`) }}
          </li>
        </ul>
      </div>
      <div v-if="withdrawState.usingPaymentInfoList.length > 0 && !withdrawState.gateWayHidden" class="pay-area">
        <div class="field-input flex flex-col gap-[10px]">
          <span class="form-title">{{ $t("modal.gateway") }}</span>
          <ul class="form-methods">
            <li
              v-for="(item, key) in withdrawState.usingPaymentInfoList"
              :key="key"
              class="method-item"
              :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
              @click="handleWithdralPaymentClick(item.type, item.id)"
            >
              <img :src="item.imgUrl" />
            </li>
          </ul>
        </div>
      </div>
      <!-- Bank Card List -->
      <div v-if="!isBankCardIgnored" class="card-layout">
        <BankCard
          v-for="bankCard in withdrawState.bankCards"
          :key="bankCard.id"
          :card="bankCard"
          :activeId="withdrawState.form.bank_id"
          :bankList="bankList"
          :gatewayFilterList="gatewayFilterList"
          @click="handleWithdralBankCardClick(bankCard.id, bankCard.crypto_rate)"
        />
        <AddBankCard @click="openAddBankCard()" />
      </div>
      <!-- 銀行帳戶 -->
      <div v-if="activeBankCard && !isBankCardIgnored" class="pay-area">
        <div class="form-title pb-[10px]">{{ $t("member.deposit.bankAccount") }}</div>
        <ul class="bank-account">
          <li>
            <span>{{ activeBankCard.account_number }}</span>
            <q-icon name="content_copy" class="copy-icon" @click="copyMessage(activeBankCard!.account_number)" />
          </li>
          <li>
            <span>{{ activeBankCardAccountName }}</span>
            <q-icon name="content_copy" class="copy-icon" @click="copyMessage(activeBankCardAccountName)" />
          </li>
        </ul>
      </div>
      <!-- 餘額 -->
      <div class="pay-area">
        <div class="field-input flex flex-col gap-[10px]">
          <span class="form-title">{{ $t("member.withdrawal.balance") }}</span>
          <q-input
            :model-value="moneyFormat(withdrawState.form.balance)"
            class="withdraw-input"
            outlined
            :disable="true"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-coins" class="field-icon" />
            </template>
          </q-input>
        </div>
      </div>
      <!-- 稽核流水 -->
      <div class="pay-area">
        <div class="field-input flex flex-col gap-[10px]">
          <span class="form-title">{{ $t("member.withdrawal.auditTurnover") }}</span>
          <q-input
            :model-value="moneyFormat(withdrawState.form.remaining_turnover)"
            class="withdraw-input"
            outlined
            :disable="true"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-clipboard-check" class="field-icon" />
            </template>
          </q-input>
        </div>
      </div>
      <!-- 提領金額 -->
      <div class="pay-area">
        <div class="field-input flex flex-col gap-[10px]">
          <span class="form-title py-[10px] whitespace-nowrap">{{ $t("member.withdrawal.withdrawalAmmount") }}</span>
          <q-input
            v-if="withdrawState.gateWayHidden"
            v-model.trim="withdrawState.form.amount"
            class="withdraw-input"
            outlined
            :label="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            @keypress="Rules.validatePositiveNumber"
            inputmode="decimal"
            :rules="[Rules.requiredInt]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-file-invoice-dollar" class="field-icon" />
            </template>
          </q-input>
          <q-input
            v-else
            v-model.trim="withdrawState.form.amount"
            class="withdraw-input"
            outlined
            :placeholder="`${$t('member.deposit.withdrawAmount')}`"
            lazy-rules
            :rules="[Rules.requiredInt]"
          >
            <template v-slot:prepend>
              <q-icon name="fas fa-file-invoice-dollar" class="field-icon" />
            </template>
          </q-input>
          <ul v-show="withdrawState.form.crypto_rate">
            <li>
              <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
              <span>{{ withdrawState.form.crypto_rate ? withdrawState.form.crypto_rate : " -" }}</span>
            </li>
            <li>
              <span>{{ `${$t("member.withdrawal.receivePay")}: ` }}</span>
              <span>{{ Number(withdrawState.form.amount) * Number(withdrawState.form.crypto_rate) }}</span>
            </li>
          </ul>
          <div class="quick-btn-wrapper">
            <span
              v-for="item in withdrawState.quickBtns"
              :key="item"
              class="quick-btn"
              :class="{ active: item === withdrawState.form.amount }"
              @click="handleWithdralQuickBtnClick(item)"
            >
              {{ moneyFormat(item) }}
            </span>
          </div>
        </div>
      </div>
      <div>
        <q-btn class="btn-submit" type="submit" :loading="isLoading">
          {{ $t("common.btn.submit") }}
        </q-btn>
      </div>
    </q-form>
  </section>
</template>

<script setup lang="ts">
import { useBank } from "src/common/composables/useBank"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { computed, onMounted } from "vue"
import AddBankCard from "../BankDetails/AddBankCard.vue"
import BankCard from "../BankDetails/BankCard.vue"

const eventbus = injectStrict(EventBusKey)
const { copyMessage, moneyFormat } = useCommon()
const Rules = useRule()
const {
  getDisplayedBankCardAccountName,
  withdrawState,
  showWithdrawCurrencyArea,
  showWithdrawTypeArea,
  bankList,
  gatewayFilterList,
  getBankList,
  getGatewayList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralBankCardClick,
  handleWithdralPaymentClick,
  handleWithdralQuickBtnClick,
  handleWithdralSubmit,
  getPaymentTypeList,
  isBankCardIgnored,
} = useBank()
const { isLoading } = useAuth()

const activeBankCard = computed(() => withdrawState.bankCards.find((card) => card.id === withdrawState.form.bank_id))
const activeBankCardAccountName = computed<string>(() => {
  if (!activeBankCard.value) return ""

  return getDisplayedBankCardAccountName(activeBankCard.value, gatewayFilterList.value)
})

const openAddBankCard = () => {
  eventbus.emit("openAddBankCard", true)
  eventbus.emit("openDepositWithWithdrawal", false)
}

onMounted(async () => {
  await getWithdralPaymentList()
  getBankList()
  getGatewayList()
  await getPaymentTypeList(withdrawState.form.currency)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r029/assets/css/_variable.scss";

.pay-area {
  @apply p-4 my-[.9375rem] rounded-[.625rem];
  background: #161e28;

  .pay-area-title {
    @apply font-semibold py-[.3125rem];
    color: $r029-text-primary;
  }

  .pay-btn-wrapper {
    @apply grid justify-between gap-[.9375rem];
    grid-template-columns: repeat(3, 1fr);

    @include iphone-width {
      @apply grid-cols-2;
    }
  }

  .pay-btn {
    @apply flex items-center justify-center text-[.875rem] font-semibold;
    @apply cursor-pointer rounded-[.625rem] p-[.625rem];
    background: $r029-bg-card;
    color: $r029-text-secondary;

    &:hover,
    &.active {
      background: $r029-action-primary;
      color: $r029-bg-home;
    }

    @include iphone-width {
      @apply text-sm;
    }
  }
}

.form-title {
  @apply text-base font-bold;
  color: $r029-text-primary;
}

.withdraw-wrapper {
  .card-layout {
    @apply grid gap-[.625rem];
    grid-template-columns: repeat(2, 1fr);

    @include pad-large-width {
      @apply flex flex-col gap-[.625rem];
    }
  }

  .field-icon {
    color: $r029-text-secondary !important;
  }

  .btn-submit {
    @apply w-full mt-1 mb-0 font-bold;
    background: $r029-action-primary;
    color: $r029-bg-home;
  }
}

.form-methods {
  @apply grid gap-[.1875rem];
  grid-template-columns: repeat(3, 1fr);

  .method-item {
    @apply flex flex-col items-center justify-center p-[.625rem] relative;
    @apply cursor-pointer;
    background: $r029-bg-card;
    color: $r029-text-secondary;
    border-radius: 0.25rem;
    transition: all 0.3s ease;

    img {
      @apply w-[6.75rem] h-[1.875rem];
    }

    span {
      margin-top: 0.125rem;
      font-size: 0.75rem;
    }

    &.active {
      background: $r029-action-primary;
      &::after {
        @apply absolute right-[1px] bottom-[1px] w-[25px] h-[25px];
        content: "";
        background: url("../../../assets/images/svg/checked.svg");
        background-repeat: no-repeat;
        background-size: contain;
      }

      span {
        @apply font-bold;
        color: $r029-bg-home;
      }
    }
  }
}

.bank-account {
  @apply flex flex-col gap-[10px];
  color: $r029-text-primary;

  li {
    @apply flex items-center gap-[10px];

    .copy-icon {
      color: $r029-action-primary !important;
      cursor: pointer;
      font-size: 1rem;
    }
  }
}

.quick-btn-wrapper {
  @apply flex flex-wrap gap-[.5rem] mb-[1rem];

  .quick-btn {
    @apply cursor-pointer;
    @apply flex items-center justify-center;
    border-radius: 0.75rem;
    background: $r029-bg-card;
    color: $r029-text-secondary;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;

    &:hover,
    &.active {
      background: $r029-action-primary;
      color: $r029-bg-home;
      font-weight: bold;
    }
  }
}

.withdraw-input {
  :deep(.q-field__inner) {
    background: $r029-bg-card;
    border-radius: 0.5rem;
    .q-field__native {
      color: $r029-text-primary !important;
      .q-field__input {
        color: $r029-text-primary !important;
      }
    }
  }

  &.q-field--disabled {
    opacity: 0.6;
  }
}

:deep(.q-field--float .q-field__label) {
  color: $r029-text-secondary !important;
}

:deep(.q-field__label) {
  color: $r029-text-secondary !important;
}

:deep(.q-icon) {
  color: $r029-text-secondary !important;
}
</style>
