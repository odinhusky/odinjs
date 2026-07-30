<template>
  <div>
    <q-btn @click="toggleNotification" :ripple="false" unelevated text-color="white" size="md" class="q-pa-sm sound">
      <q-icon v-if="notificationStatus" name="volume_up" />
      <q-icon v-else name="volume_off" />
    </q-btn>
    <audio ref="audioRef" :src="getAudioSrc()"></audio>
    <audio ref="wariningAudioRef" :src="warining"></audio>
  </div>
</template>

<script setup lang="ts">
  import { getPendingTransactions } from "@/api/common"
  import { getWariningAlert } from "@/api/warningSetting"
  import { onMounted, ref, watch } from "vue"
  import { useLanguageStore } from "src/stores/languageStore"
  import { ERROR_CODE } from "@/utils/constants"
  import zhAudio from "src/assets/audio/zh.mp3"
  import enAudio from "src/assets/audio/en.mp3"
  import warining from "src/assets/audio/warining.mp3"

  import { useNotifyStore } from "@/stores/notifyStore"
  import { useAIHelperEvent } from "@/hook/useAIHelperEvent"
  import { useEnv } from "src/hook/useEnv"
  import { AI_HELPER_EVENT, PERMISSION } from "@/utils/constants"
  import { useWarningNotifyStore } from "@/stores/warningNotifyStore"
  import { useSearch } from "@/hook/useSearch"
  import { usePermissionStore } from "src/stores/permissionStore"

  const { isAgentMode } = useEnv()
  const { updateNewPendingTransactions } = useNotifyStore()
  const { postAIHelperIframeEvent } = useAIHelperEvent()
  const { updateWarningStatue } = useWarningNotifyStore()
  const permissionStore = usePermissionStore()

  const audioRef = ref()
  const wariningAudioRef = ref()

  const notificationStatus = ref(true)
  const languageStore = useLanguageStore()
  let audioTiimer: any
  let waringAudioTiimer: any
  const timerSec = 5 * 60 * 1000
  const warningTimerSec = 3 * 60 * 1000
  const toggleNotification = () => {
    notificationStatus.value = !notificationStatus.value
  }

  const getAudioSrc = () => {
    if (languageStore.currentLanguage.includes("zh")) {
      return zhAudio
    } else {
      return enAudio
    }
  }

  const start = () => {
    if (isAgentMode) {
      getNotification()
      audioTiimer = setInterval(getNotification, timerSec)
      waringAudioTiimer = setInterval(getWarningNotification, warningTimerSec)
    }
  }

  const cancel = () => {
    clearInterval(audioTiimer)
    clearInterval(waringAudioTiimer)
    try {
      audioRef.value.pause()
      wariningAudioRef.value.pause()
    } catch (error) {}
  }

  const getNotification = async () => {
    const { data } = await getPendingTransactions()

    if (data.pending_deposit_count > 0 || data.pending_withdraw_count > 0) {
      postAIHelperIframeEvent({ event: AI_HELPER_EVENT.Enums.DW_REVIEW })
      audioRef.value.play()
      updateNewPendingTransactions(true) // 更新狀態
    }
  }

  const getWarningNotification = async () => {
    const targetId = PERMISSION.Enums.A_F_WARNING_SETTINGS

    const hasPermission = Object.values(permissionStore.permission).some((arr: any) =>
      arr.some((item: any) => item.id === targetId)
    )
    if (hasPermission) {
      try {
        const response = await getWariningAlert()
        if (response.code === ERROR_CODE.Enums.SUCCESS) {
          const tableData = response.data?.list || response.data || []
          const result = tableData.alert_list
            .filter((item: { is_alert: boolean }) => item.is_alert)
            .map((item: { setting_id: number }) => item.setting_id)
          updateWarningStatue(result)
          if (result.length > 0) {
            wariningAudioRef.value.play()
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  watch(
    () => notificationStatus.value,
    (value) => {
      if (value) {
        start()
      } else {
        cancel()
      }
    }
  )

  onMounted(async () => {
    start()
  })
</script>

<style lang="scss">
  .sound {
    border-radius: 8px;
    width: 26px;
    height: 26px;
    min-height: unset;
    background: rgba(148, 192, 254, 1) !important;
    i {
      font-size: 16px !important;
      line-height: 0px;
      height: unset !important;
    }
  }
</style>
