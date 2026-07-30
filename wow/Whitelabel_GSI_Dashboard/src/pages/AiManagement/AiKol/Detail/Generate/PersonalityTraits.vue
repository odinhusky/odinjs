<script setup lang="ts">
  import { computed, nextTick, ref, watch, onMounted } from "vue"
  import { useImage } from "@/hook/useImage"
  import { useKolStore } from "src/stores/kol"

  import LabelBasicSetting from "./components/LabelBasicSetting.vue"
  import LabelLifeStyle from "./components/LabelLifeStyle.vue"
  import LabelProhibit from "./components/LabelPostSetting.vue"

  interface ScrollableSection {
    scrollEl: HTMLDivElement | null
  }

  const { svgImg } = useImage()
  const emits = defineEmits(["updateHeight"])
  const basicSettingRef = ref<ScrollableSection>({ scrollEl: null })
  const lifeStyleRef = ref<ScrollableSection>({ scrollEl: null })
  const prohibitRef = ref<ScrollableSection>({ scrollEl: null })
  const stepsRef = ref<HTMLElement | null>(null) // ✅ 綁在步驟列上
  const finalStepValue = ref(false)
  const createKolId = ref(0)

  const tabs = [
    {
      label: "services.virtualKOL.management_basic_settings",
      value: "basic"
    },
    { label: "services.virtualKOL.management_style_traits", value: "life" },
    { label: "services.virtualKOL.management_post_settings", value: "post" }
  ]

  const active = ref("basic")
  const activeIndex = ref(0)
  const kolStore = useKolStore()

  const handleStepClick = (index: number) => {
    activeIndex.value = index
    if (tabs[index]) {
      active.value = tabs[index].value
    }

    nextTick(() => {
      // 1. 子元件滾回頂部（假設有 expose 出 scrollEl）
      basicSettingRef.value?.scrollEl?.scrollTo?.({ top: 0, behavior: "smooth" })
      lifeStyleRef.value?.scrollEl?.scrollTo?.({ top: 0, behavior: "smooth" })
      prohibitRef.value?.scrollEl?.scrollTo?.({ top: 0, behavior: "smooth" })

      // 2. 將畫面滾動回步驟列（q-stepper）位置
      stepsRef.value?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })

      // 3. 整體滾回頂部
      window.scrollTo({
        top: 0,
        behavior: "smooth" // 平滑滾動效果
      })
    })
  }

  const randomText = computed(() => {
    switch (active.value) {
      case "basic": {
        return $t("services.virtualKOL.management_random_basic_info")
      }
      case "life": {
        return $t("services.virtualKOL.management_random_style_traits")
      }
      case "post": {
        return $t("services.virtualKOL.management_random_post_settings")
      }
      default: {
        return $t("services.virtualKOL.management_random_generate")
      }
    }
  })

  const activeTab = computed(() => {
    return tabs.find((tab) => tab.value === active.value)
  })

  const useRandomKolInfo = () => {
    kolStore.useRandomKolInfo(active.value as "basic" | "life" | "post")
  }

  const createResult = (item: { status: boolean; id?: number }) => {
    finalStepValue.value = item.status
    if (item.status && item.id) {
      createKolId.value = item.id
    }
    handleStepClick(activeIndex.value + 1)
  }

  watch(
    () => active.value,
    (nvl) => {
      emits("updateHeight", nvl)
    }
  )

  onMounted(() => {
    kolStore.$reset()
  })
</script>

<template>
  <div class="max-w-[63.75rem] mx-auto">
    <div class="font-[NotoSansTC] font-bold text-[1.875rem] leading-[3.75rem] text-[#535252] text-center">
      {{ $t(activeTab?.label || "") }}
    </div>

    <q-stepper
      v-model="activeIndex"
      ref="stepperRef"
      flat
      alternative-labels
      animated
      class="bg-transparent"
      color="main-color"
      header-class="q-mx-auto no-wrap stepperHeaderWrapper"
    >
      <q-step
        v-for="(tab, index) in tabs"
        :key="tab.value"
        :name="index"
        title=""
        :prefix="index + 1"
        :done="activeIndex >= index + 1"
        contracted
      >
        <!--  -->
        <div v-if="active === 'basic' || active === 'life'" class="flex items-center justify-between mb-[.625rem]">
          <q-btn @click="useRandomKolInfo" class="btn-random">
            {{ randomText }}
          </q-btn>
          <div v-if="active === 'life'" class="rounded py-[.375rem] px-3 bg-[#FCF6EC] border border-[#E6A23C]">
            <div class="font-[NotoSansTC] font-normal text-[.875rem] leading-[1.0625rem] text-[#E6A23C]">
              {{ $t("services.virtualKOL.management_style_tips") }}
            </div>
          </div>
        </div>

        <div v-show="tab.value === 'basic'" ref="basicSettingRef">
          <LabelBasicSetting @next-step="handleStepClick(activeIndex + 1)" />
        </div>
        <div v-show="tab.value === 'life'" ref="lifeStyleRef">
          <LabelLifeStyle @prev-step="handleStepClick(activeIndex - 1)" @next-step="handleStepClick(activeIndex + 1)" />
        </div>
        <div v-show="tab.value === 'post'" ref="prohibitRef">
          <LabelProhibit @prev-step="handleStepClick(activeIndex - 1)" @create-result="createResult" />
        </div>
      </q-step>
      <q-step :name="3" title="" prefix="3" :done="activeIndex >= 3" contracted>
        <div class="flex flex-col items-center justify-center gap-[1.875rem]">
          <template v-if="finalStepValue">
            <q-img :src="svgImg('success')" loading="lazy" class="w-[12.5rem] h-[12.5rem]"></q-img>
            <q-btn class="btn-ending" :to="{ name: 'MyKols', query: { kol_id: createKolId } }">前往KOL</q-btn>
          </template>
          <template v-else>
            <q-img :src="svgImg('fail')" loading="lazy" class="w-[12.5rem] h-[12.5rem]"></q-img>
            <q-btn class="btn-ending" @click="handleStepClick(0)">返回設定</q-btn>
          </template>
        </div>
      </q-step>
    </q-stepper>
    <!-- <q-btn @click="handleStepClick(activeIndex - 1)">prev</q-btn>
    <q-btn @click="handleStepClick(activeIndex + 1)">next</q-btn> -->
  </div>
</template>

<style lang="scss" scoped>
  :deep(.q-stepper__content) {
    margin-top: 1.25rem;

    .q-stepper__step-inner {
      padding: 0;
      padding-bottom: 2px;
    }
  }
  :deep(.stepperHeaderWrapper) {
    margin-top: 1.25rem;
    max-width: 37.5rem;
    width: 100%;

    .q-stepper__tab {
      min-height: auto;
      padding: 0;
    }

    .q-stepper__dot {
      width: 1.875rem;
      min-width: 1.875rem;
      height: 1.875rem;
    }
  }
  .btn-random {
    @apply rounded py-[.3125rem] px-4 bg-[#409EFF] min-h-8;

    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white capitalize;
    }
  }
  .btn-ending {
    @apply rounded py-[.3125rem] px-4 bg-[#409EFF] min-h-8  w-[18.75rem];

    :deep(.q-btn__content) {
      @apply font-[NotoSansTC] font-medium text-[.875rem] leading-[1.0625rem] text-white capitalize;
    }
  }
</style>
