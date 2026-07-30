<template>
  <div class="header" :class="{ fixed: !props.modelValue }">
    <q-file ref="imgFileRef" v-model="imgFile" class="hidden" @update:model-value="handleImgUpload" />
    <div class="header-left">
      <div class="menu-toggle" :class="{ 'is-close': props.modelValue }">
        <img :src="svgIcon('menu-arrow')" alt="menu-arrow" @click="emit('update:modelValue', !props.modelValue)" />
      </div>
      <img v-if="getSquareLogo()" class="logo-img" :src="getSquareLogo()" @click="$router.push('/')" />
    </div>

    <div v-if="width > 1024" class="header-center">
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
      <WalletDropdown v-if="isLogin && isUp.phone" />

      <GuestAuthButtons v-if="showHeaderGuestAuthButtons" variant="header" />

      <div v-if="isUp.phone && isLogin" class="gap-4 flex items-center justify-center">
        <q-btn flat no-caps class="menuft" align="left">
          <div class="menuft-content">
            <img class="user-avatar" :src="getUserAvatar(svgIcon('orange_user'))" alt="user-avatar" />
            <span class="menuft-label">{{ limitWordLength(displayName) }}</span>
            <img class="arrow-icon" :class="{ open: menuShow }" :src="svgIcon('arrowDown')" alt="" />
          </div>
          <q-menu
            v-model="menuShow"
            class="q-menu q-position-engine scroll header-menu-r027"
            anchor="bottom right"
            self="top right"
            :offset="[0, 8]"
          >
            <q-list class="header-menu-list">
              <div class="menu-profile-header">
                <div class="menu-profile-avatar-wrap">
                  <img class="menu-profile-avatar" :src="getUserAvatar(svgIcon('orange_user'))" alt="user-avatar" />
                  <span class="menu-profile-edit-badge" @click.stop="selectFile">
                    <img :src="svgIcon('avatar-edit-update')" alt="edit-avatar" />
                  </span>
                </div>
                <p class="menu-profile-name">ID: {{ displayName }}</p>
              </div>
              <q-item
                clickable
                v-close-popup
                class="header-menu-item"
                :class="{ active: isMenuRouteActive('memberSummary') }"
                @click="router.push({ name: 'memberSummary' })"
              >
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('summary')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.summary") }}</p>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                class="header-menu-item"
                :class="{ active: isMenuRouteActive('memberProfile') }"
                @click="router.push({ name: 'memberProfile' })"
              >
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('account-2')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.personal_information") }}</p>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                class="header-menu-item"
                :class="{ active: isMenuRouteActive('MemberVip') }"
                @click="router.push({ name: 'MemberVip' })"
              >
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('vip-2')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.vip_rewards") }}</p>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                class="header-menu-item"
                :class="{ active: isMenuRouteActive('MemberDeposit') }"
                @click="router.push({ name: 'MemberDeposit' })"
              >
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('deposit-2')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.deposit") }}</p>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                class="header-menu-item"
                :class="{ active: isMenuRouteActive('MemberWithdraw') }"
                @click="router.push({ name: 'MemberWithdraw' })"
              >
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('withdrawal-2')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.withdrawal") }}</p>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                class="header-menu-item"
                :class="{ active: isMenuRouteActive('history') }"
                @click="router.push({ name: 'history' })"
              >
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('history-2')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.history") }}</p>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                class="header-menu-item"
                :class="{ active: isMenuRouteActive('MemberOrder') }"
                @click="router.push({ name: 'MemberOrder' })"
              >
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('order-2')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.order") }}</p>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                class="header-menu-item"
                :class="{ active: isMenuRouteActive('memberInbox') }"
                @click="router.push({ name: 'memberInbox' })"
              >
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('my-msg-2')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.my_messages") }}</p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup class="header-menu-item" @click="logout">
                <q-item-section avatar class="min-w-0">
                  <img class="w-full h-full home-title-icon" :src="svgIcon('logout-2')" alt="" />
                </q-item-section>
                <q-item-section>
                  <p>{{ $t("menu.logout") }}</p>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <LanguageDropdown class="language-bar" btnSize="md" :isClose="modelValue" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isSetR027CmsEntranceActive, useEntranceHandler } from "app/template/set_r027/composables/useCms"
import { useSiteImg } from "app/template/set_r027/hooks/useSiteImg"
import { QFile, useQuasar } from "quasar"
import { createDidRouteResolver, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useLogo } from "src/common/composables/useLogo"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useAuth } from "src/common/hooks/useAuth"
import { useCommon } from "src/common/hooks/useCommon"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { breakpoints } from "src/common/utils/constants/breakpoints"
import limitWordLength from "src/common/utils/limitWordLength"
import { computed, ref } from "vue"
import { useRoute,useRouter } from "vue-router"

import LanguageDropdown from "../../layout/LanguageDropdown.vue"
import { MENU } from "../../utils/constants"
import GuestAuthButtons from "../GuestAuthButtons.vue"
import WalletDropdown from "./components/WalletDropdown.vue"

const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue", "changeLogin"])
const $q = useQuasar()

