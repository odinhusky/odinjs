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
@import "app/template/set_r022/assets/css/_variable.scss";

.amount-dialog {
  width: min(27rem, calc(100vw - 2rem)) !important;
  min-width: 0 !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  background: var(--dialog-bg) !important;
  color: var(--dialog-text-01) !important;
  box-shadow: none !important;
}

.amount-dialog-header {
  display: grid;
  grid-template-columns: 2rem 1fr 2rem;
  align-items: center;
  padding: 0 0 1rem !important;
  color: var(--dialog-text-01) !important;

  .amount-dialog-title {
    text-align: center;
    font-size: 1rem;
    font-weight: 700;
  }

  .amount-dialog-close {
    color: var(--dialog-text-01) !important;
  }
}

.amount-dialog-content {
  padding: 0 !important;
  color: var(--dialog-text-01) !important;
  font-size: 0.875rem;

  .account {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .account-value,
  .quota-value {
    color: var(--primary-01);
    font-weight: 700;
  }

  .amount {
    width: 100%;
    margin-bottom: 0.75rem !important;

    :deep(.q-field__control) {
      min-height: 2.5rem !important;
      height: 2.5rem !important;
      border: 1px solid var(--neutral-03) !important;
      border-radius: 0.375rem !important;
      background: var(--bg-side) !important;

      &::before,
      &::after {
        border: 0 !important;
      }
    }

    :deep(.q-field__native),
    :deep(.q-field__input),
    :deep(.q-field__append),
    :deep(.q-select__dropdown-icon) {
      color: var(--secondary-01) !important;
    }
  }
}

.amount-dialog-actions {
  padding: 0 !important;

  .confirm-btn {
    width: 100% !important;
    min-height: 2.5rem !important;
    border-radius: 0.375rem !important;
    background: var(--primary-01) !important;
    color: var(--white-01) !important;
    font-weight: 700 !important;
    box-shadow: none !important;
  }
}
</style>