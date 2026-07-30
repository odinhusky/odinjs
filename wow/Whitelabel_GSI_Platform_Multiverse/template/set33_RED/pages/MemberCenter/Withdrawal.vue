<template>
  <q-card class="withdrawal-layout">
    <!-- VIP暫時隱藏 -->
    <!-- <VipCard /> -->
    <q-form @submit="handleWithdralSubmit">
      <q-card-section class="withdrawal-container">
        <div v-if="showWithdrawCurrencyArea" class="currency-row">
          <div class="currency-title">{{ $t("member.bank.selectCurrency") }}</div>
          <div class="currency-btns">
            <q-btn
              v-for="(item, key) in withdrawState.supportedCurrency"
              :key="key"
              :class="{ active: `${item}` === withdrawState.form.currency }"
              @click="handleWithdralCurrencyClick(item)"
              color="currency"
              class="mr-5"
            >
              {{ $t(item) }}
            </q-btn>
          </div>
        </div>
        <div class="payment-info-container">
          <ul v-if="showWithdrawTypeArea" class="payment-type-container">
            <li
              v-for="item in withdrawState.fundTypeList"
              :key="item"
              :class="{ active: item === `${withdrawState.usingFundType}` }"
              @click="handleWithdralFundTypeClick(item)"
            >
              <span>{{ $t(`member.bank.${item}`) }}</span>
            </li>
          </ul>
          <div class="payment-form">
            <!-- 支付方式 -->
            <div class="form-row" v-if="!withdrawState.gateWayHidden">
              <label class="form-title">{{ $t("member.bank.withdrawalChannel") }}:</label>
              <div class="form-methods">
                <div
                  v-for="(item, key) in withdrawState.usingPaymentInfoList"
                  :key="key"
                  class="method-item"
                  :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
                  @click="handleWithdralPaymentClick(item.type, item.id)"
                >
                  <img :src="item.imgUrl" alt="" class="w-full h-full p-1" />
                </div>
              </div>
            </div>
            <div v-if="!isBankCardIgnored" class="bank-cards">
              <BankCard
                v-for="item in withdrawState.bankCards"
                :key="item.id"
                :card="item"
                :bankList="bankList"
                :gatewayFilterList="gatewayFilterList"
                :activeId="withdrawState.form.bank_id"
                @click="handleWithdralBankCardClick(item.id, item.crypto_rate)"
              />
              <AddBankCard @click="router.push({ name: 'ProfileBank' })" />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="withdrawal-container">
        <div class="form-row-amount">
          <label class="form-title">{{ $t("member.withdrawal.balance") }}:456465465</label>
          <q-input
            :model-value="moneyFormat(withdrawState.form.balance)"
            bg-color="white"
            outlined
            class="input-control form-input"
            :disable="true"
          />
        </div>
        <div class="form-row-amount">
          <label class="form-title">{{ $t("member.withdrawal.auditTurnover") }}:</label>
          <q-input
            :model-value="moneyFormat(withdrawState.form.remaining_turnover)"
            bg-color="white"
            outlined
            class="input-control form-input"
            :disable="true"
          />
        </div>
        <div class="form-row-amount">
          <label class="form-title whitespace-nowrap">{{ $t("member.withdrawal.withdrawalAmmount") }}:</label>
          <div class="input-container">
            <q-input
              v-if="withdrawState.gateWayHidden"
              v-model.trim="withdrawState.form.amount"
              bg-color="white"
              outlined
              class="input-control form-input"
              :placeholder="`${$t('member.deposit.withdrawAmount')}`"
              lazy-rules
              @keypress="Rules.validatePositiveNumber"
              inputmode="decimal"
              :rules="[Rules.requiredInt]"
              type="text"
              autocomplete="withdraw-amount"
            />
            <q-input
              v-else
              v-model.trim="withdrawState.form.amount"
              bg-color="white"
              outlined
              class="input-control form-input"
              :placeholder="`${$t('member.deposit.withdrawAmount')}(${withdrawState.paymentDetail.withdraw_min}~${
                withdrawState.paymentDetail.withdraw_max
              })`"
              lazy-rules
              @keypress="Rules.validatePositiveNumber"
              inputmode="decimal"
              :rules="[Rules.requiredInt]"
              type="text"
              autocomplete="withdraw-amount"
            />
            <ul class="text-white text-xs mt-2" v-show="withdrawState.form.crypto_rate">
              <li>
                <span>{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                <span>{{ withdrawState.form.crypto_rate ? withdrawState.form.crypto_rate : " -" }}</span>
              </li>
              <li>
                <span>{{ `${$t("member.withdrawal.receivePay")}: ` }}</span>
                <span>{{ Number(withdrawState.form.amount) * Number(withdrawState.form.crypto_rate) }}</span>
              </li>
            </ul>
            <div class="flex justify-start flex-wrap gap-3 mt-2">
              <q-btn
                v-for="item in withdrawState.quickBtns"
                :key="item"
                color="quick"
                @click="handleWithdralQuickBtnClick(item)"
              >
                {{ moneyFormat(item) }}
              </q-btn>
            </div>
          </div>
        </div>
        <div class="form-row-amount" v-if="withdrawState.paymentDetail.extra_field_key">
          <label class="form-title">{{ $t("bank_column.client_Info") }}:</label>
          <div class="form-extra">
            <template
              v-for="(field, key) in withdrawState.paymentDetail.extra_field[
                withdrawState.paymentDetail.extra_field_key
              ]"
              :key="key"
            >
              <!-- 文字輸入框 -->
              <ExtraInput
                v-if="field.type === FIELD_TYPE.Enums.Input"
                v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                :field="field"
                class="form-input"
                bg-color="white"
              ></ExtraInput>

              <!-- 下拉選單類型 -->
              <ExtraSelect
                v-else-if="field.type === FIELD_TYPE.Enums.Select"
                v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                :field="field"
                class="form-input"
                bg-color="white"
              ></ExtraSelect>

              <!-- 其他 -->
              <ExtraInput
                v-else
                v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                :field="field"
                bg-color="white"
                class="form-input"
              ></ExtraInput>
            </template>
          </div>
        </div>
        <div class="form-row-amount" v-if="needWithdrawalPassword">
          <label class="form-title">{{ $t("member.withdrawal.withdrawPassword") }}:</label>
          <q-input
            v-model="withdrawState.form.withdrawal_password"
            type="text"
            autocomplete="withdraw-password"
            bg-color="white"
            outlined
            class="input-control form-input security-mask"
            :rules="[Rules.required()]"
            lazy-rules
            :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
          />
        </div>
        <div class="form-row-submit">
          <q-btn rounded color="submit" push :label="$t('common.btn.submit')" type="submit" class="text-black" />
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import { useBank } from "src/common/composables/useBank"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { FIELD_TYPE } from "src/common/utils/constants"
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"

const router = useRouter()
const Rules = useRule()
const {
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
  handleWithdralPaymentClick,
  handleWithdralQuickBtnClick,
  handleWithdralBankCardClick,
  handleWithdralSubmit,
  needWithdrawalPassword,
  getPaymentTypeList,
  isBankCardIgnored,
} = useBank()
const { moneyFormat } = useCommon()

onMounted(async () => {
  await getWithdralPaymentList()
  getBankList()
  getGatewayList()
  await getPaymentTypeList(withdrawState.form.currency)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set33_RED/assets/css/button.sass";

.withdrawal-layout {
  @apply block text-white bg-transparent shadow-none;
  min-height: 37.5rem;
  border-radius: 0.625rem;

  .withdrawal-container {
    @apply text-white mt-2 p-6 w-full rounded-lg;
    background: rgba(61, 2, 2, 1);
    border: 1px solid rgba(209, 68, 68, 1);

    @include pad-width {
      @apply mt-0 rounded-none;
      padding: 1.25rem 0.625rem 0.625rem;
      border: 0;
    }

    .currency-row {
      @apply relative w-full mx-auto mb-8 pb-4 flex items-center;
      border-bottom: 1px solid rgba(209, 68, 68, 1);

      @include pad-width {
        @apply flex-wrap;
      }

      .currency-title {
        width: 37%;

        @include pad-width {
          width: 100%;
        }
      }

      .currency-btns {
        @apply w-full p-0 flex items-center overflow-auto gap-2;
        flex-wrap: wrap;

        @include pad-width {
          @apply mt-3;
        }
      }
    }

    .payment-info-container {
      @apply w-full flex justify-between gap-5;

      @include pad-width {
        @apply flex-col p-3;
      }

      .payment-type-container {
        @apply flex flex-col gap-3 mr-3;
        width: 12.5rem;

        @include pad-width {
          @apply w-full grid grid-cols-2;
        }

        li {
          @apply list-none text-white text-sm cursor-pointer text-center font-bold;
          background: rgba(37, 1, 1, 1);
          border-radius: 3.125rem;
          padding: 0.625rem 0 0.625rem 0.9375rem;

          @include pad-width {
            @include setFlex;
            @apply text-xs p-1 text-center;
          }

          &.active,
          &:hover {
            background: linear-gradient(180deg, #f5e386 0%, #9c7c24 100%);
            color: #000;
          }
        }
      }

      .payment-form {
        width: 72%;

        @include pad-width {
          width: 100%;
        }

        .form-row {
          @apply flex mb-5 items-center;

          @include pad-width {
            @apply flex-wrap gap-4;
          }

          .form-title {
            @apply m-0 font-bold;
            width: 12rem;
            color: #fff;

            @include pad-width {
              @apply w-full;
            }
          }

          .form-methods {
            @apply flex flex-wrap justify-start gap-1;
            width: 70%;

            @include pad-width {
              @apply w-full grid grid-cols-4 gap-0;
            }

            @include phone-width {
              @apply grid-cols-3;
            }

            .method-item {
              @apply relative w-auto flex justify-center items-center rounded-lg px-4 py-2 cursor-pointer;
              height: 2.8125rem;
              max-width: 30%;
              margin: 0.3125rem;
              background: rgba(37, 1, 1, 1);

              @include pad-width {
                height: 2.1875rem;
                max-width: fit-content;
              }

              &.active {
                background: linear-gradient(180deg, #f5e986 0%, #c4a242 100%);
                color: #000;
              }
            }
          }
        }

        .bank-cards {
          @apply grid grid-cols-2 gap-4;

          @include phone-width {
            @apply grid-cols-1;
          }
        }
      }
    }

    .form-row-amount {
      @apply flex items-start my-3;

      @include pad-width {
        @apply flex-wrap gap-3;
      }

      .form-title {
        @apply m-0 font-bold text-white;
        width: 30%;

        @include pad-width {
          @apply w-full;
        }
      }

      .form-extra {
        @apply flex flex-col;
        width: 70%;

        .form-input {
          width: 100%;
        }
      }

      .input-container {
        width: 70%;

        @include pad-width {
          @apply w-full;
        }

        .form-input {
          width: 100%;
        }
      }

      .form-input {
        width: 70%;

        @include pad-width {
          @apply w-full;
        }

        :deep(.q-field__control) {
          height: 2.375rem;
          min-height: auto;

          .q-field__native {
            min-height: auto;
          }

          .q-field__append {
            height: 2.375rem;
          }
        }
      }
    }

    .form-row-submit {
      @apply flex justify-end;

      @include pad-width {
        .bg-submit {
          @apply w-full;
        }
      }
    }
  }
}

.input-control {
  :deep(.q-field__control-container) {
    @apply flex items-center justify-center;
  }
  :deep(.q-field__native) {
    height: calc(100% - 6px);
    min-height: initial !important;

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      /* --- 關鍵：停用 Quasar 的自動填入偵測動畫 --- */
      -webkit-animation-name: none !important;
      animation-name: none !important;

      /* 除了內陰影，強行把 background 設為透明 */
      background-color: transparent !important;
      background-image: none !important;

      // 使用巨大的內陰影覆蓋背景色
      -webkit-box-shadow: 0 0 0px 1000px $common-white-color inset !important;
      box-shadow: 0 0 0px 1000px $common-white-color inset !important;
      // 強制文字顏色（例如白色）
      // -webkit-text-fill-color: $common-white-color !important;

      // --- 關鍵修復：處理左右出現的邊框 ---
      border-radius: 0 !important;
      border: none !important;
      outline: none !important;

      /* 阻止樣式跳轉 */
      transition: background-color 5000s ease-in-out 0s;
    }
  }
}

.bg-quick {
  background: rgba(121, 15, 15, 1);
  color: #fff;
  padding: 0.5rem;
  border: 1px solid rgba(209, 68, 68, 1);
  min-width: 3.75rem !important;
  width: auto !important;
  border-radius: 0.5rem;
}
</style>
