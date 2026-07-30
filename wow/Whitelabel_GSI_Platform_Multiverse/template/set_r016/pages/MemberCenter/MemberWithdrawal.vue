<template>
  <q-form class="order-wrapper" @submit="handleWithdralSubmit">
    <BackBtn />
    <div class="order-content">
      <h2 class="order-title">{{ $t("member.withdrawal.title") }}</h2>
      <p v-if="envInfo.withdraw_kyc_verify === 1 && !accountInfo.approval_status" class="withdrawal-kyc-text">
        <q-img :src="withdrawalKycImg" alt="withdrawal-kyc" class="withdrawal-kyc-img" contain />
        <span>{{ $t("common.validate.withdrawalKyc") }}</span>
      </p>
      <div class="form-content">
        <!-- currency -->
        <div v-if="showWithdrawCurrencyArea" class="form-item row mb-5">
          <div class="label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="radio-content col-12 col-sm-10">
            <q-radio
              v-for="item in withdrawState.supportedCurrency"
              :key="item"
              dense
              v-model="withdrawState.form.currency"
              @click="handleWithdralCurrencyClick(item)"
              :val="item"
              :label="$t(item as string)"
              checked-icon="circle"
            />
          </div>
        </div>
        <!-- type -->
        <div v-if="showWithdrawTypeArea" class="form-item row mb-5">
          <div class="label col-12">
            {{ $t("member.deposit.type") }}
            <span class="learn-wallet">
              <q-img :src="svgIcon('bank-info')" loading="lazy"></q-img>{{ $t("member.deposit.understandWallet") }}：
              <q-btn
                flat
                :label="$t('member.deposit.biBao')"
                type="a"
                href="https://marketing.baobiweb.com/tutorial"
                target="_blank"
                rel="noopener"
                class="hide-hover"
              />、
              <q-btn
                flat
                :label="$t('member.deposit.mpayWallet')"
                type="a"
                href="https://www.mp11.ag/guide_support_detail/65811f8fbbd49c394a5b7c8c"
                target="_blank"
                rel="noopener"
                class="hide-hover"
              />、
              <q-btn
                flat
                :label="$t('member.deposit.jdWallet')"
                type="a"
                href="https://prnt.sc/ZDB-bAPZ3aIh"
                target="_blank"
                rel="noopener"
                class="hide-hover"
              />
            </span>
          </div>
          <div class="radio-content long-mode col-12 col-sm-10">
            <q-radio
              v-for="item in withdrawState.fundTypeList"
              :key="item"
              dense
              :model-value="withdrawState.usingFundType"
              @update:model-value="handleWithdralFundTypeClick(item)"
              :val="item"
              :label="$t('member.bank.'+item as string)"
              checked-icon="circle"
            />
          </div>
        </div>
        <!-- bank account -->
        <div class="form-item row mb-5">
          <div class="payment-form">
            <!-- 支付方式 -->
            <div class="form-row" v-if="!withdrawState.gateWayHidden">
              <div class="label col-12">{{ $t("modal.gateway") }}</div>
              <div class="form-methods">
                <div
                  v-for="(item, key) in withdrawState.usingPaymentInfoList"
                  :key="key"
                  class="method-item"
                  :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
                >
                  <img
                    :src="item.imgUrl"
                    alt=""
                    class="w-auto h-full"
                    @click="handleWithdralPaymentClick(item.type, item.id)"
                  />
                </div>
              </div>
            </div>

            <div v-if="!isBankCardIgnored" class="card-container">
              <BankCard
                v-for="item in withdrawState.bankCards"
                :key="item.id"
                :card="item"
                :activeId="withdrawState.form.bank_id"
                :bankList="bankList"
                :gatewayFilterList="gatewayFilterList"
                @click="handleWithdralBankCardClick(item.id, item.crypto_rate)"
                @updateList="getWithdrawBankCardList"
              />
              <AddBankCard @click="router.push({ name: 'memberBank' })" />
            </div>
          </div>
        </div>
        <div class="form-item row">
          <div class="row col-12 col-sm-4">
            <div class="label col-12 whitespace-nowrap">{{ $t("member.withdrawal.withdrawalAmmount") }}</div>
            <div class="input-content col-12">
              <q-input
                standout
                v-model="withdrawState.form.amount"
                rounded
                outlined
                dense
                borderless
                :rules="[Rules.required()]"
                lazy-rules
                @keypress="Rules.validatePositiveNumber"
                inputmode="decimal"
                :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                class="input-control"
                type="text"
                autocomplete="withdraw-amount"
              />
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="quick-area flex justify-start flex-wrap gap-3">
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
        <div v-if="needWithdrawalPassword" class="form-item row mb-5">
          <div class="label col-12">{{ $t("member.withdrawal.withdrawPassword") }}</div>
          <div class="input-content col-12 col-sm-4">
            <q-input
              standout
              v-model="withdrawState.form.withdrawal_password"
              rounded
              outlined
              dense
              borderless
              :rules="[Rules.required()]"
              lazy-rules
              :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
              type="text"
              autocomplete="withdraw-password"
              class="input-control security-mask"
            />
          </div>
        </div>
        <div class="form-item row mb-5">
          <div class="label col-12">{{ $t("member.withdrawal.withdrawalDetail") }}</div>
          <div class="input-content col-12 col-sm-12">
            <div class="wrap">
              <table>
                <tr>
                  <th>{{ $t("tableHeader.title") }}</th>
                  <th>{{ $t("tableHeader.content") }}</th>
                </tr>
                <tr>
                  <td>{{ $t("member.withdrawal.balance") }}</td>
                  <td>{{ moneyFormat(withdrawState.form.balance) }}</td>
                </tr>
                <tr>
                  <td>{{ $t("member.withdrawal.auditTurnover") }}</td>
                  <td>{{ moneyFormat(withdrawState.form.remaining_turnover) }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
            <!-- 渠道動態欄位 -->
            <div v-if="withdrawState.paymentDetail.extra_field_key" class="form-item">
              <template
                v-for="(field, key) in withdrawState.paymentDetail.extra_field[withdrawState.paymentDetail.extra_field_key]"
                :key="key"
              >
                <ExtraInput
                  v-if="isWithdrawExtraFieldVisible(field) && field.type === FIELD_TYPE.Enums.Input"
                  v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                  :field="field"
                />
                <ExtraSelect
                  v-else-if="isWithdrawExtraFieldVisible(field) && field.type === FIELD_TYPE.Enums.Select"
                  v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                  :field="field"
                  optionStyle=""
                />
                <ExtraInput
                  v-else-if="isWithdrawExtraFieldVisible(field)"
                  v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                  :field="field"
                />
              </template>
            </div>
        <div class="action-btns row justify-center">
          <q-btn
            text-color="black"
            class="submit-btn"
            type="submit"
            :disable="envInfo.withdraw_kyc_verify === 1 && !accountInfo.approval_status"
          >
            {{ $t("common.btn.submit") }}
          </q-btn>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import BackBtn from "app/template/set_r016/components/Button/Back.vue"
import { useSiteImg } from "app/template/set_r016/hooks/useSiteImg"
import { useBank } from "src/common/composables/useBank"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useRule } from "src/common/hooks/useRule"
import { FIELD_TYPE } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"

