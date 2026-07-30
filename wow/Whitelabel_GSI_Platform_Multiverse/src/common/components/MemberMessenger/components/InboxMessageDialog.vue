<template>
  <q-dialog ref="dialogRef" class="member-messenger-dialog" @hide="onDialogHide">
    <q-card class="inbox-message-dialog-card flex w-[92vw] max-w-[640px] flex-col overflow-hidden rounded-2xl">
      <q-card-section class="flex min-h-16 shrink-0 items-center justify-between !py-4">
        <div class="inbox-message-dialog-title min-w-0 flex-1 pr-2 text-2xl font-bold">
          {{ dialogTitle }}
        </div>
        <q-btn icon="close" flat round dense class="h-5 w-5 shrink-0" @click="onDialogCancel" />
      </q-card-section>

      <q-separator class="shrink-0" />

      <div class="h-80 shrink-0 overflow-y-auto md:h-[28rem]">
        <q-card-section v-if="isPending" class="flex justify-center py-12">
          <q-spinner color="primary" size="40px" />
        </q-card-section>

        <q-card-section v-else-if="detail" class="space-y-2.5">
          <div class="inbox-message-dialog-time text-xs font-normal">
            {{ formatDateTime(detail.published_at) }}
          </div>
          <div class="inbox-message-dialog-content whitespace-pre-wrap text-sm font-normal leading-6">{{ detail.content }}</div>

          <div v-if="resolvedImages.length > 0" class="grid grid-cols-1 gap-2">
            <q-img
              v-for="img in resolvedImages"
              :key="img"
              :src="img"
              fit="contain"
              class="inbox-message-dialog-image rounded-lg border"
            />
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar"
import { useBank } from "src/common/composables/useBank"
import { useDynamicImage } from "src/common/composables/useDynamicImage"
import { mapInboxDetailToView, useInboxMessage } from "src/common/composables/useMemberMessenger"
import { useRfc3339 } from "src/common/composables/useRfc3339"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { computed, onMounted, toRef, watch } from "vue"
import { useI18n } from "vue-i18n"

const props = defineProps<{
  messageId: number
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
const { buildImageUrl } = useDynamicImage()
const { formatDateTime } = useRfc3339()
const { locale, t } = useI18n()
const { availCurrencyList, currencyIdMap, formatterCurrency, getAvailCurrencyList } = useBank()
const { userWalletList, getWalletLabel } = useUserInfo()

const { data, isPending, isError } = useInboxMessage(toRef(props, "messageId"))

const detail = computed(() => {
  if (!data.value) return undefined

  const templateParams = { ...data.value.template_params }
  const currencyId = templateParams.currency_id
  const wallet = userWalletList.value.find((item) => item.currency_id === Number(currencyId))
  const currencyCode = wallet ? getWalletLabel(wallet) : currencyIdMap.value?.[Number(currencyId)]?.code

  if (currencyCode) {
    templateParams.currency_id = wallet ? currencyCode : formatterCurrency(currencyCode) || currencyCode
  }

  return mapInboxDetailToView(
    {
      ...data.value,
      template_params: templateParams,
    },
    locale.value,
    t
  )
})

onMounted(async () => {
  if (!availCurrencyList.value.length) {
    await getAvailCurrencyList()
  }
})

const dialogTitle = computed(() => {
  const subject = detail.value?.subject?.trim()
  if (subject) return subject
  return ""
})

watch(isError, (failed) => {
  if (failed) onDialogCancel()
})

const resolvedImages = computed(() => {
  const images = detail.value?.images
  if (!images?.length) return []
  return images.map((path) => buildImageUrl(path ?? "")).filter(Boolean)
})
</script>
