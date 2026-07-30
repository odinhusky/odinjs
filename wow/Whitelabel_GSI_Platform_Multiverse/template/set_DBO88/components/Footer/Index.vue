<template>
  <footer class="flex footer-wrapper">
    <div v-if="cmsFooterLogos && cmsFooterLogos.length" class="mx-auto logo-list-wrapper">
      <ul class="provider-list flex-wrap !gap-0">
        <li
          class="provider-item py-1 phone:py-2 px-[.625rem] phone:px-[1.5625rem]"
          v-for="item in cmsFooterLogos"
          :key="item"
        >
          <img :src="item" :alt="item.toString()" class="w-[7.5rem] h-auto object-contain" />
        </li>
      </ul>
    </div>
    <div v-if="cmsFooterTextContent?.content" class="mx-auto mt-4 text-content-wrapper">
      <div class="content cms-content" v-html="cmsFooterTextContent?.content"></div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useCms } from "src/common/composables/useCms"

const {
  cmsFooterLogos,
  cmsFooterTextContent,
} = useCms()

</script>

<style lang="scss">
.logo-list-wrapper {
  @apply my-4;
  .provider-list {
    @apply flex items-center justify-center gap-3;
    .provider-item {
    }
  }
}
</style>

<style lang="sass" scoped>
@import "src/common/css/_variable.sass"
@import "app/template/set_DBO88/assets/css/_variable.scss"

footer.footer-wrapper
  padding: 2.5rem
  padding-bottom: 6rem
  +phone-width
    padding: 1.25rem 1rem
    padding-bottom: 80px

.footer-wrapper
  width: 100%
  background: $footer-bg
  color: $footer-text
  .text-content-wrapper
    .content
      width: 100%

// common style
.btn-common
  margin: 0vw
  img
    width: 1.2vw
// layout style
.layout-main
  position: relative
  height: 100vh
  .hm-content
    width: calc(100% - 225px)
    height: 100%
    position: relative
    background-color: #24262B
    display: table
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    margin-left: 225px
    transition: width 0.2s ease 0s
    &.isClose
      width: 100%
      margin-left: 0
    .inner-content
      width: 100%
      height: 100%
      &.mobile
        width: 100%
      .page-layout
        height: 100vh
        overflow-y: auto
      +pad-width
        width: 100%
      +iphone-width
        .page-layout
          padding-bottom: 0
</style>
