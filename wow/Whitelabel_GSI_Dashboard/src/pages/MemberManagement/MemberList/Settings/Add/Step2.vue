<template>
  <q-card class="no-shadow bg-transparent add_card" style="width: 900px">
    <q-card-section>
      <span class="q-ml-sm">{{ $t("common.tag_choice") }}</span>
      <div class="row q-col-gutter-md q-pt-xs">
        <div class="col-12">
          <memberTagOption :parent-value="memberAddForm.label" @update:labelValue="handelBlockTags" />
        </div>
      </div>
    </q-card-section>
    <q-card-section align="center">
      <q-btn color="main-color" outline @click="nextPrevStep(false)" class="edit_btns">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md edit_btns" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useStepper } from "@/hook/useStepper"
  import { useMember } from "src/composables/useMember"
  import memberTagOption from "@/components/forms/memberTagOption.vue"

  const { nextPrevStep } = useStepper()
  const { memberAddForm, handleAddMemberAccount } = useMember()

  const handelBlockTags = (value: []) => {
    memberAddForm.value.label = value
  }

  async function onSubmit() {
    const { status } = await handleAddMemberAccount()
    if (status) {
      nextPrevStep(true)
    }
  }
</script>
