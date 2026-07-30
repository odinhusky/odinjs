<template>
  <BasicSetting v-if="myKols.length" ref="basicSettingRef" :list="myKols" :is-show-generate-post-btn="true" />
  <NoData v-else />
</template>

<script setup lang="ts">
  import { onMounted, ref, nextTick } from "vue"
  import { useRoute } from "vue-router"
  import { useAIKol } from "src/composables/useAIKol"
  import BasicSetting from "../components/BasicSetting.vue"
  import NoData from "../components/NoData.vue"

  const route = useRoute()
  const { myKols, getMyKols } = useAIKol()

  type ChildExpose = {
    openDialog: (i: number) => void
  }

  const basicSettingRef = ref<ChildExpose | null>(null)

  onMounted(async () => {
    await getMyKols()

    if (myKols.value.length) {
      await nextTick()
      const kolId = Number(route.query.kol_id)

      const kolIndex = myKols.value.findIndex((e) => e.id === kolId)

      if (kolIndex >= 0 && basicSettingRef.value) {
        basicSettingRef.value.openDialog(kolIndex)
      }
    }
  })
</script>
