<template>
  <div
    v-if="memberNavStore.navs.length"
    id="member-nav"
    class="bg-[var(--bg-08)] w-[11.375rem] rounded-lg"
    :class="isCustomHeader ? 'py-[6px]' : 'py-6'"
    :style="mergedStyle"
  >
    <slot name="header">
      <div v-if="headerConfig" class="member-nav-header" :class="{ 'member-nav-header-r027': isCustomHeader }">
        <template v-if="isCustomHeader">
          <div class="member-nav-header-top">
            <component :is="headerConfig.avatar" />
            <div class="member-nav-header-copy">
              <p class="member-nav-greeting">{{ headerConfig.greetingLabel || "Hi" }}</p>
              <p class="member-nav-account">{{ richHeaderAccountName }}</p>
            </div>
          </div>
          <div class="member-nav-wallet-row">
            <div class="member-nav-wallet-labels">
              <p v-if="headerConfig.walletTitle" class="member-nav-wallet-title">{{ headerConfig.walletTitle }}:</p>
            </div>
            <q-select
              v-if="headerConfig.walletOptions?.length"
              :model-value="headerConfig.activeCurrencyId || null"
              :options="headerConfig.walletOptions"
              popup-content-class="r027-dropdown-menu-bg"
              emit-value
              map-options
              borderless
              dense
              dark
              behavior="menu"
              dropdown-icon="keyboard_arrow_down"
              class="member-nav-wallet-select"
              @update:model-value="handleWalletChange"
            >
              <template #selected>
                <div class="member-nav-wallet-value">
                  <span class="member-nav-wallet-balance">{{ headerConfig.balanceAmount }}</span>
                  <span class="member-nav-wallet-currency">{{ headerConfig.activeCurrencyLabel }}</span>
                </div>
              </template>
              <template #option="{ itemProps, opt }">
                <q-item v-bind="itemProps" class="member-nav-wallet-option">
                  <q-item-section>
                    <q-item-label class="member-nav-wallet-option-balance">{{ opt.balance }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="member-nav-wallet-option-currency">{{ opt.currencyLabel }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div v-else class="member-nav-wallet-value">
              <span class="member-nav-wallet-balance">{{ headerConfig.balanceAmount }}</span>
              <span class="member-nav-wallet-currency">{{ headerConfig.activeCurrencyLabel }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <component :is="headerConfig.avatar" />
          <div class="text-[var(--text-01)] font-bold text-center break-all px-2">
            Hi, {{ headerConfig.accountName }}
          </div>
        </template>
      </div>
    </slot>
    <template v-for="(nav, navIndex) in memberNavStore.navs" :key="`member-nav-item-${navIndex}`">
      <div
        v-if="nav.show"
        :id="`member-nav1-item-${navIndex}`"
        class="py-3 px-5 text-[var(--btn-text-01)] text-[.875rem] leading-[1.0625rem] cursor-pointer"
        :class="{
          'member-nav-hover-r027': activeNavClass === 'member-nav-active-r027',
          'bg-gradient-to-r from-[var(--btn-bg-01)] to-[var(--btn-bg-02)]': nav.activeRouteName.includes(route.name as string),
          [activeNavClass]: !!activeNavClass && nav.activeRouteName.includes(route.name as string),
          'flex flex-nowrap items-center gap-[.625rem]': getNavIcon(nav)
        }"
        @click="router.push({ name: nav.routerName })"
      >
        <div v-if="getNavIcon(nav)" class="nav-icon shrink-0">
          <img :src="getNavIcon(nav)" class="w-4 h-4" />
        </div>
        {{ $t(nav.i18nKey) }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type CSSProperties } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMemberNavStore } from "src/stores/memberNavStore"

type MemberNavWalletOption = {
  label: string
  value: number
  balance: string
  currencyLabel: string
}

type MemberNavHeaderConfig = {
  avatar: any
  accountName: string
  greetingLabel?: string
  displayAccountName?: string
  walletTitle?: string
  balanceLabel?: string
  balanceAmount?: string
  activeCurrencyLabel?: string
  activeCurrencyId?: number | null
  walletOptions?: MemberNavWalletOption[]
  onWalletChange?: (value: number | null) => void | Promise<void>
}

const { customStyle } = defineProps<{
  customStyle?: Record<string, string> | string
}>()

const route = useRoute()
const router = useRouter()
const memberNavStore = useMemberNavStore()
type MemberNavItem = (typeof memberNavStore.navs)[number]

// Customize (R017, R027)
// R017 inject 傳入 avatar
// R027 inject 傳入 icon, css 客製化, avatar
const headerConfig = inject<MemberNavHeaderConfig | null>("member-nav-header", null)
const navIconResolver = inject<((nav: MemberNavItem) => string | null) | null>("member-nav-icon-resolver", null)
const rootStyle = inject<CSSProperties | null>("member-nav-root-style", null)
const activeNavClass = inject<string>("member-nav-active-class", "")

const isCustomHeader = computed(() => {
  return !!(headerConfig?.walletTitle || headerConfig?.balanceLabel || headerConfig?.walletOptions?.length)
})
const mergedStyle = computed(() => [rootStyle, customStyle].filter(Boolean))
const richHeaderAccountName = computed(() => headerConfig?.displayAccountName || headerConfig?.accountName || "")
const getNavIcon = (nav: MemberNavItem) => navIconResolver?.(nav) || ""
const handleWalletChange = (value: number | null) => headerConfig?.onWalletChange?.(value)
</script>

<style scoped lang="scss">
.member-nav-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 0 1.25rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--bg-line-01);
}

