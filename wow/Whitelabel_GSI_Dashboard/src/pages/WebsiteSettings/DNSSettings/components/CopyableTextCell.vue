<template>
  <div class="flex items-center justify-center gap-2 h-full">
    <div
      :class="width ? 'text-center flex items-center shrink min-w-0' : ''"
      :style="width ? { maxWidth: `${width}px` } : {}"
    >
      <q-tooltip v-if="showTooltip">
        {{ value }}
      </q-tooltip>
      <span class="truncate">{{ value }}</span>
    </div>
    <q-btn
      v-if="showCopy"
      flat
      dense
      icon="content_copy"
      size="sm"
      color="primary"
      class="shrink-0 self-center"
      @click="handleCopy(value)"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"

  withDefaults(
    defineProps<{
      width?: number
      showTooltip?: boolean
      showCopy?: boolean
      value?: string
    }>(),
    {
      showTooltip: false,
      showCopy: false,
      value: ""
    }
  )

  const { t } = useI18n()
  const $q = useQuasar()

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      $q.notify({
        type: "positive",
        message: t("dns_settings.copied"),
        position: "top",
        timeout: 1000
      })
    } catch (error) {
      console.error("Copy error:", error)
      $q.notify({
        type: "negative",
        message: t("dns_settings.copy_failed"),
        position: "top",
        timeout: 2000
      })
    }
  }
</script>
