<template>
  <DepositQRCode v-if="shouldRender" class="shared-fallback" />
</template>

<script setup lang="ts">
import DepositQRCode from "src/common/components/Deposit/QRCode.vue"
import { DEPOSIT_REDIRECT_TYPE } from "src/common/utils/constants"
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const queryType = computed(() => {
  const raw = route.query.type
  const value = Array.isArray(raw) ? raw[0] : raw
  const parsed = parseInt(String(value ?? ""), 10)
  return Number.isNaN(parsed) ? null : parsed
})

const queryContent = computed(() => {
  const raw = route.query.content
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === "string" ? value : ""
})

const shouldRender = computed(
  () => queryType.value === DEPOSIT_REDIRECT_TYPE.Enums.OpenQRCode && queryContent.value.length > 0
)
</script>

<style scoped lang="scss">
.shared-fallback {
  &.deposit-qr-code-wrapper {
    @apply bg-[#f5f5f5];

    :deep(.deposit-qr-code-card) {
      @apply bg-white;

      .deposit-qr-code-card-header {
        color: #848484;
      }

      .deposit-qr-code-card-body {
        @apply bg-[#f0f0f0];

        .deposit-qr-code-card-body-amount {
          color: #000000cc;
        }

        .deposit-qr-code-card-body-currency {
          color: #848484;
        }
      }

      .deposit-qr-code-card-footer {
        border-color: #d3d3d3;
      }
    }
  }
}
</style>