.member-nav-header-r027 {
  align-items: stretch;
  gap: 1rem;
  padding: 0px 10px;
}

.member-nav-header-top {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.member-nav-header-copy {
  min-width: 0;
  flex: 1;
}

.member-nav-greeting {
  color: var(--text-01);
  font-size: 12px;
  line-height: 1.2;
}

.member-nav-account {
  overflow: hidden;
  margin-top: 0.375rem;
  color: #f2d721;
  font-size: 12px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.member-nav-wallet-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
  margin-bottom: 4px;
}

.member-nav-wallet-labels {
  min-width: 0;
  gap: 4px;
  display: flex;
  flex-direction: column;
}

.member-nav-wallet-title,
.member-nav-wallet-label {
  color: var(--text-01);
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
}

.member-nav-wallet-select {
  min-width: 0;
  margin-left: auto;
}

.member-nav-wallet-value {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
  min-width: 0;
}

.member-nav-wallet-balance {
  color: #f2d721;
  font-size: 12px;
  line-height: 1.2;
}

.member-nav-wallet-currency {
  color: var(--text-01);
  font-size: 12px;
  line-height: 1.2;
}

.member-nav-wallet-option {
  min-width: 9rem;
  color: var(--text-01);
  background: var(--bg-04);
}

.member-nav-wallet-option-balance,
.member-nav-wallet-option-currency {
  color: inherit;
  font-size: 0.75rem;
}

:deep(.member-nav-wallet-select .q-field__inner) {
  min-height: auto;
  padding-right: 0;
}

:deep(.member-nav-wallet-select .q-field__control) {
  min-height: auto;
}

:deep(.member-nav-wallet-select .q-field__native) {
  padding: 0;
}

:deep(.member-nav-wallet-select .q-field__append) {
  padding-left: 0.125rem;
  color: var(--text-01);
}

:deep(.member-nav-wallet-select .q-select__dropdown-icon) {
  font-size: 1rem;
}

.member-nav-hover-r027:hover {
  background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-03) 100%);
}

.member-nav-active-r027 {
  background: linear-gradient(90deg, #523fbe 0%, rgba(100, 32, 188, 0) 100%);
}

.nav-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(90deg, #6420bc 0%, #2e1d64 100%);
  box-shadow: 0px 0px 4px 0px #ffffff33;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
