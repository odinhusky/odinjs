<script setup lang="ts">
import { ROUTE_PATH } from "@shared-lib/constants/routePath"
import { POST_LOGIN_RETURN_ROUTE } from "@shared-lib/constants/sessionStorageKeys"

const route = useRoute()
const router = useRouter()
const isLoginVisible = ref(false)
const isRegisterVisible = ref(false)
const isDepositVisible = ref(false)
const isWithdrawVisible = ref(false)
const postLoginReturnRoute = useSessionStorage<string>(POST_LOGIN_RETURN_ROUTE, "")
const { shouldShowFooter } = useFooterVisibility()

// 監聽路由，只要是在 /login、/login/phone 或 /deposit，彈窗就打開
watch(
  () => route.path,
  async (path) => {
    const isLoginRoute = path === ROUTE_PATH.LOGIN.PASSWORD || path === ROUTE_PATH.LOGIN.SMS
    const isRegisterRoute = path === ROUTE_PATH.REGISTER
    const isDepositRoute = path === ROUTE_PATH.DEPOSIT
    const isWithdrawRoute = path === ROUTE_PATH.WITHDRAW

    // 💡 只有在「離開」某類彈窗路由時才關閉，避免同類路由切換（/login ↔ /login/phone）時重建 Dialog
    if (!isLoginRoute) isLoginVisible.value = false
    if (!isRegisterRoute) isRegisterVisible.value = false
    if (!isDepositRoute) isDepositVisible.value = false
    if (!isWithdrawRoute) isWithdrawVisible.value = false

    if (isLoginRoute) {
      isLoginVisible.value = true
    } else if (isRegisterRoute) {
      await nextTick()
      isRegisterVisible.value = true
    } else if (isDepositRoute) {
      await nextTick()
      isDepositVisible.value = true
    } else if (isWithdrawRoute) {
      await nextTick()
      isWithdrawVisible.value = true
    }
  },
  { immediate: true }
)

// 當使用者點擊 X 或背景關閉彈窗時，網址要退回首頁
const handleLoginDialogClose = async () => {
  postLoginReturnRoute.value = ""
  await router.replace(ROUTE_PATH.HOME)
}

const handleDialogClose = async () => {
  await router.push(ROUTE_PATH.HOME)
}

const handleDepositDialogClose = async () => {
  await router.replace(ROUTE_PATH.HOME)
}

const handleWithdrawDialogClose = async () => {
  await router.replace(ROUTE_PATH.HOME)
}
</script>

<template>
  <main class="app-container app-container-global h-screen overflow-hidden overflow-x-hidden">
    <Header />

    <div
      :class="
        cx(FLEX_ITEMS_STRETCH, 'h-screen overflow-hidden pt-[72px] phone:pt-14 pb-0 phone:pb-[70px]', 'layout-bg')
      "
    >
      <SideMenu />

      <div :class="cx('w-full h-full min-h-0 flex-1 overflow-y-auto', FLEX_COL, SCROLLBAR_HIDDEN)">
        <div class="flex-1">
          <slot />
        </div>

        <Footer v-if="shouldShowFooter" class="mt-auto" />
      </div>
    </div>

    <MobileBottomNav />

    <ClaimGiftFloatingEntry />
    <CmsFloatingIconEntry />
    <CmsContactUsFloatingEntry />
    <AnnouncementCenterOverlay />

    <!-- 登入彈窗 -->
    <LoginDialog v-model:visible="isLoginVisible" @close="handleLoginDialogClose" />
    <!-- 註冊彈窗 -->
    <RegisterDialog v-model:visible="isRegisterVisible" @close="handleDialogClose" />
    <!-- 存款彈窗 -->
    <DepositDialog :visible="isDepositVisible" @close="handleDepositDialogClose" />
    <!-- 出金彈窗 -->
    <WithdrawDialog :visible="isWithdrawVisible" @close="handleWithdrawDialogClose" />

    <AlertDialog />

    <!-- 轉出贈金錢包彈窗 -->
    <BonusTransferDialog />

    <!-- 遊戲幣別/錢包選擇彈窗 -->
    <GameWalletSelectDialog />

    <!-- 一鍵轉回（轉帳錢包 all_transfer_out）確認彈窗 -->
    <TransferWalletAllTransferOutDialog />

    <!-- CMS 彈窗管理 -->
    <CmsPopupDialog />
  </main>
</template>

<style scoped lang="css">
.layout-bg {
  background-image: url("/images/bg-img-pc.webp");
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
}

@media (max-width: 768px) {
  .layout-bg {
    background-image: url("/images/bg-img-mobile.webp");
  }
}
</style>
