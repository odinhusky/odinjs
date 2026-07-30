<template>
  <section v-if="cmsDetail" class="cms-home-wrapper">
    <template v-if="isLargeTablet">
      <HeaderTitleBack variant="setR022">
        <template #middle>
          <h2 class="title">
            {{ cmsDetail.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
          </h2>
        </template>
        <CmsHomeDetail :cmsDetail="cmsDetail" />
        <FooterArea />
      </HeaderTitleBack>
    </template>
    <template v-else>
      <CmsHomeDetail :cmsDetail="cmsDetail" />
    </template>
  </section>
</template>

<script setup lang="ts">
import FooterArea from "app/template/set_r032/components/Footer/Index.vue"
import CmsHomeDetail from "app/template/set_r032/pages/HomePage/CMS/CmsHomeDetail.vue"
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { useMediaQuery } from "src/common/hooks/useMediaQuery"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const {
  cmsDetail,
  handleCmsDetail,
} = useCms()
const $q = useQuasar()
const router = useRouter()
const { isLargeTablet } = useMediaQuery()

const { nowLang } = useLanguage()

const cmsId = computed(() => Number(route.params.cmsId))

watch(cmsId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    location.reload()
  }
})

onMounted(async () => {
  $q.loading.show()
  await handleCmsDetail(cmsId.value)
  $q.loading.hide()

  if (cmsDetail.value === undefined) {
    router.push({ path: "/" }) // 跳轉到首頁
  }
})
</script>

<style lang="scss" scoped>
@import "src/common/css/_variable.sass";
@import "app/template/set_r032/assets/css/_variable.scss";

.cms-home-wrapper {
  @apply w-full mx-auto flex flex-col;
  @apply max-w-[87.5rem] py-[1.875rem];

  @include pad-large-width {
    @apply px-[.625rem];
  }
}
</style>
