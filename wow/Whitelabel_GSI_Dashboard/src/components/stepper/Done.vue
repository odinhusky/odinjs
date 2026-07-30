<template>
  <q-card class="no-shadow bg-transparent">
    <q-card-section align="center" class="q-pt-lg q-pb-lg">
      <img :src="successIcon()" />
    </q-card-section>
    <q-card-section align="center">
      <q-btn color="main-color" class="edit_btns" outline @click="nextPrevStep(false)" v-if="showPrev">{{
        $t("btn.prev_step")
      }}</q-btn>
      <q-btn class="q-ml-md edit_btns" color="main-color" @click="onSubmit">{{ $t("step_label.finish") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { defineProps, onMounted } from "vue"
  import { useStepper } from "@/hook/useStepper"
  import { useImage } from "@/hook/useImage"

  const { nextPrevStep } = useStepper()
  const { successIcon } = useImage()

  const props = defineProps({
    successFunc: {
      type: [Function],
      required: true,
      default: () => {}
    },
    labelTipI18nKey: {
      type: [String],
      required: false,
      default: () => "step_label.finish"
    },
    showPrev: {
      type: [Boolean],
      required: false,
      default: () => true
    }
  })

  onMounted(() => {})

  function onSubmit() {
    !!props.successFunc && props.successFunc()
  }
</script>
