<template>
  <main class="app-layout" v-if="isReady">
    <q-layout>
      <HeaderArea @toggle-drawer="toggleDrawer" />

      <q-drawer :width="232" show-if-above v-model="drawer" side="left" class="drawer-wrapper">
        <SideMenu />
      </q-drawer>

      <q-page-container>
        <router-view />
        <FooterArea />
      </q-page-container>
    </q-layout>
    <GS1MiniGame />
  </main>
  <LoginModal />
  <ChangePasswordModal />
  <ProfileModal />
  <InboxModal />
  <HistoryModal />
  <PendingTransactionModal />
  <BankDetailsModal />
  <DepositWithWithdrawalModal />
  <WithdrawalPasswordModal />
  <H5BottomMenu v-if="width <= 1000" />
  <CurrencySupportDialog />
  <LaunchGameDialog />
  <CryptoWalletDialog />
  <LiveChat />
  <FloatIconCMS />
  <AnnouncementDialog
    id="announcement-dialog-wrapper"
    :enable-advanced-announcement-filters="enableAdvancedAnnouncementFilters"
  />
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import FloatIconCMS from "app/template/set_r029/components/FloatIconCMS/Index.vue"
import FooterArea from "app/template/set_r029/components/Footer/Index.vue"
import H5BottomMenu from "app/template/set_r029/components/H5BottomMenu/index.vue"
import HeaderArea from "app/template/set_r029/components/Header/Index.vue"
import BankDetailsModal from "app/template/set_r029/components/Modal/BankDetails/Index.vue"
import ChangePasswordModal from "app/template/set_r029/components/Modal/ChangePassword.vue"
import DepositWithWithdrawalModal from "app/template/set_r029/components/Modal/DepositWithWithdrawal/Index.vue"
import HistoryModal from "app/template/set_r029/components/Modal/History/Index.vue"
import InboxModal from "app/template/set_r029/components/Modal/Inbox/Index.vue"
import LoginModal from "app/template/set_r029/components/Modal/LoginWithRegister.vue"
import PendingTransactionModal from "app/template/set_r029/components/Modal/PendingTransaction/Index.vue"
import ProfileModal from "app/template/set_r029/components/Modal/Profile.vue"
import WithdrawalPasswordModal from "app/template/set_r029/components/Modal/WithdrawalPassword/Index.vue"
import SideMenu from "app/template/set_r029/components/SideMenu/Index.vue"
import { useSiteRedirect } from "app/template/set_r029/composables/useSiteRedirect"
import AnnouncementDialog from "src/common/components/dialog/Announcement/Index.vue"
import CryptoWalletDialog from "src/common/components/dialog/CryptoWalletDialog.vue"
import CurrencySupportDialog from "src/common/components/dialog/CurrencySupport.vue"
import LaunchGameDialog from "src/common/components/dialog/LaunchGame.vue"
import GS1MiniGame from "src/common/components/gs1/MiniGame.vue"
import LiveChat from "src/common/components/LiveChat/Index.vue"
import { useGame } from "src/common/composables/useGame"
import { useInit } from "src/common/composables/useInit"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useEnv } from "src/common/hooks/useEnv"
import { usePixelCodes } from "src/common/hooks/usePixelCodes"
import { onMounted, ref } from "vue"

const { width } = useWindowSize()
const drawer = ref(false)
const enableAdvancedAnnouncementFilters = true

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const { isReady, initialize } = useInit()
const { visitWebsite } = useEnv()
const { getAgentSetting } = useLanguage()
const { handleLogoList } = useLogo()
const { initGameTypeList } = useGame()
const { handleSiteRedirect } = useSiteRedirect()
const { useBasicInfoQuery, getUserWalletList } = useUserInfo()
useBasicInfoQuery()
const { handleGetPixelCodes } = usePixelCodes()

onMounted(() => {
  initialize({
    task: [visitWebsite, getAgentSetting, handleLogoList, initGameTypeList, getUserWalletList, handleGetPixelCodes],
    siteRedirect: handleSiteRedirect,
  })
})
</script>

