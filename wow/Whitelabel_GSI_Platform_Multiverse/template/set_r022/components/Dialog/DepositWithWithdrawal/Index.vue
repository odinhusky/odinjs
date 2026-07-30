<template>
  <ModalBase
    :model-value="show"
    :templateType="'primary'"
    use-title
    :title="t('common.btn.wallet')"
    max-width="50rem"
    modal-class="primary-modal"
    @update:model-value="onDialogUpdate"
  >
    <div v-if="showWithdrawWarning && dialogType === 'withdrawal'" class="withdrawal-kyc-container">
      <q-img :src="withdrawalKycImg" alt="withdrawal-kyc" class="withdrawal-kyc-img" contain />
      <div class="withdrawal-kyc-text">{{ $t("common.validate.withdrawalKyc") }}</div>
    </div>

    <div class="deposit-withdrawal-wrapper">
      <div v-if="!isLargeTablet" class="tab-wrapper">
        <div class="tab-area">
          <div class="tab-item" :class="{ active: dialogType === 'deposit' }" @click="changeDialogType('deposit')">
            <img
              :src="
                resultImages(
                  `member/deposit${dialogType === 'deposit' ? '-select' : ''}${$q.dark.isActive ? '-dark' : ''}.png`
                )
              "
              class="mr-1 w-5 h-5"
            />
            {{ t("menu.deposit") }}
          </div>
          <div
            class="tab-item"
            :class="{ active: dialogType === 'withdrawal' }"
            @click="changeDialogType('withdrawal')"
          >
            <img
              :src="
                resultImages(
                  `member/withdraw${dialogType === 'withdrawal' ? '-select' : ''}${$q.dark.isActive ? '-dark' : ''}.png`
                )
              "
              class="mr-1 w-5 h-5"
            />
            {{ t("menu.withdrawal") }}
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <DepositForm v-if="dialogType === 'deposit'" :type="dialogType">
          <template v-if="isLargeTablet" #tab>
            <div class="tab-wrapper mobile">
              <div class="tab-area">
                <div class="tab-item active" @click="changeDialogType('deposit')">
                  <img
                    :src="resultImages(`member/deposit-select${$q.dark.isActive ? '-dark' : ''}.png`)"
                    class="mr-1 w-5 h-5"
                  />
                  {{ t("menu.deposit") }}
                </div>
                <div class="tab-item" @click="changeDialogType('withdrawal')">
                  <img
                    :src="resultImages(`member/withdraw-select${$q.dark.isActive ? '-dark' : ''}.png`)"
                    class="mr-1 w-5 h-5"
                  />
                  {{ t("menu.withdrawal") }}
                </div>
              </div>
            </div>
          </template>
        </DepositForm>
        <WithdrawalForm v-if="dialogType === 'withdrawal'" :type="dialogType">
          <template v-if="isLargeTablet" #tab>
            <div class="tab-wrapper mobile">
              <div class="tab-area">
                <div class="tab-item" @click="changeDialogType('deposit')">
                  <img
                    :src="resultImages(`member/deposit${$q.dark.isActive ? '-dark' : ''}.png`)"
                    class="mr-1 w-5 h-5"
                  />
                  {{ t("menu.deposit") }}
                </div>
                <div class="tab-item active" @click="changeDialogType('withdrawal')">
                  <img
                    :src="resultImages(`member/withdraw-select${$q.dark.isActive ? '-dark' : ''}.png`)"
                    class="mr-1 w-5 h-5"
                  />
                  {{ t("menu.withdrawal") }}
                </div>
              </div>
            </div>
          </template>
        </WithdrawalForm>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { useSiteImg } from "app/template/set_r022/hooks/useSiteImg"
