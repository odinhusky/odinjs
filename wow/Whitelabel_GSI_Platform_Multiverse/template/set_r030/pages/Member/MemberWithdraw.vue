<template>
  <div :class="cx('w-full', PAGE_X_SPACING, FLEX_CENTER)" class="withdraw-layout">
    <div class="withdraw-header">
      <span>{{ $t("menu.withdrawal") }}</span>
      <svg
        width="20"
        height="21"
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="cursor-pointer hidden phone:!block"
      >
        <path
          d="M15 3.5C15.5523 3.5 16 3.94772 16 4.5V16.5C16 17.0523 15.5523 17.5 15 17.5H5C4.44772 17.5 4 17.0523 4 16.5V4.5C4 3.94772 4.44772 3.5 5 3.5H15ZM6 14.5V15.7002H14V14.5H6ZM6 12.7998H14V11.5996H6V12.7998ZM6 9.7998H14V8.59961H6V9.7998ZM6 6.7998H11V5.59961H6V6.7998Z"
          class="fill-[var(--icon-02)]"
        />
      </svg>
      <q-menu class="bg-transparent hidden phone:!block" :offset="[-20, 0]">
        <MemberNav module="module2" />
      </q-menu>
    </div>
    <p v-if="envInfo.withdraw_kyc_verify === 1 && !accountInfo.approval_status" class="withdrawal-kyc-container">
      <q-img :src="withdrawalKycImg" alt="withdrawal-kyc" class="withdrawal-kyc-img" contain />
      <span class="withdrawal-kyc-text">{{ $t("common.validate.withdrawalKyc") }}</span>
    </p>
    <div class="withdraw-body">
      <!-- <PaymentNav /> -->
      <q-form @submit="handleWithdralSubmit">
        <div class="profile-form column">
          <div class="form-content">
            <!-- withdrawal detail -->
            <div class="!ml-0 mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.withdrawal.withdrawalDetail") }}</div>
              <div class="input-content col-12 col-sm-12">
                <div class="wrap">
                  <table>
                    <tr>
                      <th>{{ $t("member.withdrawal.balance") }}</th>
                      <th>{{ $t("member.withdrawal.auditTurnover") }}</th>
                    </tr>
                    <tr>
                      <td>{{ moneyFormat(withdrawState.form.balance) }}</td>
                      <td>{{ moneyFormat(withdrawState.form.remaining_turnover) }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <!-- currency -->
            <div v-if="showWithdrawCurrencyArea" class="!ml-0 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
              <div class="btn-content col-12">
                <ExtraSelect
                  :modelValue="withdrawState.form.currency"
                  @update:modelValue="($event) => handleWithdralCurrencyClick($event)"
                  :field="{
                    field_code: 'currency',
                    field_name: 'currency',
                    is_required: true,
                    type: FIELD_TYPE.Enums.Select,
                    values: withdrawState.supportedCurrency.map(item => ({
                      label: $t(formatterCurrency(item) as string),
                      value: item
                    }))
                  }"
                  optionStyle="option-style"
                  class="form-input"
                ></ExtraSelect>
                <!-- <q-btn
                  color="primary"
                  icon="fas fa-coins"
                  :label="$t(formatterCurrency(item) as string)"
                  :class="{ active: withdrawState.form.currency === item }"
                  v-for="item in withdrawState.supportedCurrency"
                  :key="item"
                  @click="handleWithdralCurrencyClick(item)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn> -->
              </div>
            </div>
            <!-- type -->
            <div v-if="showWithdrawTypeArea" class="!ml-0 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.type") }}</div>
              <div class="btn-content col-12">
                <ExtraSelect
                  :modelValue="withdrawState.usingFundType"
                  @update:modelValue="($event) => handleWithdralFundTypeClick($event)"
                  :field="{
                    field_code: 'usingFundType',
                    field_name: 'usingFundType',
                    is_required: true,
                    type: FIELD_TYPE.Enums.Select,
                    values: withdrawState.fundTypeList.map((item) => ({
                      label: typeI18n(item),
                      value: item,
                    })),
                  }"
                  optionStyle="option-style"
                  class="form-input"
                ></ExtraSelect>
              </div>
            </div>
            <!-- channel -->
            <div class="!ml-0 form-item row" v-if="!withdrawState.gateWayHidden">
              <div class="form-title label col-12">{{ $t("modal.gateway") }}</div>
              <div class="form-methods">
                <div
                  class="method-item"
                  :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
                  v-for="(item, key) in withdrawState.usingPaymentInfoList"
                  :key="key"
                  @click="handleWithdralPaymentClick(item.type, item.id)"
                >
                  <img :src="item.imgUrl" alt="" class="w-full h-full" />
                </div>
              </div>
            </div>
            <!-- bank card -->
            <div v-if="!isBankCardIgnored" class="!ml-0 mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("common.btn.account") }}</div>
              <div class="card-container">
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
              </div>
              <AddBankCard
                v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
                @click="router.push({ name: 'memberBank' })"
              />
            </div>
            <div class="!ml-0 form-item row">
              <div class="row col-12">
                <div class="form-title label col-12 whitespace-nowrap">
                  {{ $t("member.withdrawal.withdrawalAmmount") }}
                </div>
                <div class="btn-content col-12">
                  <q-input
                    v-model="withdrawState.form.amount"
                    class="input-control form-input"
                    autocomplete="off"
                    :readonly="amountReadonly"
                    @focusin="amountReadonly = false"
                    dense
                    borderless
                    lazy-rules
                    :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                    @keypress="Rules.validatePositiveNumber"
                    :rules="[Rules.required()]"
                  >
                    <template #prepend>
                      <div class="divider-error"></div>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <div class="!ml-0 form-item mb-2" v-show="withdrawState.form.crypto_rate">
              <ul>
                <li>
                  <span class="form-title label col-12">{{ `${$t("member.withdrawal.rate")}: ` }}</span>
                  <span class="form-title label col-12">
                    {{ withdrawState.form.crypto_rate ? withdrawState.form.crypto_rate : " -" }}
                  </span>
                </li>
                <li>
                  <span class="form-title label col-12">{{ `${$t("member.withdrawal.receivePay")}: ` }}</span>
                  <span class="form-title label col-12">
                    {{ Number(withdrawState.form.amount) * Number(withdrawState.form.crypto_rate) }}
                  </span>
                </li>
              </ul>
            </div>
            <div class="!ml-0 form-item mb-8">
              <div class="quick-btns flex flex-wrap gap-2">
                <q-btn
                  v-for="item in withdrawState.quickBtns"
                  :key="item"
                  color="quick"
                  class="quickBtns"
                  :class="{ active: withdrawState.form.amount === item }"
                  @click="handleWithdralQuickBtnClick(item)"
                >
                  {{ moneyFormat(item) }}
                </q-btn>
              </div>
            </div>
            <div v-if="needWithdrawalPassword" class="!ml-0 form-item row mb-5">
              <div class="form-title label col-12">{{ $t("member.withdrawal.withdrawPassword") }}</div>
              <div class="input-content withdrawal-input col-12 col-sm-4">
                <q-input
                  v-model="withdrawState.form.withdrawal_password"
                  class="input-control form-input"
                  input-class="pwd-mask"
                  autocomplete="off"
                  :readonly="pwdReadonly"
                  @focusin="pwdReadonly = false"
                  dense
                  borderless
                  lazy-rules
                  :rules="[Rules.required()]"
                  :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
                >
                  <template #prepend>
                    <div class="divider-error"></div>
                  </template>
                </q-input>
              </div>
            </div>
            <div v-if="withdrawState.uploadConfig.uploadSwitch && needUploadDetailFundType" class="!ml-0 form-item row">
              <div class="form-title label col-12">{{ $t("tableHeader.uploadDetail") }}</div>
              <div class="uploaded" v-if="withdrawState.uploadConfig.images.length > 0">
                <div class="item" v-for="(item, index) in withdrawState.uploadConfig.images" :key="index">
                  <img @click="showBiggerImage(item.image.base64)" :src="item.image.base64" alt="" />
                  <q-btn
                    color="red"
                    rounded
                    dense
                    icon="delete"
                    class="delete-btn"
                    size="sm"
                    @click="handleWithdralUploadImageDelete(index)"
                  ></q-btn>
                </div>
              </div>
            </div>
            <div v-if="withdrawState.uploadConfig.uploadSwitch && needUploadDetailFundType" class="!ml-0 form-item row">
              <div class="upload-area" @click="openUploader()">
                <q-img :src="commonSvgIcon('cloud-arrow-up')" size="32px"></q-img>
                <div class="warning">
                  {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
                </div>
              </div>
            </div>

            <!-- 渠道動態欄位 -->
            <div class="form-item row" v-if="withdrawState.paymentDetail.extra_field_key">
              <div class="row col-12">
                <div class="form-title label col-12">{{ $t("bank_column.client_Info") }}</div>
                <div
                  class="input-content col-12"
                  v-for="(field, key) in withdrawState.paymentDetail.extra_field[
                    withdrawState.paymentDetail.extra_field_key
                  ]"
                  :key="key"
                >
                  <!-- 文字輸入框 -->
                  <ExtraInput
                    v-if="isWithdrawExtraFieldVisible(field) && field.type === FIELD_TYPE.Enums.Input"
                    v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                    :field="field"
                    class="form-input"
                  ></ExtraInput>

                  <!-- 下拉選單類型 -->
                  <ExtraSelect
                    v-else-if="isWithdrawExtraFieldVisible(field) && field.type === FIELD_TYPE.Enums.Select"
                    v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                    :field="field"
                    optionStyle="option-style"
                    class="form-input"
                  ></ExtraSelect>

                  <!-- 其他 -->
                  <ExtraInput
                    v-else-if="isWithdrawExtraFieldVisible(field)"
                    v-model="withdrawState.form[withdrawState.paymentDetail.extra_field_key][field.field_name]"
                    :field="field"
                    class="form-input"
                  ></ExtraInput>
                </div>
              </div>
            </div>

            <div class="!ml-0 action-btns">
              <q-btn
                :disable="envInfo.withdraw_kyc_verify === 1 && !accountInfo.approval_status"
                :label="$t('common.btn.confirm')"
                class="submit-btn text-capitalize"
                type="submit"
              />
            </div>
          </div>
        </div>
      </q-form>
    </div>
  </div>
  <!-- 給修改出款密碼用 -->
  <router-view></router-view>
  <q-dialog v-model="imageDialogOpen">
    <q-card>
      <q-card-section class="flex justify-center">
        <img :src="previewImage" class="preview-image max-w-full max-h-[80vh]" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r030/hooks/useSiteImg"
