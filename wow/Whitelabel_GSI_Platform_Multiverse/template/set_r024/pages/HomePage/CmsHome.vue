<template>
  <div v-if="cmsDetail" class="cms-container">
    <template v-if="$q.platform.is.mobile">
      <HeaderTitleBack variant="blueOrange">
        <template #middle>
          <h2 class="title">
            {{ cmsDetail.Setting.lang[nowLang as LANGUAGE_TYPE.Enums] }}
          </h2>
        </template>
        <CmsHomeDetail :cms-detail="cmsDetail" />
        <FooterNav />
      </HeaderTitleBack>
    </template>
    <template v-else>
      <CmsHomeDetail :cms-detail="cmsDetail" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import HeaderTitleBack from "src/common/components/modal/HeaderTitleBack.vue"
import { useCms } from "src/common/composables/useCms"
import { useLanguage } from "src/common/composables/useLanguage"
import { LANGUAGE_TYPE } from "src/common/utils/constants"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import FooterNav from "../../components/Footer/FooterNav.vue"
import CmsHomeDetail from "./Cms/CmsHomeDetail.vue"

const route = useRoute()
const {
  cmsDetail,
  handleCmsDetail,
} = useCms()
const $q = useQuasar()
const router = useRouter()

const { nowLang } = useLanguage()

const cmsId = computed(() => Number(route.params.cmsId))

onMounted(async () => {
  $q.loading.show()
  await handleCmsDetail(cmsId.value)
  $q.loading.hide()

  if (cmsDetail.value === undefined) {
    router.push({ path: "/" }) // 跳轉到首頁
  }
})
watch(cmsId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    location.reload()
  }
})
</script>
