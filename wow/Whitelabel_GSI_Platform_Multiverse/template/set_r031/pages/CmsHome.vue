<template>
  <div v-if="cmsDetail" class="cms-container">
    <CmsHomeDetail :cms-detail="cmsDetail" />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar"
import { useCms } from "src/common/composables/useCms"
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import CmsHomeDetail from "./Cms/CmsHomeDetail.vue"

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const {
  cmsDetail,
  handleCmsDetail,
} = useCms()

const cmsId = computed(() => Number(route.params.cmsId))

onMounted(async () => {
  $q.loading.show()
  await handleCmsDetail(cmsId.value)
  $q.loading.hide()

  if (cmsDetail.value === undefined) {
    router.push({ path: "/" })
  }
})

watch(cmsId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    location.reload()
  }
})
</script>
