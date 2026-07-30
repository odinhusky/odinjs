<template>
  <q-card class="no-shadow bg-transparent add_card">
    <!-- 調整樣式成button checkbox -->
    <CurrencyTags itemButtonStyle hideSelectAll showSelecAllNextToTitle @currency-value="currencyValue" />
    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color q-px-xl" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useStepper } from "@/hook/useStepper"
  import CurrencyTags from "@/pages/GeneralAgencyManagement/component/CurrencyTags.vue"
  import { reactive, defineEmits } from "vue"

  const { nextPrevStep } = useStepper()
  const emits = defineEmits(["step2Submit"])
  const form = reactive({ currency_ids: [] })
  const currencyValue = (data: any) => {
    let obj = Object.values(data) as never[]

    console.log(obj, "obj")
    form.currency_ids = obj
  }
  function onSubmit() {
    console.log(form, "form")
    emits("step2Submit", form)
    nextPrevStep(true)
  }
</script>
