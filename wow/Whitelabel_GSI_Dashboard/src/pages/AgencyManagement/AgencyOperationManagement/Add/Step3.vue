<template>
  <q-card class="no-shadow bg-transparent add_card">
    <!-- 調整樣式成button checkbox -->
    <GameTags itemButtonStyle showSelecAllNextToTitle v-model="localForm" />
    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color q-px-xl" outline @click="onCancel">{{ $t("btn.cancel") }}</q-btn>
      <q-btn color="main-color q-ml-md q-px-xl" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useStepper } from "@/hook/useStepper"
  import GameTags from "@/pages/AgencyManagement/AgencyOperationManagement/component/GameTags.vue"
  import { reactive, defineEmits, ref, watch } from "vue"

  const emits = defineEmits(["step3Submit", "update:modelValue", "onCancel"])

  const { nextPrevStep } = useStepper()
  const form = reactive({ product_code: [] })
  function onSubmit() {
    emits("step3Submit", form)
  }

  const onCancel = () => {
    emits("onCancel")
  }

  const props = defineProps<{ modelValue: any }>()
  const localForm = ref({ ...props.modelValue })
  watch(
    localForm,
    (newVal) => {
      emits("update:modelValue", newVal)
    },
    { deep: true }
  )
</script>
