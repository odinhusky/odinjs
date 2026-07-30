<template>
  <q-drawer :width="isLargeTablet ? 312 : 244" show-if-above v-model="drawer" side="left" class="drawer-wrapper">
    <div class="drawer-content">
      <div class="side-header">
        <LanguageDropdown />
        <div class="theme-change-btn" :class="{ 'is-dark': $q.dark.isActive }" @click="handlerChangeDarkMode()">
          <div class="toggle-knob"></div>
          <q-icon name="bedtime" class="icon icon-moon" />
          <q-icon name="wb_sunny" class="icon icon-sun" />
        </div>
      </div>
      <div v-if="isLogin && isCash" class="currency-btn-list">
        <div class="currency-btn deposit-btn" @click="goToPage('deposit')">
          <q-img :src="asideMenuImage('deposit')" class="currency-btn-icon" />
          <div class="currency-btn-text">{{ $t("common.btn.deposit") }}</div>
        </div>
        <div class="currency-btn withdrawal-btn" @click="goToPage('withdrawal')">
          <q-img :src="asideMenuImage('withdrawal')" class="currency-btn-icon" />
          <div class="currency-btn-text">{{ $t("common.btn.withdrawal") }}</div>
        </div>
      </div>
      <MenuCMS />
      <div v-if="isLogin">
        <p class="list-title">{{ $t("menu.personalCenter") }}</p>
        <PersonalCenter />
      </div>
      <div v-if="cmsContactUsList.length > 0">
        <p class="list-title">{{ $t("menu.other") }}</p>
        <ContactUsCMS :contactUsList="cmsContactUsList" />
      </div>
      <div v-if="isLogin && isLargeTablet" @click="logout" :loading="isLoading" class="logout-btn">
        <img :src="svgIcon('logout')" alt="" />
        <span>{{ $t("common.btn.logout") }}</span>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import ContactUsCMS from "app/template/set_r032/components/AsideMenu/ContactUsCMS.vue"
import MenuCMS from "app/template/set_r032/components/AsideMenu/MenuCMS.vue"
import PersonalCenter from "app/template/set_r032/components/AsideMenu/PersonalCenter.vue"
import LanguageDropdown from "app/template/set_r032/components/LanguageDropdown/Index.vue"
import { useSiteImg } from "app/template/set_r032/hooks/useSiteImg"
import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import { useTelegram } from "src/common/composables/useTelegramMiniApp"
import { useAuth } from "src/common/hooks/useAuth"
import { useEnv } from "src/common/hooks/useEnv"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { injectStrict } from "src/common/utils/injectTyped"
import { EventBusKey } from "src/symbols"
import { useDarkModeStore } from "stores/darkModeStore"
import { onMounted } from "vue"
import { useRouter } from "vue-router"

const $q = useQuasar()
const eventbus = injectStrict(EventBusKey)
const { svgIcon, asideMenuImage } = useSiteImg()
const { isLogin, handleLogout, isLoading } = useAuth()
const { isLargeTablet } = useMediaQuery()
const {
  cmsContactUsList,
} = useCms()
const { isCash } = useEnv()
const { isTelegramMiniApp, closeMiniApp } = useTelegram()
const { isDarkMode, updateIsDarkMode } = useDarkModeStore({ initialValue: true })

const drawer = defineModel<boolean>()
const router = useRouter()

const goToPage = (name: string) => {
  eventbus.emit("openDepositWithWithdrawal", true, name)
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })

  if (isTelegramMiniApp.value) closeMiniApp()
}

const handlerChangeDarkMode = () => {
  $q.dark.toggle()
  updateIsDarkMode($q.dark.isActive)
}

onMounted(() => {
  if (isDarkMode) {
    $q.dark.set(true)
  }
})
</script>

<style scoped lang="scss">
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

:deep(.drawer-wrapper) {
  @apply py-[1.5rem] px-[.75rem];
  background: var(--bg-side);
  border-right: 0.045625rem solid var(--border-soft);

  &::-webkit-scrollbar {
    display: none;
  }
  &::-moz-scrollbar {
    display: none;
  }
  &::-ms-scrollbar {
    display: none;
  }
  &::-o-scrollbar {
    display: none;
  }
}

.drawer-content {
  @apply h-full overflow-y-auto overflow-x-hidden;
  padding-right: 0.25rem;
  padding-bottom: 20vh;
  //hide scrollbar
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.side-header {
  @apply flex justify-between items-center;
}

.theme-change-btn {
  @apply flex justify-evenly items-center cursor-pointer w-[3.5rem] h-[1.75rem] rounded-[1rem] relative;
  background: var(--linear-gradient-primary-01);

  .icon {
    @apply w-[1.25rem] h-[1.25rem];
    font-size: 1rem;
    // 預設（pill 上）的 icon 顏色 = knob 顏色 = text-01（light: 白 / dark: 深藍）
    // 這樣未被 highlight 的 icon 在 pill 漸層上仍清晰
    color: var(--text-01);
    position: relative;
    z-index: 2;
    transition: color 0.3s ease;
  }

  .toggle-knob {
    @apply w-[1.5rem] h-[1.5rem] rounded-full absolute left-[0.25rem] transition-transform duration-300;
    // knob 顏色跟著主題反轉：light → 白(#ffffff)；dark → 深藍(#0d2245)
    // 用 var(--text-01) 是因為它剛好就是這個反轉
    background: var(--text-01);
    z-index: 1;
    // 預設 light mode：knob 在右邊蓋住 sun
    transform: translateX(1.5rem);
  }

  // light mode：sun 在 knob 內，換成 primary-01（藍）才能對比白 knob
  &:not(.is-dark) {
    .icon-sun {
      color: var(--primary-01);
    }
  }

  &.is-dark {
    // dark mode：knob 滑到左邊蓋住 moon
    .toggle-knob {
      // transform: translateX(0);
    }

    .icon-sun {
      color: var(--primary-01);
    }

    // moon 在 knob 內，換成 primary-01（黃）才能對比深藍 knob
    .icon-moon {
      color: var(--text-01);
    }
  }
}

.currency-btn-list {
  @apply flex gap-[.5rem] mt-[.75rem];
}

.currency-btn {
  @apply flex items-center justify-center cursor-pointer w-1/2;
  @apply h-[2.5rem] rounded-[.5rem] gap-[.25rem];

  .currency-btn-icon {
    @apply w-[2rem] h-[2rem];
  }

  .currency-btn-text {
    @apply text-[.75rem];
    color: var(--secondary-02);
  }
}

.deposit-btn {
  @apply bg-[var(--secondary-03)];
}

.withdrawal-btn {
  @apply bg-[var(--primary-04)];
}

.list-title {
  @apply text-[.875rem] mt-[1.5rem];
  color: var(--secondary-01);
}

.logout-btn {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  padding: 0.5rem 0 0.5rem 0.75rem;
  color: var(--primary-02);
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  img {
    width: 1.125rem;
  }
}
</style>
<style lang="scss">
.q-drawer {
  position: fixed;
}
</style>
