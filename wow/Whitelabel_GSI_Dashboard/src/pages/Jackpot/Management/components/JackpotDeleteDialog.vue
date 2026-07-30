<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="min-w-[400px] q-pa-sm">
      <q-card-section>
        <div class="text-h6">{{ t("common.delete") }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-mb-md text-body1">
          {{ t("jackpotManagement.delete_confirm_message") }}
        </div>

        <div class="bg-grey-2 p-4 rounded text-sm space-y-2">
          <div class="flex justify-between">
            <span class="text-grey-7">ID</span>
            <span class="font-medium">{{ data.id }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-grey-7">{{ t("common.currency") }}</span>
            <span class="font-medium">{{ data.currency }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-grey-7">{{ t("jackpotManagement.contribution_rate") }}</span>
            <span class="font-medium">{{ data.contribution_rate.toFixed(2) }}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-grey-7">{{ t("jackpotManagement.payout_threshold") }}</span>
            <span class="font-medium">{{ moneyFormat(data.payout_threshold) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-grey-7">{{ t("jackpotManagement.current_accumulated_amount") }}</span>
            <span class="font-medium">{{ moneyFormat(data.current_amount || 0) }}</span>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn :label="t('btn.cancel')" @click="onDialogCancel" />
        <q-btn :label="t('common.delete')" color="negative" @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar"
  import { useI18n } from "vue-i18n"
  import { useCommon } from "@/hook/useCommon"
  import type { JackpotPool } from "../useJackpot"

  const props = defineProps<{
    data: JackpotPool
  }>()

  defineEmits([...useDialogPluginComponent.emits])

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
  const { t } = useI18n()
  const { moneyFormat } = useCommon()
</script>

<style scoped></style>
