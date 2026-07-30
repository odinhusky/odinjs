<script setup lang="ts">
import SharedClaimGiftFloatingEntry from "@shared-src/lib/components/claimGift/ClaimGiftFloatingEntry.vue"
import { claimGiftMockAdapter } from "../../composables/useClaimGift/mockData"
import { FLOATING_GIFT_STORAGE_KEY } from "../../composables/useClaimGift"
</script>

<template>
  <SharedClaimGiftFloatingEntry
    :storage-key="FLOATING_GIFT_STORAGE_KEY"
    entry-image-src="/images/claim-gift/floating-gift.png"
    :mock-adapter="claimGiftMockAdapter"
  />
</template>
