<template>
  <q-card class="no-shadow bg-transparent add_card">
    <q-card-section align="center" class="q-pt-lg q-pb-lg">
      <img src="~assets/images/common/success.webp" />
    </q-card-section>
    <q-card-section align="center">
      <q-btn class="q-px-xl" color="main-color" @click="onSubmit">{{ $t("step_label.finish") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { useRouter } from "vue-router"
  import { onMounted } from "vue"

  const router = useRouter()

  function onSubmit() {
    router.push({
      name: "BackofficeAccountList"
    })
  }
  onMounted(() => {})
</script>