<style>
@import "app/template/set_r029/assets/css/scrollbar.css";
@import "app/template/set_r029/assets/css/font.css";

.select-announcement-type-popup {
  --ann-select-popup-bg: #070609;
  --ann-select-popup-shadow: 0px 0px 10px 0px #ffffff33;
  --ann-select-option-text: #ffffffbf;
  --ann-select-option-text-active: #0b0f19;
  --ann-select-option-bg-active: #22c55e;
  border: 1px solid #111827;
  color: var(--ann-select-option-text);
}

.select-announcement-type-popup .q-item {
  min-height: 2.5rem;
  align-items: center;
}

.select-announcement-type-popup .q-item__label {
  color: var(--ann-select-option-text);
}

body .announcement-type-menu-popup {
  background: #070609 !important;
  border: 1px solid #d2d2d240 !important;
  color: #ffffffbf !important;
}

body .announcement-type-menu-popup .q-item,
body .announcement-type-menu-popup .q-item__label {
  color: #ffffffbf !important;
}

body .announcement-type-menu-popup .q-item.q-item--active {
  background: #22c55e !important;
  color: #0b0f19 !important;
}

body .announcement-type-menu-popup .q-item.q-item--active .q-item__label {
  color: #0b0f19 !important;
}

#announcement-dialog-wrapper,
.r029-announcement-center {
  --r029-ann-dialog-bg: #111827;
  --r029-ann-body-bg: #0b0f19;
  --r029-ann-field-bg: #070609;
  --r029-ann-field-text: #ffffffbf;
  --r029-ann-field-border: #d2d2d240;
  --r029-ann-sidebar-bg: #111827;
  --r029-ann-sidebar-item-bg: #1f2937;
  --r029-ann-sidebar-active-bg: #303b46;
  --r029-ann-gradient-bg: linear-gradient(90deg, #22c55e 0%, #4eed88 100%);
  --r029-ann-search-text: #05312d;
  --r029-ann-text: #f9fafb;
  --r029-ann-muted-text: #9ca3af;
  --r029-ann-line: #ffffff1a;
  --ann-select-bg: var(--r029-ann-field-bg);
  --ann-select-border: var(--r029-ann-field-border);
  --ann-select-text: var(--r029-ann-field-text);
  --ann-select-icon: var(--r029-ann-field-text);
  --ann-date-shortcut-bg: #1f2937;
  --bg-04: var(--r029-ann-body-bg);
  --bg-08: var(--r029-ann-field-bg);
  --bg-line-01: var(--r029-ann-line);
  --bg-line-02: var(--r029-ann-field-border);
  --card-bg-01: var(--r029-ann-sidebar-item-bg);
  --card-bg-02: var(--r029-ann-sidebar-active-bg);
  --tab-text-01: var(--r029-ann-field-text);
  --tab-bg-04: #1f2937;
  --btn-bg-01: #22c55e;
  --btn-bg-02: #4eed88;
  --btn-text-05: var(--r029-ann-search-text);
  --text-01: var(--r029-ann-text);
  --text-02: var(--r029-ann-text);
  --text-03: var(--r029-ann-muted-text);
  --icon-01: var(--r029-ann-field-text);
  --tag-text-01: var(--r029-ann-body-bg);
}

.announcement-dialog-date-shortcuts,
.announcement-date-shortcuts {
  background: #1a1a1a !important;
  background-color: #1a1a1a !important;
}

.announcement-dialog-date-shortcuts .quick-filter-tab.q-btn,
.announcement-date-shortcuts .quick-filter-tab.q-btn {
  background: #1f2937 !important;
  background-color: #1f2937 !important;
  color: #ffffffbf !important;
}

.announcement-dialog-date-shortcuts .quick-filter-tab.q-btn .q-btn__content,
.announcement-date-shortcuts .quick-filter-tab.q-btn .q-btn__content {
  color: inherit !important;
}

.announcement-dialog-date-shortcuts .quick-filter-tab.q-btn.quick-filter-tab--active,
.announcement-date-shortcuts .quick-filter-tab.q-btn.quick-filter-tab--active {
  background: linear-gradient(90deg, #22c55e 0%, #4eed88 100%) !important;
  background-color: #22c55e !important;
  color: #05312d !important;
}

body .announcement-date-pop {
  background: #1a1a1a !important;
  background-color: #1a1a1a !important;
  color: #ffffffbf !important;
}

body .announcement-date-picker.q-date {
  --q-primary: #22c55e;
  --announcement-date-selected-text: #05312d;
  --announcement-date-range-bg: color-mix(in srgb, #22c55e 18%, transparent);
  --announcement-date-range-edge-bg: #22c55e;
  background: #1a1a1a !important;
  background-color: #1a1a1a !important;
  color: #ffffffbf !important;
}

body .announcement-date-picker.q-date .q-date__header {
  background: linear-gradient(90deg, #22c55e 0%, #4eed88 100%) !important;
  background-color: #22c55e !important;
  color: #05312d !important;
}

body .announcement-date-picker.q-date .q-date__main,
body .announcement-date-picker.q-date .q-date__content {
  background: #1a1a1a !important;
  background-color: #1a1a1a !important;
  color: #ffffffbf !important;
}

body .announcement-date-picker.q-date .q-date__navigation,
body .announcement-date-picker.q-date .q-date__calendar-weekdays,
body .announcement-date-picker.q-date .q-date__calendar-item .q-btn,
body .announcement-date-picker.q-date .q-date__arrow,
body .announcement-date-picker.q-date .q-date__view {
  color: #ffffffbf !important;
}

body .announcement-date-picker.q-date .q-date__today .q-btn {
  border-color: #22c55e !important;
}

body .announcement-date-picker.q-date .bg-primary {
  background: linear-gradient(90deg, #22c55e 0%, #4eed88 100%) !important;
  background-color: #22c55e !important;
  color: #05312d !important;
}

body .announcement-date-picker.q-date .q-date__range::before,
body .announcement-date-picker.q-date .q-date__range-from::before,
body .announcement-date-picker.q-date .q-date__range-to::before {
  background: color-mix(in srgb, #22c55e 18%, transparent) !important;
}

body .announcement-date-picker.q-date .q-date__edit-range {
  color: #22c55e !important;
}

body .announcement-date-picker.q-date .q-date__edit-range::before {
  background: color-mix(in srgb, #22c55e 18%, transparent) !important;
  border-top: 1px dashed #22c55e !important;
  border-bottom: 1px dashed #22c55e !important;
}

body .announcement-date-picker.q-date .q-date__range-from .q-btn,
body .announcement-date-picker.q-date .q-date__range-to .q-btn,
body .announcement-date-picker.q-date .q-date__edit-range-from .q-btn,
body .announcement-date-picker.q-date .q-date__edit-range-to .q-btn,
body .announcement-date-picker.q-date .q-date__edit-range-from-to .q-btn {
  background: linear-gradient(90deg, #22c55e 0%, #4eed88 100%) !important;
  background-color: #22c55e !important;
  color: #05312d !important;
}

body .announcement-date-picker.q-date .q-date__edit-range::after,
body .announcement-date-picker.q-date .q-date__edit-range-from::after,
body .announcement-date-picker.q-date .q-date__edit-range-to::after,
body .announcement-date-picker.q-date .q-date__edit-range-from-to::after {
  border-color: #22c55e !important;
}

.r029-announcement-center .dialog-header {
  background: var(--r029-ann-dialog-bg) !important;
  background-color: var(--r029-ann-dialog-bg) !important;
  color: var(--r029-ann-text) !important;
}

.r029-announcement-center .dialog-title,
.r029-announcement-center .filter-label {
  color: var(--r029-ann-text) !important;
}

.r029-announcement-center .dialog-body,
.r029-announcement-center .dialog-body--advanced,
.r029-announcement-center .dialog-body-columns,
.r029-announcement-center .body-content,
.r029-announcement-center .announcement-detail-pc,
.r029-announcement-center .announcement-list-h5,
.r029-announcement-center .announcement-empty {
  background: var(--r029-ann-body-bg) !important;
  background-color: var(--r029-ann-body-bg) !important;
  color: var(--r029-ann-text) !important;
}

.r029-announcement-center .announcement-filter-bar {
  background: var(--r029-ann-body-bg) !important;
  background-color: var(--r029-ann-body-bg) !important;
  border-color: var(--r029-ann-line) !important;
}

.r029-announcement-center .filter-group--type {
  width: 15rem;
  flex: 0 0 15rem;
}

.r029-announcement-center .select-announcement-type-toolbar {
  width: 100%;
  min-width: 0;
  max-width: none;
}

.r029-announcement-center .select-announcement-type-toolbar .q-field__control,
.r029-announcement-center .filter-date-range-input .q-field__control,
.r029-announcement-center .keyword-input .q-field__control,
.r029-announcement-center .quick-filter-segmented {
  background: var(--r029-ann-field-bg) !important;
  background-color: var(--r029-ann-field-bg) !important;
  border: 1px solid var(--r029-ann-field-border) !important;
  box-shadow: none !important;
}

.r029-announcement-center .select-announcement-type-toolbar .q-field__native,
.r029-announcement-center .select-announcement-type-toolbar .q-field__input,
.r029-announcement-center .select-announcement-type-toolbar .q-field__append,
.r029-announcement-center .select-announcement-type-toolbar .q-select__dropdown-icon,
.r029-announcement-center .filter-date-range-input .q-field__native,
.r029-announcement-center .filter-date-range-input .q-field__input,
.r029-announcement-center .filter-date-range-input .q-field__append,
.r029-announcement-center .filter-date-range-input .q-icon,
.r029-announcement-center .keyword-input .q-field__native,
.r029-announcement-center .keyword-input .q-field__input,
.r029-announcement-center .keyword-input .q-field__append,
.r029-announcement-center .quick-filter-tab {
  color: var(--r029-ann-field-text) !important;
}

.r029-announcement-center .select-announcement-type-toolbar .q-field__native {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .r029-announcement-center .filter-group--type {
    width: 100%;
    flex: 0 0 auto;
  }
}

.r029-announcement-center .quick-filter-tab.q-btn.quick-filter-tab--active,
.r029-announcement-center .filter-search-btn {
  background: var(--r029-ann-gradient-bg) !important;
  background-color: #22c55e !important;
  color: var(--r029-ann-search-text) !important;
  box-shadow: none !important;
}

.r029-announcement-center .quick-filter-tab.q-btn.quick-filter-tab--active .q-btn__content,
.r029-announcement-center .filter-search-btn .q-btn__content,
.r029-announcement-center .filter-search-btn .q-icon {
  color: var(--r029-ann-search-text) !important;
}

.r029-announcement-center .body-nav,
.r029-announcement-center .sidebar-wrapper,
.r029-announcement-center .sidebar-list {
  background: var(--r029-ann-body-bg) !important;
  background-color: var(--r029-ann-body-bg) !important;
}

.r029-announcement-center .sidebar-list {
  border-color: var(--r029-ann-line) !important;
}

@media (min-width: 769px) {
  .r029-announcement-center .body-nav {
    width: 270px !important;
    flex-basis: 270px !important;
  }
}

.r029-announcement-center .sidebar-item.sidebar-item--advanced,
.r029-announcement-center .mobile-announcement-item {
  background: var(--r029-ann-sidebar-item-bg) !important;
  background-color: var(--r029-ann-sidebar-item-bg) !important;
  color: var(--r029-ann-text) !important;
}

.r029-announcement-center .sidebar-item.sidebar-item--advanced.active,
.r029-announcement-center .mobile-announcement-item.active {
  background: var(--r029-ann-sidebar-active-bg) !important;
  background-color: var(--r029-ann-sidebar-active-bg) !important;
}

.r029-announcement-center .mobile-announcement-header {
  gap: 0.5rem !important;
}

.r029-announcement-center .mobile-announcement-item.active .mobile-announcement-title {
  overflow: visible !important;
  text-overflow: clip !important;
  white-space: normal !important;
  word-break: break-word;
}

.r029-announcement-center .mobile-announcement-item.active .detail-body {
  color: var(--r029-ann-text) !important;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.r029-announcement-center .sidebar-text,
.r029-announcement-center .mobile-announcement-title,
.r029-announcement-center .detail-title,
.r029-announcement-center .detail-body {
  color: var(--r029-ann-text) !important;
}

.r029-announcement-center .sidebar-text {
  text-align: left;
}

.r029-announcement-center .sidebar-date,
.r029-announcement-center .mobile-announcement-date {
  color: var(--r029-ann-muted-text) !important;
}

.r029-announcement-center .sidebar-type-tag {
  background: var(--r029-ann-gradient-bg) !important;
  background-color: #22c55e !important;
  color: var(--r029-ann-body-bg) !important;
}
</style>

<style scoped lang="scss">
@import "app/template/set_r029/assets/css/_variable.scss";

.app-layout {
  --background: #{$r029-bg-home};
  font-family: "Montserrat", sans-serif;
  background: var(--background, #0b0f19);
}

#announcement-dialog-wrapper {
  --background: #{$r029-bg-home};
  --r029-ann-dialog-bg: #{$r029-bg-section};
  --r029-ann-body-bg: #{$r029-bg-home};
  --r029-ann-field-bg: #070609;
  --r029-ann-field-text: #ffffffbf;
  --r029-ann-field-border: var(--input-dropdown-border-01, #d2d2d240);
  --r029-ann-sidebar-bg: #{$r029-bg-section};
  --r029-ann-sidebar-item-bg: #{$r029-bg-card};
  --r029-ann-sidebar-active-bg: #303b46;
  --r029-ann-gradient-bg: linear-gradient(90deg, #22c55e 0%, #4eed88 100%);
  --r029-ann-search-text: #05312d;
  --r029-ann-text: #{$r029-text-primary};
  --r029-ann-muted-text: #{$r029-text-secondary};
  --r029-ann-line: #ffffff1a;
  --input-dropdown-bg-01: #070609;
  --input-dropdown-text-01: #ffffffbf;
  --input-dropdown-border-01: #d2d2d240;
  --text-: #05312d;
  --ann-overlay: #00000099;
  --ann-header: var(--r029-ann-dialog-bg);
  --ann-header-text: var(--r029-ann-text);
  --ann-header-close: var(--r029-ann-text);
  --ann-sidebar-bg: var(--r029-ann-sidebar-bg);
  --ann-sidebar-text: var(--r029-ann-text);
  --ann-sidebar-active-bg: var(--r029-ann-sidebar-active-bg);
  --ann-sidebar-active-text: #{$r029-action-primary};
  --ann-sidebar-nav-arrow: var(--r029-ann-text);
  --ann-detail-bg: var(--r029-ann-body-bg);
  --ann-detail-text: var(--r029-ann-text);
  --ann-checkbox-wrapper-bg: var(--r029-ann-dialog-bg);
  --ann-checkbox-bg: var(--r029-ann-sidebar-item-bg);
  --ann-checkbox-bg-active: #{$r029-action-primary};
  --ann-checkbox-icon: var(--r029-ann-text);
  --ann-checkbox-text: var(--r029-ann-text);
  --ann-select-bg: var(--r029-ann-field-bg);
  --ann-select-border: var(--r029-ann-field-border);
  --ann-select-text: var(--r029-ann-field-text);
  --ann-select-icon: var(--r029-ann-field-text);
  --ann-sidebar-text-muted: var(--r029-ann-muted-text);
  --ann-pagination-bg: transparent;
  --ann-pagination-text: var(--r029-ann-text);
  --ann-pagination-hover-bg: transparent;
  --ann-pagination-hover-text: #{$r029-action-primary};
  --ann-pagination-active-bg: transparent;
  --ann-pagination-active-text: #{$r029-action-primary};
  --card-bg-01: var(--r029-ann-sidebar-item-bg);
  --card-bg-02: var(--r029-ann-sidebar-active-bg);
  --bg-line-01: var(--r029-ann-line);
  --btn-bg-01: #{$r029-action-primary};
  --tag-text-01: #{$r029-bg-home};
}

#announcement-dialog-wrapper :deep(.dialog-header) {
  padding: 1rem;
  background: var(--r029-ann-dialog-bg) !important;
  background-color: var(--r029-ann-dialog-bg) !important;
  color: var(--r029-ann-text) !important;
}

#announcement-dialog-wrapper :deep(.dialog-title),
#announcement-dialog-wrapper :deep(.header-close) {
  color: var(--r029-ann-text) !important;
}

#announcement-dialog-wrapper :deep(.dialog-body),
#announcement-dialog-wrapper :deep(.dialog-body--advanced),
#announcement-dialog-wrapper :deep(.dialog-body-columns),
#announcement-dialog-wrapper :deep(.body-right),
#announcement-dialog-wrapper :deep(.announcement-detail),
#announcement-dialog-wrapper :deep(.announcement-empty) {
  background: var(--r029-ann-body-bg) !important;
  background-color: var(--r029-ann-body-bg) !important;
  color: var(--r029-ann-text) !important;
}

#announcement-dialog-wrapper :deep(.announcement-filter-bar) {
  background: var(--r029-ann-body-bg) !important;
  background-color: var(--r029-ann-body-bg) !important;
  border-color: var(--r029-ann-line) !important;
}

#announcement-dialog-wrapper :deep(.select-announcement-type .q-field__control),
#announcement-dialog-wrapper :deep(.advanced-date-range-input .q-field__control),
#announcement-dialog-wrapper :deep(.advanced-keyword-input .q-field__control),
#announcement-dialog-wrapper :deep(.quick-filter-segmented) {
  background: var(--r029-ann-field-bg) !important;
  background-color: var(--r029-ann-field-bg) !important;
  border: 1px solid var(--input-dropdown-border-01, #d2d2d240) !important;
  border-color: var(--r029-ann-field-border) !important;
  box-shadow: none !important;
}

#announcement-dialog-wrapper :deep(.select-announcement-type .q-field__native),
#announcement-dialog-wrapper :deep(.advanced-date-range-input .q-field__native),
#announcement-dialog-wrapper :deep(.advanced-keyword-input .q-field__native),
#announcement-dialog-wrapper :deep(.advanced-date-range-input .q-field__append),
#announcement-dialog-wrapper :deep(.select-announcement-type .q-field__append),
#announcement-dialog-wrapper :deep(.select-announcement-type .q-select__dropdown-icon),
#announcement-dialog-wrapper :deep(.quick-filter-tab) {
  color: var(--r029-ann-field-text) !important;
}

#announcement-dialog-wrapper :deep(.select-announcement-type .q-field__native) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  min-height: 2.5rem;
  padding: 0;
  text-align: center;
}

#announcement-dialog-wrapper :deep(.select-announcement-type .q-field__control) {
  align-items: center;
  min-height: 2.5rem;
  height: 2.5rem;
}

#announcement-dialog-wrapper :deep(.select-announcement-type .q-field__append) {
  align-items: center;
  min-height: 2.5rem;
  height: 2.5rem;
}

#announcement-dialog-wrapper :deep(.quick-filter-tab--active) {
  background: var(--r029-ann-gradient-bg) !important;
  background-color: #22c55e !important;
  color: var(--r029-ann-search-text) !important;
}

#announcement-dialog-wrapper :deep(.advanced-search-button) {
  background: var(--r029-ann-gradient-bg) !important;
  background-color: #22c55e !important;
  color: var(--r029-ann-search-text) !important;
  box-shadow: none !important;
}

#announcement-dialog-wrapper :deep(.advanced-search-button .q-btn__content),
#announcement-dialog-wrapper :deep(.advanced-search-label) {
  color: var(--r029-ann-search-text) !important;
}

