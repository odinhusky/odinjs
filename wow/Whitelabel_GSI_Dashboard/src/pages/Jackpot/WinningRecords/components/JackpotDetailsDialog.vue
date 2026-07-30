<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="min-w-[550px] rounded-lg shadow-xl text-grey-10">
      <q-card-section class="row items-center q-px-lg q-py-md bg-white border-b">
        <div class="text-h6 text-grey-9">
          {{ t("jackpotWinningRecords.view_details") }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="q-mb-lg q-pa-sm rounded bg-blue-1 border border-blue-2 text-blue-9">
          <div class="text-subtitle2 text-weight-bold">
            {{ t("jackpotWinningRecords.claim_transaction_code") }}: {{ record.claim_transaction_code }}
          </div>
        </div>

        <div class="q-gutter-y-md">
          <!-- 基本資料區 -->
          <q-expansion-item
            expand-separator
            :label="t('menu.basicInformation')"
            default-opened
            header-class="text-weight-bold bg-grey-2 text-grey-10 compact-header"
            dense
            class="border rounded overflow-hidden"
          >
            <q-card flat class="text-grey-10">
              <q-card-section class="q-py-xs q-px-lg">
                <div class="column">
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.player_account") }}</div>
                    <div class="col-8">{{ record.member_account }}</div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("common.currency") }}</div>
                    <div class="col-8">{{ record.currency }}</div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.winning_amount") }}</div>
                    <div class="col-8">
                      {{ moneyFormat(record.winning_amount, 4) }}
                    </div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.winning_time") }}</div>
                    <div class="col-8">
                      {{ genTimeFormat(parseInt(record.created_at), "yyyy-MM-dd HH:mm:ss") }}
                    </div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.claim_status") }}</div>
                    <div class="col-8" :class="getClaimStatusColor(record.claim_status)">
                      {{ getClaimStatusLabel(record.claim_status) }}
                    </div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.audit_status") }}</div>
                    <div class="col-8" :class="getAuditStatusColor(record.status)">
                      {{ getAuditStatusLabel(record.status) }}
                    </div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.source_wager_code") }}</div>
                    <div class="col-8">{{ record.trigger_wager_code }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <!-- Jackpot池狀態紀錄 -->
          <q-expansion-item
            expand-separator
            :label="t('jackpotWinningRecords.jackpot_poot_status_record')"
            header-class="text-weight-bold bg-grey-2 text-grey-10 compact-header"
            dense
            class="border rounded overflow-hidden"
          >
            <q-card flat class="text-grey-10">
              <q-card-section class="q-py-xs q-px-lg">
                <div class="column">
                  <div class="row items-center compact-row">
                    <div class="col-4">{{ t("jackpotManagement.contribution_rate") }}</div>
                    <div class="col-8">{{ record.currency_contribution_rate }}%</div>
                  </div>
                  <div class="row items-center compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.pool_amount_at_time") }}</div>
                    <div class="col-8">
                      {{ moneyFormat(record.current_pool_amount || 0, 4) }}
                    </div>
                  </div>
                  <div class="row items-center compact-row">
                    <div class="col-4">{{ t("jackpotManagement.payout_threshold") }}</div>
                    <div class="col-8">
                      {{ moneyFormat(record.currency_payout_threshold, 4) }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <!-- 發獎處理狀態 -->
          <q-expansion-item
            expand-separator
            :label="t('jackpotWinningRecords.payout_processing_record')"
            header-class="text-weight-bold bg-grey-2 text-grey-10 compact-header"
            dense
            class="border rounded overflow-hidden"
          >
            <q-card flat class="text-grey-10">
              <q-card-section class="q-py-xs q-px-lg">
                <div class="column">
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.is_triggered") }}</div>
                    <div class="col-8">
                      {{ record.claim_transaction_code ? t("first_deposit_type.yes") : t("first_deposit_type.no") }}
                    </div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.claimed_at") }}</div>
                    <div class="col-8">
                      {{
                        record.claimed_at && record.claimed_at !== "0"
                          ? genTimeFormat(parseInt(record.claimed_at), "yyyy-MM-dd HH:mm:ss")
                          : "-"
                      }}
                    </div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.api_call_status") }}</div>
                    <div class="col-8">-</div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.payout_error_message") }}</div>
                    <div class="col-8 text-negative">-</div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotWinningRecords.retry_count") }}</div>
                    <div class="col-8">{{ record.claim_retry_count }}</div>
                  </div>
                  <div class="row compact-row">
                    <div class="col-4">{{ t("jackpotManagement.last_updated_time") }}</div>
                    <div class="col-8">
                      {{ genTimeFormat(parseInt(record.updated_at), "yyyy-MM-dd HH:mm:ss") }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-lg q-py-md border-t">
        <q-btn color="primary" :label="t('common.close')" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useCommon } from "@/hook/useCommon"
  import {
    JackpotAuditStatus,
    JackpotClaimStatus,
    claimStatusOptions,
    auditStatusOptions,
    type JackpotWinningRecord
  } from "../useJackpotWinningRecords"

  const props = defineProps<{
    record: JackpotWinningRecord & { current_pool_amount?: number }
  }>()

  defineEmits([...useDialogPluginComponent.emits])

  const { t } = useI18n()
  const { moneyFormat, genTimeFormat } = useCommon()
  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

  const getClaimStatusLabel = (status: number) => {
    const option = claimStatusOptions.find((opt) => opt.value === status)
    return option ? t(option.label) : "Unknown"
  }

  const getClaimStatusColor = (status: number) => {
    const colors: Record<number, string> = {
      [JackpotClaimStatus.Pending]: "text-orange",
      [JackpotClaimStatus.Claimed]: "text-green",
      [JackpotClaimStatus.Failed]: "text-red"
    }
    return colors[status] || "text-grey"
  }

  const getAuditStatusLabel = (status: number) => {
    const option = auditStatusOptions.find((opt) => opt.value === status)
    return option ? t(option.label) : "Unknown"
  }

  const getAuditStatusColor = (status: number) => {
    const colors: Record<number, string> = {
      [JackpotAuditStatus.Pending]: "text-orange",
      [JackpotAuditStatus.Approved]: "text-green",
      [JackpotAuditStatus.Rejected]: "text-red"
    }
    return colors[status] || "text-grey"
  }
</script>

<style scoped>
  .border {
    border: 1px solid #eef2f6;
  }
  .compact-row {
    min-height: unset !important;
    height: 22px;
    line-height: 1;
    display: flex;
    align-items: center;
    margin: 0 !important;
    padding: 0 !important;
  }
  .compact-header {
    min-height: 32px !important;
    padding: 4px 16px !important;
  }
</style>
