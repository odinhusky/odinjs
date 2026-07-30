<template>
  <div class="button-area" :class="{ isClose: props.isClose }">
    <q-btn class="button-account" align="left" flat no-caps>
      <div class="select-group">
        <img
          class="home-title-icon"
          :src="nowLang ? getFlagImg(nowLang) : svgIcon('language')"
          :alt="nowLang || 'language'"
        />
        <img class="arrow-icon" :class="{ open: isMenuOpen }" :src="svgIcon('arrowDown')" alt="" />
      </div>

      <q-menu v-model="isMenuOpen" anchor="bottom right" self="top right" :offset="[0, 8]" class="language-menu-r027">
        <ul class="account-list">
          <li v-for="(language, index) in languageList" :key="index" class="btn-title">
            <q-btn v-close-popup class="normal-btn" align="left" flat no-caps @click="changeLanguage(language)">
              <img class="home-title-icon" :src="getFlagImg(language)" :alt="language" />
              <span class="btn-label">{{ getLanguageLabel(language) }}</span>
              <q-radio
                style="margin-left: auto !important"
                v-close-popup
                :val="language"
                v-model="nowLang"
                size="xs"
                color="accent"
                @click="changeLanguage(language)"
              />
            </q-btn>
          </li>
        </ul>
      </q-menu>
    </q-btn>
  </div>
</template>

<script lang="ts" setup>
import { useSiteImg } from "app/template/set_r027/hooks/useSiteImg"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { ref } from "vue"
import { useWindowSize } from "@vueuse/core"

const { nowLang, availableLanguages, getFlagImg, setLanguage } = useLanguage()

const languageList = availableLanguages

const { svgIcon } = useSiteImg()
const isMenuOpen = ref(false)
const { width } = useWindowSize()

const props = defineProps({
  isClose: {
    type: Boolean,
    required: false,
    default: () => false
  }
})

function getLanguageLabel(language: string): string {
  return LANGUAGE_TYPE.Labels[language as LANGUAGE_TYPE.Enums] || language
}

function changeLanguage(language: string) {
  setLanguage(language)
}
</script>

<style lang="sass" scoped>
@import "app/template/set_r027/assets/css/_variable.scss"
@import "src/common/css/_variable.sass"

// common style
.button-account
  width: 100%
  min-height: auto
  :deep(.q-btn__content)
    width: 100%
    justify-content: flex-start

.select-group
  width: 100%
  display: flex
  flex-direction: row
  justify-content: flex-start
  align-items: center
  gap: 10px
  .btn-title
    font-size: 13px
    color: $neutral01
    margin-left: 8px
    .q-radio
      pointer-events: none

.home-title-icon
  width: 20px

.arrow-icon
  width: 11px
  height: 6px
  transition: transform 0.2s ease
  transform: rotate(0deg)
  &.open
    transform: rotate(180deg)
.btn-label
  color: $neutral01
  font-family: OpenSans, "PingFang SC", "Microsoft YaHei", D-DIN, Arial, SimHei, Helvetica, sans-serif
  font-weight: 400
  text-overflow: ellipsis
  font-size: 13px
  margin-left: 8px
  font-style: normal
  line-height: normal

.q-btn
  padding: 4px 7px
  width: 100%
  &:before
    box-shadow: none
  &:hover
    background: linear-gradient(90deg, var(--primany-02, #D12D00) 0%, rgba(209, 45, 0, 0.00) 93.97%)
  :deep(.q-btn__content)
    display: flex
    justify-content: flex-start
    height: 100%

.button-area
  border-radius: 12px
  background: transparent
  margin: 0 auto
  overflow: visible
  :deep(.q-btn--rectangle)
    border: 1px solid var(--btn-border-01)
    border-radius: 100px
    padding: 8px 12px
    +phone-width
      padding: 8px 12px
  +setFlex
  flex-direction: column
  &.isClose
    padding-left: 0 !important
    padding-right: 0 !important
    .button-account
      width: 100%
      :deep(.q-btn__content)
        +setFlex
    .select-group
      justify-content: center
      .btn-title
        display: none
    .home-title-icon
      margin: 0 auto

  .account-list
    width: 100%
    margin: 0
    padding: 8px
    list-style: none
  .normal-btn
    position: relative
    cursor: pointer
    display: flex
    width: 100%
    height: auto
    border-top-left-radius: 12px
    border-bottom-left-radius: 12px
    margin: .3rem 0
    margin-left: 0px
    text-transform: none
    img
      color: $secondary02
    &.btn-logout
      display: grid
      background: transparent
      border: 1px solid rgba($secondary02, 0.7)
    &.q-btn
      :deep(.q-btn__content)
        width: 100%
      :deep(.q-radio)
        position: absolute
        right: 0
        margin: 0 3px
        pointer-events: none
</style>

<style lang="sass">
.language-menu-r027
  background: var(--bg-04) !important
  border-radius: 12px
  border: 1px solid var(--bg-line-01)
  color: var(--input-dropdown-text-01)
  max-height: 320px
  overflow-y: auto
  scrollbar-width: none
  -ms-overflow-style: none
  &::-webkit-scrollbar
    display: none
    width: 0
    height: 0
  .q-radio__inner,
  .q-radio__inner.q-radio__inner--truthy,
  .q-radio__inner.q-radio__inner--falsy
    color: #FFFFFF !important
  .q-radio__bg
    border-color: #FFFFFF !important
  .q-icon
    color: #FFFFFF !important
  .q-item
    padding: 8px
    .q-item-section
      padding: 0
</style>
