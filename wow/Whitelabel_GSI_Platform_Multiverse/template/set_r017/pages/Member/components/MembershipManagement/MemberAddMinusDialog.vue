<template>
  <q-dialog :model-value="showDialog">
    <q-card class="amount-dialog">
      <q-card-section class="amount-dialog-header">
        <div class="amount-dialog-header-spacer" />
        <div class="amount-dialog-title">
          {{
            memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
              ? $t("member.membershipManagement.agentAddition")
              : $t("member.membershipManagement.agentDeduction")
          }}
        </div>
        <q-btn icon="close" flat round dense class="amount-dialog-close" @click="updateShowDialog(false)" size="md" />
      </q-card-section>

      <q-card-section class="amount-dialog-content">
        <div class="account">
          <span class="mr-2.5">{{ $t("menu.userAccount") }}</span>
          <span class="account-value">
            {{ memberManagementStore.targetAccount }}
          </span>
        </div>

        <div class="mb-1">
          {{
            memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
              ? $t("member.membershipManagement.addAmount")
              : $t("member.membershipManagement.minusAmount")
          }}
        </div>
        <q-select
          v-model="memberManagementStore.dialogIncreaseItem"
          class="amount increase-item mb-5"
          outlined
          dense
          emit-value
          map-options
          no-error-icon
          hide-bottom-space
          popup-content-class="agent-center-select-menu"
          :options="memberManagementStore.dialogIncreaseItemOptions"
        />

        <div class="mb-1">
          {{
            memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
              ? $t("member.membershipManagement.addAmount")
              : $t("member.membershipManagement.minusAmount")
          }}
        </div>
        <q-input
          :model-value="memberManagementStore.dialogAmount"
          @update:model-value="memberManagementStore.onInputChange($event)"
          :placeholder="$t('ai.enter_amount')"
          outlined
          dense
          no-error-icon
          hide-bottom-space
          class="amount"
        />

        <div class="flex items-center justify-start my-[0.90625rem]">
          <div class="mr-2.5">
            {{
              memberManagementStore.dialogType === MEMBER_AGENT_QUOTA_BALANCE_TYPE.Enums.Add
                ? $t("member.membershipManagement.agentAddRemainingAmount")
                : $t("member.membershipManagement.agentMinusRemainingAmount")
            }}
          </div>

          <span class="quota-value">{{ moneyFormat(memberManagementStore.remainQuotaAmount) }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="amount-dialog-actions">
        <q-btn
          :label="$t('common.btn.submit')"
          class="confirm-btn"
          @click="memberManagementStore.handlerClickSubmit()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { useCommon } from "src/common/hooks/useCommon"
import { MEMBER_AGENT_QUOTA_BALANCE_TYPE } from "src/common/utils/constants"
import { useMemberManagement } from "src/stores/useMemberManagement"

const emit = defineEmits(["update:modelValue"])
const props = defineProps({
  modelValue: Boolean,
})

const { moneyFormat } = useCommon()
const memberManagementStore = useMemberManagement()

const showDialog = ref(props.modelValue)

// 更新對話框顯示狀態
const updateShowDialog = (value: boolean) => {
  memberManagementStore.showDialog = value
}

watch(
  () => props.modelValue,
  (val) => {
    memberManagementStore.showDialog = val
  }
)
watch(showDialog, (val) => {
  emit("update:modelValue", val)
})
</script>
<style lang="scss" scoped>
@import "src/common/css/_variable.sass";

.amount-dialog {
  width: min(37.5rem, calc(100vw - 2rem)) !important;
  min-width: 0 !important;
  max-width: none !important;
  padding: 0 !important;
  overflow: hidden !important;
  background: #1d125d !important;
  color: #fff !important;
  border-radius: 0.75rem !important;
  box-shadow: none !important;

  @include phone-width {
    width: calc(100vw - 2rem) !important;
  }

  .amount-dialog-header {
    width: 100%;
    min-height: 4rem;
    padding: 1rem 1.25rem !important;
    display: grid;
    grid-template-columns: 2.5rem 1fr 2.5rem;
    align-items: center;
    margin-bottom: 0 !important;
    background: #1d125d !important;
    color: #fff !important;

    .amount-dialog-title {
      text-align: center;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1;
    }

    .amount-dialog-close {
      justify-self: end;
      color: #fff !important;
    }

    :deep(.q-btn) {
      width: 1.5rem !important;
      min-width: 1.5rem !important;
      height: 1.5rem !important;
      min-height: 1.5rem !important;
      padding: 0 !important;

      .q-btn__content {
        height: 1.5rem !important;
      }

      .q-icon {
        font-size: 1.75rem !important;
      }
    }
  }

  .amount-dialog-content {
    padding: 1rem 1.25rem 0 !important;
    background: #1d125d !important;
    color: rgba(255, 255, 255, 0.77) !important;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1;

    .account {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      margin-bottom: 1rem;
      color: rgba(255, 255, 255, 0.77);
    }

    .account-value {
      color: #f26319 !important;
      font-size: 0.875rem !important;
      font-weight: 700 !important;
    }

    .amount {
      width: 100%;
      margin-bottom: 1rem !important;
      color: #fff !important;
      border-radius: 0.25rem !important;
      background: transparent !important;

      :deep(.q-field__control) {
        min-height: 2.25rem !important;
        height: 2.25rem !important;
        padding: 0 0.625rem !important;
        border: 1px solid #4a4a4a !important;
        border-radius: 0.25rem !important;
        background: #050505 !important;
        box-shadow: 0 2px 4px 0 #00000080 !important;

        &::before {
          border: 0 !important;
        }

        &::after {
          border: 0 !important;
        }
      }

      :deep(.q-field__control-container) {
        padding-top: 0 !important;
      }

      :deep(.q-field__native),
      :deep(.q-field__input),
      :deep(.q-field__append),
      :deep(.q-select__dropdown-icon) {
        color: #fff !important;
        font-size: 0.875rem !important;
        font-weight: 700 !important;
        line-height: 1 !important;

        &::placeholder {
          color: rgba(255, 255, 255, 0.77) !important;
        }
      }
    }

    .quota-value {
      color: #f26319 !important;
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      line-height: 1 !important;
    }
  }

  .amount-dialog-actions {
    padding: 1rem 1.25rem 1.25rem !important;
    background: #1d125d !important;

    .confirm-btn {
      width: 100% !important;
      min-height: 2.25rem !important;
      padding: 0.625rem !important;
      border-radius: 0.25rem !important;
      background: linear-gradient(180deg, #f26319 0%, #d12d00 100%) !important;
      color: #fff !important;
      font-size: 0.75rem !important;
      font-weight: 700 !important;
      box-shadow: none !important;

      :deep(.q-btn__content) {
        line-height: 1 !important;
      }
    }
  }
}

:global(.agent-center-select-menu) {
  background: #050505 !important;
  color: #fff !important;
}

:global(.agent-center-select-menu .q-item) {
  min-height: 2rem !important;
  color: #fff !important;
}

:global(.agent-center-select-menu .q-item.q-item--active),
:global(.agent-center-select-menu .q-item.q-manual-focusable--focused) {
  background: linear-gradient(180deg, #f26319 0%, #d12d00 100%) !important;
  color: #fff !important;
}
</style>
