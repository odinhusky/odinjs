<template>
  <div>
    <audio ref="audioRef" :src="getAudioSrc()"></audio>
  </div>
</template>

<script setup lang="ts">
  import { getWariningAlert } from "@/api/warningSetting"
  import { onMounted, ref, watch } from "vue"
  import warining from "src/assets/audio/warining.mp3"
  import { useWarningNotifyStore } from "@/stores/warningNotifyStore"
  import { useSearch } from "@/hook/useSearch"
  import { usePermissionStore } from "src/stores/permissionStore"
  import { PERMISSION } from "src/utils/constants"

  const permissionStore = usePermissionStore()

  const { updateWarningStatue } = useWarningNotifyStore()

  const audioRef = ref()
  const notificationStatus = ref(true)
  let audioTiimer: any
  const timerSec = 2 * 60 * 1000
  const getAudioSrc = () => {
    return warining
  }

  const start = () => {
    getNotification()
    audioTiimer = setInterval(getNotification, timerSec)
  }

  const cancel = () => {
    clearInterval(audioTiimer)

    try {
      audioRef.value.pause()
    } catch (error) {}
  }

  const getNotification = async () => {
    const targetId = PERMISSION.Enums.A_F_WARNING_SETTINGS

    const hasPermission = Object.values(permissionStore.permission).some((arr: any) =>
      arr.some((item: any) => item.id === targetId)
    )
    if (hasPermission) {
      const { search, status, tableData } = useSearch(getWariningAlert)
      await search()
      if (status.value) {
        const result = tableData.value.alert_list
          .filter((item: { is_alert: boolean }) => item.is_alert)
          .map((item: { setting_id: number }) => item.setting_id)
        updateWarningStatue(result)
        if (result.length > 0) {
          //audioRef.value.play()
        }
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
