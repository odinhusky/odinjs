<script setup lang="ts">
import { toCmsCustomPageRoute } from "@shared-lib/constants/routePath"

const { setting, isLoading } = useSetting()
const router = useRouter()

// 若後台設定了 CMS 首頁，則重新導向至對應的自定義頁面
watchEffect(() => {
  if (isLoading.value) return
  if (setting.value?.homepage_cms_id) {
    router.replace(toCmsCustomPageRoute(setting.value.homepage_cms_id))
  }
})
</script>

<template>
  <div>
    <!-- 設定載入中或準備重導向時不顯示預設首頁，避免閃爍 -->
    <HomeView v-if="!isLoading && !setting?.homepage_cms_id" />
  </div>
</template>
