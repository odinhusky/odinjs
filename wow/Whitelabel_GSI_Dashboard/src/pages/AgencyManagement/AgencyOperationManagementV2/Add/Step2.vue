<template>
  <q-card class="no-shadow bg-transparent add_card">
    <!-- 調整樣式成button checkbox -->
    <CurrencyTags itemButtonStyle hideSelectAll showSelecAllNextToTitle v-model="localForm" />
    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color q-px-xl" outline @click="onCancel">{{ $t("btn.cancel") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color q-px-xl" outline @click="nextPrevStep(false)">{{
        $t("btn.prev_step")
      }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useStepper } from "@/hook/useStepper"
  import CurrencyTags from "@/pages/AgencyManagement/AgencyOperationManagement/component/CurrencyTags.vue"
  import { defineEmits, ref, watch } from "vue"

  const { nextPrevStep } = useStepper()
  function onSubmit() {
    nextPrevStep(true)
  }

  const props = defineProps<{ modelValue: any }>()
  const emit = defineEmits(["update:modelValue", "onCancel"])

  const onCancel = () => {
    emit("onCancel")
  }

  const localForm = ref({ ...props.modelValue })
  watch(
    localForm,
    (newVal) => {
      emit("update:modelValue", newVal)
    },
    { deep: true }
  )
</script>