const route = useRoute()
const router = useRouter()
const { isUp, width } = useMediaQuery()
const { svgIcon } = useSiteImg()
const { nowLang } = useLanguage()
const { getUserAvatar, setUserAvatar } = useUserInfo()
const { getSquareLogo } = useLogo()
const { handleWheelScroll, convertToBase64 } = useCommon()
const { auth, isLogin, handleLogout } = useAuth()
const { handleEntranceClick } = useEntranceHandler()
const {
  navigationBarList,
} = useCms()

const menuShow = ref(false)
const navBarRef = ref<HTMLElement>()
const imgFileRef = ref<QFile>()
const imgFile = ref<File>()
const displayName = computed(() => auth.value.account || "")
const showHeaderGuestAuthButtons = computed(() => !isLogin.value && width.value >= breakpoints.phone)

const selectFile = () => {
  imgFileRef.value?.pickFiles()
}

const handleImgUpload = async () => {
  if (imgFile.value) {
    const { status, data, msg } = await convertToBase64(imgFile.value)
    if (!status) {
      $q.notify({
        type: "negative",
        position: "top",
        message: msg,
        icon: "warning",
        timeout: 1000,
      })
      return
    }

    if (data) {
      await setUserAvatar(data)
      imgFile.value = undefined
    }
  }
}

const logout = async () => {
  await handleLogout()
  router.push({ name: "home" })
}

const onWheelScroll = (event: WheelEvent) => {
  if (navBarRef.value) {
    handleWheelScroll(event, navBarRef.value)
  }
}

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isSetR027CmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

const isMenuRouteActive = (routeName: string) => route.name === routeName

</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r027/assets/css/_variable.scss";

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
        color: $neutral01;
        white-space: nowrap;
        display: flex;
        align-items: center;
        &.active {
          color: $primany01;
          font-weight: 500;
          &::before {
            position: absolute;
            background: $primany01;
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
    color: $neutral01;
    gap: 10px;
    margin-right: 0.5rem;

    @include iphone-width {
      gap: 2px;
      margin-right: 0;
    }

    .menuft {
      height: 36px;
      min-height: auto;
      padding: 0;
      // border: 1px solid var(--btn-border-01);
      border-radius: 100px;
      background: var(--bg-05);

      &:before {
        box-shadow: none;
      }

      :deep(.q-btn__content) {
        justify-content: flex-start;
      }

      .menuft-content {
        height: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 0.75rem;
        padding-left: 8px;
      }

      .user-avatar {
        width: 1.575rem;
        height: 1.575rem;
        border-radius: 999px;
        object-fit: cover;
        margin-right: 3px;
        flex-shrink: 0;
      }

      .menuft-label {
        max-width: 7rem;
        overflow: hidden;
        color: $neutral01;
        font-size: 0.8125rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .arrow-icon {
        width: 12px;
        height: 5px;
        transition: transform 0.2s ease;
        transform: rotate(0deg);
        flex-shrink: 0;

        &.open {
          transform: rotate(180deg);
        }
      }
    }
  }
}

.header-menu-list {
  min-width: 200px;
  width: auto;
  color: var(--input-dropdown-text-02);
  font-size: 0.875rem;
  border-radius: 1rem;
  background: var(--bg-04);
  padding: 24px 16px;

  .menu-profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.25rem 0.5rem 1rem;
  }

  .menu-profile-avatar-wrap {
    position: relative;
    width: 3rem;
    height: 3rem;
  }

  .menu-profile-avatar {
    width: 100%;
    height: 100%;
    border-radius: 999px;
    object-fit: cover;
    padding: 2px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #765c19 0%, #fcefcf 45.67%, #f2b519 63.94%, #765c19 100%);
    display: block;
  }

  .menu-profile-edit-badge {
    position: absolute;
    right: -0.125rem;
    bottom: -0.125rem;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
    background: linear-gradient(180deg, #765c19 0%, #fcefcf 45.67%, #f2b519 63.94%, #765c19 100%);
    flex-shrink: 0;
    cursor: pointer;

    &::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background: var(--bg-08);
    }

    img {
      position: relative;
      z-index: 1;
      width: auto;
      height: auto;
      object-fit: contain;
    }
  }

  .menu-profile-name {
    max-width: 100%;
    overflow: hidden;
    color: var(--input-dropdown-text-02);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.25;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.q-item) {
    border-radius: 8px;
    padding: 8px 20px;
    margin-bottom: 8px;
    background: var(--btn-bg-05);
    min-height: 36px !important;
    transition: background 0.2s ease;

    &.active {
      background: var(--btn-bg-01);
    }

    &:hover {
      background: var(--btn-bg-01);
    }

    .q-item__section {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      align-items: center;

      .home-title-icon {
        width: 1rem;
        height: 1rem;
      }

      p {
        display: flex;
        align-items: center;
        color: inherit;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }

  :deep(.q-item:last-child) {
    margin-bottom: 0;
  }
}
</style>

<style lang="scss">
.q-menu.header-menu-r027 {
  max-height: 100%;
  background: var(--bg-04) !important;
  border: 1px solid var(--bg-line-01);
  border-radius: 1rem;
  color: var(--input-dropdown-text-02);
  box-shadow: none;
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}
</style>
