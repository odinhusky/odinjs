<template>
  <q-card class="no-shadow bg-transparent">
    <q-card-section align="center" class="q-pt-lg q-pb-lg">
      <img src="/src/assets/images/common/success.webp" />
    </q-card-section>
    <q-card-section align="center">
      <q-btn color="main-color" outline @click="nextPrevStep(false)">{{ $t("btn.prev_step") }}</q-btn>
      <q-btn class="q-ml-md" color="main-color" @click="onSubmit">{{ $t("step_label.finish") }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue"
  import { useQuasar } from "quasar"
  import { useRouter } from "vue-router"
  import { useI18n } from "vue-i18n"
  import { useStepper } from "@/hook/useStepper"

  const { nextPrevStep } = useStepper()

  const router = useRouter()
  const { t } = useI18n()
  const $q = useQuasar()

  onMounted(() => {})

  const isLoading = ref(false)

  function onSubmit() {
    //isLoading.value = true
    /*
    setTimeout(() => {
      $q.notify({
        type: "positive",
        message: t("message.add_success"),
        position: "top",
        timeout: 300
      })

      router.push({
        name: "MemberList"
      })
    }, 1000)*/
    router.push({
      name: "AgentMemberCommissionSettingList"
    })
  }
</script>