#announcement-dialog-wrapper :deep(.body-left) {
  width: 285px;
}

#announcement-dialog-wrapper :deep(.sidebar) {
  background: var(--r029-ann-sidebar-bg) !important;
  background-color: var(--r029-ann-sidebar-bg) !important;
  border-right: 1px solid var(--r029-ann-field-border);
  padding: 0.75rem;
}

#announcement-dialog-wrapper :deep(.sidebar-list-pc) {
  gap: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 1px solid var(--r029-ann-line);
  background: var(--r029-ann-sidebar-bg) !important;
  background-color: var(--r029-ann-sidebar-bg) !important;
  border-radius: 0.75rem;
  overflow-x: hidden;
  overflow-y: auto;
}

#announcement-dialog-wrapper :deep(.sidebar-list-pc .sidebar-item) {
  border: 0;
  border-bottom: 1px solid var(--r029-ann-line);
  border-radius: 0;
  background: var(--r029-ann-sidebar-item-bg) !important;
  background-color: var(--r029-ann-sidebar-item-bg) !important;
  padding: 0.75rem;
  color: var(--r029-ann-text) !important;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

#announcement-dialog-wrapper :deep(.sidebar-list-pc .sidebar-item:last-child) {
  border-bottom: 0;
}

#announcement-dialog-wrapper :deep(.sidebar-list-pc .sidebar-item:hover),
#announcement-dialog-wrapper :deep(.sidebar-list-pc .sidebar-item.active) {
  background: var(--r029-ann-sidebar-active-bg) !important;
  background-color: var(--r029-ann-sidebar-active-bg) !important;
  color: var(--ann-sidebar-active-text, #22c55e);
}