import { useQuasar } from "quasar"
import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import MemberNav from "src/common/components/MemberNav/Index.vue"
import { useBank } from "src/common/composables/useBank"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useCommonImg } from "src/common/hooks/useCommonImg"
import { useRule } from "src/common/hooks/useRule"
import { FIELD_TYPE, MEMBER_BANK_EDIT } from "src/common/utils/constants"
import { FLEX_CENTER, PAGE_X_SPACING } from "src/common/utils/constants/styles"
import { cx } from "src/common/utils/cx"
import { useEnvInfoStore } from "src/stores/envStore"
import { onMounted, onUnmounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"

const { withdrawalKycImg } = useSiteImg()
const { commonSvgIcon } = useCommonImg()
const { uploadImage, moneyFormat } = useCommon()
const router = useRouter()
const Rules = useRule()
const { envInfo } = useEnvInfoStore()
const _$q = useQuasar()
const { accountInfo, useBasicInfoQuery } = useUserInfo()
useBasicInfoQuery()
const {} = useI18n()
const {
  gatewayFilterList,
  bankList,
  withdrawState,
  showWithdrawCurrencyArea,
  showWithdrawTypeArea,
  needUploadDetailFundType,
  typeI18n,
  getBankList,
  getGatewayList,
  getPaymentTypeList,
  getWithdralPaymentList,
  handleWithdralCurrencyClick,
  handleWithdralFundTypeClick,
  handleWithdralPaymentClick,
  handleWithdralQuickBtnClick,
  handleWithdralBankCardClick,
  handleWithdralUploadImageDelete,
  handleWithdralSubmit: originalHandleWithdralSubmit,
  needWithdrawalPassword,
  isBankCardIgnored,
  checkWithdrawalPassword,
  getWithdrawBankCardList,
  formatterCurrency,
  isWithdrawExtraFieldVisible,
} = useBank()

const { listenPreventOverflow, removeListenPreventOverflow } = useTelegram()

const { openUploader, uploadInit, maxSizeInMb } = uploadImage()

const imageDialogOpen = ref(false)
const previewImage = ref("")

// 金額/出款密碼欄位初始設 readonly，使用者 focus 時才解除，避免瀏覽器（尤其 Windows Chrome）自動帶入帳號/登入密碼
const amountReadonly = ref(true)
const pwdReadonly = ref(true)

const showBiggerImage = (base64: string) => {
  imageDialogOpen.value = true
  previewImage.value = base64
}

const handleWithdralSubmit = async () => {
  withdrawState.form.images = withdrawState.uploadConfig.images.map((item) => item.image.base64)

  let res = await originalHandleWithdralSubmit()

  withdrawState.form.amount = ""
  withdrawState.form.withdrawal_password = ""
  if (res) {
    router.push({ name: "orders", query: { search_type: 2 } })
  }
}

onMounted(async () => {
  uploadInit(withdrawState.uploadConfig.images, 5) // 上傳組件初始化config
  // 美術並未提供出款密碼彈窗畫面，先註解掉
  checkWithdrawalPassword({ routeName: "MemberWithdrawPassword" })
  await getWithdralPaymentList()
  await getGatewayList()
  await getBankList()
  await getPaymentTypeList(withdrawState.form.currency)
  // getWithdrawBankCardList()
  listenPreventOverflow()
})

onUnmounted(() => {
  removeListenPreventOverflow()
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
// @import "src/css/form.sass";
@import "app/template/set_r030/assets/css/_variable.scss";

// 出款密碼欄不使用 type="password"（避免瀏覽器密碼自動帶入），改以 CSS 遮蔽顯示
::v-deep(input.pwd-mask) {
  -webkit-text-security: disc;
}

// common style
.form-input {
  margin-top: 0;

  ::v-deep(.q-field__inner) {
    height: 2.6875rem;
    border-radius: 0.25rem;
    border: 2px solid var(--neutral-05);
    background: var(--secondary-10);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);

    .q-field__native {
      color: var(--neutral-01);
    }

    .q-field__control {
      color: var(--primany-01);
      border-radius: 0.25rem;
      // padding: 0 0.75rem
    }
  }
}

.form-input {
  @apply w-full;
  @include phone-width {
    padding-bottom: 0.625rem;
    margin-bottom: 0;
  }

  :deep(.q-icon) {
    color: var(--neutral-01);
  }

  :deep(.q-field__control) {
    // min-height: 45px
    height: 100%;
    border-bottom: 0.0625rem solid #dee3f026;
    border-radius: 0.5rem;

    .q-field__control-container {
      padding: 0;
    }

    .q-field__native {
      height: 100%;
      color: var(--neutral-01);

      .q-field__input {
        color: var(--neutral-01);
      }
    }

    .q-field__label {
      height: 100%;
      color: dimgrey;
    }

    .q-field__append {
      height: 100%;
      line-height: 100%;
    }

    &::after {
      height: 100%;
    }
  }
}

// 上傳組件樣式
.preview-image {
  width: 50vw;
  height: auto;
  @include iphone-width {
    width: 100vw;
  }
}

.uploaded {
  margin-top: 1rem;
  @apply grid grid-cols-2 gap-4 w-full;

  .item {
    @apply relative;
    @apply rounded overflow-hidden;
    border: 2px dashed var(--bg-line-03);
    width: 100%;
    height: 200px;

    img {
      @apply w-full;
    }

    .delete-btn {
      @apply p-2 absolute right-4 bottom-4;
    }
  }

  @include iphone-width {
    @apply grid grid-cols-1 gap-4;
    .item {
      width: 100%;
      height: auto;
      margin: 0 auto;
    }
  }
}

.upload-area {
  display: flex;
  height: 89px;
  width: 100%;
  padding: 20px;
  margin: 1rem 0;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 12px;
  border: 2px dashed var(--bg-line-03);
  cursor: pointer;

  .q-img {
    color: var(--neutral-01);
    width: 1.5rem;
  }

  .warning {
    @apply text-sm;
  }
}

.input-content {
  display: flex;
  flex-direction: row;
  font-family: Helvetica;
  padding-top: 0.5rem;

  ::v-deep(.q-field__control) {
    border-radius: 0px;
    border: 0px;
    // padding: 0 1.2rem
  }

  ul {
    color: $neutral10;
  }
}

// 桌機 & 手機通用輸入框樣式
.input-control {
  :deep(.q-field__control .q-field__native) {
    // 設定在輸入的時候的文字顏色，優先級會被其他設定蓋掉，所以要加強優先級
    &:focus {
      color: rgba(255, 255, 255, 0.9);
    }
  }
  :deep(.q-field__native) {
    height: calc(100% - 2px);
    border: none !important;
    color: rgba(255, 255, 255, 0.9);
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0px 1000px var(--input-dropdown-bg-01) inset !important;
      box-shadow: 0 0 0px 1000px var(--input-dropdown-bg-01) inset !important;
      // 自動填入的時候的文字顏色
      -webkit-text-fill-color: var(--input-dropdown-text-01) !important;

      // --- 關鍵修復：處理左右出現的邊框 ---
      border-radius: 0 !important;
    }

    &::placeholder {
      color: var(--input-dropdown-text-01) !important;
    }
  }
}

.wrap {
  display: flex;
  align-items: flex-start;
  gap: 1px;
  align-self: stretch;
  margin-top: 5px;
  width: 100%;

  table {
    color: var(--text-03);
    text-align: center;
    font-family: Helvetica;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-transform: capitalize;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;

    tr {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 1px;
    }

    th {
      width: 50%;
      display: flex;
      min-width: 80px;
      padding: 12px 8px;
      justify-content: center;
      align-items: center;
      gap: 6px;
      align-self: stretch;
      background: var(--bg-13);

      @include iphone-width {
        font-family: Helvetica;
        height: 8vw;
      }
    }

    td {
      width: 50%;
      display: flex;
      min-width: 80px;
      padding: 12px 8px;
      justify-content: center;
      align-items: center;
      gap: 6px;
      align-self: stretch;
      background: var(--bg-14);

      @include iphone-width {
        font-family: Helvetica;
        height: 8vw;
      }
    }
  }

  ::v-deep(.q-field__control) {
    border-radius: 0px;
  }
}

.triangle {
  width: 0;
  height: 0;
  border-top: 0px solid transparent;
  border-right: 0px solid transparent;
  border-bottom: 25px solid $emotional06;
  border-left: 25px solid transparent;
  position: absolute;
  display: none;
  right: 0;
  bottom: 0;

  i {
    position: absolute;
    right: 2px;
    bottom: -25px;
    color: $neutral01;
    font-size: 0.8rem;
  }
}

.card-container {
  color: $neutral07;
  padding-top: 0.5rem;
  width: 100%;
  @apply grid grid-cols-2 gap-2;

  @include pc-width {
    @apply grid-cols-2;
  }

  @include iphone-width {
    @apply grid-cols-1;
    width: 100%;
    height: auto;
    margin: 0 auto;
    padding: 0;
    @include hideScrollBar;
  }
}

.edit-dialog {
  .dialog-card {
    width: 100%;
    height: 500px;
    background-color: $neutral01;

    .dialog-header {
      height: 5.5rem;
      font-size: 2rem;
      padding: 1.25rem 1.75rem;
      border-bottom: 1px solid rgba($neutral02, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .q-btn {
        font-size: 2rem;
        text-transform: capitalize;
        font-weight: 400;
        padding: 0;
        min-height: auto;
      }

      .btn-cancel {
        color: $neutral03;
      }

      .title {
        font-weight: bold;
        max-width: 20rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 700;
      }
    }

    .dialog-body {
      .dialog-form-row {
        width: 100%;
        padding: 20px;
        height: 134px;

        :deep(.q-field__control) {
          color: $neutral02 !important;
        }

        .dialog-form-title {
          font-weight: 400;
          line-height: 2.87;
          letter-spacing: 0.00938em;
          position: relative;
          display: block;
          transform-origin: left top;
          text-overflow: ellipsis;
          max-width: 100%;
          font-family: "PingFang SC";
          color: $neutral04;
          font-size: 1.75rem;
          padding: 0px;
          white-space: nowrap;
          overflow: hidden;
          transition: color 200ms cubic-bezier(0, 0, 0.2, 1), transform 200ms cubic-bezier(0, 0, 0.2, 1),
            max-width 200ms cubic-bezier(0, 0, 0.2, 1);
        }

        .dialog-form-input {
          font-size: 1.75rem;
          font-weight: 400;

          :deep(.q-icon) {
            font-size: 1.875rem !important;
          }
        }
      }

      .select-container {
        height: 25.75rem;
        overflow-y: scroll;

        .select-row {
          width: 100%;
          height: 96px;
          list-style: none;
          color: $neutral04;
          font-size: 1.75rem;
          padding: 0px 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .check-img {
            display: none;
          }

          &.active {
            color: $neutral07;
            font-weight: bold;
            background: rgba($neutral01, 0.5);

            .check-img {
              display: block;
              width: 2.5rem;
              height: 2.5rem;
            }
          }
        }
      }
    }

    @include phone-width {
      height: 350px;

      .dialog-header {
        height: 2.9375rem;
        font-size: 16px;
        padding: 10px 14px;

        .q-btn {
          font-size: 1rem;
        }

        .title {
          max-width: 160px;
          font-size: 1.125rem;
        }
      }

      .dialog-body {
        .dialog-form-row {
          .dialog-form-title {
            font-size: 0.875rem;
          }
          .dialog-form-input {
            font-size: 0.875rem;
          }
        }

        .select-container {
          height: 12.875rem;

          .select-row {
            height: 3rem;
            font-size: 0.875rem;
            padding: 0px 0.875rem;

            &.active {
              .check-img {
                width: 1.375rem;
                height: 1.375rem;
              }
            }
          }
        }
      }
    }
  }
}

// pc mode
.withdraw-layout {
  // max-width: 55rem
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: var(--bg-11);
  padding: 20px;
  gap: 10px;
  flex: 1 0 0;
  margin-bottom: 40px;

  @include phone-width {
    background: transparent;
    padding: 0;
  }

  .withdraw-header {
    @apply w-full flex justify-start items-center;
    span {
      margin-right: 5px;
      color: $neutral01;
      font-family: "Noto Sans";
      font-size: 1.2rem;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: capitalize;
    }
  }

  .withdraw-body {
    width: 100%;
    color: $neutral01;
    max-width: 560px;
    overflow: hidden;

    @include iphone-width {
      padding: 0;
    }

    .profile-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      -webkit-box-pack: start;
      justify-content: flex-start;

      .form-content {
        width: 100%;

        .form-item {
          .form-title {
            display: flex;
            align-items: center;
            gap: 6px;
            align-self: stretch;
            color: var(--text-03, rgba(255, 255, 255, 0.77));
            font-family: "Noto Sans";
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 21px;
          }

          .form-methods {
            @apply flex flex-wrap justify-start gap-1;
            padding-left: 0.5rem;
            width: 100%;

            @include pad-width {
              width: 100%;
            }

            @include phone-width {
              @apply grid-cols-3;
            }

            .method-item {
              @apply relative w-auto flex justify-center items-center rounded-md p-0 cursor-pointer;
              height: 90px;
              display: flex;
              align-items: center;
              justify-content: center;
              // max-width: 45%
              margin-right: 0.5rem;
              padding: 0.2rem;
              border: 1px solid $emotional03;

              @include pad-width {
                height: 4rem;
                max-width: fit-content;
              }

              @include iphone-width {
                width: 100%;
                height: auto;
              }

              &.active {
                background: linear-gradient(to bottom, $emotional03 0%, $emotional06 33%, $emotional03 100%);
                color: $neutral01;
              }
            }
          }

          .input-content {
            font-family: OpenSans;
            :deep(.q-field--disabled) {
              .q-field__control {
                div {
                  opacity: 1 !important;
                }
              }
            }
          }

          .payment-form {
            width: 100%;
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
              background: $neutral01;
              border: 1px solid rgba($neutral01, 0.5);
              border-radius: 0.2rem;
              color: $neutral10;

              i {
                margin: 0 5px;
                color: $emotional01;
                font-size: 1.2rem;
                cursor: pointer;
              }
            }
          }

          .btn-content {
            @apply gap-3;
            @include setFlex(flex-start);
            padding-top: 0.5rem;
            flex-wrap: wrap;

            ::v-deep(.q-btn) {
              font-family: OpenSans;
              text-transform: none;
              display: flex;
              -webkit-box-align: center;
              align-items: center;
              border: 2px solid $neutral02 !important;
              border-radius: 10px;
              padding: 0px 15px;
              position: relative;
              width: 150px;
              height: 60px;
              font-size: 1rem;
              background: $neutral01 !important;
              color: $neutral07 !important;
              overflow: hidden;

              &.active {
                border: 2px solid $emotional07 !important;
                color: $emotional07 !important;

                .triangle {
                  display: block;
                }
              }
            }
          }
        }

        .action-btns {
          .submit-btn {
            border-radius: 4px;

            color: #fff;
            background: linear-gradient(90deg, #22c55e 0%, #1fab3d 100%);
            width: 100%;
          }
        }
      }
    }
  }
}

.withdrawal-input {
  width: 100%;
  ul {
    color: var(--text-03);
    display: flex;
    width: 8rem;
    margin: 0 1rem;
    align-content: center;
    flex-direction: column;
    font-size: 12px;
  }
  :deep(.q-field__native) {
    font-family: Helvetica !important;
    border-radius: 0;
  }
}

.quickBtns {
  display: flex;
  padding: 6px 10px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 15px;
  background: var(--tab-bg-04);
  color: var(--tab-text-01);
  font-family: "Noto Sans TC";

  &.active {
    background: var(--btn-bg-01);
    color: var(--btn-text-01);
  }
}

.withdrawal-kyc-container {
  @apply flex items-center mt-2 p-[.5rem] rounded-[.25rem] max-w-[28.75rem];
  background: #d3e4ff;
  color: $neutral10;

  .withdrawal-kyc-img {
    @apply w-4 h-4 mr-2 flex-shrink-0;
  }
}
</style>
