<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md">{{ $t("menu.cache_clear") }}</div>
    <q-card flat bordered class="q-pa-lg" style="max-width: 480px">
      <!-- 此站點 ID（當前登入代理）-->
      <div class="row items-center q-mb-lg">
        <span class="text-subtitle2 text-grey-8 q-mr-sm">{{ $t("cache_clear.site_id") }}：</span>
        <span class="text-weight-bold">{{ agentCode || "-" }}</span>
      </div>

      <!-- 前台緩存 -->
      <div class="row items-center q-mb-md">
        <span class="q-mr-md" style="min-width: 6rem">{{ $t("cache_clear.frontend") }}</span>
        <q-btn
          color="primary"
          no-caps
          :label="$t('btn.clean_cache')"
          :loading="clearing === 'frontend'"
          :disable="!permission.edit"
          @click="onClear('frontend')"
        />
      </div>

      <!-- 後台緩存 -->
      <div class="row items-center">
        <span class="q-mr-md" style="min-width: 6rem">{{ $t("cache_clear.backend") }}</span>
        <q-btn
          color="primary"
          no-caps
          :label="$t('btn.clean_cache')"
          :loading="clearing === 'backend'"
          :disable="!permission.edit"
          @click="onClear('backend')"
        />
      </div>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from "vue"
  import { useI18n } from "vue-i18n"
  import { useQuasar } from "quasar"
  import { clearAgentCache } from "@/api/cacheManagement"
  import { useSiteStore } from "@/stores/siteStore"
  import { usePermission } from "@/hook/usePermission"

  const { t } = useI18n()
  const $q = useQuasar()
  const siteStore = useSiteStore()
  const { permission } = usePermission()

  const agentCode = siteStore.agent_code
  const clearing = ref<"" | "frontend" | "backend">("")

  function onClear(cacheType: "frontend" | "backend") {
    if (!permission.value.edit) return
    $q.dialog({
      title: t("btn.tip"),
      message: t("message.confirm_clear_cache"),
      cancel: { label: t("btn.cancel"), color: "primary", flat: true },
      ok: { label: t("btn.confirm"), color: "primary" }
    }).onOk(() => execClear(cacheType))
  }

  async function execClear(cacheType: "frontend" | "backend") {
    clearing.value = cacheType
    const res = await clearAgentCache(cacheType)
    if (res.code === 0) {
      $q.notify({ type: "positive", message: t("message.success"), position: "top", timeout: 300 })
    } else {
      $q.notify({ type: "negative", message: res.msg, position: "top", timeout: 1000 })
    }
    clearing.value = ""
  }
</script>
