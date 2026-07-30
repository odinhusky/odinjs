<template>
  <section class="betby-wrapper">
    <BetByArea :betslip-z-index="betbyBetslipZIndex" :on-login="betbyOnLogin" :hide-betslip="betbyHideBetslip" />
  </section>
</template>

<script setup lang="ts">
import BetByArea from "src/common/components/BetByArea/Index.vue"
import { useAgentCode } from "src/common/hooks/useAgentCode"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { injectStrict } from "src/common/utils/injectTyped"
import { useGlobalStore } from "src/stores/globalStore"
import { EventBusKey } from "src/symbols"
import { computed } from "vue"

const { isBCYM } = useAgentCode()
const { isMobile } = useMediaQuery()
const globalStore = useGlobalStore()
const eventbus = injectStrict(EventBusKey)

// 僅 BCY1 H5 套用 GSI-257 特規；desktop 與其他站點維持 shared defaults
const isBcymH5 = computed(() => isBCYM.value && isMobile.value)
// H5 sidebar 開啟時 isAsideShow === false（全域命名與畫面語意相反）
const sidebarOpen = computed(() => isMobile.value && !globalStore.globalState.isAsideShow)

const betbyBetslipZIndex = computed(() => (isBcymH5.value ? 100 : undefined))
const betbyHideBetslip = computed(() => (isBcymH5.value ? sidebarOpen.value : undefined))
const betbyOnLogin = computed(() => (isBcymH5.value ? () => eventbus.emit("openLogin", true) : undefined))
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r031/assets/css/_variable.scss";

.betby-wrapper {
  @apply flex flex-col mx-auto w-full h-full;

  :deep(.q-btn) {
    @apply my-4 rounded-[.5rem] text-base w-[10rem] h-[3.125rem] text-center;
    @apply flex items-center justify-center;

    :deep(.q-btn__content) {
      @apply flex items-center justify-center;
    }
  }

  :deep(.betby-area) {
  }
}
</style>
