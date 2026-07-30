<template>
  <HeaderTitleBack v-if="isMobile" titleI18n="member.withdrawal.title" dialogClass="withdrawal-dialog-okbet">
    <q-form class="withdraw-layout h5" :class="{ '!pb-[24rem]': isTelegramMiniApp }" @submit="handleWithdralSubmit">
      <div class="withdraw-container">
        <!-- currency -->
        <div v-if="showWithdrawCurrencyArea" class="info-row">
          <p v-if="envInfo.withdraw_kyc_verify === 1 && !userInfo2.approval_status" class="withdrawal-kyc-container">
            <q-img :src="withdrawalKycImg" alt="withdrawal-kyc" class="withdrawal-kyc-img" contain />
            <span class="withdrawal-kyc-text">{{ $t("common.validate.withdrawalKyc") }}</span>
          </p>
          <div class="mt-2.5 info-title col-12">{{ $t("member.deposit.selectCurrency") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
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
            </q-btn>
          </div>
        </div>
      </div>
      <div class="withdraw-container">
        <!-- type -->
        <div v-if="showWithdrawTypeArea" class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.withdrawal.type") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              color="primary"
              :label="typeI18n(item)"
              :class="{ active: withdrawState.usingFundType === item }"
              v-for="item in withdrawState.fundTypeList"
              :key="item"
              @click="handleWithdralFundTypeClick(item)"
            >
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="withdraw-container" v-if="!withdrawState.gateWayHidden">
        <!-- channel -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.withdrawal.selectMethod") }}</div>
          <div class="flex-row my-2.5 info-content currency col-12 col-sm-10">
            <q-btn
              color="primary"
              :class="{ active: String(item.id) === `${withdrawState.form.payment_gateway_id}` }"
              v-for="(item, key) in withdrawState.usingPaymentInfoList"
              :key="key"
              @click="handleWithdralPaymentClick(item.type, item.id)"
            >
              <!-- <div :style="{ backgroundImage: `url('${ item.imgUrl }')` }" class="h-full w-full" /> -->
              <img :src="item.imgUrl" class="h-full" />
              <div class="triangle">
                <i class="fas fa-check inner-icon"></i>
              </div>
            </q-btn>
          </div>
        </div>
      </div>
      <div v-if="!isBankCardIgnored" class="withdraw-container">
        <!-- card -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">{{ $t("member.withdrawal.selectBankCard") }}</div>
          <div class="flex-row my-2.5 info-content normal col-12 col-sm-10">
            <div class="card-container">
              <BankCard
                v-for="item in withdrawState.bankCards"
                :key="item.id"
                :card="item"
                :activeId="withdrawState.form.bank_id"
                :bankList="bankList"
                :gatewayFilterList="gatewayFilterList"
                @click="handleWithdralBankCardClick(item.id, item.crypto_rate)"
              />
              <AddBankCard
                v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
                @click="router.push({ name: 'memberBank' })"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="withdraw-container" v-if="withdrawState.uploadConfig.uploadSwitch && needUploadDetailFundType">
        <div class="info-row">
          <div class="mt-5 info-title col-12">
            {{ $t("tableHeader.uploadDetail") }}
          </div>
          <div class="flex justify-center flex-row my-5 w-full">
            <div class="uploaded">
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
            <div class="upload-area" @click="openUploader()">
              <q-icon name="add" size="32px"></q-icon>
              <div class="warning">
                {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="withdraw-container">
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
            <!-- <tr>
              <td>{{ $t("member.withdrawal.withdrawable_balance") }}</td>
              <td>{{ moneyFormat(withdrawableBalance) }}</td>
            </tr> -->
          </table>
        </div>
      </div>
      <div class="withdraw-container">
        <!-- amount -->
        <div class="info-row">
          <div class="mt-2.5 info-title col-12">
            {{ $t("member.withdrawal.withdrawalAmmount") }}
          </div>
          <div class="flex-col w-full info-content normal col-12 col-sm-10">
            <div class="w-full input-content withdrawal-input col-12">
              <q-input
                v-model="withdrawState.form.amount"
                class="input-control"
                :rules="[Rules.required()]"
                @keypress="Rules.validatePositiveNumber"
                inputmode="decimal"
                lazy-rules
                :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                type="text"
                autocomplete="withdraw-amount"
              />
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
            </div>
            <div class="input-content mb-2.5 col-12 w-full">
              <div class="flex justify-start gap-1">
                <q-btn
                  v-for="item in withdrawState.quickBtns"
                  :key="item"
                  color="quick"
                  text-color="black"
                  @click="handleWithdralQuickBtnClick(item)"
                >
                  {{ moneyFormat(item) }}
                </q-btn>
              </div>
            </div>
          </div>
          <template v-if="needWithdrawalPassword">
            <div class="info-title mt-2.5 col-12">{{ $t("member.withdrawal.withdrawPassword") }}</div>
            <div class="info-content flex-col normal col-12 col-sm-10 w-full">
              <div class="input-content withdrawal-input col-12 w-full">
                <q-input
                  v-model="withdrawState.form.withdrawal_password"
                  type="text"
                  autocomplete="withdraw-password"
                  :rules="[Rules.required()]"
                  lazy-rules
                  :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
                  class="input-control security-mask"
                />
              </div>
            </div>
          </template>
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
      <div class="justify-center action-btns row">
        <q-btn
          text-color="white"
          color="primary"
          class="submit-btn"
          type="submit"
          :disable="envInfo.withdraw_kyc_verify === 1 && !userInfo2.approval_status"
        >
          {{ $t("common.btn.confirm") }}
        </q-btn>
      </div>
    </q-form>
    <FooterNav />
  </HeaderTitleBack>

  <div v-else class="withdraw-layout pc">
    <div class="withdraw-header">
      <img :src="memberImg('withdraw.png')" alt="withdraw" class="title-img" />
    </div>
    <p v-if="envInfo.withdraw_kyc_verify === 1 && !userInfo2.approval_status" class="withdrawal-kyc-container">
      <q-img :src="withdrawalKycImg" alt="withdrawal-kyc" class="withdrawal-kyc-img" contain />
      <span class="withdrawal-kyc-text">{{ $t("common.validate.withdrawalKyc") }}</span>
    </p>
    <div class="withdraw-body">
      <!-- <PaymentNav /> -->
      <q-form @submit="handleWithdralSubmit">
        <div class="profile-form column">
          <div class="form-content">
            <!-- currency -->
            <div v-if="showWithdrawCurrencyArea" class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.selectCurrency") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
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
                </q-btn>
              </div>
            </div>
            <!-- type -->
            <div v-if="showWithdrawTypeArea" class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.deposit.type") }}</div>
              <div class="btn-content col-12 col-sm-10">
                <q-btn
                  color="primary"
                  :label="typeI18n(item)"
                  :class="{ active: withdrawState.usingFundType === item }"
                  v-for="item in withdrawState.fundTypeList"
                  :key="item"
                  @click="handleWithdralFundTypeClick(item)"
                >
                  <div class="triangle">
                    <i class="fas fa-check inner-icon"></i>
                  </div>
                </q-btn>
              </div>
            </div>
            <!-- channel -->
            <div class="mb-5 form-item row" v-if="!withdrawState.gateWayHidden">
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
            <div v-if="!isBankCardIgnored" class="mb-5 form-item row">
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
                <AddBankCard
                  v-if="envInfo.member_bank_edit === MEMBER_BANK_EDIT.Enums.OPEN"
                  @click="router.push({ name: 'memberBank' })"
                />
              </div>
            </div>
            <div class="form-item row">
              <div class="row col-12">
                <div class="form-title label col-12 whitespace-nowrap">
                  {{ $t("member.withdrawal.withdrawalAmmount") }}
                </div>
                <div class="input-content withdrawal-input col-12">
                  <q-input
                    v-model="withdrawState.form.amount"
                    :rules="[Rules.required()]"
                    @keypress="Rules.validatePositiveNumber"
                    lazy-rules
                    :placeholder="`${$t('member.deposit.withdrawAmount')}`"
                    class="input-control"
                    type="text"
                    autocomplete="withdraw-amount"
                  />
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
                </div>
              </div>
            </div>
            <div class="form-item mb-8">
              <div class="flex justify-start flex-wrap gap-3 px-2">
                <q-btn
                  v-for="item in withdrawState.quickBtns"
                  :key="item"
                  color="quick"
                  text-color="black"
                  class="quickBtns"
                  @click="handleWithdralQuickBtnClick(item)"
                >
                  {{ moneyFormat(item) }}
                </q-btn>
              </div>
            </div>
            <div v-if="needWithdrawalPassword" class="form-item row mb-5">
              <div class="form-title label col-12">{{ $t("member.withdrawal.withdrawPassword") }}</div>
              <!-- 出款密碼 -->
              <div class="input-content withdrawal-input col-12 col-sm-4">
                <q-input
                  v-model="withdrawState.form.withdrawal_password"
                  type="text"
                  autocomplete="withdraw-password"
                  :rules="[Rules.required()]"
                  lazy-rules
                  :placeholder="`${$t('member.withdrawal.withdrawPassword')}`"
                  class="input-control security-mask"
                />
              </div>
            </div>
            <div v-if="withdrawState.uploadConfig.uploadSwitch && needUploadDetailFundType" class="form-item row">
              <div class="form-title label col-12">{{ $t("tableHeader.uploadDetail") }}</div>
              <div class="uploaded">
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
            <div v-if="withdrawState.uploadConfig.uploadSwitch && needUploadDetailFundType" class="form-item row">
              <div class="upload-area" @click="openUploader()">
                <q-icon name="add" size="32px"></q-icon>
                <div class="warning">
                  {{ $t("member.deposit.depositDetailUploadWarning", { mb: maxSizeInMb }) }}
                </div>
              </div>
            </div>

            <div class="mb-5 form-item row">
              <div class="form-title label col-12">{{ $t("member.withdrawal.withdrawalDetail") }}</div>
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
                    <!-- <tr>
                      <td>{{ $t("member.withdrawal.withdrawable_balance") }}</td>
                      <td>{{ moneyFormat(withdrawableBalance) }}</td>
                    </tr> -->
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
            <div class="justify-center action-btns row">
              <q-btn
                text-color="white"
                color="primary"
                class="submit-btn"
                type="submit"
                :disable="envInfo.withdraw_kyc_verify === 1 && !userInfo2.approval_status"
              >
                {{ $t("common.btn.confirm") }}
              </q-btn>
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
import { useSiteImg } from "app/template/okbet/hooks/useSiteImg"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useBank } from "src/common/composables/useBank"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useRule } from "src/common/hooks/useRule"
import { FIELD_TYPE, MEMBER_BANK_EDIT, WALLET_TYPE } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"
import { computed, onMounted, onUnmounted, ref, toRef, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import ExtraInput from "src/common/components/ExtraInput/Index.vue"
import ExtraSelect from "src/common/components/ExtraInput/Select.vue"
import FooterNav from "../../components/Footer/FooterNav.vue"
import AddBankCard from "./components/AddBankCard.vue"
import BankCard from "./components/BankCard.vue"

const { isDown } = useMediaQuery()
const isMobile = toRef(isDown, "phone")

const { memberImg, withdrawalKycImg } = useSiteImg()
const { uploadImage, moneyFormat } = useCommon()
const router = useRouter()
const Rules = useRule()
const { envInfo } = useEnvInfoStore()
const { userInfo2, userWalletMap, activeWalletCurrencyCode } = useUserInfo()
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

const { isTelegramMiniApp, listenPreventOverflow, removeListenPreventOverflow } = useTelegram()

// 依照所選的幣別，從 userWalletMap 取出可提領的餘額
const withdrawableBalance = computed(() => {
  try {
    return userWalletMap.value[withdrawState.form.currency]?.[WALLET_TYPE.Enums.Cash]?.withdrawable_balance || 0
  } catch (error) {
    return 0
  }
})

const { openUploader, uploadInit, maxSizeInMb } = uploadImage()

const imageDialogOpen = ref(false)
const previewImage = ref("")

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
  checkWithdrawalPassword({ routeName: "memberChangeWithdrawalPassword" })
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

// 監聽 activeWalletCurrencyCode 和 supportedCurrency，自動同步幣別選擇
watch(
  [() => activeWalletCurrencyCode.value, () => withdrawState.supportedCurrency],
  ([currencyCode, supportedCurrencies]) => {
    if (!supportedCurrencies || supportedCurrencies.length === 0) return

    // 檢查當前活躍錢包幣別是否在支持的幣別列表中
    if (currencyCode && supportedCurrencies.includes(currencyCode)) {
      // 如果支持該幣別且當前選擇的幣別不是該幣別，則切換
      if (withdrawState.form.currency !== currencyCode) {
        handleWithdralCurrencyClick(currencyCode)
      }
    } else {
      // 如果不支持或沒有活躍幣別，選擇第一個
      if (supportedCurrencies[0] && withdrawState.form.currency !== supportedCurrencies[0]) {
        handleWithdralCurrencyClick(supportedCurrencies[0])
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "src/css/form.sass";
@import "app/template/okbet/assets/css/_variable.sass";

// common style
// 上傳組件樣式
.preview-image {
  width: 50vw;
  height: auto;

  @include iphone-width {
    width: 100vw;
  }
}

.uploaded {
  @apply grid grid-cols-3 gap-4;

  .item {
    @apply relative border border-black/20 rounded overflow-hidden;
    width: 200px;
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
      width: 300px;
      height: auto;
      margin: 0 auto;
    }
  }
}

.upload-area {
  color: #000;
  margin: 1rem 0;
  @apply aspect-video bg-black/5 rounded flex flex-col gap-2 px-4 items-center justify-center cursor-pointer hover:bg-black/15 border-dashed border border-black/50 break-all;

  .warning {
    @apply text-sm;
  }
}

.input-content {
  display: flex;
  flex-direction: row;
  font-family: Helvetica;

  ::v-deep(.q-field__control) {
    border-radius: 0px;
    border: 0px;
    border-bottom: 2px solid $border-pale-gray-color;
    padding: 0 1.2rem;
  }

  ul {
    color: $text-dark-color;
  }
}

.wrap {
  overflow: hidden;
  box-shadow: 0 0 20px rgba($box-shadow-dark-color, 0.35);

  @include iphone-width {
    padding: 1rem;
  }

  table {
    font-family: "Oswald", sans-serif;
    border-collapse: collapse;
    width: 100%;

    th {
      font-family: OpenSans;
      background-color: $primary-color !important;
      border: 2px solid $primary-color;
      color: $text-light-color;
      width: 25vw;
      height: 50px;

      @include iphone-width {
        font-family: Helvetica;
        height: 8vw;
      }
    }

    td {
      font-family: OpenSans;
      background-color: $background-light-color;
      border: 2px solid $primary-color !important;
      color: $primary-color !important;
      width: 25vw;
      height: 50px;
      text-align: center;
      transition: all 0.3s ease-in-out;

      @include iphone-width {
        font-family: Helvetica;
        height: 8vw;
      }
    }

    tr {
      border-bottom: 1px solid $border-charcoal-gray-dark-color;

      &:last-of-type {
        border-bottom: none;
      }

      &:hover {
        td {
          background-color: $background-light-color;
          border: 2px solid $primary-color;
          color: $primary-color;
          transition: all 0.3s ease-in-out;

          &:first-child {
            color: rgba($text-turquoise-blue-color, 1);
            border-left: 5px solid rgba($text-turquoise-blue-color, 1);
            transition: all 0.3s ease-in-out;
          }
        }
      }

      td {
        &:first-child {
          color: rgba($text-turquoise-blue-color, 0.6);
          transition: all 0.3s ease-in-out;
        }
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
  border-bottom: 25px solid $border-medium-bright-blue-color;
  border-left: 25px solid transparent;
  position: absolute;
  display: none;
  right: 0;
  bottom: 0;

  i {
    position: absolute;
    right: 2px;
    bottom: -25px;
    color: $text-light-color;
    font-size: 0.8rem;
  }
}

.card-container {
  color: $text-charcoal-gray-color;
  width: 100%;
  @apply grid grid-cols-2 gap-5;

  @include pc-width {
    @apply grid-cols-2 gap-5;
  }

  @include iphone-width {
    @apply grid-cols-1 gap-6;
    width: 100%;
    height: auto;
    margin: 0 auto;
    padding: 0;
    @include hideScrollBar;
  }
}

.bg-quick {
  color: $text-light-color;
  padding: 0.5rem;
  border: 1px solid rgba($border-light-color, 0.15);
  min-width: 3.75rem !important;
  width: auto !important;
  border-radius: 0.5rem;
}

// h5 mode
.withdraw-layout.h5 {
  width: 100%;
  display: inline-grid;
  row-gap: 1rem;
  overflow-y: auto;
  background: $background-pale-silver-color;
  padding-bottom: 6rem;

  @include phone-width {
    row-gap: 0.5rem;
    height: calc(100dvh - 2.875rem);
  }

  .action-btns {
    margin: 0.5rem 0.5rem 1rem 0.5rem;

    .submit-btn {
      font-family: serif;
      width: 100%;
    }
  }

  .withdraw-container {
    width: 100%;
    list-style: none;
    background: $background-light-color;
    box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4rem 10rem,
      rgba($box-shadow-light-color, 0.8) 0rem 2rem 2rem inset;
    box-sizing: border-box;

    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-flow: row wrap;
      padding-left: 1.875rem;
      padding-right: 1.25rem;
      flex: 1 1 0%;
      font-size: 1.75rem;
      line-height: 2.5rem;
      color: $text-steel-blue-color;
      box-shadow: rgba($box-shadow-soft-blue-gray-color, 0.12) 0px 4rem 10rem,
        rgba($box-shadow-light-color, 0.8) 0rem 2rem 2rem inset;

      @include phone-width {
        padding-left: 0.6rem;
        padding-right: 0.6rem;
        min-height: 5rem;
        height: auto;
        font-size: 1rem;
        line-height: 1.375rem;

        &.read-only {
          min-height: 5rem;
        }
      }

      .info-title {
        font-family: Helvetica;
        width: 100%;
        text-transform: capitalize;
        border-bottom: 1px solid $border-pale-gray-color;
        padding-bottom: 0.8rem;

        @include phone-width {
          padding-bottom: 0.4rem;
        }
      }

      .info-content {
        font-family: Helvetica;
        color: $text-sky-gray-color;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1.563vw;

        &.normal {
          ::v-deep(.q-btn) {
            text-transform: none;
            display: flex;
            align-items: center;
            padding: 0px 15px;
            position: relative;
            width: calc(33.33% - 0.2rem);
            height: 20px;
            font-size: 1rem;
          }
        }

        &.currency {
          ::v-deep(.q-btn) {
            @apply whitespace-normal break-all;
            text-transform: none;
            display: flex;
            align-items: center;
            border: 2px solid $border-pale-gray-color !important;
            border-radius: 10px;
            padding: 0;
            position: relative;
            width: 48%;
            height: 75px;
            font-size: 1rem;
            background: $background-light-color !important;
            color: $text-charcoal-gray-color !important;
            overflow: hidden;

            &.active {
              border: 2px solid $primary-color !important;
              color: $primary-color !important;

              .triangle {
                display: block;
              }
            }
          }

          .q-btn__content {
            width: 100%;
            height: 100%;

            div {
              background-repeat: no-repeat;
              background-position: center;
              background-size: 100%;
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
            background: $background-light-color;
            border: 2px solid $border-pale-gray-color;
            border-radius: 0.2rem;
            color: $text-dark-color;

            i {
              margin: 0 5px;
              color: $text-danger-tertiary-color;
              font-size: 1.2rem;
              cursor: pointer;
              padding: 0;
            }
          }
        }

        .q-icon {
          margin-left: 1.25rem;
          margin-right: 0.625rem;

          @include phone-width {
            margin-left: 0.6875rem;
            margin-right: 0.375rem;
            @include setFlex(flex-start);
            padding-top: 1rem;
            padding-left: 0.75rem;
          }
        }
      }
    }

    .q-separator {
      margin-left: 1.75rem;
      margin-right: 1.75rem;
      height: 1px;
      background-color: $background-pale-gray-color;

      @include phone-width {
        margin-left: 14px;
        margin-right: 14px;
      }
    }
  }
}

.edit-dialog {
  .dialog-card {
    width: 100%;
    height: 500px;
    background-color: $background-light-color;

    .dialog-header {
      height: 5.5rem;
      font-size: 2rem;
      padding: 1.25rem 1.75rem;
      border-bottom: 1px solid rgba($border-pale-gray-color, 0.5);
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
        color: $text-sky-gray-color;
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
          color: $text-pale-gray-color !important;
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
          color: $text-charcoal-gray-color-light;
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
          color: $text-charcoal-gray-color-light;
          font-size: 1.75rem;
          padding: 0px 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .check-img {
            display: none;
          }

          &.active {
            color: $text-charcoal-gray-color;
            font-weight: bold;
            background: rgba($background-pale-blue-color, 0.5);

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
.withdraw-layout.pc {
  width: 55rem;
  height: 100%;
  padding: 4.375rem 3.125rem 1.875rem;

  .withdraw-header {
    @apply w-full flex justify-between items-center;

    .title-img {
      width: 12rem;
      height: auto;
    }
  }

  .withdraw-body {
    color: $text-light-color;
    max-width: 62.5rem;
    margin-top: 1.5625rem;
    overflow: hidden;

    @include iphone-width {
      padding: 0;
    }

    .profile-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 30px;
      border: 2px solid $border-pale-gray-color;
      border-radius: 14px;

      @include iphone-width {
        margin-top: 0;
        padding: 0;
        background: $background-midnight-gray-color;
      }

      .form-content {
        width: 100%;

        @include iphone-width {
          width: 100%;
          margin: 1rem auto;
          padding: 1rem 1.5rem;
          background: $background-eclipse-gray-color;
          border-radius: 0.5rem;
        }

        .form-item {
          .form-title {
            @apply p-0 my-4;
            font-family: OpenSans;
            font-size: 1.2rem;
            font-weight: 590;
            color: $primary-color;
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
              margin-right: 0.5rem;
              padding: 0.2rem;
              border: 1px solid $border-cyan-blue-color;

              @include pad-width {
                height: 4rem;
                max-width: fit-content;
              }

              @include iphone-width {
                width: 100%;
                height: auto;
              }

              &.active {
                background: linear-gradient(
                  to bottom,
                  $background-cyan-blue-light-color 0%,
                  $background-muted-blue-color 33%,
                  $background-muted-blue-dark-color 100%
                );
                color: $text-light-color;
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
              background: $background-light-color;
              border: 1px solid rgba($border-light-color, 0.5);
              border-radius: 0.2rem;
              color: $text-dark-color;

              i {
                margin: 0 5px;
                color: $text-danger-tertiary-color;
                font-size: 1.2rem;
                cursor: pointer;
              }
            }
          }

          .btn-content {
            @apply gap-3;
            @include setFlex(flex-start);
            flex-wrap: wrap;

            ::v-deep(.q-btn) {
              font-family: OpenSans;
              text-transform: none;
              display: flex;
              align-items: center;
              border: 2px solid $border-pale-gray-color !important;
              border-radius: 10px;
              padding: 0px 15px;
              position: relative;
              width: 150px;
              height: 60px;
              font-size: 1rem;
              background: $background-light-color !important;
              color: $text-charcoal-gray-color !important;
              overflow: hidden;

              &.active {
                border: 2px solid $primary-color !important;
                color: $primary-color !important;

                .triangle {
                  display: block;
                }
              }
            }
          }
        }

        .action-btns {
          .submit-btn {
            font-family: Arial;
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
    display: flex;
    margin: 1rem;
    align-content: center;
    flex-direction: column;
    font-size: 0.8rem;
  }

  :deep(.q-field__native) {
    font-family: Helvetica !important;
    border-radius: 0;
    border-bottom: 2px solid $border-pale-gray-color;
  }
}

.withdrawal-kyc-container {
  @apply flex items-center mt-2 p-[.5rem] rounded-[.25rem] max-w-[28.75rem];
  background: #d3e4ff;
  color: $text-dark-color;

  .withdrawal-kyc-img {
    @apply w-4 h-4 mr-2 flex-shrink-0;
  }
}

.input-control {
  :deep(.q-field__native) {
    height: calc(100% - 2px);
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
      -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      box-shadow: 0 0 0px 1000px transparent inset !important;
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

<style lang="sass">
.withdrawal-dialog-okbet
  .q-dialog__inner > div
    overflow: hidden !important
</style>
