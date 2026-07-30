<template>
  <div class="p-5">
    <div class="pl-5 flex items-center">
      <div
        v-for="tabItem in tabs"
        :key="tabItem.value"
        class="px-4 py-2 rounded-tl-[.25rem] rounded-tr-[.25rem] bg-[#F0F2F5] font-[NotoSansTC] font-normal text-[.875rem] leading-[1.0625rem] text-[#6B6B6B] cursor-pointer"
        :class="{ '!bg-white !font-medium !text-[#086EFF]': panel === tabItem.value }"
        @click="panel = tabItem.value"
      >
        {{ $t(tabItem.label) }}
      </div>
    </div>
    <q-tab-panels v-model="panel" animated class="bg-white rounded-[.625rem] shadow-[0_0_16px_0_#0000001a]">
      <q-tab-panel :name="TabPanel.IMAGE_FEATURES" class="p-5 !min-h-[calc(100vh-220px)] flex">
        <ImageFeatures />
      </q-tab-panel>

      <q-tab-panel :name="TabPanel.PERSONALITY_TRAITS" class="p-5 !min-h-[calc(100vh-220px)]">
        <PersonalityTraits />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue"
  import ImageFeatures from "./ImageFeatures.vue"
  import PersonalityTraits from "./PersonalityTraits.vue"

  enum TabPanel {
    IMAGE_FEATURES = "ImageFeatures",
    PERSONALITY_TRAITS = "PersonalityTraits"
  }
  const tabs = [
    {
      value: TabPanel.IMAGE_FEATURES,
      label: "menu.image_features"
    },
    {
      value: TabPanel.PERSONALITY_TRAITS,
      label: "menu.personality_traits"
    }
  ]
  const panel = ref(TabPanel.IMAGE_FEATURES)
</script>

<style scoped lang="scss"></style>