import { MENU } from "app/template/set_r022/utils/constants"
import { computed, nextTick, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { useEnvInfoStore } from "src/stores/envStore"

import ModalBase from "../ModalBase.vue"
import DepositForm from "./DepositForm.vue"
import WithdrawalForm from "./WithdrawalForm.vue"

const props = defineProps<{
  show: boolean
  mode: "deposit" | "withdrawal"
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { accountInfo } = useUserInfo()
const dialogType = computed(() => props.mode)
const { resultImages, withdrawalKycImg } = useSiteImg()
const { isLargeTablet } = useMediaQuery()
const { envInfo } = useEnvInfoStore()

const showWithdrawWarning = ref(false)
const suppressDialogClose = ref(false)

const changeDialogType = (type: string) => {
  if (!accountInfo.value.approval_status && envInfo.withdraw_kyc_verify === 1 && type === "withdrawal") {
    showWithdrawWarning.value = true
  }

  const targetRouteName = MENU.WalletTypeToRouteName[type]
  if (targetRouteName && route.name !== targetRouteName) {
    void router.replace({ name: targetRouteName, query: route.query })
  }
}

function handleClose() {
  emit("close")
}

function onDialogUpdate(value: boolean) {
  if (!value && !suppressDialogClose.value) {
    handleClose()
  }
}

watch(
  () => props.show,
  (show) => {
    if (show && !accountInfo.value.approval_status && envInfo.withdraw_kyc_verify === 1 && props.mode === "withdrawal") {
      showWithdrawWarning.value = true
    }
  },
  { immediate: true }
)

watch(
  () => route.name,
  (name, oldName) => {
    if (MENU.WalletRouteNames.has(String(oldName)) && MENU.WalletRouteNames.has(String(name))) {
      suppressDialogClose.value = true
      nextTick(() => {
        suppressDialogClose.value = false
      })

      if (
        !accountInfo.value.approval_status &&
        envInfo.withdraw_kyc_verify === 1 &&
        name === "MemberWithdrawal"
      ) {
        showWithdrawWarning.value = true
      }
    }
  }
)
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

.withdrawal-kyc-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: var(--emotional-warning-01);
  color: var(--secondary-04);
  padding: 0.53125rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;

  @include pad-large-width {
    margin: 1rem 1rem 0;
  }

  .withdrawal-kyc-img {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }

  .withdrawal-kyc-text {
    flex: 1;
  }
}

.deposit-withdrawal-wrapper {
  display: flex;
  flex-direction: row;
  @include pad-large-width {
    flex-direction: column;
  }
  .tab-wrapper {
    @include pad-large-width {
      background: var(--neutral-01);
      padding: 0.75rem 0.8125rem;

      &.mobile {
        background: var(--bg-side);
      }
    }

    .tab-area {
      display: flex;
      flex-direction: column;
      width: 170px;
      max-height: fit-content;
      margin-right: 0.75rem;
      padding: 0.75rem 0.8125rem;
      flex-shrink: 0;
      border-radius: 8px;
      background: var(--neutral-01);
      gap: 0.25rem;

      @include pad-large-width {
        flex-direction: row;
        width: 100%;
        border-radius: 2rem;
        justify-content: space-between;
        background: var(--primary-07);
        padding: 0;
        gap: 0;
        margin-right: 0;
      }
    }

    .tab-item {
      @apply flex justify-center items-center text-lg font-bold cursor-pointer rounded-[.625rem];
      width: 100%;
      padding: 0.75rem 1rem;
      background: transparent;
      color: var(--primary-02);
      font-family: "Segoe UI";
      font-size: 1rem;
      font-style: normal;
      font-weight: 600;
      line-height: 25.14px; /* 157.125% */
      border: 1px solid transparent; /* 預留空間 */

      @include pad-large-width {
        width: 50%;
        border-radius: 32px;
        background: var(--primary-07, #0d2533);
        margin: 0 !important;
        line-height: normal;
        height: 2.25rem;
        font-size: 1.25rem;
      }

      &.active {
        color: var(--text-01);
        background: var(--primary-01);
      }

      @include pad-large-width {
        @apply my-0 mx-2;
      }
    }
  }

  .content-wrapper {
    width: calc(100% - 170px);
    height: calc(100vh - 6rem);
    overflow-y: auto;
    // no scroll bar
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include pad-large-width {
      width: 100%;
      height: calc(100vh - 3.3rem);
    }
  }
}
</style>
