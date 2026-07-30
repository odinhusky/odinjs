<template>
  <div
    id="member-center-wrapper"
    class="w-full mx-auto flex flex-col gap-[.625rem] max-w-[75rem] padXl:max-w-[63.6875rem] pad:max-w-[58.25rem] phone:max-w-[100vw] px-5 phone:px-4 mt-[10px]"
  >
    <div
      id="member-center-title"
      class="w-full text-xl leading-[1.6875rem] font-bold font-[NotoSans] text-[var(--text-01)] phone:hidden"
    >
      {{ $t("menu.memberCenter") }}
    </div>
    <div id="member-center-layout" class="w-full flex flex-nowrap gap-5 min-h-[39.9375rem] phone:min-h-0">
      <MemberNav class="phone:hidden" />
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import MemberNav from "src/common/components/MemberNav/Index.vue"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useCommon } from "src/common/hooks/useCommon"
import { useEnv } from "src/common/hooks/useEnv"
import { MEMBER_NAV_ICON_TYPE, WALLET_TYPE } from "src/common/utils/constants"
import { useEnvInfoStore } from "src/stores/envStore"
import { useGlobalStore } from "src/stores/globalStore"
import { useMemberNavStore } from "src/stores/memberNavStore"
import { computed, markRaw, onBeforeUnmount, onMounted, provide, reactive } from "vue"
import { useI18n } from "vue-i18n"

import { useSiteImg } from "../../hooks/useSiteImg"
import Avatar from "./components/Avatar.vue"

type MemberNavWalletOption = {
  label: string
  value: number
  walletType: WALLET_TYPE.Enums
  balance: string
  currencyLabel: string
}

const memberNavStore = useMemberNavStore()
const { t } = useI18n()
const { isCash } = useEnv()
const { moneyFormat } = useCommon()
const { isVipRewardsOpen } = useEnvInfoStore()
const globalStore = useGlobalStore()
const {
  userInfo2,
  userWalletMap,
  activeWalletLabel,
  activeWalletCurrencyId,
  inUseWallet,
  getWalletLabel,
  setUserActiveWallet } = useUserInfo()
const { svgIcon } = useSiteImg()
const memberNavRootStyle = { boxShadow: "inset 2px 2px 22.3px 0px #FFFFFF40, 0px 0px 4px 0px #00000040" }
const memberNavIconMap = {
  memberSummary: "summary",
  memberProfile: "account-2",
  MemberVip: "vip-2",
  MemberDeposit: "deposit-2",
  MemberWithdraw: "withdrawal-2",
  history: "history-2",
  MemberOrder: "order-2",
  memberInbox: "my-msg-2" } as const

const memberNavWalletOptions = computed<MemberNavWalletOption[]>(() => {
  return Object.keys(userWalletMap.value).reduce((result, key) => {
    const cashWallet = userWalletMap.value[key]?.[WALLET_TYPE.Enums.Cash]

    if (!cashWallet) return result

    const balance = `${ moneyFormat(cashWallet.balance || "0") }`
    const currencyLabel = getWalletLabel(cashWallet)

    result.push({
      label: `${ balance } ${ currencyLabel }`,
      value: cashWallet.currency_id,
      walletType: cashWallet.wallet_type,
      balance,
      currencyLabel })

    return result
  }, [] as MemberNavWalletOption[])
})

const memberNavBalanceAmount = computed(
  () => `${ moneyFormat(inUseWallet.value?.[WALLET_TYPE.Enums.Cash]?.balance || "0") }`
)
const memberNavDisplayAccount = computed(() => (userInfo2.value?.account ? `ID:${ userInfo2.value.account }` : ""))

const handleMemberNavWalletChange = (value: number | null) => {
  if (!value || value === activeWalletCurrencyId.value) return

  const selectedWallet = memberNavWalletOptions.value.find((wallet) => wallet.value === value)

  if (!selectedWallet) return

  setUserActiveWallet({ currency_id: selectedWallet.value, wallet_type: selectedWallet.walletType })
}

provide(
  "member-nav-header",
  reactive({
    avatar: markRaw(Avatar),
    accountName: computed(() => userInfo2.value?.account || ""),
    greetingLabel: "Hi",
    displayAccountName: memberNavDisplayAccount,
    walletTitle: computed(() => t("member.cash-Wallet")),
    balanceLabel: computed(() => t("member.withdrawal.balance")),
    balanceAmount: memberNavBalanceAmount,
    activeCurrencyLabel: activeWalletLabel,
    activeCurrencyId: computed(() => activeWalletCurrencyId.value || null),
    walletOptions: memberNavWalletOptions,
    onWalletChange: handleMemberNavWalletChange })
)
provide("member-nav-root-style", memberNavRootStyle)
provide("member-nav-active-class", "member-nav-active-r027")
provide("member-nav-icon-resolver", (nav: { routerName: string }) => {
  const iconName = memberNavIconMap[nav.routerName as keyof typeof memberNavIconMap]
  return iconName ? svgIcon(iconName) : null
})

onMounted(() => {
  document.body.classList.add("member-page-r027")

  memberNavStore.setNavs([
    {
      i18nKey: "menu.summary",
      routerName: "memberSummary",
      activeRouteName: ["memberSummary"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.SUMMARY,
      show: true },
    {
      i18nKey: "menu.personal_information",
      routerName: "memberProfile",
      activeRouteName: ["memberProfile"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.PROFILE,
      show: true },
    {
      i18nKey: "menu.vip_rewards",
      routerName: "MemberVip",
      activeRouteName: ["MemberVip"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.VIP,
      show: isVipRewardsOpen && isCash.value },
    {
      i18nKey: "menu.deposit",
      routerName: "MemberDeposit",
      activeRouteName: ["MemberDeposit"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.DEPOSIT,
      show: true },
    {
      i18nKey: "menu.withdrawal",
      routerName: "MemberWithdraw",
      activeRouteName: ["MemberWithdraw"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.WITHDRAWAL,
      show: true },
    {
      i18nKey: "menu.history",
      routerName: "history",
      activeRouteName: ["history"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.HISTORY,
      show: true },
    {
      i18nKey: "menu.order",
      routerName: "MemberOrder",
      activeRouteName: ["MemberOrder"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.ORDER,
      show: true },
    {
      i18nKey: "menu.my_messages",
      routerName: "memberInbox",
      activeRouteName: ["memberInbox"],
      icon: MEMBER_NAV_ICON_TYPE.Enums.INBOX,
      show: true },
  ])
  globalStore.setLogoutRouteName("home")
})

onBeforeUnmount(() => { document.body.classList.remove("member-page-r027") })
</script>

<style lang="scss">
body.member-page-r027 .q-menu--dark { box-shadow: none !important; }

body.member-page-r027 .q-menu.r027-dropdown-menu-bg,
body.member-page-r027 .q-menu--dark.r027-dropdown-menu-bg {
  background: var(--bg-04) !important;
  border: 1px solid var(--bg-line-01);
  color: var(--text-01);
  box-shadow: none !important;
}

body.member-page-r027 .q-select__dialog,
body.member-page-r027 .q-select__dialog--dark {
  background: var(--bg-04) !important;
  color: var(--text-01) !important;
}

body.member-page-r027 .q-select__dialog > .scroll.r027-dropdown-menu-bg,
body.member-page-r027 .q-select__dialog--dark > .scroll.r027-dropdown-menu-bg {
  background: var(--bg-04) !important;
  color: var(--text-01) !important;
}
</style>
