<template>
  <q-card class="no-shadow bg-transparent add_card">
    <BlockTags />
    <q-card-section align="center" class="q-mt-xl">
      <q-btn class="q-px-xl" color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md q-px-xl" color="main-color" @click="onSubmit">{{ $t("btn.next_step") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useStepper } from "@/hook/useStepper"
  import BlockTags from "@/pages/InvitationBonus/InvitationBonusSetting/component/BlockTags.vue"
  const { nextPrevStep } = useStepper()

  function onSubmit() {
    nextPrevStep(true)
  }
</script>
