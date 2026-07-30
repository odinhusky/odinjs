<template>
  <q-card class="no-shadow bg-transparent add_card">
    <!-- 調整樣式成button checkbox -->
    <GameTags itemButtonStyle showSelecAllNextToTitle @update:parentTagValue="handelproductTag" />
    <!-- <SelectAllOptionGroup
      :parent-value="form.product_code_list"
      :group-options="productTag"
      :title="$t('table_header.product_setting')"
      @update:parentValue="handelproductTag"
    />-->
    <q-card-section align="center" class="q-mt-xl">
      <q-btn color="main-color q-px-xl" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useStepper } from "@/hook/useStepper"
  import GameTags from "@/pages/AgencyManagement/AgencyOperationManagement/component/GameTags.vue"
  import SelectAllOptionGroup from "@/components/forms/selectAllOptionGroup.vue"
  import { reactive, defineEmits, computed } from "vue"

  const emits = defineEmits(["step3Submit"])

  const { nextPrevStep } = useStepper()
  const form = reactive({ product_code: [] })
  /*const productTag = computed(() => [
    { label: "WOW", value: 0 },
    { label: "PG", value: 1 },
    { label: "PP", value: 2 },
    { label: "JDB", value: 3 },
    { label: "TB", value: 4 },
    { label: "CQ9", value: 5 }
  ])*/
  const handelproductTag = (value: []) => {
    form.product_code = value
    console.log(form.product_code)
  }
  function onSubmit() {
    emits("step3Submit", form)
  }
</script>
