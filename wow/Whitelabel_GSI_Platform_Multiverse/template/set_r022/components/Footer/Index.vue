<template>
  <footer class="flex footer-wrapper">
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
            class="w-[6rem] h-auto object-contain"
          />
        </li>
      </ul>
    </div>
    <div v-if="cmsFooterTextContent?.content" class="mx-auto mt-4 text-content-wrapper">
      <div class="content cms-content" v-html="cmsFooterTextContent?.content"></div>
    </div>
  </footer>
  <div class="footer-wrapper">
    <FooterNav />
  </div>
</template>

<script lang="ts" setup>
import { useCms } from "src/common/composables/useCms"

import { useSiteImg } from "../../hooks/useSiteImg"
import FooterNav from "./FooterNav.vue"

const { setDefaultProductTabImg } = useSiteImg()
const {
  cmsFooterLogos,
  cmsFooterTextContent,
} = useCms()

</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r022/assets/css/_variable.scss";

footer.footer-wrapper {
  padding: 2.5rem;

  @include pad-large-width {
    padding: 1.25rem 1rem;
    padding-bottom: 10vw;
  }

  @include iphone-width {
    padding-bottom: 25vw;
  }
}

.footer-wrapper {
  width: 100%;
  background: var(--secondary-04);
  color: var(--primary-04);

  @include pad-width {
    .q-size {
      font-size: 0.9vw;
      padding: 0;
    }
  }

  @include pad-large-width {
    height: auto;
    flex-direction: column;
    position: relative;

    .footer_left {
      margin: 0 0;
      width: 100%;
    }
  }

  .logo-list-wrapper,
  .text-content-wrapper {
    width: 90%;
    max-width: 87.5rem;
  }

  .logo-list-wrapper {
    .provider-item {
      @include iphone-width {
        flex: 0 0 25%;
        padding: 0;
        margin-bottom: 1rem;

        img {
          width: 4.5rem;
        }
      }
    }
  }

  .text-content-wrapper {
    .content {
      width: 100%;
    }
  }
}
</style>
