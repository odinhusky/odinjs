<template>
  <q-file ref="imgFileRef" v-model="imgFile" class="hidden" @update:model-value="handleImgUpload" />
  <div class="avatar-trigger" @click="selectFile">
    <div class="avatar-frame">
      <img :src="getUserAvatar(svgIcon('icon_avatar'))" class="avatar-image" alt="user-avatar" />
    </div>
    <span class="avatar-edit-badge">
      <img :src="svgIcon('avatar-edit-update')" alt="edit-avatar" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue"
import { QFile, useQuasar } from "quasar"
import { useCommon } from "src/common/hooks/useCommon"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useSiteImg } from "app/template/set_r027/hooks/useSiteImg"

const $q = useQuasar()
const { convertToBase64 } = useCommon()
const { setUserAvatar, getUserAvatar } = useUserInfo()
const { svgIcon } = useSiteImg()

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

<style scoped lang="scss">
.avatar-trigger {
  position: relative;
  display: flex;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
}

.avatar-frame {
  width: 100%;
  height: 100%;
  padding: 2px;
  border-radius: 999px;
  background: linear-gradient(180deg, #765c19 0%, #fcefcf 45.67%, #f2b519 63.94%, #765c19 100%);
}

.avatar-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.avatar-edit-badge {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(180deg, #765c19 0%, #fcefcf 45.67%, #f2b519 63.94%, #765c19 100%);
}

.avatar-edit-badge::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: var(--bg-08);
}

.avatar-edit-badge img {
  position: relative;
  z-index: 1;
  width: 7.8px;
  height: 7.8px;
  object-fit: contain;
}
</style>
