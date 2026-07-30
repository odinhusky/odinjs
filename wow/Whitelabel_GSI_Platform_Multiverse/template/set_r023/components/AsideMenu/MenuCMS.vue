<template>
  <section class="menu-cms-container">
    <div
      class="cms-item"
      :class="{
        active: isActive(item.Entrance[0])
      }"
      v-for="item in fliterDisplayDeviceAndLogin"
      :key="item.id"
      @click="handleCmsMenuClick(item)"
    >
      <div class="item-icon-wrapper">
        <q-img
          :src="item.Setting.icon_path"
          class="default-icon"
          v-if="!isActive(item.Entrance[0])"
        />
        <q-img
          :src="item.Setting.selected_icon_path"
          class="selected-icon"
          v-else
        />
      </div>
      <div class="item-text">{{ limitWordLength(item.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] as string) }}</div>
    </div>
    <!-- FreeSpin 入口 -->
    <div
      v-if="isLogin"
      class="cms-item"
      :class="{
        active: currentRoute.name === 'FreeSpin'
      }"
      @click="goToFreeSpin"
    >
      <div class="item-icon-wrapper">
        <q-img :src="memberImg('free_spin_icon.png')" class="default-icon" />
      </div>
      <div class="item-text">{{ $t("menu.freeSpin") }}</div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useEntranceHandler } from "app/template/set_r023/composables/useCms"
import { useSiteRedirect } from "app/template/set_r023/composables/useSiteRedirect"
import { useSiteImg } from "app/template/set_r023/hooks/useSiteImg"
import { MENU } from "app/template/set_r023/utils/constants"
import { createDidRouteResolver, isCmsEntranceActive, useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useAuth } from "src/common/hooks/useAuth"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { FB_SPORTS_PRODUCT_CODE } from "src/common/utils/fbSportsLaunch"
import limitWordLength from "src/common/utils/limitWordLength"
import { useRoute, useRouter } from "vue-router"

const currentRoute = useRoute()
const route = useRoute()
const router = useRouter()
const { handleEntranceClick } = useEntranceHandler()
const { handleSiteRedirect } = useSiteRedirect()
const {
  fliterDisplayDeviceAndLogin,
} = useCms()
const { nowLang } = useLanguage()
const { svgIcon, memberImg } = useSiteImg()
const { isLogin } = useAuth()

const resolveCmsRouteByDid = createDidRouteResolver(MENU.RouterNameMapping)

const isActive = (entrance: any) => {
  return isCmsEntranceActive(entrance, route, resolveCmsRouteByDid)
}

const normalizeDid = (did: string) => {
  return did.replace(/-/g, "_").replace(/[A-Z]/g, "_$&").toLowerCase()
}

const isFBSportsCmsItem = (item: any) => {
  const entrance = item.Entrance?.[0]
  const did = normalizeDid(String(entrance?.payload?.did || ""))
  const productCode = Number(entrance?.payload?.product_code)

  return productCode === FB_SPORTS_PRODUCT_CODE || did === "fb_page"
}

const handleCmsMenuClick = (item: any) => {
  if (isFBSportsCmsItem(item)) {
    handleSiteRedirect({ did: "fb_page" })
    return
  }

  handleEntranceClick({ entrance: item.Entrance[0] })
}

const goToFreeSpin = () => {
  router.push({ name: "FreeSpin" })
}

</script>

<style lang="scss" scoped>
.menu-cms-container {
  @apply flex flex-col gap-[.5rem] mt-4;
  border-top: 1px solid var(--neutral-03);

  .cms-item {
    @apply flex items-center gap-[.5rem] cursor-pointer rounded-[.5rem];
    padding: 0.5rem 0 0.5rem 0.75rem;
    color: var(--primary-02);
    transition: all 0.3s ease;

    &:hover {
      background: var(--neutral-04);
    }

    &.active {
      background: var(--primary-01);
      color: var(--text-01);
    }

    .default-icon,
    .selected-icon {
      @apply w-[1.25rem] h-[1.25rem];
    }
  }
}
</style>
