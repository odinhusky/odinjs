<template>
  <div class="bg-white text-center q-py-md stepperLabelWrapper q-pt-xl h1-bold bold">
    {{
      stepLabelsI18nKey && stepLabelsI18nKey[selector - 1]
        ? $t(stepLabelsI18nKey[selector - 1])
        : $t("common.step_num", { num: selector })
    }}
  </div>

  <q-stepper
    v-model="selector"
    ref="stepperRef"
    flat
    alternative-labels
    animated
    class="bg-transparent"
    color="main-color"
    :vertical="$q.platform.is.mobile"
    header-class="q-mx-auto no-wrap stepperHeaderWrapper"
  >
    <q-step
      v-for="(slot, slotName, index) in slots"
      :key="slotName"
      :name="index + 1"
      title=""
      :prefix="index + 1"
      :done="selector >= index + 1"
      contracted
    >
      <!-- 步驟概述 -->
      <h6 v-if="stepTipsI18nKey && stepTipsI18nKey[index]" class="text-h6 q-my-none text-center stepperTipWrapper">
        {{ $t(stepTipsI18nKey[index]) || "" }}
      </h6>

      <!-- 步驟元件 -->
      <component v-if="selector === index + 1" :is="slot" />
    </q-step>
  </q-stepper>
</template>

<script lang="ts" setup>
  import { useSlots, defineProps, ref, onMounted, onUnmounted, computed } from "vue"
  import { useQuasar } from "quasar"
  import { injectStrict } from "@/utils/injectTyped"
  import { EventBusKey } from "@/symbols"
  import { useStepper } from "@/hook/useStepper"

  const eventbus = injectStrict(EventBusKey)
  const $q = useQuasar()

  const slots = useSlots()
  const props = defineProps({
    stepLabelsI18nKey: {
      type: Array<string>,
      required: false,
      default: () => []
    },
    stepTipsI18nKey: {
      type: Array<string>,
      required: false,
      default: () => []
    }
  })

  const stepperRef = ref()
  const { selector } = useStepper()

  onMounted(() => {
    eventbus.on("nextPrevSteps", (arrow) => {
      arrow ? stepperRef.value.next() : stepperRef.value.previous()
    })
  })

  onUnmounted(() => {
    eventbus.off("nextPrevSteps")
  })
</script>

<style lang="scss" scoped>
  @import "@/css/stepper.scss";
</style>
