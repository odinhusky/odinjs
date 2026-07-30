<template>
  <DepositQRCode v-if="isCommonTemplate" class="set_334" />
</template>

<script setup lang="ts">
import DepositQRCode from "src/common/components/Deposit/QRCode.vue"
import { DEPOSIT_REDIRECT_TYPE } from "src/common/utils/constants"
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

function firstQueryString(raw: unknown): string {
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === "string" ? value : ""
}

const queryType = computed(() => {
  const parsed = parseInt(firstQueryString(route.query.type), 10)
  return Number.isNaN(parsed) ? null : parsed
})
const queryContent = computed(() => firstQueryString(route.query.content))

const isCommonTemplate = computed(
  () => queryType.value === DEPOSIT_REDIRECT_TYPE.Enums.OpenQRCode && queryContent.value.length > 0
)
</script>

<style scoped lang="scss">
.set_334 {
  &.deposit-qr-code-wrapper {
    @apply bg-[#f3f8f4];

    :deep(.deposit-qr-code-card) {
      @apply bg-white;

      .deposit-qr-code-card-header {
        color: #848484;
      }

      .deposit-qr-code-card-body {
        @apply bg-[#e7f8e9];

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
