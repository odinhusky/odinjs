<template>
  <div class="footer-wrapper" :class="route?.meta?.footerContentClass">
    <!-- footer logos -->
    <div v-if="cmsFooterLogos && cmsFooterLogos.length" class="mx-auto logo-list-wrapper">
      <ul class="flex flex-row justify-center provider-list">
        <li
          class="flex justify-center flex-initial py-1 phone:py-2 px-[.625rem] phone:px-[1.5625rem] provider-item"
          v-for="item in cmsFooterLogos"
          :key="item"
        >
          <img
            :src="item"
            :alt="item.toString()"
            @error="setDefaultProductTabImg"
            class="w-[7.5rem] h-auto object-contain"
          />
        </li>
      </ul>
    </div>
    <!-- footer editor -->
    <div v-if="cmsFooterTextContent?.content" class="mx-auto mt-4 text-content-wrapper">
      <div class="content cms-content" v-html="cmsFooterTextContent?.content"></div>
    </div>
  </div>

  <!-- h5 menu -->
  <div :class="route?.meta?.footerNavClass">
    <div class="phone:h-[11.9vw] iphone:h-[3.875rem]"></div>
    <div class="m-footer-bottom">
      <section class="menu-btm">
        <div class="menu-wrapper">
          <template v-for="(cmsItem, cmsIndex) in h5BottomMenuList" :key="cmsIndex">
            <q-btn
              flat
              fab-mini
              class="menuft"
              @click="
                handleEntranceClick({
                  entrance: cmsItem.Entrance[0],
                  opening_method: cmsItem.Setting.payload.opening_method,
                })
              "
            >
              <span class="menu-icon-wrapper">
                <img
                  :src="isActive(cmsItem.Entrance[0]) ? cmsItem.Setting.selected_icon_path : cmsItem.Setting.icon_path"
                />
                <q-badge
                  v-if="cmsItem.Entrance[0]?.payload?.did === 'site_message' && inboxUnreadTotal > 0"
                  class="site-message-unread-badge"
                  color="negative"
                  rounded
                  :label="inboxUnreadTotal > 99 ? '99+' : inboxUnreadTotal"
                />
              </span>
              <p>{{ cmsItem.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}</p>
            </q-btn>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntranceHandler } from "app/template/set_r033/composables/useCms"
import { useSiteImg } from "app/template/set_r033/hooks/useSiteImg"
import { MENU } from "app/template/set_r033/utils/constants"
import type * as Response from "src/api/response.type"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { useWebSocketNotificationStore } from "src/stores/webSocketNotificationStore"
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { nowLang } = useLanguage()
const { cmsFooterLogos, cmsFooterTextContent, h5BottomMenuList } = useCms()
const { handleEntranceClick } = useEntranceHandler()
const { setDefaultProductTabImg } = useSiteImg()
const webSocketNotificationStore = useWebSocketNotificationStore()
const inboxUnreadTotal = computed(() => webSocketNotificationStore.webSocketNotificationState.unreadCount.total)

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: Response.CmsEntranceItem) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}
</script>

<style scoped lang="sass">
@import "src/common/css/_variable.sass"
@import "app/template/set_r033/assets/css/_variable.scss"

.menu-icon-wrapper
  position: relative
.site-message-unread-badge
  position: absolute
  top: -5px
  right: -8px
  min-width: 18px
  height: 18px
  padding: 0 5px

.footer-wrapper
  width: 100%
  background: var(--bg-footer)
  color: var(--neutral-01)
  padding: 2.5rem

  .logo-list-wrapper,
  .text-content-wrapper
    width: 90%
    max-width: 87.5rem

  +pad-width
    .q-size
      font-size: 0.9vw
      padding: 0
  +phone-width
    padding: 1.25rem 1rem
    height: auto
    flex-direction: column
    position: relative
    .logo-list-wrapper,
    .text-content-wrapper
      width:100%

//H5 底下MENU BAR
.m-footer-bottom
  display: none
  position: fixed
  width: 100%
  bottom: 0
  z-index: 90
  +phone-width
    display: block
  .menu-btm
    position: fixed
    margin: auto
    width: 100%
    height: 12vw
    bottom: 0
    left: 0
    right: 0
    background: $secondary06
    +iphone-width
      height: 3.875rem
  .aff-qr
    background: #FFC002
    padding: 3.5%
    width: 13%
    border-radius: 100%
    position: absolute
    left: -1px
    right: 0
    bottom: 28px
    margin: auto
    z-index: 9
    img
      opacity: 0.7
      filter: brightness(255) invert(1)
  .menu-wrapper
    display: flex
    justify-content: space-around
    text-align: center
    padding: 0.28125rem 0
    position: relative
    .menuft
      color: #fff
      font-size: 2.5vw
      text-transform: uppercase
      font-weight: 600
      padding: 0 0
      :deep(.q-btn__content)
        display: block
      :deep(.q-focus-helper)
        opacity: 0
      img
        width: 2.25rem
        height: 2.25rem
        display: block
        margin: auto auto 2px

      &.active
        overflow: hidden
        img
          position: relative
          left: -100px
          filter: drop-shadow(100px 0px 0px #FFC002)



//footer End
</style>