const router = useRouter()
const Rules = useRule()
const {
  bankCardState,
  withdrawState,
  showWithdrawCurrencyArea,
  showWithdrawTypeArea,
  bankList,
  gatewayFilterList,
  getBankList,
  getPaymentTypeList,
  getGatewayList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralPaymentClick,
  handleWithdralQuickBtnClick,
  handleWithdralBankCardClick,
  handleWithdralSubmit,
  getWithdrawBankCardList,
  needWithdrawalPassword,
  isBankCardIgnored,
  checkWithdrawalPassword,
  isWithdrawExtraFieldVisible,
} = useBank()
const { moneyFormat } = useCommon()
const { withdrawalKycImg, svgIcon } = useSiteImg()
const { envInfo } = useEnvInfoStore()
const { accountInfo } = useUserInfo()

onMounted(async () => {
  checkWithdrawalPassword({ routeName: "memberChangeWithdrawalPassword" })
  await getWithdralPaymentList()
  getBankList()
  getGatewayList()
  await getPaymentTypeList(withdrawState.form.currency)
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "src/css/form.sass";
@import "app/template/set_r016/assets/css/style.sass";
@import "app/template/set_r016/assets/css/_variable.scss";
@import "app/template/set_r016/assets/css/button.scss";

.wrap {
  overflow: hidden;
  // box-shadow: 0 0 20px rgba(0, 0, 0, 0.35)

  table {
    font-family: "Oswald", sans-serif;
    border-collapse: collapse;
    width: 100%;
    border-bottom: 1px solid #ffffff;

    th {
      border-bottom: 1px solid #ffffff;
      color: #ffffff;
      width: 25vw;
      height: 50px;

      @include iphone-width {
        height: 8vw;
      }
    }

    td {
      color: #ffffff;
      width: 25vw;
      height: 50px;
      text-align: center;
      transition: all 0.3s ease-in-out;

      @include iphone-width {
        height: 8vw;
      }
    }

    tr {
      &:nth-child(2) {
        td {
          border-bottom: 1px solid $secondary02;
        }
      }

      &:last-of-type {
        border-bottom: none;
      }

      &:hover {
        td {
          transition: all 0.3s ease-in-out;

          &:first-child {
            transition: all 0.3s ease-in-out;
          }
        }
      }

      td {
        &:first-child {
          transition: all 0.3s ease-in-out;
        }
      }
    }
  }
}

.card-container {
  @apply grid grid-cols-2 gap-5;

  @include pc-width {
    @apply grid grid-cols-2 gap-5;
  }

  @include iphone-width {
    @apply grid grid-cols-1 gap-6;
    width: 100%;
    height: 40rem;
    margin: 1rem auto;
    background-color: $primary-bg;
    padding: 0.75rem 0;
    overflow: auto;
    @include hideScrollBar;
  }
}

.bg-quick {
  color: #cf0808 !important;
  font-feature-settings: "liga" off, "clig" off;
  font-family: Helvetica;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-transform: capitalize;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  min-width: 3.75rem !important;
  width: auto !important;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
}

.order-wrapper {
  max-width: 75rem;
  margin: 1.25rem auto;
  padding-bottom: 6rem;

  @include phone-width {
    margin: 0;
    padding: 0.625rem 0.375rem;
  }

  .order-content {
    margin-top: 1.25rem;
    padding: 3.75rem;
    padding-bottom: 6rem !important;
    background-color: $primary07;
    color: $neutral01;
    border-radius: 0.625rem;

    @include phone-width {
      margin-top: 0.625rem;
      padding: 1.25rem;
    }

    .order-title {
      @include fontStyle(1.625rem);
      color: $secondary03;
    }

    .form-content {
      margin-top: 2.5rem;

      @include iphone-width {
        width: 100%;
        margin: 1rem auto;
        padding: 1rem 0rem;
        border-radius: 0.5rem;
      }

      .submit-btn {
        width: 300px;
        border-radius: 10px;
        background: linear-gradient(180deg, $primary04 0%, $primary05 100%);
        color: $neutral01 !important;
      }

      .form-item {
        margin-left: 0rem;

        .label {
          @include fontStyle(1.125rem);
          padding-left: 0rem;
          color: $neutral01;

          .learn-wallet {
            @include fontStyle(1.125rem, 400, 1.3125rem);
            color: $secondary03;

            .q-img {
              width: 1.25rem;
              height: 1.25rem;
              margin-right: 0.25rem;
              margin-left: 0.625rem;
            }

            .q-btn {
              @include fontStyle(1.125rem, 400, 1.3125rem);
              padding: 0;
              color: #48c2ff;
              text-decoration: underline;
            }
          }
        }

        .payment-form {
          width: 100%;
          margin-top: 1.25rem;

          .form-methods {
            @apply flex flex-wrap justify-start gap-1;
            margin: 20px 10px;
            flex-direction: row;

            .method-item {
              @apply relative w-auto flex justify-center items-center rounded-lg px-2 py-1 cursor-pointer;
              height: 2.8125rem;
              width: 8rem;
              margin: 0.3125rem;
              border: 1px solid rgba(255, 255, 255, 0.2);
              border-radius: 10px;

              @include pad-width {
                height: 4rem;
                max-width: fit-content;
              }

              @include iphone-width {
                width: 7rem;
                height: auto;
                max-height: 3rem;
              }

              &.active {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid #f9e8e8;
              }
            }
          }
        }

        .input-content {
          margin-top: 0.5rem;
          padding: 0;

          :deep(.q-field--disabled) {
            .q-field__control {
              div {
                opacity: 1 !important;
              }
            }
          }
        }

        .bank-content {
          width: 100%;
          max-width: 400px;
          height: auto;
          padding: 10px;
          list-style: none;

          li {
            @apply flex justify-start my-2 p-2;
            align-items: center;
            background: #fff;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 0.2rem;
            color: #000;

            i {
              margin: 0 5px;
              color: #d50c14;
              font-size: 1.2rem;
              cursor: pointer;
            }
          }
        }

        .radio-content {
          @include setFlex(flex-start);
          padding-top: 1.2rem;
          gap: 1.563vw;

          :deep(.q-radio) {
            .q-icon {
              color: $primary06;
            }
          }

          :deep(.q-radio__label) {
            color: $neutral01;
          }

          @include iphone-width {
            @apply grid grid-cols-3 !important;
            padding-top: 1.125rem;
            gap: 1rem;
          }

          &.long-mode {
            @include iphone-width {
              @apply grid grid-cols-2 !important;
            }
          }
        }

        &.birth-content {
          gap: 1.25rem;

          @include iphone-width {
            gap: 0;
            justify-content: space-between;
          }

          .month-day-content {
            flex-wrap: nowrap;
            gap: 1.25rem;

            @include iphone-width {
              @apply grid grid-cols-2;
            }
          }
        }
      }
    }
  }
}

:deep(.q-pagination) {
  .q-pagination__content {
    .q-btn {
      .q-btn__content {
        .q-icon {
          color: #ffc002 !important;
        }
      }
    }
  }
}

:deep(.nav-content) {
  @include iphone-width {
    background: $primary-btn-bg !important;
  }
}

.withdrawal-kyc-text {
  @apply mt-2 p-[.5rem] text-black rounded-[.25rem] max-w-[29.25rem];
  background-color: #ffc002;

  @include iphone-width {
    @apply ml-[2.75rem] max-w-[80%];
  }

  .withdrawal-kyc-img {
    @apply w-4 h-[.875rem] mb-1 mr-1;
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
</style>
