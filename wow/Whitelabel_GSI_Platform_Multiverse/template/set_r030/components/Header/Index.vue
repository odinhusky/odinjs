<template>
  <div class="header" :class="{ fixed: !props.modelValue }">
    <div class="header-left">
      <div class="menu-toggle" :class="{ 'is-close': props.modelValue }">
        <img :src="svgIcon('menu-arrow')" alt="menu-arrow" @click="emit('update:modelValue', !props.modelValue)" />
      </div>
      <img v-if="getSquareLogo()" class="logo-img" :src="getSquareLogo()" @click="$router.push('/')" />
    </div>

    <div v-if="isUp.phone" class="header-center">
      <ul class="nav-bar" ref="navBarRef" @wheel="onWheelScroll">
        <li
          v-for="(cmsItem, cmsIndex) in navigationBarList"
          :key="cmsIndex"
          class="nav-item menuimg"
          :class="{
            active: isActive(cmsItem.Entrance[0])
          }"
        >
          <div class="navlink" @click="handleEntranceClick({ entrance: cmsItem.Entrance[0] })">
            {{ limitWordLength(cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}
          </div>
        </li>
      </ul>
    </div>

    <div class="header-right">
      <WalletDropdown v-if="isLogin" />

      <div v-if="!isLogin" class="gap-2 flex items-center justify-center flex-nowrap">
        <q-btn class="login-btn" color="primary" @click="showLoginOrRegister(0, $q.platform.is.mobile ? true : false)">
          {{ $t("common.btn.login") }}
        </q-btn>

        <q-btn
          class="register-btn"
          color="primary"
          @click="showLoginOrRegister(1, $q.platform.is.mobile ? true : false)"
        >
          {{ $t("common.btn.register") }}
        </q-btn>
      </div>

      <div v-if="isUp.phone && isLogin" class="gap-4 flex items-center justify-center">
        <q-btn flat class="menuft">
          <img :src="svgIcon('orange_user')" />
          <span class="ml-4 normal-case">{{ limitWordLength(auth.account || "") }}</span>
          <q-menu v-model="menuShow" class="!bg-transparent" :offset="[50, 10]">
            <q-list style="min-width: 200px" class="header-menu-list">
              <q-item clickable v-close-popup @click="router.push({ name: 'memberSummary' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('account')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.memberCenter") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'MemberVip' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('vip')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.vip") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'MemberDeposit' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('deposit')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.deposit") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'MemberWithdraw' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('withdrawal')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.withdrawal") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'history' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('history')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.history") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="router.push({ name: 'MemberOrder' })">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('order')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.order") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('logout')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.logout") }}</p>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_r030/composables/useCms"
import { useSiteImg } from "app/template/set_r030/hooks/useSiteImg"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { injectStrict } from "src/common/utils/injectTyped"
import limitWordLength from "src/common/utils/limitWordLength"
import { EventBusKey } from "src/symbols"
import { ref } from "vue"
import { useRoute,useRouter } from "vue-router"

import { MENU } from "../../utils/constants"
import WalletDropdown from "./components/WalletDropdown.vue"

const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue", "changeLogin"])
const eventbus = injectStrict(EventBusKey)

const route = useRoute()
const router = useRouter()
const { isUp } = useMediaQuery()
const { svgIcon } = useSiteImg()
const { nowLang } = useLanguage()
const { getSquareLogo } = useLogo()
const { handleWheelScroll } = useCommon()
const { auth, isLogin, handleLogout } = useAuth()
const { handleEntranceClick } = useEntranceHandler()
const {
  navigationBarList,
} = useCms()

const menuShow = ref(false)
const navBarRef = ref<HTMLElement>()

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}

const showLoginOrRegister = (type: number, forcePasswordLogin = false) => {
  if (!type) {
    eventbus.emit("openLogin", true, forcePasswordLogin)
  } else {
    eventbus.emit("openRegister", true)
  }
}

const onWheelScroll = (event: WheelEvent) => {
  if (navBarRef.value) {
    handleWheelScroll(event, navBarRef.value)
  }
}

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r030/assets/css/_variable.scss";

.header {
  z-index: 1;
  width: 100%;
  height: 4.25rem;
  position: relative;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-header);
  flex-direction: row;
  padding: 1rem;

  @include phone-width {
    height: 3.6875rem;
    padding: 0.625rem 0.875rem;
  }

  @include pad-width {
    position: relative;
    width: 100%;
    background: var(--bg-header);
  }

  &.fixed {
    @include phone-width {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  }

  .header-left {
    min-width: 11.5rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    @include phone-width {
      min-width: unset;
    }

    .menu-toggle {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      justify-content: flex-start;
      transition: left 0.2s ease 0s;
      margin-right: 0.75rem;
      z-index: 999;

      img {
        transform: rotate(0deg);
        transition: transform 0.2s ease 0s;
        cursor: pointer;
      }

      &.is-close {
        img {
          transform: rotate(180deg);
        }
      }
    }

    .logo-img {
      height: 100%;
      cursor: pointer;

      @include phone-width {
        max-width: 8.25rem;
        height: auto;
        max-height: 100%;
      }

      :deep(.q-btn__content) {
        justify-content: flex-start;
      }
    }
  }

  .header-center {
    height: 100%;
    flex: 1;
    overflow: hidden;
    min-width: 0;
    margin: 0 1rem;

    .nav-bar {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow-x: auto;

      li {
        height: 100%;
        cursor: pointer;
        position: relative;
        margin: 0 1.375rem;
        font-weight: 400;
        font-size: 1rem;
        user-select: none;
        color: var(--text-01);
        white-space: nowrap;
        display: flex;
        align-items: center;
        &.active {
          color: var(--text-07);
          font-weight: 500;
          &::before {
            position: absolute;
            background: var(--btn-bg-01);
            bottom: 0;
            content: "";
            height: 0.1875rem;
            width: 100%;
          }
        }
        .navlink {
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
      // nav-bar滾動條樣式
      &::-webkit-scrollbar {
        height: 0.25rem;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 0.125rem;
        &:hover {
          background: transparent;
        }
      }
    }
  }

  .header-right {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    color: var(--text-01);
    gap: 1.5rem;
    margin-right: 1rem;

    @include phone-width {
      gap: 0;
      margin-right: 0;
    }

    .login-btn {
      border-radius: 4px;
      border: 2px solid var(--btn-border-02);
      color: var(--btn-bg-01) !important;
      background: transparent !important;
    }

    .register-btn {
      border-radius: 4px;
      color: #fff !important;
      background: linear-gradient(90deg, var(--btn-bg-01) 0%, var(--btn-bg-02) 100%) !important;
    }

    .menuft {
      color: var(--text-01) !important;
      font-size: 0.875rem;
    }

    :deep(.q-select__dropdown-icon) {
      transform: rotate(-90deg);
      &.rotate-180 {
        transform: rotate(90deg);
      }
    }
  }
}

.header-menu-list {
  @apply uppercase text-sm;
  color: var(--text-01);
  border-radius: 4px;
  background: var(--dialog-bg);
  padding: 0.5rem 0;

  :deep(.q-item) {
    // padding: 8px 32px;

    .q-item__section {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;

      .home-title-icon {
        width: 1.2rem;
      }

      p {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
