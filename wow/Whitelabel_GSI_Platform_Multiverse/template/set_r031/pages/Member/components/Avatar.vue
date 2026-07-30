<template>
  <q-file ref="imgFileRef" v-model="imgFile" class="hidden" @update:model-value="handleImgUpload" />
  <div class="relative cursor-pointer flex justify-center" @click="selectFile">
    <q-avatar size="5.5rem" class="border-2 border-[var(--bg-line-01)]">
      <img :src="getUserAvatar(svgIcon('icon_avatar'))" class="object-cover" />
    </q-avatar>
    <img v-if="!hasAvatar" :src="svgIcon('avatat-edit')" class="absolute bottom-0 right-0 w-6 h-6" />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from "vue"
import { QFile, useQuasar } from "quasar"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/set_r031/hooks/useSiteImg"

const $q = useQuasar()
const { convertToBase64 } = useCommon()
const { setUserAvatar, getUserAvatar, userInfo, userInfo2, accountInfo } = useUserInfo()
const { svgIcon } = useSiteImg()

const hasAvatar = computed(() => {
  return !!(userInfo.value.avatar_path || userInfo2.value.avatar_path || accountInfo.value.avatar_path)
})

const imgFileRef = ref() as Ref<QFile>
const imgFile = ref<File>()

const selectFile = () => {
  imgFileRef.value.pickFiles()
}

const handleImgUpload = async () => {
  if (imgFile.value) {
    const { status, data, msg } = await convertToBase64(imgFile.value)
    if (!status) {
      $q.notify({
        type: "negative",
        position: "top",
        message: msg,
        icon: "warning",
        timeout: 1000
      })
      return
    }
    if (data) {
      await setUserAvatar(data)
      imgFile.value = undefined
    }
  }
}
</script>

<style scoped lang="scss"></style>