#announcement-dialog-wrapper :deep(.sidebar-item-content) {
  gap: 0.5rem;
}

#announcement-dialog-wrapper :deep(.sidebar-item-header) {
  align-items: center;
  gap: 0.5rem;
}

#announcement-dialog-wrapper :deep(.sidebar-type-tag) {
  background: var(--r029-ann-gradient-bg) !important;
  background-color: #22c55e !important;
  color: #{$r029-bg-home} !important;
}

#announcement-dialog-wrapper :deep(.sidebar-date),
#announcement-dialog-wrapper :deep(.nav-tab-date) {
  color: var(--r029-ann-muted-text) !important;
}

#announcement-dialog-wrapper :deep(.sidebar-text) {
  color: var(--r029-ann-text) !important;
  line-height: 1.25rem;
  text-align: left;
}

#announcement-dialog-wrapper :deep(.sidebar-list-h5) {
  background: var(--r029-ann-sidebar-bg) !important;
  background-color: var(--r029-ann-sidebar-bg) !important;
  color: var(--r029-ann-text) !important;
}

@media (max-width: 768px) {
  #announcement-dialog-wrapper :deep(.dialog-body--advanced) {
    background: var(--r029-ann-body-bg) !important;
    background-color: var(--r029-ann-body-bg) !important;
  }

  #announcement-dialog-wrapper :deep(.announcement-filter-bar) {
    border-bottom-color: var(--r029-ann-line) !important;
  }

  #announcement-dialog-wrapper :deep(.announcement-filter-bar__inner) {
    padding: 0.75rem;
  }

  #announcement-dialog-wrapper :deep(.advanced-filter-panel--inline) {
    gap: 0.75rem;
  }

  #announcement-dialog-wrapper :deep(.filter-group--type),
  #announcement-dialog-wrapper :deep(.filter-toolbar--full .select-announcement-type) {
    width: 100%;
    min-width: 0;
    max-width: none;
    flex: 0 0 auto;
  }

  #announcement-dialog-wrapper :deep(.advanced-search-button) {
    height: 2.75rem;
    min-height: 2.75rem;
    border-radius: 0.5rem;
    background: var(--r029-ann-gradient-bg) !important;
    background-color: #22c55e !important;
    color: var(--r029-ann-search-text) !important;
  }

  #announcement-dialog-wrapper :deep(.advanced-search-button .q-btn__content) {
    color: var(--r029-ann-search-text) !important;
  }

  #announcement-dialog-wrapper :deep(.announcement-list-h5) {
    gap: 0.375rem;
    padding: 0.75rem;
    background: var(--r029-ann-body-bg) !important;
    background-color: var(--r029-ann-body-bg) !important;
  }

  #announcement-dialog-wrapper :deep(.mobile-announcement-item) {
    border: 1px solid var(--r029-ann-line);
    border-radius: 0.5rem;
    background: var(--r029-ann-sidebar-item-bg) !important;
    background-color: var(--r029-ann-sidebar-item-bg) !important;
    color: var(--r029-ann-text) !important;
  }

  #announcement-dialog-wrapper :deep(.mobile-announcement-item.active) {
    background: var(--r029-ann-sidebar-active-bg) !important;
    background-color: var(--r029-ann-sidebar-active-bg) !important;
  }

  #announcement-dialog-wrapper :deep(.mobile-announcement-header) {
    gap: 0.5rem !important;
  }

  #announcement-dialog-wrapper :deep(.mobile-announcement-item.active .mobile-announcement-title),
  #announcement-dialog-wrapper :deep(.mobile-announcement-item.active .mobile-announcement-preview),
  #announcement-dialog-wrapper :deep(.mobile-announcement-item.active .mobile-announcement-detail-body) {
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: normal !important;
    word-break: break-word;
  }

  #announcement-dialog-wrapper :deep(.mobile-announcement-title) {
    color: var(--r029-ann-text) !important;
  }

  #announcement-dialog-wrapper :deep(.mobile-announcement-preview),
  #announcement-dialog-wrapper :deep(.mobile-announcement-date) {
    color: var(--r029-ann-muted-text) !important;
  }

  #announcement-dialog-wrapper :deep(.announcement-checkbox-wrapper) {
    background: var(--r029-ann-dialog-bg) !important;
    background-color: var(--r029-ann-dialog-bg) !important;
  }
}

