<template>
  <div class="cms-container">
    <template v-if="cmsDetail">
      <CmsHomeDetail :cms-detail="cmsDetail" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import CmsHomeDetail from "./Cms/CmsHomeDetail.vue"

const route = useRoute()
const {
  cmsDetail,
  handleCmsDetail,
} = useCms()
const $q = useQuasar()
const router = useRouter()

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
