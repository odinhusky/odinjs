<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="min-w-[600px]">
      <q-card-section>
        <div class="text-xl font-semibold">
          JACKPOT
          {{ t("jackpotManagement.master_switch") }}
        </div>
      </q-card-section>

      <q-card-section class="pt-0">
        <q-form @submit="onSubmit" class="space-y-4">
          <div v-for="item in switchItems" :key="item.key" class="flex items-center justify-between">
            <div class="flex-1 pr-4">
              <div class="text-base font-medium">{{ t(item.titleKey) }}</div>
              <div class="text-sm text-gray-600">{{ t(item.descKey) }}</div>
            </div>
            <div class="flex-shrink-0">
              <q-toggle v-model="formData[item.key]" color="green" />
            </div>
          </div>

          <q-card-actions align="right">
            <q-btn :label="t('btn.cancel')" @click="onDialogCancel" />
            <q-btn color="primary" :label="t('btn.confirm')" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar"
  import { reactive } from "vue"
  import { useI18n } from "vue-i18n"

  const { t } = useI18n()

  const props = defineProps<{
    data: {
      master: boolean
      payout: boolean
    }
  }>()

  defineEmits([...useDialogPluginComponent.emits])

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  const switchItems = [
    {
      key: "master" as const,
      titleKey: "jackpotManagement.master_switch",
      descKey: "jackpotManagement.master_switch_desc"
    },
    {
      key: "payout" as const,
      titleKey: "jackpotManagement.payout_switch",
      descKey: "jackpotManagement.payout_switch_desc"
    }
  ]

  const formData = reactive<{
    master: boolean
    payout: boolean
  }>({
    ...props.data
  })

  const onSubmit = () => {
    onDialogOK(formData)
  }
</script>