#announcement-dialog-wrapper :deep(.announcement-checkbox-wrapper) {
  background: var(--r029-ann-dialog-bg) !important;
  background-color: var(--r029-ann-dialog-bg) !important;
  color: var(--r029-ann-text) !important;
}

#announcement-dialog-wrapper :deep(.announcement-checkbox-wrapper .q-checkbox__label) {
  color: var(--r029-ann-text) !important;
}

#announcement-dialog-wrapper :deep(.announcement-checkbox-wrapper .q-checkbox__inner--truthy) {
  color: var(--ann-checkbox-bg-active) !important;
}

#announcement-dialog-wrapper :deep(.announcement-checkbox-wrapper .q-checkbox__inner--truthy .q-checkbox__bg),
#announcement-dialog-wrapper :deep(.announcement-checkbox-wrapper .q-checkbox__inner--truthy .q-checkbox__svg) {
  background: var(--ann-checkbox-bg-active) !important;
  background-color: var(--ann-checkbox-bg-active) !important;
  border-color: var(--ann-checkbox-bg-active) !important;
}

#announcement-dialog-wrapper :deep(.sidebar-pagination),
#announcement-dialog-wrapper :deep(.mobile-pagination) {
  padding-bottom: 0rem;

  .q-pagination__content,
  .q-pagination__middle {
    gap: 0.5rem;
  }

  .q-btn {
    min-height: 2rem;
    min-width: 2rem;
    border-radius: 0.25rem;
    background: transparent !important;
    color: var(--ann-pagination-text) !important;
    font-weight: 700;
    margin: 0;

    &::before {
      box-shadow: none !important;
    }

    &[aria-current="true"] {
      background: transparent !important;
      color: var(--ann-pagination-active-text) !important;
    }

    &.disabled {
      background: transparent !important;
      color: var(--ann-pagination-text) !important;
      opacity: 1 !important;
    }
  }

  .q-pagination__middle button[aria-current="true"] {
    background: transparent !important;
    color: var(--ann-pagination-active-text) !important;
  }
}
</style>
