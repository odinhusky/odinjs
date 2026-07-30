<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="min-w-[600px]">
      <q-card-section>
        <div class="text-xl font-semibold">
          {{ mode === "add" ? t("btn.add") : t("btn.edit") }}
        </div>
      </q-card-section>

      <q-card-section class="pt-0">
        <q-form @submit="onSubmit" class="space-y-4">
          <JackpotFormItem v-if="mode === 'edit'" label="ID">
            <q-input v-model="formData.id" readonly disable outlined dense hide-bottom-space />
          </JackpotFormItem>

          <JackpotFormItem :label="t('common.currency')">
            <q-input
              v-if="mode === 'edit'"
              v-model="formData.currency"
              readonly
              disable
              outlined
              dense
              hide-bottom-space
              :rules="[rules.required('common.currency')]"
            />
            <q-select
              v-else
              v-model="formData.currency"
              :options="currencyOptions"
              outlined
              dense
              hide-bottom-space
              :rules="[rules.required('common.currency')]"
            />
          </JackpotFormItem>

          <JackpotFormItem :label="t('jackpotManagement.contribution_rate')">
            <q-input
              v-model.number="formData.contribution_rate"
              type="number"
              outlined
              dense
              hide-bottom-space
              :rules="[rules.required('jackpotManagement.contribution_rate'), rules.gt(0)]"
            />
          </JackpotFormItem>

          <JackpotFormItem :label="t('jackpotManagement.payout_threshold')">
            <q-input
              v-model.number="formData.payout_threshold"
              type="number"
              outlined
              dense
              hide-bottom-space
              :rules="[rules.required('jackpotManagement.payout_threshold'), rules.gte(0)]"
            />
          </JackpotFormItem>

          <JackpotFormItem :label="t('table_header.status')">
            <q-toggle
              v-model="formData.is_enabled"
              :label="formData.is_enabled ? t('common.enable') : t('common.disable')"
              color="green"
              :disable="mode === 'add'"
            />
          </JackpotFormItem>

          <JackpotFormItem :label="t('dialog.remark')">
            <q-input v-model="formData.remark" type="textarea" outlined dense rows="3" />
          </JackpotFormItem>

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
  import JackpotFormItem from "./JackpotFormItem.vue"
  import { useValidationRules } from "@/composables/useValidationRules"

  const { t } = useI18n()
  const rules = useValidationRules()

  const props = defineProps<{
    mode: "add" | "edit"
    currencyOptions?: string[]
    data: {
      id?: string
      currency: string
      contribution_rate: number
      payout_threshold: number
      is_enabled: boolean
      remark: string
    }
  }>()

  defineEmits([...useDialogPluginComponent.emits])

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

  const formData = reactive({
    ...props.data
  })

  const onSubmit = () => {
    onDialogOK(formData)
  }
</script>
