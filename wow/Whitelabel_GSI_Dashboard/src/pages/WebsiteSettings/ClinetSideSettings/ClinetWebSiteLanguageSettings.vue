<template>
  <div class="q-pt-md q-px-md">
    <div class="flex items-center gap-2 q-mb-sm">
      <h2 class="text-h5 text-weight-bold q-my-none">{{ t("menu.language_settings") }}</h2>
      <q-btn round dense flat size="sm" color="grey-7" icon="help" class="help-icon" />
      <span class="text-body2 text-grey-7">{{ t("website_settings.default_language_description") }}</span>
    </div>
  </div>
  <q-splitter v-model="splitterModel" horizontal separator-class="hidden">
    <template #after>
      <q-form class="w-full q-pl-md">
        <div class="language-panels-container flex flex-row flex-nowrap gap-6">
          <!-- 會員端語系設定 -->
          <div class="w-[480px] flex-shrink-0">
            <LanguageSettingsSection
              :title="t('website_settings.member_language_department')"
              :type="'member'"
              :all-languages="allLanguages"
              :can-edit="!!permission.edit"
            />
          </div>

          <!-- 代理端語系設定 -->
          <div class="w-[480px] flex-shrink-0">
            <LanguageSettingsSection
              :title="t('website_settings.agent_language')"
              :type="'agent'"
              :all-languages="allLanguages"
              :can-edit="!!permission.edit"
            />
          </div>
        </div>
      </q-form>
    </template>
  </q-splitter>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from "vue"
  import { useI18n } from "vue-i18n"
  import { usePermission } from "@/hook/usePermission"
  import { getLanSettingList } from "src/api/common"
  import LanguageSettingsSection from "./components/LanguageSettingsSection.vue"

  const { t } = useI18n()
  const { permission } = usePermission()
  const splitterModel = ref(100)

  interface Language {
    name: string
    code: string
  }

  interface LanguageItem {
    label: string
    value: string
  }

  // 所有可用語系列表（只包含基礎資訊，不包含啟用狀態）
  const allLanguages = ref<LanguageItem[]>([])

  // 初始化資料：只獲取全語系列表
  onMounted(async () => {
    try {
      const lan = await getLanSettingList()
      // 建立所有語系的基礎列表
      allLanguages.value = lan.data.map((item: Language) => ({
        label: item.name,
        value: item.code
      }))
    } catch (e: any) {
      console.error("Failed to load language list:", e)
    }
  })
</script>

<style scoped>
  .language-panels-container {
    flex-direction: row !important;
    flex-wrap: nowrap !important;
  }
</style>
